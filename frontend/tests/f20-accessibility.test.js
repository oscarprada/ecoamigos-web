import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import React, { act } from 'react';
import { transformWithOxc } from 'vite';
import { activateDialog } from '../src/utils/dialogFocus.js';
import { installDom } from './helpers/minimalDom.js';

const document = installDom();
const { createRoot } = await import('react-dom/client');
const src = file => fs.readFileSync(new URL('../src/' + file, import.meta.url), 'utf8');
async function compile(file, bindings) {
  let source = src(file).replace(/import[\s\S]*?from\s+['"][^'"]+['"];?/g, '');
  const name = source.match(/export default function (\w+)/)[1];
  source = source.replace('export default function', 'function');
  const { code } = await transformWithOxc(source, file, { jsx: { runtime: 'classic' } });
  const scope = { React, ...React, ...bindings };
  return new Function(...Object.keys(scope), code + '\nreturn ' + name)(...Object.values(scope));
}

function dialogFixture(count = 2) {
  const doc = { activeElement: null }, listeners = new Map();
  const items = Array.from({ length: count }, () => ({
    tabIndex: 0, matches: () => false, closest: () => null, getClientRects: () => [1],
    focus() { doc.activeElement = this; },
  }));
  const trigger = { isConnected: true, focus() { doc.activeElement = this; } };
  const dialog = { open: false, ownerDocument: doc, querySelectorAll: () => items,
    showModal() { this.open = true; }, close() { this.open = false; }, focus() { doc.activeElement = this; },
    addEventListener(k, fn) { listeners.set(k, fn); }, removeEventListener(k) { listeners.delete(k); } };
  let closes = 0;
  globalThis.getComputedStyle = () => ({ visibility: 'visible' });
  const cleanup = activateDialog(dialog, trigger, () => closes++);
  const key = (key, shiftKey = false) => {
    const e = { key, shiftKey, prevented: false, preventDefault() { this.prevented = true; }, stopPropagation() {} };
    listeners.get('keydown')?.(e); return e;
  };
  return { dialog, trigger, items, doc, cleanup, key, listeners, get closes() { return closes; } };
}
test('modal: foco inicial, Tab/Shift+Tab, Escape, restauración y cleanup', () => {
  const f = dialogFixture();
  assert.equal(f.dialog.open, true); assert.equal(f.doc.activeElement, f.items[0]);
  f.items[1].focus(); assert.equal(f.key('Tab').prevented, true); assert.equal(f.doc.activeElement, f.items[0]);
  f.key('Tab', true); assert.equal(f.doc.activeElement, f.items[1]);
  assert.equal(f.key('ArrowDown').prevented, false);
  f.key('Escape'); assert.equal(f.closes, 1);
  f.cleanup(); assert.equal(f.dialog.open, false); assert.equal(f.doc.activeElement, f.trigger);
  assert.equal(f.listeners.size, 0); f.key('Escape'); assert.equal(f.closes, 1);
});
test('modal: un control, ninguno y trigger desmontado', () => {
  for (const count of [0, 1]) {
    const f = dialogFixture(count);
    assert.equal(f.key('Tab').prevented, true); assert.equal(f.key('Tab', true).prevented, true);
    assert.equal(f.doc.activeElement, count ? f.items[0] : f.dialog);
    f.trigger.isConnected = false; assert.doesNotThrow(f.cleanup);
  }
});
test('modal excluye controles deshabilitados, ocultos y fuera de tabulación', () => {
  const f = dialogFixture(5);
  f.items[1].matches = () => true;
  f.items[2].getClientRects = () => [];
  f.items[3].tabIndex = -1;
  f.items[4].closest = () => ({});
  f.items[0].focus(); f.key('Tab'); assert.equal(f.doc.activeElement, f.items[0]);
  f.cleanup();
});

