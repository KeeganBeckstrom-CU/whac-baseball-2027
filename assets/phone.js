/* Phone view: a compact layout for small screens.
   On by default on screens 760px wide or less; the button at the bottom right switches it
   on or off, and the choice is remembered on that device. */
(function () {
  const KEY = 'whac-phone-view';
  const CSS = `
html.phone .st-asof{font-size:12px;padding:6px 10px}
html.phone .st-asof .st-note{display:none}
html.phone .md-teams{gap:6px;flex-wrap:wrap}
html.phone .md-band{display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;align-items:flex-start!important;gap:12px!important;padding:12px!important;cursor:pointer}
html.phone .md-logo{width:54px!important;height:auto!important;flex:0 0 54px;margin:0!important}
html.phone .md-bandtext{min-width:0;flex:1 1 auto!important;width:auto!important}
html.phone .md-eyebrow{display:none}
html.phone .md-title{font-size:20px!important;line-height:1.2!important;margin:0 0 4px!important}
html.phone .md-lede{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;font-size:14px!important;line-height:1.4!important;margin:0!important}
html.phone .md-band.st-open .md-lede{display:block;-webkit-line-clamp:unset}
html.phone .md-band:not(.st-open) .md-bandtext::after{content:'Tap to read more';display:block;font-size:12px;color:#FFD54A;margin-top:4px;font-weight:700}
html.phone .md-tabs{position:sticky;top:0;z-index:30;flex-wrap:nowrap!important;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;box-shadow:0 6px 12px rgba(0,0,0,.4)}
html.phone .md-tabs::-webkit-scrollbar{display:none}
html.phone .md-tab{white-space:nowrap;min-height:42px;font-size:14px!important;padding:10px 12px!important;flex:0 0 auto}
html.phone .md-card{padding:12px!important}
html.phone .md-grid,html.phone .md-pgrid,html.phone .md-cred{grid-template-columns:minmax(0,1fr)!important}
html.phone .md-plist{max-height:230px;overflow-y:auto;-webkit-overflow-scrolling:touch}
html.phone .md-plist>*{min-height:36px;display:flex;align-items:center}
html.phone .md-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch}
html.phone .md-table{font-size:12px}
html.phone .md-table th,html.phone .md-table td{padding:6px 7px!important;white-space:nowrap}
html.phone .md-table th:first-child,html.phone .md-table td:first-child{position:sticky;left:0;z-index:1;background:#0B2448;box-shadow:2px 0 4px rgba(0,0,0,.35)}
html.phone input,html.phone select{font-size:16px!important}
html.phone button,html.phone select{min-height:38px}
html.phone svg{max-width:100%;height:auto}
html.phone .pc-bio{grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important}
html.phone body{padding-bottom:70px}
#st-phone{position:fixed;right:12px;bottom:calc(12px + env(safe-area-inset-bottom));z-index:60;appearance:none;border:0;border-radius:999px;padding:10px 14px;background:#FFD54A;color:#0A1230;font:700 13px/1 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;box-shadow:0 4px 14px rgba(0,0,0,.45);cursor:pointer}
html:not(.phone) #st-phone{background:#0B2448;color:#FFD54A;border:1px solid #FFD54A}
@media print{#st-phone{display:none!important}}`;
  const st = document.createElement('style');
  st.textContent = CSS;
  document.head.appendChild(st);

  let saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  let on = saved ? saved === 'on' : window.matchMedia('(max-width:760px)').matches;

  const btn = document.createElement('button');
  btn.id = 'st-phone';
  btn.type = 'button';
  const apply = () => {
    document.documentElement.classList.toggle('phone', on);
    btn.textContent = on ? 'Full view' : 'Phone view';
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  };
  btn.addEventListener('click', () => {
    on = !on;
    try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch (e) {}
    apply();
  });
  document.body.appendChild(btn);
  apply();

  document.addEventListener('click', (ev) => {
    if (!on) return;
    const band = ev.target.closest && ev.target.closest('.md-band');
    if (band) { band.classList.toggle('st-open'); return; }
    if (ev.target.closest && ev.target.closest('.md-plist')) {
      setTimeout(() => {
        const card = document.getElementById('player-card');
        if (card && card.scrollIntoView) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 250);
    }
  });
})();
