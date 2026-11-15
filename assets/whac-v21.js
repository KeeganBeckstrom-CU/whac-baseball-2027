/* WHAC landing v21: recruiting map 2022-2027 (Michigan, Ohio, Indiana, everywhere else), team footprints,
   high school and feeder-college breakdowns. Loaded after v20 with fetch + direct eval, so it shares the page script's scope. */
(function(){
const CSS=`
.r3-bar{position:sticky;top:44px;z-index:4;background:#fff;border:1px solid #D3D9E8;border-bottom:3px solid #223C81;padding:8px 10px;display:flex;flex-direction:column;gap:6px;box-shadow:0 2px 6px rgba(22,40,90,.08)}
.r3-line{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.r3-lab{font-family:var(--serif);font-weight:700;font-size:var(--cds-font-size-caption);color:#16285A;min-width:4.6rem}
.r3-chip{appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border:1px solid #B8C3E0;background:#fff;color:#16285A;font-family:var(--serif);font-weight:700;font-size:var(--cds-font-size-caption);border-radius:3px}
.r3-chip img{height:16px;width:auto;max-width:26px;display:block}
.r3-chip.on{background:#223C81;border-color:#223C81;color:#fff}
.r3-chip.on img{background:#fff;border-radius:2px;padding:1px}
.r3-chip.x{opacity:.75;font-style:italic}
.r3-chip.mini{font-weight:400;border-style:dashed}
.r3-sel{font-family:var(--serif);font-weight:700;padding:3px 6px;border:1px solid #223C81;background:#fff;color:#16285A;font-size:var(--cds-font-size-caption)}
.r3-sum{font-size:var(--cds-font-size-caption);color:#55607A}
.r3-tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,8.5rem),1fr));gap:8px}
.r3-tile{background:#223C81;color:#fff;padding:8px 10px;display:flex;flex-direction:column;gap:2px;border-bottom:3px solid #E7131A;cursor:default}
.r3-tile.go{cursor:pointer}.r3-tile.go:hover{background:#16285A}
.r3-tile b{font-family:var(--serif);font-size:1.55rem;line-height:1.1}
.r3-tile span{font-size:var(--cds-font-size-caption);opacity:.92}
.r3-tabs{display:flex;gap:4px;flex-wrap:wrap;border-bottom:3px solid #223C81}
.r3-tab{appearance:none;cursor:pointer;padding:7px 14px;background:#EEF1F8;border:1px solid #B8C3E0;border-bottom:0;font-family:var(--serif);font-weight:700;color:#16285A;font-size:var(--cds-font-size-body)}
.r3-tab small{font-weight:400;margin-left:4px;opacity:.85}
.r3-tab.on{background:#223C81;color:#fff;border-color:#223C81}
.r3-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(15rem,19rem);gap:12px;align-items:start}
@media (max-width:820px){.r3-grid{grid-template-columns:minmax(0,1fr)}}
.r3-map{position:relative;border:1px solid #B8C3E0;background:#DCE7F3;line-height:0;touch-action:pan-x pan-y;cursor:grab;overflow:hidden}
.r3-map:active{cursor:grabbing}
.r3-map svg{display:block;width:100%;height:auto}
.r3-map text{font-family:var(--font-anthropic-sans,sans-serif);pointer-events:none}
.r3-map .r3-dot,.r3-map .r3-co{cursor:pointer}
.r3-tools{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin:6px 0}
.r3-side{display:flex;flex-direction:column;gap:10px;min-width:0}
.r3-box{border:1px solid #D3D9E8;border-top:4px solid #223C81;background:#fff;padding:8px 10px;min-width:0}
.r3-box h3{margin:0 0 6px;font-family:var(--serif);font-size:var(--cds-font-size-body);color:#16285A}
.r3-pick{border-top-color:#E7131A}
.r3-li{display:grid;grid-template-columns:1.7rem minmax(0,1fr) 2.2rem;gap:6px;align-items:center;font-size:var(--cds-font-size-caption);padding:3px 2px;border-bottom:1px dotted #E3E7F0;cursor:pointer}
.r3-li:hover{background:#F5F7FB}
.r3-li.on{background:#FBD3D4}
.r3-li .k{color:#55607A}
.r3-li .n{text-align:right;font-weight:700;color:#223C81;font-variant-numeric:tabular-nums}
.r3-li .nm{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.r3-stack{display:flex;height:6px;margin-top:2px;background:#EEF1F8}
.r3-stack i{display:block;height:100%}
.r3-kv{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:2px 8px;font-size:var(--cds-font-size-caption)}
.r3-kv b{text-align:right;color:#223C81}
.r3-legend{display:flex;gap:10px;flex-wrap:wrap;align-items:center;font-size:var(--cds-font-size-caption);color:#55607A;margin-top:4px}
.r3-legend svg{vertical-align:middle}
.r3-ramp{display:inline-block;width:110px;height:10px;background:linear-gradient(90deg,#FFFFFF,#B8C3E0,#5B76B8,#223C81,#0B1A40);border:1px solid #B8C3E0;vertical-align:middle}
.md-table.r3-t td.c{text-align:center;font-variant-numeric:tabular-nums}
.md-table.r3-t th.c{text-align:center}
.md-table.r3-t td.n{font-weight:700;text-align:center;color:#16285A}
.md-table.r3-t tr.on td{background:#FBD3D4}
.md-table.r3-t tbody tr{cursor:pointer}
.md-table.r3-t td.hot{background:#E3E8F3;font-weight:700}
.md-table.r3-t td.hot2{background:#B8C3E0;font-weight:700}
.md-table.r3-t th .w2-logo img{height:14px}
.r3-hsdet{margin-top:8px}
.r3-chip[hidden],.r3-map[hidden],.r3-line[hidden]{display:none!important}
.r3-box>div{max-height:34rem;overflow:auto}
.r3-tip{position:absolute;pointer-events:none;z-index:5;background:#fff;border:1px solid #223C81;box-shadow:0 3px 10px rgba(22,40,90,.25);padding:6px 8px;font-size:12px;line-height:1.35;max-width:19rem;font-family:var(--font-anthropic-sans,sans-serif)}
.r3-tip[hidden]{display:none}
.r3-tip .h{font-weight:700;color:#16285A;margin-bottom:3px;white-space:nowrap}
.r3-tip .r{display:grid;grid-template-columns:20px 10px minmax(0,1fr) auto;gap:5px;align-items:center;white-space:nowrap}
.r3-tip .r img{height:15px;width:20px;object-fit:contain;display:block}
.r3-tip .r i{display:block;width:10px;height:10px;border-radius:2px}
.r3-tip .r b{text-align:right;color:#16285A}
.r3-tip .x{margin-top:3px;color:#55607A;white-space:normal}
.r3-kvt{display:grid;grid-template-columns:20px 10px minmax(0,1fr) auto;gap:3px 6px;align-items:center;font-size:var(--cds-font-size-caption)}
.r3-kvt img{height:15px;width:20px;object-fit:contain;display:block}
.r3-kvt i{display:block;width:10px;height:10px;border-radius:2px}
.r3-kvt b{text-align:right;color:#223C81}
.r3-lk{display:inline-flex;align-items:center;gap:4px;margin-right:8px;white-space:nowrap}
.r3-lk img{height:14px;width:auto;max-width:22px}
.r3-lk i{display:inline-block;width:11px;height:11px;border-radius:50%}
.r3-dd{position:relative}
.r3-dd>summary{list-style:none;cursor:pointer;display:inline-flex;align-items:center;gap:5px;min-width:9rem}
.r3-dd>summary::-webkit-details-marker{display:none}
.r3-dd>summary img{height:14px;width:auto;max-width:20px}
.r3-caret{margin-left:auto;font-size:10px}
.r3-ddp{position:absolute;z-index:6;top:calc(100% + 4px);left:0;background:#fff;border:1px solid #223C81;box-shadow:0 6px 18px rgba(22,40,90,.22);padding:8px;width:17rem;display:flex;flex-direction:column;gap:6px}
.r3-ddl{display:flex;flex-direction:column;max-height:none}
.r3-ddi{display:grid;grid-template-columns:16px 10px 22px minmax(0,1fr);gap:6px;align-items:center;padding:3px 2px;font-size:var(--cds-font-size-caption);color:#16285A;cursor:pointer}
.r3-ddi:hover{background:#F5F7FB}.r3-ddi.x{font-style:italic;opacity:.85}
.r3-ddi i{display:block;width:10px;height:10px;border-radius:2px}.r3-ddi img{height:15px;width:22px;object-fit:contain}
.r3-lab2{font-family:var(--serif);font-weight:700;font-size:var(--cds-font-size-caption);color:#16285A;display:inline-flex;align-items:center;gap:4px}
.r3-chk{display:inline-flex;align-items:center;gap:4px;font-size:var(--cds-font-size-caption);color:#16285A;font-weight:700}
.r3-chk[hidden]{display:none}
.r3-sep{flex:1}
.r3-chip small{font-weight:400;opacity:.8}
.r3-crumb{display:flex;gap:8px;align-items:center;flex-wrap:wrap;min-height:28px;margin:2px 0 6px}
.r3-crumbt{font-family:var(--serif);font-weight:700;color:#16285A}
.r3-note{font-size:var(--cds-font-size-caption);color:#55607A;margin:4px 0 0}
`;
const st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const el=(t,a={},...kids)=>{const e=document.createElement(t);for(const [k,v] of Object.entries(a)){if(k==='class')e.className=v;else if(k==='text')e.textContent=v;else if(k.startsWith('on'))e.addEventListener(k.slice(2),v);else if(v!==undefined&&v!==null)e.setAttribute(k,v);}kids.flat().forEach((k)=>{if(k!==null&&k!==undefined)e.append(k);});return e;};
const W=document.getElementById('whac');if(!W)return;
const DS='w_rec_players w_rec_towns w_rec_teams w_teaminfo w_logos';
const SEASONS=[2022,2023,2024,2025,2026,2027];
const MAPS=[['mi','Michigan'],['oh','Ohio'],['in','Indiana'],['na','Everywhere else'],['pl','Pipelines']];
const ST={mi:'MI',oh:'OH',in:'IN'};
const R={teams:null,seasons:new Set([2022,2023,2024,2025,2026]),from:2022,to:2026,min1:false,focus:null,plGroup:'county',plMin:2,plTeam:'',mode:'roster',path:'all',role:'all',map:'mi',view:'counties',pick:null,hsSt:'MI',hsMin:1,hsQ:'',hsPick:null,cMin:1,cKind:'all'};
const MV={};const API={};

/* ---------- DOM ---------- */
const chip=(attrs,...kids)=>el('button',{type:'button',class:'r3-chip',...attrs},...kids);
const bar=()=>el('div',{class:'r3-bar'},
  el('div',{class:'r3-line'},
    el('details',{class:'r3-dd',id:'r3teams'},el('summary',{class:'r3-sel r3-sum1','data-draw':'r3_teamlab','data-src':'w_rec_teams w_logos w_teaminfo',text:'Teams'}),
      el('div',{class:'r3-ddp'},el('div',{class:'r3-line'},chip({'data-rall':'1',class:'r3-chip mini',text:'All 12'}),chip({'data-rall':'now',class:'r3-chip mini',text:'2027 teams'}),chip({'data-rall':'0',class:'r3-chip mini',text:'Clear'})),
        el('div',{class:'r3-ddl','data-draw':'r3_teamchips','data-src':'w_rec_teams w_logos w_teaminfo'}))),
    el('label',{class:'r3-lab2'},'Seasons ',el('select',{class:'r3-sel',id:'r3from','aria-label':'First season'},...SEASONS.map((y)=>el('option',{value:String(y),text:y===2027?'2027*':String(y)}))),' to ',el('select',{class:'r3-sel',id:'r3to','aria-label':'Last season'},...SEASONS.map((y)=>el('option',{value:String(y),text:y===2027?'2027*':String(y)})))),
    el('select',{class:'r3-sel',id:'r3mode','aria-label':'Who to count'},el('option',{value:'roster',text:'Everyone on those rosters'}),el('option',{value:'new',text:'Only players new to the team'})),
    el('select',{class:'r3-sel',id:'r3path','aria-label':'Path to the team'},el('option',{value:'all',text:'Every path'}),el('option',{value:'hs',text:'No previous college'}),el('option',{value:'juco',text:'From a junior college'}),el('option',{value:'four',text:'From a four-year college'})),
    el('select',{class:'r3-sel',id:'r3role','aria-label':'Position group'},el('option',{value:'all',text:'All positions'}),el('option',{value:'p',text:'Pitchers'}),el('option',{value:'h',text:'Position players'})),
    chip({id:'r3reset',class:'r3-chip mini',text:'Reset'}),el('span',{class:'r3-sum','data-draw':'r3_sum','data-src':DS,text:'—'})));

const card=(id,title,...body)=>el('div',{class:'md-card',id},el('h2',{class:'md-h',text:title}),...body);
const mapCard=card('w-rmap','Recruiting map: where WHAC rosters come from, 2022-2027',
  el('p',{class:'md-cap',text:'Every player on a WHAC baseball roster from 2022 through 2026, plus the 2027 rosters already posted (Aquinas, Indiana Tech and Lawrence Tech; marked 2027*). Each dot is a hometown and its number is how many players the selected teams brought in from there. A player who was on two WHAC teams counts once for each. Pick teams and seasons above; every map, list and table on this page follows them.'}),
  bar(),
  el('div',{class:'r3-tiles','data-draw':'r3_tiles','data-src':DS}),
  el('div',{class:'r3-tabs',role:'tablist'},...MAPS.map(([m,t])=>el('button',{type:'button',class:'r3-tab'+(m==='mi'?' on':''),'data-rm':m,role:'tab'},t,el('small',{'data-draw':'r3_tabn','data-m':m,'data-src':DS,text:''})))),
  el('div',{class:'r3-grid'},
    el('div',{},
      el('div',{class:'r3-tools'},chip({'data-rv':'counties',class:'r3-chip on',text:'Counties'}),chip({'data-rv':'towns',class:'r3-chip',text:'Towns'}),
        el('label',{class:'r3-chk',id:'r3one',hidden:''},el('input',{type:'checkbox',id:'r3min1'}),' Include 1-player towns'),
        el('span',{class:'r3-sep'}),chip({'data-rz':'1.6',class:'r3-chip mini','aria-label':'Zoom in',text:'+'}),chip({'data-rz':'0.625',class:'r3-chip mini','aria-label':'Zoom out',text:'−'}),chip({'data-rz':'0',class:'r3-chip mini',text:'Whole map'})),
      el('div',{class:'r3-tools','data-draw':'r3_regions','data-src':DS+' w_rec_regions'}),
      el('div',{class:'r3-crumb','data-draw':'r3_crumb','data-src':DS+' w_rec_regions'}),
      el('div',{class:'r3-tools','data-draw':'r3_pipectl','data-src':DS}),
      ...MAPS.map(([m])=>el('div',{class:'r3-map','data-rmap':m,hidden:m==='mi'?null:'','data-draw':m==='pl'?'r3_pipe':'r3_map','data-m':m,'data-src':DS+' w_rec_shapes w_rec_dims w_rec_regions'})),
      el('div',{class:'r3-legend','data-draw':'r3_legend','data-src':DS})),
    el('div',{class:'r3-side'},
      el('div',{class:'r3-box r3-pick','data-draw':'r3_pick','data-src':DS+' w_rec_hs'}),
      el('div',{class:'r3-box'},el('h3',{'data-draw':'r3_toph','data-src':DS,text:'Top towns'}),el('div',{'data-draw':'r3_top','data-src':DS})),
      el('div',{class:'r3-box'},el('h3',{'data-draw':'r3_top2h','data-src':DS,text:'Top counties'}),el('div',{'data-draw':'r3_top2','data-src':DS})))),
  el('p',{class:'r3-note','data-draw':'r3_mapnote','data-src':DS}));

const footCard=card('w-rfoot','Recruiting footprint by team',
  el('p',{class:'md-cap',text:'How local each program recruits, with the seasons, path and position filters above (the team picks only highlight rows here). Shares are of players with a listed hometown. Miles are straight-line distance from hometown to campus. Select a team name to open its page.'}),
  el('div',{class:'md-scroll'},el('table',{class:'md-table r3-t'},el('thead',{},el('tr',{},...['Team','Players','Michigan','Ohio','Indiana','Rest of U.S.','Canada','Other countries','Within 50 mi','Median miles','No prev. college','From JUCO','From 4-year','Top town','Top high school'].map((t)=>el('th',{text:t})))),el('tbody',{'data-draw':'r3_foot','data-src':DS+' w_rec_hs w_standings'}))));

const hsCard=card('w-rhs','High schools that feed the WHAC, 2022-2027',
  el('p',{class:'md-cap',text:'Every Michigan, Ohio and Indiana high school with a player on a WHAC roster, by team, with the filters above. A school is counted in the state of the player\'s listed hometown. Rosters write school names many ways (Dakota, Macomb Dakota HS); spellings were joined by hand. Players who list only a college, or no school, are not in these tables. Select a school for its players.'}),
  el('div',{class:'r3-line'},...[['MI','Michigan'],['OH','Ohio'],['IN','Indiana']].map(([s,t])=>chip({'data-hst':s,class:'r3-chip'+(s==='MI'?' on':'')},t,el('small',{'data-draw':'r3_hsn','data-st':s,'data-src':DS+' w_rec_hs',text:''})))),
  el('div',{class:'r3-line',style:'margin-top:6px'},el('input',{type:'search',class:'md-input',id:'r3hsq',placeholder:'Search a school, town or county','aria-label':'Search high schools'}),
    el('select',{class:'r3-sel',id:'r3hsmin','aria-label':'Minimum players'},el('option',{value:'1',text:'Any school'}),el('option',{value:'2',text:'2+ players'}),el('option',{value:'3',text:'3+ players'}),el('option',{value:'5',text:'5+ players'})),
    el('span',{class:'r3-sum','data-draw':'r3_hssum','data-src':DS+' w_rec_hs',text:'—'})),
  el('div',{class:'md-scroll',style:'max-height:38rem'},el('table',{class:'md-table r3-t','data-draw':'r3_hs','data-src':DS+' w_rec_hs w_logos w_teaminfo'})),
  el('div',{class:'r3-box r3-hsdet','data-draw':'r3_hsdet','data-src':DS+' w_rec_hs w_standings'}));

const colCard=card('w-rcoll','Colleges that sent transfers to the WHAC, 2022-2027',
  el('p',{class:'md-cap',text:'The first other college each player lists on a WHAC roster, by team, with the filters above (the path filter does not apply here). Junior colleges and four-year schools are marked. A player\'s own WHAC team is never counted as his previous college.'}),
  el('div',{class:'r3-line'},el('select',{class:'r3-sel',id:'r3ck','aria-label':'College type'},el('option',{value:'all',text:'All colleges'}),el('option',{value:'juco',text:'Junior colleges'}),el('option',{value:'four',text:'Four-year colleges'})),
    el('select',{class:'r3-sel',id:'r3cmin','aria-label':'Minimum players'},el('option',{value:'1',text:'Any college'}),el('option',{value:'2',text:'2+ players'}),el('option',{value:'3',text:'3+ players'})),el('span',{class:'r3-sum','data-draw':'r3_csum','data-src':DS+' w_rec_colls',text:'—'})),
  el('div',{class:'md-scroll',style:'max-height:32rem'},el('table',{class:'md-table r3-t','data-draw':'r3_coll','data-src':DS+' w_rec_colls w_logos w_teaminfo'})));

const anchor=document.getElementById('w-watch')||document.getElementById('w-ser')||document.getElementById('w-meth');
if(anchor&&!document.getElementById('w-rmap')){anchor.after(mapCard);mapCard.after(footCard);footCard.after(hsCard);hsCard.after(colCard);}
const nav=$('.md-wnav',W);
if(nav&&!$('[data-wgo=w-rmap]',nav)){const meth=$('[data-wgo=w-meth]',nav);[['w-rmap','Recruiting map'],['w-rfoot','Footprints'],['w-rhs','High schools'],['w-rcoll','Feeder colleges']].forEach(([id,t])=>{const b=el('button',{type:'button','data-wgo':id,text:t,onclick:()=>{const x=document.getElementById(id);if(x&&x.scrollIntoView)x.scrollIntoView({behavior:'smooth',block:'start'});}});if(meth)nav.insertBefore(b,meth);else nav.append(b);});}

/* ---------- data helpers ---------- */
const ARR={w_rec_players:['seasons','colls'],w_rec_towns:['mi','oh','in','na','gl'],w_rec_teams:['mi','oh','in','na','gl'],w_rec_hs:['spellings'],w_rec_regions:['counties']};
const NUM={w_rec_players:['id','arr','pit','hit','miles'],w_rec_towns:['lat','lon','ins'],w_rec_teams:['lat','lon'],w_rec_dims:['w','h'],w_rec_shapes:['cx','cy','x0','y0','x1','y1','ins'],w_rec_regions:['x0','y0','x1','y1']};
const toArr=(v)=>{if(Array.isArray(v))return v;if(typeof v==='string'&&v.trim()){try{const x=JSON.parse(v);return Array.isArray(x)?x:null;}catch(e){return v.split(',').map((x)=>x.trim()).filter(Boolean);}}return null;};
const toNum=(v)=>{if(v===null||v===undefined||v==='')return null;const n=Number(v);return Number.isFinite(n)?n:null;};
const NORM=new Map();
const rows=(id)=>{const r=rowsOf(id);if(!r||(!ARR[id]&&!NUM[id]&&id!=='w_rec_teams'))return r;const c=NORM.get(id);if(c&&c.src===r)return c.out;
  const out=r.map((x)=>{const o={...x};(ARR[id]||[]).forEach((k)=>{if(k in o){const a=toArr(o[k]);o[k]=a;}});if(id==='w_rec_players'){o.seasons=(o.seasons||[]).map(Number);o.colls=o.colls||[];}if(id==='w_rec_hs')o.spellings=o.spellings||[];if(id==='w_rec_regions')o.counties=(o.counties||[]).map(String);(NUM[id]||[]).forEach((k)=>{if(k in o)o[k]=toNum(o[k]);});
    if(id==='w_rec_teams')o.closed=o.closed===true||o.closed==='true'||o.closed===1||o.closed==='1';
    ['mi','oh','in','na','gl'].forEach((k)=>{if(Array.isArray(o[k]))o[k]=o[k].map(Number);});return o;});
  NORM.set(id,{src:r,out});return out;};
const teamsAll=()=>rows('w_rec_teams')||[];
const TA=()=>{const m={};teamsAll().forEach((t)=>{m[t.tid]=t;});return m;};
const logoSrc=(tid)=>{const L={};(rows('w_logos')||[]).forEach((r)=>{L[r.id]=r.src;});const I=(rows('w_teaminfo')||[]).find((r)=>r.logo===tid||r.tid===tid);return I?L[I.logo]:L[tid];};
const townMap=()=>{const m={};(rows('w_rec_towns')||[]).forEach((t)=>{m[t.id]=t;});return m;};
const selTeams=()=>{if(!R.teams)R.teams=new Set(teamsAll().map((t)=>t.tid));return R.teams;};
let cacheKey='',cache=null;
const keyNow=()=>[...selTeams()].sort().join(',')+'|'+[...R.seasons].sort().join(',')+'|'+R.mode+'|'+R.path+'|'+R.role;
const passBase=(p,ignoreTeam,ignorePath)=>{if(!ignoreTeam&&!selTeams().has(p.team))return false;if(R.role==='p'&&!p.pit)return false;if(R.role==='h'&&!p.hit)return false;if(!ignorePath&&R.path!=='all'&&p.route!==R.path)return false;
  if(R.mode==='new')return R.seasons.has(p.arr);return p.seasons.some((y)=>R.seasons.has(y));};
const players=()=>{const all=rows('w_rec_players');if(!all)return null;const k=keyNow();if(k===cacheKey&&cache)return cache;cache=all.filter((p)=>passBase(p));cacheKey=k;return cache;};
const regionOf=(t)=>t?(t.country==='US'&&ST.mi===t.admin?'mi':t.country==='US'&&t.admin==='OH'?'oh':t.country==='US'&&t.admin==='IN'?'in':'na'):'';
const hsName=()=>{const m={};(rows('w_rec_hs')||[]).forEach((h)=>{m[h.key]=h.name;});return m;};
const byTown=(ps)=>{const T=townMap();const HN=hsName();const m={};ps.forEach((p)=>{const t=T[p.town];if(!t)return;const o=m[p.town]||(m[p.town]={t,n:0,teams:{},hs:{}});o.n++;o.teams[p.team]=(o.teams[p.team]||0)+1;const hn=p.hs&&HN[p.hs];if(hn)o.hs[hn]=(o.hs[hn]||0)+1;});return m;};
const ORDER=()=>teamsAll().map((t)=>t.tid);
const tcol=(tid)=>{const t=teamsAll().find((x)=>x.tid===tid);if(t&&t.mapcolor)return t.mapcolor;const r=(rows('w_teaminfo')||[]).find((x)=>x.logo===tid||x.tid===tid);return r&&r.color?r.color:'#223C81';};
const TIE='#E3E6EC';
const light=(c)=>{const x=d3.color(c);if(!x)return false;const r=x.rgb();return (0.299*r.r+0.587*r.g+0.114*r.b)>165;};
const lead=(teams)=>{const e=Object.entries(teams||{}).sort((a,b)=>b[1]-a[1]);if(!e.length)return null;if(e.length>1&&e[0][1]===e[1][1])return 'tie';return e[0][0];};
const leadCol=(teams)=>{const l=lead(teams);return l==='tie'?TIE:l?tcol(l):'#FFFFFF';};
const pct=(a,b)=>b?Math.round(100*a/b)+'%':'—';
const median=(a)=>{if(!a.length)return null;const s=[...a].sort((x,y)=>x-y);const h=s.length>>1;return s.length%2?s[h]:Math.round((s[h-1]+s[h])/2);};
const syncChips=()=>{$$('[data-r3t]').forEach((b)=>{b.checked=selTeams().has(b.dataset.r3t);});const f=document.getElementById('r3from'),t=document.getElementById('r3to');if(f)f.value=String(R.from);if(t)t.value=String(R.to);
  $$('[data-rv]').forEach((b)=>{b.classList.toggle('on',b.dataset.rv===R.view);b.hidden=R.map==='na'||R.map==='pl';});const one=document.getElementById('r3one');if(one)one.hidden=R.map==='na'||R.map==='pl'||R.view!=='towns'||!!R.focus;const c=document.getElementById('r3min1');if(c)c.checked=R.min1;};
const MAPDRAWS=['r3_pipe','r3_pipectl','r3_map','r3_legend','r3_pick','r3_toph','r3_top','r3_top2h','r3_top2','r3_mapnote','r3_regions','r3_crumb'];
const ALLD=['r3_teamlab','r3_teamchips','r3_sum','r3_tiles','r3_tabn',...MAPDRAWS,'r3_foot','r3_hsn','r3_hssum','r3_hs','r3_hsdet','r3_csum','r3_coll'];
const redrawAll=()=>{cache=null;syncChips();ALLD.forEach((n)=>draw(n));};
const redrawMap=()=>{syncChips();MAPDRAWS.forEach((n)=>draw(n));};

/* ---------- controls ---------- */
draw('r3_teamlab',(e)=>{const ts=teamsAll();if(!ts.length){e.textContent='Teams';return;}const sel=ts.filter((t)=>selTeams().has(t.tid));const n=sel.length;
  e.replaceChildren(el('span',{text:n===ts.length?'All 12 teams':n===0?'No teams':n<=3?sel.map((t)=>t.abbr).join(', '):n+' teams'}),...(n>0&&n<=6?sel.map((t)=>{const src=logoSrc(t.tid);return src?el('img',{src,alt:''}):null;}):[]),el('span',{class:'r3-caret',text:'▾'}));});
draw('r3_teamchips',(box)=>{const ts=teamsAll();box.replaceChildren(...ts.map((t)=>{const s2=logoSrc(t.tid);const cb=el('input',{type:'checkbox','data-r3t':t.tid});cb.checked=selTeams().has(t.tid);cb.addEventListener('change',()=>{const S=selTeams();if(cb.checked)S.add(t.tid);else S.delete(t.tid);R.pick=null;redrawAll();});
  return el('label',{class:'r3-ddi'+(t.closed?' x':'')},cb,el('i',{style:'background:'+tcol(t.tid)}),s2?el('img',{src:s2,alt:''}):el('span'),el('span',{text:t.team+(t.closed?' (closed)':'')}));}));});
$$('[data-rall]').forEach((b)=>b.addEventListener('click',()=>{const v=b.dataset.rall;R.teams=new Set(v==='0'?[]:teamsAll().filter((t)=>v==='1'||!t.closed).map((t)=>t.tid));R.pick=null;redrawAll();}));
document.addEventListener('click',(e)=>{const d=document.getElementById('r3teams');if(d&&d.open&&!d.contains(e.target))d.open=false;});
const setRange=()=>{if(R.from>R.to){const x=R.from;R.from=R.to;R.to=x;}R.seasons=new Set(SEASONS.filter((y)=>y>=R.from&&y<=R.to));R.pick=null;redrawAll();};
const rf=document.getElementById('r3from'),rt=document.getElementById('r3to');if(rf)rf.addEventListener('change',()=>{R.from=+rf.value;setRange();});if(rt)rt.addEventListener('change',()=>{R.to=+rt.value;setRange();});
const bindSel=(id,key,f)=>{const s2=document.getElementById(id);if(s2)s2.addEventListener('change',()=>{R[key]=f?f(s2.value):s2.value;R.pick=null;redrawAll();});};
bindSel('r3mode','mode');bindSel('r3path','path');bindSel('r3role','role');
const rs=document.getElementById('r3reset');if(rs)rs.addEventListener('click',()=>{R.teams=null;R.from=2022;R.to=2026;R.seasons=new Set([2022,2023,2024,2025,2026]);R.mode='roster';R.path='all';R.role='all';R.pick=null;R.focus=null;R.view='counties';R.min1=false;[['r3mode','roster'],['r3path','all'],['r3role','all']].forEach(([i2,v])=>{const s2=document.getElementById(i2);if(s2)s2.value=v;});Object.keys(MV).forEach((k)=>delete MV[k]);redrawAll();});
const showMap=(m)=>{R.map=m;R.pick=null;R.focus=null;$$('[data-rm]').forEach((b)=>b.classList.toggle('on',b.dataset.rm===m));$$('[data-rmap]').forEach((d)=>{d.hidden=d.dataset.rmap!==m;});redrawMap();};
$$('[data-rm]').forEach((b)=>b.addEventListener('click',()=>showMap(b.dataset.rm)));
$$('[data-rv]').forEach((b)=>b.addEventListener('click',()=>{R.view=b.dataset.rv;R.focus=null;R.pick=null;delete MV[R.map];redrawMap();}));
const m1=document.getElementById('r3min1');if(m1)m1.addEventListener('change',()=>{R.min1=m1.checked;redrawMap();});
$$('[data-rz]').forEach((b)=>b.addEventListener('click',()=>{const a=API[R.map];if(a)a.by(+b.dataset.rz);}));
const boxT=(m,b)=>{const D=(rows('w_rec_dims')||[]).find((d)=>d.map===m);if(!D||!b)return d3.zoomIdentity;const k=Math.max(1,Math.min(14,.88*Math.min(D.w/Math.max(1,b.x1-b.x0),D.h/Math.max(1,b.y1-b.y0))));return d3.zoomIdentity.translate(D.w/2-k*(b.x0+b.x1)/2,D.h/2-k*(b.y0+b.y1)/2).scale(k);};
const setFocus=(m,f)=>{R.focus=f?{...f,map:m}:null;R.pick=f?{kind:'area'}:null;if(f&&!f.ins)MV[m]=boxT(m,f);else delete MV[m];redrawMap();};
const focusCounty=(m,s2)=>setFocus(m,{kind:'county',name:s2.name+' County',ids:[String(s2.id)],x0:s2.x0,y0:s2.y0,x1:s2.x1,y1:s2.y1,ins:!!s2.ins});
draw('r3_regions',(box)=>{box.replaceChildren();const rg=(rows('w_rec_regions')||[]).filter((r)=>r.map===R.map);if(!rg.length)return;const ps=players()||[];const T=townMap();
  box.append(el('span',{class:'r3-lab',text:'Zoom to'}),...rg.map((r)=>{const n=ps.filter((p)=>{const t=T[p.town];return t&&r.counties.includes(String(t.county_id));}).length;const on=R.focus&&R.focus.kind==='region'&&R.focus.id===r.id;
    const b=chip({class:'r3-chip'+(on?' on':'')},r.name,el('small',{text:' '+n}));b.addEventListener('click',()=>setFocus(R.map,{kind:'region',id:r.id,name:r.name,ids:r.counties,x0:r.x0,y0:r.y0,x1:r.x1,y1:r.y1}));return b;}));});
draw('r3_crumb',(box)=>{box.replaceChildren();const nm=(MAPS.find((x)=>x[0]===R.map)||[])[1];
  if(R.map==='pl'){box.append(el('span',{class:'r3-sum',text:'Lines run from where players are from to the campus they went to; thicker lines carry more players. Hover a line for the count, select it for the breakdown. Drag to move; Ctrl-scroll or the buttons zoom.'}));return;}
  if(R.focus&&R.focus.map===R.map){const b=chip({class:'r3-chip'},'← All of '+nm);b.addEventListener('click',()=>setFocus(R.map,null));box.append(b,el('span',{class:'r3-crumbt',text:nm+' › '+R.focus.name}),el('span',{class:'r3-sum',text:'Every town shown here, 1-player towns included. Select a town for its breakdown.'}));}
  else box.append(el('span',{class:'r3-sum',text:R.map==='na'?'Drag to move; Ctrl-scroll or the buttons zoom. Select a town or state for its breakdown.':R.view==='counties'?'Select any county, or a region above, to zoom in and see its towns. Drag to move; Ctrl-scroll or the buttons zoom.':'Towns with 2 or more players (tick the box to include all). Select a town for its breakdown.'}));});

/* ---------- summary and tiles ---------- */
draw('r3_sum',(e)=>{const ps=players();if(!ps){e.textContent='—';return;}const n=selTeams().size;const ys=[...R.seasons].sort();e.textContent=ps.length+' players · '+(n===12?'all 12 teams':n+(n===1?' team':' teams'))+' · '+(ys.length?ys.join(', ').replace('2027','2027*'):'no seasons');});
draw('r3_tiles',(box)=>{const ps=players();if(!ps){box.textContent='—';return;}const T=townMap();const placed=ps.filter((p)=>T[p.town]);const c={mi:0,oh:0,in:0,na:0};placed.forEach((p)=>{c[regionOf(T[p.town])]++;});const mi=median(ps.map((p)=>p.miles).filter((x)=>x!==null&&x!==undefined));
  const hs=new Set(ps.filter((p)=>p.hs&&p.hs!=='home').map((p)=>p.hs));const towns=new Set(placed.map((p)=>p.town));
  const t=(v,l,go)=>{const d=el('div',{class:'r3-tile'+(go?' go':'')},el('b',{text:v}),el('span',{text:l}));if(go)d.addEventListener('click',()=>{showMap(go);const x=document.getElementById('w-rmap');if(x&&x.scrollIntoView)x.scrollIntoView({behavior:'smooth',block:'start'});});return d;};
  box.replaceChildren(t(String(ps.length),'players'),t(pct(c.mi,placed.length),c.mi+' from Michigan','mi'),t(pct(c.oh,placed.length),c.oh+' from Ohio','oh'),t(pct(c.in,placed.length),c.in+' from Indiana','in'),t(pct(c.na,placed.length),c.na+' from everywhere else','na'),t(mi===null?'—':mi+' mi','median distance from campus'),t(String(towns.size),'hometowns'),t(String(hs.size),'high schools'));});
draw('r3_tabn',(e)=>{const ps=players();if(!ps||e.dataset.m==='pl'){e.textContent='';return;}const T=townMap();e.textContent=String(ps.filter((p)=>regionOf(T[p.town])===e.dataset.m).length);});

/* ---------- map ---------- */
const RAMP=['#FFFFFF','#B8C3E0','#5B76B8','#223C81','#0B1A40'];
const ramp=(t)=>{const v=Math.max(0,Math.min(1,t))*(RAMP.length-1);const i=Math.min(RAMP.length-2,Math.floor(v));return d3.interpolateRgb(RAMP[i],RAMP[i+1])(v-i);};
const rOf=(n)=>5+2.6*Math.sqrt(n-1);
const teamRows=(teams)=>{const A=TA();return Object.entries(teams||{}).sort((a,b)=>b[1]-a[1]||ORDER().indexOf(a[0])-ORDER().indexOf(b[0])).map(([k,v])=>{const src=logoSrc(k);return [src?el('img',{src,alt:''}):el('span'),el('i',{style:'background:'+tcol(k)}),el('span',{text:(A[k]||{}).team||k}),el('b',{text:String(v)})];});};
const rtip=(box)=>{const t=el('div',{class:'r3-tip',hidden:''});box.append(t);return {show(head,teams,extra,x,y){t.replaceChildren(el('div',{class:'h',text:head}),...teamRows(teams).map((c)=>el('div',{class:'r'},...c)),...(extra?[el('div',{class:'x',text:extra})]:[]));t.hidden=false;const w=t.offsetWidth,h=t.offsetHeight;t.style.left=Math.max(0,Math.min(box.clientWidth-w,x+12))+'px';t.style.top=Math.max(0,y-h-10<0?y+14:y-h-10)+'px';},hide(){t.hidden=true;}};};
const hsLine=(o)=>{const hs=Object.entries(o.hs||{}).sort((a,b)=>b[1]-a[1]).slice(0,3);return hs.length?'High schools: '+hs.map(([k,v])=>k+' '+v).join(', '):'';};
draw('r3_map',(box)=>{const m=box.dataset.m;const sh=rows('w_rec_shapes'),dims=rows('w_rec_dims'),ps=players();box.replaceChildren();if(!sh||!dims||!ps)return;
  const D=dims.find((d)=>d.map===m);if(!D)return;const W0=D.w,H0=D.h;const T=townMap();const A=TA();
  const F=R.focus&&R.focus.map===m?R.focus:null;const inF=(cid)=>!F||F.ids.includes(String(cid));
  const mine=ps.filter((p)=>regionOf(T[p.town])===m);
  const showTowns=m==='na'||!!F||R.view==='towns';
  const pts=showTowns?Object.values(byTown(mine)).filter((o)=>o.t[m]&&(m==='na'||inF(o.t.county_id))&&(m==='na'||F||R.min1||o.n>=2)).sort((a,b)=>b.n-a.n):[];
  const mainPts=pts.filter((o)=>!o.t.ins),insPts=pts.filter((o)=>o.t.ins);
  const svg=d3.select(box).append('svg').attr('viewBox',`0 0 ${W0} ${H0}`).attr('role','img').attr('aria-label',(MAPS.find((x)=>x[0]===m)||[])[1]+' recruiting map');
  svg.append('rect').attr('width',W0).attr('height',H0).attr('fill','#DCE7F3');
  const root=svg.append('g');const ins=svg.append('g');const S=sh.filter((s2)=>s2.map===m);
  const coC={},coT2={};mine.forEach((p)=>{const t=T[p.town];if(t&&t.county_id){const k=String(t.county_id);coC[k]=(coC[k]||0)+1;const q=coT2[k]||(coT2[k]={});q[p.team]=(q[p.team]||0)+1;}});
  const stC={},stT={};if(m==='na'){mine.forEach((p)=>{const t=T[p.town];const k=t.country==='US'?t.region_name:t.country==='CA'?'Canada':t.region_name;stC[k]=(stC[k]||0)+1;const q=stT[k]||(stT[k]={});q[p.team]=(q[p.team]||0)+1;});}
  const maxCo=Math.max(1,...Object.values(coC)),maxSt=Math.max(1,...Object.values(stC));
  const shade=(n,max)=>.22+.68*Math.sqrt(n/max);const DR=(n)=>n==='Dominican Rep.'?'Dominican Republic':n;
  const ln=(sel)=>sel.style('vector-effect','non-scaling-stroke').attr('stroke-linejoin','round');
  const tip=rtip(box);
  root.selectAll(null).data(S.filter((s2)=>s2.kind==='land')).join('path').attr('d',(s2)=>s2.d).attr('fill',(s2)=>m==='na'&&stC[DR(s2.name)]?leadCol(stT[DR(s2.name)]):'#EEF0F4').attr('fill-opacity',(s2)=>m==='na'&&stC[DR(s2.name)]?shade(stC[DR(s2.name)],maxSt):1).attr('stroke','#B8C3E0').attr('stroke-width',.7).call(ln)
    .on('pointermove',(e,s2)=>{if(m!=='na'||!stC[DR(s2.name)])return;const q=d3.pointer(e,box);tip.show(s2.name+' · '+stC[DR(s2.name)],stT[DR(s2.name)],'',q[0],q[1]);}).on('pointerleave',()=>tip.hide());
  if(m==='na'){root.selectAll(null).data(S.filter((s2)=>s2.kind==='state'||s2.kind==='own')).join('path').attr('d',(s2)=>s2.d).attr('stroke','#9AA9D1').attr('stroke-width',.6).call(ln).attr('class','r3-co')
      .attr('fill',(s2)=>s2.kind==='own'?'#D3D9E8':(stC[s2.name]?leadCol(stT[s2.name]):'#FFFFFF')).attr('fill-opacity',(s2)=>s2.kind!=='own'&&stC[s2.name]?shade(stC[s2.name],maxSt):1)
      .on('click',(e,s2)=>{if(s2.kind==='own')showMap({Michigan:'mi',Ohio:'oh',Indiana:'in'}[s2.name]);else if(stC[s2.name]){R.pick={kind:'region',id:s2.name};draw('r3_pick');}})
      .on('pointermove',(e,s2)=>{const q=d3.pointer(e,box);if(s2.kind==='own'){tip.show(s2.name+': open its own map',{},'',q[0],q[1]);return;}if(!stC[s2.name]){tip.hide();return;}tip.show(s2.name+' · '+stC[s2.name]+(stC[s2.name]===1?' player':' players'),stT[s2.name],'',q[0],q[1]);}).on('pointerleave',()=>tip.hide());
    root.selectAll(null).data(S.filter((s2)=>s2.kind==='own')).join('text').attr('x',(s2)=>s2.cx).attr('y',(s2)=>s2.cy).attr('text-anchor','middle').attr('font-size',9).attr('fill','#55607A').text((s2)=>({Michigan:'MI',Ohio:'OH',Indiana:'IN'}[s2.name]));}
  // counties: main map and the Upper Peninsula inset
  const shaded=R.view==='counties'||!!F;
  const coFill=(s2)=>shaded&&coC[s2.id]?leadCol(coT2[s2.id]):'#FFFFFF';
  const coOp=(s2)=>shaded&&coC[s2.id]?(F?(inF(s2.id)?.22:.1):shade(coC[s2.id],maxCo)):1;
  const insBox=S.find((s2)=>s2.kind==='insetbox');
  if(insBox){ins.append('path').attr('d',insBox.d).attr('fill','#DCE7F3').attr('stroke','#16285A').attr('stroke-width',1);ins.append('text').attr('x',insBox.cx).attr('y',insBox.cy).attr('font-size',11).attr('font-weight',700).attr('fill','#16285A').text('Upper Peninsula');}
  const cosAll=S.filter((s2)=>s2.kind==='county');const cosM=cosAll.filter((s2)=>!s2.ins),cosI=cosAll.filter((s2)=>s2.ins);
  const coEv=(sel)=>sel.on('pointermove',(e,s2)=>{const q=d3.pointer(e,box);tip.show(s2.name+' County · '+(coC[s2.id]||0)+((coC[s2.id]||0)===1?' player':' players'),coT2[s2.id]||{},F&&inF(s2.id)?'':'Select to zoom in and see its towns',q[0],q[1]);}).on('pointerleave',()=>tip.hide())
    .on('click',(e,s2)=>{tip.hide();if(F&&F.kind==='county'&&inF(s2.id))return;focusCounty(m,s2);});
  const coP=root.selectAll(null).data(cosM).join('path').attr('class','r3-co').attr('d',(s2)=>s2.d).attr('stroke','#C3CCE0').attr('stroke-width',.6).call(ln).attr('fill',coFill).attr('fill-opacity',coOp).call(coEv);
  const coPI=ins.selectAll(null).data(cosI).join('path').attr('class','r3-co').attr('d',(s2)=>s2.d).attr('stroke','#C3CCE0').attr('stroke-width',.5).attr('fill',coFill).attr('fill-opacity',coOp).call(coEv);
  root.selectAll(null).data(S.filter((s2)=>s2.kind==='outline'&&!s2.ins)).join('path').attr('d',(s2)=>s2.d).attr('fill','none').attr('stroke','#16285A').attr('stroke-width',1.4).call(ln).style('pointer-events','none');
  ins.selectAll(null).data(S.filter((s2)=>s2.kind==='outline'&&s2.ins)).join('path').attr('d',(s2)=>s2.d).attr('fill','none').attr('stroke','#16285A').attr('stroke-width',1).style('pointer-events','none');
  if(F){root.selectAll(null).data(cosM.filter((s2)=>inF(s2.id))).join('path').attr('d',(s2)=>s2.d).attr('fill','none').attr('stroke','#E7131A').attr('stroke-width',2).call(ln).style('pointer-events','none');
    ins.selectAll(null).data(cosI.filter((s2)=>inF(s2.id))).join('path').attr('d',(s2)=>s2.d).attr('fill','none').attr('stroke','#E7131A').attr('stroke-width',1.6).style('pointer-events','none');}
  const places=root.selectAll(null).data(S.filter((s2)=>s2.kind==='place')).join('text').attr('x',(s2)=>s2.cx).attr('y',(s2)=>s2.cy).attr('text-anchor','middle').attr('fill','#6B7488').style('font-style','italic').text((s2)=>s2.name);
  const numOn=R.view==='counties'&&!F&&m!=='na';
  const lbl=(sel)=>sel.attr('text-anchor','middle').attr('dominant-baseline','central').attr('font-weight',700).attr('fill','#fff').attr('stroke','#16285A').style('paint-order','stroke').attr('stroke-linejoin','round').style('pointer-events','none').text((s2)=>coC[s2.id]);
  const coT=root.selectAll(null).data(numOn?cosM.filter((s2)=>coC[s2.id]):[]).join('text').attr('x',(s2)=>s2.cx).attr('y',(s2)=>s2.cy).call(lbl);
  ins.selectAll(null).data(numOn?cosI.filter((s2)=>coC[s2.id]):[]).join('text').attr('x',(s2)=>s2.cx).attr('y',(s2)=>s2.cy).attr('font-size',10).attr('stroke-width',2.2).call(lbl);
  // campuses of the selected teams (hidden while zoomed into an area, where they would cover towns)
  const camp=F?[]:teamsAll().filter((t)=>selTeams().has(t.tid)&&t[m]);
  const cg=root.selectAll(null).data(camp).join('g').style('pointer-events','none');
  cg.append('rect').attr('fill','#fff').attr('stroke','#E7131A').attr('stroke-width',1.4).style('vector-effect','non-scaling-stroke');
  cg.append('image').attr('href',(t)=>logoSrc(t.tid)||'').attr('preserveAspectRatio','xMidYMid meet');
  // towns: one color per dot, the team that has the most players from it (light light gray = tied)
  const mkDots=(g,data)=>{const d=g.selectAll(null).data(data).join('g').attr('class','r3-dot');d.append('circle').attr('fill',(o)=>leadCol(o.teams)).attr('stroke',(o)=>lead(o.teams)==='tie'?'#6B7488':'#fff').attr('stroke-dasharray',(o)=>lead(o.teams)==='tie'?'2 2':null).style('vector-effect','non-scaling-stroke').attr('stroke-width',1.3);
    d.append('text').attr('text-anchor','middle').attr('dominant-baseline','central').attr('fill',(o)=>light(leadCol(o.teams))?'#16285A':'#fff').attr('stroke',(o)=>light(leadCol(o.teams))?'#fff':'#0B1A40').attr('stroke-width',2.2).style('paint-order','stroke').attr('stroke-linejoin','round').attr('font-weight',700).text((o)=>o.n);
    d.on('pointermove',(e,o)=>{const q=d3.pointer(e,box);tip.show(o.t.label+' · '+o.n+(o.n===1?' player':' players'),o.teams,hsLine(o),q[0],q[1]);}).on('pointerleave',()=>tip.hide()).on('click',(e,o)=>{R.pick={kind:'town',id:o.t.id};mark();draw('r3_pick');draw('r3_top');});return d;};
  const dots=mkDots(root,mainPts),dotsI=mkDots(ins,insPts);if(F&&!F.ins)ins.style('display','none');
  dotsI.attr('transform',(o)=>`translate(${o.t[m][0]},${o.t[m][1]})`);dotsI.select('circle').attr('r',(o)=>Math.min(9,4+2.5*Math.sqrt(o.n-1)));dotsI.select('text').attr('font-size',8);
  const names=root.selectAll(null).data(mainPts).join('text').attr('fill','#16285A').style('paint-order','stroke').attr('stroke','#fff').attr('stroke-linejoin','round').attr('font-weight',600).style('pointer-events','none').text((o)=>o.t.city);
  const mark=()=>{const p=R.pick;const on=(o)=>p&&p.kind==='town'&&p.id===o.t.id;[dots,dotsI].forEach((d)=>d.select('circle').attr('stroke',(o)=>on(o)?'#E7131A':'#fff').attr('stroke-width',(o)=>on(o)?3.2:1.3));};
  const fs0=m==='na'?11:12;
  const rS=(n,k)=>(5+2.6*Math.sqrt(n-1))/k;const paint=(k)=>{const sc=1/k;dots.attr('transform',(o)=>`translate(${o.t[m][0]},${o.t[m][1]})`);dots.select('circle').attr('r',(o)=>rS(o.n,k));dots.select('text').attr('font-size',(o)=>Math.min(12,7+1.6*Math.sqrt(o.n))/k).style('display',(o)=>rS(o.n,k)*k<5?'none':null);
    places.attr('font-size',(fs0-1)/k);coT.attr('font-size',12/k).attr('stroke-width',2.6/k);
    cg.attr('transform',(t)=>`translate(${t[m][0]},${t[m][1]})`);const z=(m==='na'?8:12)/k;cg.select('rect').attr('x',-z).attr('y',-z*.7).attr('width',2*z).attr('height',1.4*z).attr('rx',2/k);cg.select('image').attr('x',-z*.9).attr('y',-z*.6).attr('width',1.8*z).attr('height',1.2*z);
    const f=fs0/k,boxes=[];const hit=(a)=>boxes.some((b)=>a.x0<b.x1&&a.x1>b.x0&&a.y0<b.y1&&a.y1>b.y0);mainPts.forEach((o)=>{const r=rS(o.n,k);boxes.push({x0:o.t[m][0]-r,x1:o.t[m][0]+r,y0:o.t[m][1]-r,y1:o.t[m][1]+r});});
    if(insBox&&!(F&&!F.ins)){const t0=d3.zoomTransform(svg.node());boxes.push({x0:(8-t0.x)/k,y0:(8-t0.y)/k,x1:(228-t0.x)/k,y1:(112-t0.y)/k});}
    const pos=new Map();const lim=F?40:k<1.5?14:k<3?30:60;let shown=0;
    mainPts.forEach((o)=>{if(shown>=lim)return;const r=rS(o.n,k),tw=o.t.city.length*f*.56,[x,y]=o.t[m];for(const [dx,an] of [[1,'start'],[-1,'end']]){const lx=x+dx*(r+2/k);const x0=an==='start'?lx:lx-tw;const b={x0,x1:x0+tw,y0:y-f*.6,y1:y+f*.6};if(b.x0<0||b.x1>W0||hit(b))continue;boxes.push(b);pos.set(o,{lx,an});shown++;return;}});
    names.style('display',(o)=>pos.has(o)?null:'none').attr('x',(o)=>pos.has(o)?pos.get(o).lx:0).attr('y',(o)=>o.t[m][1]).attr('dominant-baseline','central').attr('text-anchor',(o)=>pos.has(o)?pos.get(o).an:'start').attr('font-size',f).attr('stroke-width',3/k);};
  const zoom=d3.zoom().scaleExtent([1,14]).extent([[0,0],[W0,H0]]).translateExtent([[0,0],[W0,H0]]).filter((e)=>{if(e.type==='wheel')return e.ctrlKey||e.metaKey;if(e.type==='touchstart')return e.touches.length>1;return !e.button;}).on('zoom',(e)=>{root.attr('transform',e.transform);MV[m]=e.transform;paint(e.transform.k);});
  svg.call(zoom);
  const go=(t)=>{if(typeof svg.transition==='function'&&svg.node().getScreenCTM)svg.transition().duration(400).call(zoom.transform,t);else svg.call(zoom.transform,t);};
  API[m]={by:(f)=>{if(!f){if(R.focus){setFocus(m,null);return;}go(d3.zoomIdentity);}else if(typeof svg.transition==='function'&&svg.node().getScreenCTM)svg.transition().duration(250).call(zoom.scaleBy,f);else svg.call(zoom.scaleBy,f);},to:(x,y,k)=>go(d3.zoomIdentity.translate(W0/2-k*x,H0/2-k*y).scale(k)),mark};
  const t0=MV[m]||d3.zoomIdentity;root.attr('transform',t0);paint(t0.k);if(MV[m])svg.call(zoom.transform,t0);mark();
});
draw('r3_legend',(e)=>{e.replaceChildren();const ps=players();if(!ps)return;
  const keys=teamsAll().filter((t)=>selTeams().has(t.tid)).map((t)=>{const src=logoSrc(t.tid);return el('span',{class:'r3-lk'},el('i',{style:'background:'+tcol(t.tid)}),src?el('img',{src,alt:''}):null,t.abbr);});
  const counties=R.map!=='na'&&R.map!=='pl'&&R.view==='counties'&&!R.focus;
  if(R.map==='pl')e.append(el('span',{text:'Line color = team (map colors below); line width = players. Dark dots are where players are from, sized by players.'}));else e.append(el('span',{text:counties?'Each county takes the color of the team with the most players from it (light light gray = tied); darker = more players. The number is players from that county.':R.map==='na'?'Dots: players from a town, colored by the team with the most players from it (light light gray = tied). States and countries are shaded the same way; Michigan, Ohio and Indiana have their own maps.':'Dots: players from a town, sized by count and colored by the team with the most players from it (light light gray = tied). Hover for every team.'}));
  e.append(el('div',{style:'flex-basis:100%;display:flex;flex-wrap:wrap;margin-top:2px'},...keys),el('div',{class:'r3-note',style:'flex-basis:100%',text:'Map colors come from each school\'s own colors. Schools whose main color is navy use a second school color (Cornerstone gold, Michigan-Dearborn maize, Lawrence Tech light blue, Indiana Tech silver, Siena Heights green) so the map can tell them apart; Cleary keeps navy.'}));});
draw('r3_mapnote',(e)=>{const ps=players();if(!ps){e.textContent='';return;}const T=townMap();const none=ps.filter((p)=>!T[p.town]).length;const off=R.map==='na'?ps.filter((p)=>{const t=T[p.town];return t&&regionOf(t)==='na'&&!t.na;}).length:0;
  e.textContent=(none?none+' selected player'+(none===1?' has':'s have')+' no usable hometown on the roster and are not on any map. ':'')+(off?off+' player'+(off===1?' is':'s are')+' from places off this map; they are in the list at right. ':'')+'Towns are placed by the hometown each roster lists; a few misspelled or state-less entries were matched by hand using the high school listed (see Notes).';});


/* ---------- pipelines ---------- */
const coCent=()=>{const m={};(rows('w_rec_shapes')||[]).forEach((s2)=>{if(s2.map==='gl'&&s2.kind==='county')m[String(s2.id)]=s2;});return m;};
const ST_AB={MI:'Mich.',OH:'Ohio',IN:'Ind.'};
const originOf=(t,CC)=>{if(!t)return null;if(R.plGroup==='county'&&t.country==='US'&&['MI','OH','IN'].includes(t.admin)&&t.county_id&&CC[String(t.county_id)]){const c=CC[String(t.county_id)];return {id:'c'+t.county_id,name:c.name+' Co., '+ST_AB[t.admin],x:c.cx,y:c.cy};}
  if(!t.gl)return null;return {id:'t'+t.id,name:t.label,x:t.gl[0],y:t.gl[1]};};
const pipes=()=>{const ps=players();if(!ps)return null;const T=townMap();const CC=coCent();const L={},O={},off={};
  ps.forEach((p)=>{const t=T[p.town];if(!t)return;const o=originOf(t,CC);if(!o){const k=t.label;const q=off[k]||(off[k]={name:k,n:0,teams:{}});q.n++;q.teams[p.team]=(q.teams[p.team]||0)+1;return;}
    const og=O[o.id]||(O[o.id]={...o,n:0,teams:{}});og.n++;og.teams[p.team]=(og.teams[p.team]||0)+1;const k=o.id+'|'+p.team;const l=L[k]||(L[k]={key:k,o:og,team:p.team,n:0});l.n++;});
  return {lines:Object.values(L).sort((a,b)=>b.n-a.n),origins:Object.values(O),off:Object.values(off).sort((a,b)=>b.n-a.n)};};
draw('r3_pipectl',(box)=>{box.replaceChildren();if(R.map!=='pl')return;const sel=(id,opts,val,f)=>{const e=el('select',{class:'r3-sel',id},...opts.map(([v,t])=>el('option',{value:v,text:t})));e.value=String(val);e.addEventListener('change',()=>{f(e.value);R.pick=null;redrawMap();});return e;};
  const ts=teamsAll().filter((t)=>selTeams().has(t.tid));
  box.append(el('span',{class:'r3-lab',text:'Lines from'}),sel('r3plg',[['county','Counties (MI, OH, IN)'],['town','Hometowns']],R.plGroup,(v)=>{R.plGroup=v;}),
    el('span',{class:'r3-lab',text:'Show'}),sel('r3plm',[['1','Every pipeline'],['2','2+ players'],['3','3+ players'],['5','5+ players'],['8','8+ players']],R.plMin,(v)=>{R.plMin=+v;}),
    el('span',{class:'r3-lab',text:'Highlight'}),sel('r3plt',[['','All selected teams'],...ts.map((t)=>[t.tid,t.team])],R.plTeam,(v)=>{R.plTeam=v;}));});
draw('r3_pipe',(box)=>{const sh=rows('w_rec_shapes'),dims=rows('w_rec_dims'),P=pipes();box.replaceChildren();if(!sh||!dims||!P)return;
  const D=dims.find((d)=>d.map==='gl');if(!D)return;const W0=D.w,H0=D.h;const S=sh.filter((s2)=>s2.map==='gl');const A=TA();
  const svg=d3.select(box).append('svg').attr('viewBox',`0 0 ${W0} ${H0}`).attr('role','img').attr('aria-label','Recruiting pipelines to each campus');
  svg.append('rect').attr('width',W0).attr('height',H0).attr('fill','#DCE7F3');const root=svg.append('g');const tip=rtip(box);
  const ln=(sel)=>sel.style('vector-effect','non-scaling-stroke').attr('stroke-linejoin','round');
  root.selectAll(null).data(S.filter((s2)=>s2.kind==='land')).join('path').attr('d',(s2)=>s2.d).attr('fill','#EEF0F4').attr('stroke','#B8C3E0').attr('stroke-width',.6).call(ln);
  root.selectAll(null).data(S.filter((s2)=>s2.kind==='county')).join('path').attr('d',(s2)=>s2.d).attr('fill','#FFFFFF').attr('stroke','#E1E6F0').attr('stroke-width',.5).call(ln);
  root.selectAll(null).data(S.filter((s2)=>s2.kind==='outline')).join('path').attr('d',(s2)=>s2.d).attr('fill','none').attr('stroke','#16285A').attr('stroke-width',1.1).call(ln);
  const places=root.selectAll(null).data(S.filter((s2)=>s2.kind==='place')).join('text').attr('x',(s2)=>s2.cx).attr('y',(s2)=>s2.cy).attr('text-anchor','middle').attr('fill','#6B7488').style('font-style','italic').style('pointer-events','none').text((s2)=>s2.name);
  const camp={};teamsAll().forEach((t)=>{if(t.gl)camp[t.tid]=t.gl;});
  const lines=P.lines.filter((l)=>l.n>=R.plMin&&camp[l.team]);const ORD=ORDER();
  const hl=R.plTeam;const pk=R.pick&&R.pick.kind==='pipe'?R.pick:null;
  const curve=(l)=>{const [x0,y0]=[l.o.x,l.o.y],[x1,y1]=camp[l.team];const dx=x1-x0,dy=y1-y0,d=Math.hypot(dx,dy)||1;const off=(.12+.025*(ORD.indexOf(l.team)%6))*d;const mx=(x0+x1)/2-dy/d*off,my=(y0+y1)/2+dx/d*off;return `M${x0},${y0}Q${mx},${my} ${x1},${y1}`;};
  const op=(l)=>pk?(pk.key===l.key?.95:(pk.o===l.o.id?.55:.06)):hl?(l.team===hl?.8:.05):.5;
  const lp=root.selectAll(null).data([...lines].sort((a,b)=>a.n-b.n)).join('path').attr('d',curve).attr('fill','none').attr('stroke',(l)=>tcol(l.team)).attr('stroke-linecap','round').call(ln)
    .attr('stroke-width',(l)=>1+1.7*Math.sqrt(l.n)).attr('stroke-opacity',op).style('cursor','pointer')
    .on('pointermove',(e,l)=>{const q=d3.pointer(e,box);tip.show(l.o.name+' → '+(A[l.team]||{}).team+' · '+l.n+(l.n===1?' player':' players'),{[l.team]:l.n},'Everyone from here: '+l.o.n+'. Select for the breakdown.',q[0],q[1]);}).on('pointerleave',()=>tip.hide())
    .on('click',(e,l)=>{tip.hide();R.pick={kind:'pipe',key:l.key,o:l.o.id,team:l.team};redrawMap();});
  const origins=P.origins.filter((o)=>lines.some((l)=>l.o.id===o.id));
  const og=root.selectAll(null).data(origins).join('circle').attr('cx',(o)=>o.x).attr('cy',(o)=>o.y).attr('fill','#16285A').attr('stroke','#fff').style('vector-effect','non-scaling-stroke').attr('stroke-width',1).style('cursor','pointer')
    .on('pointermove',(e,o)=>{const q=d3.pointer(e,box);tip.show(o.name+' · '+o.n+(o.n===1?' player':' players'),o.teams,'',q[0],q[1]);}).on('pointerleave',()=>tip.hide())
    .on('click',(e,o)=>{tip.hide();R.pick={kind:'pipe',key:'',o:o.id,team:''};redrawMap();});
  const onames=root.selectAll(null).data(origins.filter((o)=>o.n>=Math.max(6,R.plMin*2)).sort((a,b)=>b.n-a.n).slice(0,14)).join('text').attr('fill','#16285A').attr('font-weight',600).style('paint-order','stroke').attr('stroke','#fff').attr('stroke-linejoin','round').style('pointer-events','none').text((o)=>o.name.replace(/ Co\., .*$/,''));
  const cs=teamsAll().filter((t)=>selTeams().has(t.tid)&&t.gl);
  const cg=root.selectAll(null).data(cs).join('g').style('cursor','pointer').on('click',(e,t)=>{R.plTeam=R.plTeam===t.tid?'':t.tid;R.pick=null;redrawMap();})
    .on('pointermove',(e,t)=>{const q=d3.pointer(e,box);const tot=lines.filter((l)=>l.team===t.tid).reduce((a,l)=>a+l.n,0);tip.show(t.team+' campus ('+t.campus+')',{[t.tid]:tot},'Players on the lines shown. Select to highlight this team.',q[0],q[1]);}).on('pointerleave',()=>tip.hide());
  cg.append('rect').attr('fill','#fff').attr('stroke',(t)=>tcol(t.tid)).attr('stroke-width',2).style('vector-effect','non-scaling-stroke');cg.append('image').attr('href',(t)=>logoSrc(t.tid)||'').attr('preserveAspectRatio','xMidYMid meet');
  const paint=(k)=>{og.attr('r',(o)=>(2.2+1.1*Math.sqrt(o.n))/k);places.attr('font-size',11/k);onames.attr('x',(o)=>o.x+(4+1.1*Math.sqrt(o.n))/k).attr('y',(o)=>o.y).attr('dominant-baseline','central').attr('font-size',11/k).attr('stroke-width',3/k);
    const z=13/k;cg.attr('transform',(t)=>`translate(${t.gl[0]},${t.gl[1]})`);cg.select('rect').attr('x',-z).attr('y',-z*.75).attr('width',2*z).attr('height',1.5*z).attr('rx',2/k);cg.select('image').attr('x',-z*.88).attr('y',-z*.62).attr('width',1.76*z).attr('height',1.24*z);};
  const zoom=d3.zoom().scaleExtent([1,10]).extent([[0,0],[W0,H0]]).translateExtent([[0,0],[W0,H0]]).filter((e)=>{if(e.type==='wheel')return e.ctrlKey||e.metaKey;if(e.type==='touchstart')return e.touches.length>1;return !e.button;}).on('zoom',(e)=>{root.attr('transform',e.transform);MV.pl=e.transform;paint(e.transform.k);});
  svg.call(zoom);API.pl={by:(f)=>{if(!f)svg.call(zoom.transform,d3.zoomIdentity);else svg.call(zoom.scaleBy,f);},mark:()=>{}};
  const t0=MV.pl||d3.zoomIdentity;root.attr('transform',t0);paint(t0.k);if(MV.pl)svg.call(zoom.transform,t0);
});

/* ---------- side lists ---------- */
const stack=(teams)=>{const tot=Object.values(teams).reduce((a,b)=>a+b,0);const d=el('div',{class:'r3-stack'});ORDER().forEach((k)=>{if(teams[k])d.append(el('i',{style:`width:${100*teams[k]/tot}%;background:${tcol(k)}`,title:(TA()[k]||{}).abbr+' '+teams[k]}));});return d;};
const li=(rk,name,n,teams,on,click)=>{const d=el('div',{class:'r3-li'+(on?' on':''),role:'button',tabindex:'0'},el('span',{class:'k',text:rk}),el('span',{class:'nm'},el('span',{text:name}),teams?stack(teams):null),el('span',{class:'n',text:String(n)}));d.addEventListener('click',click);d.addEventListener('keydown',(ev)=>{if(ev.key==='Enter')click();});return d;};
draw('r3_toph',(e)=>{e.textContent=R.map==='pl'?'Biggest pipelines':R.map==='na'?'States, provinces and countries':R.focus&&R.focus.map===R.map?'Top towns in '+R.focus.name:'Top towns';});
const coShape=(id)=>(rows('w_rec_shapes')||[]).find((s2)=>s2.kind==='county'&&String(s2.id)===String(id));
const inFocus=(t)=>!(R.focus&&R.focus.map===R.map)||R.focus.ids.includes(String(t.county_id));
draw('r3_top2h',(e)=>{e.textContent=R.map==='pl'?'From outside this map':R.map==='na'?'Top towns':R.focus&&R.focus.map===R.map?'Counties in '+R.focus.name:'Top counties';});
const regionList=()=>{const ps=players()||[];const T=townMap();const m={};ps.forEach((p)=>{const t=T[p.town];if(!t||regionOf(t)!=='na')return;const k=t.region_name;const o=m[k]||(m[k]={n:0,teams:{},country:t.country});o.n++;o.teams[p.team]=(o.teams[p.team]||0)+1;});return Object.entries(m).sort((a,b)=>b[1].n-a[1].n||a[0].localeCompare(b[0]));};
draw('r3_top',(box)=>{const ps=players();box.replaceChildren();if(!ps)return;const T=townMap();
  if(R.map==='pl'){const P=pipes();const A=TA();const L=P.lines.filter((l)=>!R.plTeam||l.team===R.plTeam).slice(0,20);box.append(...L.map((l,i)=>li(i+1,l.o.name.replace(/, (Mich\.|Ohio|Ind\.)$/,'')+' → '+(A[l.team]||{}).abbr,l.n,{[l.team]:l.n},R.pick&&R.pick.key===l.key,()=>{R.pick={kind:'pipe',key:l.key,o:l.o.id,team:l.team};redrawMap();})));return;}
  if(R.map==='na'){const L=regionList();box.append(...L.map(([k,o],i)=>li(i+1,k,o.n,o.teams,R.pick&&R.pick.kind==='region'&&R.pick.id===k,()=>{R.pick={kind:'region',id:k};draw('r3_pick');draw('r3_top');})));if(!L.length)box.append(el('p',{class:'r3-note',text:'No players from outside Michigan, Ohio and Indiana with these filters.'}));return;}
  const agg=Object.values(byTown(ps.filter((p)=>regionOf(T[p.town])===R.map&&inFocus(T[p.town])))).sort((a,b)=>b.n-a.n||a.t.city.localeCompare(b.t.city)).slice(0,15);let rk=0,prev=null;
  box.append(...agg.map((o,i)=>{if(o.n!==prev){rk=i+1;prev=o.n;}return li(rk,o.t.city,o.n,o.teams,R.pick&&R.pick.kind==='town'&&R.pick.id===o.t.id,()=>{if(!(R.focus&&R.focus.map===R.map)){const c=coShape(o.t.county_id);if(c)focusCounty(R.map,c);}R.pick={kind:'town',id:o.t.id};const a=API[R.map];if(a)a.mark();draw('r3_pick');draw('r3_top');});}));
  if(!agg.length)box.append(el('p',{class:'r3-note',text:'No players from this state with these filters.'}));});
draw('r3_top2',(box)=>{const ps=players();box.replaceChildren();if(!ps)return;const T=townMap();
  if(R.map==='pl'){const P=pipes();box.append(...P.off.slice(0,15).map((o,i)=>li(i+1,o.name,o.n,o.teams,false,()=>{})));if(!P.off.length)box.append(el('p',{class:'r3-note',text:'Every selected player is from inside this map.'}));return;}
  if(R.map==='na'){const agg=Object.values(byTown(ps.filter((p)=>regionOf(T[p.town])==='na'))).sort((a,b)=>b.n-a.n||a.t.label.localeCompare(b.t.label)).slice(0,12);box.append(...agg.map((o,i)=>li(i+1,o.t.label,o.n,o.teams,R.pick&&R.pick.kind==='town'&&R.pick.id===o.t.id,()=>{R.pick={kind:'town',id:o.t.id};const a=API.na;if(a){a.mark();if(o.t.na)a.to(o.t.na[0],o.t.na[1],4);}draw('r3_pick');draw('r3_top2');})));return;}
  const m={};ps.forEach((p)=>{const t=T[p.town];if(!t||regionOf(t)!==R.map||!t.county_id||!inFocus(t))return;const o=m[t.county_id]||(m[t.county_id]={id:t.county_id,name:t.county,n:0,teams:{}});o.n++;o.teams[p.team]=(o.teams[p.team]||0)+1;});
  const L=Object.values(m).sort((a,b)=>b.n-a.n||a.name.localeCompare(b.name)).slice(0,12);box.append(...L.map((o,i)=>li(i+1,o.name,o.n,o.teams,R.pick&&R.pick.kind==='county'&&R.pick.id===o.id,()=>{const c=coShape(o.id);if(c)focusCounty(R.map,c);})));});
draw('r3_pick',(box)=>{const ps=players();box.replaceChildren();if(!ps)return;const T=townMap();const A=TA();const P=R.pick;
  if(!P&&R.map==='pl'){box.append(el('h3',{text:'Select a line, a starting point or a campus'}),el('p',{class:'r3-note',text:'Each line runs from where players are from to the campus they went to; thicker = more players. Select a campus logo to highlight that team.'}));return;}
  if(!P){box.append(el('h3',{text:R.map==='na'?'Select a town or a state':'Select a county or a region'}),el('p',{class:'r3-note',text:'Its players by team, the high schools they came from, and how they got there will show here.'}));return;}
  let sel=[],title='';
  if(P.kind==='pipe'&&R.map==='pl'){const CC=coCent();sel=ps.filter((p)=>{const o=originOf(T[p.town],CC);return o&&o.id===P.o&&(!P.team||p.team===P.team);});const o0=sel.length?originOf(T[sel[0].town],CC):null;title=(o0?o0.name:'')+(P.team?' → '+((A[P.team]||{}).team||P.team):'');}
  else if(P.kind==='area'&&R.focus){const F=R.focus;sel=ps.filter((p)=>{const t=T[p.town];return t&&regionOf(t)===F.map&&F.ids.includes(String(t.county_id));});title=F.name;}
  else if(P.kind==='town'){sel=ps.filter((p)=>p.town===P.id);title=(T[P.id]||{}).label||P.id;}
  else if(P.kind==='county'){sel=ps.filter((p)=>{const t=T[p.town];return t&&t.county_id===P.id;});title=P.name+' County, '+({mi:'Mich.',oh:'Ohio',in:'Ind.'}[R.map]||'');}
  else{sel=ps.filter((p)=>{const t=T[p.town];return t&&regionOf(t)==='na'&&t.region_name===P.id;});title=P.id;}
  box.append(el('h3',{text:title+' · '+sel.length+(sel.length===1?' player':' players')}));
  const tc={};sel.forEach((p)=>{tc[p.team]=(tc[p.team]||0)+1;});
  const kv=(pairs)=>el('div',{class:'r3-kv'},...pairs.flatMap(([a,b])=>[el('span',{text:a}),el('b',{text:String(b)})]));
  box.append(stack(tc),el('div',{class:'r3-kvt'},...teamRows(tc).flat()));
  const HN=hsName();const hc={};sel.forEach((p)=>{const hn=p.hs==='home'?'Home school':(p.hs&&HN[p.hs])||(p.hsname?p.hsname:'');if(hn)hc[hn]=(hc[hn]||0)+1;});const hl=Object.entries(hc).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).slice(0,8);
  if(hl.length)box.append(el('div',{class:'pc-sec',text:'High schools'}),kv(hl));
  const rc={hs:0,juco:0,four:0};sel.forEach((p)=>{rc[p.route]++;});box.append(el('div',{class:'pc-sec',text:'Path to the team'}),kv([['No previous college listed',rc.hs],['From a junior college',rc.juco],['From a four-year college',rc.four]]));
  const yc={};sel.forEach((p)=>{if(R.mode==='new'){yc[p.arr]=(yc[p.arr]||0)+1;}else p.seasons.filter((y)=>R.seasons.has(y)).forEach((y)=>{yc[y]=(yc[y]||0)+1;});});
  box.append(el('div',{class:'pc-sec',text:R.mode==='new'?'First season with the team':'Players on a roster, by season'}),kv(Object.keys(yc).sort().map((y)=>[y==='2021'?'2021 or earlier':y==='2027'?'2027*':y,yc[y]])));
  if(P.kind==='pipe'){const clr=el('button',{type:'button',class:'r3-chip mini',text:'Clear selection'});clr.addEventListener('click',()=>{R.pick=null;redrawMap();});box.append(el('div',{style:'margin-top:6px'},clr));}
  else if(P.kind!=='area'){const clr=el('button',{type:'button',class:'r3-chip mini',text:R.focus?'Back to '+R.focus.name:'Clear selection'});clr.addEventListener('click',()=>{R.pick=R.focus?{kind:'area'}:null;const a=API[R.map];if(a)a.mark();['r3_pick','r3_top','r3_top2'].forEach((n)=>draw(n));});box.append(el('div',{style:'margin-top:6px'},clr));}});

/* ---------- footprint table ---------- */
const td=(tr,v,cls,sv)=>{const c=document.createElement('td');c.textContent=v===undefined||v===null||v===''?'':String(v);if(cls)c.className=cls;if(sv!==undefined)c.dataset.v=sv;tr.append(c);return c;};
draw('r3_foot',(tb)=>{const all=rows('w_rec_players');tb.replaceChildren();if(!all)return;const T=townMap();
  teamsAll().forEach((t)=>{const ps=all.filter((p)=>p.team===t.tid&&passBase(p,true));const tr=document.createElement('tr');if(selTeams().has(t.tid)&&selTeams().size<teamsAll().length)tr.className='on';
    const c0=wTeam(tr,t.team);if(t.closed){c0.textContent=t.team+' (closed)';}c0.dataset.v=t.team;
    const placed=ps.filter((p)=>T[p.town]);const reg={mi:0,oh:0,in:0,us:0,ca:0,x:0};placed.forEach((p)=>{const z=T[p.town];const r=regionOf(z);if(r!=='na')reg[r]++;else if(z.country==='US')reg.us++;else if(z.country==='CA')reg.ca++;else reg.x++;});
    const n=placed.length;const P=(k)=>td(tr,pct(reg[k],n),'c',n?reg[k]/n:'');
    td(tr,ps.length,'n');P('mi');P('oh');P('in');P('us');P('ca');P('x');
    const ms=ps.map((p)=>p.miles).filter((x)=>x!==null&&x!==undefined);td(tr,pct(ms.filter((x)=>x<=50).length,ms.length),'c',ms.length?ms.filter((x)=>x<=50).length/ms.length:'');const md=median(ms);td(tr,md===null?'':md,'c',md===null?'':md);
    const rc={hs:0,juco:0,four:0};ps.forEach((p)=>{rc[p.route]++;});['hs','juco','four'].forEach((k)=>td(tr,pct(rc[k],ps.length),'c',ps.length?rc[k]/ps.length:''));
    const tw={};placed.forEach((p)=>{tw[p.town]=(tw[p.town]||0)+1;});const tt=Object.entries(tw).sort((a,b)=>b[1]-a[1])[0];td(tr,tt?T[tt[0]].label+' ('+tt[1]+')':'');
    const HN=hsName();const hc={};ps.forEach((p)=>{const hn=p.hs&&HN[p.hs];if(hn)hc[hn]=(hc[hn]||0)+1;});const th=Object.entries(hc).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]))[0];td(tr,th?th[0]+' ('+th[1]+')':'');
    tb.append(tr);});});