// ReactDOM executes actual menu state/effects. DOM layout and native focus are emulated.
test('menú móvil: ARIA, ocultación, Escape, enlaces, ruta, breakpoint y cleanup', async () => {
  const mediaListeners = new Set();
  const media = { matches: true, addEventListener: (_k, fn) => mediaListeners.add(fn), removeEventListener: (_k, fn) => mediaListeners.delete(fn) };
  window.matchMedia = () => media;
  const proto = Object.getPrototypeOf(document.createElement('div'));
  proto.focus = function () { document.activeElement = this; };
  proto.contains = function (node) { return this === node || this.childNodes.some(c => c.contains?.(node)); };
  proto.querySelector = function (name) { for (const c of this.childNodes) { if (c.tagName === name.toUpperCase()) return c; const found = c.querySelector?.(name); if (found) return found; } return null; };
  let button, nav, header, links = [], location = { key: 'one' };
  const jsx = { ...React, createElement(type, props, ...children) {
    if (props?.className === 'site-menuButton') button = props;
    if (type === 'nav') nav = props;
    if (props?.className === 'site-headerContent') header = props;
    return React.createElement(type, props, ...children);
  } };
  const Link = props => { links.push(props); return React.createElement('a', { href: props.to }, props.children); };
  const Layout = await compile('layouts/AppLayout.jsx', { React: jsx, Link, Outlet: () => null,
    useNavigate: () => () => {}, useLocation: () => location, useAuth: () => ({ user: { role: 'admin' }, logout() {} }), parquesLogo: 'fixture' });
  const root = createRoot(document.createElement('div'));
  const render = async () => { links = []; await act(async () => root.render(React.createElement(Layout))); };
  try {
    await render(); assert.equal(button['aria-expanded'], false); assert.equal(button['aria-controls'], nav.id);
    assert.equal(nav.hidden, true); assert.equal(nav.ref.current.childNodes.length, 0);
    await act(async () => button.onClick()); assert.equal(button['aria-expanded'], true); assert.equal(nav.hidden, false);
    assert.ok(nav.ref.current.querySelector('a')); assert.ok(links.some(l => l.to === '/admin'));
    await act(async () => header.onKeyDown({ key: 'Escape', preventDefault() {}, stopPropagation() {} }));
    assert.equal(nav.hidden, true); assert.equal(document.activeElement, button.ref.current);
    await act(async () => button.onClick()); await act(async () => links.find(l => l.to === '/admin').onClick());
    assert.equal(button['aria-expanded'], false);
    await act(async () => button.onClick()); location = { key: 'two' }; await render(); assert.equal(nav.hidden, true);
    button.ref.current.focus(); media.matches = false;
    await act(async () => mediaListeners.forEach(fn => fn()));
    assert.equal(nav.hidden, false); assert.equal(button['aria-expanded'], false);
    assert.equal(document.activeElement, nav.ref.current.querySelector('a'));
    media.matches = true; await act(async () => mediaListeners.forEach(fn => fn()));
    assert.equal(nav.hidden, true); assert.equal(document.activeElement, button.ref.current);
  } finally { await act(async () => root.unmount()); }
  assert.equal(mediaListeners.size, 0);
});

test('educación integra diálogo nativo, nombre accesible y trigger; CSS móvil conserva navegación', () => {
  const source = src('pages/public/EducationCategoryPage.jsx');
  assert.match(source, /<dialog ref=\{dialogRef\}/); assert.match(source, /aria-modal="true"/);
  assert.match(source, /aria-labelledby="education-dialog-title"/); assert.match(source, /id="education-dialog-title"/);
  assert.match(source, /triggerRef.current = e.currentTarget/); assert.match(source, /activateDialog\(dialogRef.current, triggerRef.current/);
  assert.match(source, /onCancel=/); assert.match(source, /maxHeight: '90vh'/); assert.match(source, /overflowY: 'auto'/);
  const css = src('styles/refinements.css');
  assert.match(css, /\.site-nav\[hidden\] \{ display: none;/);
  assert.match(css, /@media \(max-width: 768px\) \{\s*\.site-menuButton \{ display: inline-flex;/);
  assert.match(css, /\.education-dialog::backdrop/);
});
