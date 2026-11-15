/* WHAC landing v20: sortable tables, All-WHAC field, bracket, search, compare, leader filters,
   2027 calendar, 2027 tracker, runs vs wins, close games, returning vs leaving. Loaded after the main script. */
(function(){
const CSS=`
#whac .md-card{scroll-margin-top:96px}
#whac th.ws{cursor:pointer;user-select:none;white-space:nowrap}
#whac th.ws:after{content:' \\2195';opacity:.45;font-size:.8em}
#whac th.ws[aria-sort=ascending]:after{content:' \\25B2';opacity:1}
#whac th.ws[aria-sort=descending]:after{content:' \\25BC';opacity:1}
.w2-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.w2-sel{font-family:var(--serif);font-weight:700;padding:5px 8px;border:1px solid #223C81;border-bottom:3px solid #223C81;background:#fff;color:#16285A;font-size:var(--cds-font-size-body)}
.w2-chk{display:flex;gap:5px;align-items:center;font-size:var(--cds-font-size-caption);color:#16285A;font-weight:700}
.w2-logo{display:inline-flex;align-items:center;justify-content:center;background:#fff;border-radius:3px;padding:1px 2px;flex:none}
.w2-logo img{display:block;height:18px;width:auto;max-width:30px}
.md-table td .w2-logo{vertical-align:middle;margin-right:3px}
/* field */
.w2-fieldwrap{overflow-x:auto}
.w2-field{position:relative;min-width:680px;aspect-ratio:900/640;max-width:980px;margin:0 auto}
.w2-field svg{position:absolute;inset:0;width:100%;height:100%}
.w2-slot{position:absolute;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;gap:3px;z-index:2}
.w2-pos{font-family:var(--serif);font-weight:700;font-size:11px;letter-spacing:.06em;color:#fff;background:rgba(10,20,50,.72);padding:0 6px;border-radius:2px}
.w2-pl{display:flex;align-items:center;gap:0;border-radius:4px;box-shadow:0 2px 5px rgba(0,0,0,.35);cursor:pointer;overflow:hidden;border:1px solid rgba(255,255,255,.9);background:#fff;max-width:200px}
.w2-pl .w2-logo{border-radius:0;padding:2px 3px}
.w2-pl b{color:#fff;font-family:var(--serif);font-size:13px;padding:3px 8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.w2-pl:hover{outline:2px solid #E7131A}
.w2-pl.nolink{cursor:default}
.w2-dug{position:absolute;transform:translate(-50%,-50%);background:rgba(22,40,90,.88);border:2px solid #E7131A;padding:6px 8px;display:flex;flex-direction:column;gap:5px;align-items:center;z-index:2}
.w2-dug .w2-pos{background:transparent;padding:0}
.w2-tip{margin:4px 0 0;font-size:var(--cds-font-size-caption);color:#55607A;min-height:1.4em}
/* bracket */
.w2-br{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(200px,1fr);gap:22px;overflow-x:auto;padding:6px 2px 10px}
.w2-col{display:flex;flex-direction:column;gap:8px;position:relative}
.w2-games{display:flex;flex-direction:column;justify-content:space-around;gap:14px;flex:1}
.w2-colh{font-family:var(--serif);font-weight:700;font-size:var(--cds-font-size-caption);color:#16285A;text-transform:uppercase;letter-spacing:.06em;border-bottom:2px solid #E7131A;padding-bottom:3px}
.w2-m{background:#fff;border:1px solid #C9D1E4;box-shadow:0 1px 2px rgba(0,0,0,.08);position:relative}
.w2-col:not(:last-child) .w2-m:after{content:'';position:absolute;right:-23px;top:50%;width:22px;border-top:2px solid #8FA0CC}
.w2-mh{display:flex;justify-content:space-between;font-size:11px;color:#55607A;background:#EEF1F8;padding:2px 6px}
.w2-t{display:grid;grid-template-columns:22px auto 1fr auto;gap:6px;align-items:center;padding:4px 6px;border-left:4px solid transparent;font-size:var(--cds-font-size-body)}
.w2-t + .w2-t{border-top:1px solid #E3E7F0}
.w2-t .sd{font-size:11px;color:#55607A;text-align:right}
.w2-t .nm{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.w2-t .sc{font-variant-numeric:tabular-nums;font-weight:700;min-width:1.4em;text-align:right}
.w2-t.win .nm{font-weight:700}
.w2-t.lose{color:#6B7488}
.w2-t .out{font-size:10px;font-weight:700;color:#fff;background:#E7131A;padding:0 4px;margin-left:5px;border-radius:2px}
.w2-champ{border:2px solid #E7131A}
.w2-champtag{font-family:var(--serif);font-weight:700;color:#E7131A;font-size:var(--cds-font-size-caption);text-align:center}
.w2-brh{font-family:var(--serif);font-weight:700;color:#223C81;margin:10px 0 0}
.w2-naia{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,19rem),1fr));gap:10px}
.w2-nc{border:1px solid #C9D1E4;border-top:4px solid #223C81;background:#fff;padding:8px}
.w2-nc h4{margin:0 0 6px;display:flex;align-items:center;gap:6px;font-family:var(--serif);color:#16285A}
.w2-ng{display:grid;grid-template-columns:3.4rem 1fr auto;gap:6px;padding:3px 0;border-bottom:1px dotted #E3E7F0;font-size:var(--cds-font-size-body)}
.w2-ng .r{font-weight:700}.w2-ng .r.W{color:#14713A}.w2-ng .r.L{color:#B3261E}
/* search */
.w2-search{position:relative;max-width:30rem;width:100%}
.w2-search input{width:100%;box-sizing:border-box;padding:8px 10px;font-size:var(--cds-font-size-body);border:2px solid #fff;background:#fff;color:#16285A;font-family:inherit}
.w2-res{position:absolute;left:0;right:0;top:100%;background:#fff;border:1px solid #223C81;z-index:20;max-height:22rem;overflow:auto;box-shadow:0 6px 16px rgba(0,0,0,.25)}
.w2-res button{display:flex;gap:8px;align-items:center;width:100%;text-align:left;background:#fff;border:0;border-bottom:1px solid #E3E7F0;padding:6px 8px;cursor:pointer;font-family:inherit;font-size:var(--cds-font-size-body);color:#1A2340}
.w2-res button:hover,.w2-res button:focus{background:#EEF1F8}
.w2-res small{color:#55607A;margin-left:auto;font-size:var(--cds-font-size-caption);text-align:right}
/* compare */
.w2-cmp td.best{font-weight:700;background:#EEF1F8}
/* charts */
.w2-chart svg{width:100%;max-width:920px;height:auto;display:block;margin:0 auto}
.w2-chart text{font-family:inherit}
/* tracker */
.md-table td.w2-st{font-weight:700;white-space:nowrap}
.w2-st.good{color:#14713A}.w2-st.warn{color:#8A5D00}.w2-st.bad{color:#B3261E}.w2-st.mute{color:#6B7488;font-weight:400}
.md-table td.w2-cal{font-size:var(--cds-font-size-caption);white-space:nowrap}
.md-table td.w2-cal.hl{background:#FBD3D4}
.md-table th.hl{background:#E7131A!important}
`;
const st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const el=(t,a={},...kids)=>{const e=document.createElement(t);for(const [k,v] of Object.entries(a)){if(k==='class')e.className=v;else if(k==='text')e.textContent=v;else if(k.startsWith('on'))e.addEventListener(k.slice(2),v);else if(v!==undefined&&v!==null)e.setAttribute(k,v);}kids.flat().forEach((k)=>{if(k!==null&&k!==undefined)e.append(k);});return e;};
const W=document.getElementById('whac');if(!W)return;
const card=(id,title,capId,...body)=>el('div',{class:'md-card',id},el('h2',{class:'md-h',text:title}),capId?el('p',{class:'md-cap','data-draw':'wn','data-src':'w_notes','data-id':capId,text:'—'}):null,...body);
const info=()=>{const m={};(rowsOf('w_teaminfo')||[]).forEach((r)=>{m[r.team]=r;});return m;};
const logos=()=>{const m={};(rowsOf('w_logos')||[]).forEach((r)=>{m[r.id]=r.src;});return m;};
const logoEl=(team)=>{const I=info()[team];const L=logos();const s=I&&L[I.logo];return el('span',{class:'w2-logo'},s?el('img',{src:s,alt:''}):null);};
const AB=(n)=>(info()[n]||{}).abbr||n;
const openCard=(tid,key)=>{if(!tid||!TEAMS.some((x)=>x.id===tid))return false;setTeam(tid,key?'players':'overview');if(key){view.player=key;draw('plist');draw('pcard');}dash.setLink(pid(key?'players':'overview'));const top=document.querySelector(key?'#players':'.md-teams');if(top&&top.scrollIntoView)top.scrollIntoView();return true;};

/* ---------- DOM: header search, nav, new sections ---------- */
const band=$('.md-wbandtext',W);
if(band&&!$('.w2-search',band)){const box=el('div',{class:'w2-search'},el('input',{type:'search',id:'w2q',placeholder:'Search any 2026 WHAC player or team','aria-label':'Search players and teams',autocomplete:'off'}),el('div',{class:'w2-res',id:'w2res',hidden:''}));band.append(box);}
const NAV=[['w-teams','Team pages'],['w-stand','Standings'],['w-leaders','Leaders'],['w-field','All-WHAC'],['w-post','Postseason'],['w-h2h','Head to head'],['w-cmp','Team stats'],['w-vs','Compare'],['w-pyth','Runs and wins'],['w-close','Close games'],['w-hon','Awards'],['w-caps','2027 teams'],['w-retbar','Returning'],['w-ret','Returners'],['w-cal','2027 calendar'],['w-watch','2027 tracker'],['w-meth','Notes']];
const nav=$('.md-wnav',W);
if(nav){nav.replaceChildren(...NAV.map(([id,t])=>el('button',{type:'button','data-wgo':id,text:t,onclick:()=>{const x=document.getElementById(id);if(x&&x.scrollIntoView)x.scrollIntoView({behavior:'smooth',block:'start'});}})));}
const after=(refId,node)=>{const r=document.getElementById(refId);if(r&&!document.getElementById(node.id))r.after(node);};
// leaders: replace controls with filters, new draw name
const LC=document.getElementById('w-leaders');
if(LC){const old=$('.md-wchips',LC);const lead=$('[data-draw=w_leads]',LC);if(lead){lead.dataset.draw='w2_leads';lead.dataset.src='w_players w_standings w_teaminfo';}
 const f=el('div',{class:'w2-row'},
  el('select',{class:'w2-sel',id:'w2scope','aria-label':'Games'},el('option',{value:'all',text:'All games'}),el('option',{value:'conf',text:'WHAC games'})),
  el('select',{class:'w2-sel',id:'w2grp','aria-label':'Group'},el('option',{value:'bat',text:'Hitting'}),el('option',{value:'pit',text:'Pitching'})),
  el('select',{class:'w2-sel',id:'w2n','aria-label':'How many'},el('option',{value:'5',text:'Top 5'}),el('option',{value:'10',text:'Top 10'})),
  el('select',{class:'w2-sel',id:'w2lt','aria-label':'Team','data-draw':'w2_ltsel','data-src':'w_teaminfo'}),
  el('select',{class:'w2-sel',id:'w2lc','aria-label':'Class','data-draw':'w2_lcsel','data-src':'w_players'}),
  el('label',{class:'w2-chk'},el('input',{type:'checkbox',id:'w2back'}),'Can return in 2027 only'));
 if(old)old.replaceWith(f);else LC.insertBefore(f,lead);
 LC.append(el('p',{class:'md-cap','data-draw':'wn','data-src':'w_notes','data-id':'wins_note',text:'—'}));}
// field after leaders
after('w-leaders',card('w-field','2026 All-WHAC teams','field_cap',
  el('div',{class:'w2-row'},el('button',{class:'md-wchip on',type:'button','data-wf':'First team',text:'First team'}),el('button',{class:'md-wchip',type:'button','data-wf':'Second team',text:'Second team'})),
  el('div',{class:'w2-fieldwrap'},el('div',{class:'w2-field',id:'w2field','data-draw':'w2_field','data-src':'w_field w_logos w_teaminfo'})),
  el('p',{class:'w2-tip',id:'w2tip'})));
// postseason: bracket replaces tables
const PC=document.getElementById('w-post');
if(PC&&!$('#w2br',PC)){const g=$('.md-grid',PC);const nb=el('div',{},el('h3',{class:'w2-brh',text:'2026 WHAC Tournament'}),el('p',{class:'md-cap','data-draw':'wn','data-src':'w_notes','data-id':'bracket_cap',text:'—'}),el('div',{id:'w2br','data-draw':'w2_bracket','data-src':'w_bracket w_logos w_teaminfo'}),
  el('h3',{class:'w2-brh',text:'NAIA Opening Round'}),el('p',{class:'md-cap','data-draw':'wn','data-src':'w_notes','data-id':'naia_cap',text:'—'}),el('div',{class:'w2-naia','data-draw':'w2_naia','data-src':'w_naia w_logos w_teaminfo'}));
 if(g)g.replaceWith(nb);else PC.append(nb);}
// compare after team stats
after('w-cmp',card('w-vs','Compare two teams','cmp2_cap',el('div',{class:'w2-row'},el('select',{class:'w2-sel',id:'w2a','aria-label':'First team','data-draw':'w2_vssel','data-src':'w_compare'}),el('span',{text:'vs'}),el('select',{class:'w2-sel',id:'w2b','aria-label':'Second team','data-draw':'w2_vssel','data-src':'w_compare'})),
  el('div',{class:'md-scroll'},el('table',{class:'md-table w2-cmp','data-draw':'w2_vs','data-src':'w_compare w_compare_cols w_standings w_h2h w_h2h_cols w_retbar w_teaminfo w_logos'}))));
after('w-vs',card('w-pyth','Runs and wins, 2026','pyth_cap',el('div',{class:'w2-chart','data-draw':'w2_pyth','data-src':'w_pyth w_teaminfo w_logos'}),
  el('div',{class:'md-scroll'},el('table',{class:'md-table'},el('thead',{},el('tr',{},...['Team','G','W-L','Runs','Allowed','Diff','Per game','Expected W','Gap'].map((t)=>el('th',{text:t})))),el('tbody',{'data-draw':'w2_pytht','data-src':'w_pyth w_teaminfo w_logos'})))));
after('w-pyth',card('w-close','Close games and blowouts, 2026','close_cap',el('div',{class:'w2-chart','data-draw':'w2_closec','data-src':'w_close w_teaminfo w_logos'}),
  el('div',{class:'md-scroll'},el('table',{class:'md-table'},el('thead',{},el('tr',{},...['Team','One-run games','Decided by 5+','Shutouts thrown','Shut out','Comeback wins'].map((t)=>el('th',{text:t})))),el('tbody',{'data-draw':'w2_closet','data-src':'w_close w_teaminfo w_logos'})))));
// honors table: awards only
const HC=document.getElementById('w-hon');if(HC){const h=$('h2',HC);if(h)h.textContent='2026 WHAC awards, Gold Glove and academic honors';const tb=$('[data-draw=w_hon]',HC);if(tb)tb.dataset.draw='w2_hon';tb.dataset.src='w_honors w_teaminfo w_logos';}
// returning chart before returners
const RC=document.getElementById('w-ret');if(RC&&!document.getElementById('w-retbar'))RC.before(card('w-retbar','2026 playing time that can return','retbar_cap',el('div',{class:'w2-chart','data-draw':'w2_retbar','data-src':'w_retbar w_teaminfo w_logos'})));
// calendar and tracker after series
after('w-ser',card('w-cal','2027 WHAC calendar','cal_cap',el('div',{class:'w2-row'},el('span',{class:'md-cap',text:'Highlight'}),el('select',{class:'w2-sel',id:'w2calt','aria-label':'Highlight a team','data-draw':'w2_calsel','data-src':'w_cal_cols'})),
  el('div',{class:'md-scroll'},el('table',{class:'md-table','data-draw':'w2_cal','data-src':'w_cal w_cal_cols'}))));
after('w-cal',card('w-watch','2027 tracker','watch_cap',el('div',{class:'md-scroll'},el('table',{class:'md-table'},el('thead',{},el('tr',{},...['Team','2027 roster','2027 schedule','Coaching staff','Commits'].map((t)=>el('th',{text:t})))),el('tbody',{'data-draw':'w2_watch','data-src':'w_watch w_teaminfo w_logos'})))));
// move calendar + tracker next to series in nav order already; move compare etc fine.

/* ---------- helpers ---------- */
const td=(tr,v,cls,sv)=>{const c=document.createElement('td');c.textContent=v===undefined||v===null||v===''?'—':String(v);if(cls)c.className=cls;if(sv!==undefined)c.dataset.v=sv;tr.append(c);return c;};
const teamTd=(tr,n)=>{const c=wTeam(tr,n);c.prepend(logoEl(n),' ');c.dataset.v=n;return c;};
const fill2=(tb,rows,f)=>{tb.replaceChildren(...(rows||[]).map((r)=>{const tr=document.createElement('tr');f(tr,r);return tr;}));wResort(tb.closest('table'));};
const pctOf=(s)=>{const m=/^(\d+)-(\d+)$/.exec(s);return m?(+m[1]+ +m[2]?+m[1]/(+m[1]+ +m[2]):0):null;};

/* ---------- sortable tables ---------- */
const SORT=new Map();
const keyOf=(t)=>{const c=t.closest('.md-card,section');const all=c?[...c.querySelectorAll('table')].indexOf(t):0;return (c&&c.id||'x')+':'+all;};
const val=(c)=>{if(!c)return null;const wr=c.querySelector&&c.querySelector('.wr');const s=(c.dataset.v!==undefined?c.dataset.v:wr?c.textContent.slice(0,c.textContent.length-wr.textContent.length):c.textContent).trim();if(s===''||s==='—')return null;const p=pctOf(s);if(p!==null)return p;const n=parseFloat(s.replace(/[%,+]/g,'').replace(/^T/,''));if(!isNaN(n)&&/^[T+-]?[\d.]/.test(s.replace(/^#/,'')))return n;return s.toLowerCase();};
function wResort(t){if(!t||!t.tBodies[0]||t.classList.contains('w2-cmp'))return;const k=keyOf(t);const s=SORT.get(k);markTh(t,s);if(!s)return;const tb=t.tBodies[0];const rows=[...tb.rows];rows.sort((a,b)=>{const x=val(a.cells[s.i]),y=val(b.cells[s.i]);if(x===null&&y===null)return 0;if(x===null)return 1;if(y===null)return -1;const r=typeof x==='number'&&typeof y==='number'?x-y:String(x).localeCompare(String(y));return s.d*r;});rows.forEach((r)=>tb.append(r));}
window.wResort=wResort;
function markTh(t){if(t.classList.contains('w2-cmp'))return;const s=SORT.get(keyOf(t));const hr=t.tHead&&t.tHead.rows[t.tHead.rows.length-1];if(!hr)return;[...hr.cells].forEach((h,i)=>{h.classList.add('ws');h.tabIndex=0;h.setAttribute('aria-sort',s&&s.i===i?(s.d>0?'ascending':'descending'):'none');});}
const sortClick=(h)=>{const t=h.closest('table');if(!t||!t.tBodies[0]||t.classList.contains('w2-cmp'))return;const i=[...h.parentNode.cells].indexOf(h);const k=keyOf(t);const s=SORT.get(k);const first=val(t.tBodies[0].rows[0]&&t.tBodies[0].rows[0].cells[i]);const def=typeof first==='number'?-1:1;SORT.set(k,{i,d:s&&s.i===i?-s.d:def});wResort(t);};
W.addEventListener('click',(e)=>{const h=e.target.closest&&e.target.closest('thead th');if(h&&W.contains(h))sortClick(h);});
W.addEventListener('keydown',(e)=>{const h=e.target.closest&&e.target.closest('thead th');if(h&&(e.key==='Enter'||e.key===' ')){e.preventDefault();sortClick(h);}});
// re-apply sort whenever an existing table body is redrawn
const mo=new MutationObserver((ms)=>{const ts=new Set();ms.forEach((m)=>{const t=m.target.closest&&m.target.closest('table');if(t)ts.add(t);});ts.forEach((t)=>{if(t._wsBusy)return;t._wsBusy=true;try{wResort(t);}finally{setTimeout(()=>{t._wsBusy=false;},0);}});});
mo.observe(W,{childList:true,subtree:true});
setTimeout(()=>$$('table',W).forEach((t)=>markTh(t)),0);

/* ---------- search ---------- */
const q=$('#w2q',W),res=$('#w2res',W);
if(q){const run=()=>{const s=q.value.trim().toLowerCase();if(s.length<2){res.hidden=true;res.replaceChildren();return;}const P=rowsOf('w_players')||[];const T=rowsOf('w_teaminfo')||[];
  const tm=T.filter((t)=>t.team.toLowerCase().includes(s)||t.abbr.toLowerCase()===s).map((t)=>el('button',{type:'button',onclick:()=>{res.hidden=true;if(!openCard(t.tid)){q.value='';}}},logoEl(t.team),el('span',{text:t.team}),el('small',{text:t.tid?'Team page':'School closed'})));
  const pl=P.filter((p)=>p.player.toLowerCase().includes(s)).slice(0,14).map((p)=>{const line=p.b_ab?`${(p.b_h/p.b_ab).toFixed(3).replace(/^0/,'')} AVG, ${p.b_hr} HR`:'';const pl2=p.p_outs?`${Math.floor(p.p_outs/3)}.${p.p_outs%3} IP, ${(27*p.p_er/p.p_outs).toFixed(2)} ERA`:'';return el('button',{type:'button',onclick:()=>{res.hidden=true;openCard(p.tid,p.key);}},logoEl(p.team),el('span',{text:`${p.player} (${p.cls})`}),el('small',{text:[AB(p.team),line,pl2].filter(Boolean).join(' · ')+(p.tid?'':' · no team page')}));});
  const all=[...tm,...pl];res.replaceChildren(...(all.length?all:[el('button',{type:'button',disabled:'',text:'No match'})]));res.hidden=false;};
 q.addEventListener('input',run);q.addEventListener('focus',run);document.addEventListener('click',(e)=>{if(!e.target.closest||!e.target.closest('.w2-search'))res.hidden=true;});
 q.addEventListener('keydown',(e)=>{if(e.key==='Escape'){res.hidden=true;q.blur();}if(e.key==='Enter'){const b=res.querySelector('button:not([disabled])');if(b)b.click();}});}

/* ---------- leaders (computed from w_players) ---------- */
const f3=(v)=>v<1?v.toFixed(3).replace(/^0/,''):v.toFixed(3),f2=(v)=>v.toFixed(2),ipf=(o)=>`${Math.floor(o/3)}.${o%3}`;
const CATS={bat:[['AVG',(b)=>b.ab?b.h/b.ab:null,1,f3,1],['OBP',(b)=>{const d=b.ab+b.bb+b.hbp+b.sf;return d?(b.h+b.bb+b.hbp)/d:null;},1,f3,1],['SLG',(b)=>b.ab?b.tb/b.ab:null,1,f3,1],['OPS',(b)=>{const d=b.ab+b.bb+b.hbp+b.sf;return d&&b.ab?(b.h+b.bb+b.hbp)/d+b.tb/b.ab:null;},1,f3,1],
 ['Hits',(b)=>b.h,1,String,0],['Runs',(b)=>b.r,1,String,0],['Doubles',(b)=>b.d2,1,String,0],['Home runs',(b)=>b.hr,1,String,0],['RBI',(b)=>b.rbi,1,String,0],['Walks',(b)=>b.bb,1,String,0],['Stolen bases',(b)=>b.sb,1,String,0]],
 pit:[['ERA',(p)=>p.outs?27*p.er/p.outs:null,-1,f2,1],['WHIP',(p)=>p.outs?3*(p.h+p.bb)/p.outs:null,-1,f2,1],['K per 9',(p)=>p.outs?27*p.so/p.outs:null,1,f2,1],['Strikeouts',(p)=>p.so,1,String,0],['Wins',(p)=>p.w,1,String,0,1],['Saves',(p)=>p.sv,1,String,0,1],['Innings',(p)=>p.outs,1,ipf,0],['Appearances',(p)=>p.app,1,String,0]]};
const line=(r,pre)=>{const o={};const ks=pre==='b'||pre==='bc'?['ab','h','r','d2','d3','hr','rbi','bb','hbp','sf','sh','so','sb','tb']:['outs','h','r','er','bb','hbp','so','w','l','sv','app'];let any=false;ks.forEach((k)=>{const v=r[pre+'_'+k];if(v!==undefined)any=true;o[k]=v||0;});return any?o:null;};
draw('w2_ltsel',(s)=>{const T=(rowsOf('w_teaminfo')||[]).slice().sort((a,b)=>a.team.localeCompare(b.team));const v=s.value||'all';s.replaceChildren(el('option',{value:'all',text:'All 12 teams'}),...T.map((t)=>el('option',{value:t.team,text:t.team})));s.value=v;});
draw('w2_lcsel',(s)=>{const P=rowsOf('w_players')||[];const order=['Fr.','R-Fr.','So.','R-So.','Jr.','R-Jr.','Sr.','R-Sr.','Gr.'];const cl=[...new Set(P.map((p)=>p.cls).filter(Boolean))].sort((a,b)=>(order.indexOf(a)+99*(order.indexOf(a)<0))-(order.indexOf(b)+99*(order.indexOf(b)<0)));const v=s.value||'all';s.replaceChildren(el('option',{value:'all',text:'All classes'}),...cl.map((c)=>el('option',{value:c,text:c})));s.value=v;});
['w2scope','w2grp','w2n','w2lt','w2lc','w2back'].forEach((id)=>{const e=document.getElementById(id);if(e)e.addEventListener('change',()=>draw('w2_leads'));});
draw('w2_leads',(box)=>{const P=rowsOf('w_players')||[];const S=rowsOf('w_standings')||[];if(!P.length)return;
 const gv=(id,d)=>{const e=document.getElementById(id);return e&&e.value?e.value:d;};const scope=gv('w2scope','all'),grp=gv('w2grp','bat'),N=+gv('w2n','5'),tf=gv('w2lt','all'),cf=gv('w2lc','all'),bk=!!(document.getElementById('w2back')||{}).checked;
 const G={};S.forEach((r)=>{G[r.team]=scope==='conf'?28:r.overall.split('-').reduce((a,b)=>+a+ +b,0);});
 const pre=grp==='bat'?(scope==='conf'?'bc':'b'):(scope==='conf'?'pc':'p');
 const pool=P.map((r)=>({r,l:line(r,pre)})).filter((x)=>x.l&&(tf==='all'||x.r.team===tf)&&(cf==='all'||x.r.cls===cf)&&(!bk||x.r.back));
 box.replaceChildren(...CATS[grp].filter((c)=>!(scope==='conf'&&c[5])).map(([lab,fn,dir,fmt,qual])=>{
  let L=pool.filter((x)=>{if(!qual)return true;const l=x.l;return grp==='bat'?(l.ab+l.bb+l.hbp+l.sf+l.sh)>=2.5*G[x.r.team]:l.outs/3>=G[x.r.team];}).map((x)=>({...x,v:fn(x.l)})).filter((x)=>x.v!==null&&(qual||x.v>0));
  L.sort((a,b)=>dir*(b.v-a.v));const cut=L.length>=N?L[N-1].v:null;L=L.filter((x)=>cut===null||(dir>0?x.v>=cut-1e-9:x.v<=cut+1e-9));
  const b=el('div',{class:'md-wlead'},el('h3',{},lab,el('small',{text:qual?'qualified':''})));
  if(!L.length)b.append(el('div',{class:'md-cap',text:'No qualified players for this filter.'}));
  let rk=0,prev=null;L.forEach((x,i)=>{if(x.v!==prev){rk=i+1;prev=x.v;}const tie=L.filter((y)=>Math.abs(y.v-x.v)<1e-9).length>1;const l=x.l;const ex=grp==='bat'?`${l.ab+l.bb+l.hbp+l.sf+l.sh} PA`:`${ipf(l.outs)} IP`;
   const nm=el('span',{class:'nm',title:`${x.r.player}, ${x.r.team} (${x.r.cls}), ${ex}. 2027: ${x.r.status}${x.r.tid?'. Click for his player card.':''}`},x.r.player,el('i',{text:AB(x.r.team)}),x.r.back?el('b',{class:'bk',title:'Can return in 2027'}):null);
   if(x.r.tid){nm.style.cursor='pointer';nm.addEventListener('click',()=>openCard(x.r.tid,x.r.key));}
   b.append(el('div',{class:'md-wlr'},el('span',{class:'rk',text:(tie?'T':'')+rk}),nm,el('span',{class:'vl',text:fmt(x.v)})));});
  return b;}));});

/* ---------- All-WHAC field ---------- */
let wf='First team';
$$('[data-wf]',W).forEach((b)=>b.addEventListener('click',()=>{wf=b.dataset.wf;$$('[data-wf]',W).forEach((x)=>x.classList.toggle('on',x===b));draw('w2_field');}));
const FIELD_SVG=`<svg viewBox="0 0 900 640" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
<defs><pattern id="w2mow" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="30" height="60" fill="#3E8E41"/><rect x="30" width="30" height="60" fill="#378238"/></pattern></defs>
<rect width="900" height="640" fill="#2F6F33"/>
<path d="M450 600 L40 190 A580 580 0 0 1 860 190 Z" fill="url(#w2mow)"/>
<path d="M40 190 A580 580 0 0 1 860 190" fill="none" stroke="#1E4A22" stroke-width="10"/>
<path d="M450 600 L40 190 M450 600 L860 190" stroke="#fff" stroke-width="3"/>
<path d="M450 600 L262 412 A266 266 0 0 1 638 412 Z" fill="#C68A52"/>
<path d="M450 560 L330 440 L450 320 L570 440 Z" fill="#3E8E41"/>
<path d="M450 600 L330 480 M450 600 L570 480" stroke="#fff" stroke-width="3"/>
<circle cx="450" cy="455" r="30" fill="#C68A52"/><rect x="440" y="452" width="20" height="5" fill="#fff"/>
<path d="M450 592 l-9 -9 9 -9 9 9z M330 440 l-8 -8 8 -8 8 8z M450 320 l-8 -8 8 -8 8 8z M570 440 l-8 -8 8 -8 8 8z" fill="#fff"/>
<circle cx="450" cy="590" r="38" fill="#C68A52"/><path d="M450 600 l-8 -8 0 -8 16 0 0 8z" fill="#fff"/>
</svg>`;
const SPOTS={'C':[[38,93],[62,93]],'1B':[[69,63]],'2B':[[60,46]],'3B':[[31,63]],'SS':[[40,46]],'OF':[[16,31],[38,16],[62,16],[84,31]],'SP':[[50,62],[50,67.5],[50,73],[50,78.5]]};
const DUG={'DH':[11,86],'UTIL':[89,86],'RP':[89,62]};
draw('w2_field',(box)=>{const F=(rowsOf('w_field')||[]).filter((r)=>r.team_level===wf);box.replaceChildren();box.insertAdjacentHTML('afterbegin',FIELD_SVG);const tip=$('#w2tip');
 const pill=(r)=>{const p=el('div',{class:'w2-pl'+(r.tid&&r.key?'':' nolink'),tabindex:'0',title:`${r.name}, ${r.team} · ${r.pos} · 2026: ${r.line} · 2027: ${r.status}`},logoEl(r.team),el('b',{text:r.name,style:`background:${r.color}`}));
  const show=()=>{if(tip)tip.textContent=`${r.name} (${r.team}, ${r.pos}): ${r.line}. 2027: ${r.status}.`;};p.addEventListener('mouseenter',show);p.addEventListener('focus',show);
  if(r.tid&&r.key)p.addEventListener('click',()=>openCard(r.tid,r.key));return p;};
 const used={};
 F.forEach((r)=>{const pos=r.pos;if(SPOTS[pos]){const i=used[pos]=(used[pos]||0);used[pos]++;const xy=SPOTS[pos][i]||SPOTS[pos][SPOTS[pos].length-1];
   const s=el('div',{class:'w2-slot',style:`left:${xy[0]}%;top:${xy[1]}%`},(pos!=='SP'||i===0)?el('span',{class:'w2-pos',text:pos==='SP'?'Starting pitchers':pos}):null,pill(r));
   box.append(s);}
  else{const d=DUG[pos]||[50,50];box.append(el('div',{class:'w2-dug',style:`left:${d[0]}%;top:${d[1]}%`},el('span',{class:'w2-pos',text:pos==='UTIL'?'Utility':pos==='RP'?'Relief pitcher':'Designated hitter'}),pill(r)));}});
 if(tip&&!tip.textContent)tip.textContent='Hover or tap a player for his 2026 line and 2027 status.';});

/* ---------- bracket ---------- */
const mbox=(g,champ)=>{const row=(side)=>{const t=g[side],w=g.winner===t;const r=el('div',{class:'w2-t '+(w?'win':'lose'),style:`border-left-color:${w?g[side+'_color']:'transparent'}`},el('span',{class:'sd',text:'#'+g[side+'_seed']}),logoEl(t),el('span',{class:'nm'},t,(!w&&g.elim)?el('span',{class:'out',text:'OUT'}):null),el('span',{class:'sc',text:g[side+'_score']}));return r;};
 return el('div',{class:'w2-m'+(champ?' w2-champ':'')},el('div',{class:'w2-mh'},el('span',{text:`Game ${g.game}`}),el('span',{text:g.date+(g.inn?' · '+g.inn:'')})),row('top'),row('bot'));};
draw('w2_bracket',(box)=>{const B=rowsOf('w_bracket')||[];const by=(c)=>B.filter((g)=>g.col===c).sort((a,b)=>a.game-b.game);
 const col=(title,games,extra)=>el('div',{class:'w2-col'},el('div',{class:'w2-colh',text:title}),el('div',{class:'w2-games'},...games.map((g)=>mbox(g,extra&&g.game===15)),extra?el('div',{class:'w2-champtag',text:'Champion: Madonna'}):null));
 // order winners round 1 so 1v8 and 4v5 feed game 7, 2v7 and 3v6 feed game 8
 const w1=[1,2,3,4].map((n)=>B.find((g)=>g.game===n)).filter(Boolean);
 box.replaceChildren(el('div',{class:'w2-colh',style:'border:0;color:#E7131A',text:'Winners bracket'}),
  el('div',{class:'w2-br'},col('Round 1 · Apr 30',w1),col('Round 2 · May 1',by('W2')),col('Winners final · May 2',by('W3')),col('Championship · May 3',by('C'),true)),
  el('div',{class:'w2-colh',style:'border:0;color:#E7131A;margin-top:8px',text:'Elimination bracket'}),
  el('div',{class:'w2-br'},col('Round 1 · Apr 30',by('L1')),col('Round 2 · May 1',by('L2')),col('Round 3 · May 2',by('L3')),col('Elimination final · May 2',by('L4'))));});
draw('w2_naia',(box)=>{const N=rowsOf('w_naia')||[];const teams=[...new Set(N.map((r)=>r.team))];box.replaceChildren(...teams.map((t)=>{const G=N.filter((r)=>r.team===t);const w=G.filter((g)=>g.result==='W').length;
 return el('div',{class:'w2-nc'},el('h4',{},logoEl(t),t,el('small',{class:'md-cap',style:'margin-left:auto',text:`${w}-${G.length-w} · ${G[0].site}`})),...G.map((g)=>el('div',{class:'w2-ng'},el('span',{text:g.date}),el('span',{text:g.opponent}),el('span',{class:'r '+g.result,text:`${g.result} ${g.score}`}))));}));});

/* ---------- honors (awards only) ---------- */
draw('w2_hon',(tb)=>fill2(tb,(rowsOf('w_honors')||[]).filter((r)=>r.award!=='First team'&&r.award!=='Second team'),(tr,r)=>{td(tr,r.award);td(tr,r.name);teamTd(tr,r.team);td(tr,r.pos);td(tr,r.status,wStat(r.status));}));

/* ---------- compare ---------- */
draw('w2_vssel',(s)=>{const C=rowsOf('w_compare')||[];const v=s.value||(s.id==='w2a'?'Cleary':'Madonna');s.replaceChildren(...C.map((r)=>r.team).sort().map((t)=>el('option',{value:t,text:t})));s.value=v;s.onchange=()=>draw('w2_vs');if(s.id==='w2b')draw('w2_vs');});
draw('w2_vs',(t)=>{const C=rowsOf('w_compare')||[],cols=rowsOf('w_compare_cols')||[],S=rowsOf('w_standings')||[],H=rowsOf('w_h2h')||[],HC=rowsOf('w_h2h_cols')||[],R=rowsOf('w_retbar')||[];const a=($('#w2a')||{}).value,b=($('#w2b')||{}).value;t.replaceChildren();if(!a||!b||!C.length)return;
 const A=C.find((r)=>r.team===a),B=C.find((r)=>r.team===b),sa=S.find((r)=>r.team===a),sb=S.find((r)=>r.team===b);
 const head=t.createTHead().insertRow();[['',''],[a,a],[b,b]].forEach(([x,n])=>{const h=document.createElement('th');if(n){h.append(logoEl(n),' ',x);}else h.textContent='2026';head.append(h);});
 const tb=t.createTBody();const row=(lab,va,vb,ra,rb)=>{const tr=tb.insertRow();td(tr,lab);const ca=td(tr,va),cb=td(tr,vb);if(ra&&rb&&ra!==rb){(ra<rb?ca:cb).classList.add('best');}};
 row('Overall (as played)',sa.overall,sb.overall);row('WHAC',`${sa.conf} (${sa.place})`,`${sb.conf} (${sb.place})`,sa.place,sb.place);
 const ci=HC.find((c)=>c.team===b);const hr=H.find((r)=>r.team===a);row('Head to head',a===b?'—':(hr&&ci?`${a} ${hr[ci.id]}`:'—'),a===b?'—':(hr&&ci?`${b} ${hr[ci.id].split('-').reverse().join('-')}`:'—'));
 row('WHAC runs scored-allowed',sa.rf==='—'?'—':`${sa.rf}-${sa.ra}`,sb.rf==='—'?'—':`${sb.rf}-${sb.ra}`);
 cols.forEach((c)=>row(c.label,`${A[c.id]} (${A[c.id+'_r']})`,`${B[c.id]} (${B[c.id+'_r']})`,A[c.id+'_r'],B[c.id+'_r']));
 const ra=R.find((r)=>r.team===a),rb=R.find((r)=>r.team===b);
 row('PA that can return',ra?ra.pa_pct+'%':'School closed',rb?rb.pa_pct+'%':'School closed');row('IP that can return',ra?ra.ip_pct+'%':'School closed',rb?rb.ip_pct+'%':'School closed');
 row('All-WHAC 1st/2nd team who can return',ra?`${ra.aw_back} of ${ra.aw_total}`:'School closed',rb?`${rb.aw_back} of ${rb.aw_total}`:'School closed');});

/* ---------- charts ---------- */
const NS='http://www.w3.org/2000/svg';const sv=(t,a={},txt)=>{const e=document.createElementNS(NS,t);for(const [k,v] of Object.entries(a))e.setAttribute(k,v);if(txt!==undefined)e.textContent=txt;return e;};
const svgLogo=(g,team,x,y,h)=>{const I=info()[team],L=logos();if(I&&L[I.logo]){g.append(sv('image',{href:L[I.logo],x:x,y:y-h/2,height:h,width:h*1.3,preserveAspectRatio:'xMidYMid meet'}));}};
draw('w2_pyth',(box)=>{const P=(rowsOf('w_pyth')||[]).slice().sort((a,b)=>b.w-a.w);if(!P.length)return;const W_=860,rowH=30,top=34,L=190,R=40;const H_=top+P.length*rowH+30;const mx=Math.max(...P.map((r)=>Math.max(r.w,r.pyth_w)))+3;const x=(v)=>L+(W_-L-R)*v/mx;
 const s=sv('svg',{viewBox:`0 0 ${W_} ${H_}`,role:'img','aria-label':'Actual wins and expected wins from runs scored and allowed, 2026'});
 for(let v=0;v<=mx;v+=10){s.append(sv('line',{x1:x(v),x2:x(v),y1:top-8,y2:H_-24,stroke:'#E3E7F0'}));s.append(sv('text',{x:x(v),y:H_-8,'text-anchor':'middle','font-size':11,fill:'#6B7488'},v));}
 s.append(sv('text',{x:L,y:16,'font-size':12,fill:'#16285A','font-weight':700},'● Actual wins   ○ Expected wins from runs'));
 P.forEach((r,i)=>{const y=top+i*rowH+rowH/2;const I=info()[r.team]||{};svgLogo(s,r.team,4,y,20);s.append(sv('text',{x:34,y:y+4,'font-size':13,fill:'#1A2340'},r.team));
  s.append(sv('line',{x1:x(r.w),x2:x(r.pyth_w),y1:y,y2:y,stroke:'#8FA0CC','stroke-width':3}));
  s.append(sv('circle',{cx:x(r.pyth_w),cy:y,r:7,fill:'#fff',stroke:I.color||'#223C81','stroke-width':2.5}));
  const c=sv('circle',{cx:x(r.w),cy:y,r:7,fill:I.color||'#223C81'});c.append(sv('title',{},`${r.team}: ${r.w} wins, ${r.pyth_w} expected (${r.rs} runs, ${r.ra} allowed)`));s.append(c);
  s.append(sv('text',{x:Math.max(x(r.w),x(r.pyth_w))+12,y:y+4,'font-size':11,fill:Math.abs(r.delta)<1?'#6B7488':r.delta>0?'#14713A':'#B3261E'},(r.delta>0?'+':'')+r.delta));});
 box.replaceChildren(s);});
draw('w2_pytht',(tb)=>fill2(tb,rowsOf('w_pyth'),(tr,r)=>{teamTd(tr,r.team);td(tr,r.g);td(tr,`${r.w}-${r.l}`);td(tr,r.rs);td(tr,r.ra);td(tr,(r.diff>0?'+':'')+r.diff,'',r.diff);td(tr,(r.dpg>0?'+':'')+r.dpg,'',r.dpg);td(tr,r.pyth_w);td(tr,(r.delta>0?'+':'')+r.delta,'',r.delta);}));
draw('w2_closec',(box)=>{const C=(rowsOf('w_close')||[]).slice().sort((a,b)=>(b.one_w-(b.one_n-b.one_w))-(a.one_w-(a.one_n-a.one_w)));if(!C.length)return;const W_=860,rowH=28,top=40,mid=520,L=200;const H_=top+C.length*rowH+24;const mx=Math.max(...C.map((r)=>Math.max(r.one_w,r.one_n-r.one_w)))+1;const u=(W_-mid-30)/mx;
 const s=sv('svg',{viewBox:`0 0 ${W_} ${H_}`,role:'img','aria-label':'One-run game wins and losses by team, 2026'});
 s.append(sv('text',{x:mid,y:16,'text-anchor':'middle','font-size':12,'font-weight':700,fill:'#16285A'},'One-run games: losses ◀ ▶ wins'));
 s.append(sv('line',{x1:mid,x2:mid,y1:top-10,y2:H_-14,stroke:'#16285A'}));
 C.forEach((r,i)=>{const y=top+i*rowH;const I=info()[r.team]||{};const l=r.one_n-r.one_w;svgLogo(s,r.team,4,y+rowH/2-2,18);s.append(sv('text',{x:32,y:y+rowH/2+2,'font-size':13,fill:'#1A2340'},`${r.team} (${r.one})`));
  const lb=sv('rect',{x:mid-l*u,y:y+4,width:l*u,height:rowH-10,fill:'#B8C3E0'});lb.append(sv('title',{},`${r.team}: ${l} one-run losses`));s.append(lb);
  const wb=sv('rect',{x:mid,y:y+4,width:r.one_w*u,height:rowH-10,fill:I.color||'#223C81'});wb.append(sv('title',{},`${r.team}: ${r.one_w} one-run wins`));s.append(wb);
  if(l)s.append(sv('text',{x:mid-l*u-5,y:y+rowH/2+2,'text-anchor':'end','font-size':11,fill:'#55607A'},l));
  if(r.one_w)s.append(sv('text',{x:mid+r.one_w*u+5,y:y+rowH/2+2,'font-size':11,fill:'#1A2340','font-weight':700},r.one_w));});
 box.replaceChildren(s);});
draw('w2_closet',(tb)=>fill2(tb,rowsOf('w_close'),(tr,r)=>{teamTd(tr,r.team);td(tr,r.one);td(tr,r.big);td(tr,r.sho_for);td(tr,r.sho_vs);td(tr,r.come);}));
draw('w2_retbar',(box)=>{const R=(rowsOf('w_retbar')||[]).slice().sort((a,b)=>b.pa_pct-a.pa_pct);if(!R.length)return;const W_=860,rowH=34,top=40,L=190,gap=30;const bw=(W_-L-gap-20)/2;const H_=top+R.length*rowH+10;
 const s=sv('svg',{viewBox:`0 0 ${W_} ${H_}`,role:'img','aria-label':'Share of 2026 plate appearances and innings that can return in 2027'});
 [['Plate appearances',L],['Innings pitched',L+bw+gap]].forEach(([t,x0])=>{s.append(sv('text',{x:x0,y:16,'font-size':12,'font-weight':700,fill:'#16285A'},t+' — can return / leaving'));});
 R.forEach((r,i)=>{const y=top+i*rowH;const I=info()[r.team]||{};svgLogo(s,r.team,4,y+rowH/2-4,20);s.append(sv('text',{x:34,y:y+rowH/2,'font-size':13,fill:'#1A2340'},r.team));s.append(sv('text',{x:34,y:y+rowH/2+13,'font-size':10,fill:'#6B7488'},`All-WHAC back: ${r.aw_back} of ${r.aw_total}`));
  [[r.pa_pct,r.pa_back,r.pa_gone,'PA',L],[r.ip_pct,r.ip_back,r.ip_gone,'outs',L+bw+gap]].forEach(([pct,bk,gn,u,x0])=>{const w1=bw*pct/100;
   const a=sv('rect',{x:x0,y:y+6,width:w1,height:rowH-14,fill:I.color||'#223C81'});a.append(sv('title',{},`${r.team}: ${pct}% can return (${u==='outs'?ipf(bk)+' IP':bk+' PA'})`));s.append(a);
   const b=sv('rect',{x:x0+w1,y:y+6,width:bw-w1,height:rowH-14,fill:'#E3E7F0'});b.append(sv('title',{},`${r.team}: ${100-pct}% leaving (${u==='outs'?ipf(gn)+' IP':gn+' PA'})`));s.append(b);
   s.append(sv('text',{x:x0+Math.max(w1,0)-5,y:y+rowH/2+1,'text-anchor':w1>34?'end':'start','font-size':11,'font-weight':700,fill:w1>34?'#fff':'#1A2340',dx:w1>34?0:10},pct+'%'));});});
 box.replaceChildren(s);});

/* ---------- 2027 calendar and tracker ---------- */
draw('w2_calsel',(s)=>{const C=rowsOf('w_cal_cols')||[];const v=s.value||'none';s.replaceChildren(el('option',{value:'none',text:'No team'}),...C.map((c)=>el('option',{value:c.id,text:c.team})));s.value=v;s.onchange=()=>draw('w2_cal');});
draw('w2_cal',(t)=>{const R=rowsOf('w_cal')||[],C=rowsOf('w_cal_cols')||[];const hl=($('#w2calt')||{}).value;t.replaceChildren();if(!R.length)return;const h=t.createTHead().insertRow();const h0=document.createElement('th');h0.textContent='Weekend';h.append(h0);
 C.forEach((c)=>{const x=document.createElement('th');x.textContent=c.abbr;x.title=c.team;if(c.id===hl)x.className='hl';h.append(x);});const tb=t.createTBody();
 R.forEach((r)=>{const tr=tb.insertRow();td(tr,r.week,'',r.rowid);C.forEach((c)=>{const v=r[c.id]||'';let txt='';if(v){const m=/^(vs|at) (.+?) · (.+?) · (\d+) g$/.exec(v);txt=m?`${m[1]} ${AB(m[2])} · ${m[3]}`:v;}const cell=td(tr,txt||'','w2-cal'+(c.id===hl?' hl':''));if(v)cell.title=`${c.team} ${v.replace(/ · (\d+) g$/,' · $1 games')}`;});});});
const stc=(s)=>/Posted|Changed|Same|Found|Listed/.test(s)&&!/Not posted|Partly/.test(s)?'good':/Partly/.test(s)?'warn':/Not posted|Not out/.test(s)?'bad':'mute';
draw('w2_watch',(tb)=>fill2(tb,rowsOf('w_watch'),(tr,r)=>{teamTd(tr,r.team);['roster','schedule','staff','commits'].forEach((k)=>{const lab=(k==='roster'||k==='schedule')&&r[k]==='Changed'?'Posted':r[k];const c=td(tr,lab,'w2-st '+stc(lab));c.title=(r[k+'_detail']||'')+(r[k+'_checked']?` (checked ${r[k+'_checked']})`:'');});}));

// redraw the new pieces once everything is registered
['wn','w2_leads','w2_ltsel','w2_lcsel','w2_field','w2_bracket','w2_naia','w2_hon','w2_vssel','w2_vs','w2_pyth','w2_pytht','w2_closec','w2_closet','w2_retbar','w2_calsel','w2_cal','w2_watch'].forEach((n)=>{try{draw(n);}catch(e){}});
})();