/* ---------- high schools ---------- */
$$('[data-hst]').forEach((b)=>b.addEventListener('click',()=>{R.hsSt=b.dataset.hst;R.hsPick=null;$$('[data-hst]').forEach((o)=>o.classList.toggle('on',o===b));['r3_hs','r3_hssum','r3_hsdet'].forEach((n)=>draw(n));}));
const q=document.getElementById('r3hsq');if(q)q.addEventListener('input',()=>{R.hsQ=q.value.trim().toLowerCase();draw('r3_hs');draw('r3_hssum');});
const hm=document.getElementById('r3hsmin');if(hm)hm.addEventListener('change',()=>{R.hsMin=+hm.value;draw('r3_hs');draw('r3_hssum');});
const hsAgg=(st)=>{const ps=players()||[];const H={};(rows('w_rec_hs')||[]).forEach((h)=>{H[h.key]=h;});const T=townMap();const m={};
  ps.forEach((p)=>{if(!p.hs||p.hs==='home'||!H[p.hs]||H[p.hs].st!==st)return;const o=m[p.hs]||(m[p.hs]={h:H[p.hs],n:0,teams:{},ys:new Set(),county:{}});o.n++;o.teams[p.team]=(o.teams[p.team]||0)+1;p.seasons.forEach((y)=>{if(R.mode==='new'||R.seasons.has(y))o.ys.add(y);});const t=T[p.town];if(t&&t.county)o.county[t.county]=(o.county[t.county]||0)+1;});
  return Object.values(m).map((o)=>({...o,cty:(Object.entries(o.county).sort((a,b)=>b[1]-a[1])[0]||[''])[0]}));};
