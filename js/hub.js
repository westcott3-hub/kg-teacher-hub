// ══════════════════════════════════════════════════════════════════════════════
// KG TEACHER HUB — REDESIGN LAYER (Oct 2026)
// Personal Today / Week / Duty views, teacher picker, EN/TH switch,
// desktop top nav + mobile bottom tab bar. Loaded AFTER render.js and
// replaces render(); the legacy Classes/Teachers and Resources views are
// reused unchanged under "All classes" and "Resources".
// ══════════════════════════════════════════════════════════════════════════════

// ── I18N ──────────────────────────────────────────────────────────────────────
const HUB_I18N={
  en:{
    today:"Today",week:"My week",weekShort:"Week",duty:"Duty & Assembly",dutyShort:"Duty",
    classes:"All classes",classesShort:"Classes",resources:"Resources",
    goodMorning:"Good morning",goodAfternoon:"Good afternoon",goodEvening:"Good evening",
    semester:"Semester",wk:"Week",integration:"Integration",integTopic:"Integration topic this week",
    nextLesson:"Next lesson",nowTeaching:"Teaching now",inMin:"in {n} min",endsIn:"{n} min left",period:"Period",
    openResources:"Open resources",seeWeek:"See my week",details:"Lesson details",
    myLessonsToday:"My lessons today",myLessonsOn:"My lessons · {d}",
    noLessonsDay:"No lessons on your timetable for this day.",noMoreLessons:"That's all your lessons for today.",
    noSchool:"No school today",weekend:"It's the weekend",nextSchoolDay:"Next school day",
    morningDuty:"Morning duty",onDutyThisWeek:"On duty this week",offThisWeek:"Off this week",next:"Next",
    morningTalk:"Morning talk",yourNextTalk:"Your next talk",todaySpeaker:"Today",notOnTalk:"Not on the talk rota",
    comingUp:"Coming up",announcements:"Announcements",manage:"Manage",addAnn:"+ Add announcement",noAnnouncements:"No announcements right now.",
    gateDutyToday:"Gate duty today",gateDutyYou:"You're on gate duty today",
    myDuties:"My duties",dutyThisWeek:"Morning duty this week",rota:"Rota",
    talkThisWeek:"Morning talk this week",talkNextWeek:"Morning talk next week",
    rotaSchedule:"Rota schedule",weeks:"Weeks",you:"you",now:"now",gateDuty:"Gate duty (07:55–08:25)",
    freeHidden:"Free periods are hidden · tap a lesson for details",lessonsN:"{n} lessons",lessonN:"1 lesson",
    prevWeek:"Previous week",nextWeekBtn:"Next week",backToday:"This week",
    welcome:"Welcome to KG Teacher Hub",
    welcomeSub:"Choose your name once. The hub will then open on your own timetable, duty and morning talks every time.",
    findName:"Find your name",typeName:"Type a name…",foreign:"Foreign teachers",thai:"Thai teachers",
    justBrowsing:"Just browsing — show all classes",switchHint:"You can switch teacher any time from the top-right.",
    switchTeacher:"Switch teacher",everyone:"All staff",noClass:"No class",
    notOnRota:"You're not on the morning duty rota.",help:"Support",
    homeroom:"Homeroom",onDuty:"On duty",dutyNow:"This week",
    ofSchoolYear:"",noWeek:"Outside the school term",
    posAt:"at",weekOf:"Week {w}",
    lessonsLeft:"{n} left today",allDone:"Done for today",nextTag:"NEXT"
  },
  th:{
    today:"วันนี้",week:"ตารางสัปดาห์",weekShort:"สัปดาห์",duty:"เวรและหน้าเสาธง",dutyShort:"เวร",
    classes:"ทุกห้องเรียน",classesShort:"ห้องเรียน",resources:"สื่อการสอน",
    goodMorning:"สวัสดีตอนเช้า",goodAfternoon:"สวัสดีตอนบ่าย",goodEvening:"สวัสดีตอนเย็น",
    semester:"ภาคเรียนที่",wk:"สัปดาห์ที่",integration:"บูรณาการ",integTopic:"หน่วยบูรณาการสัปดาห์นี้",
    nextLesson:"คาบต่อไป",nowTeaching:"กำลังสอน",inMin:"อีก {n} นาที",endsIn:"เหลือ {n} นาที",period:"คาบ",
    openResources:"เปิดสื่อการสอน",seeWeek:"ดูตารางสัปดาห์",details:"รายละเอียดคาบ",
    myLessonsToday:"คาบสอนวันนี้",myLessonsOn:"คาบสอน · {d}",
    noLessonsDay:"ไม่มีคาบสอนในตารางของวันนี้",noMoreLessons:"หมดคาบสอนของวันนี้แล้ว",
    noSchool:"วันนี้ไม่มีการเรียนการสอน",weekend:"วันหยุดสุดสัปดาห์",nextSchoolDay:"วันเรียนถัดไป",
    morningDuty:"เวรเช้า",onDutyThisWeek:"อยู่เวรสัปดาห์นี้",offThisWeek:"ไม่มีเวรสัปดาห์นี้",next:"ครั้งถัดไป",
    morningTalk:"พูดหน้าเสาธง",yourNextTalk:"คิวพูดครั้งถัดไป",todaySpeaker:"วันนี้",notOnTalk:"ไม่มีชื่อในตารางพูด",
    comingUp:"กิจกรรมที่จะมาถึง",announcements:"ประกาศ",manage:"จัดการ",addAnn:"+ เพิ่มประกาศ",noAnnouncements:"ยังไม่มีประกาศ",
    gateDutyToday:"เวรสายวันนี้",gateDutyYou:"วันนี้คุณอยู่เวรสาย",
    myDuties:"เวรของฉัน",dutyThisWeek:"เวรเช้าสัปดาห์นี้",rota:"ชุดเวร",
    talkThisWeek:"พูดหน้าเสาธงสัปดาห์นี้",talkNextWeek:"พูดหน้าเสาธงสัปดาห์หน้า",
    rotaSchedule:"ตารางชุดเวร",weeks:"สัปดาห์ที่",you:"คุณ",now:"ปัจจุบัน",gateDuty:"เวรสาย (07:55–08:25)",
    freeHidden:"ไม่แสดงคาบว่าง · แตะคาบเพื่อดูรายละเอียด",lessonsN:"{n} คาบ",lessonN:"1 คาบ",
    prevWeek:"สัปดาห์ก่อน",nextWeekBtn:"สัปดาห์ถัดไป",backToday:"สัปดาห์นี้",
    welcome:"ยินดีต้อนรับสู่ KG Teacher Hub",
    welcomeSub:"เลือกชื่อของคุณเพียงครั้งเดียว แล้วระบบจะแสดงตารางสอน เวร และคิวพูดหน้าเสาธงของคุณทุกครั้งที่เปิด",
    findName:"ค้นหาชื่อของคุณ",typeName:"พิมพ์ชื่อ…",foreign:"ครูต่างชาติ",thai:"ครูไทย",
    justBrowsing:"ดูทุกห้องเรียนโดยไม่เลือกชื่อ",switchHint:"เปลี่ยนชื่อได้ตลอดเวลาที่มุมขวาบน",
    switchTeacher:"เปลี่ยนครู",everyone:"บุคลากรทั้งหมด",noClass:"ไม่มีการเรียนการสอน",
    notOnRota:"คุณไม่มีชื่อในตารางเวรเช้า",help:"ช่วยสอน",
    homeroom:"ประจำชั้น",onDuty:"อยู่เวร",dutyNow:"สัปดาห์นี้",
    ofSchoolYear:"",noWeek:"นอกภาคเรียน",
    posAt:"ที่",weekOf:"สัปดาห์ที่ {w}",
    lessonsLeft:"เหลืออีก {n} คาบวันนี้",allDone:"สอนครบแล้ววันนี้",nextTag:"ถัดไป"
  }
};
const HUB_SUBJ_TH={"Integration":"บูรณาการ","English":"ภาษาอังกฤษ","Math":"คณิตศาสตร์","Science":"วิทยาศาสตร์",
  "Chinese":"ภาษาจีน","Phonics":"โฟนิกส์","Swimming":"ว่ายน้ำ","Outdoor":"กิจกรรมกลางแจ้ง","Music":"ดนตรี",
  "Love Reading":"รักการอ่าน","Skill Building":"เสริมทักษะ","Movement":"เคลื่อนไหวและจังหวะ",
  "Play & Learn":"เล่นและเรียนรู้","Play":"เล่นและเรียนรู้","STREAMSS":"STREAMSS"};
