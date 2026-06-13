const TABS=[
  {id:"timetable", label:"📅 Timetable"},
  {id:"resources", label:"📚 Resources"}
];

// ── APP STATE ─────────────────────────────────────────────────────────────────

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
  resProg:"MLP",
  resLevel:"K1",
  nowResOpen:false,
  openRes:null,
  tmCalOpen:true,
};

// Bump this number any time DEFAULT_RESOURCES changes — forces Firestore to update
const RESOURCES_VERSION=13;

let DB={
  snapshots:{},
  resources:JSON.parse(JSON.stringify(SEED_RESOURCES)),
  assessments:{},
  dailyLogs:{}
};

let _pushing=false;
let fsUnsub=null;
let pollInterval=null;
let popupActive=false;

function startSync(){
  if(fsUnsub)fsUnsub();
  fsUnsub=db.collection("hubData").doc("shared").onSnapshot(snap=>{
    if(popupActive)return;
    if(_pushing)return;
    if(snap.exists){
      const d=snap.data();
      if(d.snapshots)DB.snapshots={...DB.snapshots,...d.snapshots};
      if(d.assessments)DB.assessments=d.assessments;
      if(d.dailyLogs)DB.dailyLogs={...DB.dailyLogs,...d.dailyLogs};

      if(d.resources&&d.resources.length>0){
        // Firestore has resources — use as-is, full source of truth
        DB.resources=d.resources;
        console.log("[sync] loaded "+DB.resources.length+" resources from Firestore");
      } else {
        // Firestore empty — seed with SEED_RESOURCES
        console.log("[sync] Firestore empty — seeding "+SEED_RESOURCES.length+" resources");
        DB.resources=JSON.parse(JSON.stringify(SEED_RESOURCES));
        db.collection("hubData").doc("shared").set(
          {resources:DB.resources,resourcesVersion:RESOURCES_VERSION},
          {merge:true}
        );
      }
    } else {
      // No Firestore document yet — create and seed
      console.log("[sync] no doc — creating and seeding");
      DB.resources=JSON.parse(JSON.stringify(SEED_RESOURCES));
      db.collection("hubData").doc("shared").set(
        {resources:DB.resources,resourcesVersion:RESOURCES_VERSION,snapshots:{},assessments:{},dailyLogs:{}}
      );
    }
    S.syncStatus="ok";
    render();
  },()=>{S.syncStatus="err";render();});
}

function pushDB(){
  _pushing=true;
  S.syncStatus="ing";
  console.log("[push] saving "+DB.resources.length+" resources");
  db.collection("hubData").doc("shared").set({
    snapshots:DB.snapshots,
    resources:DB.resources,
    resourcesVersion:RESOURCES_VERSION,
    assessments:DB.assessments,
    dailyLogs:DB.dailyLogs
  },{merge:true})
  .then(()=>{
    _pushing=false;
    S.syncStatus="ok";
    console.log("[push] saved OK "+DB.resources.length+" resources");
    render();
  })
  .catch((e)=>{
    _pushing=false;
    S.syncStatus="err";
    console.error("[push] failed:",e);
    render();
  });
}
// ── CHECK-IN HELPERS ──────────────────────────────────────────────────────────

function updatePeriodProgress(){
  const el=document.getElementById("period-progress");
  if(!el)return;
  const cp=getCurrentPeriod();
  const nowMins=timeToMins(nowTimeStr());
  const periods=getPeriodsForCls(S.cls);
  if(cp&&cp.type==="period"&&periods[cp.idx]){
    const p=periods[cp.idx];
    const start=timeToMins(p.start),end=timeToMins(p.end);
    const pct=Math.min(100,Math.max(0,((nowMins-start)/(end-start))*100));
    const col=getComputedStyle(document.documentElement).getPropertyValue('--red').trim()||'#B91C1C';
    el.innerHTML='<div style="display:flex;align-items:center;gap:0.3rem"><div style="font-size:0.65rem;font-weight:700;color:#B91C1C">'+p.label+'</div><div style="width:48px;height:4px;background:#F3F4F6;border-radius:2px;overflow:hidden"><div style="height:100%;background:#B91C1C;width:'+pct+'%;transition:width 1s;border-radius:2px"></div></div></div>';
  } else {
    el.innerHTML='';
  }
}

// ── RENDER ENGINE ─────────────────────────────────────────────────────────────