draw('r3_hsn',(e)=>{e.textContent=' '+hsAgg(e.dataset.st).length;});
const hsShown=()=>hsAgg(R.hsSt).filter((o)=>o.n>=R.hsMin&&(!R.hsQ||[o.h.name,o.h.town,o.cty,...(o.h.spellings||[])].join(' ').toLowerCase().includes(R.hsQ)));
draw('r3_hssum',(e)=>{const a=hsAgg(R.hsSt);const s=hsShown();const multi=a.filter((o)=>Object.keys(o.teams).length>=3).length;const tot=a.reduce((x,o)=>x+o.n,0);
  e.textContent=s.length+' of '+a.length+' schools shown · '+tot+' players · '+multi+' school'+(multi===1?'':'s')+' sent players to 3 or more WHAC teams';});
const logoTh=(tid)=>{const A=TA();const s=logoSrc(tid);const th=el('th',{class:'c',title:(A[tid]||{}).team},s?el('span',{class:'w2-logo'},el('img',{src:s,alt:''})):null,el('br'),(A[tid]||{}).abbr||tid);return th;};
const teamCols=()=>teamsAll().filter((t)=>selTeams().has(t.tid));
draw('r3_hs',(t)=>{t.replaceChildren();const ps=players();if(!ps)return;const cols=teamCols();const L=hsShown().sort((a,b)=>b.n-a.n||a.h.name.localeCompare(b.h.name));
  const th=t.createTHead().insertRow();['High school','Town','County','Players'].forEach((x)=>th.append(el('th',{text:x})));cols.forEach((c)=>th.append(logoTh(c.tid)));['Teams','Seasons'].forEach((x)=>th.append(el('th',{text:x})));
  const tb=t.createTBody();L.forEach((o)=>{const tr=tb.insertRow();if(R.hsPick===o.h.key)tr.className='on';td(tr,o.h.name);td(tr,o.h.town);td(tr,o.cty);td(tr,o.n,'n');
    const mx=Math.max(...Object.values(o.teams));cols.forEach((c)=>{const v=o.teams[c.tid]||0;td(tr,v||'',v?(v>=3?'c hot2':v===mx&&v>=2?'c hot':'c'):'c',v||'');});
    const nt=Object.keys(o.teams).length;td(tr,nt,'c');const ys=[...o.ys].sort();td(tr,ys.length?(ys[0]===ys[ys.length-1]?String(ys[0]):ys[0]+'-'+String(ys[ys.length-1]).slice(2)):'','c');
    tr.addEventListener('click',(e)=>{if(e.target.closest('.wlink'))return;R.hsPick=o.h.key;$$('tr.on',tb).forEach((x)=>x.classList.remove('on'));tr.classList.add('on');draw('r3_hsdet');});});
  if(!L.length){const tr=tb.insertRow();const c=td(tr,'No schools match these filters.');c.colSpan=6+cols.length;}});
