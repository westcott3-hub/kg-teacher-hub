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
  nowResOpen:false,
  openRes:null,
};

// Bump this number any time DEFAULT_RESOURCES changes — forces Firestore to update
const RESOURCES_VERSION=10;

let DB={
  snapshots:{},
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
      if(d.snapshots)DB.snapshots={...DB.snapshots,...d.snapshots};
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
    snapshots:DB.snapshots,
    resources:DB.resources,
    assessments:DB.assessments,
    dailyLogs:DB.dailyLogs
  },{merge:true})
  .then(()=>{S.syncStatus="ok";render();})
  .catch(()=>{S.syncStatus="err";render();});
}

// ── CHECK-IN HELPERS ──────────────────────────────────────────────────────────

// ── RENDER ENGINE ─────────────────────────────────────────────────────────────