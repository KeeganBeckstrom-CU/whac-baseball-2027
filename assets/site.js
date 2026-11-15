/* Website additions: data date and change log, links to single players, WHAC ranks on
   player cards, Cleary splits against left- and right-handers, printable team sheets.
   Runs after the page script and shares its scope (TEAMS, TM, rowsOf, draw, view...). */
(function () {
  const CSS = `
.st-asof{display:flex;flex-wrap:wrap;gap:6px 14px;align-items:center;padding:8px 12px;margin:0 0 4px;border-radius:8px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.10);font-size:13px;color:var(--m-text,#EEF2FA)}
.st-asof b{color:var(--m-hi,#FFD54A)}
.st-asof details{flex:1 1 100%}
.st-asof summary{cursor:pointer;color:var(--m-lab,#C9D4EE);font-weight:700}
.st-asof ul{margin:6px 0 2px;padding-left:18px;display:flex;flex-direction:column;gap:4px}
.st-asof li span{color:var(--m-muted,#AEB9D3);margin-right:6px}
.st-btn{appearance:none;cursor:pointer;padding:6px 12px;border-radius:6px;border:1px solid var(--m-line,rgba(255,255,255,.2));background:transparent;color:var(--m-lab,#C9D4EE);font-weight:700;font-size:13px;font-family:inherit}
.st-btn:hover{background:rgba(255,255,255,.08)}
.st-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:8px 0 2px}
.st-note{font-size:12px;color:var(--m-muted,#AEB9D3);margin:4px 0 0}
.st-rk td.r1{color:var(--m-hi,#FFD54A);font-weight:800}
.st-hand .md-table td:first-child{font-weight:700}
#st-print{display:none}
@media print{
 html.st-printing body>*:not(#st-print){display:none!important}
 html.st-printing #st-print{display:block!important;color:#111;background:#fff;font:11px/1.35 Georgia,serif;padding:0}
 #st-print h1{font-size:20px;margin:0 0 2px}#st-print h2{font-size:13px;margin:10px 0 4px;border-bottom:1.5px solid #333;padding-bottom:2px;text-transform:uppercase;letter-spacing:.05em}
 #st-print .sub{color:#444;margin:0 0 6px}
 #st-print table{border-collapse:collapse;width:100%;margin:0 0 4px;font-family:Helvetica,Arial,sans-serif;font-size:10px}
 #st-print th,#st-print td{border-bottom:1px solid #ccc;padding:2px 4px;text-align:left}
 #st-print th{background:#eee}
 #st-print .grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
 #st-print .tiles{display:flex;gap:14px;flex-wrap:wrap;margin:4px 0}
 #st-print .tiles div b{display:block;font-size:15px}
 #st-print .foot{margin-top:8px;color:#555;font-size:9px}
 @page{margin:12mm}
}`;
  const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
  const $ = (s, r = document) => r.querySelector(s);
  const el = (t, a = {}, ...kids) => { const e = document.createElement(t); for (const [k, v] of Object.entries(a)) { if (k === 'class') e.className = v; else if (k === 'text') e.textContent = v; else if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else if (v !== undefined && v !== null) e.setAttribute(k, v); } kids.flat().forEach((k) => { if (k !== null && k !== undefined && k !== false) e.append(k); }); return e; };
  const fmtDate = (s) => { const d = new Date(s + 'T12:00:00'); return isNaN(d) ? s : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); };
  const root = $('.md'); if (!root) return;

  /* ---------- 4. Data date and change log ---------- */
  const asof = el('div', { class: 'st-asof', 'data-draw': 'st_asof' });
  root.prepend(asof);
  draw('st_asof', (box) => {
    const S = rowsOf('site_status'), C = rowsOf('site_changes');
    if (!S || !C) { box.textContent = '—'; return; }
    const v = (k) => (S.find((r) => r.key === k) || {}).value || '';
    const onWhac = cur === 'whac';
    const team = onWhac ? null : TNAME();
    const list = C.filter((r) => onWhac || r.team === 'All' || r.team === team).slice().sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
    box.replaceChildren(
      el('span', {}, 'Data as of ', el('b', { text: fmtDate(v('asof')) })),
      el('span', { class: 'st-note', text: 'Checked for new rosters, schedules and staff ' + v('schedule') + '.' }),
      el('details', {}, el('summary', { text: 'What changed' + (team ? ' for ' + team : '') + ' (' + list.length + ')' }),
        list.length ? el('ul', {}, ...list.slice(0, 40).map((r) => el('li', {}, el('span', { text: fmtDate(r.date) + (onWhac && r.team !== 'All' ? ' · ' + r.team : '') }), r.text, r.url && r.url.startsWith('https://') ? el('a', { href: r.url, target: '_blank', rel: 'noopener', text: ' Source', class: 'md-link' }) : null)))
          : el('p', { class: 'st-note', text: 'No changes logged yet.' })));
  });

  /* ---------- 5a. Print a team sheet ---------- */
  const bar = $('.md-teams');
  if (bar) {
    bar.append(el('button', { class: 'st-btn', type: 'button', text: 'Print team sheet', onclick: () => printSheet() }));
  }
  const pick = (rows, k) => (rows || []).find((r) => r.key === k || r.id === k) || {};
  const tbl = (cols, rows) => el('table', {}, el('thead', {}, el('tr', {}, ...cols.map((c) => el('th', { text: c })))), el('tbody', {}, ...rows.map((r) => el('tr', {}, ...r.map((v) => el('td', { text: v === undefined || v === null || v === '' ? '—' : String(v) }))))));
  const printSheet = async () => {
    const need = ['team_totals', 'ui', 'league', 'watch', 'program_notes', 'site_status', 'hit_adv', 'pit_adv'];
    for (let i = 0; i < 50 && need.some((id) => !rowsOf(id)); i++) await new Promise((r) => setTimeout(r, 100));
    const T = TM(), tt = rowsOf('team_totals') || [], ui = rowsOf('ui') || [], lg = rowsOf('league') || [], H = hitFull() || [], P = pitFull() || [], W = rowsOf('watch') || [], N = rowsOf('program_notes') || [];
    const v = (k) => pick(tt, k).value, u = (k) => pick(ui, k).detail;
    const out = el('div', { id: 'st-print' });
    out.append(el('h1', { text: u('title') || (T.name + ' baseball') }), el('p', { class: 'sub', text: (u('eyebrow') || '') + ' · Data as of ' + fmtDate((pick(rowsOf('site_status'), 'asof')).value || '') }));
    out.append(el('div', { class: 'tiles' }, ...[['2026 record', v('record')], ['WHAC', v('conf')], ['Team OPS', v('ops')], ['Team ERA', v('era')], ['2025', v('prior')]].map(([a, b]) => el('div', {}, a, el('b', { text: b || '—' })))));
    const lead = N.find((r) => r.id === 'takeaway'); if (lead) out.append(el('p', { text: lead.detail }));
    const col = T.col, lp = T.lp;
    out.append(el('h2', { text: 'How ' + T.name + ' compares, 2026' }),
      tbl(['Stat', T.name, 'WHAC avg', 'WHAC rank'], lg.filter((r) => r.group !== 'Constant').map((r) => [r.metric, col ? r[col] : r.cleary, r.whac, col ? r[lp + '_whac'] : r.c_whac])));
    const g = el('div', { class: 'grid' });
    g.append(el('div', {}, el('h2', { text: 'Top returning hitters' }), tbl(['Player', 'Cl.', 'AB', 'AVG', 'OPS', 'HR', 'SB'], H.filter(isBack).sort((a, b) => b.ab - a.ab).slice(0, 10).map((x) => [x.player, x.cls, x.ab, x.avg, x.ops, x.hr, x.sb]))));
    g.append(el('div', {}, el('h2', { text: 'Top returning pitchers' }), tbl(['Player', 'Cl.', 'IP', 'ERA', 'K', 'BB', 'GS'], P.filter(isBack).sort((a, b) => b.ipn - a.ipn).slice(0, 10).map((x) => [x.player, x.cls, x.ip, x.era, x.so, x.bb, x.gs]))));
    out.append(g);
    out.append(el('h2', { text: 'Likely gone' }), el('p', { text: [...H.filter((x) => !isBack(x) && x.status !== 'Unknown' && x.ab >= 50).map((x) => x.player + ' (' + x.status + ')'), ...P.filter((x) => !isBack(x) && x.status !== 'Unknown' && x.ipn >= 15).map((x) => x.player + ' (P, ' + x.status + ')')].join('; ') || '—' }));
    const pos = N.filter((r) => r.section === 'outlook');
    if (pos.length) out.append(el('h2', { text: 'Position by position' }), tbl(['Spot', 'Outlook', 'What the 2026 numbers show'], pos.map((r) => [r.label, r.extra, r.detail])));
    out.append(el('h2', { text: 'Staff and 2027 tracker' }), el('p', { text: (u('coach_lead') || '') + ' ' + (v(T.coach) || '') + ' ' + (u('coach_span') || '') }), tbl(['Item', 'Status', 'Detail', 'Checked'], W.map((r) => [r.item, r.status, r.detail, r.checked])));
    out.append(el('p', { class: 'foot', text: 'From public box scores, rosters and team pages. Facts only; no predictions.' }));
    document.getElementById('st-print')?.remove();
    document.body.append(out);
    document.documentElement.classList.add('st-printing');
    const done = () => { document.documentElement.classList.remove('st-printing'); window.removeEventListener('afterprint', done); };
    window.addEventListener('afterprint', done);
    setTimeout(() => window.print(), 50);
  };

  /* ---------- 3 + 5b. Player card: WHAC ranks, link, and Cleary L/R splits ---------- */
  const ord = (n) => n + (n % 100 >= 11 && n % 100 <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] || 'th'));
  const games = () => { const m = {}; (rowsOf('w_standings') || []).forEach((r) => { m[r.team] = String(r.overall).split('-').reduce((a, b) => +a + +b, 0); }); return m; };
  const rankIn = (pool, me, f, dir) => { const vals = pool.map(f).filter((x) => x !== null && Number.isFinite(x)); const mine = f(me); if (mine === null || !Number.isFinite(mine)) return null; return { rk: 1 + vals.filter((x) => (dir > 0 ? x > mine : x < mine)).length, n: vals.length, tie: vals.filter((x) => Math.abs(x - mine) < 1e-9).length > 1 }; };
  const rankBlock = (n) => {
    const WP = rowsOf('w_players'); if (!WP) return null;
    const me = WP.find((r) => r.team === TNAME() && r.key === n); if (!me) return null;
    const G = games(); const box = el('div', { class: 'st-rk' });
    const pa = (r) => (r.b_ab || 0) + (r.b_bb || 0) + (r.b_hbp || 0) + (r.b_sf || 0) + (r.b_sh || 0);
    const obp = (r) => { const d = r.b_ab + r.b_bb + r.b_hbp + r.b_sf; return d ? (r.b_h + r.b_bb + r.b_hbp) / d : null; };
    const rows = [];
    if (me.b_ab) {
      const q = WP.filter((r) => r.b_ab && pa(r) >= 2.5 * (G[r.team] || 50));
      const qual = pa(me) >= 2.5 * (G[me.team] || 50);
      const rate = [['AVG', (r) => r.b_ab ? r.b_h / r.b_ab : null, 1, f3], ['OBP', obp, 1, f3], ['SLG', (r) => r.b_ab ? r.b_tb / r.b_ab : null, 1, f3], ['OPS', (r) => { const o = obp(r); return o === null || !r.b_ab ? null : o + r.b_tb / r.b_ab; }, 1, f3]];
      const cnt = [['Hits', (r) => r.b_h || 0], ['Home runs', (r) => r.b_hr || 0], ['RBI', (r) => r.b_rbi || 0], ['Runs', (r) => r.b_r || 0], ['Stolen bases', (r) => r.b_sb || 0], ['Walks', (r) => r.b_bb || 0]];
      rate.forEach(([l, f, d, fm]) => { const v = f(me); const k = qual ? rankIn(q, me, f, d) : null; rows.push([l, v === null ? '—' : fm(v), k ? (k.tie ? 'T-' : '') + ord(k.rk) + ' of ' + k.n : 'Not qualified']); });
      cnt.forEach(([l, f]) => { const k = rankIn(WP.filter((r) => r.b_ab), me, f, 1); rows.push([l, f(me), k ? (k.tie ? 'T-' : '') + ord(k.rk) + ' of ' + k.n : '—']); });
    }
    if (me.p_outs) {
      const q = WP.filter((r) => r.p_outs && r.p_outs / 3 >= (G[r.team] || 50));
      const qual = me.p_outs / 3 >= (G[me.team] || 50);
      const rate = [['ERA', (r) => r.p_outs ? 27 * r.p_er / r.p_outs : null, -1], ['WHIP', (r) => r.p_outs ? 3 * (r.p_h + r.p_bb) / r.p_outs : null, -1], ['K per 9', (r) => r.p_outs ? 27 * r.p_so / r.p_outs : null, 1]];
      const cnt = [['Strikeouts', (r) => r.p_so || 0], ['Innings', (r) => r.p_outs || 0], ['Wins', (r) => r.p_w || 0], ['Saves', (r) => r.p_sv || 0]];
      rate.forEach(([l, f, d]) => { const v = f(me); const k = qual ? rankIn(q, me, f, d) : null; rows.push([l, v === null ? '—' : v.toFixed(2), k ? (k.tie ? 'T-' : '') + ord(k.rk) + ' of ' + k.n : 'Not qualified']); });
      cnt.forEach(([l, f]) => { const k = rankIn(WP.filter((r) => r.p_outs), me, f, 1); const v = f(me); rows.push([l, l === 'Innings' ? Math.floor(v / 3) + '.' + (v % 3) : v, k ? (k.tie ? 'T-' : '') + ord(k.rk) + ' of ' + k.n : '—']); });
    }
    if (!rows.length) return null;
    box.append(el('div', { class: 'pc-sec', text: 'WHAC rank, 2026 (all 12 teams, all games)' }), miniTable(['Stat', '2026', 'WHAC rank'], rows),
      el('p', { class: 'st-note', text: 'Rate stats rank only players who qualify: 2.5 plate appearances or 1 inning per team game. Counting stats rank everyone with a line. T- marks a tie.' }));
    return box;
  };

  /* Cleary hitters vs LHP/RHP and pitchers vs LHH/RHH, from the matchup log and WHAC rosters */
  const handOf = () => { const m = {}; (rowsOf('w_hands') || []).forEach((r) => { m[r.team + '|' + r.name] = r; }); return m; };
  const line = (rs) => { const s = { pa: 0, ab: 0, h: 0, d2: 0, d3: 0, hr: 0, bb: 0, k: 0, hbp: 0 }; rs.forEach((r) => Object.keys(s).forEach((k) => { s[k] += r[k] || 0; })); const tb = s.h + s.d2 + 2 * s.d3 + 3 * s.hr; const od = s.ab + s.bb + s.hbp; return { ...s, avg: s.ab ? f3(s.h / s.ab) : '—', obp: od ? f3((s.h + s.bb + s.hbp) / od) : '—', slg: s.ab ? f3(tb / s.ab) : '—' }; };
  const handSplits = (side) => {
    const M = dash.data('c_matchups'); const HH = rowsOf('w_hands');
    if (M.status !== 'ok' || !HH) return null;
    const hm = handOf();
    const key = side === 'H' ? 'throws' : 'bats';
    const by = {};
    M.data.filter((r) => r.side === side).forEach((r) => {
      const h = hm[r.team + '|' + r.vs]; let k = h ? h[key] : '';
      if (k === 'B') k = 'S';
      const g = by[r.player] = by[r.player] || { L: [], R: [], S: [], U: [] };
      (g[k] || g.U).push(r);
    });
    return by;
  };
  const splitRows = (g, side) => {
    const labs = side === 'H' ? [['L', 'Vs left-handed pitchers'], ['R', 'Vs right-handed pitchers'], ['U', 'Hand not known']] : [['L', 'Vs left-handed hitters'], ['R', 'Vs right-handed hitters'], ['S', 'Vs switch hitters'], ['U', 'Hand not known']];
    return labs.filter(([k]) => g[k] && g[k].length).map(([k, l]) => { const s = line(g[k]); return [l, s.pa, s.ab, s.h, s.hr, s.bb, s.k, s.avg, s.obp, s.slg]; });
  };

  dash.after('pcard', (box) => {
    if (cur !== 'players') return;
    const n = view.player; if (!n) return;
    const head = box.querySelector('.pc-head'); if (!head) return;
    // link
    const link = location.href.split('#')[0] + '#' + pid('players') + '/' + encodeURIComponent(n);
    try { history.replaceState(null, '', '#' + pid('players') + '/' + encodeURIComponent(n)); } catch (e) {}
    const btn = el('button', { class: 'st-btn', type: 'button', text: 'Copy link to this player' });
    btn.addEventListener('click', async () => { try { await navigator.clipboard.writeText(link); btn.textContent = 'Link copied'; } catch (e) { prompt('Copy this link', link); } setTimeout(() => { btn.textContent = 'Copy link to this player'; }, 1800); });
    const bio = box.querySelector('.pc-bio');
    const row = el('div', { class: 'st-row' }, btn);
    (bio || head).after(row);
    const rk = rankBlock(n); if (rk) row.after(rk);
    if (TEAM === 'cleary') {
      const add = [];
      ['H', 'P'].forEach((side) => {
        const by = handSplits(side); if (!by || !by[n]) return;
        const rows = splitRows(by[n], side); if (!rows.length) return;
        add.push(el('div', { class: 'pc-sec', text: side === 'H' ? 'At the plate: against left and right' : 'On the mound: against left- and right-handed hitters' }),
          miniTable(['Split', 'PA', 'AB', 'H', 'HR', 'BB', 'K', 'AVG', 'OBP', 'SLG'], rows));
      });
      if (add.length) { const w = el('div', { class: 'st-hand' }, ...add, el('p', { class: 'st-note', text: 'Hands come from the 2026 rosters of the nine other 2027 WHAC teams. Non-conference opponents, Siena Heights and Lourdes are under "Hand not known". OBP here leaves out sacrifice flies.' })); (rk || row).after(w); }
    }
  });

  /* Cleary matchups tab: team-wide splits */
  const mu = document.getElementById('matchups');
  if (mu) {
    const card = el('div', { class: 'md-card', id: 'mu-hands' },
      el('h2', { class: 'md-h', text: 'Against left and right, 2026' }),
      el('p', { class: 'md-cap', text: "Every Cleary plate appearance in the matchup log, split by the other player's hand. Hands come from the 2026 rosters of the nine other 2027 WHAC teams, so most non-conference games fall under \"Hand not known\". OBP here leaves out sacrifice flies." }),
      el('div', { class: 'md-grid' },
        el('div', {}, el('h3', { class: 'md-h3', text: 'Cleary hitters' }), el('div', { class: 'md-scroll' }, el('table', { class: 'md-table', 'data-draw': 'st_hand_h' }))),
        el('div', {}, el('h3', { class: 'md-h3', text: 'Cleary pitchers' }), el('div', { class: 'md-scroll' }, el('table', { class: 'md-table', 'data-draw': 'st_hand_p' })))));
    const first = document.getElementById('mu-hitters');
    if (first) first.before(card); else mu.append(card);
    const handTable = (side) => (t) => {
      const by = handSplits(side); t.replaceChildren(); if (!by) return;
      const all = { L: [], R: [], S: [], U: [] }; Object.values(by).forEach((g) => Object.keys(all).forEach((k) => all[k].push(...g[k])));
      const head = t.createTHead().insertRow(); ['Split', 'PA', 'AB', 'H', 'HR', 'BB', 'K', 'AVG', 'OBP', 'SLG'].forEach((c) => head.append(el('th', { text: c })));
      const tb = t.createTBody(); splitRows(all, side).forEach((r) => { const tr = tb.insertRow(); r.forEach((v) => { const c = tr.insertCell(); c.textContent = String(v); }); });
    };
    draw('st_hand_h', handTable('H')); draw('st_hand_p', handTable('P'));
  }

  /* open a player from a link */
  if (window.__startPlayer) {
    const n = window.__startPlayer; window.__startPlayer = null;
    view.player = n; if (cur !== 'players') show('players');
    draw('plist'); draw('pcard');
  }
  dash._runAll();
})();