const HUB_POS_TH={"Front Gate (St. John Bldg)":"ประตูหน้าตึกยอห์น","Stairs":"บันได","Under the Banyan Tree":"ใต้ต้นไทร",
  "Walkway":"วอกเวย์","Screening – Field Gate":"คัดกรองประตูสนาม","Drop-off & Pick-up – Field Gate":"รับส่งเด็กประตูสนาม"};
const HUB_DAYS=["Monday","Tuesday","Wednesday","Thursday","Friday"];

function hubLang(){return S.hubLang==="th"?"th":"en";}
function T(k,vars){
  let s=(HUB_I18N[hubLang()]||HUB_I18N.en)[k];
  if(s===undefined)s=HUB_I18N.en[k]||k;
  if(vars)Object.keys(vars).forEach(v=>{s=s.replace("{"+v+"}",vars[v]);});
  return s;
}
function hubSub(s){return hubLang()==="th"&&HUB_SUBJ_TH[s]?HUB_SUBJ_TH[s]:s;}
function hubPos(p){return hubLang()==="th"&&HUB_POS_TH[p]?HUB_POS_TH[p]:p;}
function hubE(s){return escHtml(s==null?"":String(s));}
function hubLoc(){return hubLang()==="th"?"th-TH":"en-GB";}
function hubFmt(d,opts){try{return d.toLocaleDateString(hubLoc(),opts);}catch(e){return d.toDateString();}}
function hubDayName(d,short){return hubFmt(d,{weekday:short?"short":"long"});}

