import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import React, { act } from 'react';
import { transformWithOxc } from 'vite';
import { installDom } from './helpers/minimalDom.js';
import { uiError } from '../src/utils/uiError.js';

const document = installDom();
const { createRoot } = await import('react-dom/client');
const src = file => fs.readFileSync(new URL('../src/' + file, import.meta.url), 'utf8');
async function compile(source, exports, bindings) {
  source = source.replace(/import[\s\S]*?from\s+['"][^'"]+['"];?/g, '').replace(/export default /g, '').replace(/export /g, '');
  const { code } = await transformWithOxc(source, 'fixture.jsx', { jsx: { runtime: 'classic' } });
  const scope = { React, ...bindings };
  return new Function(...Object.keys(scope), code + '\nreturn {' + exports + '};')(...Object.values(scope));
}
async function fixture(version, fail = false) {
  const timers = [], identities = [], contexts = [];
  let queries = 0, dependencyQueries = 0;
  let source = src('context/ToastContext.jsx');
  if (version !== 'current') source = source.replace(/  const value = useMemo[^\n]+\n/, '').replace('value={value}', 'value={{ showToast }}');
  if (version === 'legacy') source = source.replace("useCallback((message, type = 'success') => {", "((message, type = 'success') => {").replace('  }, []);', '  });');
  const { ToastProvider, useToast } = await compile(source, 'ToastProvider, useToast', {
    ...React, setTimeout: (callback, delay) => { timers.push({ callback, delay }); return timers.length; },
  });
  const { LoadState } = await compile(src('components/LoadState.jsx'), 'LoadState', {});
  const api = { get: async url => {
    assert.equal(url, '/public/ranking'); queries++;
    if (fail) throw new Error('fixture failure');
    return { data: { currentPeriod: { id: 1, name: 'Período fixture' } } };
  } };
  const { RegisterRecyclingPage } = await compile(src('pages/leader/RegisterRecyclingPage.jsx'), 'RegisterRecyclingPage', { ...React, api, useToast, LoadState, uiError });
  function Probe({ periodKey }) {
    const context = useToast(); contexts.push(context); identities.push(context.showToast);
    // A real functional dependency, not added to the application's original effect.
    React.useEffect(() => { dependencyQueries++; }, [context.showToast, periodKey]);
    return null;
  }
  const container = document.createElement('div'); const root = createRoot(container);
  const children = key => React.createElement(React.Fragment, null,
    React.createElement(Probe, { periodKey: key }), React.createElement(RegisterRecyclingPage));
  let child = children('one');
  const render = async () => { await act(async () => { root.render(React.createElement(ToastProvider, null, child)); }); };
  await render();
  return {
    identities, contexts, timers, container, render,
    get queries() { return queries; }, get dependencyQueries() { return dependencyQueries; },
    show: async message => { await act(async () => { identities.at(-1)(message); }); },
    close: async () => { await act(async () => { timers.at(-1).callback(); }); },
    changeDependency: async () => { child = children('two'); await render(); },
    unmount: async () => { await act(async () => root.unmount()); },
  };
}

for (const version of ['legacy', 'f17', 'current']) test('ReactDOM real: consultas por avisos — ' + version, async t => {
  const f = await fixture(version);
  try {
    const counts = [f.queries];
    await f.show('Aviso uno'); counts.push(f.queries); assert.match(f.container.textContent, /Aviso uno/);
    await f.show('Aviso dos'); counts.push(f.queries); assert.match(f.container.textContent, /Aviso dos/);
    assert.doesNotMatch(f.container.textContent, /Aviso uno/);
    assert.ok(f.timers.every(timer => timer.delay === 3500));
    await f.close(); counts.push(f.queries); assert.doesNotMatch(f.container.textContent, /Aviso dos/);
    await f.render(); counts.push(f.queries);
    assert.deepEqual(counts, version === 'legacy' ? [1, 2, 3, 4, 5] : [1, 1, 1, 1, 1]);
    assert.equal(new Set(f.identities).size, version === 'legacy' ? 5 : 1);
    if (version === 'current') assert.equal(new Set(f.contexts).size, 1, 'Provider value also stays stable');
    if (version === 'f17') assert.equal(new Set(f.contexts).size, 5, 'F17 still recreates Provider value');
    const before = f.dependencyQueries;
    await f.changeDependency();
    assert.equal(f.dependencyQueries, before + 1, 'functional dependency still runs the effect');
    if (version !== 'legacy') assert.equal(f.queries, 1, 'original registration has no such functional dependency');
    t.diagnostic('GET /public/ranking: ' + counts.join(' → ') + '; context objects=' + new Set(f.contexts).size);
  } finally { await f.unmount(); }
});

test('error F17 al cargar período: aviso y error persistente sin bucle ni loading infinito', async () => {
  const f = await fixture('current', true);
  try {
    assert.equal(f.queries, 1);
    assert.match(f.container.textContent, /No fue posible cargar el periodo activo/);
    assert.match(f.container.textContent, /Reintentar/);
    assert.doesNotMatch(f.container.textContent, /Cargando|fixture failure/);
    await f.close(); await f.render(); assert.equal(f.queries, 1);
    assert.match(f.container.textContent, /No fue posible cargar el periodo activo/);
  } finally { await f.unmount(); }
});