draw('r3_hsdet',(box)=>{box.replaceChildren();const ps=players();if(!ps)return;const H=(rows('w_rec_hs')||[]).find((h)=>h.key===R.hsPick);
  if(!H){box.append(el('h3',{text:'Select a school'}),el('p',{class:'r3-note',text:'Its players, their WHAC teams and seasons will list here.'}));return;}
  const A=TA();const L=ps.filter((p)=>p.hs===H.key).sort((a,b)=>a.seasons[0]-b.seasons[0]||a.team.localeCompare(b.team)||a.name.localeCompare(b.name));
  box.append(el('h3',{text:H.name+(H.town?' ('+H.town+')':'')+' · '+L.length+(L.length===1?' player':' players')}));
  if(H.spellings&&H.spellings.length>1)box.append(el('p',{class:'r3-note',text:'Listed on rosters as: '+H.spellings.join('; ')}));
  const t=el('table',{class:'md-table'},el('thead',{},el('tr',{},...['Player','WHAC team','Seasons','Last class','Position','Other college'].map((x)=>el('th',{text:x})))));const tb=el('tbody');t.append(tb);
  L.forEach((p)=>{const tr=document.createElement('tr');td(tr,p.name);const c=wTeam(tr,(A[p.team]||{}).team||p.team);c.dataset.v=c.textContent;td(tr,p.seasons.map((y)=>y===2027?'2027*':y).join(', '));td(tr,p.cls);td(tr,p.pos);td(tr,(p.colls||[]).join(', '));tb.append(tr);});
  box.append(el('div',{class:'md-scroll'},t));});

