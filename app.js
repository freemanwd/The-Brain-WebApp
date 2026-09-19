/* THE BRAIN — original, dependency-free browser reimagining.
   All drawing and gameplay code is original. No ROM, emulator, external assets,
   analytics, credentials, patient uploads or network APIs are required. */
'use strict';
(() => {
const D = window.BRAIN_DATA;
const STORAGE_KEY = 'the-brain-game-v1';
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp = (n,lo,hi) => Math.min(hi, Math.max(lo,n));
const glyphs = {
 brain:'M12 3c-2-3-7-1-6 3-4 0-5 5-2 7-3 3-1 7 3 7 0 3 5 3 5 0V3Zm0 0c2-3 7-1 6 3 4 0 5 5 2 7 3 3 1 7-3 7 0 3-5 3-5 0M6 6c0 2 1 3 3 3M4 13c2-1 4 0 4 2M7 20v-3M18 6c0 2-1 3-3 3M20 13c-2-1-4 0-4 2M17 20v-3',
 hospital:'M4 22V6h16v16M8 6V2h8v4M10 22v-5h4v5M8 10h2m4 0h2M8 13h2m4 0h2',
 clipboard:'M9 4H5v18h14V4h-4M9 2h6v5H9zM8 11h8M8 15h8M8 19h5',
 scan:'M7 3H3v4m14-4h4v4M3 17v4h4m14-4v4h-4M12 5c-8 0-8 14 0 14s8-14 0-14Zm0 3v8M9 10h6m-6 4h6',
 surgery:'m4 20 6-6m-3-3 6 6m-4-4L19 3l2 2-10 10M3 21l3-1-2-2z',
 academy:'m2 8 10-5 10 5-10 5L2 8Zm4 3v6c3 3 9 3 12 0v-6M22 9v8',
 log:'M5 3h14v18H5zM8 7h8M8 11h8m-8 4h4M8 18h5',
 activity:'M2 12h4l3-8 5 16 3-8h5',
 arrow:'M4 12h16m-6-6 6 6-6 6',
 chevron:'m9 5 7 7-7 7',
 check:'m5 12 4 4L19 6',
 circle:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
 eye:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Zm13 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
 shield:'m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6l9-4Zm-5 9 3 3 7-7',
 clock:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 7v5l4 2',
 help:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9 9a3 3 0 1 1 5 2c-1 1-2 1-2 3m0 3h.01',
 sound:'M3 9h4l5-5v16l-5-5H3V9Zm13-2c4 2 4 8 0 10m3-13c7 4 7 12 0 16',
 mute:'M3 9h4l5-5v16l-5-5H3V9Zm13 0 6 6m0-6-6 6',
 full:'M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5',
 pause:'M8 4v16M16 4v16',
 play:'m7 3 14 9-14 9V3Z',
 refresh:'M20 8a8 8 0 1 0 0 8M20 3v5h-5',
 download:'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5',
 close:'m6 6 12 12M18 6 6 18',
 user:'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 22v-3c0-7 16-7 16 0v3',
 users:'M14 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM2 21v-3c0-6 16-6 16 0v3M18 4c5 0 5 8 0 8m2 3c3 0 3 4 3 6',
 star:'m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6Z',
 info:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 10v7m0-10h.01',
 bell:'M5 17h14l-2-4V8c0-7-10-7-10 0v5l-2 4Zm5 3h4',
 scalpel:'m3 21 9-9m-2-2 4 4m-2-2 7-10c4 3 2 6-1 9l-4 3',
 drill:'M4 5h11l5 4-5 4H4V5Zm4 8v7h5v-7M20 9h3M3 7H1m2 4H1',
 retractor:'M5 2v13c0 6 5 6 5 2v-3M19 2v13c0 6-5 6-5 2v-3M3 2h4m10 0h4',
 suction:'M3 21h7V10l8-7m-5 11 8-8m-11 4 3 4m-3 0v7',
 bipolar:'M6 3c4 2 6 6 6 18M18 3c-4 2-6 6-6 18M7 4l10 0',
 forceps:'m5 2 7 19 7-19M9 13l-3 2m9-2 3 2',
 clip:'M9 6a4 4 0 1 1 6 0l-3 5-8 9m8-9 8 9M7 17l10 0',
 suture:'M3 16c3-10 13-13 18-9 0 6-10 13-15 11m15-11c5 15-19 17-19 10',
 lock:'M5 10h14v12H5V10Zm3 0V6c0-6 8-6 8 0v4m-4 5v3',
 leaf:'M4 20C0 5 12 6 21 2c2 14-9 20-17 18Zm0 0L16 8',
 trophy:'M7 3h10v8c0 6-10 6-10 0V3Zm0 2H3v4c0 3 4 3 4 3m10-7h4v4c0 3-4 3-4 3m-5 4v6m-4 0h8'
};
function icon(name,extra=''){return `<svg class="icon ${extra}" viewBox="0 0 24 24" aria-hidden="true"><path d="${glyphs[name]||glyphs.brain}"/></svg>`;}
function btn(label,action,extra='',cls=''){return `<button class="btn ${cls}" data-action="${action}" ${extra}>${label}</button>`;}
function initialsAvatar(c){
 const shirt = c.sex==='F'?'#809f91':'#799993';
 return `<div class="avatar" aria-hidden="true"><svg viewBox="0 0 24 24" shape-rendering="crispEdges"><rect width="24" height="24" fill="#2d4035"/><path d="M4 24V19H7V16H17V19H20V24" fill="${shirt}"/><path d="M9 14H15V19H9Z" fill="${c.color}"/><path d="M6 5H18V13H16V16H8V13H6Z" fill="${c.color}"/><path d="M6 7V4H8V2H16V3H18V8H16V5H8V7Z" fill="${c.hair}"/><path d="M8 9H10V10H8Zm6 0h2v1h-2Z" fill="#2e302b"/><path d="M10 13H14V14H10Z" fill="#775746"/><path d="M9 19 12 22 15 19" fill="none" stroke="#c5d2c3"/></svg></div>`;
}
function blankState(){return {version:1,view:'hospital',current:null,settings:{mode:'guided',sound:false,crt:true},cases:{},records:[],activeStudy:'ct',slice:10,recordId:null};}
function blankCase(){return {phase:'new',exams:[],ordered:[],reviewed:[],wrongDx:0,wrongPlan:0,hints:0,checks:[],dxSelection:'',planSelection:'',log:[],op:null};}
let storageOK=true, saveError='', state=blankState();
try{
 const raw=localStorage.getItem(STORAGE_KEY);
 if(raw){
  const parsed=JSON.parse(raw);
  if(parsed.version===1 && parsed.cases && typeof parsed.cases==='object' && Array.isArray(parsed.records)){
   state={...blankState(),...parsed,settings:{...blankState().settings,...parsed.settings}};
   if(!['guided','challenge'].includes(state.settings.mode))state.settings.mode='guided';
   state.records=state.records.filter(r=>D.cases.some(c=>c.id===r.caseId) && Number.isFinite(r.score));
   D.cases.forEach(c=>{if(state.cases[c.id]){
    const saved=state.cases[c.id];
    if(!Array.isArray(saved.exams)||!Array.isArray(saved.ordered)||!Array.isArray(saved.reviewed)||!Array.isArray(saved.log)||!Array.isArray(saved.checks))state.cases[c.id]=blankCase();
    else{
     state.cases[c.id]={...blankCase(),...saved};
     if(saved.op && (!Array.isArray(saved.op.done)||!Number.isFinite(saved.op.stage)||!Number.isFinite(saved.op.health)))state.cases[c.id]=blankCase();
     else if(saved.op && saved.phase==='operating')state.cases[c.id].op.paused=true;
    }
   }});
  }
 }
}catch(e){storageOK=false;saveError='Browser storage is unavailable or a saved game could not be read. This session still works.';}
const views=['hospital','chart','imaging','theatre','academy','journal','debrief'];
if(!views.includes(state.view))state.view='hospital';
if(!D.cases.some(c=>c.id===state.current)){state.current=null;if(['chart','imaging','theatre','debrief'].includes(state.view))state.view='hospital';}
state.settings.sound=false; // No sound autoplay, including on reload.
let toastTimer=null, audio=null, lastFrame=0, lastTick=performance.now(), secondCounter=0;
let activeTab='reasoning', showScanAnnotations=false, runFrame=0, lastMiss=0, lastPaintTarget='';
const getCase=()=>D.cases.find(c=>c.id===state.current);
const getCS=()=>state.current?(state.cases[state.current] ||= blankCase()):null;
const completed=()=>D.cases.filter(c=>state.records.some(r=>r.caseId===c.id && r.success)).length;
function save(){
 try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));storageOK=true;}
 catch(e){storageOK=false;}
}
function log(text,cs=getCS()){if(cs)cs.log.push({time:new Date().toISOString(),text});}
function toast(text,error=false){
 const el=$('#toast');el.textContent=text;el.className=`visible${error?' error':''}`;clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.className='',4200);
}
function beep(kind='click'){
 if(!state.settings.sound)return;
 try{
  if(!audio)audio=new (window.AudioContext||window.webkitAudioContext)();
  if(audio.state==='suspended')audio.resume().catch(()=>{});
  const oscillator=audio.createOscillator(),gain=audio.createGain();
  oscillator.type=kind==='error'?'sawtooth':'sine';
  oscillator.frequency.value=kind==='error'?180:kind==='success'?740:kind==='pulse'?520:420;
  gain.gain.setValueAtTime(.0001,audio.currentTime);gain.gain.exponentialRampToValueAtTime(kind==='pulse'?.02:.045,audio.currentTime+.005);gain.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+.10);
  oscillator.connect(gain);gain.connect(audio.destination);oscillator.start();oscillator.stop(audio.currentTime+.12);
 }catch(e){state.settings.sound=false;toast('Audio is not supported in this browser.');}
}
function move(view){
 state.view=view;save();render();window.scrollTo({top:0,behavior:'instant'});
 const main=$('#main');if(main)main.focus({preventScroll:true});
}
function openCase(id){
 if(!D.cases.some(c=>c.id===id))return;
 state.current=id;const cs=getCS();
 if(cs.phase==='new'){cs.phase='investigating';log('Case opened. Initial stabilization and triage are assumed to occur in parallel.');}
 if(cs.phase==='operating' || cs.phase==='preop' || cs.phase==='handoff')move('theatre');
 else if(['complete','failed'].includes(cs.phase)){state.recordId=cs.recordId;move('debrief');}
 else move('chart');
}
function startShift(){const c=D.cases.find(c=>!state.records.some(r=>r.caseId===c.id&&r.success))||D.cases[0];openCase(c.id);}
function rank(){const n=completed();return n>=6?'Chief resident':n>=4?'Senior resident':n>=2?'Resident':'New resident';}
function header(){
 const nav=[['hospital','hospital','Hospital'],['chart','clipboard','Patient chart'],['imaging','scan','Imaging'],['theatre','surgery','Operating room'],['academy','academy','Academy'],['journal','log','Case log']];
 return `<header class="app-header"><div class="topbar"><button class="brand" data-action="go" data-view="hospital" aria-label="The Brain home"><span class="brand-symbol">${icon('brain')}</span><span><span class="brand-title">THE BRAIN</span><span class="brand-subtitle" style="display:block">A LIFE & DEATH–INSPIRED SIMULATION</span></span></button><div class="header-tools"><span class="live-tag"><span class="live-dot"></span>NEURO GENERAL · ON CALL</span><select class="mode-select" id="mode" aria-label="Game difficulty"><option value="guided" ${state.settings.mode==='guided'?'selected':''}>Guided mode</option><option value="challenge" ${state.settings.mode==='challenge'?'selected':''}>Challenge mode</option></select><button class="icon-btn" data-action="sound" aria-label="${state.settings.sound?'Mute':'Enable sound'}" title="${state.settings.sound?'Mute':'Enable sound'}">${icon(state.settings.sound?'sound':'mute')}</button><button class="icon-btn fullscreen-btn" data-action="fullscreen" aria-label="Toggle fullscreen" title="Fullscreen">${icon('full')}</button><button class="icon-btn help-btn" data-action="help" aria-label="How to play" title="How to play">${icon('help')}</button></div></div><div class="nav-row"><nav class="nav" aria-label="Main navigation">${nav.map(([id,ic,title])=>`<button data-action="go" data-view="${id}" class="${state.view===id||(state.view==='debrief'&&id==='journal')?'active':''}" ${state.view===id?'aria-current="page"':''}>${icon(ic)}${title}</button>`).join('')}</nav><span class="nav-status">${icon('shield')}${rank()}</span></div></header>`;
}
function footer(){return `<footer class="app-footer"><div>FICTIONAL PATIENTS · SCHEMATIC IMAGING · GAMEPLAY, NOT CLINICAL TRAINING</div><div>${storageOK?'LOCAL AUTOSAVE ON':'STORAGE UNAVAILABLE'} <span aria-hidden="true">&nbsp; / &nbsp;</span><button data-action="help">How to play</button> <span aria-hidden="true">&nbsp; / &nbsp;</span><button data-action="about">About & credits</button> <span aria-hidden="true">&nbsp; / &nbsp;</span> V1.0</div></footer>`;}
function heading(kicker,title,subtitle='',right=''){return `<div class="page-heading"><div><div class="eyebrow">${kicker}</div><h1>${title}</h1>${subtitle?`<p class="subtitle">${subtitle}</p>`:''}</div>${right}</div>`;}
function panel(title,body,headRight=''){return `<section class="panel"><div class="panel-head"><h3>${title}</h3>${headRight}</div>${body}</section>`;}
function note(text){return `<div class="footnote">${icon('info')}<span>${text}</span></div>`;}
function empty(title,text,action='start',label='Open a patient chart',ic='clipboard'){return `<section class="panel empty-state">${icon(ic)}<h2>${title}</h2><p>${text}</p>${btn(label,action,'','primary')}</section>`;}
function caseHeader(){const c=getCase();if(!c)return '';return `<div class="breadcrumb"><button data-action="go" data-view="hospital">Hospital</button>${icon('chevron')}<span>Bed ${c.bed}</span>${icon('chevron')}<span>${c.name}</span></div><div class="case-bar">${initialsAvatar(c)}<div class="case-title"><div class="eyebrow">BED ${c.bed} / ${c.location}</div><h1>${c.name}</h1><p>${c.age} years · ${c.sex} · Fictional case</p></div><span class="chip ${c.priority}">${c.priority==='routine'?'Standard':c.priority} priority</span><div class="case-bar-vitals"><div class="vital-mini"><b>${c.vitals.hr}</b><span>HR / BPM</span></div><div class="vital-mini"><b>${c.vitals.bp}</b><span>BP / MMHG</span></div><div class="vital-mini"><b>${c.vitals.gcs}</b><span>GCS / 15</span></div></div></div>`;}
function workflow(active){return `<div class="workflow" aria-label="Case progress">${['Examine','Investigate','Decide','Treat','Debrief'].map((t,i)=>`<div class="workflow-step ${i===active?'active':i<active?'done':''}"><span class="num">${i<active?'✓':i+1}</span>${t}${i<4?'<span class="connector"></span>':''}</div>`).join('')}</div>`;}
function patientCard(c){const cs=state.cases[c.id]||blankCase();const phase={new:'New admission',investigating:'Under review',diagnosed:'Plan pending',preop:'Ready for theatre',operating:'In theatre',handoff:'Handoff pending',complete:'Case completed',failed:'Review needed'}[cs.phase]||'New admission';return `<article class="patient-card ${state.current===c.id?'active-case':''}"><div class="patient-card-top"><span class="bed">BED ${c.bed}</span><span class="chip ${cs.phase==='complete'?'done':c.priority}">${cs.phase==='complete'?'Completed':c.priority==='routine'?'Standard':c.priority}</span></div><div class="row">${initialsAvatar(c)}<div><h3>${c.name}</h3><p class="patient-meta">${c.age} years · ${c.sex} · ${c.location==='Emergency department'?'Emergency':c.location}</p></div></div><p class="complaint">${c.complaint}</p><div class="patient-card-bottom"><span class="patient-status">${phase}</span><button class="btn" data-action="case" data-id="${c.id}">${['complete','failed'].includes(cs.phase)?'View debrief':cs.phase==='new'?'Open chart':'Continue'}${icon('arrow')}</button></div></article>`;}
function hospital(){
 const n=completed(),attempts=state.records.filter(r=>r.success), avg=attempts.length?Math.round(attempts.reduce((s,r)=>s+r.score,0)/attempts.length):0;
 return `${heading('WELCOME TO NEURO GENERAL',"You’re on call.",'The next chapter of a DOS classic. A new shift starts with you.',`<div class="shift-label">RESIDENCY / SHIFT 01<strong>08:00 <span class="small dim">AM</span></strong>SIMULATION TIME</div>`)}<section class="hero"><div class="hero-copy"><div class="eyebrow">THE NEUROSURGERY SIMULATOR, REIMAGINED</div><h2>A steady hand.<br><span>A sharper mind.</span></h2><p>Read the signs. Make the call. Step into the operating room. Six patients are counting on your next decision.</p><div class="hero-actions">${btn(`${n?'Continue your shift':'Begin your shift'} ${icon('arrow')}`,'start','','primary')}${btn('How to play','help','','secondary')}</div></div><div class="hero-art"><canvas id="hero-canvas" width="760" height="500" aria-label="Original green wireframe-style brain illustration" role="img"></canvas><div class="atlas-label">NEURAL ATLAS<br><span class="dim">SCHEMATIC / 001</span></div><div class="atlas-bottom"><span>HUMAN BRAIN · SUPERIOR VIEW</span><span>SIMULATION ONLY</span></div></div></section><div class="metrics"><div class="metric"><div class="metric-icon">${icon('users')}</div><div><div class="metric-value">${String(6-n).padStart(2,'0')}</div><div class="metric-label">Patients awaiting completion</div></div><span class="metric-note">YOUR NEXT CALL</span></div><div class="metric"><div class="metric-icon">${icon('surgery')}</div><div><div class="metric-value">03</div><div class="metric-label">Procedure types to master</div></div><span class="metric-note">HANDS-ON LEVELS</span></div><div class="metric"><div class="metric-icon">${icon('trophy')}</div><div><div class="metric-value">${String(n).padStart(2,'0')}<span class="dim" style="font-size:14px"> / 06</span></div><div class="metric-label">Cases successfully completed</div></div><span class="metric-note">${avg?'AVG '+avg+' / 100':'A NEW BEGINNING'}</span></div></div><div class="columns"><section><div class="section-heading"><h2>Patient board <span class="count">6 CASES</span></h2><span class="eyebrow" style="font-size:9px;letter-spacing:.7px">READY FOR REVIEW</span></div><div class="patient-grid">${D.cases.map(patientCard).join('')}</div></section><aside class="stack"><section class="panel panel-pad"><div class="eyebrow">THE ON-CALL DESK</div><div class="mentor-header"><span class="mentor-avatar">${icon('user')}</span><div><h3>Dr. Rowan</h3><span class="small dim">Your attending · fictional guide</span></div></div><p class="mentor-message mentor-quote">“Good surgery starts before the first incision. Know the patient. Understand the image. Then decide.”</p><ol class="mini-steps"><li><span class="step-index">01</span>Read the history & examination</li><li><span class="step-index">02</span>Review the relevant imaging</li><li><span class="step-index">03</span>Choose a diagnosis & care plan</li><li><span class="step-index">04</span>Treat, hand off & debrief</li></ol></section><section class="tip-card"><div class="eyebrow">${icon('academy')} YOUR FIRST SHIFT?</div><p>Start with bed 01 in Guided mode. There is no time-pressure penalty, and your attending can offer a hint.</p>${btn(`Visit the academy ${icon('arrow')}`,'go','data-view="academy"','full')}</section>${note('A tribute to the spirit of the original game. All code, artwork and fictional cases are new. No DOS installation required.')}</aside></div>`;
}
function gates(){const c=getCase(),cs=getCS();return {history:cs.exams.includes('history'),exam:cs.exams.length>=3,images:c.required.every(t=>cs.reviewed.includes(t))};}
function gateHTML(){const c=getCase(),g=gates();return `<div class="gate-list"><div class="gate ${g.history?'met':''}">${icon(g.history?'check':'circle')}History documented</div><div class="gate ${g.exam?'met':''}">${icon(g.exam?'check':'circle')}At least 3 of 4 assessment items</div><div class="gate ${g.images?'met':''}">${icon(g.images?'check':'circle')}${c.required.length?c.required.map(t=>D.tests.find(x=>x.id===t).name).join(' + ')+' reviewed':'Clinical diagnosis; no mandatory imaging'}</div></div>`;}
function chart(){
 const c=getCase(),cs=getCS();if(!c)return `${heading('PATIENT CHART','Start with a patient.')}${empty('Your charts are waiting.','Select a patient from the hospital board to review their history, examination and investigations.')}`;
 const decided=['diagnosed','preop','operating','handoff','complete','failed'].includes(cs.phase), finished=['complete','failed'].includes(cs.phase);
 let decisionContent;
 if(!decided){decisionContent=`<p class="small muted">Put the history, examination and imaging together.</p>${gateHTML()}<label class="form-label" for="diagnosis">Working diagnosis</label><select class="select" id="diagnosis"><option value="">Select your diagnosis…</option>${D.diagnoses.map(d=>`<option value="${d.id}" ${cs.dxSelection===d.id?'selected':''}>${d.label}</option>`).join('')}</select>${cs.feedback?`<div class="hint-box error mt">${escapeHTML(cs.feedback)}</div>`:''}<div class="chart-actions">${btn('Confirm diagnosis','diagnose','','primary full')}</div>`;}
 else{decisionContent=`<div class="chip done">${icon('check')}DIAGNOSIS CONFIRMED</div><h3 style="margin-top:15px">${D.diagnoses.find(d=>d.id===c.diagnosis).label}</h3><p class="small muted mt">${c.rationale}</p>${finished?btn('Review case debrief','debrief','','primary full mt'):['preop','operating','handoff'].includes(cs.phase)?btn('Continue care plan','go','data-view="theatre"','primary full mt'):`<label class="form-label" for="plan">Management pathway</label><select class="select" id="plan"><option value="">Select a care plan…</option>${D.plans.map(p=>`<option value="${p.id}" ${cs.planSelection===p.id?'selected':''}>${p.label}</option>`).join('')}</select>${cs.planFeedback?`<div class="hint-box error mt">${escapeHTML(cs.planFeedback)}</div>`:''}${btn('Confirm care plan '+icon('arrow'),'commit-plan','','primary full mt')}`}`;}
 return `${caseHeader()}${workflow(decided?2:0)}<div class="chart-layout"><div class="stack"><section class="panel history-card"><div class="eyebrow">PRESENTING CONCERN</div><p class="history-quote">${c.quote}</p><p>${c.intro}</p><div class="inline-note">Initial vitals: HR ${c.vitals.hr} bpm · BP ${c.vitals.bp} mmHg · SpO₂ ${c.vitals.spo2}% · GCS ${c.vitals.gcs}/15. Fixed fictional case data, not a live physiological model.</div></section>${panel('Bedside assessment',`<div class="exam-grid">${D.exams.map(e=>`<button class="exam-button ${cs.exams.includes(e.id)?'checked':''}" data-action="exam" data-id="${e.id}">${icon(e.icon)}<div><h4>${e.label}</h4><small>${e.sub}</small></div><span>${icon(cs.exams.includes(e.id)?'check':'chevron')}</span></button>`).join('')}</div><div class="findings">${cs.exams.length?D.exams.filter(e=>cs.exams.includes(e.id)).map(e=>`<div class="finding-row"><b>${e.id==='history'?'History':e.id==='mental'?'Mental status':e.id==='pupils'?'Pupils & eyes':'Motor & sensory'}</b><span>${c.findings[e.id]}</span></div>`).join(''):'<p class="small dim">Select an assessment above to reveal and document its findings.</p>'}</div>`,`<span class="mono small green">${cs.exams.length}/4</span>`)}${note('Assessment gates are game mechanics. Real emergency assessment and stabilization occur in parallel; do not delay time-critical care to reproduce a game sequence.')}</div><aside class="stack">${panel('Your clinical decision',`<div class="panel-pad">${decisionContent}</div>`,icon('brain'))}${panel('Investigations',`<div class="order-grid">${D.tests.map(t=>`<div class="order-card">${icon(t.icon)}<div><h4>${t.name}</h4><p>${cs.reviewed.includes(t.id)?'Report reviewed':cs.ordered.includes(t.id)?'Ready to review':t.description}</p></div>${btn(cs.ordered.includes(t.id)?'View':'Order','order',`data-id="${t.id}"`,'compact')}</div>`).join('')}<p class="tiny dim">Tests are instantaneous game actions. Optional testing is not a recommendation for real care.</p></div>`)}<div class="panel panel-pad"><div class="row between"><span class="small muted">Need a second opinion?</span>${btn('Ask attending','hint','','compact')}</div></div></aside></div>`;
}
function imaging(){
 const c=getCase(),cs=getCS();if(!c)return `${heading('RADIOLOGY','Read between the slices.')}${empty('No patient selected.','Open a case to order and review its synthetic imaging studies.','start','Select a patient','scan')}`;
 const available=cs.ordered;let selected=state.activeStudy;
 if(!available.includes(selected))selected=available[0];
 if(selected)state.activeStudy=selected;
 const test=D.tests.find(t=>t.id===selected),study=selected?c.studies[selected]:null;
 return `${caseHeader()}${workflow(1)}<div class="imaging-layout">${panel('Study worklist',`<div class="study-list">${D.tests.map(t=>cs.ordered.includes(t.id)?`<button class="study-button ${selected===t.id?'active':''}" data-action="study" data-id="${t.id}">${icon(t.icon)}<span><strong>${t.name}</strong><small>${cs.reviewed.includes(t.id)?'✓ REVIEWED':'READY TO REVIEW'}</small></span></button>`:`<button class="study-button" data-action="order" data-id="${t.id}">${icon(t.icon)}<span><strong>${t.name}</strong><small>+ ORDER STUDY</small></span></button>`).join('')}</div>`)}<div class="stack"><section class="scan-panel">${study?`<div class="scan-toolbar"><span>${test.name.toUpperCase()} / SCHEMATIC VIEWER</span><span class="chip blue">SYNTHETIC</span></div><div class="scan-wrap"><canvas id="scan-canvas" width="640" height="640" role="img" aria-label="Schematic ${test.name} image. Full text findings appear in the radiology report."></canvas><div class="scan-meta">NG-${c.bed}-0001<br>${c.name.toUpperCase()}<br>${c.age} Y / ${c.sex}</div><div class="scan-right">NOT A DICOM STUDY<br><span id="slice-caption">SL ${state.slice}/20</span><br>ILLUSTRATIVE ONLY</div><div class="scan-stamp">SCHEMATIC IMAGE · NOT FOR DIAGNOSIS</div></div><div class="scan-controls"><label for="slice">SLICE <input type="range" min="1" max="20" value="${state.slice}" id="slice" aria-label="Illustrative image slice"></label><span id="slice-value">${String(state.slice).padStart(2,'0')} / 20</span></div>`:`<div class="study-empty">${icon('scan')}<h2>No studies yet.</h2><p>Order a study from the worklist.<br>The patient chart determines what is relevant.</p></div>`}</section><div class="row wrap">${btn(icon('clipboard')+' Return to chart','go','data-view="chart"')}${study?btn(showScanAnnotations?'Hide image overlay':'Show image overlay','annotate','','secondary'):''}</div>${note('Each slider position is a procedural variation of one schematic, not a true volumetric scan. Interpret the written fictional report; do not learn anatomy or image diagnosis from this viewer.')}</div><section class="panel"><div class="panel-head"><h3>Radiology report</h3>${icon('clipboard')}</div>${study?`<div class="report"><span class="chip ${cs.reviewed.includes(selected)?'done':'urgent'}">${cs.reviewed.includes(selected)?'Reviewed':'Awaiting your review'}</span><div class="eyebrow mt">${test.name} · FICTIONAL STUDY</div><h3>Findings</h3><p>${study.finding}</p><h3>Impression</h3><p>${study.impression}</p>${btn(cs.reviewed.includes(selected)?icon('check')+' Report reviewed':'Mark report reviewed','review-study',`data-id="${selected}" ${cs.reviewed.includes(selected)?'disabled':''}`,'primary full mt')}<p class="tiny dim mt">This text is the authoritative game finding. A diagram is not a radiology image.</p></div>`:'<div class="report-placeholder">Select an available study to view its findings and impression.</div>'}</section></div>`;
}
function stages(c=getCase()){
 const common=[
  {name:'Access the field',tool:'scalpel',ordered:true,points:[[31,32],[43,23],[58,23],[69,35]],instruction:'Select the scalpel, then follow markers 1–4 in order. Click or drag across each marker.'},
  {name:'Create a bone window',tool:'drill',points:[[35,36],[65,36],[50,68]],instruction:'Select the drill and clear all three game markers.'},
  {name:'Expose the target',tool:'retractor',points:[[28,50],[72,50]],instruction:'Select the retractor and activate both edge markers.'}
 ];
 if(c.procedure==='hematoma')common.push({name:'Evacuate the collection',tool:'suction',points:[[36,34],[32,54],[40,73],[51,50]],instruction:'Select suction and clear the four collection markers. These are arcade targets, not tissue planes.'});
 else if(c.procedure==='tumor')common.push({name:'Remove the target lesion',tool:'forceps',points:[[41,40],[59,40],[41,61],[59,61]],instruction:'Select forceps and clear the four lesion markers. The game does not represent real resection margins.'});
 else common.push({name:'Secure the aneurysm',tool:'clip',points:[[52,46]],instruction:'Select the clip and activate the neck marker. Preserve the illustrated parent vessel by avoiding off-target clicks.'});
 common.push({name:'Check the operative field',tool:'bipolar',points:[[37,40],[63,40],[50,64]],instruction:'Select bipolar and clear the three verification markers. This is a simplified game stage, not a hemostasis protocol.'});
 common.push({name:'Complete closure',tool:'suture',ordered:true,points:[[31,32],[43,23],[58,23],[69,35]],instruction:'Select suture and connect markers 1–4 in order to finish the level.'});
 return common;
}
const surgicalChecks=[
 ['Identity, procedure & consent','The fictional patient, indication, intended procedure and consent are confirmed.'],
 ['Imaging, side & team briefing','The team reviews the correct case and imaging together. The game field is not anatomically registered.'],
 ['Anesthesia & patient readiness','The fictional team confirms readiness, monitoring and relevant medication or bleeding risks.'],
 ['Preparation & equipment check','The team confirms preparation, equipment and readiness for a surgical time-out.']
];
function checksHTML(items){const cs=getCS();return `<div class="checklist">${items.map(([title,desc],i)=>`<label class="check-item ${cs.checks.includes(i)?'checked':''}"><input type="checkbox" data-check="${i}" ${cs.checks.includes(i)?'checked':''}><span><strong>${title}</strong><small>${desc}</small></span></label>`).join('')}</div>`;}
function theatre(){
 const c=getCase(),cs=getCS();
 if(!c)return `${heading('OPERATING ROOM','Before the first incision.')}${empty('No patient on the operating list.','Assess a patient, confirm a diagnosis and choose the appropriate management pathway.','start','Open a patient chart','surgery')}`;
 if(['complete','failed'].includes(cs.phase))return `${caseHeader()}${empty('This case has ended.','Your debrief contains the outcome, decision history and points to revisit.','debrief','Review debrief','log')}`;
 if(!['preop','operating','handoff'].includes(cs.phase))return `${caseHeader()}${empty('A decision comes first.','Confirm the diagnosis and management plan before moving into treatment. Not every case belongs in an operating room.','return-chart','Return to patient chart','lock')}`;
 if(cs.phase==='handoff')return `${caseHeader()}${workflow(3)}<div class="chart-layout"><section class="panel safety-intro"><span class="chip done">NO OPEN OPERATION</span><h2>The right care. The right team.</h2><p>${c.rationale}</p>${checksHTML(c.handoff)}${btn('Complete care pathway '+icon('arrow'),'finish-handoff',`id="check-submit" ${cs.checks.length<4?'disabled':''}`,'primary full mt')}</section><aside class="stack">${panel('A deliberate decision',`<div class="panel-pad"><p class="mentor-message">${c.nuance}</p></div>`)}${note('This is a simulated handoff checklist. It is neither a complete clinical protocol nor a substitute for emergency assessment.')}</aside></div>`;
 if(cs.phase==='preop')return `${caseHeader()}${workflow(3)}<div class="safety-hero"><section class="panel safety-intro"><div class="eyebrow">PREOPERATIVE BRIEFING</div><h2>Take a breath.<br>Take a time-out.</h2><p>${c.operationNote}</p>${checksHTML(surgicalChecks)}${btn('Enter the simulation '+icon('arrow'),'begin-op',`id="check-submit" ${cs.checks.length<4?'disabled':''}`,'primary full mt')}</section><div class="stack"><div class="safety-art">${icon('surgery')}</div>${panel('Your controls',`<div class="panel-pad"><p class="mentor-message">Choose an instrument from the tray, then click the numbered targets. For access and closure, follow the markers in order. Use <span class="keyboard">1–8</span> to switch instruments and <span class="keyboard">P</span> to pause.</p><p class="small muted mt">${state.settings.mode==='guided'?'Guided mode highlights the correct instrument. Stability does not decline with time.':'Challenge mode adds time pressure and removes instrument recommendations. A team assist is available once.'}</p></div>`)}${note('The procedure is an arcade abstraction. It omits most anatomy, anesthesia, operative steps and complications. It cannot train or assess surgical competence.')}</div></div>`;
 const op=cs.op,seq=stages(c),stage=seq[op.stage];
 if(!stage){finishCase(true);return '';}
 return `${caseHeader()}<div class="op-layout"><section class="op-workspace ${op.mode==='challenge'?'challenge':''}"><div class="op-toolbar"><div><span class="eyebrow">STAGE ${op.stage+1} / ${seq.length}</span><div class="op-stage-name">${stage.name}</div></div><div class="row"><span id="op-clock" class="mono small muted">${formatTime(op.time)}</span><button class="icon-btn" data-action="pause" aria-label="${op.paused?'Resume':'Pause'} simulation" title="Pause / resume (P)">${icon(op.paused?'play':'pause')}</button></div></div><div class="op-field" id="op-field" role="group" aria-label="Interactive schematic operative field"><canvas id="op-canvas" width="760" height="480" aria-hidden="true"></canvas><span class="op-field-label">OPERATIVE SCHEMATIC<br>NOT TO SCALE</span><span class="op-field-label right">${c.procedure.toUpperCase()} LEVEL<br>${op.mode.toUpperCase()} MODE</span>${stage.points.map(([x,y],i)=>`<button class="op-target ${op.done.includes(i)?'completed':''}" style="--x:${x};--y:${y}" data-action="target" data-target="${i}" data-stage="${op.stage}" ${op.done.includes(i)?'disabled':''} aria-label="${stage.name}, target ${i+1}${op.done.includes(i)?', completed':''}">${op.done.includes(i)?icon('check'):i+1}</button>`).join('')}${op.paused?`<div class="pause-overlay">${icon('pause')}<h2>Simulation paused.</h2><p>The clock and stability meter are stopped. Take the time you need.</p>${btn('Resume simulation','pause','','primary')}</div>`:''}</div><div class="op-instruction">${icon('info')}<div><p>${op.mode==='guided'?stage.instruction:`${stage.name}. Choose the appropriate instrument, then clear the marked targets${stage.ordered?' in numerical order':''}.`}</p><small>Selected: <span id="selected-tool-name">${D.tools.find(t=>t.id===op.selected)?.name||'None'}</span> · <span id="target-progress">${op.done.length}/${stage.points.length}</span> targets · Tab + Enter works without a mouse.</small></div></div><div class="instrument-tray" role="group" aria-label="Instrument tray">${D.tools.map(t=>`<button class="tool-button ${op.selected===t.id?'selected':''} ${op.mode==='guided'&&stage.tool===t.id?'recommended':''}" data-action="tool" data-id="${t.id}" aria-label="${t.name}, keyboard ${t.key}" aria-pressed="${op.selected===t.id}"><kbd>${t.key}</kbd>${icon(t.icon)}<span>${t.name}</span></button>`).join('')}</div></section><aside class="stack"><section class="monitor"><div class="monitor-head"><span>ARCADE MONITOR</span><span class="green">● SIM</span></div><canvas class="waveform" id="wave-canvas" width="570" height="170" aria-label="Decorative simulated waveform" role="img"></canvas><div class="monitor-values"><div><span class="label">HEART RATE</span><strong>72</strong><span class="unit">BPM · FICTIONAL</span></div><div><span class="label">SpO₂</span><strong style="color:var(--blue)">99</strong><span class="unit">% · FICTIONAL</span></div><div><span class="label">ERRORS</span><strong style="color:var(--gold)" id="op-misses">${op.misses}</strong><span class="unit">GAME ACTIONS</span></div></div><div class="stability"><div class="stability-label"><span>GAME STABILITY</span><span id="stability-value">${Math.ceil(op.health)} / 100</span></div><div class="bar ${op.health<35?'low':''}" id="stability-bar"><span style="width:${op.health}%"></span></div><div class="tiny dim" style="margin-top:9px">Not a physiological or outcome model.</div></div></section>${panel('Procedure progress',`<ol class="op-step-list">${seq.map((s,i)=>`<li class="${i<op.stage?'complete':i===op.stage?'current':''}"><span class="step-circle">${i<op.stage?icon('check'):i+1}</span>${s.name}</li>`).join('')}</ol><div class="panel-pad" style="padding-top:3px"><div class="row" style="gap:8px">${btn('Hint','hint','','compact')}${btn('Team assist','assist',`${op.assistUsed?'disabled':''}`,'compact')}</div><p class="tiny dim" style="margin-top:9px">Team assist restores up to 25 game stability points once; −4 score points.</p></div>`)}${note('Leaving this screen, opening a dialog or hiding the browser pauses time pressure. Guided mode has no time-based stability loss.')}</aside></div>`;
}
function formatTime(seconds){const n=Math.floor(seconds||0);return `${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;}
function academy(){
 const categories={
 reasoning:[
  ['01 / ASSESS','Start with the story.','Onset, trajectory and context frame the puzzle. Compare an abrupt change with a process that evolves over weeks.','In this game, record a history and at least two examination items before confirming a diagnosis. Completing all four earns the full assessment score. These gates are game rules, not an emergency-care sequence.'],
  ['02 / INVESTIGATE','The image is evidence.','Read the findings and the impression. The viewer is deliberately schematic; the written report defines each fictional study.','CT, MRI and CT angiography serve different roles in these puzzles. Required studies must be marked reviewed. A study without an abnormality is not proof that a patient is well. The slice slider is an illustration control, not a real volumetric stack.'],
  ['03 / DECIDE','Not every case is surgical.','Choosing not to operate can be the most important decision in the game. Match the management pathway to the diagnosis.','Some patients should go directly to a specialist team; others need nonsurgical management with reassessment. The game rewards a correct care pathway, not the number of procedures performed.'],
  ['04 / REASSESS','Uncertainty is information.','A hypothesis is not a confirmed diagnosis. Be willing to return to the chart and revisit a finding.','Incorrect answers generate feedback and reduce the reasoning score. The attending hint explains how to approach the case without locking you out of further investigation.'],
  ['05 / HAND OFF','Close the communication loop.','A level does not end with the final instrument. Communicate what happened and what must happen next.','Nonoperative cases end with a structured handoff checklist. Operative debriefs explicitly separate completion of the arcade task from an actual clinical outcome.'],
  ['06 / REFLECT','Learn from the debrief.','Review the reasoning, instrument errors and omitted assessment items. Then replay with a more deliberate approach.','Your case log stores individual attempts locally. Export a JSON record for prototype review. Scores are custom game metrics, not validated measures of knowledge or surgical competence.']
 ],
 controls:[
  ['01 / INSTRUMENTS','Eight tools. One field.','Click an instrument, or use keys 1–8. The selected tool stays active until you choose another one.','1 Scalpel · 2 Drill · 3 Retractor · 4 Suction · 5 Bipolar · 6 Forceps · 7 Clip · 8 Suture. Guided mode adds a small indicator to the recommended tool.'],
  ['02 / TARGETS','Click, tap or trace.','Clear the numbered markers. Access and closure require numerical order; other stages allow any order.','You may click markers individually or drag across them. Keyboard users can Tab to each target and press Enter. Off-target clicks and wrong instruments reduce game stability. Targets are schematic—not anatomical coordinates.'],
  ['03 / PAUSE','A moment to think.','Press P or the pause button. Your progress stays exactly where you left it.','The timer also stops when a dialog is open, the tab is hidden or you leave the operating room. Reloading an in-progress procedure resumes in a paused state.'],
  ['04 / MODES','Guided or Challenge.','Guided removes time-pressure penalties. Challenge gradually reduces stability while you work.','Your procedure mode is fixed when you enter the simulation. Changing the top selector during a procedure changes the next run, not the current one. Wrong actions can end a run in either mode.'],
  ['05 / SUPPORT','Ask for help.','An attending hint explains the next step. A single team assist restores up to 25 game stability points.','Guided hints are free. In Challenge, each operative hint costs 2 score points. Using team assist costs 4 score points in either mode. None of these actions represents an actual treatment.'],
  ['06 / SAVING','Your shift, remembered.','Progress is saved in this browser when storage is available. The application makes no patient-data uploads.','Browser storage can be cleared or restricted. Use Export in Case log to preserve the available JSON report. A standalone file runs without a server; hosted installation and offline caching use the included service worker.']
 ],
 safety:[
  ['01 / FICTION','Patients are invented.','All names, findings and outcomes are fictional. Do not enter or upload real patient information.','No patient-data entry is implemented. The clinical statements are simplified case-writing, not an official care pathway. Faculty review is required before use in a medical education program.'],
  ['02 / ANATOMY','Art is not anatomy.','All scan and operating-room images are original procedural illustrations. They are not authentic radiology or surgical anatomy.','Do not use this application to localize a lesion, plan an approach, select a resection margin or learn operative technique. The generic chronic subdural level intentionally reuses mechanics; real approaches differ.'],
  ['03 / LIMITS','A game, not a credential.','The stability bar and scoring system are invented. They cannot estimate harm, prognosis or clinical competence.','The app omits real anesthesia, resuscitation, drug decisions, important operations and most complications. A success message means only that the puzzle and arcade tasks were completed.']
 ]};
 return `${heading('THE ACADEMY','Think first. Operate second.','Your reference desk for the game—not a clinical textbook.',btn('How to play','help','','compact'))}<div class="reference-tabs" role="group" aria-label="Academy topics">${[['reasoning','Clinical reasoning'],['controls','Game controls'],['safety','Scope & safety']].map(([id,label])=>`<button class="${activeTab===id?'active':''}" data-action="academy-tab" data-id="${id}" aria-pressed="${activeTab===id}">${label}</button>`).join('')}</div><div class="academy-grid">${categories[activeTab].map(([num,title,text,detail])=>`<article class="panel academy-card"><div class="card-number">${num}</div><h3>${title}</h3><p>${text}</p><details><summary>Read more</summary><div>${detail}</div></details></article>`).join('')}</div><div class="academy-note">${note('Built in the spirit of the original DOS neurosurgery game, with new code, images and fictional cases. This version is neither a licensed port nor a validated medical simulator.')}</div><section class="panel panel-pad mt"><div class="eyebrow">BACKGROUND & ATTRIBUTION</div><div class="sources">${D.references.map(r=>`<a href="${r.url}" target="_blank" rel="noopener noreferrer">${r.title} ↗</a><span class="dim">${r.note}</span>`).join('')}</div><p class="credits-line">Sources consulted September 19, 2026 for broad background only. They do not validate the game, its simplified case decisions or its operative sequences.</p></section>`;
}
function journal(){
 const r=[...state.records].reverse();
 return `${heading('YOUR RESIDENCY','Every case leaves a lesson.','A local record of your decisions, procedures and progress.',`<div class="row wrap">${btn(icon('download')+' Export JSON','export',r.length?'':'disabled','compact')}${btn('Reset game','reset','','compact secondary')}</div>`)}${r.length?`<div class="metrics"><div class="metric"><div><div class="metric-value">${r.length}</div><div class="metric-label">Total attempts</div></div></div><div class="metric"><div><div class="metric-value">${completed()} / 6</div><div class="metric-label">Unique cases completed</div></div></div><div class="metric"><div><div class="metric-value">${Math.max(...r.map(x=>x.score))}</div><div class="metric-label">Highest game score / 100</div></div></div></div><section class="panel table-wrap"><table class="log-table"><thead><tr><th>PATIENT</th><th>PATHWAY</th><th>MODE</th><th>RESULT</th><th>SCORE</th><th><span class="dim">DEBRIEF</span></th></tr></thead><tbody>${r.map(rec=>{const c=D.cases.find(x=>x.id===rec.caseId);return `<tr><td><strong>${c.name}</strong><br><span class="tiny dim">${new Date(rec.completedAt).toLocaleDateString()}</span></td><td>${c.procedure?c.procedure[0].toUpperCase()+c.procedure.slice(1):'Nonoperative'}</td><td><span class="chip">${rec.mode}</span></td><td><span class="chip ${rec.success?'done':'critical'}">${rec.success?'Completed':'Review needed'}</span></td><td><span class="grade-pill">${rec.score}</span><span class="tiny dim"> / 100</span></td><td>${btn('Review '+icon('arrow'),'record',`data-id="${rec.id}"`,'compact')}</td></tr>`;}).join('')}</tbody></table></section>`:empty('A clean page. A new beginning.','Complete a case to receive a scored debrief and record your first shift.','start','Start your first case','log')}<div class="mt">${note('Your records stay in this browser. Export contains fictional case identifiers and your game actions, not real patient information. Scores are not validated educational outcomes.')}</div>`;
}
function debrief(){
 const rec=state.records.find(r=>r.id===state.recordId)||state.records.filter(r=>r.caseId===state.current).at(-1);
 if(!rec)return `${heading('DEBRIEF','A moment for reflection.')}${empty('No debrief yet.','Finish a patient pathway or procedure to unlock a debrief.','return-chart','Return to chart','log')}`;
 const c=D.cases.find(x=>x.id===rec.caseId);
 return `${heading('CASE DEBRIEF / BED '+c.bed,rec.success?'A case closed. A lesson earned.':'Pause. Reflect. Try again.','Game completion is not a prediction of a real patient’s outcome.',btn(icon('download')+' Export log','export','','compact'))}<div class="chart-layout"><section class="panel"><div class="result-header"><div class="grade-badge"><strong>${rec.grade}</strong><small>${rec.score} / 100</small></div><div><span class="chip ${rec.success?'done':'critical'}">${rec.success?'SIMULATION COMPLETED':'SIMULATION STOPPED'}</span><h2>${c.name}</h2><p>${rec.success?c.recovery:'Game stability reached zero. The level stopped without a successful completion. Review the sequence, use Guided mode and try again.'}</p></div></div><div class="result-grid"><div class="result-stat"><strong>${rec.assessment}<span class="dim" style="font-size:14px"> /25</span></strong><span>Assessment</span></div><div class="result-stat"><strong>${rec.reasoning}<span class="dim" style="font-size:14px"> /35</span></strong><span>Diagnostic reasoning</span></div><div class="result-stat"><strong>${rec.treatment}<span class="dim" style="font-size:14px"> /40</span></strong><span>${c.procedure?'Procedure control':'Care pathway'}</span></div></div><div class="result-body"><h3>What the case was testing</h3><p>${c.rationale}</p><h3>What the game cannot teach</h3><p>${c.nuance}</p><h3>Next time</h3><p>${rec.assessment<25?'Complete all four assessment items for the full assessment score. ':''}${rec.reasoning<35?'Revisit the examination and imaging before committing to a diagnosis or plan. ':''}${rec.misses?'Slow down, select the correct instrument and stay on the marked game targets. ':''}${rec.assessment===25&&rec.reasoning===35&&!rec.misses?'A strong game performance. Try another case or repeat this level in Challenge mode. ':''}Remember that a high score does not measure clinical or surgical competence.</p><div class="chart-actions">${btn('Next patient '+icon('arrow'),'next-case',`data-id="${c.id}"`,'primary')}${btn('Replay this case','replay',`data-id="${c.id}"`)}${btn('Case log','go','data-view="journal"','secondary')}</div></div></section><aside class="stack">${panel('Attempt summary',`<div class="panel-pad"><div class="row between"><span class="small muted">Mode</span><span class="chip">${rec.mode}</span></div><div class="row between mt"><span class="small muted">Instrument errors</span><span class="mono">${rec.misses}</span></div><div class="row between mt"><span class="small muted">Procedure time</span><span class="mono">${c.procedure?formatTime(rec.time):'—'}</span></div><div class="row between mt"><span class="small muted">Attending hints</span><span class="mono">${rec.hints}</span></div></div>`)}${panel('Decision trail',`<div class="decision-log">${rec.events.map((e,i)=>`<div><small>${String(i+1).padStart(2,'0')}</small>${escapeHTML(e.text)}</div>`).join('')}</div>`)}${note('Score = assessment (25) + reasoning (35) + treatment (40). Errors, challenge hints and team assistance affect game points. A stopped run is capped at 49/100.')}</aside></div>`;
}
function render(){
 document.body.classList.toggle('crt',state.settings.crt);
 const route={hospital,chart,imaging,theatre,academy,journal,debrief}[state.view]||hospital;
 const content=route();
 $('#app').innerHTML=header()+`<main class="app-main" id="main" tabindex="-1">${saveError?`<div class="notice">${escapeHTML(saveError)}</div>`:''}${content}</main>`+footer();
 renderGraphics();
}
function showModal(title,body,actions=''){
 const dlg=$('#modal');
 dlg.innerHTML=`<div class="modal-head"><h2 id="modal-title">${title}</h2><button class="icon-btn" data-action="close-modal" aria-label="Close dialog">${icon('close')}</button></div><div class="modal-body">${body}</div><div class="modal-actions">${actions||btn('Got it','close-modal','','primary')}</div>`;
 if(!dlg.open)dlg.showModal();
}
function help(){showModal('Welcome to your first shift.',`<p><strong class="green">The Brain</strong> is a new browser game inspired by the atmosphere of the DOS neurosurgery classic. Complete six fictional cases—from assessment to treatment and debrief.</p><h3>How a case works</h3><p>Open a patient chart. Take a history and examine the patient. Order relevant imaging and mark each required report reviewed. Confirm your diagnosis, choose a management pathway, and complete either the procedure or handoff.</p><h3>Inside the operating room</h3><p>Select a tool, then click or tap the numbered markers. Follow numerical order during access and closure. You can also drag across markers. Wrong tools and off-target clicks cost game stability.</p><div class="key-row"><span class="keyboard">1–8</span><span>Select an instrument</span></div><div class="key-row"><span class="keyboard">P</span><span>Pause or resume the procedure</span></div><div class="key-row"><span class="keyboard">Tab</span><span>Focus a control; Enter activates it</span></div><h3>Choose your pace</h3><p>Guided mode recommends instruments and removes time-pressure penalties. Challenge adds a slowly decreasing stability meter. A team assist restores up to 25 stability points once, at a 4-point score cost.</p><div class="modal-tip">This is an arcade-style prototype with fictional patients and schematic images. It cannot teach surgery, guide care or assess clinical competence.</div>`);}
function about(){showModal('The Brain / Browser edition',`<p>An independent, original browser reimagining inspired by <em>Life & Death II: The Brain</em>. It is not an official release, licensed port or DOS emulation.</p><h3>Original implementation</h3><p>All application code, procedural artwork, sound effects and fictional cases were created for this prototype. No original game binaries, artwork, text, music or trademarks as logos are bundled. The original title is used only to identify the inspiration.</p><h3>Local by design</h3><p>No backend, account, external fonts, analytics or cloud AI are required. Browser storage keeps progress on this device. Clearing browser data erases that save. JSON export is available in Case log.</p><h3>Simulation limits</h3><p>Faculty review and clinical validation have not been performed. The illustrated anatomy, scans, workflow, stability and scores are simplified game mechanics. Do not use this for clinical decisions, operative training or credentialing.</p><div class="sources"><a href="https://classicreload.com/life-and-death-2-the-brain.html" target="_blank" rel="noopener noreferrer">Original game reference ↗</a></div><div class="mt">${btn(state.settings.crt?'Disable CRT scanlines':'Enable CRT scanlines','crt','','compact')}</div>`);}
function hint(){
 const c=getCase(),cs=getCS();if(!c){help();return;}
 cs.hints++;
 let text=c.hint;
 if(cs.phase==='operating'){
  const stage=stages(c)[cs.op.stage],name=D.tools.find(t=>t.id===stage.tool).name;
  text=`${stage.instruction} The correct instrument is ${name}. ${stage.ordered?'Clear the markers in numerical order.':'You may clear these markers in any order.'}`;
  if(cs.op.mode==='challenge')cs.op.hintPenalty=(cs.op.hintPenalty||0)+2;
 }
 log('Attending hint requested.');save();
 showModal('A word from your attending.',`<div class="mentor-quote">${text}</div><p class="mt small">${cs.phase==='operating'&&cs.op.mode==='challenge'?'This Challenge-mode operative hint costs 2 score points.':'This hint does not reduce your score.'}</p>`);
}
function diagnose(){
 const c=getCase(),cs=getCS();if(!c||cs.phase!=='investigating')return;
 const g=gates();
 if(!g.history||!g.exam||!g.images){toast('Complete the history, at least 3 assessment items, and review the required reports first.',true);return;}
 const value=$('#diagnosis')?.value||cs.dxSelection;
 if(!value){toast('Choose a working diagnosis first.',true);return;}
 cs.dxSelection=value;
 if(value!==c.diagnosis){cs.wrongDx++;cs.feedback='That diagnosis does not best explain this fictional case. Revisit the onset, examination and report findings before trying again.';log('Diagnosis attempted: '+(D.diagnoses.find(d=>d.id===value)?.label||'Unknown')+' — revise.');beep('error');save();render();toast('Reconsider your diagnosis. Reasoning score −7.',true);}
 else{cs.phase='diagnosed';cs.feedback='';log('Correct working diagnosis confirmed: '+D.diagnoses.find(d=>d.id===c.diagnosis).label+'.');beep('success');save();render();toast('Diagnosis confirmed. Now choose the management pathway.');}
}
function commitPlan(){
 const c=getCase(),cs=getCS();if(!c||cs.phase!=='diagnosed')return;
 const value=$('#plan')?.value||cs.planSelection;
 if(!value){toast('Choose a management pathway first.',true);return;}
 cs.planSelection=value;
 if(value!==c.plan){cs.wrongPlan++;cs.planFeedback='This is not the intended pathway for this patient. Consider whether the case calls for neurosurgical treatment, an urgent specialist handoff or nonsurgical management.';log('Management pathway attempted: '+(D.plans.find(p=>p.id===value)?.label||'Unknown')+' — revise.');beep('error');save();render();toast('Reconsider the care pathway. Reasoning score −7.',true);}
 else{cs.phase=c.procedure?'preop':'handoff';cs.planFeedback='';cs.checks=[];log('Appropriate care pathway confirmed.');beep('success');move('theatre');}
}
function orderStudy(id){
 const c=getCase(),cs=getCS();if(!c||!D.tests.some(t=>t.id===id))return;
 if(!cs.ordered.includes(id)){cs.ordered.push(id);log('Study ordered: '+D.tests.find(t=>t.id===id).name+'.');toast('Synthetic study ready. Read the report and mark it reviewed.');}
 state.activeStudy=id;state.slice=10;showScanAnnotations=false;move('imaging');
}
function beginOperation(){
 const c=getCase(),cs=getCS();if(!c||cs.phase!=='preop'||cs.checks.length!==4)return;
 cs.phase='operating';cs.op={stage:0,done:[],selected:'scalpel',health:100,time:0,misses:0,assists:0,hintPenalty:0,assistUsed:false,paused:false,mode:state.settings.mode};
 log('Time-out checklist completed. '+state.settings.mode+' arcade procedure started.');beep('success');lastTick=performance.now();move('theatre');
}
function chooseTool(id){
 const cs=getCS();if(cs?.phase!=='operating'||!D.tools.some(t=>t.id===id))return;
 cs.op.selected=id;beep();save();
 $$('.tool-button').forEach(el=>{const match=el.dataset.id===id;el.classList.toggle('selected',match);el.setAttribute('aria-pressed',String(match));});
 if($('#selected-tool-name'))$('#selected-tool-name').textContent=D.tools.find(t=>t.id===id).name;
}
function miss(reason,ordered=false){
 const cs=getCS();if(cs?.phase!=='operating'||cs.op.paused||$('#modal').open||state.view!=='theatre')return;
 const now=performance.now();if(now-lastMiss<250)return;lastMiss=now;
 cs.op.misses++;cs.op.health=clamp(cs.op.health-(ordered?3:cs.op.mode==='guided'?5:8),0,100);
 log(reason);beep('error');toast(reason+' Game stability reduced.',true);
 if(cs.op.health<=0)finishCase(false);else{updateMonitor();save();}
}
function hitTarget(index,stageIndex){
 const c=getCase(),cs=getCS();if(cs?.phase!=='operating'||state.view!=='theatre'||cs.op.paused||$('#modal').open)return;
 const op=cs.op,stage=stages(c)[op.stage];
 if(stageIndex!==op.stage||!Number.isInteger(index)||index<0||index>=stage.points.length||op.done.includes(index))return;
 if(op.selected!==stage.tool){miss('Wrong instrument for this stage.');return;}
 if(stage.ordered && index!==op.done.length){miss('Follow the numbered markers in order.',true);return;}
 op.done.push(index);beep('success');
 if(op.done.length===stage.points.length){
  log('Procedure stage completed: '+stage.name+'.');
  op.stage++;op.done=[];
  if(op.stage>=stages(c).length){finishCase(true);return;}
  // Instrument selection deliberately persists, requiring a new choice.
  save();render();toast('Stage completed. '+stages(c)[op.stage].name+' is next.');
 }else{
  const target=$(`.op-target[data-target="${index}"]`);
  if(target){target.classList.add('completed');target.disabled=true;target.innerHTML=icon('check');target.setAttribute('aria-label',`${stage.name}, target ${index+1}, completed`);}
  if($('#target-progress'))$('#target-progress').textContent=`${op.done.length}/${stage.points.length}`;
  save();drawOperation();
 }
}
function finishCase(success){
 const c=getCase(),cs=getCS();if(!c||!['operating','handoff'].includes(cs.phase))return;
 if(cs.phase==='handoff'&&cs.checks.length!==4)return;
 const op=cs.op,assessment=Math.round(cs.exams.length/4*25),reasoning=Math.max(0,35-cs.wrongDx*7-cs.wrongPlan*7),treatment=c.procedure?Math.max(0,40-(op?.misses||0)*3-(op?.assists||0)*4-(op?.hintPenalty||0)-(success?0:25)):40;
 let score=clamp(assessment+reasoning+treatment,0,100);if(!success)score=Math.min(49,score);
 const grade=score>=90?'A':score>=80?'B':score>=65?'C':score>=50?'D':'R';
 log(success?'Simulation care pathway completed; debrief generated.':'Simulation stopped: game stability depleted.');
 const rec={id:'attempt-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),caseId:c.id,completedAt:new Date().toISOString(),success,assessment,reasoning,treatment,score,grade,time:op?.time||0,misses:op?.misses||0,hints:cs.hints,mode:op?.mode||state.settings.mode,events:cs.log.map(e=>({...e}))};
 state.records.push(rec);cs.phase=success?'complete':'failed';cs.recordId=rec.id;state.recordId=rec.id;
 beep(success?'success':'error');move('debrief');
}
function exportLog(){
 const report={application:'The Brain',version:'1.0.0',exportedAt:new Date().toISOString(),notice:'Fictional game data only. Scores are not validated educational outcomes. No real patient information.',attempts:state.records,inProgress:D.cases.filter(c=>state.cases[c.id]&&!['complete','failed'].includes(state.cases[c.id].phase)).map(c=>({caseId:c.id,state:state.cases[c.id]}))};
 const blob=new Blob([JSON.stringify(report,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='the-brain-case-log.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),5000);toast('Game log exported as JSON.');
}
/* Original procedural art. These illustrations are not anatomical teaching aids. */
function seeded(seed){let n=seed>>>0;return ()=>{n=(n*1664525+1013904223)>>>0;return n/4294967296;};}
function ellipse(ctx,x,y,rx,ry,fill,stroke='',width=1){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}}
function path(ctx,d,stroke,fill='',width=1){const p=new Path2D(d);if(fill){ctx.fillStyle=fill;ctx.fill(p);}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke(p);}}
const brainHalf = new Path2D('M-.04,-.83 C-.18,-1.02,-.49,-.96,-.64,-.74 C-.91,-.73,-1.01,-.47,-.92,-.27 C-1.07,-.05,-.99,.21,-.88,.34 C-.91,.58,-.71,.82,-.49,.84 C-.28,1.01,-.04,.91,-.03,.68 C-.01,.35,-.05,.0,-.03,-.31 C-.02,-.5,-.06,-.68,-.04,-.83 Z');
function brain(ctx,x,y,rx,ry,wire=false){
 ctx.save();ctx.translate(x,y);ctx.scale(rx,ry);
 for(const side of [-1,1]){
  ctx.save();ctx.scale(side,1);
  const g=ctx.createLinearGradient(-1,-.5,.15,.8);g.addColorStop(0,wire?'#1f3e27':'#aa797a');g.addColorStop(.5,wire?'#234b2d':'#c39488');g.addColorStop(1,wire?'#112e20':'#805c65');
  ctx.fillStyle=g;ctx.fill(brainHalf);ctx.strokeStyle=wire?'#bde990':'#d5ad95';ctx.lineWidth=wire?.009:.012;ctx.stroke(brainHalf);
  ctx.save();ctx.clip(brainHalf);
  const rng=seeded(31415+side*60);
  for(let row=0;row<14;row++){
   const y0=-.9+row*.137;
   ctx.beginPath();
   for(let i=0;i<=50;i++){
    const xx=-1.02+i*.021,yy=y0+Math.sin(xx*13+row*1.13)*(.018+(row%3)*.014)+Math.cos(xx*8+row)*.047;
    if(i===0)ctx.moveTo(xx,yy);else ctx.lineTo(xx,yy);
   }
   ctx.strokeStyle=wire?(row%3===0?'#cdf3a5':'#79ad68'):'#71505a';ctx.lineWidth=wire?.0065:.027;ctx.stroke();
   if(!wire){ctx.translate(0,-.012);ctx.strokeStyle='#deb09999';ctx.lineWidth=.007;ctx.stroke();ctx.translate(0,.012);}
  }
  for(let col=0;col<8;col++){
   const xx=-.89+col*.12;
   ctx.beginPath();
   for(let j=0;j<60;j++){
    const yy=-1+j*.034,px=xx+Math.sin(yy*10+col*2)*.029+Math.sin(yy*5)*.024;
    if(j===0)ctx.moveTo(px,yy);else ctx.lineTo(px,yy);
   }
   ctx.lineWidth=wire?.004:.012;ctx.strokeStyle=wire?'#739c5577':'#78515b99';ctx.stroke();
  }
  // Small folds break the regularity of the underlying wireframe.
  for(let i=0;i<26;i++){
   const xx=-.87+rng()*.73,yy=-.76+rng()*1.47;
   ctx.beginPath();ctx.moveTo(xx,yy);ctx.bezierCurveTo(xx-.10,yy-.11,xx+.11,yy-.12,xx+.09,yy+.03);
   ctx.lineWidth=wire?.008:.021;ctx.strokeStyle=wire?'#a7d384aa':'#694b5599';ctx.stroke();
   if(wire){ctx.fillStyle='#d7f8ae';ctx.fillRect(xx-.003,yy-.003,.007,.007);}
  }
  ctx.restore();ctx.restore();
 }
 ctx.restore();
}
function drawHero(time=0){
 const cv=$('#hero-canvas');if(!cv)return;const ctx=cv.getContext('2d'),w=cv.width,h=cv.height;
 ctx.clearRect(0,0,w,h);
 const cx=w*.53,cy=h*.48;
 let g=ctx.createRadialGradient(cx,cy,15,cx,cy,260);g.addColorStop(0,'#86b45721');g.addColorStop(.7,'#4d8d4210');g.addColorStop(1,'#19312100');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
 ctx.save();ctx.translate(cx,cy);ctx.strokeStyle='#84ad633b';ctx.lineWidth=1;
 [203,231].forEach(r=>{ctx.beginPath();ctx.ellipse(0,0,r,r*.86,-.13,0,Math.PI*2);ctx.stroke();});
 ctx.setLineDash([2,8]);ctx.beginPath();ctx.ellipse(0,0,249,210,-.13,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
 ctx.strokeStyle='#69964d55';ctx.beginPath();ctx.moveTo(-277,0);ctx.lineTo(277,0);ctx.moveTo(0,-223);ctx.lineTo(0,224);ctx.stroke();
 ctx.rotate(-.095);brain(ctx,0,0,165,193,true);ctx.restore();
 ctx.strokeStyle='#b6d88a80';ctx.lineWidth=1;
 path(ctx,`M ${cx-92} ${cy-107} L ${cx-196} ${cy-156} L ${cx-274} ${cy-156}`,'#9fb67c88');
 path(ctx,`M ${cx+98} ${cy+95} L ${cx+188} ${cy+146} L ${cx+268} ${cy+146}`,'#9fb67c88');
 ellipse(ctx,cx-92,cy-107,3,3,'#d0efa2');ellipse(ctx,cx+98,cy+95,3,3,'#d0efa2');
 ctx.fillStyle='#a4bf89';ctx.font='10px monospace';ctx.fillText('CORTICAL SURFACE',cx-276,cy-166);ctx.fillText('ORIGINAL SCHEMATIC',cx+125,cy+167);
 const t=time*.0001;ellipse(ctx,cx+Math.cos(t)*231,cy+Math.sin(t)*198,3,3,'#d8fba8');
 const rng=seeded(9);ctx.fillStyle='#a0bb7044';for(let i=0;i<45;i++){const x=rng()*w,y=rng()*h;ctx.fillRect(x,y,1.2,1.2);}
}
let textureCanvas=null;
function scanTexture(){
 if(textureCanvas)return textureCanvas;
 textureCanvas=document.createElement('canvas');textureCanvas.width=400;textureCanvas.height=460;
 const ctx=textureCanvas.getContext('2d'),im=ctx.createImageData(400,460),rng=seeded(5245);
 for(let y=0;y<460;y++)for(let x=0;x<400;x++){
  const i=(y*400+x)*4;
  const n=62+rng()*22+Math.sin(x*.12+Math.sin(y*.10)*1.8)*8+Math.sin(y*.13)*4;
  im.data[i]=n;im.data[i+1]=n+3;im.data[i+2]=n+2;im.data[i+3]=255;
 }
 ctx.putImageData(im,0,0);return textureCanvas;
}
function drawScan(){
 const cv=$('#scan-canvas'),c=getCase();if(!cv||!c)return;
 const ctx=cv.getContext('2d'),s=c.studies[state.activeStudy],mod=state.activeStudy,isMRI=mod==='mri';if(!s)return;
 const v=s.visual,cx=320,cy=338,scale=.82+.18*Math.sin((state.slice/21)*Math.PI),rx=171*scale,ry=211*scale;
 ctx.clearRect(0,0,640,640);ctx.fillStyle='#050907';ctx.fillRect(0,0,640,640);
 const g=ctx.createRadialGradient(cx,cy,30,cx,cy,275);g.addColorStop(0,'#1a252144');g.addColorStop(1,'#05090700');ctx.fillStyle=g;ctx.fillRect(0,0,640,640);
 ctx.fillStyle='#a7b9ac';ctx.font='16px monospace';ctx.fillText('R',79,345);ctx.fillText('L',550,345);ctx.font='12px monospace';ctx.fillStyle='#8fa496';ctx.fillText('A',315,91);ctx.fillText('P',315,598);
 ellipse(ctx,cx,cy,rx+15,ry+14,'#414a43');ellipse(ctx,cx,cy,rx+8,ry+6,isMRI?'#242923':'#c2c8c0');ellipse(ctx,cx,cy,rx,ry,'#202922');
 ctx.save();ctx.beginPath();ctx.ellipse(cx,cy,rx-6,ry-7,0,0,Math.PI*2);ctx.clip();
 ctx.globalAlpha=mod==='cta'?.28:1;ctx.drawImage(scanTexture(),cx-rx,cy-ry,rx*2,ry*2);ctx.globalAlpha=1;
 const shift=v==='acute-sdh'?13:v==='chronic-sdh'?-12:0;
 ctx.strokeStyle='#161e1bd9';ctx.lineWidth=2.4;
 for(let hemisphere of [-1,1]){
  for(let j=0;j<10;j++){
   const yy=cy-ry*.77+j*ry*.17,span=rx*.76*Math.sqrt(Math.max(.01,1-Math.pow((yy-cy)/(ry*.95),2)));
   ctx.beginPath();ctx.moveTo(cx+shift+hemisphere*12,yy);
   ctx.bezierCurveTo(cx+hemisphere*span*.32,yy+17,cx+hemisphere*span*.55,yy-15,cx+hemisphere*span,yy+7);ctx.stroke();
  }
 }
 path(ctx,`M${cx+shift} ${cy-ry} C${cx+shift-7} ${cy-90},${cx+shift+7} ${cy+90},${cx+shift} ${cy+ry}`,'#1d2721','',3);
 path(ctx,`M${cx+shift-5} ${cy-24} C${cx+shift-47} ${cy-53},${cx+shift-48} ${cy+7},${cx+shift-16} ${cy+11} L${cx+shift-5} ${cy+39} L${cx+shift+5} ${cy+39} L${cx+shift+16} ${cy+11} C${cx+shift+48} ${cy+7},${cx+shift+47} ${cy-53},${cx+shift+5} ${cy-24} Z`,'','#111913');
 if(v==='acute-sdh'){
  path(ctx,`M${cx-58*scale} ${cy-193*scale} C${cx-217*scale} ${cy-110*scale},${cx-205*scale} ${cy+142*scale},${cx-60*scale} ${cy+192*scale} C${cx-120*scale} ${cy+97*scale},${cx-135*scale} ${cy-104*scale},${cx-58*scale} ${cy-193*scale}Z`,'#d6dbd2',isMRI?'#9aa398':'#d8ded4',1);
 }
 if(v==='chronic-sdh'){
  path(ctx,`M${cx+62*scale} ${cy-191*scale} C${cx+211*scale} ${cy-110*scale},${cx+204*scale} ${cy+130*scale},${cx+69*scale} ${cy+188*scale} C${cx+116*scale} ${cy+85*scale},${cx+132*scale} ${cy-107*scale},${cx+62*scale} ${cy-191*scale}Z`,'#566257','#1c251f',1);
 }
 if(v==='tumor'){
  ellipse(ctx,cx-87*scale,cy-97*scale,53*scale,55*scale,'#343c36');
  ellipse(ctx,cx-95*scale,cy-107*scale,40*scale,43*scale,isMRI?'#c8cec3':'#9aab99',isMRI?'#edf1e5':'#a8bba5',4);
  if(isMRI)path(ctx,`M${cx-133*scale} ${cy-132*scale} Q${cx-120*scale} ${cy-153*scale} ${cx-84*scale} ${cy-164*scale}`,'#dfe5d7','',5);
 }
 if(v==='sah'){
  path(ctx,`M${cx} ${cy-3} L${cx-20} ${cy+40} L${cx-48} ${cy+63} L${cx-12} ${cy+47} L${cx} ${cy+84} L${cx+12} ${cy+47} L${cx+47} ${cy+63} L${cx+22} ${cy+38}Z`,'','#bcc6b9');
  path(ctx,`M${cx-5} ${cy+27} Q${cx-70} ${cy+36} ${cx-128} ${cy-16}`,'#c6d0c2','',7);
  path(ctx,`M${cx+10} ${cy+35} Q${cx+63} ${cy+25} ${cx+100} ${cy-5}`,'#b2bdad','',4);
 }
 if(v==='stroke'){
  ctx.globalAlpha=isMRI?.85:.36;
  path(ctx,`M${cx+52} ${cy-31} Q${cx+129} ${cy-129} ${cx+145} ${cy-26} Q${cx+146} ${cy+53} ${cx+88} ${cy+79} Q${cx+68} ${cy+17} ${cx+52} ${cy-31}Z`,'',isMRI?'#d9e8d1':'#18271d');ctx.globalAlpha=1;
 }
 if(mod==='cta'){
  ctx.fillStyle='#030a0766';ctx.fillRect(cx-rx,cy-ry,rx*2,ry*2);
  ctx.strokeStyle='#d8e2d6';ctx.lineWidth=6;ctx.lineCap='round';
  path(ctx,`M320 510 L319 441 Q319 413 305 390 L297 362 L316 326 L340 350 L335 388 Q320 417 319 441`,'#b8cbb6','',6);
  path(ctx,'M315 327 L300 291 L296 232 M315 326 L335 289 L340 229','#ceddcb','',5);
  path(ctx,'M298 359 L249 339 L215 318 L178 294 M249 339 L215 355 L181 370 M215 318 L202 275 M335 389 L388 414 L422 456 M305 390 L256 422 L228 458','#b7cdb7','',5);
  if(v==='stroke-vessel'){
   path(ctx,'M339 350 L369 337','#d5e2d0','',6);
   path(ctx,'M378 333 L413 302 L445 279 M413 302 L432 344','#304335','',4);
   ellipse(ctx,371,337,5,5,'#eff5e9');
  }else path(ctx,'M339 350 L389 327 L423 295 L451 271 M389 327 L425 344 L449 370 M423 295 L419 252','#c8d9c5','',5);
  if(v==='aneurysm'){
   ellipse(ctx,249,316,18,21,'#d5e4d0','#ecf4e7',2);
   path(ctx,'M249 335 L249 328','#e0edd7','',8);
  }
 }
 ctx.restore();
 if(showScanAnnotations){
  ctx.strokeStyle='#bce694aa';ctx.lineWidth=1;ctx.setLineDash([5,5]);ctx.strokeRect(128,116,382,448);ctx.setLineDash([]);
  ctx.fillStyle='#b5d896';ctx.font='10px monospace';ctx.fillText('SCHEMATIC FINDINGS — SEE WRITTEN REPORT',175,576);
 }
}
function drawOperation(){
 const cv=$('#op-canvas'),c=getCase(),cs=getCS();if(!cv||!c||!cs?.op)return;
 const ctx=cv.getContext('2d'),op=cs.op,stage=op.stage,w=760,h=480,cx=380,cy=251;
 ctx.clearRect(0,0,w,h);ctx.fillStyle='#153a34';ctx.fillRect(0,0,w,h);
 const rng=seeded(173);for(let i=0;i<1800;i++){const x=rng()*w,y=rng()*h;ctx.fillStyle=i%2?'#21473b44':'#09241e55';ctx.fillRect(x,y,2,2);}
 // Drapes, seams and the central illustrative window.
 path(ctx,'M0 0 158 0 222 159 171 362 62 480 0 480Z','','#164b4166');
 path(ctx,'M760 0 602 0 538 159 589 362 698 480 760 480Z','','#0d2c2988');
 ctx.strokeStyle='#54877855';ctx.setLineDash([3,6]);ctx.lineWidth=1;ctx.strokeRect(21,23,718,435);ctx.setLineDash([]);
 ellipse(ctx,cx,cy,249,195,'#0c2623','#628172',2);
 ellipse(ctx,cx,cy,231,180,'#b78b6f','#d6ad86',2);
 const skin=ctx.createRadialGradient(cx-40,cy-50,30,cx,cy,229);skin.addColorStop(0,'#c29b7b');skin.addColorStop(1,'#896755');ellipse(ctx,cx,cy,226,175,skin);
 if(stage>=1&&stage<5){
  ellipse(ctx,cx,cy,174,143,'#68494c','#c3a78a',4);
  if(stage===1){ellipse(ctx,cx,cy,163,131,'#cec4a5','#ece3c5',3);ellipse(ctx,cx,cy,143,114,'#b6b39b');}
  else if(stage===2){ellipse(ctx,cx,cy,163,130,'#b2a69b','#dad0ba',3);path(ctx,'M300 147 Q435 275 302 353 M428 128 Q349 264 459 355','#847876','',2);}
  else{
   brain(ctx,cx,cy,166,144,false);
   if(stage===3){
    if(c.procedure==='hematoma'){
     path(ctx,'M307 113 C168 157 200 355 318 388 C284 314 284 224 326 163Z','#b9837b','#793c45',2);
     if(op.done.length){ctx.globalAlpha=op.done.length/5;path(ctx,'M307 113 C168 157 200 355 318 388 C284 314 284 224 326 163Z','','#b99186');ctx.globalAlpha=1;}
    }else if(c.procedure==='tumor'){
     ellipse(ctx,cx,cy-8,102,81,'#a29765','#dfd09a',2);
     for(let i=0;i<4;i++)if(op.done.includes(i)){const [x,y]=stages(c)[3].points[i];ellipse(ctx,x/100*w,y/100*h,27,24,'#695854');}
     ctx.strokeStyle='#e6d7aa99';ctx.setLineDash([3,5]);ellipse(ctx,cx,cy-8,114,93,'','#e6d7aa66',1);ctx.setLineDash([]);
    }else{
     // Symbolic vascular game field; not a reconstruction of the circle of Willis.
     path(ctx,'M283 347 Q321 294 354 269 Q383 243 396 221 L455 191 L493 156 M354 269 L302 223 L268 198 M396 221 L431 266 L480 291','#682e3c','',23);
     path(ctx,'M283 347 Q321 294 354 269 Q383 243 396 221 L455 191 L493 156 M354 269 L302 223 L268 198 M396 221 L431 266 L480 291','#bd6f69','',15);
     ellipse(ctx,390,185,34,31,'#c39170','#e7b28a',3);path(ctx,'M395 210 L396 221','#c78b72','',17);
    }
   }
   if(stage===4){
    const seq=stages(c)[4];seq.points.forEach(([x,y],i)=>{ellipse(ctx,x/100*w,y/100*h,8,7,op.done.includes(i)?'#8f7270':'#9b4e52');});
   }
  }
  // Stylized retractor edges.
  if(stage>=2){path(ctx,'M125 256 L230 253 L242 229 M635 256 L530 253 L518 229','#acb8b0','',10);path(ctx,'M125 256 L230 253 L242 229 M635 256 L530 253 L518 229','#e0e4d3','',3);}
 }
 if(stage===0||stage===5){
  const ps=stages(c)[stage].points;
  ctx.beginPath();ps.forEach(([x,y],i)=>i?ctx.lineTo(x/100*w,y/100*h):ctx.moveTo(x/100*w,y/100*h));ctx.strokeStyle=stage===0?'#786056':'#785057';ctx.lineWidth=4;ctx.setLineDash(stage===0?[4,7]:[]);ctx.stroke();ctx.setLineDash([]);
  op.done.forEach(i=>{const [x,y]=ps[i];if(stage===5)path(ctx,`M${x/100*w-10} ${y/100*h-8} l20 16 m-20 0 20-16`,'#ddd8b9','',2);});
 }
 ctx.font='9px monospace';ctx.fillStyle='#93b8a5';ctx.fillText('ARCADE SIMULATION / NOT AN OPERATIVE GUIDE',222,459);
}
function drawWave(time=0){
 const cv=$('#wave-canvas');if(!cv)return;const ctx=cv.getContext('2d'),w=cv.width,h=cv.height;
 ctx.clearRect(0,0,w,h);ctx.beginPath();
 const offset=time*.045;
 for(let x=0;x<w;x++){
  const f=((x+offset)%185)/185;
  let y=0;
  if(f>.10&&f<.19)y=-Math.sin((f-.10)/.09*Math.PI)*8;
  if(f>.37&&f<.40)y=(f-.37)/.03*12;
  if(f>=.40&&f<.435)y=12-(f-.40)/.035*66;
  if(f>=.435&&f<.47)y=-54+(f-.435)/.035*78;
  if(f>=.47&&f<.51)y=24-(f-.47)/.04*24;
  if(f>.64&&f<.85)y=-Math.sin((f-.64)/.21*Math.PI)*14;
  if(x===0)ctx.moveTo(x,h*.58+y);else ctx.lineTo(x,h*.58+y);
 }
 ctx.strokeStyle='#bdf093';ctx.lineWidth=2;ctx.shadowColor='#acdf70';ctx.shadowBlur=4;ctx.stroke();ctx.shadowBlur=0;
}
function renderGraphics(){if($('#hero-canvas'))drawHero();if($('#scan-canvas'))drawScan();if($('#op-canvas'))drawOperation();if($('#wave-canvas'))drawWave();}
function updateMonitor(){
 const op=getCS()?.op;if(!op)return;
 if($('#stability-value'))$('#stability-value').textContent=`${Math.ceil(op.health)} / 100`;
 if($('#stability-bar')){$('#stability-bar').classList.toggle('low',op.health<35);$('#stability-bar > span').style.width=op.health+'%';}
 if($('#op-misses'))$('#op-misses').textContent=op.misses;
 if($('#op-clock'))$('#op-clock').textContent=formatTime(op.time);
}
function togglePause(){const cs=getCS();if(cs?.phase!=='operating')return;cs.op.paused=!cs.op.paused;lastTick=performance.now();save();render();}
function resumeActionView(id){const c=D.cases.find(x=>x.id===id);if(!c)return;state.current=id;state.cases[id]=blankCase();openCase(id);}
const actions={
 'go':el=>move(el.dataset.view),
 'case':el=>openCase(el.dataset.id),
 'start':()=>startShift(),
 'return-chart':()=>move('chart'),
 'help':()=>help(),
 'about':()=>about(),
 'close-modal':()=>$('#modal').close(),
 'sound':()=>{state.settings.sound=!state.settings.sound;beep('success');save();const el=$('[data-action="sound"]');if(el){el.innerHTML=icon(state.settings.sound?'sound':'mute');el.setAttribute('aria-label',state.settings.sound?'Mute':'Enable sound');el.title=state.settings.sound?'Mute':'Enable sound';}},
 'fullscreen':async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();else toast('Fullscreen is unavailable in this browser.');}catch(e){toast('The browser did not allow fullscreen.');}},
 'crt':()=>{state.settings.crt=!state.settings.crt;save();document.body.classList.toggle('crt',state.settings.crt);about();},
 'exam':el=>{const cs=getCS(),id=el.dataset.id;if(!cs||!D.exams.some(e=>e.id===id))return;if(!cs.exams.includes(id)){cs.exams.push(id);log('Assessment documented: '+D.exams.find(e=>e.id===id).label+'.');beep();save();render();}else toast(getCase().findings[id]);},
 'order':el=>orderStudy(el.dataset.id),
 'study':el=>{if(!getCS()?.ordered.includes(el.dataset.id))return;state.activeStudy=el.dataset.id;showScanAnnotations=false;save();render();},
 'review-study':el=>{const cs=getCS(),id=el.dataset.id;if(!cs||!cs.ordered.includes(id))return;if(!cs.reviewed.includes(id)){cs.reviewed.push(id);log('Report reviewed: '+D.tests.find(t=>t.id===id).name+'.');}beep('success');save();render();toast('Report reviewed. Return to the chart when you are ready to decide.');},
 'annotate':()=>{showScanAnnotations=!showScanAnnotations;drawScan();const el=$('[data-action="annotate"]');if(el)el.textContent=showScanAnnotations?'Hide image overlay':'Show image overlay';},
 'diagnose':()=>diagnose(),
 'commit-plan':()=>commitPlan(),
 'hint':()=>hint(),
 'begin-op':()=>beginOperation(),
 'finish-handoff':()=>finishCase(true),
 'tool':el=>chooseTool(el.dataset.id),
 'target':el=>hitTarget(Number(el.dataset.target),Number(el.dataset.stage)),
 'pause':()=>togglePause(),
 'assist':()=>{const cs=getCS();if(cs?.phase!=='operating'||cs.op.assistUsed||cs.op.paused)return;if(cs.op.health>=100){toast('Stability is already full. Save your team assist for later.');return;}cs.op.assistUsed=true;cs.op.assists++;cs.op.health=clamp(cs.op.health+25,0,100);log('Team assist used: up to 25 game stability restored; 4 score points deducted.');save();render();toast('The team assist restored game stability.');},
 'academy-tab':el=>{if(!['reasoning','controls','safety'].includes(el.dataset.id))return;activeTab=el.dataset.id;render();},
 'export':()=>exportLog(),
 'debrief':()=>{state.recordId=getCS()?.recordId;move('debrief');},
 'record':el=>{const rec=state.records.find(r=>r.id===el.dataset.id);if(!rec)return;state.current=rec.caseId;state.recordId=rec.id;move('debrief');},
 'next-case':el=>{const next=D.cases.find(c=>c.id!==el.dataset.id&&!state.records.some(r=>r.caseId===c.id&&r.success));if(next)openCase(next.id);else{move('hospital');toast('Shift complete. All six cases have been completed.');}},
 'replay':el=>{const c=D.cases.find(x=>x.id===el.dataset.id);if(!c)return;showModal('Replay this case?',`<p>Start a new attempt for <strong>${c.name}</strong>. This patient’s current progress will reset; previous attempts stay in the case log.</p>`,btn('Cancel','close-modal')+btn('Start new attempt','confirm-replay',`data-id="${c.id}"`,'primary'));},
 'confirm-replay':el=>{$('#modal').close();resumeActionView(el.dataset.id);},
 'reset':()=>showModal('Start a new game?',`<p>This removes all case progress and attempts stored by this application in this browser. Other browser data is not affected.</p><p>Export your case log first to keep a record.</p>`,btn('Cancel','close-modal')+btn('Reset all game data','confirm-reset','','danger')),
 'confirm-reset':()=>{$('#modal').close();state=blankState();saveError='';try{localStorage.removeItem(STORAGE_KEY);}catch(e){}save();render();toast('A fresh shift is ready.');}
};
document.addEventListener('click',event=>{
 const el=event.target.closest('[data-action]');
 if(el){if(el.disabled)return;const fn=actions[el.dataset.action];if(fn)fn(el);return;}
 const field=event.target.closest('#op-field');
 if(field&&!event.target.closest('.pause-overlay')&&!event.target.closest('.op-target'))miss('Off-target instrument action.');
});
document.addEventListener('change',event=>{
 const el=event.target,cs=getCS();
 if(el.id==='mode'){
  state.settings.mode=el.value;
  if(cs?.phase==='operating')toast(`Current procedure stays in ${cs.op.mode} mode. The new setting applies to the next procedure.`);
  else toast(el.value==='guided'?'Guided mode: instrument cues and no time-pressure penalty.':'Challenge mode: time pressure and no instrument recommendations.');
  save();
 }else if(el.id==='diagnosis'&&cs){cs.dxSelection=el.value;save();}
 else if(el.id==='plan'&&cs){cs.planSelection=el.value;save();}
 else if(el.dataset.check!==undefined&&cs&&['preop','handoff'].includes(cs.phase)){
  const i=Number(el.dataset.check);if(!Number.isInteger(i)||i<0||i>3)return;
  if(el.checked&&!cs.checks.includes(i))cs.checks.push(i);else if(!el.checked)cs.checks=cs.checks.filter(x=>x!==i);
  el.closest('.check-item').classList.toggle('checked',el.checked);const submit=$('#check-submit');if(submit)submit.disabled=cs.checks.length!==4;save();
 }
});
document.addEventListener('input',event=>{
 if(event.target.id==='slice'){
  state.slice=Number(event.target.value);$('#slice-value').textContent=`${String(state.slice).padStart(2,'0')} / 20`;$('#slice-caption').textContent=`SL ${state.slice}/20`;drawScan();save();
 }
});
document.addEventListener('keydown',event=>{
 if($('#modal').open||event.ctrlKey||event.metaKey||event.altKey||event.repeat)return;
 if(['INPUT','SELECT','TEXTAREA'].includes(event.target.tagName))return;
 const cs=getCS();if(state.view==='theatre'&&cs?.phase==='operating'){
  if(event.key.toLowerCase()==='p'){event.preventDefault();togglePause();}
  const t=D.tools.find(x=>x.key===event.key);if(t){event.preventDefault();chooseTool(t.id);}
 }
});
// Optional continuous pointer tracing. Buttons also retain native click/keyboard access.
document.addEventListener('pointermove',event=>{
 if(event.buttons!==1||event.pointerType==='touch')return;
 const field=event.target.closest('#op-field');if(!field)return;
 const target=document.elementFromPoint(event.clientX,event.clientY)?.closest('.op-target:not(:disabled)');
 if(target){const key=target.dataset.stage+':'+target.dataset.target;if(key!==lastPaintTarget){lastPaintTarget=key;hitTarget(Number(target.dataset.target),Number(target.dataset.stage));}}
});
document.addEventListener('pointerup',()=>lastPaintTarget='');
document.addEventListener('visibilitychange',()=>{lastTick=performance.now();if(document.hidden)save();});
window.addEventListener('pagehide',save);
$('#modal').addEventListener('close',()=>{lastTick=performance.now();});
let reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function animate(now){
 const elapsed=Math.min((now-lastTick)/1000,.25);lastTick=now;
 const cs=getCS(),active=cs?.phase==='operating'&&state.view==='theatre'&&!cs.op.paused&&!$('#modal').open&&!document.hidden;
 if(active){
  cs.op.time+=elapsed;
  if(cs.op.mode==='challenge')cs.op.health=Math.max(0,cs.op.health-elapsed*.20);
  secondCounter+=elapsed;
  if(now-lastFrame>70){updateMonitor();if(!reducedMotion)drawWave(now);lastFrame=now;}
  if(secondCounter>5){save();secondCounter=0;if(state.settings.sound)beep('pulse');}
  if(cs.op.health<=0)finishCase(false);
 }
 if(state.view==='hospital'&&!reducedMotion&&!document.hidden&&now-runFrame>120){drawHero(now);runFrame=now;}
 requestAnimationFrame(animate);
}
// Read-only snapshot for developer inspection and automated regression tests.
window.BrainGame=Object.freeze({version:'1.0.0',getSnapshot:()=>JSON.parse(JSON.stringify(state))});
render();requestAnimationFrame(animate);
// Static-host build only. Single-file build removes this block at packaging time.
if('serviceWorker' in navigator && ['http:','https:'].includes(location.protocol)){
 window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
}
})();
