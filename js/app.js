const TABS=[
  {id:"timetable", label:"📅 Timetable"},
  {id:"resources", label:"📚 Resources"}
];

// ── APP STATE ─────────────────────────────────────────────────────────────────

// ── HELPERS ───────────────────────────────────────────────────────────────────
function todayKey(){const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");} // local date (was UTC — wrong before 07:00 in Bangkok)
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
  dailyLogs:{},
  announcements:[]
};

let _pushing=false;
let fsUnsub=null;
let pollInterval=null;
let popupActive=false;
const HUB_DOC=()=>db.collection("hubData").doc("shared");

// ── SYNC (rewritten 25 Nov 2026) ──────────────────────────────────────────────
// Firestore is the only source of truth for resources. This client NEVER writes
// the whole resources array: adds use arrayUnion, deletes use arrayRemove, so a
// stale tab (e.g. the classroom TV) can't overwrite other people's additions.
// It also NEVER seeds/overwrites the document: if Firestore looks empty or the
// doc is missing (offline, auth not ready, cache), SEED_RESOURCES are shown in
// memory only. (On 5 Jul 2026 the old seeding code wiped every added resource.)
function startSync(){
  if(fsUnsub)fsUnsub();
  fsUnsub=HUB_DOC().onSnapshot(snap=>{
    if(snap.exists){
      const d=snap.data()||{};
      if(d.snapshots)DB.snapshots={...DB.snapshots,...d.snapshots};
      if(d.assessments)DB.assessments=d.assessments;
      if(d.dailyLogs)DB.dailyLogs={...DB.dailyLogs,...d.dailyLogs};
      if(d.announcements)DB.announcements=d.announcements;
      if(Array.isArray(d.resources)&&d.resources.length>0){
        const ids=new Set(d.resources.map(r=>r.id));
        // seed entries missing from Firestore are shown, but not written back
        DB.resources=[...d.resources,...SEED_RESOURCES.filter(r=>!ids.has(r.id))];
        console.log("[sync] "+d.resources.length+" resources from Firestore"+(snap.metadata.fromCache?" (cache)":""));
      } else {
        console.warn("[sync] Firestore resources empty — showing seed list, NOT writing");
      }
    } else {
      console.warn("[sync] hubData/shared missing"+(snap.metadata.fromCache?" (cache)":"")+" — showing seed list, NOT writing");
    }
    if(!snap.metadata.hasPendingWrites)S.syncStatus="ok";
    render();
  },e=>{console.error("[sync] listen failed:",e);S.syncStatus="err";render();});
}

function showSyncToast(msg,ok){
  const t=document.createElement("div");
  t.textContent=msg;
  t.style.cssText="position:fixed;left:50%;bottom:1.25rem;transform:translateX(-50%);z-index:2000;padding:0.6rem 1rem;border-radius:10px;font-family:'Nunito',sans-serif;font-weight:700;font-size:0.85rem;color:#fff;box-shadow:0 4px 14px rgba(0,0,0,.25);background:"+(ok?"#16a34a":"#dc2626");
  document.body.appendChild(t);setTimeout(()=>t.remove(),ok?2500:7000);
}

// Waits for the server to confirm; a write still pending after 15 s (offline,
// blocked network) is reported instead of silently "saved".
function confirmWrite(promise,okMsg,failMsg,onFail){
  S.syncStatus="ing";render();
  let done=false;
  const timer=setTimeout(()=>{if(!done){S.syncStatus="err";render();showSyncToast("Not saved yet — no connection to the database. Keep this page open and check your internet.",false);}},15000);
  return promise.then(()=>{done=true;clearTimeout(timer);S.syncStatus="ok";render();if(okMsg)showSyncToast(okMsg,true);})
    .catch(e=>{done=true;clearTimeout(timer);console.error("[save] failed:",e);S.syncStatus="err";if(onFail)onFail();render();showSyncToast(failMsg+" ("+(e.code||e.message)+")",false);});
}

function addResourceToDB(res){
  DB.resources=[...DB.resources,res]; // optimistic; the snapshot confirms it
  return confirmWrite(
    HUB_DOC().set({resources:firebase.firestore.FieldValue.arrayUnion(res)},{merge:true}),
    "Resource saved","Couldn't save the resource",
    ()=>{DB.resources=DB.resources.filter(r=>r.id!==res.id);}
  );
}

function removeResourceFromDB(res){
  const before=DB.resources;
  DB.resources=DB.resources.filter(r=>r!==res);
  // arrayRemove needs the exact stored object, which is what we hold
  return confirmWrite(
    HUB_DOC().update({resources:firebase.firestore.FieldValue.arrayRemove(res)}),
    "Resource deleted","Couldn't delete the resource",
    ()=>{DB.resources=before;}
  );
}

// Saves everything EXCEPT resources (announcements etc.).
function pushDB(){
  confirmWrite(HUB_DOC().set({
    snapshots:DB.snapshots,
    assessments:DB.assessments,
    dailyLogs:DB.dailyLogs,
    announcements:DB.announcements||[]
  },{merge:true}),null,"Couldn't save");
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