/* ---------- feeder colleges ---------- */
const ck=document.getElementById('r3ck');if(ck)ck.addEventListener('change',()=>{R.cKind=ck.value;draw('r3_coll');draw('r3_csum');});
const cm=document.getElementById('r3cmin');if(cm)cm.addEventListener('change',()=>{R.cMin=+cm.value;draw('r3_coll');draw('r3_csum');});
const collAgg=()=>{const all=rows('w_rec_players')||[];const K={};(rows('w_rec_colls')||[]).forEach((c)=>{K[c.name]=c.kind;});const m={};
  all.forEach((p)=>{if(!passBase(p,false,true)||!p.colls||!p.colls.length)return;const n=p.colls[0];const o=m[n]||(m[n]={name:n,kind:K[n]||'four',n:0,teams:{}});o.n++;o.teams[p.team]=(o.teams[p.team]||0)+1;});
  return Object.values(m).filter((o)=>(R.cKind==='all'||o.kind===R.cKind));};
draw('r3_csum',(e)=>{const a=collAgg();const s=a.filter((o)=>o.n>=R.cMin);const j=a.filter((o)=>o.kind==='juco').reduce((x,o)=>x+o.n,0),f=a.filter((o)=>o.kind!=='juco').reduce((x,o)=>x+o.n,0);
  e.textContent=s.length+' colleges shown · '+(j+f)+' transfers: '+j+' from junior colleges, '+f+' from four-year schools';});
draw('r3_coll',(t)=>{t.replaceChildren();if(!rows('w_rec_players'))return;const cols=teamCols();const L=collAgg().filter((o)=>o.n>=R.cMin).sort((a,b)=>b.n-a.n||a.name.localeCompare(b.name));
  const th=t.createTHead().insertRow();['College','Type','Players'].forEach((x)=>th.append(el('th',{text:x})));cols.forEach((c)=>th.append(logoTh(c.tid)));th.append(el('th',{text:'Teams'}));
  const tb=t.createTBody();L.forEach((o)=>{const tr=tb.insertRow();td(tr,o.name);td(tr,o.kind==='juco'?'Junior college':'Four-year');td(tr,o.n,'n');cols.forEach((c)=>{const v=o.teams[c.tid]||0;td(tr,v||'',v>=3?'c hot2':v>=2?'c hot':'c',v||'');});td(tr,Object.keys(o.teams).length,'c');});
  if(!L.length){const tr=tb.insertRow();const c=td(tr,'No colleges match these filters.');c.colSpan=4+cols.length;}});


