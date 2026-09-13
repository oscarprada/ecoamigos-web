import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToString } from 'react-dom/server';
import * as router from 'react-router-dom';
import { transformWithOxc } from 'vite';
import { uiError } from '../src/utils/uiError.js';

const root = fileURLToPath(new URL('../src/', import.meta.url));
// Compile actual source with the existing Vite JSX transformer. No new framework.
async function compile(file, bindings) {
  let source = fs.readFileSync(path.join(root, file), 'utf8');
  source = source.replace(/import[\s\S]*?from\s+['"][^'"]+['"];?/g, '');
  const name = source.match(/export default function (\w+)/)?.[1];
  source = source.replace('export default function', 'function');
  const { code } = await transformWithOxc(source, file, { jsx: { runtime: 'classic' } });
  const entries = Object.entries(bindings).filter(([key]) => key !== 'default' && /^[A-Za-z_$][\w$]*$/.test(key));
  return new Function(...entries.map(([key]) => key), code + '\nreturn ' + name)(...entries.map(([, value]) => value));
}
const LoadState = await compile('components/LoadState.jsx', { React });
const technical = { response: { status: 500, data: { message: 'SELECT secret FROM users; AxiosError stack' } } };
const settle = () => new Promise(resolve => setImmediate(resolve));
const event = { preventDefault() {} };

// Controlled hook lifecycle drives real page effects/handlers with rejected API promises.
// Routing below separately uses real React/React Router server rendering.
async function mount(file, api, props = {}, auth = {}) {
  const states = [], effects = [], toasts = [];
  let cursor = 0, mounted = false, tree, reloads = 0;
  const useState = initial => {
    const index = cursor++;
    if (!(index in states)) states[index] = typeof initial === 'function' ? initial() : initial;
    return [states[index], value => { states[index] = typeof value === 'function' ? value(states[index]) : value; }];
  };
  const bindings = {
    React, api, uiError, LoadState, useState,
    useEffect: fn => { if (!mounted) effects.push(fn); }, useMemo: fn => fn(),
    useToast: () => ({ showToast: (...args) => toasts.push(args) }),
    useAuth: () => ({ user: { role: 'admin', id: 1 }, login: async () => { throw technical; }, ...auth }),
    useNavigate: () => () => {}, useParams: () => ({ category: 'agua' }),
    useSearchParams: () => [new URLSearchParams('token=' + 'a'.repeat(64))],
    Link: p => React.createElement('a', { href: p.to }, p.children), getBackendUrl: x => x,
    window: { location: { reload: () => reloads++ }, scrollTo() {}, confirm: () => true, history: { replaceState() {} } },
  };
  const Component = await compile(file, bindings);
  const render = () => { cursor = 0; tree = Component(props); return tree; };
  const nodes = () => {
    const result = [];
    function walk(node) {
      if (Array.isArray(node)) return node.forEach(walk);
      if (!node || typeof node !== 'object') return;
      if (typeof node.type === 'function') return walk(node.type(node.props));
      result.push(node); walk(node.props?.children);
    }
    walk(tree); return result;
  };
  const text = () => {
    function words(node) {
      if (Array.isArray(node)) return node.map(words).join(' ');
      if (node === null || node === undefined || typeof node === 'boolean') return '';
      if (typeof node !== 'object') return String(node);
      return words(typeof node.type === 'function' ? node.type(node.props) : node.props?.children);
    }
    return words(tree);
  };
  render(); const initial = text(); mounted = true; effects.forEach(fn => fn());
  await settle(); await settle(); render();
  return { render, nodes, text, initial, toasts, states, get reloads() { return reloads; } };
}
const failed = { get: async () => { throw technical; }, post: async () => { throw technical; }, patch: async () => { throw technical; } };

