const TABS=[
  {id:"timetable", label:"📅 Timetable"},
  {id:"checkin",   label:"🌅 Check-in"},
  {id:"students",  label:"👤 Students"},
  {id:"resources", label:"📚 Resources"}
];

// K1A students (อ.1A) — full data with Thai names, student numbers, gender
const K1A_STUDENTS=[
  {id:1, no:"44878", name:"ลลินดา สรัชโชติมา",     nickname:"Objan",   gender:"F"},
  {id:2, no:"44881", name:"ออสติน ริเบสทรูต",        nickname:"Austin",  gender:"M"},
  {id:3, no:"44882", name:"ธิญาดา นันทสันติ",        nickname:"Mia",     gender:"F"},
  {id:4, no:"44885", name:"อัสวิน โพธิ์ตระกูล",     nickname:"Chopper", gender:"M"},
  {id:5, no:"44888", name:"ชนานันท์ ขจรเดชไพศาสกุล",nickname:"MIA",     gender:"F"},
  {id:6, no:"44909", name:"ปิติพัตน์ บริรักษ์",     nickname:"Peeti",   gender:"M"},
  {id:7, no:"44921", name:"ปัณณวีร์ แช่ตั้น",       nickname:"Deca",    gender:"M"},
  {id:8, no:"44922", name:"สิมุง ยามากุชิ",          nickname:"Lukphae", gender:"M"},
  {id:9, no:"44942", name:"รินณัฏฐา แดงอำ",          nickname:"PAM",     gender:"F"},
  {id:10,no:"44944", name:"พรรษิษฐ์ ลำพึงกิจ",      nickname:"TAYCHA",  gender:"M"},
  {id:11,no:"44949", name:"พชรภรณัย จันทสิริพงศ์",  nickname:"Diamond", gender:"M"},
  {id:12,no:"44998", name:"ธนินท์ ศิลาน้อย",        nickname:"Plawarn", gender:"M"},
  {id:13,no:"45001", name:"วรรณรดา เกิดมะเริง",     nickname:"Cherreen",gender:"F"},
  {id:14,no:"45038", name:"ธนกร ริ้วทอง",           nickname:"Gavin",   gender:"M"},
  {id:15,no:"45083", name:"กัณท์อเนก ชุ่มเทศศร",    nickname:"Mario",   gender:"M"},
  {id:16,no:"45163", name:"ศศิวัตน์ พราหมณีย์",     nickname:"Achi",    gender:"M"},
  {id:17,no:"45198", name:"พันธ์วิรา พิศพันธ์",     nickname:"Nari",    gender:"F"}
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
function todayKey(){return new Date().toISOString().slice(0,10);}
function nowTimeStr(){return new Date().toTimeString().slice(0,5);}
function timeToMins(t){const[h,m]=t.split(":").map(Number);return h*60+m;}
function minsToTime(m){return String(Math.floor(m/60)).padStart(2,"0")+":"+String(m%60).padStart(2,"0");}
function todayDayName(){return["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][new Date().getDay()];}

function getCurrentPeriod(cls){
  const now=timeToMins(nowTimeStr());
  const periods=getPeriodsForCls(cls||S.cls);
  const breaks=getBreaksForCls(cls||S.cls);
  for(let i=0;i<periods.length;i++){
    const s=timeToMins(periods[i].start),e=timeToMins(periods[i].end);
    if(now>=s&&now<e)return{type:"period",idx:i};
  }
  for(const b of breaks){
    if(now>=timeToMins(b.start)&&now<timeToMins(b.end))return{type:"break",label:b.label};
  }
  return null;
}

function getCurrentSchoolWeek(){
  const today=todayKey();
  return SCHOOL_WEEKS.find(w=>today>=w.start&&today<=w.end)||null;
}

function getSchoolWeekForOffset(offset){
  const todayIdx=SCHOOL_WEEKS.findIndex(w=>{const t=todayKey();return t>=w.start&&t<=w.end;});
  let base=todayIdx===-1
    ? SCHOOL_WEEKS.findIndex(w=>w.start>todayKey())
    : todayIdx;
  if(base===-1)base=SCHOOL_WEEKS.length-1;
  const idx=Math.max(0,Math.min(SCHOOL_WEEKS.length-1,base+offset));
  return SCHOOL_WEEKS[idx];
}

function stuAvatarColor(stu){
  if(!stu)return{bg:"#dbeafe",color:"#1d4ed8"};
  if(stu.gender==="F")return{bg:"#fce7f3",color:"#be185d"};
  return{bg:"#dbeafe",color:"#1d4ed8"};
}

function avatarSVG(gender,color){
  const c=color||"#2563eb";
  if(gender==="F")return`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="40" r="40" fill="${c}22"/><circle cx="40" cy="28" r="13" fill="${c}"/><ellipse cx="40" cy="62" rx="18" ry="14" fill="${c}"/><ellipse cx="28" cy="22" rx="5" ry="8" fill="${c}" transform="rotate(-20,28,22)"/><ellipse cx="52" cy="22" rx="5" ry="8" fill="${c}" transform="rotate(20,52,22)"/></svg>`;
  return`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="40" r="40" fill="${c}22"/><circle cx="40" cy="28" r="13" fill="${c}"/><rect x="22" y="48" width="36" height="20" rx="8" fill="${c}"/></svg>`;
}

// ── APP STATE ─────────────────────────────────────────────────────────────────
let S={
  tab:"timetable",
  cls:"K1A",
  clockStr:"",
  syncStatus:"ok",
  popup:null,
  tmWeekOffset:0,
  dutyOpen:false,
  tmView:"classes",   // 'classes' | 'teachers'
  tmProg:"MLP",       // 'MLP' | 'IEP'
  tmTeacher:null,     // teacher id when in teacher view
  tmEditMode:false,
  tmDay:null,
  tmShowEmbed:false,
  tmGridOpen:true,
  tmCalMonth:null,  // null = use current month  // null = use real today
  anEditMode:false,
  anCls:"K1A",
  anRange:14,
  resSub:"All",
  stuTab:"daily",      // "daily" | "weekly"
  stuSel:null,         // selected student id for detail view
  stuWeekOffset:0,     // 0=current week, -1=last week, etc.
  aiComment:"",
  regenOffset:0
};

// Bump this number any time DEFAULT_RESOURCES changes — forces Firestore to update
const RESOURCES_VERSION=8;

let DB={
  checkins:{},
  snapshots:{},
  students:K1A_STUDENTS.map(s=>({...s,cls:"K1A",dob:"",nationality:"Thai",parentPhone:"",notes:""})),
  studentRows:{K1B:[],K2A:[],K2B:[],K3A:[],K3B:[],"K1/1":[],"K1/2":[],"K1/3":[],"K2/1":[],"K2/2":[],"K2/3":[],"K3/1":[],"K3/2":[],"K3/3":[],"K3/4":[]},
  resources:JSON.parse(JSON.stringify(DEFAULT_RESOURCES)),
  assessments:{},
  dailyLogs:{}
};

// ── FIRESTORE SYNC ────────────────────────────────────────────────────────────
let fsUnsub=null;
let pollInterval=null;
let popupActive=false;

function startSync(){
  if(fsUnsub)fsUnsub();
  fsUnsub=db.collection("hubData").doc("shared").onSnapshot(snap=>{
    if(popupActive)return;
    if(snap.exists){
      const d=snap.data();
      if(d.checkins)DB.checkins={...DB.checkins,...d.checkins};
      if(d.snapshots)DB.snapshots={...DB.snapshots,...d.snapshots};
      if(d.students)DB.students=d.students;
      if(d.studentRowsK1B)DB.studentRows.K1B=d.studentRowsK1B;
      if(d.studentRowsK2A)DB.studentRows.K2A=d.studentRowsK2A;
      if(d.studentRowsK2B)DB.studentRows.K2B=d.studentRowsK2B;
      if(d.studentRowsK3A)DB.studentRows.K3A=d.studentRowsK3A;
      if(d.studentRowsK3B)DB.studentRows.K3B=d.studentRowsK3B;
      if(d.assessments)DB.assessments=d.assessments;
      if(d.dailyLogs)DB.dailyLogs={...DB.dailyLogs,...d.dailyLogs};

      // Version-gated resource merge — if Firestore version is behind, force update
      const savedVersion=d.resourcesVersion||0;
      if(savedVersion<RESOURCES_VERSION){
        // Keep any user-added resources (ids not in defaults), merge with latest defaults
        const defaultIds=new Set(DEFAULT_RESOURCES.map(r=>r.id));
        const userAdded=(d.resources||[]).filter(r=>!defaultIds.has(r.id));
        DB.resources=[...JSON.parse(JSON.stringify(DEFAULT_RESOURCES)),...userAdded];
        // Write updated resources + new version back to Firestore
        db.collection("hubData").doc("shared").set(
          {resources:DB.resources,resourcesVersion:RESOURCES_VERSION},
          {merge:true}
        );
      } else {
        // Version is current — just merge defaults by id as safety net
        const defaultIds=new Set(DEFAULT_RESOURCES.map(r=>r.id));
        const userAdded=(d.resources||[]).filter(r=>!defaultIds.has(r.id));
        DB.resources=[...JSON.parse(JSON.stringify(DEFAULT_RESOURCES)),...userAdded];
      }
    }
    S.syncStatus="ok";
    render();
  },()=>{S.syncStatus="err";render();});
}

function pushDB(){
  S.syncStatus="ing";
  db.collection("hubData").doc("shared").set({
    checkins:DB.checkins,
    snapshots:DB.snapshots,
    students:DB.students,
    studentRowsK1B:DB.studentRows.K1B,
    studentRowsK2A:DB.studentRows.K2A,
    studentRowsK2B:DB.studentRows.K2B,
    studentRowsK3A:DB.studentRows.K3A,
    studentRowsK3B:DB.studentRows.K3B,
    resources:DB.resources,
    assessments:DB.assessments,
    dailyLogs:DB.dailyLogs
  },{merge:true})
  .then(()=>{S.syncStatus="ok";render();})
  .catch(()=>{S.syncStatus="err";render();});
}

// ── CHECK-IN HELPERS ──────────────────────────────────────────────────────────
function ciKey(cls,id){return todayKey()+"_"+cls+"_"+id;}
function getCI(cls,id){return(DB.checkins||{})[ciKey(cls,id)]||null;}
function saveCI(cls,id,data){
  DB.checkins={...DB.checkins,[ciKey(cls,id)]:{...data,cls,studentId:id,date:todayKey(),savedAt:nowTimeStr()}};
  pushDB();
}
function ciComplete(ci){
  if(!ci)return false;
  return ci.arrived!==undefined&&ci.uniform!==undefined&&ci.mood&&ci.equip&&ci.injury!==undefined;
}
function ciAllOk(ci){
  if(!ciComplete(ci))return false;
  return ci.arrived&&ci.uniform&&ci.injury===false&&Object.values(ci.equip||{}).every(v=>v);
}
function ciColor(ci){
  if(!ci||!ciComplete(ci))return"#e2e8f0";
  if(!ci.arrived)return"#93c5fd";
  if(ci.injury)return"#fca5a5";
  if(!ciAllOk(ci))return"#fde68a";
  return"#86efac";
}

// ── DAILY LOG HELPERS ─────────────────────────────────────────────────────────
function dlKey(cls,id,date){return(date||todayKey())+"_"+cls+"_"+id;}
function getDL(cls,id,date){return(DB.dailyLogs||{})[dlKey(cls,id,date)]||null;}
function saveDL(cls,id,data){
  const key=dlKey(cls,id);
  DB.dailyLogs={...DB.dailyLogs,[key]:{...data,cls,studentId:id,date:todayKey()}};
  pushDB();
}
function getWeekLogs(cls,id){
  // Get all logs for this student for the current school week
  const sw=getCurrentSchoolWeek();
  if(!sw)return[];
  const logs=[];
  const start=new Date(sw.start),end=new Date(sw.end);
  for(let d=new Date(start);d<=end;d.setDate(d.getDate()+1)){
    const dateStr=d.toISOString().slice(0,10);
    const log=getDL(cls,id,dateStr);
    if(log)logs.push({date:dateStr,...log});
  }
  return logs;
}
function takeDailySnapshot(){
  const key=todayKey();
  if(DB.snapshots[key])return;
  const todayCIs={};
  for(const[k,v]of Object.entries(DB.checkins||{})){
    if(k.startsWith(key))todayCIs[k]=v;
  }
  DB.snapshots[key]=todayCIs;
  pushDB();
}

// Midnight auto-lock
setInterval(()=>{
  const now=nowTimeStr();
  if(now==="00:00")takeDailySnapshot();
},60000);

// ── CLOCK ─────────────────────────────────────────────────────────────────────
// Update clock in header only (no full re-render)
setInterval(()=>{
  S.clockStr=nowTimeStr();
  const el=document.getElementById("header-clock");
  if(el)el.textContent=S.clockStr;
  const pp=document.getElementById("period-progress");
  if(pp)updatePeriodProgress();
},1000);

function updatePeriodProgress(){
  const cp=getCurrentPeriod();
  const el=document.getElementById("period-progress");
  if(!el)return;
  if(cp&&cp.type==="period"){
    const p=PERIODS[cp.idx];
    const now=timeToMins(nowTimeStr());
    const s=timeToMins(p.start),e=timeToMins(p.end);
    const pct=Math.min(100,Math.round((now-s)/(e-s)*100));
    el.innerHTML=`<div style="font-size:0.7rem;color:#64748b;margin-bottom:2px">${p.label} · ${pct}% · ends ${p.end}</div><div style="background:#e2e8f0;border-radius:4px;height:6px"><div style="background:#2563eb;border-radius:4px;height:6px;width:${pct}%;transition:width 1s"></div></div>`;
  } else if(cp&&cp.type==="break"){
    el.innerHTML=`<div style="font-size:0.7rem;color:#f59e0b;font-weight:700">${cp.label}</div>`;
  } else {
    el.innerHTML=`<div style="font-size:0.7rem;color:#94a3b8">Before/after school</div>`;
  }
}

// ── DRAGGABLE PANELS ──────────────────────────────────────────────────────────
function makePanelsDraggable(editMode){
  document.querySelectorAll(".panel").forEach(panel=>{
    const header=panel.querySelector(".panel-header");
    const handle=panel.querySelector(".resize-handle");
    if(header&&editMode){
      header.style.cursor="grab";
      header.onmousedown=e=>{
        e.preventDefault();
        const rect=panel.getBoundingClientRect();
        const ox=e.clientX-rect.left,oy=e.clientY-rect.top;
        const parent=panel.parentElement;
        const onMove=ev=>{
          const pr=parent.getBoundingClientRect();
          let x=ev.clientX-pr.left-ox,y=ev.clientY-pr.top-oy;
          x=Math.max(0,Math.min(pr.width-panel.offsetWidth,x));
          y=Math.max(0,Math.min(pr.height-panel.offsetHeight,y));
          panel.style.left=x+"px";panel.style.top=y+"px";
        };
        const onUp=()=>{document.removeEventListener("mousemove",onMove);document.removeEventListener("mouseup",onUp);savePanelLayouts(panel.parentElement.id);};
        document.addEventListener("mousemove",onMove);document.addEventListener("mouseup",onUp);
      };
    } else if(header){header.style.cursor="default";header.onmousedown=null;}
    if(handle&&editMode){
      handle.onmousedown=e=>{
        e.preventDefault();e.stopPropagation();
        const startX=e.clientX,startY=e.clientY;
        const startW=panel.offsetWidth,startH=panel.offsetHeight;
        const onMove=ev=>{
          const w=Math.max(180,startW+ev.clientX-startX);
          const h=Math.max(120,startH+ev.clientY-startY);
          panel.style.width=w+"px";panel.style.height=h+"px";
        };
        const onUp=()=>{document.removeEventListener("mousemove",onMove);document.removeEventListener("mouseup",onUp);savePanelLayouts(panel.parentElement.id);};
        document.addEventListener("mousemove",onMove);document.addEventListener("mouseup",onUp);
      };
    } else if(handle){handle.onmousedown=null;}
  });
}

function savePanelLayouts(containerId){
  const container=document.getElementById(containerId);
  if(!container)return;
  const layouts={};
  container.querySelectorAll(".panel").forEach(p=>{
    if(p.dataset.pid)layouts[p.dataset.pid]={left:p.style.left,top:p.style.top,width:p.style.width,height:p.style.height};
  });
  localStorage.setItem("panelLayout_"+containerId,JSON.stringify(layouts));
}

function loadPanelLayouts(containerId){
  const raw=localStorage.getItem("panelLayout_"+containerId);
  if(!raw)return;
  try{
    const layouts=JSON.parse(raw);
    const container=document.getElementById(containerId);
    if(!container)return;
    container.querySelectorAll(".panel").forEach(p=>{
      const l=layouts[p.dataset.pid];
      if(l){p.style.left=l.left;p.style.top=l.top;if(l.width)p.style.width=l.width;if(l.height)p.style.height=l.height;}
    });
  }catch(e){}
}

function resetPanelLayouts(containerId,panels){
  localStorage.removeItem("panelLayout_"+containerId);
  const container=document.getElementById(containerId);
  if(!container)return;
  const cw=container.offsetWidth,ch=container.offsetHeight;
  const cols=3,rows=Math.ceil(panels.length/cols);
  const pw=Math.floor(cw/cols)-16,ph=Math.floor(ch/rows)-16;
  container.querySelectorAll(".panel").forEach((p,i)=>{
    const col=i%cols,row=Math.floor(i/cols);
    p.style.left=(col*(pw+12)+8)+"px";
    p.style.top=(row*(ph+12)+8)+"px";
    p.style.width=pw+"px";
    p.style.height=ph+"px";
  });
  savePanelLayouts(containerId);
}

// ── RENDER ENGINE ─────────────────────────────────────────────────────────────