/* ---------- sorting for every table outside the WHAC page (v20 already sorts the WHAC page) ---------- */
(function(){const SO=new Map();const MD=[...document.querySelectorAll('.md')];
  const own=(t)=>t&&!t.closest('#whac')&&!t.querySelector('thead .md-sort')&&t.tHead&&t.tBodies[0];
  const keyOf=(t)=>{const c=t.closest('.md-card,section');return (c&&c.id||'x')+':'+(c?[...c.querySelectorAll('table')].indexOf(t):0);};
  const val=(c)=>{if(!c)return null;const s=(c.dataset&&c.dataset.v!==undefined?c.dataset.v:c.textContent).trim();if(s===''||s==='—')return null;const m=/^(-?[\d.]+)%$/.exec(s);if(m)return +m[1];const n=parseFloat(s.replace(/[,+]/g,'').replace(/^T/,''));if(!isNaN(n)&&/^[T+-]?\.?\d/.test(s))return n;return s.toLowerCase();};
  const mark=(t)=>{const s=SO.get(keyOf(t));const hr=t.tHead.rows[t.tHead.rows.length-1];if(!hr)return;[...hr.cells].forEach((h,i)=>{h.classList.add('ws');if(h.tabIndex<0)h.tabIndex=0;h.setAttribute('aria-sort',s&&s.i===i?(s.d>0?'ascending':'descending'):'none');});};
  const resort=(t)=>{if(!own(t))return;mark(t);const s=SO.get(keyOf(t));if(!s)return;const tb=t.tBodies[0];const rs=[...tb.rows];rs.sort((a,b)=>{const x=val(a.cells[s.i]),y=val(b.cells[s.i]);if(x===null&&y===null)return 0;if(x===null)return 1;if(y===null)return -1;return s.d*(typeof x==='number'&&typeof y==='number'?x-y:String(x).localeCompare(String(y)));});rs.forEach((r)=>tb.append(r));};
  const click=(h)=>{const t=h.closest('table');if(!own(t))return;const i=[...h.parentNode.cells].indexOf(h);const k=keyOf(t);const s=SO.get(k);const f=val(t.tBodies[0].rows[0]&&t.tBodies[0].rows[0].cells[i]);SO.set(k,{i,d:s&&s.i===i?-s.d:(typeof f==='number'?-1:1)});resort(t);};
  MD.forEach((root)=>{root.addEventListener('click',(e)=>{const h=e.target.closest&&e.target.closest('thead th');if(h&&!h.closest('#whac'))click(h);});
    root.addEventListener('keydown',(e)=>{const h=e.target.closest&&e.target.closest('thead th');if(h&&!h.closest('#whac')&&(e.key==='Enter'||e.key===' ')){e.preventDefault();click(h);}});
    if(typeof MutationObserver!=='undefined'){const mo=new MutationObserver((ms)=>{const ts=new Set();ms.forEach((m)=>{const t=m.target.closest&&m.target.closest('table');if(t)ts.add(t);});ts.forEach((t)=>{if(t._r3s)return;t._r3s=true;try{resort(t);}finally{setTimeout(()=>{t._r3s=false;},0);}});});mo.observe(root,{childList:true,subtree:true});}
    setTimeout(()=>root.querySelectorAll('table').forEach((t)=>{if(own(t))mark(t);}),0);});
})();

/* ---------- team logos and team colors in Final standings and Individual leaders ---------- */
const TCSS=`.r3-tm{display:inline-flex;align-items:center;gap:6px;font-weight:700}
.r3-tm img{height:18px;width:24px;object-fit:contain;flex:none}
.r3-lt{background:#16285A;padding:1px 7px 1px 5px;border-radius:3px}
.md-wlr .nm i.r3-ab{display:inline-flex;align-items:center;gap:3px;font-weight:700;margin-left:6px;font-style:normal}
.md-wlr .nm i.r3-ab img{height:13px;width:18px;object-fit:contain}`;
{const st2=document.createElement('style');st2.textContent=TCSS;document.head.appendChild(st2);}
const byName=()=>{const m={};teamsAll().forEach((t)=>{m[t.team]=t;m[t.abbr]=t;});return m;};
const TXT={cornerstone:'#13294B',umd:'#00274C'};const TXT_STAND={indianatech:'#1E384C'};const tcolT=(tid)=>TXT[tid]||tcol(tid);
const deco=()=>{const M=byName();if(!Object.keys(M).length)return;
  document.querySelectorAll('#w-stand tbody td.wlink, #w-stand tbody td:nth-child(2)').forEach((td)=>{if(td.querySelector('.r3-tm'))return;const nm=td.textContent.trim();const t=M[nm];if(!t)return;const src=logoSrc(t.tid);const c=TXT_STAND[t.tid]||tcolT(t.tid);
    const sp=el('span',{class:'r3-tm'+(light(c)?' r3-lt':''),style:'color:'+c},src?el('img',{src,alt:''}):null,el('span',{text:nm}));td.dataset.v=nm;td.replaceChildren(sp);});
  document.querySelectorAll('#w-leaders .md-wlr .nm i').forEach((i)=>{if(i.classList.contains('r3-ab'))return;const ab=i.textContent.trim();const t=M[ab];if(!t)return;const src=logoSrc(t.tid);const c=tcolT(t.tid);
    i.classList.add('r3-ab');if(light(c))i.classList.add('r3-lt');i.style.color=c;i.replaceChildren(...(src?[el('img',{src,alt:''})]:[]),el('span',{text:ab}));});};
draw('r3_deco',(e)=>{deco();});
{const holder=el('span',{'data-draw':'r3_deco','data-src':'w_rec_teams w_logos w_teaminfo',hidden:null,style:'display:none'});const sc=document.getElementById('w-stand');if(sc)sc.append(holder);}
if(typeof MutationObserver!=='undefined'){['w-stand','w-leaders'].forEach((id)=>{const n=document.getElementById(id);if(!n)return;let busy=false;new MutationObserver(()=>{if(busy)return;busy=true;try{deco();}finally{setTimeout(()=>{busy=false;},0);}}).observe(n,{childList:true,subtree:true});});}
setTimeout(deco,0);
{const CSSK=`.r3-key{display:inline-flex;align-items:center;gap:6px;margin-left:10px;padding:3px 10px;border:1px solid #E7131A;border-radius:12px;background:#FFF1F1;font-size:var(--cds-font-size-caption);font-weight:700;color:#16285A}
.r3-key b{display:inline-block;width:9px;height:9px;border-radius:50%;background:#E7131A}
.md-wlr .nm b.bk{width:9px;height:9px;box-shadow:0 0 0 2px #FFD5D5}`;const st4=document.createElement('style');st4.textContent=CSSK;document.head.appendChild(st4);
  const addKey=()=>{const cb=document.getElementById('w2back');const host=cb?(cb.closest('label')||cb.parentNode):document.querySelector('#w-leaders .md-wchips');if(!host||document.getElementById('r3key'))return;host.after(el('span',{class:'r3-key',id:'r3key',title:'The player can return in 2027: his class allows it and he is not listed as leaving.'},el('b'),'Red dot = can return in 2027'));};
  addKey();setTimeout(addKey,500);setTimeout(addKey,2000);}

/* ---------- WHAC page backdrop themes (preview only until one is chosen) ---------- */
const thBlock=(cls,page,bgcss,card,box,row,line,extra)=>{const P=`.md.whac-on.wth-${cls}`;return `
.md.md.whac-on.wth-${cls}{--page:${page};--paper:${card};--soft:${box};--color-bg:${card};--color-panel:${card};background:${bgcss}}
${P} .md-card,${P} .md-wcap{background:${card}}
${P} .md-wteam,${P} .md-wlead,${P} .w2-m,${P} .w2-nc,${P} .r3-box,${P} .r3-bar,${P} .md-wchip:not(.on),${P} .r3-chip:not(.on),${P} .r3-ddp,${P} .md-input,${P} .r3-sel,${P} .w2-sel{background:${box}}
${P} .md-table tbody tr{background:${card}}${P} .md-table tbody tr:nth-child(even){background:${row}}
${P} .md-table td{border-bottom-color:${line}}${P} .md-wlead,${P} .md-wteam,${P} .r3-box{border-color:${line}}
${extra}`;};
const THCSS=
 thBlock('night','#0F1C3F','linear-gradient(180deg,#0F1C3F 0,#16285A 900px,#0F1C3F 100%)','#DCE3F0','#E8EDF6','#CFD8EA','#B9C5DD',
  `.md.whac-on.wth-night .md-card{border:1px solid #2A3F78;border-top:5px solid #E7131A;box-shadow:0 6px 20px rgba(0,0,0,.35)}.md.whac-on.wth-night .md-wnav{background:#0B1530;border-bottom-color:#E7131A}`)+
 thBlock('clay','#D9C3A0','#D9C3A0 repeating-linear-gradient(90deg,rgba(255,255,255,0) 0 118px,rgba(255,255,255,.28) 118px 120px)','#F1E3CB','#F7EDDC','#E9D7B9','#D6BF98',
  `.md.whac-on.wth-clay .md-card{border:1px solid #C9AE84;border-top:5px solid #223C81;box-shadow:0 3px 10px rgba(90,60,20,.18)}`)+
 thBlock('steel','#9AA6B9','#9AA6B9','#DDE3EC','#E9EDF3','#CFD7E3','#BCC6D5',
  `.md.whac-on.wth-steel .md-card{border:0;border-left:6px solid #E7131A;box-shadow:0 4px 14px rgba(15,28,63,.25);padding-top:0}.md.whac-on.wth-steel .md-card>.md-h{background:#223C81;color:#fff;margin:0 calc(-1*var(--cds-pad-lg)) 10px;padding:10px var(--cds-pad-lg);border-bottom:3px solid #E7131A}`);
{const st3=document.createElement('style');st3.textContent=THCSS;document.head.appendChild(st3);}
const WHAC_THEME='night';
if(WHAC_THEME)document.querySelectorAll('.md').forEach((r)=>r.classList.add('wth-'+WHAC_THEME));

/* ---------- v22: QA fixes ---------- */
{const st5=document.createElement('style');st5.textContent=`.md-pc1 th:nth-last-child(-n+1),.md-pc2 th:nth-last-child(-n+2){background:var(--navy);color:#fff;box-shadow:inset 0 -4px 0 var(--gold)}
.r22-sum{margin:6px 0 8px}`;document.head.appendChild(st5);}
{const hh=document.querySelector('#w-hon h2');if(hh)hh.textContent='2026 WHAC awards and Gold Glove team';}
{const hc=document.querySelector('#h2h > .md-cap');if(hc){hc.dataset.draw='h2h_cap';hc.dataset.src='cleary_series';}
 const NUMW=['no','one','two','three','four','five','six','seven','eight','nine','ten'];
 draw('h2h_cap',(el)=>{const n=(rowsOf('cleary_series')||[]).filter((r)=>String(r.season)==='2026').length;el.textContent=n?(n===1?'The one 2026 game.':`${n===2?'Both 2026 games':`All ${NUMW[n]||n} 2026 games`} combined.`):'No 2026 meetings.';});}
{const rw=document.querySelector('[data-draw="recruits"]');const wrap=rw&&rw.closest('.md-scroll');
 if(wrap){wrap.dataset.recruit='commits';
  const h=document.querySelector('h2.md-h[data-recruit="roster"]');if(h)h.textContent='New on the 2027 roster';
  const cp=document.querySelector('p.md-cap[data-recruit="roster"]');if(cp)cp.textContent="Players on the team's 2027 roster page who weren't on its 2026 roster page. Class, previous school and hometown are as the 2027 page lists them. Previous school is the last school listed: the high school for a player coming straight from high school, otherwise the college.";
  const sm=document.createElement('p');sm.className='md-cap r22-sum';sm.dataset.recruit='roster';sm.dataset.draw='recruits27_sum';sm.dataset.src='recruits';
  const nw=document.createElement('div');nw.className='md-scroll';nw.dataset.recruit='roster';
  nw.innerHTML='<table class="md-table"><thead><tr><th>Player</th><th>2027 class</th><th>Pos</th><th>Previous school</th><th>School type</th><th>Hometown</th></tr></thead><tbody data-src="recruits" data-draw="recruits27"></tbody></table>';
  wrap.after(sm,nw);
  const T=TEAM_OF(TEAM);wrap.hidden=T.recruits!=='commits';sm.hidden=nw.hidden=T.recruits!=='roster';
  const KIND=['High school','Junior college','Four-year college','Indiana Tech in 2026','Not listed'];
  draw('recruits27',(tb)=>{const rows=rowsOf('recruits')||[];fill(tb,rows.map((r)=>({...r,recruit:r.name,cls27:r.grad,pschool:r.prev||'',stype:r.came||'',home:r.hometown||''})),['recruit','cls27','pos','pschool','stype','home'],'name');});
  draw('recruits27_sum',(el)=>{const rows=rowsOf('recruits')||[];const c={};rows.forEach((r)=>{c[r.came]=(c[r.came]||0)+1;});
   const lab={'High school':'from high school','Junior college':'from a junior college','Four-year college':'from a four-year college','Indiana Tech in 2026':'with Indiana Tech in 2026 but not on its 2026 roster page','Not listed':'with no previous school listed'};
   const parts=KIND.filter((k)=>c[k]).map((k)=>`${c[k]} ${lab[k]}`);
   el.textContent=rows.length?`${rows.length} new names: ${parts.length>1?parts.slice(0,-1).join(', ')+' and '+parts[parts.length-1]:parts[0]}.`:'';});
 }}

{const sub=document.querySelector('#lineup .md-subtabs');if(sub){const mb=sub.querySelector('[data-lu="most"]');if(mb)mb.textContent='Typical 2026 lineup';sub.dataset.draw='lu_lbls';sub.dataset.src='ui lineups';
 sub.querySelectorAll('[data-lu] span[data-draw="v"]').forEach((sp)=>{sp.removeAttribute('data-draw');sp.dataset.luLbl=sp.dataset.where.split('=')[1];});
 draw('lu_lbls',(el)=>{const U=rowsOf('ui')||[];const L=rowsOf('lineups')||[];
  el.querySelectorAll('[data-lu]').forEach((b)=>{b.hidden=!L.some((r)=>r.tab===(TM().lu[b.dataset.lu]||b.dataset.lu));const sp=b.querySelector('[data-lu-lbl]');if(sp){const r=U.find((x)=>x.id===sp.dataset.luLbl);sp.textContent=r&&r.detail?r.detail:'—';}});});}}

/* ---------- v22: headline tiles ---------- */
{const tl=document.querySelector('.md-tiles[data-draw="w_tiles"]');if(tl){tl.dataset.draw='w3_tiles';tl.className='r3-tiles';tl.dataset.src='w_notes w_logos';
 const st6=document.createElement('style');st6.textContent=`.r3-tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px;margin:0 0 var(--cds-gap-lg)}
.r3-tile{position:relative;border-radius:6px;padding:12px 14px 13px;display:flex;flex-direction:column;gap:6px;min-height:118px;box-shadow:0 4px 14px rgba(0,0,0,.28);border-top:5px solid var(--acc);background:var(--bg);color:#fff;overflow:hidden}
.r3-tile .r3-th{display:flex;align-items:center;gap:9px}
.r3-tile .r3-tlogo{width:40px;height:40px;flex:none;background:#fff;border-radius:6px;padding:4px;object-fit:contain;box-shadow:0 1px 3px rgba(0,0,0,.35)}
.r3-tile .r3-tlab{font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;line-height:1.25;color:var(--lab)}
.r3-tile .r3-tmain{font-family:var(--serif);font-weight:700;font-size:20px;line-height:1.15;color:var(--main);text-wrap:balance}
.r3-tile .r3-tsub{font-size:13px;line-height:1.3;color:var(--sub);text-wrap:balance}`;document.head.appendChild(st6);
 const TS={unoh:{bg:'linear-gradient(160deg,#2A2A2A 0%,#121212 100%)',acc:'#C8102E',lab:'#FF8A9B',main:'#FFFFFF',sub:'#E6E6E6'},
  madonna:{bg:'linear-gradient(160deg,#1660B0 0%,#0B3D74 100%)',acc:'#FFD200',lab:'#FFE36B',main:'#FFFFFF',sub:'#FFF3B0'},
  whac:{bg:'linear-gradient(160deg,#16244F 0%,#0A1230 100%)',acc:'#E7131A',lab:'#C9D4EE',main:'#FFD54A',sub:'#FFFFFF'}};
 const TEAMN=[['Northwestern Ohio','unoh'],['Madonna','madonna']];
 const WLOGO=(document.querySelector('.md-wlogo')||{}).src||'';
 draw('w3_tiles',(el)=>{const rows=(rowsOf('w_notes')||[]).filter((r)=>/^t\d$/.test(r.id)&&r.id!=='t5');const L={};(rowsOf('w_logos')||[]).forEach((r)=>{L[r.id]=r.src;});
  el.replaceChildren(...rows.map((r,i)=>{const det=String(r.detail);const c=det.indexOf(',');let main=c>0?det.slice(0,c):det,sub=c>0?det.slice(c+1).trim():'';
   let tid=null;if(i<4){if(r.id==='t1'||r.id==='t2'){const hit=TEAMN.find(([n])=>main===n);tid=hit&&hit[1];}else{const hit=TEAMN.find(([n])=>sub===n);tid=hit&&hit[1];}}
   if(r.id==='t1'&&sub)sub=sub+' in WHAC play';
   const sty=TS[tid]||TS.whac;const d=document.createElement('div');d.className='r3-tile';Object.entries({'--bg':sty.bg,'--acc':sty.acc,'--lab':sty.lab,'--main':sty.main,'--sub':sty.sub}).forEach(([k,v])=>d.style.setProperty(k,v));
   const h=document.createElement('div');h.className='r3-th';const im=document.createElement('img');im.className='r3-tlogo';im.alt='';im.src=tid?(L[tid]||''):WLOGO;if(im.src)h.append(im);
   const lab=document.createElement('span');lab.className='r3-tlab';lab.textContent=r.label;h.append(lab);
   const m=document.createElement('div');m.className='r3-tmain';m.textContent=main;const sb=document.createElement('div');sb.className='r3-tsub';sb.textContent=sub;
   d.append(h,m);if(sub)d.append(sb);return d;}));});}}

