/* Minimal stand-in for the dashboard engine the page was written for:
   dash.data, dash.calc, dash.draw, dash.setLink. Datasets are JSON files in data/. */
(function () {
  const DATA = {};      // id -> {status, data}
  const CALCS = {};     // id -> {inputs, fn, memo, keys}
  const DRAWS = {};     // name -> fn
  const AFTER = {};     // name -> [fn]
  let known = null;
  let pending = null;

  const schedule = () => {
    if (pending) return;
    pending = setTimeout(() => { pending = null; runAll(); }, 40);
  };

  const load = (id) => {
    if (DATA[id]) return;
    DATA[id] = { status: 'loading', data: [] };
    if (known && !known[id]) { DATA[id] = { status: 'missing', data: [] }; return; }
    fetch('data/' + encodeURIComponent(id) + '.json')
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then((j) => { DATA[id] = { status: 'ok', data: j }; schedule(); })
      .catch((e) => { DATA[id] = { status: 'missing', data: [], message: String(e) }; schedule(); });
  };

  const data = (id) => {
    const c = CALCS[id];
    if (c) {
      const ins = c.inputs.map((i) => data(i));
      if (ins.some((x) => x.status !== 'ok')) return { status: 'loading', data: null };
      const keys = ins.map((x) => x.data);
      if (!c.keys || c.keys.some((k, i) => k !== keys[i])) {
        try { c.memo = c.fn(...keys); } catch (e) { console.error('calc', id, e); c.memo = null; }
        c.keys = keys;
      }
      return { status: c.memo === null ? 'error' : 'ok', data: c.memo };
    }
    load(id);
    return DATA[id];
  };

  const isHidden = (el) => !!el.closest('[hidden]');
  const widths = new WeakMap();
  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver((ents) => {
    for (const e of ents) {
      const el = e.target; const w = Math.round(e.contentRect.width);
      const prev = widths.get(el);
      widths.set(el, w);
      if (prev !== undefined && prev !== w && el.dataset.draw) runOne(el.dataset.draw, el);
    }
  }) : null;

  const runOne = (name, el) => {
    const fn = DRAWS[name];
    if (!fn || isHidden(el)) return;
    try { fn(el); } catch (e) { console.error('draw', name, e); }
    (AFTER[name] || []).forEach((h) => { try { h(el); } catch (e) { console.error('after', name, e); } });
    if (ro && !el.__ro) { el.__ro = 1; ro.observe(el); }
  };
  const runName = (name) => {
    document.querySelectorAll('[data-draw="' + name + '"]').forEach((el) => runOne(name, el));
  };
  const runAll = () => { Object.keys(DRAWS).forEach(runName); };

  window.dash = {
    data,
    calc(id, spec) { CALCS[id] = { inputs: spec.inputs || [], fn: spec.fn }; },
    loader() {},
    draw(name, fn) {
      if (typeof fn === 'function') { DRAWS[name] = fn; schedule(); return; }
      if (fn && typeof fn === 'object' && fn.update) { DRAWS[name] = (el) => fn.update(el); schedule(); return; }
      runName(name);
    },
    after(name, fn) { (AFTER[name] = AFTER[name] || []).push(fn); },
    onData(fn) { try { fn(); } catch (e) {} },
    setLink(name) { try { history.replaceState(null, '', '#' + name); } catch (e) { location.hash = name; } },
    params() { return {}; }, setParams() {}, resetParams() {},
    refresh() {},
    colors: ['#223C81', '#E7131A', '#E8AA15', '#4F2E8B', '#14713A', '#F26722'],
    _runAll: runAll,
    _setKnown(k) { known = k; },
  };

  // Drawings under [hidden] wait; run them once they are shown.
  new MutationObserver((ms) => {
    if (ms.some((m) => m.type === 'attributes' && m.attributeName === 'hidden')) schedule();
  }).observe(document.documentElement, { subtree: true, attributes: true, attributeFilter: ['hidden'] });
})();