for (const file of ['admin/AdminDashboard', 'admin/AdminContentPage', 'admin/AdminSettingsPage', 'admin/AdminReviewsPage', 'admin/AdminUsersPage', 'leader/LeaderDashboard', 'leader/RegisterRecyclingPage', 'public/RankingPage', 'public/EducationCategoryPage']) {
  test('HTTP fallido: carga termina, error persistente y reintento en ' + file, async () => {
    const page = await mount('pages/' + file + '.jsx', failed);
    assert.match(page.initial, /Cargando/);
    assert.match(page.text(), /No fue posible/);
    assert.doesNotMatch(page.text(), /Cargando|SELECT|AxiosError|sin registros|Aún no hay|No hay contenidos/);
    assert.ok(page.nodes().some(n => n.props?.role === 'alert'));
    const retry = page.nodes().find(n => n.type === 'button'); assert.ok(retry);
    await retry.props.onClick(); await settle(); page.render();
    assert.ok(page.reloads === 1 || /No fue posible/.test(page.text()));
  });
}

test('ranking exitoso vacío se distingue de HTTP fallido', async () => {
  const page = await mount('pages/public/RankingPage.jsx', { get: async () => ({ data: { ranking: [], currentPeriod: null } }) });
  assert.match(page.text(), /Aún no hay registros/); assert.doesNotMatch(page.text(), /No fue posible|Cargando/);
});

test('loading a éxito muestra ranking real sin cambiar puntos', async () => {
  const page = await mount('pages/public/RankingPage.jsx', { get: async () => ({ data: {
    currentPeriod: { name: 'Período probado' },
    ranking: [{ id: 1, name: 'Equipo probado', position: 1, total_points: '25' }],
  } }) });
  assert.match(page.initial, /Cargando/);
  assert.match(page.text(), /Equipo probado/); assert.match(page.text(), /25/);
  assert.doesNotMatch(page.text(), /No fue posible|Aún no hay|Cargando/);
});

test('reintento de usuarios recupera la pantalla tras fallo sin bucle', async () => {
  let failing = true, calls = 0;
  const page = await mount('pages/admin/AdminUsersPage.jsx', { get: async url => {
    calls++; if (failing) throw technical;
    return { data: url.endsWith('/users') ? [{ id: 1, name: 'Cuenta recuperada', email: 'test@example.invalid', role: 'admin', is_active: true }] : [] };
  } });
  assert.match(page.text(), /No fue posible/); assert.equal(calls, 2);
  failing = false;
  const promise = page.nodes().find(n => n.type === 'button').props.onClick();
  page.render(); assert.match(page.text(), /Cargando/);
  await promise; page.render();
  assert.match(page.text(), /Cuenta recuperada/); assert.doesNotMatch(page.text(), /No fue posible|Cargando/);
  assert.equal(calls, 4); await settle(); assert.equal(calls, 4);
});

test('contenido y educación vacíos exitosos mantienen su mensaje normal', async () => {
  for (const file of ['admin/AdminContentPage', 'public/EducationCategoryPage']) {
    const page = await mount('pages/' + file + '.jsx', { get: async () => ({ data: [] }) });
    assert.match(page.text(), /No hay contenidos|Aún no hay contenido/);
    assert.doesNotMatch(page.text(), /No fue posible|Cargando/);
  }
  assert.equal(LoadState({ loading: false, error: '' }), null);
});

test('POST período fallido conserva formulario, termina busy y no muestra éxito', async () => {
  const page = await mount('pages/admin/AdminSettingsPage.jsx', { ...failed, get: async () => ({ data: [] }) });
  const forms = page.nodes().filter(n => n.type === 'form');
  await forms[1].props.onSubmit(event); page.render();
  assert.match(page.text(), /No fue posible crear el período/); assert.doesNotMatch(page.text(), /creado correctamente|SELECT/);
  assert.equal(page.nodes().filter(n => n.type === 'button').some(n => n.props.disabled), false);
});

test('PATCH fallido conserva edición y listado; mensaje funcional 409 visible', async () => {
  const page = await mount('pages/admin/AdminSettingsPage.jsx', {
    get: async url => ({ data: url.endsWith('/teams') ? [{ id: 1, name: 'Original', dependency: 'Área' }] : [] }),
    patch: async () => { throw { response: { status: 409, data: { message: 'El nombre del equipo ya existe' } } }; },
  });
  page.nodes().find(n => n.type === 'button' && n.props.children === 'Editar').props.onClick(); page.render();
  const input = page.nodes().find(n => n.type === 'input' && n.props.value === 'Original');
  input.props.onChange({ target: { value: 'Nuevo' } }); page.render();
  await page.nodes().find(n => n.type === 'form').props.onSubmit(event); page.render();
  assert.match(page.text(), /El nombre del equipo ya existe/); assert.match(page.text(), /Original/);
  assert.ok(page.nodes().some(n => n.type === 'input' && n.props.value === 'Nuevo'));
  assert.doesNotMatch(page.text(), /guardado correctamente/);
});