/* ---------- v22: modern theme (all pages) ---------- */
{const st7=document.createElement('style');st7.textContent="/* \"Modern\" preview theme: dark gradient cards, colored top stripe, uppercase labels, bright numbers. */\n.md.mod{--m-page:#0A1230;--m-bg1:#16244F;--m-bg2:#0C1638;--m-acc:#E7131A;--m-lab:#C9D4EE;--m-text:#EEF2FA;--m-muted:#AEB9D3;--m-hi:#FFD54A;--m-row:rgba(255,255,255,.04);--m-line:rgba(255,255,255,.10);--m-th:#0A1230;\n background:var(--m-page)!important;color:var(--m-text)}\n.md.mod #dash-root,.md.mod .md-page,.md.mod #whac{background:transparent!important}\n.md.mod .md-card,.md.mod .md-wlead,.md.mod .md-wteam,.md.mod .r3-box{background:linear-gradient(160deg,var(--m-bg1) 0%,var(--m-bg2) 100%)!important;color:var(--m-text)!important;border:0!important;border-top:5px solid var(--m-acc)!important;border-radius:8px!important;box-shadow:0 6px 18px rgba(0,0,0,.35)!important;outline:none!important}\n.md.mod .md-h,.md.mod .md-card h2,.md.mod .md-card h3{color:var(--m-lab)!important;font-family:var(--font-anthropic-sans,system-ui)!important;text-transform:uppercase;letter-spacing:.06em;font-size:13px!important;font-weight:800!important;border-bottom:1px solid var(--m-line)!important;padding-bottom:8px}\n.md.mod .md-cap,.md.mod .md-sub,.md.mod .md-li,.md.mod p,.md.mod .md-lilabel,.md.mod label{color:var(--m-muted)!important}\n.md.mod .md-sub,.md.mod .md-li{color:var(--m-text)!important}\n.md.mod .md-lilabel{color:var(--m-lab)!important;font-weight:800}\n.md.mod .md-num,.md.mod .md-big,.md.mod .md-stat b,.md.mod .md-kpi b{color:var(--m-hi)!important}\n.md.mod .md-table{color:var(--m-text)}\n.md.mod .md-table th,.md.mod .md-table th button{background:var(--m-th)!important;color:var(--m-lab)!important;border-bottom:2px solid var(--m-acc)!important;text-transform:uppercase;font-size:11.5px;letter-spacing:.04em}\n.md.mod .md-table td{border-bottom:1px solid var(--m-line)!important;color:var(--m-text)!important;background:transparent!important}\n.md.mod .md-table tr:nth-child(even) td{background:var(--m-row)!important}\n.md.mod .md-pc1 td:nth-last-child(-n+1),.md.mod .md-pc2 td:nth-last-child(-n+2){background:rgba(255,255,255,.07)!important}\n.md.mod .md-band,.md.mod .md-wband{background:linear-gradient(135deg,var(--m-bg1) 0%,var(--m-bg2) 70%)!important;outline:none!important;border:0!important;border-bottom:5px solid var(--m-acc)!important;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.4)}\n.md.mod .md-logo,.md.mod .md-wlogo{border-radius:10px!important;border:0!important;box-shadow:0 2px 8px rgba(0,0,0,.4)}\n.md.mod .md-eyebrow{color:var(--m-lab)!important;letter-spacing:.12em}\n.md.mod .md-title{color:#fff!important}\n.md.mod .md-lede{color:var(--m-text)!important}\n.md.mod .md-tabs,.md.mod .md-wnav{background:var(--m-th)!important;border-bottom:3px solid var(--m-acc)!important;border-radius:8px}\n.md.mod .md-tab.on,.md.mod .md-wnav button:hover{background:var(--m-acc)!important;color:#fff!important}\n.md.mod .md-tiles{gap:10px}\n.md.mod .md-tile{background:linear-gradient(160deg,var(--m-bg1),var(--m-bg2))!important;outline:none!important;border-top:5px solid var(--m-acc);border-radius:6px;box-shadow:0 4px 14px rgba(0,0,0,.3);text-align:left;color:#fff!important}\n.md.mod .md-tile .md-cap{color:var(--m-lab)!important;text-transform:uppercase;font-size:11px;font-weight:700;letter-spacing:.05em}\n.md.mod .md-tile .md-num{color:#fff!important;font-family:var(--serif)}\n.md.mod .md-tile:nth-child(odd) .md-num{color:var(--m-hi)!important}\n.md.mod .md-input,.md.mod select,.md.mod input{background:var(--m-th)!important;color:var(--m-text)!important;border:1px solid var(--m-line)!important;border-radius:6px}\n.md.mod .md-subtab,.md.mod .md-wchip,.md.mod .r3-chip{background:transparent!important;color:var(--m-lab)!important;border:1px solid var(--m-line)!important;border-radius:999px}\n.md.mod .md-subtab.on,.md.mod .md-wchip.on,.md.mod .r3-chip.on{background:var(--m-acc)!important;color:#fff!important;border-color:var(--m-acc)!important}\n.md.mod svg text:not([fill]){fill:var(--m-muted)}\n.md.mod .md-chart,.md.mod .md-map,.md.mod .r3-mapwrap{background:rgba(255,255,255,.03);border-radius:6px}\n.md.mod .md-teams,.md.mod .md-filterbar,#filter-bar{background:transparent!important}\n.md.mod .md-homebtn{background:var(--m-acc)!important;color:#fff!important;border-radius:6px}\n.md.mod .md-flabel,.md.mod .md-teamlab{color:var(--m-lab)!important}\n.md.mod a{color:var(--m-hi)!important}\n/* team palettes */\n.md.mod.t-c{--m-page:#08122A;--m-bg1:#1B2F5E;--m-bg2:#0B1A3A;--m-acc:#B30838;--m-lab:#F2A5B6;--m-hi:#FFFFFF;--m-th:#08122A}\n.md.mod.t-lt{--m-page:#061B36;--m-bg1:#0B4A8F;--m-bg2:#06264D;--m-acc:#2FB0F0;--m-lab:#9FD6F5;--m-hi:#7FD3FF;--m-th:#061B36}\n.md.mod.t-rc{--m-page:#141210;--m-bg1:#34312C;--m-bg2:#181614;--m-acc:#CB1F2C;--m-lab:#F08A93;--m-hi:#FF6B76;--m-th:#100E0C}\n.md.mod .md-table tr,.md.mod .md-table tbody tr{background:transparent!important}\n.md.mod .md-table tr.out td{opacity:.75}\n.md.mod .md-li,.md.mod .md-li div,.md.mod .md-li span:not(.md-lilabel):not(.md-chip),.md.mod .md-lidetail{color:var(--m-text)!important}\n.md.mod .md-card div:not([class*=\"chip\"]):not([class*=\"tag\"]):not([class*=\"st-\"]){color:inherit}\n.md.mod .rank1{color:var(--m-hi)!important;font-weight:800}\n.md.mod.t-c{--royal:#4A78C2}\n.md.mod.t-rc{--gold:#F2EEE9}\n.md.mod .r3-tile .r3-tlab{color:var(--lab)!important}.md.mod .r3-tile .r3-tsub{color:var(--sub)!important}\n.md.mod .r3-tm,.md.mod .r3-tm span{color:#fff!important;font-weight:700}\n.md.mod .r3-ab,.md.mod .r3-ab span{color:var(--m-muted)!important}\n.md.mod .r3-tm img,.md.mod .r3-ab img,.md.mod .w2-logo{background:#fff;border-radius:3px}\n.md.mod .md-wlr .nm,.md.mod .md-wlr b,.md.mod .md-wlr{color:var(--m-text)!important;border-bottom-color:var(--m-line)!important}\n.md.mod .md-wlr span:last-child{color:var(--m-hi)!important;font-weight:700}\n.md.mod .w2-m,.md.mod .w2-nc,.md.mod .md-wcap,.md.mod .w2-res{background:rgba(255,255,255,.06)!important;border-color:var(--m-line)!important;color:var(--m-text)!important}\n.md.mod .w2-mh{background:rgba(0,0,0,.25)!important;color:var(--m-muted)!important}\n.md.mod .w2-t{border-top-color:var(--m-line)!important;color:var(--m-text)!important}\n.md.mod .w2-t b,.md.mod .w2-t span{color:inherit}\n.md.mod .w2-colh,.md.mod .w2-brh,.md.mod .w2-chk,.md.mod .w2-tip{color:var(--m-lab)!important}\n.md.mod .w2-sel{background:var(--m-th)!important;color:var(--m-text)!important;border-color:var(--m-line)!important}\n.md.mod .w2-ng{border-bottom-color:var(--m-line)!important;color:var(--m-text)!important}\n.md.mod .w2-nc{border-top:4px solid var(--m-acc)!important}\n.md.mod .best{background:rgba(255,213,74,.12)!important;color:var(--m-hi)!important}\n.md.mod .md-wteam span,.md.mod .md-wteam small{color:var(--m-muted)!important}\n.md.mod .md-wteam{color:#fff!important}\n.md.mod .wlink{color:#fff!important}\n.md.mod .w2-nc b,.md.mod .w2-nc strong,.md.mod .w2-nc .w2-st{color:#fff!important}\n.md.mod .w2-nc .st-good,.md.mod .w2-ng .st-good{color:#5BE08A!important}.md.mod .w2-nc .st-bad,.md.mod .w2-ng .st-bad{color:#FF7A80!important}\n/* all team palettes (Madonna is the default .md) */\n.md.mod{--m-page:#071C38;--m-bg1:#13467F;--m-bg2:#0A2A52;--m-acc:#FFD200;--m-lab:#FFE36B;--m-hi:#FFD200;--m-th:#071C38;--royal:#3D82D6}\n.md.mod.t-a{--m-page:#1A0A0C;--m-bg1:#5A1A20;--m-bg2:#2A0C10;--m-acc:#C8C9C7;--m-lab:#E9C3C7;--m-hi:#FFFFFF;--m-th:#160809;--royal:#C24A55}\n.md.mod.t-cu{--m-page:#08132A;--m-bg1:#1C3A66;--m-bg2:#0C1D3A;--m-acc:#E8AA15;--m-lab:#F5CF6E;--m-hi:#F5C542;--m-th:#08132A;--royal:#4D7BC0}\n.md.mod.t-it{--m-page:#0B1620;--m-bg1:#24445C;--m-bg2:#10222F;--m-acc:#F26722;--m-lab:#FFB48A;--m-hi:#FF9A5C;--m-th:#0B1620;--royal:#4F86B0}\n.md.mod.t-un{--m-page:#0E0E0E;--m-bg1:#2A2A2A;--m-bg2:#121212;--m-acc:#C8102E;--m-lab:#FF8A9B;--m-hi:#FF5A70;--m-th:#0A0A0A;--royal:#E05A6E}\n.md.mod.t-md{--m-page:#04142A;--m-bg1:#12406E;--m-bg2:#071F3D;--m-acc:#FFCB05;--m-lab:#FFE37A;--m-hi:#FFCB05;--m-th:#04142A;--royal:#3D7CC9}\n.md.mod.t-df{--m-page:#120A22;--m-bg1:#4A2C80;--m-bg2:#1F1238;--m-acc:#E0D37C;--m-lab:#EDE3A0;--m-hi:#F2E27A;--m-th:#120A22;--royal:#8E6CD1}\n.md.mod.t-c{--m-page:#08122A;--m-bg1:#1B2F5E;--m-bg2:#0B1A3A;--m-acc:#B30838;--m-lab:#F2A5B6;--m-hi:#FFFFFF;--m-th:#08122A;--royal:#4A78C2}\n.md.mod.t-lt{--m-page:#061B36;--m-bg1:#0B4A8F;--m-bg2:#06264D;--m-acc:#2FB0F0;--m-lab:#9FD6F5;--m-hi:#7FD3FF;--m-th:#061B36}\n.md.mod.t-rc{--m-page:#141210;--m-bg1:#34312C;--m-bg2:#181614;--m-acc:#CB1F2C;--m-lab:#F08A93;--m-hi:#FF6B76;--m-th:#100E0C;--gold:#F2EEE9}\n/* the WHAC page always uses the WHAC palette, whichever team was last open */\n.md.mod.whac-on{--m-page:#0A1230;--m-bg1:#16244F;--m-bg2:#0C1638;--m-acc:#E7131A;--m-lab:#C9D4EE;--m-hi:#FFD54A;--m-th:#0A1230}\n.md.mod [data-draw=fsum]{color:var(--m-lab)!important}\n#filter-bar{background:transparent!important;border-color:var(--m-line)!important}\n";document.head.appendChild(st7);document.querySelectorAll('.md').forEach((r)=>r.classList.add('mod'));document.documentElement.style.background='#0A1230';}

/* ---------- v22e: readability, parked 2027 cards, impact bats, player spray ---------- */
{const st8=document.createElement('style');st8.textContent=`
.md.mod{--m-on:#FFFFFF}
.md.mod:not([class*=" t-"]){--m-on:#071C38}.md.mod.t-cu{--m-on:#08132A}.md.mod.t-md{--m-on:#04142A}.md.mod.t-df{--m-on:#120A22}.md.mod.t-a{--m-on:#1A0A0C}.md.mod.t-lt{--m-on:#061B36}
.md.mod.whac-on{--m-on:#FFFFFF}
.md.mod .md-tab.on,.md.mod .md-subtab.on,.md.mod .md-wchip.on,.md.mod .r3-chip.on,.md.mod .md-homebtn{color:var(--m-on)!important}
.md.mod .md-pbtn{color:var(--m-text)!important;border-bottom-color:var(--m-line)!important;font-size:13px}
.md.mod .md-pbtn:hover{background:rgba(255,255,255,.08)!important}
.md.mod .md-pbtn.on{background:rgba(255,255,255,.14)!important;color:#fff!important;box-shadow:inset 4px 0 0 var(--m-acc)}
.md.mod .pc-head{border-bottom:1px solid var(--m-line)!important}
.md.mod .pc-name{color:#fff!important}.md.mod .pc-num{color:var(--m-hi)!important}
.md.mod .pc-sub,.md.mod .pc-v{color:var(--m-text)!important}.md.mod .pc-k{color:var(--m-muted)!important}
.md.mod .pc-sec{color:var(--m-lab)!important}
.md.mod .md-tip,.md.mod .r3-tip{background:#0B1430!important;color:#fff!important;border:1px solid var(--m-acc)!important;box-shadow:0 6px 18px rgba(0,0,0,.5)!important}
.md.mod .md-tip *,.md.mod .r3-tip *{color:#fff!important}
.md.mod .md-tip-head,.md.mod .r3-tip b:first-child{color:var(--m-lab)!important}
.md.mod .r3-bar{background:var(--m-th)!important;border-color:var(--m-line)!important;border-bottom:3px solid var(--m-acc)!important;box-shadow:0 4px 12px rgba(0,0,0,.35)!important;color:var(--m-text)!important}
.md.mod .r3-bar *{color:var(--m-text)}
.md.mod .r3-sel{background:var(--m-bg2)!important;color:var(--m-text)!important;border-color:var(--m-line)!important}
.md.mod .r3-tabs{border-bottom-color:var(--m-acc)!important}
.md.mod .r3-tab{background:rgba(255,255,255,.06)!important;color:var(--m-lab)!important;border-color:var(--m-line)!important}
.md.mod .r3-tab.on{background:var(--m-acc)!important;color:#fff!important}
.md.mod .r3-ddp{background:var(--m-bg2)!important;border-color:var(--m-acc)!important;color:var(--m-text)!important}
.md.mod .r3-ddi:hover,.md.mod .r3-li:hover{background:rgba(255,255,255,.08)!important}
.md.mod .r3-li.on,.md.mod .r3-t tr.on td{background:rgba(231,19,26,.28)!important}
.md.mod .r3-t td.hot{background:rgba(255,255,255,.10)!important}
.md.mod .r3-stack{background:rgba(255,255,255,.10)!important}
.md.mod .r3-key{background:rgba(231,19,26,.15)!important;color:#fff!important}
.md.mod .md-wlink{color:#fff!important;text-decoration-color:var(--m-acc)!important}
.md.mod .r3-ab img{height:18px!important;width:24px!important}
.md.mod .r3-tm img{height:22px!important;width:28px!important}
.md.mod #w-pyth svg circle,.md.mod #w-pyth svg rect:not(:first-child),.md.mod #w-close svg rect,.md.mod #w-retbar svg rect{stroke:rgba(255,255,255,.6);stroke-width:1}
.md.mod #w-pyth svg text,.md.mod #w-close svg text,.md.mod #w-retbar svg text{fill:#E8EDF6}
.md.mod.t-lt{--gold:#9FD6F5}
.md.mod{--soft:rgba(255,255,255,.08);--softer:rgba(255,255,255,.12);--field:rgba(255,255,255,.04)}
.md.mod .md-cred>div{background:rgba(255,255,255,.07)!important;border-left-color:var(--m-acc)!important}
.md.mod .md-cred b{color:var(--m-hi)!important}.md.mod .md-cred span{color:var(--m-muted)!important}.md.mod .md-cred .k{color:var(--m-text)!important}
.r22-hint{font-size:11px;color:var(--m-muted,#55607A);margin:0 0 4px}
.r22-imp h3{margin:14px 0 4px}
.r22-sp{display:flex;flex-direction:column;gap:12px;margin-top:4px}.r22-sp>div:first-child{width:100%;max-width:820px}

.r22-sp svg{width:100%;height:auto;display:block}
.r22-chips{display:flex;gap:6px;flex-wrap:wrap;margin:2px 0 8px}
.r22-chip{appearance:none;cursor:pointer;padding:3px 10px;border-radius:999px;border:1px solid var(--m-line,#B8C3E0);background:transparent;color:var(--m-lab,#16285A);font-weight:700;font-size:12px}
.r22-chip.on{background:var(--m-acc,#223C81);color:var(--m-on,#fff);border-color:var(--m-acc,#223C81)}
.r22-vol{max-width:820px;font-size:13px;line-height:1.5;color:var(--m-text,#16285A)}
.r22-vol b{color:var(--m-hi,#16285A)}
.r22-vol table{border-collapse:collapse;margin:6px 0;font-size:12px}
.r22-vol td{padding:2px 8px 2px 0;border-bottom:1px solid var(--m-line,#E3E7F0)}
`;document.head.appendChild(st8);}