// ── DATE HELPERS (local time — avoids the UTC date bug before 07:00) ───────
function hubKey(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}
function hubParse(k){const[y,m,d]=k.split("-").map(Number);return new Date(y,m-1,d);}
function hubAddDays(d,n){const x=new Date(d.getFullYear(),d.getMonth(),d.getDate());x.setDate(x.getDate()+n);return x;}
function hubEnDay(d){return["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][d.getDay()];}
function hubNowMins(){const n=new Date();return n.getHours()*60+n.getMinutes();}
function hubWeekOf(k){return SCHOOL_WEEKS.find(w=>k>=w.start&&k<=w.end)||null;}
function hubHolidayLabel(k){
  const e=getCalendarDay(k).find(x=>x.type==="holiday"||x.type==="break");
  return e?e.label:null;
}
function hubIsSchoolDay(d){
  const k=hubKey(d);const dow=d.getDay();
  if(dow===0||dow===6)return false;
  if(!hubWeekOf(k))return false;
  return !hubHolidayLabel(k);
}
function hubNextSchoolDay(from,includeFrom){
  for(let i=includeFrom?0:1;i<120;i++){const d=hubAddDays(from,i);if(hubIsSchoolDay(d))return d;}
  return null;
}
// Current school week, or the next one if we're between weeks
function hubCurWeek(){
  const k=hubKey(new Date());
  return hubWeekOf(k)||SCHOOL_WEEKS.find(w=>w.start>k)||SCHOOL_WEEKS[SCHOOL_WEEKS.length-1];
}
function hubWeekByOffset(off){
  const cur=hubCurWeek();const i=SCHOOL_WEEKS.indexOf(cur);
  return SCHOOL_WEEKS[Math.max(0,Math.min(SCHOOL_WEEKS.length-1,i+off))];
}
function hubSemLabel(w){return w?(w.sem.split("/")[0]==="S2"?"2":"1"):"";}

// ── PEOPLE ────────────────────────────────────────────────────────────────────
function hubNorm(n){return String(n||"").replace(/\*+/g,"").replace(/^(T\.|Miss|Mr\.|Ms\.|Mrs\.)\s*/i,"").trim().toLowerCase();}
function hubAllClasses(){return Object.keys(TIMETABLE).concat(Object.keys(TIMETABLE_NURSERY));}
let HUB_PEOPLE=null;
function hubPeople(){
  if(HUB_PEOPLE)return HUB_PEOPLE;
  const map={};
  const add=(name,cls)=>{
    if(!name)return;
    const clean=String(name).replace(/\*+/g,"").trim();
    const k=hubNorm(clean);if(!k)return;
    if(!map[k])map[k]={name:clean,key:k,classes:new Set()};
    if(cls)map[k].classes.add(cls);
  };
  hubAllClasses().forEach(cls=>{
    const tt=getTimetableForCls(cls)[cls]||{};
    Object.values(tt).forEach(ps=>(ps||[]).forEach(p=>{if(p&&p.teacher)add(p.teacher,cls);}));
  });
  Object.keys(TIMETABLE_HELP||{}).forEach(n=>add(n));
  MORNING_DUTY_ROTA.forEach(r=>{r.positions.forEach(p=>p.staff.forEach(s=>add(s)));r.lateduty.staff.forEach(s=>add(s));});
  MORNING_TALK_ROTA.forEach(r=>HUB_DAYS.forEach(d=>add(r[d])));
  HUB_PEOPLE=Object.values(map).map(p=>{
    const cl=[...p.classes];
    const thai=/^(Miss|Mr\.|Mrs\.)\s/.test(p.name);
    const role=cl.length===0?"":cl.length<=3?cl.join(", "):cl.slice(0,3).join(", ")+" +"+(cl.length-3);
    return {name:p.name,key:p.key,thai,role};
  }).sort((a,b)=>hubNorm(a.name).localeCompare(hubNorm(b.name)));
  return HUB_PEOPLE;
}
function hubMe(){
  if(!S.hubMe||S.hubMe==="__all")return null;
  return hubPeople().find(p=>p.key===hubNorm(S.hubMe))||null;
}
function hubIsMe(name){const m=hubMe();return !!m&&hubNorm(name)===m.key;}
function hubInitials(n){const w=String(n).replace(/[^A-Za-z\s]/g," ").trim().split(/\s+/).filter(Boolean);return ((w[0]||"")[0]+((w[1]||w[0]||"")[0]||"")).toUpperCase();}

// ── LESSONS ───────────────────────────────────────────────────────────────────
const HUB_INK={"#f59e0b":"#B45309","#06b6d4":"#0E7490","#14b8a6":"#0F766E","#16a34a":"#15803D",
  "#ec4899":"#BE185D","#f97316":"#C2410C","#0891b2":"#0E7490","#64748b":"#475569","#b45309":"#92400E"};
function hubInk(sub){const c=subColor(sub);return HUB_INK[c]||c;}
function hubTopic(sub,weekNum,cls){
  try{const t=getWeekTopic(sub,weekNum,cls);if(!t)return"";if(typeof t==="string")return t;return getTopicLabel(t,/Integration/.test(sub))||"";}
  catch(e){return"";}
}
function hubLessons(name,dayName,weekNum){
  const key=hubNorm(name);const out=[];
  hubAllClasses().forEach(cls=>{
    const tt=getTimetableForCls(cls)[cls]||{};const periods=getPeriodsForCls(cls);
    (tt[dayName]||[]).forEach((p,i)=>{
      if(p&&periods[i]&&hubNorm(p.teacher)===key)
        out.push({cls,sub:p.sub,p:periods[i],idx:i,day:dayName,topic:hubTopic(p.sub,weekNum,cls)});
    });
  });
  Object.keys(TIMETABLE_HELP||{}).forEach(tn=>{
    if(hubNorm(tn)!==key)return;
    ((TIMETABLE_HELP[tn]||{})[dayName]||[]).forEach(slot=>{
      const periods=getPeriodsForCls(slot.cls);const i=periods.findIndex(pp=>pp.label===slot.period);
      if(i>-1)out.push({cls:slot.cls,sub:slot.sub,p:periods[i],idx:i,day:dayName,help:true,topic:""});
    });
  });
  out.sort((a,b)=>timeToMins(a.p.start)-timeToMins(b.p.start));
  // merge combined classes taught at the same time
  const merged=[];
  out.forEach(l=>{
    const prev=merged[merged.length-1];
    if(prev&&prev.p.start===l.p.start&&prev.sub===l.sub){prev.cls+=", "+l.cls;}
    else merged.push({...l});
  });
  return merged;
}

// ── DUTY & TALKS ──────────────────────────────────────────────────────────────
function hubMyDuty(){
  const m=hubMe();if(!m)return[];
  const out=[];
  MORNING_DUTY_ROTA.forEach(r=>r.positions.forEach(p=>{if(p.staff.some(s=>hubNorm(s)===m.key))out.push({r,pos:p.pos});}));
  return out;
}
function hubMyGateDays(){
  const m=hubMe();if(!m)return[];
  return HUB_DAYS.filter(d=>(LATE_DUTY_BY_DAY[d]||[]).some(s=>hubNorm(s)===m.key));
}
function hubDutyStatus(){
  const sw=hubCurWeek();const mine=hubMyDuty();
  if(!mine.length||!sw)return{none:true};
  const cur=mine.find(m=>m.r.weeks.includes(sw.week));
  let next=null;
  mine.forEach(m=>m.r.weeks.forEach(w=>{if(w>sw.week&&(!next||w<next.w))next={w,pos:m.pos};}));
  const nextWeek=next?SCHOOL_WEEKS.find(x=>x.week===next.w):null;
  return{cur,next,nextWeek};
}
function hubTalkOn(d){const r=getMorningTalkWeek(d);return r?r[hubEnDay(d)]:null;}
function hubMyNextTalk(){
  const m=hubMe();if(!m)return null;
  const start=new Date();const after=hubNowMins()>=8*60+30;
  for(let i=after?1:0;i<70;i++){
    const d=hubAddDays(start,i);
    if(!hubIsSchoolDay(d))continue;
    const n=hubTalkOn(d);
    if(n&&hubNorm(n)===m.key)return d;
  }
  return null;
}

// ── EVENTS ────────────────────────────────────────────────────────────────────
function hubUpcoming(n){
  const today=hubKey(new Date());const all=[];
  Object.values(SCHOOL_CALENDAR).forEach(m=>[...(m.holidays||[]),...(m.events||[])].forEach(e=>{if(e.date>=today)all.push(e);}));
  all.sort((a,b)=>a.date<b.date?-1:a.date>b.date?1:0);
  const groups=[];
  all.forEach(e=>{
    const g=groups[groups.length-1];
    if(g&&g.label===e.label&&(hubParse(e.date)-hubParse(g.end))/86400000<=3){g.end=e.date;}
    else groups.push({label:e.label,start:e.date,end:e.date,type:e.type});
  });
  return groups.filter(g=>!/working day|Classes Resume/i.test(g.label)||/Grade Release|Home Coming|Parents/i.test(g.label)).slice(0,n);
}
function hubRange(g){
  const a=hubParse(g.start),b=hubParse(g.end);
  if(g.start===g.end)return hubFmt(a,{day:"numeric",month:"short"});
  if(a.getMonth()===b.getMonth())return a.getDate()+"–"+hubFmt(b,{day:"numeric",month:"short"});
  return hubFmt(a,{day:"numeric",month:"short"})+" – "+hubFmt(b,{day:"numeric",month:"short"});
}

// ── ICONS ─────────────────────────────────────────────────────────────────────
const HUB_IC={
  today:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  week:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  duty:'<path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
  classes:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  resources:'<path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/>',
  leaf:'<path d="M12 22V12"/><path d="M12 12C12 8 9 5 4 5c0 5 3 7 8 7z"/><path d="M12 12c0-3 2.5-6 7-6 0 4.5-2.5 6-7 6z"/>',
  check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
  bell:'<path d="M3 11l18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
  left:'<path d="M15 18l-6-6 6-6"/>',right:'<path d="M9 18l6-6-6-6"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>'
};
function hubIcon(n,size,color,sw){
  return '<svg width="'+(size||20)+'" height="'+(size||20)+'" viewBox="0 0 24 24" fill="none" stroke="'+(color||"currentColor")+'" stroke-width="'+(sw||2)+'" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+HUB_IC[n]+'</svg>';
}

// ── ACTIONS ───────────────────────────────────────────────────────────────────
function hubSave(){
  try{localStorage.setItem("hubState",JSON.stringify({me:S.hubMe||null,lang:S.hubLang||"en",tab:S.hubTab||"today"}));}catch(e){}
}
function hubGo(tab){
  S.hubTab=tab;S.popup=null;
  if(tab==="classes"){S.tab="timetable";}
  if(tab==="resources"){S.tab="resources";}
  if(tab==="week"){S.hubWkOff=0;S.hubDay=null;}
  hubSave();render();
  try{window.scrollTo(0,0);}catch(e){}
}
function hubSetLang(l){S.hubLang=l;hubSave();render();}
function hubPick(i){
  const p=hubPeople()[i];if(!p)return;
  S.hubMe=p.name;S.hubPicking=false;S.hubTab="today";
  // keep legacy teacher view in step when this person is in TEACHERS
  const t=(typeof TEACHERS!=="undefined")&&TEACHERS.find(x=>hubNorm(x.full)===p.key);
  if(t)S.tmTeacher=t.id;
  hubSave();render();try{window.scrollTo(0,0);}catch(e){}
}
function hubBrowseAll(){S.hubMe="__all";S.hubPicking=false;S.hubTab="classes";S.tab="timetable";hubSave();render();}
function hubOpenPicker(){S.hubPicking=true;render();try{window.scrollTo(0,0);}catch(e){}}
function hubClosePicker(){S.hubPicking=false;render();}
function hubFilter(v){
  const q=String(v||"").trim().toLowerCase();
  document.querySelectorAll("[data-hubname]").forEach(el=>{
    el.style.display=!q||el.getAttribute("data-hubname").indexOf(q)>-1?"":"none";
  });
  document.querySelectorAll("[data-hubgroup]").forEach(g=>{
    const any=[...g.querySelectorAll("[data-hubname]")].some(el=>el.style.display!=="none");
    g.style.display=any?"":"none";
  });
}
function hubOpenLesson(cls,idx,day){
  const period=((getTimetableForCls(cls)[cls]||{})[day]||[])[idx];
  const p=getPeriodsForCls(cls)[idx];
  if(!period||!p)return;
  S.cls=cls;
  S.popup={type:"period",cls,periodIdx:idx,day,period,p};
  render();
}
function hubOpenRes(sub,cls){
  const c=String(cls||"").split(",")[0].trim();
  const m=c.match(/^K(\d)/);
  if(m){S.resLevel="K"+m[1];S.resProg=c.indexOf("/")>-1?"IEP":"MLP";}
  const has=(DB.resources||[]).some(r=>(r.prog||"MLP")===S.resProg&&(r.level||"K1")===S.resLevel&&r.subject===sub);
  S.resSub=has?sub:"All";
  hubGo("resources");
}
function hubWk(delta){S.hubWkOff=delta===0?0:(S.hubWkOff||0)+delta;S.hubDay=null;render();}
function hubSelDay(d){S.hubDay=d;render();}

// ── HEADER & NAV ──────────────────────────────────────────────────────────────
function hubLogo(size){
  const s=size||40;
  return '<span class="hub-logo" style="width:'+s+'px;height:'+s+'px">'
    +'<img src="'+SCHOOL_LOGO+'" alt="" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">'
    +'<span class="hub-logo-fb" style="display:none">ACS</span></span>';
}
function hubHeader(){
  const now=new Date();const k=hubKey(now);
  // weekends belong to the week just finished; a break shows its label
  const w=hubWeekOf(k)||hubWeekOf(hubKey(hubAddDays(now,-((now.getDay()+6)%7))));
  const brk=!w?hubHolidayLabel(k):null;
  const th=w?getIntegrationTheme(w.week):null;
  const me=hubMe();
  const syncCls=S.syncStatus==="ok"?"sync-ok":S.syncStatus==="ing"?"sync-ing":"sync-err";
  const h=[];
  h.push('<header class="hub-hdr"><div class="hub-hdr-in">');
  h.push('<div class="hub-brand">'+hubLogo(40)+'<div><div class="t1">KG Teacher Hub</div><div class="t2">Assumption College Sriracha</div></div></div>');
  h.push('<div class="hub-ctx">');
  h.push('<span class="hub-date">'+hubE(hubFmt(now,{weekday:"long",day:"numeric",month:"long"}))+'</span>');
  if(w)h.push('<span class="hub-chip">'+(hubLang()==="th"?"ภาคเรียนที่ "+hubSemLabel(w)+" · สัปดาห์ที่ "+dispWk(w.week):"S"+hubSemLabel(w)+" · "+T("wk")+" "+dispWk(w.week))+'</span>');
  else h.push('<span class="hub-chip">'+hubE(brk||T("noWeek"))+'</span>');
  if(th)h.push('<span class="hub-chip hub-chip-int"><span class="lbl">'+T("integration")+'</span> '+hubE(th)+'</span>');
  h.push('</div>');
  h.push('<div class="hub-act">');
  h.push('<div class="hub-lang" role="group" aria-label="Language"><button class="'+(hubLang()==="en"?"on":"")+'" onclick="hubSetLang(\'en\')">EN</button><button class="'+(hubLang()==="th"?"on":"")+'" onclick="hubSetLang(\'th\')">ไทย</button></div>');
  h.push('<button class="hub-me" onclick="hubOpenPicker()" aria-label="'+T("switchTeacher")+'" title="'+T("switchTeacher")+'"><span class="hub-av">'+(me?hubE(hubInitials(me.name)):hubIcon("classes",16))+'</span><span class="nm">'+(me?hubE(me.name):T("everyone"))+'</span></button>');
  h.push('<div class="hub-clock-wrap"><div id="header-clock" class="hub-clock">'+nowTimeStr()+'</div><div class="hub-sync"><span class="sync-dot '+syncCls+'"></span>'+(S.syncStatus==="ok"?"LIVE":S.syncStatus==="ing"?"SYNC":"ERR")+'</div></div>');
  h.push('</div></div>');
  h.push(hubTopNav());
  h.push('</header>');
  return h.join("");
}
function hubTabs(){
  const me=hubMe();
  const tabs=[["today",T("today"),T("today")],["week",T("week"),T("weekShort")],["duty",T("duty"),T("dutyShort")],["classes",T("classes"),T("classesShort")],["resources",T("resources"),T("resources")]];
  return me?tabs:tabs.filter(t=>t[0]!=="week");
}
function hubTopNav(){
  return '<nav class="hub-tnav" aria-label="Main">'+hubTabs().map(t=>'<button class="'+(S.hubTab===t[0]?"on":"")+'" '+(S.hubTab===t[0]?'aria-current="page" ':'')+'onclick="hubGo(\''+t[0]+'\')">'+t[1]+'</button>').join("")+'</nav>';
}
function hubBottomNav(){
  const tabs=hubTabs();
  return '<nav class="hub-bnav" style="grid-template-columns:repeat('+tabs.length+',minmax(0,1fr))" aria-label="Main">'+tabs.map(t=>'<button class="'+(S.hubTab===t[0]?"on":"")+'" '+(S.hubTab===t[0]?'aria-current="page" ':'')+'onclick="hubGo(\''+t[0]+'\')">'+hubIcon(t[0],22,null,S.hubTab===t[0]?2.3:2)+'<span>'+t[2]+'</span></button>').join("")+'</nav>';
}

// ── WELCOME / PICKER ──────────────────────────────────────────────────────────
function hubWelcome(){
  const ppl=hubPeople();const cur=hubMe();
  const h=[];
  h.push('<div class="hub-welcome"><div class="hub-welcome-in">');
  h.push('<div class="hub-wtop">'+hubLogo(52));
  h.push('<div class="hub-lang" role="group" aria-label="Language"><button class="'+(hubLang()==="en"?"on":"")+'" onclick="hubSetLang(\'en\')">English</button><button class="'+(hubLang()==="th"?"on":"")+'" onclick="hubSetLang(\'th\')">ภาษาไทย</button></div></div>');
  h.push('<h1 class="hub-wh1">'+T("welcome")+'</h1><p class="hub-wp">'+T("welcomeSub")+'</p>');
  h.push('<label class="hub-lbl" for="hub-search">'+T("findName")+'</label>');
  h.push('<div class="hub-search">'+hubIcon("search",18,"#5F6368")+'<input id="hub-search" type="search" autocomplete="off" placeholder="'+T("typeName")+'" oninput="hubFilter(this.value)"></div>');
  [[false,T("foreign")],[true,T("thai")]].forEach(([isThai,label])=>{
    const grp=ppl.map((p,i)=>({p,i})).filter(x=>x.p.thai===isThai);
    if(!grp.length)return;
    h.push('<div data-hubgroup="1"><div class="hub-grp">'+label+'</div><div class="hub-plist">');
    grp.forEach(({p,i})=>{
      const sel=cur&&cur.key===p.key;
      h.push('<button class="hub-person'+(sel?" sel":"")+'" data-hubname="'+hubE(p.name.toLowerCase())+'" onclick="hubPick('+i+')">'
        +'<span class="hub-av lg">'+hubE(hubInitials(p.name))+'</span>'
        +'<span class="who"><span class="n">'+hubE(p.name)+'</span>'+(p.role?'<span class="r">'+hubE(p.role)+'</span>':'')+'</span>'
        +(sel?hubIcon("check",20,"var(--red)",2.6):'')+'</button>');
    });
    h.push('</div></div>');
  });
  h.push('<div class="hub-wfoot"><button class="hub-link" onclick="hubBrowseAll()">'+T("justBrowsing")+'</button>');
  if(S.hubMe)h.push('<button class="hub-btn sec" onclick="hubClosePicker()">✕</button>');
  h.push('</div><p class="hub-hint">'+T("switchHint")+'</p>');
  h.push('</div></div>');
  return h.join("");
}

// ── TODAY ─────────────────────────────────────────────────────────────────────
function hubLessonRow(l,state,showDay){
  const ink=hubInk(l.sub);
  const tag=state==="now"?'<span class="hub-tag now">'+T("now").toUpperCase()+'</span>':state==="next"?'<span class="hub-tag next">'+T("nextTag")+'</span>':'';
  const meta=[hubE(l.cls),l.p.label,l.help?T("help"):""].filter(Boolean).join(" · ");
  const click=l.help?'':' onclick="hubOpenLesson(\''+l.cls.split(",")[0].trim()+'\','+l.idx+',\''+l.day+'\')"';
  return '<button class="hub-lrow'+(state==="done"?" done":"")+(state==="now"?" isnow":"")+'"'+click+'>'
    +'<span class="tm"><b>'+l.p.start+'</b><i>'+l.p.end+'</i></span>'
    +'<span class="bar" style="background:'+subColor(l.sub)+'"></span>'
    +'<span class="bd"><span class="sb" style="color:'+ink+'">'+hubE(hubSub(l.sub))+'</span>'
    +'<span class="mt">'+meta+(l.topic?' · <span class="tp">'+hubE(l.topic)+'</span>':'')+'</span></span>'
    +tag+'</button>';
}
function hubToday(){
  const me=hubMe();const now=new Date();const nowM=hubNowMins();
  const k=hubKey(now);const sw=hubCurWeek();
  const isSchool=hubIsSchoolDay(now);
  const hol=hubHolidayLabel(k);
  const dow=now.getDay();
  const hr=now.getHours();
  const greet=hr<12?T("goodMorning"):hr<17?T("goodAfternoon"):T("goodEvening");
  const h=[];
  h.push('<div class="hub-cols"><div class="hub-colA">');
  // Greeting
  h.push('<section class="hub-greet"><h1>'+greet+(me?', '+hubE(me.name):'')+'</h1><div class="sub">'
    +hubE(hubFmt(now,{weekday:"long",day:"numeric",month:"long"}))
    +(sw&&hubWeekOf(k)?' · '+(hubLang()==="th"?"ภาคเรียนที่ "+hubSemLabel(sw)+" · สัปดาห์ที่ "+dispWk(sw.week):T("semester")+" "+hubSemLabel(sw)+" · "+T("wk")+" "+dispWk(sw.week)):'')+'</div></section>');
  // Integration
  const th=sw?getIntegrationTheme(sw.week):null;
  if(th){
    h.push('<section class="hub-int">'+hubIcon("leaf",22,"#1D4ED8")+'<div class="b"><div class="hub-eyebrow" style="color:#1D4ED8">'+T("integTopic")+'</div><div class="v">'+hubE(th)+'</div></div><div class="w">'+(hubWeekOf(k)?'':hubE(T("weekOf",{w:dispWk(sw.week)})))+'</div></section>');
  }
  // No-school banner
  let showDate=now;let showingNext=false;
  if(!isSchool){
    const nd=hubNextSchoolDay(now,false);
    const why=hol||(dow===0||dow===6?T("weekend"):T("noSchool"));
    h.push('<section class="hub-banner">'+hubIcon("sun",20,"#8A5A00")+'<div><b>'+(hol?T("noSchool"):hubE(why))+'</b>'+(hol?'<div>'+hubE(hol)+'</div>':'')
      +(nd?'<div>'+T("nextSchoolDay")+': '+hubE(hubFmt(nd,{weekday:"long",day:"numeric",month:"short"}))+'</div>':'')+'</div></section>');
    if(nd){showDate=nd;showingNext=true;}
  }
  if(me){
    const showWeek=hubWeekOf(hubKey(showDate));
    const lessons=hubLessons(me.name,hubEnDay(showDate),showWeek?showWeek.week:null);
    // Hero
    if(!showingNext&&isSchool){
      const cur=lessons.find(l=>timeToMins(l.p.start)<=nowM&&nowM<timeToMins(l.p.end));
      const nxt=lessons.find(l=>timeToMins(l.p.start)>nowM);
      const hero=cur||nxt;
      if(hero){
        const isNow=hero===cur;
        const mins=isNow?timeToMins(hero.p.end)-nowM:timeToMins(hero.p.start)-nowM;
        h.push('<section class="hub-card hub-hero">');
        h.push('<div class="top"><span class="hub-eyebrow" style="color:var(--red)">'+(isNow?T("nowTeaching")+' · '+T("endsIn",{n:mins}):T("nextLesson")+' · '+T("inMin",{n:mins}))+'</span><span class="tm">'+hero.p.start+' – '+hero.p.end+'</span></div>');
        h.push('<div class="main"><span class="bar" style="background:'+subColor(hero.sub)+'"></span><div><div class="sb" style="color:'+hubInk(hero.sub)+'">'+hubE(hubSub(hero.sub))+'</div><div class="mt">'+hubE(hero.cls)+' · '+T("period")+' '+hero.p.label.replace("P","")+(hero.topic?' · '+hubE(hero.topic):'')+'</div></div></div>');
        h.push('<div class="acts"><button class="hub-btn" onclick="hubOpenRes(\''+hero.sub.replace(/'/g,"")+'\',\''+hero.cls+'\')">'+T("openResources")+'</button>'
          +(hero.help?'':'<button class="hub-btn sec" onclick="hubOpenLesson(\''+hero.cls.split(",")[0].trim()+'\','+hero.idx+',\''+hero.day+'\')">'+T("details")+'</button>')+'</div>');
        h.push('</section>');
      } else if(lessons.length){
        h.push('<section class="hub-card hub-done">'+hubIcon("check",22,"#1E7A46",2.4)+'<b>'+T("noMoreLessons")+'</b></section>');
      }
    }
    // Lesson list
    const title=showingNext?T("myLessonsOn",{d:hubFmt(showDate,{weekday:"long",day:"numeric",month:"short"})}):T("myLessonsToday");
    h.push('<section class="hub-card"><div class="hub-cardhd"><h2 class="hub-h2">'+hubE(title)+'</h2><span class="cnt">'+(lessons.length===1?T("lessonN"):T("lessonsN",{n:lessons.length}))+'</span></div>');
    if(!lessons.length)h.push('<div class="hub-empty">'+T("noLessonsDay")+'</div>');
    else{
      let marked=false;
      lessons.forEach(l=>{
        let st="";
        if(!showingNext&&isSchool){
          const s=timeToMins(l.p.start),e=timeToMins(l.p.end);
          if(e<=nowM)st="done";else if(s<=nowM)st="now";else if(!marked){st="next";}
          if(st==="now"||st==="next")marked=true;
        }
        h.push(hubLessonRow(l,st));
      });
    }
    h.push('<button class="hub-more" onclick="hubGo(\'week\')">'+T("seeWeek")+' '+hubIcon("right",16)+'</button>');
    h.push('</section>');
  }
  h.push('</div><div class="hub-colB">');
  // Duty + talk tiles
  h.push(hubDutyTiles());
  // Gate duty today
  if(isSchool){
    const gate=LATE_DUTY_BY_DAY[hubEnDay(now)]||[];
    if(gate.length){
      const mine=gate.some(s=>hubIsMe(s));
      h.push('<section class="hub-card hub-gate'+(mine?" mine":"")+'"><div class="hub-eyebrow">'+(mine?T("gateDutyYou"):T("gateDutyToday"))+' · 07:55–08:25</div><div class="v">'+gate.map(s=>hubIsMe(s)?'<b>'+hubE(s)+'</b>':hubE(s)).join(", ")+'</div></section>');
    }
  }
  // Coming up
  const ev=hubUpcoming(5);
  if(ev.length){
    h.push('<section class="hub-card"><h2 class="hub-h2">'+T("comingUp")+'</h2>');
    ev.forEach(g=>{
      const d=hubParse(g.start);
      const off=g.type==="holiday"||g.type==="break";
      h.push('<div class="hub-ev"><span class="dt'+(off?" off":"")+'"><i>'+hubE(hubFmt(d,{month:"short"}).toUpperCase())+'</i><b>'+d.getDate()+'</b></span><span class="lb">'+hubE(g.label)+(g.start!==g.end?'<span class="rg">'+hubE(hubRange(g))+'</span>':'')+'</span></div>');
    });
    h.push('</section>');
  }
  // Announcements
  const anns=DB.announcements||[];
  h.push('<section class="hub-card hub-ann"><div class="hub-cardhd"><h2 class="hub-h2" style="color:#5C3D00">'+T("announcements")+'</h2><button class="hub-link" onclick="S.popup={type:\'assembly\'};render()">'+(anns.length?T("manage"):T("addAnn"))+'</button></div>');
  if(!anns.length)h.push('<div class="hub-empty" style="color:#7A5A1A">'+T("noAnnouncements")+'</div>');
  else anns.slice(-4).reverse().forEach(a=>h.push('<div class="hub-annrow">'+hubIcon("bell",16,"#8A5A00")+'<span>'+hubE(a.text)+'</span></div>'));
  h.push('</section>');
  h.push('</div></div>');
  return h.join("");
}
function hubDutyTiles(){
  const me=hubMe();const now=new Date();
  const sw=hubCurWeek();
  const h=['<section class="hub-tiles">'];
  // Duty tile
  if(me){
    const st=hubDutyStatus();
    let v,s,cls="";
    if(st.none){v=T("morningDuty");s=T("notOnRota");cls="muted";}
    else if(st.cur){v=T("onDutyThisWeek");s=hubE(hubPos(st.cur.pos));cls="on";}
    else{v=T("offThisWeek");s=st.nextWeek?T("next")+': '+T("wk")+' '+dispWk(st.nextWeek.week)+' · '+hubE(hubFmt(hubParse(st.nextWeek.start),{day:"numeric",month:"short"})):'';cls="off";}
    h.push('<button class="hub-tile '+cls+'" onclick="hubGo(\'duty\')"><span class="hub-eyebrow">'+T("morningDuty")+'</span><span class="v">'+v+'</span><span class="s">'+s+'</span></button>');
  } else {
    const r=sw?getDutyRota(sw.week):null;
    h.push('<button class="hub-tile" onclick="hubGo(\'duty\')"><span class="hub-eyebrow">'+T("morningDuty")+'</span><span class="v">'+(r?T("rota")+' '+r.rota:'—')+'</span><span class="s">'+(sw?T("wk")+' '+dispWk(sw.week):'')+'</span></button>');
  }
  // Talk tile
  const talkDay=hubIsSchoolDay(now)?now:hubNextSchoolDay(now,false);
  const todayTalk=talkDay?hubTalkOn(talkDay):null;
  if(me){
    const nt=hubMyNextTalk();
    const isToday=nt&&hubKey(nt)===hubKey(now);
    h.push('<button class="hub-tile'+(isToday?" on":"")+'" onclick="hubGo(\'duty\')"><span class="hub-eyebrow">'+T("morningTalk")+'</span><span class="v">'+(nt?(isToday?T("today"):hubE(hubFmt(nt,{weekday:"short",day:"numeric",month:"short"}))):T("notOnTalk"))+'</span><span class="s">'+(todayTalk&&talkDay?(hubKey(talkDay)===hubKey(now)?T("todaySpeaker"):hubE(hubDayName(talkDay,true)))+': '+hubE(todayTalk):'')+'</span></button>');
  } else {
    h.push('<button class="hub-tile" onclick="hubGo(\'duty\')"><span class="hub-eyebrow">'+T("morningTalk")+'</span><span class="v">'+hubE(todayTalk||"—")+'</span><span class="s">'+(talkDay?hubE(hubFmt(talkDay,{weekday:"long"})):"")+'</span></button>');
  }
  h.push('</section>');
  return h.join("");
}

// ── WEEK ──────────────────────────────────────────────────────────────────────
function hubWeekView(){
  const me=hubMe();
  if(!me){S.hubTab="classes";return "";}
  const off=S.hubWkOff||0;
  const sw=hubWeekByOffset(off);
  const mon=hubParse(sw.start);
  const todayK=hubKey(new Date());
  const days=HUB_DAYS.map((d,i)=>{const dt=hubAddDays(mon,i);return{en:d,dt,k:hubKey(dt)};});
  let sel=S.hubDay;
  if(!sel||!days.find(x=>x.en===sel)){const t=days.find(x=>x.k===todayK);sel=t?t.en:"Monday";}
  const th=getIntegrationTheme(sw.week);
  const h=[];
  h.push('<section class="hub-weekhd">');
  h.push('<button class="hub-ib" aria-label="'+T("prevWeek")+'" onclick="hubWk(-1)">'+hubIcon("left",18,null,2.4)+'</button>');
  h.push('<div class="mid"><div class="t">'+(hubLang()==="th"?"สัปดาห์ที่ "+dispWk(sw.week)+" · ภาคเรียนที่ "+hubSemLabel(sw):T("wk")+" "+dispWk(sw.week)+" · "+T("semester")+" "+hubSemLabel(sw))+'</div>'
    +'<div class="s">'+hubE(hubFmt(mon,{day:"numeric",month:"short"}))+' – '+hubE(hubFmt(hubAddDays(mon,4),{day:"numeric",month:"short",year:"numeric"}))+'</div>'
    +(th?'<div class="int"><span class="lbl">'+T("integration")+'</span> '+hubE(th)+'</div>':'')+'</div>');
  h.push('<button class="hub-ib" aria-label="'+T("nextWeekBtn")+'" onclick="hubWk(1)">'+hubIcon("right",18,null,2.4)+'</button>');
  h.push('</section>');
  if(off!==0)h.push('<div style="text-align:center;margin:-4px 0 10px"><button class="hub-link" onclick="hubWk(0)">'+T("backToday")+'</button></div>');
  // Day selector (phone)
  h.push('<div class="hub-days hub-mob-only">');
  days.forEach(d=>{
    const on=d.en===sel,isT=d.k===todayK;
    h.push('<button class="'+(on?"on":"")+(isT?" today":"")+'" aria-pressed="'+on+'" onclick="hubSelDay(\''+d.en+'\')"><span>'+hubE(hubDayName(d.dt,true))+'</span><b>'+d.dt.getDate()+'</b></button>');
  });
  h.push('</div>');
  // Columns: on phone only the selected day is shown, on desktop all five
  h.push('<div class="hub-wgrid">');
  days.forEach(d=>{
    const hol=hubHolidayLabel(d.k);
    const lessons=hol?[]:hubLessons(me.name,d.en,sw.week);
    const isT=d.k===todayK;
    h.push('<section class="hub-wday'+(d.en===sel?" sel":"")+(isT?" today":"")+'">');
    h.push('<div class="hd"><span>'+hubE(hubFmt(d.dt,{weekday:"long",day:"numeric",month:"short"}))+(isT?' · '+T("today"):'')+'</span><span class="cnt">'+(hol?'':(lessons.length===1?T("lessonN"):T("lessonsN",{n:lessons.length})))+'</span></div>');
    if(hol)h.push('<div class="hub-holi">'+hubIcon("sun",18,"#8A5A00")+'<span><b>'+T("noClass")+'</b><br>'+hubE(hol)+'</span></div>');
    else if(!lessons.length)h.push('<div class="hub-empty">'+T("noLessonsDay")+'</div>');
    else lessons.forEach(l=>h.push(hubLessonRow(l,"")));
    const ev=getCalendarDay(d.k).filter(e=>e.type==="event"||e.type==="exam");
    ev.forEach(e=>h.push('<div class="hub-wev">'+hubIcon("bell",14,"#8A5A00")+hubE(e.label)+'</div>'));
    h.push('</section>');
  });
  h.push('</div>');
  h.push('<p class="hub-hint">'+T("freeHidden")+'</p>');
  return h.join("");
}

// ── DUTY & ASSEMBLY ───────────────────────────────────────────────────────────
function hubDutyView(){
  const me=hubMe();const now=new Date();const sw=hubCurWeek();
  const todayEn=hubEnDay(now);
  const h=[];
  h.push('<div class="hub-cols"><div class="hub-colA">');
  h.push('<section class="hub-greet"><h1>'+T("duty")+'</h1><div class="sub">'+(sw?(hubLang()==="th"?"ภาคเรียนที่ "+hubSemLabel(sw)+" · สัปดาห์ที่ "+dispWk(sw.week):T("semester")+" "+hubSemLabel(sw)+" · "+T("wk")+" "+dispWk(sw.week))+' · '+hubE(hubFmt(hubParse(sw.start),{day:"numeric",month:"short"}))+' – '+hubE(hubFmt(hubParse(sw.end),{day:"numeric",month:"short"})):'')+'</div></section>');
  // My duties
  if(me){
    const st=hubDutyStatus();const nt=hubMyNextTalk();const gd=hubMyGateDays();
    h.push('<section class="hub-card"><div class="hub-eyebrow" style="color:var(--red);margin-bottom:6px">'+T("myDuties")+' · '+hubE(me.name)+'</div>');
    let dv,ds,ok;
    if(st.none){dv=T("notOnRota");ds="";ok=true;}
    else if(st.cur){dv=T("onDutyThisWeek");ds=hubE(hubPos(st.cur.pos))+' · 07:00–07:55';ok=false;}
    else{dv=T("offThisWeek");ds=st.nextWeek?T("next")+': '+T("wk")+' '+dispWk(st.nextWeek.week)+' · '+hubE(hubFmt(hubParse(st.nextWeek.start),{day:"numeric",month:"short"}))+'–'+hubE(hubFmt(hubParse(st.nextWeek.end),{day:"numeric",month:"short"}))+' · '+hubE(hubPos(st.next.pos)):'';ok=true;}
    h.push('<div class="hub-mine"><span class="ic '+(ok?"ok":"on")+'">'+hubIcon(ok?"check":"duty",22,ok?"#1E7A46":"#B91C1C",2.3)+'</span><div><b>'+dv+'</b><span>'+ds+'</span></div></div>');
    h.push('<div class="hub-mine"><span class="ic talk">'+hubIcon("mic",22,"#B91C1C")+'</span><div><b>'+T("morningTalk")+' · '+(nt?hubE(hubFmt(nt,{weekday:"long",day:"numeric",month:"short"})):T("notOnTalk"))+'</b><span></span></div></div>');
    if(gd.length)h.push('<div class="hub-mine"><span class="ic gate">'+hubIcon("duty",22,"#8A5A00")+'</span><div><b>'+T("gateDuty")+'</b><span>'+gd.map(d=>hubE(hubDayName(hubAddDays(hubParse(sw.start),HUB_DAYS.indexOf(d)),false))).join(", ")+'</span></div></div>');
    h.push('</section>');
  }
  // Morning talk this week + next week
  [[0,T("talkThisWeek")],[7,T("talkNextWeek")]].forEach(([addD,title])=>{
    const base=hubAddDays(now,addD);
    const r=getMorningTalkWeek(base);if(!r)return;
    const monday=mondayOf(base);
    h.push('<section class="hub-card hub-tbl"><div class="hub-cardhd"><h2 class="hub-h2">'+title+'</h2><span class="cnt">'+hubE(r.label)+'</span></div>');
    HUB_DAYS.forEach((d,i)=>{
      const dt=hubAddDays(monday,i);const isT=addD===0&&d===todayEn;const mine=hubIsMe(r[d]);
      const hol=hubHolidayLabel(hubKey(dt));
      h.push('<div class="hub-trow'+(isT?" today":"")+(mine?" mine":"")+'"><span class="d">'+hubE(hubFmt(dt,{weekday:"short",day:"numeric"}))+'</span><span class="n">'+(hol?'<i>'+T("noClass")+'</i>':hubE(r[d])+(mine?' <span class="hub-you">'+T("you")+'</span>':''))+'</span></div>');
    });
    h.push('</section>');
  });
  h.push('</div><div class="hub-colB">');
  // This week's rota
  const rota=sw?getDutyRota(sw.week):null;
  if(rota){
    h.push('<section class="hub-card hub-tbl"><div class="hub-cardhd"><h2 class="hub-h2">'+T("dutyThisWeek")+'</h2><span class="cnt">'+T("rota")+' '+rota.rota+' · 07:00–07:55</span></div>');
    rota.positions.forEach(p=>{
      const mine=p.staff.some(s=>hubIsMe(s));
      h.push('<div class="hub-post'+(mine?" mine":"")+'"><span class="p">'+hubE(hubPos(p.pos))+'</span><span class="s">'+p.staff.map(s=>{const c=s.replace(/\*+/g,"");return hubIsMe(s)?'<b>'+hubE(c)+'</b>':hubE(c);}).join(", ")+'</span></div>');
    });
    h.push('</section>');
  }
  // Gate duty by day
  h.push('<section class="hub-card hub-tbl"><div class="hub-cardhd"><h2 class="hub-h2">'+T("gateDuty")+'</h2></div>');
  HUB_DAYS.forEach(d=>{
    const st=LATE_DUTY_BY_DAY[d]||[];const isT=d===todayEn;const mine=st.some(s=>hubIsMe(s));
    const dt=hubAddDays(hubParse((sw||{start:hubKey(now)}).start),HUB_DAYS.indexOf(d));
    h.push('<div class="hub-trow'+(isT?" today":"")+(mine?" mine":"")+'"><span class="d">'+hubE(hubFmt(dt,{weekday:"short"}))+'</span><span class="n">'+st.map(s=>hubIsMe(s)?'<b>'+hubE(s)+'</b>':hubE(s)).join(", ")+'</span></div>');
  });
  h.push('</section>');
  // Rota schedule
  h.push('<section class="hub-card"><h2 class="hub-h2">'+T("rotaSchedule")+'</h2><div class="hub-rotas">');
  const myR=new Set(hubMyDuty().map(m=>m.r.rota));
  MORNING_DUTY_ROTA.forEach(r=>{
    const isNow=sw&&r.weeks.includes(sw.week);const mine=myR.has(r.rota);
    h.push('<div class="hub-rchip'+(isNow?" now":"")+(mine?" mine":"")+'"><b>'+T("rota")+' '+r.rota+(mine?' · '+T("you"):'')+(isNow?' · '+T("now"):'')+'</b><span>'+T("weeks")+' '+r.weeks.map(dispWk).join(", ")+'</span></div>');
  });
  h.push('</div></section>');
  h.push('</div></div>');
  return h.join("");
}

// ── RENDER (replaces legacy render) ───────────────────────────────────────────
const _hubLegacyRender=render;
function hubRender(){
  try{localStorage.setItem("navState",JSON.stringify({
    tab:S.tab,tmView:S.tmView,tmTeacher:S.tmTeacher,
    tmProg:S.tmProg,cls:S.cls,resProg:S.resProg,resLevel:S.resLevel,resSub:S.resSub
  }));}catch(e){}
  if(S.tmTeacher&&!TEACHERS.find(t=>t.id===S.tmTeacher))S.tmTeacher=TEACHERS[0].id;
  if(S.cls&&!getTimetableForCls(S.cls)[S.cls])S.cls="K1A";
  const root=document.getElementById("root");
  if(!root)return;
  document.documentElement.lang=hubLang()==="th"?"th":"en";
  try{
    S.clockStr=nowTimeStr();
    if(!S.hubMe||S.hubPicking){
      root.className="hub-root";
      root.innerHTML=hubWelcome()+(S.popup?renderPopup():"");
      return;
    }
    if(!hubMe()&&S.hubTab==="week")S.hubTab="today";
    let body="";
    if(S.hubTab==="classes"){
      S.tab="timetable";
      body=renderTimetableNav()+'<div id="tab-body" style="flex:1;overflow:visible;position:relative;width:100%">'+renderTimetable()+'</div>';
    } else if(S.hubTab==="resources"){
      S.tab="resources";
      body='<div id="tab-body" style="flex:1;overflow:visible;position:relative;width:100%">'+renderResources()+'</div>';
    } else {
      const v=S.hubTab==="week"?hubWeekView():S.hubTab==="duty"?hubDutyView():hubToday();
      body='<main class="hub-main">'+v+'</main>';
    }
    root.className="hub-root hub-on"+(["today","week","duty"].includes(S.hubTab)?" hub-own":"");
    root.innerHTML=hubHeader()+body+hubBottomNav()+(S.popup?renderPopup():"");
  }catch(err){
    console.error("hubRender error:",err);
    try{root.className="";_hubLegacyRender();}catch(e2){
      root.innerHTML='<div style="padding:2rem;text-align:center;color:#B91C1C;font-weight:700">Dashboard error — please refresh the page.<br><small style="color:#9CA3AF">'+escHtml(e2.message)+'</small></div>';
    }
  }
  if(S.hubTab==="classes")setTimeout(()=>{try{updatePeriodProgress();}catch(e){}},50);
}
render=hubRender;

// ── BOOT ──────────────────────────────────────────────────────────────────────
(function(){
  let st={};
  try{st=JSON.parse(localStorage.getItem("hubState")||"{}")||{};}catch(e){st={};}
  S.hubLang=st.lang==="th"?"th":"en";
  S.hubMe=null;
  if(st.me==="__all")S.hubMe="__all";
  else if(st.me&&hubPeople().some(p=>p.key===hubNorm(st.me)))S.hubMe=st.me;
  const tabs=["today","week","duty","classes","resources"];
  S.hubTab=tabs.includes(st.tab)?st.tab:(S.hubMe==="__all"?"classes":"today");
  S.hubWkOff=0;S.hubDay=null;S.hubPicking=false;
  render();
})();