test('mensajes no auditados, SQL y fallos 500 nunca se muestran', () => {
  assert.equal(uiError(technical, 'Controlado'), 'Controlado');
  assert.equal(uiError({ response: { status: 400, data: { message: 'SELECT password_hash' } } }, 'Controlado'), 'Controlado');
  assert.equal(uiError({ response: { status: 409, data: { message: 'El email ya existe' } } }), 'El email ya existe');
});

test('login fallido: mensaje controlado y botón habilitado', async () => {
  const page = await mount('pages/auth/LoginPage.jsx', failed);
  await page.nodes().find(n => n.type === 'form').props.onSubmit(event); page.render();
  assert.match(page.text(), /No fue posible iniciar sesión/); assert.doesNotMatch(page.text(), /SELECT/);
  assert.equal(page.nodes().find(n => n.type === 'button').props.disabled, false);
});
for (const reset of [false, true]) test('recuperación conserva manejo seguro: reset=' + reset, async () => {
  const page = await mount('pages/auth/PasswordRecoveryPage.jsx', failed, { reset });
  await page.nodes().find(n => n.type === 'form').props.onSubmit(event); page.render();
  assert.match(page.text(), reset ? /No fue posible restablecer/ : /Si existe una cuenta asociada/);
  assert.doesNotMatch(page.text(), /SELECT|AxiosError/); assert.equal(page.nodes().find(n => n.type === 'button').props.disabled, false);
});

const NotFoundPage = await compile('pages/public/NotFoundPage.jsx', { React, Link: router.Link });
const ProtectedRoute = await compile('components/ProtectedRoute.jsx', { React, ...router, useAuth: () => ({ loading: false, user: { role: 'admin' } }) });
async function renderPath(url) {
  const bindings = { React, ...router, NotFoundPage, ProtectedRoute,
    BrowserRouter: p => React.createElement(router.MemoryRouter, { initialEntries: [url] }, p.children),
    AuthProvider: p => p.children, AppLayout: router.Outlet };
  for (const name of ['HomePage', 'RankingPage', 'EducationCategoryPage', 'LoginPage', 'PasswordRecoveryPage', 'LeaderDashboard', 'RegisterRecyclingPage', 'AdminDashboard', 'AdminReviewsPage', 'AdminUsersPage', 'AdminContentPage', 'AdminSettingsPage']) bindings[name] = () => React.createElement('p', null, name);
  const App = await compile('App.jsx', bindings);
  return renderToString(React.createElement(App));
}
for (const url of ['/missing', '/admin/missing', '/leader/missing', '/winners', '/prizes']) test('router real: ' + url + ' → 404 y enlace inicio', async () => {
  const html = await renderPath(url); assert.match(html, /404/); assert.match(html, /href="\/"/);
});
test('router real mantiene rutas válidas públicas/admin/recuperación', async () => {
  for (const url of ['/', '/ranking', '/admin', '/admin/users', '/login', '/forgot-password', '/reset-password']) assert.doesNotMatch(await renderPath(url), /404/);
});
test('ProtectedRoute conserva login, falta de permiso y loading', async () => {
  for (const [auth, expected] of [[{ user: null, loading: false }, '/login'], [{ user: { role: 'leader' }, loading: false }, '/']]) {
    const Guard = await compile('components/ProtectedRoute.jsx', { React, ...router, useAuth: () => auth });
    const result = Guard({ roles: ['admin'] }); assert.equal(result.type, router.Navigate); assert.equal(result.props.to, expected);
  }
  const Guard = await compile('components/ProtectedRoute.jsx', { React, ...router, useAuth: () => ({ loading: true }) });
  assert.match(renderToString(Guard({ roles: ['admin'] })), /Cargando/);
});