/* park the 2027 series and calendar (kept in a separate artifact) */
['w-ser','w-cal'].forEach((id)=>{const c=document.getElementById(id);if(c){c.hidden=true;c.style.display='none';}const b=document.querySelector('[data-wgo="'+id+'"]');if(b)b.remove();});

/* team stats: a Sort by control that works on any device (drives the same header sort) */
{const cm=document.getElementById('w-cmp');const tb=cm&&cm.querySelector('table');if(tb&&!cm.querySelector('.r22-sortbar')){
  const bar=document.createElement('div');bar.className='r22-sortbar';bar.style.cssText='display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:2px 0 8px';
  const lab=document.createElement('span');lab.className='md-cap';lab.textContent='Sort by';
  const sel=document.createElement('select');sel.className='md-input w2-sel';sel.setAttribute('aria-label','Sort team stats by');
  const dir=document.createElement('select');dir.className='md-input w2-sel';dir.setAttribute('aria-label','Sort direction');
  [['desc','High to low'],['asc','Low to high']].forEach(([v,t])=>{const o=document.createElement('option');o.value=v;o.textContent=t;dir.append(o);});
  const hdr=()=>{const hr=tb.tHead&&tb.tHead.rows[tb.tHead.rows.length-1];return hr?[...hr.cells]:[];};
  const fillSel=()=>{const cur=sel.value;sel.replaceChildren();const o0=document.createElement('option');o0.value='';o0.textContent='Choose a column';sel.append(o0);hdr().forEach((h,i)=>{const o=document.createElement('option');o.value=String(i);o.textContent=h.textContent.replace(/[↕▲▼↕▲▼]/g,'').trim();sel.append(o);});sel.value=cur;};
  const LOW=/^(ERA|WHIP|BB\+HBP PER 9)$/i;
  const apply=()=>{const i=+sel.value;if(sel.value==='')return;const h=hdr()[i];if(!h)return;const want=dir.value==='asc'?'ascending':'descending';for(let k=0;k<3&&h.getAttribute('aria-sort')!==want;k++)h.click();};
  sel.addEventListener('change',()=>{const h=hdr()[+sel.value];if(h&&LOW.test(h.textContent.replace(/[^A-Za-z+ 0-9]/g,'').trim()))dir.value='asc';else dir.value='desc';apply();});
  dir.addEventListener('change',apply);
  bar.append(lab,sel,dir);const sc=tb.closest('.md-scroll')||tb;sc.before(bar);fillSel();setTimeout(fillSel,500);}}
/* team stats: sort cues and lower-is-better columns */
{const cm=document.getElementById('w-cmp');if(cm){const cap=cm.querySelector('.md-cap');if(cap&&!cm.querySelector('.r22-hint')){const h=document.createElement('p');h.className='r22-hint';h.textContent='Click any column header to sort, or use Sort by below; lower is better for ERA, WHIP and BB+HBP per 9.';cap.after(h);}}}

/* other impact bats under the typical 2026 lineup */
{const lc=document.getElementById('lineup');if(lc&&!document.getElementById('r22-imp')){const box=document.createElement('div');box.id='r22-imp';box.className='r22-imp';box.dataset.draw='r22_imp';box.dataset.src='lineups hitters';
  lc.append(box);
  draw('r22_imp',(el)=>{el.replaceChildren();if(luTab()!=='most')return;const L=rowsOf('lineups')||[],H=hitFull()||[];const nine=new Set(L.filter((r)=>r.tab==='most').map((r)=>r.player));
    const rows=H.filter((h)=>+h.ab>15&&!nine.has(h.player)).sort((a,b)=>parseFloat(b.ops)-parseFloat(a.ops));
    el.innerHTML='<h3 class="md-h">Other impact bats</h3><p class="md-cap">Hitters with more than 15 at-bats in 2026 who aren\'t in the typical lineup above, by OPS. Lines are full-season totals.</p>';
    if(!rows.length){const p=document.createElement('p');p.className='md-sub';p.textContent='No one else had more than 15 at-bats.';el.append(p);return;}
    const w=document.createElement('div');w.className='md-scroll';w.innerHTML='<table class="md-table"><thead><tr><th>Player</th><th>Pos</th><th>2026 class</th><th>2027 outlook</th><th>GS</th><th>AB</th><th>AVG</th><th>OBP</th><th>OPS</th><th>HR</th><th>RBI</th></tr></thead><tbody></tbody></table>';el.append(w);
    fill(w.querySelector('tbody'),rows.map((h)=>({...h,st:h.status||''})),['player','pos','cls','st','gs','ab','avg','obp','ops','hr','rbi'],'player');});
  document.addEventListener('click',(e)=>{if(e.target.closest&&e.target.closest('[data-lu]'))setTimeout(()=>draw('r22_imp'),0);});}}

/* player card: own spray chart, ground balls vs in/* player card: own spray chart, ground balls vs in the air, with the data volume used */
{const GB=new Set(['GO','FC']),AIR=new Set(['AO','HR']),HIT=new Set(['1B','2B','3B','HR']);
 const OF=[['LF'],['LC'],['CF'],['RC'],['RF']],IF=[['3B'],['LS'],['SS'],['MID'],['2B'],['RS'],['1B']];
 const NM={LF:'Left field',LC:'Left center',CF:'Center field',RC:'Right center',RF:'Right field','3B':'Third base',LS:'Left side',SS:'Shortstop',MID:'Up the middle','2B':'Second base',RS:'Right side','1B':'First base',P:'Pitcher',C:'Catcher'};
 const pct=(a,b)=>b?Math.round(100*a/b)+'%':'—';
 let mode='all';
 const build=(card,n)=>{const SP=(rowsOf('spray')||[]).filter((r)=>r.player===n),PA=(rowsOf('pa_log')||[]).filter((r)=>r.side==='H'&&r.player===n);
  const NOAB=new Set(['BB','HBP','SF','SAC','CI','IBB']);const ab=PA.filter((r)=>!NOAB.has(r.res)).length,k=PA.filter((r)=>r.res==='K').length,bip=Math.max(0,ab-k);
  const used=SP.length,gb=SP.filter((r)=>GB.has(r.res)).length,air=SP.filter((r)=>AIR.has(r.res)).length,hits=SP.filter((r)=>HIT.has(r.res)).length,untyped=used-gb-air;
  const wrap=document.createElement('div');wrap.className='r22-spw';
  const sec=document.createElement('div');sec.className='pc-sec';sec.textContent='Spray chart: partial, '+used+' batted balls with a direction';wrap.append(sec);
  if(!used){const p=document.createElement('p');p.className='md-sub';p.textContent='No batted balls with a direction in the 2026 play-by-play.';wrap.append(p);return wrap;}
  const chips=document.createElement('div');chips.className='r22-chips';
  [['all','All ('+used+')'],['gb','Ground balls ('+gb+')'],['air','In the air ('+air+')'],['hits','Hits ('+hits+')']].forEach(([m,t])=>{const b=document.createElement('button');b.type='button';b.className='r22-chip'+(m===mode?' on':'');b.textContent=t;b.addEventListener('click',()=>{mode=m;const nw=build(card,n);wrap.replaceWith(nw);});chips.append(b);});
  wrap.append(chips);
  const keep=mode==='gb'?(r)=>GB.has(r.res):mode==='air'?(r)=>AIR.has(r.res):mode==='hits'?(r)=>HIT.has(r.res):()=>true;
  const rows=SP.filter(keep);const c={};rows.forEach((r)=>{c[r.zone]=(c[r.zone]||0)+1;});const tot=rows.length;const max=Math.max(1,...Object.values(c));
  const z={};SP.forEach((r)=>{const o=z[r.zone]||(z[r.zone]={n:0,h:0,g:0,a:0});o.n++;if(HIT.has(r.res))o.h++;if(GB.has(r.res))o.g++;if(AIR.has(r.res))o.a++;});
  const grid=document.createElement('div');grid.className='r22-sp';wrap.append(grid);
  const box=document.createElement('div');grid.append(box);
  const ramp=d3.interpolateRgbBasis(TM().heat);const fillOf=(v)=>v?ramp(.15+.85*v/max):'rgba(255,255,255,.06)';const inkOf=(v)=>{if(!v)return '#E8EDF6';const q=d3.color(fillOf(v)).rgb();return (0.299*q.r+0.587*q.g+0.114*q.b)>150?'#0B1430':'#FFFFFF';};
  const W=640,H=470,cx=320,cy=420,RO=390,RI=205,R0=74,A=Math.PI/4;
  const svg=d3.select(box).append('svg').attr('viewBox',`36 22 568 448`).attr('role','img').attr('aria-label',`Spray chart for ${n}: ${tot} batted balls shown`);
  svg.append('rect').attr('x',36).attr('y',22).attr('width',568).attr('height',448).attr('rx',10).attr('fill','#123A1F');
  const pt=(r,a)=>[cx+r*Math.sin(a),cy-r*Math.cos(a)];
  const wedge=(r0,r1,a0,a1)=>{const [x0,y0]=pt(r1,a0),[x1,y1]=pt(r1,a1),[x2,y2]=pt(r0,a1),[x3,y3]=pt(r0,a0);return `M${x0},${y0}A${r1},${r1} 0 0 1 ${x1},${y1}L${x2},${y2}A${r0},${r0} 0 0 0 ${x3},${y3}Z`;};
  const tip=(k)=>{const v=z[k]||{n:0,h:0,g:0,a:0};return `${NM[k]}: ${v.n} batted ball${v.n===1?'':'s'} in all, ${v.h} hit${v.h===1?'':'s'}, ${v.g} ground ball out${v.g===1?'':'s'} or FC, ${v.a} air out${v.a===1?'':'s'} or HR`;};
  const seg=(list,r0,r1,big)=>{const st=2*A/list.length;list.forEach(([k],i)=>{const a0=-A+i*st,a1=a0+st,v=c[k]||0;svg.append('path').attr('d',wedge(r0,r1,a0,a1)).attr('fill',fillOf(v)).attr('stroke','rgba(255,255,255,.55)').attr('stroke-width',1.2).append('title').text(tip(k));const [x,y]=pt((r0+r1)/2+(big?0:6),(a0+a1)/2);const g=svg.append('g').attr('pointer-events','none');g.append('text').attr('x',x).attr('y',y-(big?19:12)).attr('text-anchor','middle').attr('font-size',big?17:11).attr('fill',inkOf(v)).style('fill',inkOf(v)).text(k==='MID'?'Mid':k==='LS'?'Left':k==='RS'?'Right':k);g.append('text').attr('x',x).attr('y',y+(big?10:7)).attr('text-anchor','middle').attr('font-size',big?32:19).attr('font-weight',700).attr('fill',inkOf(v)).style('fill',inkOf(v)).text(v);if(big&&tot)g.append('text').attr('x',x).attr('y',y+29).attr('text-anchor','middle').attr('font-size',15).attr('fill',inkOf(v)).style('fill',inkOf(v)).text(pct(v,tot));});};
  seg(OF,RI,RO,true);seg(IF,R0,RI,false);
  [['P',cx,cy-46],['C',cx,cy+22]].forEach(([k,x,y])=>{const v=c[k]||0;svg.append('circle').attr('cx',x).attr('cy',y).attr('r',21).attr('fill',fillOf(v)).attr('stroke','rgba(255,255,255,.55)').append('title').text(tip(k));svg.append('text').attr('x',x).attr('y',y-4).attr('text-anchor','middle').attr('font-size',10).attr('fill',inkOf(v)).style('fill',inkOf(v)).attr('pointer-events','none').text(k);svg.append('text').attr('x',x).attr('y',y+11).attr('text-anchor','middle').attr('font-size',14).attr('font-weight',700).attr('fill',inkOf(v)).style('fill',inkOf(v)).attr('pointer-events','none').text(v);});
  const vol=document.createElement('div');vol.className='r22-vol';grid.append(vol);
  const L=new Set(['LF','LC','3B','LS','SS']),R=new Set(['RF','RC','1B','RS','2B']);const l=rows.filter((r)=>L.has(r.zone)).length,g=rows.filter((r)=>R.has(r.zone)).length,m=tot-l-g;
  const ro=(rowsOf('roster')||[]).find((r)=>r.name===n);const bats=ro&&ro.bt?ro.bt.split('/')[0]:'';const side={R:'Bats right.',L:'Bats left.',S:'Switch hitter.',B:'Switch hitter.'}[bats]||'Batting side not listed.';
  const lbl={all:'all batted balls',gb:'ground balls (ground outs and fielder\'s choices)',air:'balls in the air (fly, line and pop outs, plus home runs)',hits:'hits'}[mode];
  vol.innerHTML=`<div><b>Data used: ${used} of ${ab} at-bats (${pct(used,ab)})</b></div>`+
   `<table><tr><td>At-bats in 2026 play-by-play</td><td>${ab}</td></tr><tr><td>Strikeouts (no direction)</td><td>${k}</td></tr><tr><td>Balls in play</td><td>${bip}</td></tr><tr><td>Balls in play with a direction</td><td>${used} (${pct(used,bip)})</td></tr><tr><td>Ground balls (GO, FC)</td><td>${gb}</td></tr><tr><td>In the air (fly, line, pop outs; HR)</td><td>${air}</td></tr><tr><td>Hits and errors with no ball type</td><td>${untyped}</td></tr></table>`+
   `<div>Showing ${mode==='all'?'all '+tot+' batted balls':tot+' '+lbl}. ${side} Left side ${l} (${pct(l,tot)}), middle ${m} (${pct(m,tot)}), right side ${g} (${pct(g,tot)}).</div>`+
   `<div style="margin-top:6px;opacity:.85">Box scores say "grounded out" or "flied, lined or popped out" for outs, so those split cleanly. Singles, doubles, triples and errors don't say grounder or fly, so they appear under All and Hits only. ${bip-used} ball${bip-used===1?'':'s'} in play had no direction from the scorer.${used<30?' Fewer than 30 batted balls, so this is a small sample.':''}</div>`;
  return wrap;};
 const swap=(el)=>{const secs=[...el.querySelectorAll('.pc-sec')];const s=secs.find((x)=>/^Direction: partial/.test(x.textContent));if(!s)return;const bars=s.nextElementSibling&&s.nextElementSibling.classList.contains('md-bars')?s.nextElementSibling:null;const nw=build(el,view.player);s.replaceWith(nw);if(bars)bars.remove();};
 const pc=document.querySelector('[data-draw="pcard"]');if(pc&&typeof MutationObserver!=='undefined'){new MutationObserver(()=>{try{swap(pc);}catch(e){}}).observe(pc,{childList:true,subtree:true});swap(pc);}}

/* keep chart label colors as drawn: copy each svg text's fill attribute to an inline style */
{const fixT=(root)=>{(root.querySelectorAll?root.querySelectorAll('svg text[fill]'):[]).forEach((t)=>{const f=t.getAttribute('fill');if(f&&/^(#|rgb)/i.test(f)&&t.style.fill!==f)t.style.fill=f;});};
 const md=document.querySelector('.md');if(md&&typeof MutationObserver!=='undefined'){let q=false;new MutationObserver(()=>{if(q)return;q=true;requestAnimationFrame?requestAnimationFrame(()=>{q=false;fixT(md);}):setTimeout(()=>{q=false;fixT(md);},16);}).observe(md,{childList:true,subtree:true});fixT(md);}}

syncChips();
const nowShown=$$('[data-rmap]');nowShown.forEach((d)=>{d.hidden=d.dataset.rmap!==R.map;});
})();
