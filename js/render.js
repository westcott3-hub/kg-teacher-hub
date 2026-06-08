function render(){
  // Persist nav state across refreshes
  try{localStorage.setItem("navState",JSON.stringify({
    tab:S.tab,tmView:S.tmView,tmTeacher:S.tmTeacher,
    tmProg:S.tmProg,cls:S.cls,resProg:S.resProg,resLevel:S.resLevel,resSub:S.resSub
  }));}catch(e){}
  const root=document.getElementById("root");
  root.innerHTML=`
    ${renderHeader()}
    ${renderTabs()}
    ${S.tab==="timetable"?renderTimetableNav():""}
    <div id="tab-body" style="flex:1;overflow:visible;position:relative">
      ${S.tab==="timetable"?renderTimetable():""}

      ${S.tab==="resources"?renderResources():""}

    </div>
    ${S.popup?renderPopup():""}
  `;
  // Post-render hooks
  if(S.tab==="timetable"){
    setTimeout(()=>{updatePeriodProgress();},50);
  }

}


// ── K3 TOPIC DETAIL PANEL ─────────────────────────────────────────────────────
// Renders expandable lesson details for K3A/K3B MLP periods
// topicData = object from getWeekTopic (K3_TOPICS entry) or null
// expandKey = unique string for toggle state in S.topicOpen
function renderTopicDetail(topicData,col,expandKey){
  if(!topicData||typeof topicData==='string')return'';
  const isOpen=S.topicOpen&&S.topicOpen===expandKey;
  const isInteg=!!topicData.theme;
  const label=isInteg?topicData.theme:(topicData.unit?'U'+topicData.unit+' · '+topicData.topic:topicData.topic);
  const toggleFn="S.topicOpen=(S.topicOpen==='"+expandKey+"'?null:'"+expandKey+"');render()";
  let out='<div style="margin-top:3px">';
  // Compact row: topic label + chevron
  out+='<div onclick="'+toggleFn+'" style="display:flex;align-items:center;gap:4px;cursor:pointer;user-select:none">';
  out+='<div style="font-size:0.72rem;color:'+col+';font-style:italic;font-weight:600;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+label+'</div>';
  out+='<div style="font-size:0.65rem;color:'+col+';opacity:0.6;flex-shrink:0">'+(isOpen?'▲':'▼')+'</div>';
  out+='</div>';
  // Expanded detail panel
  if(isOpen){
    out+='<div style="background:#f8fafc;border-radius:8px;padding:0.6rem 0.7rem;margin-top:5px;border:1px solid #e2e8f0;font-size:0.72rem;line-height:1.5">';
    if(isInteg){
      if(topicData.topics&&topicData.topics.length){
        out+='<div style="font-weight:700;color:#374151;margin-bottom:3px">📌 Topics:</div>';
        out+='<ul style="margin:0 0 6px 0;padding-left:1.1rem">';
        topicData.topics.forEach(t=>{out+='<li style="color:#4B5563">'+t+'</li>';});
        out+='</ul>';
      }
    } else {
      if(topicData.unit)out+='<div style="font-weight:700;color:#374151">📖 Unit '+topicData.unit+': '+topicData.topic+'</div>';
      if(topicData.structs)out+='<div style="color:#6B7280;margin-top:4px;font-style:italic">"'+topicData.structs+'"</div>';
    }
    if(topicData.vocab){
      out+='<div style="margin-top:5px"><span style="font-weight:700;color:#374151">🔤 Vocab: </span><span style="color:#4B5563">'+topicData.vocab+'</span></div>';
    }
    out+='</div>';
  }
  out+='</div>';
  return out;
}

// ── HEADER ────────────────────────────────────────────────────────────────────
function renderHeader(){
  const sw=getCurrentSchoolWeek();
  const now=new Date();
  const dayName=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][now.getDay()];
  const dateStr=now.toLocaleDateString("en-GB",{day:"numeric",month:"short"});
  const dc=todayDayColors();
  const syncCls=S.syncStatus==='ok'?'sync-ok':S.syncStatus==='ing'?'sync-ing':'sync-err';
  return`<div style="flex-shrink:0">
    <div style="height:3px;background:#B91C1C"></div>
    <div style="background:${dc.bg};border-bottom:2px solid ${dc.border};padding:0.3rem 0.75rem;display:flex;align-items:center;gap:0.55rem">
      <img src="${SCHOOL_LOGO}" style="height:32px;width:auto;border-radius:4px;flex-shrink:0" alt="ACS">
      <div style="flex:1;min-width:0;display:flex;align-items:center;gap:0.45rem;overflow:hidden">
        <div style="font-weight:900;font-size:0.9rem;color:${dc.text};white-space:nowrap;letter-spacing:-0.2px">ACS KG Hub</div>
        <div style="width:1px;height:13px;background:${dc.border};opacity:0.6;flex-shrink:0"></div>
        <div style="font-weight:800;font-size:0.88rem;color:${dc.text};white-space:nowrap">${dayName} ${dateStr}</div>
        ${sw?`<div style="width:1px;height:13px;background:${dc.border};opacity:0.6;flex-shrink:0"></div>
        <div style="font-weight:900;font-size:0.88rem;color:${dc.text};white-space:nowrap">Wk ${sw.week}</div>
        <div style="font-size:0.72rem;color:${dc.text};opacity:0.75;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0">${sw.sem}</div>`:''}
      </div>
      <div style="display:flex;align-items:center;gap:0.4rem;flex-shrink:0">
        <div id="period-progress"></div>
        <button onclick="S.popup={type:'dutyRota'};render()" style="height:30px;padding:0 0.55rem;border-radius:8px;border:1px solid ${dc.border};background:rgba(0,0,0,0.08);cursor:pointer;font-size:0.75rem;font-weight:800;color:${dc.text};white-space:nowrap;font-family:'Nunito',sans-serif" title="Morning Duty Rota">&#128205; Duty</button>
        <div id="header-clock" style="font-size:1.45rem;font-weight:900;color:${dc.text};font-variant-numeric:tabular-nums;letter-spacing:-0.5px;line-height:1">${nowTimeStr()}</div>
        <div class="sync-dot ${syncCls}" title="Sync: ${S.syncStatus}"></div>
      </div>
    </div>
  </div>`;
}

// ── TABS ──
// ── TABS ──────────────────────────────────────────────────────────────────────
function renderTabs(){
  return`<div class="scrl" style="background:#fff;padding:0 0.5rem;display:flex;gap:1px;flex-shrink:0;border-bottom:1px solid #E5E7EB">
    ${TABS.map(t=>{
      const active=S.tab===t.id;
      const resetTm=t.id!=="timetable"?"S.tmView='classes';":"";
      return`<button class="tab-btn" onclick="S.tab='${t.id}';${resetTm}render()" style="
        background:transparent;
        color:${active?'#B91C1C':'#6B7280'};
        font-weight:${active?'800':'700'};
        padding:0.5rem 1rem;
        border-radius:0;
        font-size:0.76rem;
        border-bottom:2px solid ${active?'#B91C1C':'transparent'};
        margin-bottom:-2px;
        transition:all 0.15s;
      ">${t.label}</button>`;
    }).join('')}
  </div>`;
}

// ── TIMETABLE SHELL (teacher view wrapper) ────────────────────────────────────
function renderTimetableShell(innerHtml){
  return innerHtml;
}

function renderTeacherPicker(){
  return '<div style="padding:2rem;text-align:center;color:#9CA3AF;font-style:italic">Select a teacher above to view their timetable</div>';
}
// ── TIMETABLE STICKY SUB-NAV ─────────────────────────────────────────────
function renderTimetableNav(){
  const MLP_CLS=["K1A","K1B","K2A","K2B","K3A","K3B"];
  const IEP_CLS=["K1/1","K1/2","K1/3","K2/1","K2/2","K2/3","K3/1","K3/2","K3/3","K3/4"];
  const NURSERY_CLS=["N1","N2"];
  const curProg=S.tmProg||"MLP";
  const clsList=curProg==="IEP"?IEP_CLS:curProg==="Nursery"?NURSERY_CLS:MLP_CLS;
  const inTeachers=S.tmView==="teachers";
  const h=[];
  h.push('<div style="background:#fff;border-bottom:1px solid #E5E7EB;flex-shrink:0;box-shadow:0 1px 4px rgba(0,0,0,0.05)">');
  // Single nav row: view toggle | programme + class/teacher pills (all scrollable)
  h.push('<div class="scrl" style="padding:0.3rem 0.6rem;display:flex;align-items:center;gap:0.3rem;overflow-x:auto;-webkit-overflow-scrolling:touch;white-space:nowrap">');
  // Classes / Teachers pill toggle -- same style as class pills
  ['classes','teachers'].forEach(v=>{
    const act=inTeachers?(v==='teachers'):(v==='classes');
    const lbl=v==='classes'?'&#128203; Classes':'&#128105;&#8205;&#127979; Teachers';
    h.push('<button onclick="S.tmView=\''+v+'\';if(\''+v+'\'===\'teachers\'&&!S.tmTeacher)S.tmTeacher=TEACHERS[0].id;render()" style="padding:0.3rem 0.75rem;border-radius:8px;border:2px solid '+(act?'var(--red)':'#E5E7EB')+';background:'+(act?'var(--red)':'#F9FAFB')+';color:'+(act?'#fff':'#6B7280')+';font-family:\'Nunito\',sans-serif;font-size:0.85rem;font-weight:'+(act?800:700)+';cursor:pointer;white-space:nowrap;flex-shrink:0;min-height:32px;transition:all 0.15s">'+lbl+'</button>');
  });
  h.push('<div style="width:1px;height:20px;background:#E5E7EB;flex-shrink:0;margin:0 0.1rem"></div>');
  if(!inTeachers){
    [["MLP","K1A"],["IEP","K1/1"],["Nursery","N1"]].forEach(([prog,defCls])=>{
      const act=curProg===prog;
      h.push('<button onclick="S.tmProg=\''+prog+'\';S.cls=\''+defCls+'\';render()" style="padding:0.3rem 0.65rem;border-radius:20px;border:2px solid '+(act?'var(--red)':'#E5E7EB')+';background:'+(act?'var(--red)':'#F9FAFB')+';color:'+(act?'#fff':'#6B7280')+';font-family:\'Nunito\',sans-serif;font-size:0.82rem;font-weight:700;cursor:pointer;white-space:nowrap;flex-shrink:0;min-height:32px;transition:all 0.15s">'+prog+'</button>');
    });
    h.push('<div style="width:1px;height:20px;background:#E5E7EB;flex-shrink:0;margin:0 0.1rem"></div>');
    clsList.forEach(c=>{
      const act=S.cls===c;
      h.push('<button onclick="S.cls=\''+c+'\';S.tmView=\'classes\';render()" style="padding:0.3rem 0.65rem;border-radius:8px;border:2px solid '+(act?'var(--red)':'#E5E7EB')+';background:'+(act?'var(--red)':'#F9FAFB')+';color:'+(act?'#fff':'#374151')+';font-family:\'Nunito\',sans-serif;font-size:0.85rem;font-weight:'+(act?800:700)+';cursor:pointer;white-space:nowrap;flex-shrink:0;min-height:32px;transition:all 0.15s">'+c+'</button>');
    });
  } else {
    TEACHERS.forEach(t=>{
      const act=S.tmTeacher===t.id;
      h.push('<button onclick="S.tmTeacher=\''+t.id+'\';render()" style="padding:0.3rem 0.75rem;border-radius:8px;border:2px solid '+(act?'var(--red)':'#E5E7EB')+';background:'+(act?'var(--red)':'#F9FAFB')+';color:'+(act?'#fff':'#374151')+';font-family:\'Nunito\',sans-serif;font-size:0.85rem;font-weight:'+(act?800:700)+';cursor:pointer;white-space:nowrap;flex-shrink:0;min-height:32px;transition:all 0.15s">'+t.full+'</button>');
    });
  }
  h.push('</div></div>');
  return h.join('');
}

// ── TIMETABLE TAB ─────────────────────────────────────────────────────────────
// ── SCHOOL CALENDAR CARD ────────────────────────────────────────────────────────
function renderCalendarCard(h){
  const typeStyle={
    holiday:{bg:"#fee2e2",text:"#dc2626",dot:"#ef4444"},
    break:   {bg:"#fef9c3",text:"#92400e",dot:"#f59e0b"},
    event:   {bg:"#dbeafe",text:"#1d4ed8",dot:"#3b82f6"},
    exam:    {bg:"#ede9fe",text:"#6d28d9",dot:"#8b5cf6"}
  };
  const now=new Date();
  const defaultMonth=now.toISOString().slice(0,7);
  const monthKey=S.tmCalMonth||defaultMonth;
  const calData=SCHOOL_CALENDAR[monthKey];
  const availableMonths=Object.keys(SCHOOL_CALENDAR);

  const calOpen=S.tmCalOpen!==false;
  h.push('<div style="background:#fff;box-shadow:0 1px 4px rgba(26,43,74,0.06);border-top:1px solid #E4E8EE;border-bottom:1px solid #E4E8EE;overflow:hidden">');
  h.push('<div style="display:flex;align-items:center;padding:0.4rem 0.75rem;border-bottom:1px solid #f1f5f9;gap:0.4rem;flex-wrap:wrap;cursor:pointer" onclick="S.tmCalOpen=S.tmCalOpen===false?true:false;render()">');
  h.push('<div style="font-weight:800;font-size:0.82rem;color:#111827;margin-right:0.25rem">&#128197; School Calendar</div>');
  h.push('<div style="margin-left:auto;font-size:0.7rem;color:#9CA3AF;flex-shrink:0">'+(calOpen?'&#9650; Hide':'&#9660; Show')+'</div>');
  if(calOpen)availableMonths.forEach(mk=>{
    const isActive=mk===monthKey;
    const mn=SCHOOL_CALENDAR[mk].name.split(" ")[0];
    h.push('<button onclick="event.stopPropagation();S.tmCalMonth=\''+mk+'\';render()" style="padding:0.25rem 0.6rem;border-radius:20px;border:none;cursor:pointer;font-family:\'Nunito\',sans-serif;font-weight:700;font-size:0.78rem;background:'+(isActive?"var(--red)":"#f1f5f9")+';color:'+(isActive?"#fff":"#64748b")+'">'+mn+'</button>');
  });
  h.push('</div>');
  if(calOpen&&calData){
    const monthDate=new Date(monthKey+"-01T12:00:00");
    const year=monthDate.getFullYear(),month=monthDate.getMonth();
    const firstDay=new Date(year,month,1).getDay();
    const daysInMonth=new Date(year,month+1,0).getDate();
    h.push('<div style="padding:0.75rem 0.9rem">');
    // Day headers
    h.push('<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:3px;margin-bottom:5px">');
    ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].forEach(d=>{
      const dc=THAI_DAY_COLORS[d]||{bg:"#e2e8f0",text:"#64748b"};
      h.push('<div style="text-align:center;font-size:0.78rem;font-weight:800;color:'+dc.text+';background:'+dc.bg+';border-radius:5px;padding:4px 0">'+d.slice(0,3)+'</div>');
    });
    h.push('</div>');
    // Calendar grid
    h.push('<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:3px">');
    for(let i=0;i<firstDay;i++) h.push('<div></div>');
    for(let day=1;day<=daysInMonth;day++){
      const dateStr=year+"-"+(String(month+1).padStart(2,"0"))+"-"+(String(day).padStart(2,"0"));
      const entries=getCalendarDay(dateStr);
      const isToday=dateStr===todayKey();
      const dow=new Date(dateStr+"T12:00:00").getDay();
      const isWeekend=dow===0||dow===6;
      const holiday=entries.find(e=>e.type==="holiday"||e.type==="break");
      const event=entries.find(e=>e.type==="event"||e.type==="exam");
      const topEntry=holiday||event;
      const ts=topEntry?typeStyle[topEntry.type]:null;
      const cellBg=isToday?"var(--red)":ts?ts.bg:isWeekend?"#f8fafc":"#fff";
      const cellText=isToday?"#fff":ts?ts.text:isWeekend?"#cbd5e1":"#1e3a5f";
      h.push('<div style="border-radius:6px;padding:4px 3px;min-height:58px;background:'+cellBg+';border:1px solid '+(isToday?"var(--red-dark,#991B1B)":"#f1f5f9")+';position:relative" title="'+(topEntry?topEntry.label:"")+'">');
      h.push('<div style="font-size:0.88rem;font-weight:'+(isToday||topEntry?"800":"600")+';color:'+cellText+';text-align:center">'+day+'</div>');
      if(topEntry) h.push('<div style="font-size:0.65rem;font-weight:700;color:'+cellText+';text-align:center;line-height:1.3;padding:0 2px;overflow:hidden">'+topEntry.label.slice(0,20)+(topEntry.label.length>20?"…":"")+'</div>');
      if(entries.length>1) h.push('<div style="position:absolute;top:2px;right:2px;width:5px;height:5px;border-radius:50%;background:'+(typeStyle[entries[1].type]?.dot||"#94a3b8")+'"></div>');
      h.push('</div>');
    }
    h.push('</div>');
    // Legend
    h.push('<div style="display:flex;gap:0.6rem;margin-top:0.6rem;flex-wrap:wrap">');
    Object.entries(typeStyle).forEach(([type,s])=>{
      h.push('<div style="display:flex;align-items:center;gap:3px"><div style="width:8px;height:8px;border-radius:50%;background:'+s.dot+'"></div><span style="font-size:0.72rem;color:#64748b;font-weight:700;text-transform:capitalize">'+type+'</span></div>');
    });
    h.push('</div>');
    h.push('</div>'); // end padding
  }
  h.push('</div>'); // end calendar card
}

function renderTimetable(){
  // Route to teacher view if tmView==='teachers'
  if(S.tmView==="teachers"){
    const teacher=S.tmTeacher?TEACHERS.find(t=>t.id===S.tmTeacher):null;
    return renderTimetableShell(teacher?renderTeacherTab(teacher):renderTeacherPicker());
  }
  const cls=S.cls;
  const tt=(getTimetableForCls(cls)[cls])||{};
  const weekOffset=S.tmWeekOffset||0;
  const sw=getSchoolWeekForOffset(weekOffset);
  const weekNum=sw?sw.week:null;
  const today=S.tmDay||todayDayName();
  const realToday=todayDayName();
  const cp=getCurrentPeriod();
  const nowMins=timeToMins(nowTimeStr());
  const isWeekday=["Monday","Tuesday","Wednesday","Thursday","Friday"].includes(realToday);

  // Class-aware periods and breaks
  const PERIODS=getPeriodsForCls(cls);
  const BREAKS=getBreaksForCls(cls);

  // Determine time context
  const schoolStart=timeToMins("07:00");
  const schoolEnd=timeToMins("15:30");
  const dutyEnd=timeToMins("08:25");
  const p1Start=timeToMins("08:30");
  const isDutyTime=nowMins>=schoolStart&&nowMins<dutyEnd&&isWeekday;
  const isSchoolTime=nowMins>=p1Start&&nowMins<schoolEnd&&isWeekday;
  const isBeforeSchool=nowMins<p1Start&&isWeekday;
  const isAfterSchool=nowMins>=schoolEnd||!isWeekday;
  const isOnDuty=weekNum&&GARY_DUTY_WEEKS.has(weekNum); // Gary specifically on duty

  // Find current or next period for Gary's class
  const todayPeriods=tt[today]||[];
  let activePeriodIdx=-1;
  let nextPeriodIdx=-1;
  if(cp&&cp.type==="period"){
    activePeriodIdx=cp.idx;
    // Find next period after this one
    for(let i=cp.idx+1;i<PERIODS.length;i++){if(todayPeriods[i])nextPeriodIdx=i;break;}
  } else {
    // Find next upcoming period
    for(let i=0;i<PERIODS.length;i++){
      if(timeToMins(PERIODS[i].start)>nowMins){nextPeriodIdx=i;break;}
    }
  }

  const activePeriod=activePeriodIdx>=0?todayPeriods[activePeriodIdx]:null;
  const nextPeriod=nextPeriodIdx>=0?todayPeriods[nextPeriodIdx]:null;
  const activeP=activePeriodIdx>=0?PERIODS[activePeriodIdx]:null;
  const nextP=nextPeriodIdx>=0?PERIODS[nextPeriodIdx]:null;

  // Resources matching a subject
  function getResources(subj){
    if(!subj)return[];
    // Derive prog and level from current class context
    const isMLP=cls==='K1A'||cls==='K1B'||cls==='K2A'||cls==='K2B'||cls==='K3A'||cls==='K3B'||cls==='N1'||cls==='N2';
    const resProg=isMLP?'MLP':'IEP';
    const resLevel=cls.startsWith('K3')?'K3':cls.startsWith('K2')?'K2':'K1';
    return(DB.resources||[]).filter(r=>
      r.subject&&subj.includes(r.subject)&&
      (r.prog||'MLP')===resProg&&
      (r.level||'K1')===resLevel
    );
  }

  const h=[];
  h.push('<div style="padding:0.75rem 0;display:flex;flex-direction:column;gap:0.65rem">');
  (()=>{
    const dc=THAI_DAY_COLORS[realToday]||{bg:"#e2e8f0",text:"#1e3a5f",light:"#f8fafc",border:"#94a3b8"};
    // Build the full day timeline: duty + all periods + all breaks
    const DAY_START=timeToMins("07:00");
    const DAY_END=timeToMins("15:30");
    const DAY_TOTAL=DAY_END-DAY_START;

    const segments=[];
    // Morning duty
    segments.push({label:"Duty",start:"07:00",end:"08:25",color:"#B91C1C",type:"duty"});
    // Walk to class
    segments.push({label:"",start:"08:25",end:"08:30",color:"#e2e8f0",type:"gap"});
    // Weave in periods and breaks
    const allSlots=[
      ...PERIODS.map((p,i)=>({...p,type:"period",idx:i})),
      ...BREAKS.map(b=>({label:b.label,start:b.start,end:b.end,type:"break"}))
    ].sort((a,b)=>timeToMins(a.start)-timeToMins(b.start));

    allSlots.forEach(slot=>{
      if(slot.type==="period"){
        const period=todayPeriods[slot.idx];
        const subj=period?period.sub:"Free";
        const col=period?subColor(subj):"#e2e8f0";
        segments.push({label:slot.label+": "+subj,start:slot.start,end:slot.end,color:col,type:"period",subj});
      } else {
        segments.push({label:slot.label,start:slot.start,end:slot.end,color:"#fef9c3",border:"#f59e0b",type:"break"});
      }
    });
    // After school
    segments.push({label:"Home",start:"15:30",end:"15:30",color:"#dcfce7",type:"end"});

    const nowM=nowMins;
    const nowPct=Math.min(100,Math.max(0,((nowM-DAY_START)/DAY_TOTAL)*100));

    h.push('<div style="background:'+dc.light+';border-radius:14px;padding:0.75rem 0.9rem;box-shadow:0 1px 6px rgba(0,0,0,0.07);border-top:4px solid '+dc.border+';margin:0 1rem">');
    h.push('<div style="font-size:0.68rem;font-weight:700;color:'+dc.text+';margin-bottom:0.5rem;display:flex;justify-content:space-between"><span>07:00</span><span>'+realToday+'</span><span>15:30</span></div>');

    // The bar itself
    h.push('<div style="position:relative;height:36px;border-radius:10px;overflow:hidden;display:flex;border:1px solid #e2e8f0">');
    segments.forEach(seg=>{
      if(seg.start===seg.end)return;
      const segStart=timeToMins(seg.start);
      const segEnd=timeToMins(seg.end);
      const w=((segEnd-segStart)/DAY_TOTAL*100).toFixed(2);
      const isCurrent=nowM>=segStart&&nowM<segEnd;
      const isPast=nowM>=segEnd;
      const bg=seg.type==="break"?"#fef9c3":seg.color;
      const opacity=isPast?"0.35":"1";
      const border=isCurrent?"inset 0 0 0 2px rgba(255,255,255,0.9)":"none";
      h.push('<div style="width:'+w+'%;background:'+bg+';flex-shrink:0;position:relative;opacity:'+opacity+';box-shadow:'+border+';overflow:hidden;display:flex;align-items:center;justify-content:center" title="'+seg.label+' '+seg.start+'–'+seg.end+'">');
      if(isCurrent){
        // Pulsing highlight overlay
        const subPct=((nowM-segStart)/(segEnd-segStart)*100).toFixed(1);
        h.push('<div style="position:absolute;inset:0;background:rgba(255,255,255,0.25)"></div>');
        h.push('<div style="position:absolute;top:0;left:0;height:100%;width:'+subPct+'%;background:rgba(0,0,0,0.12)"></div>');
      }
      // Label (only if wide enough)
      const widthPct=parseFloat(w);
      if(widthPct>6){
        const textColor=seg.type==="break"?"#92400e":"#fff";
        h.push('<div style="position:relative;font-size:0.52rem;font-weight:800;color:'+textColor+';text-align:center;padding:0 2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;line-height:1.2">');
        if(seg.type==="period"){
          const parts=seg.label.split(": ");
          h.push('<div>'+parts[0]+'</div>');
          if(parts[1]&&widthPct>10)h.push('<div style="font-size:0.48rem;opacity:0.9">'+parts[1].slice(0,8)+'</div>');
        } else if(seg.type==="duty"){
          h.push('Duty');
        } else {
          if(widthPct>8)h.push('Break');
        }
        h.push('</div>');
      }
      h.push('</div>');
    });

    // Now marker (vertical line)
    h.push('</div>');
    h.push('<div style="position:relative;height:8px;margin-top:2px">');
    h.push('<div style="position:absolute;left:'+nowPct.toFixed(2)+'%;transform:translateX(-50%);width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:7px solid #ef4444"></div>');
    h.push('</div>');

    // Time labels for periods
    h.push('<div style="position:relative;height:14px;margin-top:1px">');
    segments.filter(s=>s.type==="period").forEach(seg=>{
      const segStart=timeToMins(seg.start);
      const pct=((segStart-DAY_START)/DAY_TOTAL*100).toFixed(2);
      h.push('<div style="position:absolute;left:'+pct+'%;font-size:0.52rem;color:#94a3b8;transform:translateX(-50%);white-space:nowrap">'+seg.start+'</div>');
    });
    h.push('</div>');
    h.push('</div>');
  })();

  // ── AFTER SCHOOL / SCHOOL'S OUT — full width, directly below progress bar ──
  if(isAfterSchool&&!S.tmDay){
    const tomorrow=DAYS[(DAYS.indexOf(realToday)+1)%DAYS.length]||DAYS[0];
    const tomorrowPeriods=tt[tomorrow]||[];
    h.push('<div style="background:#F0F9FF;border-radius:12px;padding:0.75rem 1rem;border:1px solid #BAE6FD;border-left:4px solid #0284C7;display:flex;align-items:center;gap:1rem;flex-wrap:wrap;margin:0 1rem">');
    h.push('<div style="font-weight:800;font-size:1rem;color:#0369A1;white-space:nowrap">&#127769; School\'s out!</div>');
    h.push('<div style="font-size:0.78rem;color:#0369A1;font-weight:700;white-space:nowrap">Tomorrow: '+tomorrow+'</div>');
    h.push('<div style="display:flex;gap:0.75rem;align-items:center;flex-wrap:wrap">');
    PERIODS.slice(0,3).forEach((p,i)=>{
      const period=tomorrowPeriods[i];
      if(!period)return;
      const col=subColor(period.sub);
      h.push('<div style="display:flex;align-items:center;gap:0.3rem">');
      h.push('<span style="font-size:0.65rem;color:#94a3b8;font-weight:700">'+p.label+'</span>');
      h.push('<span style="font-weight:700;font-size:0.78rem;color:'+col+'">'+period.sub+'</span>');
      h.push('</div>');
    });
    h.push('</div>');
    h.push('</div>');
  }


  // ── LESSON FOCUS (during a period) ──────────────────────────────────────────
  if(activePeriod&&activePeriodIdx>=0&&(!S.tmDay||S.tmDay===realToday)){
    const subj=activePeriod.sub;
    const tchr=activePeriod.teacher;
    const col=subColor(subj);
    const topic=getWeekTopic(subj,weekNum);
    const res=getResources(subj);
    const pct=activeP?Math.min(100,Math.round((nowMins-timeToMins(activeP.start))/(timeToMins(activeP.end)-timeToMins(activeP.start))*100)):0;
    const minsLeft=activeP?timeToMins(activeP.end)-nowMins:0;

    h.push('<div style="background:#fff;border-radius:12px;padding:1rem;box-shadow:0 2px 12px rgba(185,28,28,0.12);border-top:4px solid '+col+';margin:0 1rem">');
    h.push('<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:0.5rem;margin-bottom:0.5rem">');
    h.push('<div>');
    h.push('<div style="font-size:0.68rem;font-weight:700;color:'+col+';text-transform:uppercase;letter-spacing:0.5px">NOW &mdash; '+PERIODS[activePeriodIdx].label+'</div>');
    h.push('<div style="font-weight:800;font-size:1.3rem;color:#111827">'+subj+'</div>');
    if(tchr)h.push('<div style="font-size:0.75rem;color:#94a3b8">&#128100; '+tchr+'</div>');
    if(topic){if(typeof topic==='object'){const al=getTopicLabel(topic,period&&period.sub==='Integration');if(al)h.push('<div style="font-size:0.78rem;color:#475569;margin-top:0.2rem">&#128218; '+al+'</div>');}else h.push('<div style="font-size:0.78rem;color:#475569;margin-top:0.2rem">&#128218; '+topic+'</div>');}
    h.push('</div>');
    h.push('<div style="text-align:right;flex-shrink:0">');
    h.push('<div style="font-size:1.1rem;font-weight:800;color:'+col+'">'+minsLeft+'m</div>');
    h.push('<div style="font-size:0.62rem;color:#94a3b8">remaining</div>');
    h.push('</div>');
    h.push('</div>');
    // Progress bar
    h.push('<div style="background:#e2e8f0;border-radius:4px;height:6px;margin-bottom:0.75rem">');
    h.push('<div style="background:'+col+';border-radius:4px;height:6px;width:'+pct+'%;transition:width 1s"></div>');
    h.push('</div>');

    // Resources for this subject — collapsible
    if(res.length>0){
      h.push('<button onclick="S.nowResOpen=!S.nowResOpen;render()" style="width:100%;display:flex;align-items:center;justify-content:space-between;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:0.4rem 0.65rem;cursor:pointer;font-family:\'Nunito\',sans-serif;margin-top:0.25rem">');
      h.push('<span style="font-size:0.75rem;font-weight:700;color:#64748b">&#128206; '+res.length+' Resource'+(res.length>1?'s':'')+' available</span>');
      h.push('<span style="font-size:0.7rem;color:#94a3b8">'+(S.nowResOpen?'&#9650; Hide':'&#9660; Show')+'</span>');
      h.push('</button>');
      if(S.nowResOpen){
        h.push('<div style="display:flex;flex-direction:column;gap:0.3rem;margin-top:0.35rem">');
        res.forEach(r=>{
          const ti=typeInfo(r.type);
          h.push('<div style="display:flex;align-items:center;gap:0.5rem;background:#f8fafc;border-radius:8px;padding:0.45rem 0.6rem;border-left:3px solid '+ti.color+'">');
          h.push('<span>'+ti.icon+'</span>');
          h.push('<div style="flex:1;min-width:0"><div style="font-weight:700;font-size:0.78rem;color:#111827;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+r.name+'</div>');
          if(r.note)h.push('<div style="font-size:0.65rem;color:#94a3b8">'+r.note+'</div>');
          h.push('</div>');
          h.push('<a href="'+r.url+'" target="_blank" class="btn-sm" style="background:'+ti.color+'22;color:'+ti.color+';text-decoration:none;flex-shrink:0">Open</a>');
          h.push('</div>');
        });
        h.push('</div>');
      }
    }
    h.push('</div>');
  }

  // ── BREAK CARD ──────────────────────────────────────────────────────────────
  if(cp&&cp.type==="break"&&(!S.tmDay||S.tmDay===realToday)){
    const breakInfo=BREAKS.find(b=>nowMins>=timeToMins(b.start)&&nowMins<timeToMins(b.end));
    if(breakInfo){
      const minsLeft=timeToMins(breakInfo.end)-nowMins;
      const nextIdx=nextPeriodIdx>=0?nextPeriodIdx:-1;
      const nextSub=nextIdx>=0?(todayPeriods[nextIdx]?.sub||""):"";
      const nextTopic=nextSub?getWeekTopic(nextSub,weekNum,cls):null;
      const nextRes=nextSub?getResources(nextSub):[];
      h.push('<div style="background:#FFFBEB;border-radius:12px;padding:0.9rem 1rem;border:1px solid #FDE68A;border-left:4px solid #D97706;margin:0 1rem">');
      h.push('<div style="display:flex;align-items:center;justify-content:space-between">');
      h.push('<div><div style="font-weight:800;font-size:0.95rem;color:#92400e">'+breakInfo.label+'</div>');
      h.push('<div style="font-size:0.72rem;color:#b45309">'+breakInfo.start+' &ndash; '+breakInfo.end+'</div></div>');
      h.push('<div style="font-size:1.4rem;font-weight:800;color:#92400e">'+minsLeft+'m</div>');
      h.push('</div>');
      if(nextSub){
        h.push('<div style="margin-top:0.6rem;padding-top:0.6rem;border-top:1px solid #fcd34d">');
        h.push('<div style="font-size:0.68rem;font-weight:700;color:#b45309">NEXT &rarr; '+PERIODS[nextIdx].label+' &middot; '+PERIODS[nextIdx].start+'</div>');
        h.push('<div style="font-weight:700;font-size:0.85rem;color:#111827;margin-top:2px">'+nextSub+'</div>');
        if(nextTopic)h.push('<div style="font-size:0.72rem;color:#64748b">'+nextTopic+'</div>');
        if(nextRes.length>0){
          h.push('<div style="display:flex;gap:0.3rem;margin-top:0.4rem;flex-wrap:wrap">');
          nextRes.forEach(r=>{
            const ti=typeInfo(r.type);
            h.push('<a href="'+r.url+'" target="_blank" class="btn-sm" style="background:'+ti.color+'22;color:'+ti.color+';text-decoration:none">'+ti.icon+' '+r.name+'</a>');
          });
          h.push('</div>');
        }
        h.push('</div>');
      }
      h.push('</div>');
    }
  }

  // ── TWO-COLUMN LAYOUT: Period list + Week grid side by side ────────────────
  {
    const viewDay=S.tmDay||realToday;
    const viewPeriods=tt[viewDay]||[];
    const isViewingToday=viewDay===realToday;

    // ── TWO-COLUMN LAYOUT: Period list + Week grid side by side ────────────────
    const gridsOpen=S.tmGridOpen!==false;
    const _wo=S.tmWeekOffset||0;
    const _sw=getSchoolWeekForOffset(_wo);
    // Grid header bar: day buttons + week selector + collapse toggle
    h.push('<div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:10px 10px 0 0;padding:0.3rem 0.6rem;display:flex;align-items:center;gap:0.25rem;overflow-x:auto;margin:0 1rem">');
    ["Monday","Tuesday","Wednesday","Thursday","Friday"].forEach(d=>{
      const isSel=viewDay===d;
      const isReal=realToday===d;
      const dc2=THAI_DAY_COLORS[d]||{bg:'#e2e8f0',text:'#1e3a5f',border:'#94a3b8'};
      const outline=isReal&&!isSel?'box-shadow:inset 0 0 0 2px '+dc2.border+';':'';
      h.push('<button onclick="S.tmDay=\''+(isSel&&S.tmDay?'null':d)+'\';render()" style="padding:0.25rem 0.5rem;border-radius:6px;border:none;cursor:pointer;font-family:\'Nunito\',sans-serif;font-weight:'+(isSel?800:600)+';font-size:0.8rem;background:'+(isSel?dc2.bg:'#fff')+';color:'+(isSel?dc2.text:isReal?dc2.text:'#9CA3AF')+';flex-shrink:0;'+outline+'">'+d.slice(0,3)+'</button>');
    });
    if(S.tmDay&&S.tmDay!=='null')h.push('<button onclick="S.tmDay=null;render()" style="padding:0.25rem 0.4rem;border-radius:6px;border:1px solid #f59e0b;cursor:pointer;font-family:\'Nunito\',sans-serif;font-weight:700;font-size:0.7rem;background:#fef9c3;color:#92400e;flex-shrink:0">Today</button>');
    h.push('<div style="margin-left:auto;display:flex;align-items:center;gap:0.2rem;flex-shrink:0">');
    h.push('<button onclick="S.tmWeekOffset='+(_wo-1)+';render()" style="width:24px;height:24px;border-radius:5px;border:1px solid #E5E7EB;background:#fff;cursor:pointer;font-size:0.95rem;line-height:1;font-weight:700;color:#374151;padding:0">&lsaquo;</button>');
    if(_sw){
      h.push('<div style="min-width:44px;text-align:center;padding:0.1rem 0.35rem;background:#fff;border-radius:5px;border:1px solid #E5E7EB"><div style="font-size:0.8rem;font-weight:900;color:var(--red);line-height:1.2">Wk '+_sw.week+'</div></div>');
    } else {
      h.push('<div style="min-width:44px;text-align:center;font-size:0.72rem;color:#9CA3AF">&mdash;</div>');
    }
    h.push('<button onclick="S.tmWeekOffset='+(_wo+1)+';render()" style="width:24px;height:24px;border-radius:5px;border:1px solid #E5E7EB;background:#fff;cursor:pointer;font-size:0.95rem;line-height:1;font-weight:700;color:#374151;padding:0">&rsaquo;</button>');
    if(_wo!==0)h.push('<button onclick="S.tmWeekOffset=0;render()" style="padding:0.2rem 0.4rem;border-radius:5px;border:1px solid #E5E7EB;background:#FEF2F2;cursor:pointer;font-size:0.7rem;font-weight:800;color:var(--red)">Now</button>');
    h.push('</div>');
    h.push('<button onclick="S.tmGridOpen=S.tmGridOpen===false?true:false;render()" style="padding:0.25rem 0.45rem;border-radius:5px;border:1px solid #E5E7EB;background:#fff;cursor:pointer;font-size:0.72rem;font-weight:700;color:#9CA3AF;flex-shrink:0;margin-left:0.15rem">'+(gridsOpen?'&#9650;':'&#9660;')+'</button>');
    h.push('</div>'); // end grid header bar
    if(gridsOpen){
    // Open two-column wrapper
    h.push('<div class="two-col" style="border:1px solid #E5E7EB;border-top:none;border-radius:0 0 10px 10px;overflow:hidden;margin:0 1rem 0.75rem;align-items:start">');

    // ── LEFT: Period list ────────────────────────────────────────────────────
    h.push('<div style="background:#fff;border-radius:12px;border:1px solid #E5E7EB;overflow:hidden">');
    // Card header
    h.push('<div style="background:#FEF2F2;border-bottom:1px solid #FECACA;padding:0.55rem 0.85rem;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:5">');
    h.push('<div style="font-weight:800;font-size:0.88rem;color:#B91C1C">'+viewDay+' &nbsp;·&nbsp; '+cls+'</div>');
    if(weekNum)h.push('<div style="font-size:0.68rem;color:#9CA3AF;font-weight:700">Wk '+weekNum+'</div>');
    h.push('</div>');
    // Period rows
    h.push('<div style="padding:0.5rem">');
    PERIODS.forEach((p,i)=>{
      const period=viewPeriods[i];
      if(period===undefined)return;
      if(period===null){
        const col=subColor('Integration');
        const isPast=isViewingToday&&timeToMins(p.end)<nowMins;
        h.push('<div class="period-row'+(isPast?' past-period':'')+
          '" style="opacity:'+(isPast?'0.4':'1')+';background:transparent;border:1px solid transparent;cursor:default">');
        h.push('<div class="period-label">'+p.label+'<div class="period-time-sm">'+p.start+'</div></div>');
        h.push('<div style="width:4px;background:'+col+';flex-shrink:0;align-self:stretch"></div>');
        h.push('<div style="flex:1;min-width:0;padding:0.6rem 0.7rem">');
        h.push('<div style="font-weight:800;font-size:1rem;color:'+col+';line-height:1.2">Integration / ประจำชั้น</div>');
        h.push('<div class="period-tchr">👤 Thai homeroom teacher</div>');
        h.push('</div>');
        h.push('</div>');
        return;
      }
      const col=subColor(period.sub);
      const topic=getWeekTopic(period.sub,weekNum,cls);
      const res=getResources(period.sub);
      const isActive=isViewingToday&&cp&&cp.type==='period'&&cp.idx===i;
      const isPast=isViewingToday&&timeToMins(p.end)<nowMins;
      const rowOpacity=isPast&&!isActive?'0.4':'1';
      const rowBg=isActive?col+'12':'transparent';
      const rowBorder=isActive?'1px solid '+col+'44':'1px solid transparent';
      h.push('<div class="period-row'+(isActive?' active-period':'')+(isPast&&!isActive?' past-period':'')+'" style="opacity:'+rowOpacity+';background:'+rowBg+';border:'+rowBorder+'" onclick="this.querySelector(\'.extra\').style.display=this.querySelector(\'.extra\').style.display===\'none\'?\'block\':\'none\'">');
      // Left: period label column
      h.push('<div class="period-label">'+p.label+'<div class="period-time-sm">'+p.start+'</div></div>');
      // Coloured left border strip
      h.push('<div style="width:4px;background:'+col+';flex-shrink:0;align-self:stretch"></div>');
      // Main content
      h.push('<div style="flex:1;min-width:0;padding:0.6rem 0.7rem">');
      h.push('<div style="font-weight:800;font-size:1rem;color:'+col+';line-height:1.2">'+period.sub+(isActive?' <span style="font-size:0.62rem;background:'+col+';color:#fff;border-radius:4px;padding:1px 6px;vertical-align:middle;margin-left:4px">NOW</span>':'')+'</div>');
      if(period.teacher)h.push('<div class="period-tchr">👤 '+period.teacher+'</div>');
      if(topic){const clsPdKey='cpd_'+cls+'_'+i+'_'+viewDay;if(typeof topic==='object')h.push(renderTopicDetail(topic,col,clsPdKey));else h.push('<div class="period-topic">📖 '+topic+'</div>');}
      if(res.length>0){
        h.push('<div class="extra" style="display:none;margin-top:0.5rem;padding-top:0.5rem;border-top:1px solid #F3F4F6">');
        res.forEach(r=>{const ti=typeInfo(r.type);h.push('<a href="'+r.url+'" target="_blank" class="btn-sm" style="display:inline-block;margin:2px;background:'+ti.color+'22;color:'+ti.color+';text-decoration:none">'+ti.icon+' '+r.name+'</a>');});
        h.push('</div>');
        h.push('<div style="font-size:0.65rem;color:#9CA3AF;margin-top:3px">'+res.length+' resource'+(res.length>1?'s':'')+' — tap to expand</div>');
      }
      h.push('</div>');
      h.push('</div>'); // end period-row
    });
    h.push('</div>'); // end padding
    h.push('</div>'); // end left col

    // ── RIGHT: Week grid ─────────────────────────────────────────────────────
    h.push('<div class="week-grid-collapse" style="background:#fff;border-radius:12px;border:1px solid #E5E7EB;overflow:hidden">');
    h.push('<div style="background:#fff;overflow:hidden">');
    h.push('<div style="overflow-x:auto;padding:0.5rem 0.6rem">');
      h.push('<table style="border-collapse:collapse;width:100%;font-size:0.82rem"><thead><tr>');
      h.push('<th style="padding:5px 8px;color:#9CA3AF;font-weight:700;text-align:left;font-size:0.75rem;white-space:nowrap">Period</th>');
      DAYS.forEach(d=>{
        const dc2=THAI_DAY_COLORS[d]||{bg:"#F3F4F6",text:"#374151",border:"#E5E7EB"};
        const isToday=d===today;
        h.push('<th style="padding:6px 10px;text-align:left;background:'+(isToday?dc2.bg:'#F9FAFB')+';color:'+(isToday?dc2.text:'#374151')+';font-weight:800;font-size:0.8rem;border-radius:6px 6px 0 0">'+d.slice(0,3)+'</th>');
      });
      h.push('</tr></thead><tbody>');
      PERIODS.forEach((p,i)=>{
        const rowBg=i%2===0?'#fff':'#FAFAFA';
        h.push('<tr style="background:'+rowBg+'">');
        h.push('<td style="padding:6px 8px;font-weight:700;color:#9CA3AF;font-size:0.78rem;white-space:nowrap;vertical-align:top;border-right:1px solid #F3F4F6">'+p.label+'<br><span style="font-size:0.68rem;font-weight:500;color:#D1D5DB">'+p.start+'</span></td>');
        DAYS.forEach(d=>{
          const period=(tt[d]||[])[i];
          const subj=period?period.sub:'—';
          const col=subColor(subj);
          const isCurrent=d===realToday&&cp&&cp.type==='period'&&cp.idx===i;
          const cellTopic=period?getWeekTopic(period.sub,weekNum,cls):null;
          const cellBg=isCurrent?col+'15':rowBg;
          const cellBorder=isCurrent?'1px solid '+col+'44':'none';
          h.push('<td style="padding:6px 10px;text-align:left;background:'+cellBg+';border-radius:6px;vertical-align:top;border:'+cellBorder+';min-width:90px">');
          if(period){
            h.push('<div class="week-cell-subj" style="color:'+col+'">'+subj+'</div>');
            if(period.teacher)h.push('<div class="week-cell-tchr">'+period.teacher+'</div>');
            const clsTopicLabel=getTopicLabel(cellTopic,period.sub==='Integration');
            if(clsTopicLabel)h.push('<div class="week-cell-topic" title="'+(typeof cellTopic==='object'?(cellTopic.vocab||''):'')+'" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100px">'+clsTopicLabel+'</div>');
          } else if(period===null){
            h.push('<div class="week-cell-subj" style="color:'+subColor('Integration')+'">Integration / ประจำชั้น</div>');
          } else {
            h.push('<div style="color:#E5E7EB;font-size:0.8rem">—</div>');
          }
          h.push('</td>');
        });
        h.push('</tr>');
      });
      h.push('</tbody></table></div>');
    h.push('</div>'); // end right col

    h.push('</div>'); // end two-column grid
    } // end if(gridsOpen)
  }

  h.push('</div>'); // end padded content wrapper
  // ── School Calendar — full width, outside padded wrapper
  renderCalendarCard(h);
  h.push('<div style="height:0.75rem"></div>'); // bottom spacing

  h.push('</div>'); // end scroll container
  return h.join('');
}


// ─── TEACHER TAB ────────────────────────────────────────────────────────────
function renderTeacherTab(teacher){
  // Full timetable dashboard filtered to this teacher's lessons
  // Mirrors renderTimetable but cls is replaced with teacher-filtered logic

  const WDAYS=["Monday","Tuesday","Wednesday","Thursday","Friday"];
  const realToday=todayDayName();
  const today=S.tmDay&&S.tmDay!=="null"?S.tmDay:realToday;
  const cp=getCurrentPeriod();
  const nowMins=timeToMins(nowTimeStr());
  const isWeekday=WDAYS.includes(realToday);
  const weekOffset=S.tmWeekOffset||0;
  const sw=getSchoolWeekForOffset(weekOffset);
  const weekNum=sw?sw.week:null;
  const wo=weekOffset;

  // Use K1 periods as the base display (most teachers span multiple grades —
  // we show the combined unique period slots sorted by time)
  const periodIndex={};
  teacher.classes.forEach(cls=>{
    getPeriodsForCls(cls).forEach(p=>{
      const key=p.label+'|'+p.start;
      if(!periodIndex[key])periodIndex[key]={...p};
    });
  });
  // Also include periods from Help classes (may introduce periods not in teacher.classes)
  const teacherHelp=TIMETABLE_HELP[teacher.full]||{};
  Object.values(teacherHelp).forEach(slots=>slots.forEach(slot=>{
    getPeriodsForCls(slot.cls).forEach(p=>{
      const key=p.label+'|'+p.start;
      if(!periodIndex[key])periodIndex[key]={...p};
    });
  }));
  const TPERIODS=Object.values(periodIndex).sort((a,b)=>timeToMins(a.start)-timeToMins(b.start));
  const TBREAKS=[
    {label:"🥛 Milk & Break",start:"09:50",end:"10:10"},
    {label:"🍱 Lunch & Rest",start:"12:10",end:"14:00"}
  ];

  // Build today's lesson list for this teacher across all their classes
  function getTodayLessons(day){
    const lessons=[];
    teacher.classes.forEach(cls=>{
      const tt=getTimetableForCls(cls)[cls]||{};
      const periods=getPeriodsForCls(cls);
      (tt[day]||[]).forEach((period,i)=>{
        if(period&&period.teacher===teacher.full){
          lessons.push({p:periods[i],cls,sub:period.sub,idx:i,
            topic:getWeekTopic(period.sub,weekNum,cls)});
        }
      });
    });
    // Help lessons — teacher supports another class for specific periods
    const helpSlots=(TIMETABLE_HELP[teacher.full]||{})[day]||[];
    helpSlots.forEach(slot=>{
      const periods=getPeriodsForCls(slot.cls);
      const p=periods.find(pp=>pp.label===slot.period);
      if(p)lessons.push({p,cls:slot.cls,sub:slot.sub,idx:0,topic:null,help:true});
    });
    return lessons.sort((a,b)=>timeToMins(a.p.start)-timeToMins(b.p.start));
  }

  const todayLessons=getTodayLessons(today);
  // Find active and next lesson
  let activeLesson=null,nextLesson=null;
  if(isWeekday&&today===realToday){
    activeLesson=todayLessons.find(l=>timeToMins(l.p.start)<=nowMins&&nowMins<timeToMins(l.p.end))||null;
    nextLesson=todayLessons.find(l=>timeToMins(l.p.start)>nowMins)||null;
  }

  const schoolStart=timeToMins("07:00");
  const schoolEnd=timeToMins("15:30");
  const DAY_TOTAL=schoolEnd-schoolStart;
  const isBeforeSchool=nowMins<timeToMins("08:30")&&isWeekday;
  const isAfterSchool=nowMins>=schoolEnd||!isWeekday;

  const h=[];
  h.push('<div style="padding:0.75rem 0;display:flex;flex-direction:column;gap:0.65rem">');

  // ── DAY PROGRESS BAR ─────────────────────────────────────────────────────
  (()=>{
    const dc=THAI_DAY_COLORS[realToday]||{bg:"#e2e8f0",text:"#1e3a5f",light:"#f8fafc",border:"#94a3b8"};
    const DAY_START=schoolStart;
    const nowM=nowMins;
    const nowPct=Math.min(100,Math.max(0,((nowM-DAY_START)/DAY_TOTAL)*100));
    const segments=[];
    segments.push({label:"Duty",start:"07:00",end:"08:25",color:"#B91C1C",type:"duty"});
    segments.push({label:"",start:"08:25",end:"08:30",color:"#e2e8f0",type:"gap"});

    // Build all slots from all teacher classes, merged by time
    const slotMap={};
    TPERIODS.forEach((p,i)=>{
      const key=p.start;
      if(!slotMap[key]){
        // Find what this teacher teaches at this slot today
        const lesson=todayLessons.find(l=>l.p.start===p.start&&l.p.label===p.label);
        const subj=lesson?lesson.sub+' ('+lesson.cls+')':'—';
        const col=lesson?subColor(lesson.sub):"#e2e8f0";
        slotMap[key]={label:p.label+": "+subj,start:p.start,end:p.end,color:col,type:"period",subj:lesson?lesson.sub:null};
      }
    });
    TBREAKS.forEach(b=>segments.push({label:b.label,start:b.start,end:b.end,color:"#fef9c3",border:"#f59e0b",type:"break"}));
    Object.values(slotMap).sort((a,b)=>timeToMins(a.start)-timeToMins(b.start)).forEach(s=>segments.push(s));
    segments.sort((a,b)=>timeToMins(a.start)-timeToMins(b.start));
    segments.push({label:"",start:"15:30",end:"15:30",color:"#dcfce7",type:"end"});

    h.push('<div style="background:'+dc.light+';border-radius:14px;padding:0.75rem 0.9rem;box-shadow:0 1px 6px rgba(0,0,0,0.07);border-top:4px solid '+dc.border+';margin:0 1rem">');
    h.push('<div style="font-size:0.68rem;font-weight:700;color:'+dc.text+';margin-bottom:0.5rem;display:flex;justify-content:space-between"><span>07:00</span><span>'+realToday+' — '+teacher.full+'</span><span>15:30</span></div>');
    h.push('<div style="position:relative;height:36px;border-radius:10px;overflow:hidden;display:flex;border:1px solid #e2e8f0">');
    segments.forEach(seg=>{
      if(seg.start===seg.end)return;
      const segStart=timeToMins(seg.start);
      const segEnd=timeToMins(seg.end);
      const w=((segEnd-segStart)/DAY_TOTAL*100).toFixed(2);
      const isCurrent=nowM>=segStart&&nowM<segEnd;
      const isPast=nowM>=segEnd;
      const bg=seg.type==="break"?"#fef9c3":(seg.subj?seg.color:"#e2e8f0");
      const opacity=isPast?"0.35":"1";
      const border=isCurrent?"inset 0 0 0 2px rgba(255,255,255,0.9)":"none";
      h.push('<div style="width:'+w+'%;background:'+bg+';flex-shrink:0;position:relative;opacity:'+opacity+';box-shadow:'+border+';overflow:hidden;display:flex;align-items:center;justify-content:center" title="'+seg.label+'">');
      if(isCurrent){
        const subPct=((nowM-segStart)/(segEnd-segStart)*100).toFixed(1);
        h.push('<div style="position:absolute;inset:0;background:rgba(255,255,255,0.25)"></div>');
        h.push('<div style="position:absolute;top:0;left:0;height:100%;width:'+subPct+'%;background:rgba(0,0,0,0.12)"></div>');
      }
      const widthPct=parseFloat(w);
      if(widthPct>5&&seg.type==="period"&&seg.subj){
        const parts=seg.label.split(": ");
        h.push('<div style="position:relative;font-size:0.52rem;font-weight:800;color:#fff;text-align:center;padding:0 2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;line-height:1.2">');
        h.push('<div>'+parts[0]+'</div>');
        if(parts[1]&&widthPct>10)h.push('<div style="font-size:0.48rem;opacity:0.9">'+parts[1].slice(0,12)+'</div>');
        h.push('</div>');
      } else if(widthPct>5&&seg.type==="duty"){
        h.push('<div style="position:relative;font-size:0.52rem;font-weight:800;color:#fff">Duty</div>');
      } else if(widthPct>8&&seg.type==="break"){
        h.push('<div style="position:relative;font-size:0.52rem;font-weight:800;color:#92400e">Break</div>');
      }
      h.push('</div>');
    });
    h.push('</div>');
    h.push('<div style="position:relative;height:8px;margin-top:2px">');
    h.push('<div style="position:absolute;left:'+nowPct.toFixed(2)+'%;transform:translateX(-50%);width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:7px solid #ef4444"></div>');
    h.push('</div>');
    h.push('<div style="position:relative;height:14px;margin-top:1px">');
    TPERIODS.forEach(p=>{
      const pct=((timeToMins(p.start)-DAY_START)/DAY_TOTAL*100).toFixed(2);
      h.push('<div style="position:absolute;left:'+pct+'%;font-size:0.52rem;color:#94a3b8;transform:translateX(-50%);white-space:nowrap">'+p.start+'</div>');
    });
    h.push('</div>');
    h.push('</div>');
  })();

  // ── ACTIVE LESSON FOCUS ───────────────────────────────────────────────────
  if(activeLesson&&today===realToday){
    const col=subColor(activeLesson.sub);
    const pct=Math.min(100,Math.round((nowMins-timeToMins(activeLesson.p.start))/(timeToMins(activeLesson.p.end)-timeToMins(activeLesson.p.start))*100));
    const minsLeft=timeToMins(activeLesson.p.end)-nowMins;
    h.push('<div style="background:#fff;border-radius:12px;padding:1rem;box-shadow:0 2px 12px rgba(185,28,28,0.12);border-top:4px solid '+col+';margin:0 1rem">');
    h.push('<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:0.5rem;margin-bottom:0.5rem">');
    h.push('<div>');
    h.push('<div style="font-size:0.68rem;font-weight:700;color:'+col+';text-transform:uppercase;letter-spacing:0.5px">NOW — '+activeLesson.p.label+' &nbsp;·&nbsp; '+activeLesson.cls+'</div>');
    h.push('<div style="font-weight:800;font-size:1.3rem;color:#111827">'+activeLesson.sub+'</div>');
    if(activeLesson.topic){const _tl=typeof activeLesson.topic==='object'?getTopicLabel(activeLesson.topic,activeLesson.sub==='Integration'):activeLesson.topic;if(_tl)h.push('<div style="font-size:0.78rem;color:#475569;margin-top:0.2rem">📖 '+_tl+'</div>');}
    h.push('</div>');
    h.push('<div style="text-align:right;flex-shrink:0"><div style="font-size:1.1rem;font-weight:800;color:'+col+'">'+minsLeft+'m</div><div style="font-size:0.62rem;color:#94a3b8">remaining</div></div>');
    h.push('</div>');
    h.push('<div style="background:#e2e8f0;border-radius:4px;height:6px"><div style="background:'+col+';border-radius:4px;height:6px;width:'+pct+'%;transition:width 1s"></div></div>');
    // Resources for active lesson
    const activeRes=getTeacherResources(activeLesson.cls,activeLesson.sub);
    if(activeRes.length>0){
      h.push('<button onclick="S.nowResOpen=!S.nowResOpen;render()" style="width:100%;display:flex;align-items:center;justify-content:space-between;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:0.4rem 0.65rem;cursor:pointer;font-family:\'Nunito\',sans-serif;margin-top:0.6rem">');
      h.push('<span style="font-size:0.75rem;font-weight:700;color:#64748b">&#128206; '+activeRes.length+' Resource'+(activeRes.length>1?'s':'')+' available</span>');
      h.push('<span style="font-size:0.7rem;color:#94a3b8">'+(S.nowResOpen?'&#9650; Hide':'&#9660; Show')+'</span>');
      h.push('</button>');
      if(S.nowResOpen){
        h.push('<div style="display:flex;flex-direction:column;gap:0.3rem;margin-top:0.35rem">');
        activeRes.forEach(r=>{
          const ti=typeInfo(r.type);
          h.push('<div style="display:flex;align-items:center;gap:0.5rem;background:#f8fafc;border-radius:8px;padding:0.45rem 0.6rem;border-left:3px solid '+ti.color+'">');
          h.push('<span>'+ti.icon+'</span>');
          h.push('<div style="flex:1;min-width:0"><div style="font-weight:700;font-size:0.78rem;color:#111827;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+r.name+'</div>');
          if(r.note)h.push('<div style="font-size:0.65rem;color:#94a3b8">'+r.note+'</div>');
          h.push('</div>');
          h.push('<a href="'+r.url+'" target="_blank" class="btn-sm" style="background:'+ti.color+'22;color:'+ti.color+';text-decoration:none;flex-shrink:0">Open</a>');
          h.push('</div>');
        });
        h.push('</div>');
      }
    }
    h.push('</div>');
  }

  // ── NEXT LESSON ───────────────────────────────────────────────────────────
  if(nextLesson&&!activeLesson&&today===realToday&&!isAfterSchool){
    const col=subColor(nextLesson.sub);
    const minsUntil=timeToMins(nextLesson.p.start)-nowMins;
    h.push('<div style="background:#fff;border-radius:12px;padding:0.9rem;box-shadow:0 1px 4px rgba(0,0,0,0.06);border:1px solid #E5E7EB;border-left:4px solid '+col+'">');
    h.push('<div style="font-size:0.65rem;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.2rem">NEXT · in '+minsUntil+'m · '+nextLesson.cls+'</div>');
    h.push('<div style="font-weight:800;font-size:1.1rem;color:#111827">'+nextLesson.sub+'</div>');
    if(nextLesson.topic){const _tl=typeof nextLesson.topic==='object'?getTopicLabel(nextLesson.topic,nextLesson.sub==='Integration'):nextLesson.topic;if(_tl)h.push('<div style="font-size:0.72rem;color:#64748b;margin-top:2px;font-style:italic">'+_tl+'</div>');}
    h.push('</div>');
  }

  // ── TWO-COL: Period list + Week grid ─────────────────────────────────────
  const teacherGridsOpen=S.tmGridOpen!==false;
  const _tchrWo=S.tmWeekOffset||0;
  const _tchrSw=getSchoolWeekForOffset(_tchrWo);
  h.push('<div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:10px 10px 0 0;padding:0.3rem 0.6rem;display:flex;align-items:center;gap:0.25rem;overflow-x:auto;margin:0 1rem">');
  h.push('<div style="font-weight:800;font-size:0.8rem;color:#374151;white-space:nowrap;flex-shrink:0">'+teacher.full+'</div>');
  h.push('<div style="width:1px;height:16px;background:#E5E7EB;flex-shrink:0"></div>');
  ['Monday','Tuesday','Wednesday','Thursday','Friday'].forEach(d=>{
    const isSel=today===d;
    const isReal=realToday===d;
    const dc2=THAI_DAY_COLORS[d]||{bg:'#e2e8f0',text:'#1e3a5f',border:'#94a3b8'};
    const outline=isReal&&!isSel?'box-shadow:inset 0 0 0 2px '+dc2.border+';':'';
    h.push('<button onclick="S.tmDay=\''+(isSel&&S.tmDay?'null':d)+'\';render()" style="padding:0.25rem 0.5rem;border-radius:6px;border:none;cursor:pointer;font-family:\'Nunito\',sans-serif;font-weight:'+(isSel?800:600)+';font-size:0.8rem;background:'+(isSel?dc2.bg:'#fff')+';color:'+(isSel?dc2.text:isReal?dc2.text:'#9CA3AF')+';flex-shrink:0;'+outline+'">'+d.slice(0,3)+'</button>');
  });
  if(S.tmDay&&S.tmDay!=='null')h.push('<button onclick="S.tmDay=null;render()" style="padding:0.25rem 0.4rem;border-radius:6px;border:1px solid #f59e0b;cursor:pointer;font-family:\'Nunito\',sans-serif;font-weight:700;font-size:0.7rem;background:#fef9c3;color:#92400e;flex-shrink:0">Today</button>');
  h.push('<div style="margin-left:auto;display:flex;align-items:center;gap:0.2rem;flex-shrink:0">');
  h.push('<button onclick="S.tmWeekOffset='+(_tchrWo-1)+';render()" style="width:24px;height:24px;border-radius:5px;border:1px solid #E5E7EB;background:#fff;cursor:pointer;font-size:0.95rem;line-height:1;font-weight:700;color:#374151;padding:0">&lsaquo;</button>');
  if(_tchrSw){
    h.push('<div style="min-width:44px;text-align:center;padding:0.1rem 0.35rem;background:#fff;border-radius:5px;border:1px solid #E5E7EB"><div style="font-size:0.8rem;font-weight:900;color:var(--red);line-height:1.2">Wk '+_tchrSw.week+'</div></div>');
  } else {
    h.push('<div style="min-width:44px;text-align:center;font-size:0.72rem;color:#9CA3AF">&mdash;</div>');
  }
  h.push('<button onclick="S.tmWeekOffset='+(_tchrWo+1)+';render()" style="width:24px;height:24px;border-radius:5px;border:1px solid #E5E7EB;background:#fff;cursor:pointer;font-size:0.95rem;line-height:1;font-weight:700;color:#374151;padding:0">&rsaquo;</button>');
  if(_tchrWo!==0)h.push('<button onclick="S.tmWeekOffset=0;render()" style="padding:0.2rem 0.4rem;border-radius:5px;border:1px solid #E5E7EB;background:#FEF2F2;cursor:pointer;font-size:0.7rem;font-weight:800;color:var(--red)">Now</button>');
  h.push('</div>');
  h.push('<button onclick="S.tmGridOpen=S.tmGridOpen===false?true:false;render()" style="padding:0.25rem 0.45rem;border-radius:5px;border:1px solid #E5E7EB;background:#fff;cursor:pointer;font-size:0.72rem;font-weight:700;color:#9CA3AF;flex-shrink:0;margin-left:0.15rem">'+(teacherGridsOpen?'&#9650;':'&#9660;')+'</button>');
  h.push('</div>'); // end teacher grid header bar
  if(teacherGridsOpen){
  h.push('<div class="two-col" style="border:1px solid #E5E7EB;border-top:none;border-radius:0 0 10px 10px;overflow:hidden;margin:0 1rem 0.75rem;align-items:start">');

  // LEFT: Today's period list
  h.push('<div style="background:#fff;border-radius:12px;border:1px solid #E5E7EB;overflow:hidden">');
  h.push('<div style="background:#FEF2F2;border-bottom:1px solid #FECACA;padding:0.55rem 0.85rem;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:5">');
  h.push('<div style="font-weight:800;font-size:0.88rem;color:var(--red)">'+today+' &nbsp;·&nbsp; '+teacher.full+'</div>');
  if(weekNum)h.push('<div style="font-size:0.68rem;color:#9CA3AF;font-weight:700">Wk '+weekNum+'</div>');
  h.push('</div>');
  h.push('<div style="padding:0.5rem">');
  // Fixed P1..MAX_PERIODS rows — always show all periods, free slots for gaps
  const MAX_PERIODS=teacher.classes.some(c=>c==='K3A'||c==='K3B'||c.startsWith('K3/'))?7:6;
  // Build per-day lesson maps keyed by period LABEL
  function getDayLessonMap(day){
    const map={};
    getTodayLessons(day).forEach(l=>{
      const lbl=l.p.label;
      if(!map[lbl]||(map[lbl].help&&!l.help))map[lbl]=l;
    });
    return map;
  }
  // Per-day period time lookup: for a given period label on a given day,
  // return the start/end from the actual lesson, or fall back to dominant schedule
  function getDayPeriodTime(day,label){
    const lessons=getTodayLessons(day);
    const match=lessons.find(l=>l.p.label===label);
    if(match)return{start:match.p.start,end:match.p.end};
    // Fallback: dominant level that day
    const hasK3=lessons.some(l=>l.cls==='K3A'||l.cls==='K3B'||l.cls.startsWith('K3/'));
    const hasK2=lessons.some(l=>l.cls==='K2A'||l.cls==='K2B'||l.cls.startsWith('K2/'));
    const fb=hasK3?PERIODS_K3:hasK2?PERIODS_K2:PERIODS_K1;
    const slot=fb.find(p=>p.label===label)||fb[parseInt(label.slice(1))-1]||fb[fb.length-1];
    return slot?{start:slot.start,end:slot.end}:{start:'—',end:'—'};
  }
  // Render P1..MAX_PERIODS — lesson rows filled, free slots shown faintly
  // Helper: get resources for a lesson based on its class and subject
  function getTeacherResources(lessonCls,lessonSub){
    if(!lessonSub)return[];
    const isMLP=lessonCls==='K1A'||lessonCls==='K1B'||lessonCls==='K2A'||lessonCls==='K2B'||lessonCls==='K3A'||lessonCls==='K3B'||lessonCls==='N1'||lessonCls==='N2';
    const resProg=isMLP?'MLP':'IEP';
    const resLevel=lessonCls.startsWith('K3')?'K3':lessonCls.startsWith('K2')?'K2':'K1';
    return(DB.resources||[]).filter(r=>
      r.subject&&lessonSub.includes(r.subject)&&
      (r.prog||'MLP')===resProg&&
      (r.level||'K1')===resLevel
    );
  }
  const todayLessonMap=getDayLessonMap(today);
  for(let pi=0;pi<MAX_PERIODS;pi++){
    const label='P'+(pi+1);
    const lesson=todayLessonMap[label]||null;
    const slot=getDayPeriodTime(today,label);
    const isNow=today===realToday&&slot.start!=='—'&&timeToMins(slot.start)<=nowMins&&nowMins<timeToMins(slot.end);
    const isPast=today===realToday&&slot.end!=='—'&&timeToMins(slot.end)<nowMins;
    const col=lesson?subColor(lesson.sub):'#e2e8f0';
    h.push('<div style="display:flex;align-items:stretch;border-radius:9px;margin-bottom:5px;border:1px solid '+(isNow?col+'44':'#F3F4F6')+';overflow:hidden;opacity:'+(isPast&&!isNow?'0.42':'1')+';background:'+(isNow?col+'0D':'#fff')+'">');
    // Period label + time
    h.push('<div style="width:3rem;flex-shrink:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0.5rem 0;background:#F9FAFB;border-right:1px solid #F3F4F6">');
    h.push('<div style="font-weight:800;font-size:0.72rem;color:'+(lesson?col:'#D1D5DB')+'">'+label+'</div>');
    h.push('<div style="font-size:0.6rem;color:#9CA3AF;margin-top:1px;white-space:nowrap">'+slot.start+'</div>');
    h.push('</div>');
    // Colour bar
    h.push('<div style="width:4px;background:'+col+';flex-shrink:0"></div>');
    // Content
    h.push('<div style="flex:1;padding:0.6rem 0.7rem;min-width:0">');
    if(lesson){
      h.push('<div style="display:flex;align-items:center;gap:0.35rem;flex-wrap:wrap">');
      h.push('<div style="font-weight:800;font-size:1.05rem;color:'+col+'">'+lesson.sub+'</div>');
      if(isNow)h.push('<span style="font-size:0.6rem;background:'+col+';color:#fff;border-radius:4px;padding:1px 6px;font-weight:700">NOW</span>');
      h.push('<span style="font-size:0.72rem;font-weight:700;background:'+teacher.color+'18;color:'+teacher.color+';border-radius:4px;padding:1px 5px">'+lesson.cls+'</span>'+(lesson.help?' <span style="font-size:0.65rem;background:#f1f5f9;color:#6B7280;border-radius:3px;padding:1px 5px;font-weight:700">help</span>':''));
      h.push('</div>');
      const tdKey='td_'+lesson.cls+'_'+label+'_'+today;
      if(lesson.topic)h.push(renderTopicDetail(lesson.topic,col,tdKey));
      // Resources — same expand pattern as class view
      const lessonRes=getTeacherResources(lesson.cls,lesson.sub);
      if(lessonRes.length>0){
        const resKey='tres_'+lesson.cls+'_'+label;
        const resOpen=S.openRes===resKey;
        h.push('<button onclick="S.openRes=S.openRes===\''+resKey+'\'?null:\''+resKey+'\';render()" style="width:100%;display:flex;align-items:center;justify-content:space-between;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:0.3rem 0.55rem;cursor:pointer;font-family:\'Nunito\',sans-serif;margin-top:0.35rem">');
        h.push('<span style="font-size:0.72rem;font-weight:700;color:#64748b">&#128206; '+lessonRes.length+' Resource'+(lessonRes.length>1?'s':'')+' available</span>');
        h.push('<span style="font-size:0.65rem;color:#94a3b8">'+(resOpen?'&#9650; Hide':'&#9660; Show')+'</span>');
        h.push('</button>');
        if(resOpen){
          h.push('<div style="display:flex;flex-direction:column;gap:0.25rem;margin-top:0.3rem">');
          lessonRes.forEach(r=>{
            const ti=typeInfo(r.type);
            h.push('<div style="display:flex;align-items:center;gap:0.4rem;background:#f8fafc;border-radius:6px;padding:0.35rem 0.5rem;border-left:3px solid '+ti.color+'">');
            h.push('<span style="font-size:0.85rem">'+ti.icon+'</span>');
            h.push('<div style="flex:1;min-width:0"><div style="font-weight:700;font-size:0.75rem;color:#111827;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+r.name+'</div></div>');
            h.push('<a href="'+r.url+'" target="_blank" class="btn-sm" style="background:'+ti.color+'22;color:'+ti.color+';text-decoration:none;flex-shrink:0">Open</a>');
            h.push('</div>');
          });
          h.push('</div>');
        }
      }
    } else {
      h.push('<div style="font-size:0.82rem;color:#D1D5DB;font-style:italic">Free</div>');
    }
    h.push('</div>');
    // End time
    h.push('<div style="font-size:0.6rem;color:#9CA3AF;padding:0 0.5rem;display:flex;align-items:center;flex-shrink:0;white-space:nowrap">'+slot.start+'–'+slot.end+'</div>');
    h.push('</div>');
  }
  h.push('</div></div>');
  // RIGHT: Week grid (uses MAX_PERIODS, getDayLessonMap, getDayPeriodTime defined above)
  h.push('<div style="background:#fff;border-radius:12px;border:1px solid #E5E7EB;overflow:hidden">');
  h.push('<div style="background:#FEF2F2;border-bottom:1px solid #FECACA;padding:0.45rem 0.85rem;display:flex;align-items:center;justify-content:space-between">');
  h.push('<div style="font-weight:800;font-size:0.88rem;color:var(--red)">&#128197; Week Grid'+(weekNum?' &middot; Wk '+weekNum:'')+'</div>');
  h.push('</div>');
  if(teacherGridsOpen){
    h.push('<div style="overflow-x:auto;padding:0.5rem 0.65rem">');
    h.push('<table style="border-collapse:collapse;width:100%;font-size:0.82rem"><thead><tr>');
    h.push('<th style="padding:5px 8px;color:#9CA3AF;font-weight:700;text-align:left;font-size:0.72rem;white-space:nowrap">Period</th>');
    WDAYS.forEach(d=>{
      const dc=THAI_DAY_COLORS[d]||{bg:"#F9FAFB",text:"#374151"};
      const isToday=d===realToday;
      const cnt=getTodayLessons(d).length;
      h.push('<th style="padding:5px 10px;text-align:left;background:'+(isToday?dc.bg:'#F9FAFB')+';color:'+(isToday?dc.text:'#374151')+';font-weight:800;border-radius:4px 4px 0 0;min-width:90px">'+d.slice(0,3)+(cnt?' <span style="font-size:0.62rem;font-weight:600;opacity:0.7">('+cnt+')</span>':'')+'</th>');
    });
    h.push('</tr></thead><tbody>');
    for(let pi=0;pi<MAX_PERIODS;pi++){
      const label='P'+(pi+1);
      // Use today's time for the period header; if no lesson today use first day that has one
      const headerTime=getDayPeriodTime(today,label);
      h.push('<tr style="background:'+(pi%2===0?'#fff':'#FAFAFA')+'">');
      h.push('<td style="padding:5px 8px;font-weight:700;color:#9CA3AF;font-size:0.78rem;white-space:nowrap;border-right:1px solid #F3F4F6;vertical-align:top">'+label+'<br><span style="font-size:0.6rem;font-weight:500;color:#D1D5DB">'+headerTime.start+'</span></td>');
      WDAYS.forEach(d=>{
        const dayMap=getDayLessonMap(d);
        const lesson=dayMap[label]||null;
        const dayTime=getDayPeriodTime(d,label);
        const isNow=d===realToday&&dayTime.start!=='—'&&timeToMins(dayTime.start)<=nowMins&&nowMins<timeToMins(dayTime.end);
        if(lesson){
          const col=subColor(lesson.sub);
          const showTime=dayTime.start!==headerTime.start&&dayTime.start!=='—';
          h.push('<td style="padding:5px 8px;vertical-align:top;border-radius:5px;background:'+(isNow?col+'12':'transparent')+';border:1px solid '+(isNow?col+'44':'transparent')+';min-width:90px">');
          h.push('<div style="font-weight:800;font-size:0.88rem;color:'+col+'">'+lesson.sub+'</div>');
          h.push('<div style="font-size:0.75rem;font-weight:700;color:'+(lesson.help?'#6B7280':teacher.color)+';margin-top:1px">'+lesson.cls+(lesson.help?' <span style="font-size:0.62rem;background:#f1f5f9;color:#6B7280;border-radius:3px;padding:0 3px">help</span>':'')+'</div>');
          if(showTime)h.push('<div style="font-size:0.58rem;color:#94a3b8;margin-top:1px">'+dayTime.start+'</div>');
          const wgTopicLabel=getTopicLabel(lesson.topic,lesson.sub==='Integration');
          if(wgTopicLabel)h.push('<div style="font-size:0.72rem;color:#6B7280;font-style:italic;margin-top:1px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:120px" title="'+wgTopicLabel+'">'+wgTopicLabel+'</div>');
          h.push('</td>');
        } else {
          h.push('<td style="padding:5px 8px;min-width:90px"><div style="color:#E5E7EB;font-size:0.78rem">—</div></td>');
        }
      });
      h.push('</tr>');
    }
    h.push('</tbody></table></div>');
  }
  h.push('</div>');

  h.push('</div>'); // end two-col
  } // end if(teacherGridsOpen)

  h.push('</div>'); // end padded content wrapper
  // ── School Calendar — full width, outside padded wrapper
  renderCalendarCard(h);
  h.push('<div style="height:0.75rem"></div>'); // bottom spacing

  h.push('</div>'); // end outer scroll container
  return h.join('');
}


function renderPopup(){
  if(!S.popup)return"";
  if(S.popup.type==="period")return renderPeriodPopup();
  if(S.popup.type==="resourcePreview")return renderResourcePreviewPopup();
  if(S.popup.type==="dutyRota")return renderDutyRotaModal();
  return"";
}

function renderDutyRotaModal(){
  const sw=getSchoolWeekForOffset(S.tmWeekOffset||0);
  const weekNum=sw?sw.week:null;
  const rota=getDutyRota(weekNum);
  const isGaryOnDuty=weekNum&&GARY_DUTY_WEEKS.has(weekNum);
  const today=todayDayName();
  const todayLateDuty=LATE_DUTY_BY_DAY[today]||[];
  const h=[];
  h.push('<div class="modal-bg" onclick="if(event.target===this){S.popup=null;render()}">');
  h.push('<div class="modal-box" style="max-width:480px">');
  h.push('<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem">');
  h.push('<div style="font-weight:900;font-size:1.05rem;color:#111827">&#128205; Morning Duty Rota</div>');
  h.push('<button onclick="S.popup=null;render()" style="padding:0.3rem 0.65rem;border-radius:8px;border:1px solid #e5e7eb;background:#f9fafb;cursor:pointer;font-size:0.85rem;font-weight:700;color:#6b7280">&#10005;</button>');
  h.push('</div>');
  if(weekNum&&rota){
    h.push('<div style="background:'+(isGaryOnDuty?'#FEF2F2':'#F9FAFB')+';border-radius:8px;padding:0.5rem 0.75rem;margin-bottom:0.75rem;border:1px solid '+(isGaryOnDuty?'#FECACA':'#E5E7EB')+'">');
    h.push('<div style="font-weight:800;font-size:0.88rem;color:'+(isGaryOnDuty?'var(--red)':'#374151')+'">Wk '+weekNum+' &nbsp;&middot;&nbsp; Rota '+rota.rota+(isGaryOnDuty?' &nbsp;&#128308; Gary on duty':'')+'</div>');
    h.push('</div>');
  }
  if(rota){
    h.push('<div style="font-size:0.72rem;font-weight:800;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.4rem">07:00&ndash;07:55 &nbsp;Morning Positions</div>');
    h.push('<div style="display:flex;flex-direction:column;gap:0.3rem;margin-bottom:0.75rem">');
    rota.positions.forEach(p=>{
      const isGaryPos=p.staff.some(s=>s.includes('Gary'));
      h.push('<div style="display:flex;align-items:center;gap:0.6rem;padding:0.35rem 0.6rem;border-radius:8px;background:'+(isGaryPos?'#FEF2F2':'#F9FAFB')+';border:1px solid '+(isGaryPos?'#FECACA':'#E5E7EB')+'">');
      h.push('<div style="font-size:0.78rem;font-weight:700;color:#6B7280;min-width:120px">'+p.pos+'</div>');
      h.push('<div style="font-size:0.82rem;font-weight:'+(isGaryPos?800:600)+';color:'+(isGaryPos?'var(--red)':'#374151')+'">'+p.staff.join(', ')+'</div>');
      h.push('</div>');
    });
    h.push('</div>');
    h.push('<div style="font-size:0.72rem;font-weight:800;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.4rem">07:55&ndash;08:25 &nbsp;Gate Duty</div>');
    h.push('<div style="padding:0.35rem 0.6rem;border-radius:8px;background:#F9FAFB;border:1px solid #E5E7EB;margin-bottom:0.75rem">');
    h.push('<div style="font-size:0.78rem;font-weight:700;color:#6B7280">'+rota.lateduty.pos+'</div>');
    h.push('<div style="font-size:0.82rem;font-weight:600;color:#374151">'+rota.lateduty.staff.join(', ')+'</div>');
    h.push('</div>');
    if(todayLateDuty.length>0){
      h.push('<div style="font-size:0.72rem;font-weight:800;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.4rem">Today ('+today+')</div>');
      h.push('<div style="padding:0.35rem 0.6rem;border-radius:8px;background:#F9FAFB;border:1px solid #E5E7EB;margin-bottom:0.75rem">');
      h.push('<div style="font-size:0.82rem;font-weight:600;color:#374151">'+todayLateDuty.join(', ')+'</div>');
      h.push('</div>');
    }
  } else {
    h.push('<div style="color:#9CA3AF;font-style:italic;font-size:0.85rem;padding:0.5rem 0">No rota data for this week.</div>');
  }
  h.push('<div style="font-size:0.72rem;font-weight:800;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.4rem">Rota Schedule</div>');
  h.push('<div style="display:flex;gap:0.4rem;flex-wrap:wrap">');
  MORNING_DUTY_ROTA.forEach(r=>{
    const isCurrent=weekNum&&r.weeks.includes(weekNum);
    h.push('<div style="padding:0.3rem 0.6rem;border-radius:8px;background:'+(isCurrent?'#FEF2F2':'#F9FAFB')+';border:1px solid '+(isCurrent?'#FECACA':'#E5E7EB')+'">');
    h.push('<div style="font-size:0.75rem;font-weight:'+(isCurrent?800:600)+';color:'+(isCurrent?'var(--red)':'#6B7280')+'">Rota '+r.rota+(r.rota===3?' &#128308;':'')+'</div>');
    h.push('<div style="font-size:0.65rem;color:#9CA3AF">Wks '+r.weeks.join(', ')+'</div>');
    h.push('</div>');
  });
  h.push('</div>');
  h.push('</div></div>');
  return h.join('');
}

function renderResourcePreviewPopup(){
  const r=S.popup.resource;
  return`<div class="modal-bg" onclick="if(event.target===this){S.popup=null;render()}">
    <div class="modal-box" style="max-width:700px;height:80dvh;display:flex;flex-direction:column;padding:0;overflow:hidden">
      <div style="display:flex;align-items:center;gap:0.6rem;padding:0.8rem 1rem;background:#f8fafc;border-bottom:1px solid #e2e8f0;flex-shrink:0">
        <div style="font-weight:800;color:#111827;font-size:0.9rem">${r.name}</div>
        <a href="${r.url}" target="_blank" class="btn-sm" style="margin-left:auto;background:#FEF2F2;color:#B91C1C;text-decoration:none">🔗 Open full</a>
        <button onclick="S.popup=null;render()" style="background:none;border:none;cursor:pointer;color:#64748b;font-size:1.1rem;padding:0">✕</button>
      </div>
      <div id="res-preview-container" style="flex:1;overflow:hidden"></div>
    </div>
  </div>`;
}

function openPeriodPopup(cls,periodIdx,day){
  const period=((getTimetableForCls(cls)[cls]||{})[day]||[])[periodIdx];
  const p=PERIODS[periodIdx];
  S.popup={type:"period",cls,periodIdx,day,period,p};
  render();
}

function renderPeriodPopup(){
  const{cls,period,p,day}=S.popup;
  if(!period)return`<div class="modal-bg" onclick="S.popup=null;render()"><div class="modal-box"><div style="color:#64748b">No class this period.</div><button class="btn" style="margin-top:1rem;background:#f1f5f9;color:#64748b" onclick="S.popup=null;render()">Close</button></div></div>`;
  const subj=period.sub;
  const tchr=period.teacher;
  const col=subColor(subj);
  const matchedRes=(DB.resources||[]).filter(r=>{
    if(!r.subject||!subj||!subj.includes(r.subject))return false;
    const isMLP=cls==='K1A'||cls==='K1B'||cls==='K2A'||cls==='K2B'||cls==='K3A'||cls==='K3B'||cls==='N1'||cls==='N2';
    const resProg=isMLP?'MLP':'IEP';
    const resLevel=cls.startsWith('K3')?'K3':cls.startsWith('K2')?'K2':'K1';
    return(r.prog||'MLP')===resProg&&(r.level||'K1')===resLevel;
  });
  const sw=getCurrentSchoolWeek();

  return`<div class="modal-bg" onclick="if(event.target===this){S.popup=null;render()}">
    <div class="modal-box" style="max-width:420px">
      <div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:1rem">
        <div style="width:10px;height:40px;border-radius:4px;background:${col};flex-shrink:0"></div>
        <div>
          <div style="font-weight:800;font-size:1.1rem;color:${col}">${subj}</div>
          <div style="font-size:0.75rem;color:#64748b">${cls} · ${day} · ${p.label} · ${p.start}–${p.end}</div>
          ${tchr?`<div style="font-size:0.72rem;color:#94a3b8">👤 ${tchr}</div>`:""}
        </div>
        <button onclick="S.popup=null;render()" style="margin-left:auto;background:none;border:none;cursor:pointer;color:#94a3b8;font-size:1.1rem;padding:0">✕</button>
      </div>

      ${sw?`<div style="background:#f0f9ff;border-radius:8px;padding:0.5rem 0.7rem;margin-bottom:0.75rem;font-size:0.72rem;color:#0369a1">
        📚 ${sw.sem} · Week ${sw.week} · <strong>${sw.unit}</strong>
      </div>`:""}

      ${matchedRes.length>0
        ?`<div style="margin-bottom:0.75rem">
          <div style="font-weight:700;font-size:0.75rem;color:#64748b;margin-bottom:0.4rem">🔗 Resources for ${subj}</div>
          ${matchedRes.map(r=>{
            const ti=typeInfo(r.type);
            return`<div style="background:#f8fafc;border-radius:10px;padding:0.55rem 0.7rem;margin-bottom:0.3rem;display:flex;align-items:center;gap:0.5rem;border-left:3px solid ${ti.color}">
              <span>${ti.icon}</span>
              <div style="flex:1">
                <div style="font-weight:700;font-size:0.78rem;color:#111827">${r.name}</div>
                ${r.note?`<div style="font-size:0.65rem;color:#94a3b8">${r.note}</div>`:""}
              </div>
              <a href="${r.url}" target="_blank" class="btn-sm" style="background:#FEF2F2;color:#B91C1C;text-decoration:none;flex-shrink:0">${r.url.startsWith("http")||r.url.startsWith("/")?"Open →":"📎 "+r.url}</a>
            </div>`;
          }).join("")}
        </div>`
        :`<div style="background:#f8fafc;border-radius:8px;padding:0.5rem 0.7rem;margin-bottom:0.75rem;font-size:0.72rem;color:#94a3b8;text-align:center">No resources linked to ${subj} yet.<br><span style="font-size:0.65rem">Add them in the 📚 Resources tab</span></div>`}

      <button onclick="S.popup=null;render()" class="btn" style="width:100%;background:#f1f5f9;color:#64748b">Close</button>
    </div>
  </div>`;
}


function renderResources(){
  const resources=DB.resources||[];
  const prog=S.resProg||"MLP";
  const level=S.resLevel||"K1";
  const subj=S.resSub||"All";
  const byProg=resources.filter(r=>(r.prog||"MLP")===prog);
  const byLevel=byProg.filter(r=>(r.level||"K1")===level);
  const filtered=subj==="All"?byLevel:byLevel.filter(r=>r.subject===subj);
  const subjsForLevel=["All",...new Set(byLevel.map(r=>r.subject).filter(Boolean))].sort((a,b)=>a==="All"?-1:b==="All"?1:a.localeCompare(b));
  const h=[];
  h.push('<div style="padding:1rem;display:flex;flex-direction:column;gap:0.65rem">');
  // Header
  h.push('<div style="display:flex;align-items:center;gap:0.5rem">');
  h.push('<div style="font-weight:800;font-size:1rem;color:#111827">&#128218; Resources</div>');
  h.push('<button class="btn btn-primary" style="margin-left:auto;font-size:0.72rem" onclick="openAddResourceModal()">+ Add</button>');
  h.push('</div>');
  // Programme pills
  h.push('<div class="scrl" style="display:flex;align-items:center;gap:0.3rem;overflow-x:auto;-webkit-overflow-scrolling:touch">');
  ["MLP","IEP"].forEach(p=>{
    const act=prog===p;
    h.push('<button onclick="S.resProg=\''+p+'\';S.resLevel=\'K1\';S.resSub=\'All\';render()" style="padding:0.3rem 0.75rem;border-radius:20px;border:2px solid '+(act?'var(--red)':'#E5E7EB')+';background:'+(act?'var(--red)':'#F9FAFB')+';color:'+(act?'#fff':'#6B7280')+';font-family:\'Nunito\',sans-serif;font-size:0.82rem;font-weight:700;cursor:pointer;white-space:nowrap;flex-shrink:0;min-height:32px;transition:all 0.15s">'+p+'</button>');
  });
  h.push('<div style="width:1px;height:20px;background:#E5E7EB;flex-shrink:0;margin:0 0.1rem"></div>');
  // Level pills
  ["K1","K2","K3"].forEach(lv=>{
    const act=level===lv;
    const count=byProg.filter(r=>(r.level||"K1")===lv).length;
    h.push('<button onclick="S.resLevel=\''+lv+'\';S.resSub=\'All\';render()" style="padding:0.3rem 0.65rem;border-radius:8px;border:2px solid '+(act?'var(--red)':'#E5E7EB')+';background:'+(act?'var(--red)':'#F9FAFB')+';color:'+(act?'#fff':'#374151')+';font-family:\'Nunito\',sans-serif;font-size:0.85rem;font-weight:'+(act?800:700)+';cursor:pointer;white-space:nowrap;flex-shrink:0;min-height:32px;transition:all 0.15s">'+lv+(count?' <span style="font-size:0.68rem;opacity:0.75">('+count+')</span>':'')+'</button>');
  });
  h.push('<div style="width:1px;height:20px;background:#E5E7EB;flex-shrink:0;margin:0 0.1rem"></div>');
  // Subject pills
  subjsForLevel.forEach(s=>{
    const act=subj===s;
    h.push('<button onclick="S.resSub=\''+s+'\';render()" style="padding:0.3rem 0.65rem;border-radius:8px;border:2px solid '+(act?'var(--red)':'#E5E7EB')+';background:'+(act?'var(--red)':'#F9FAFB')+';color:'+(act?'#fff':'#374151')+';font-family:\'Nunito\',sans-serif;font-size:0.85rem;font-weight:'+(act?800:700)+';cursor:pointer;white-space:nowrap;flex-shrink:0;min-height:32px;transition:all 0.15s">'+s+'</button>');
  });
  h.push('</div>');
  // Resource grid
  if(filtered.length===0){
    h.push('<div style="text-align:center;color:#94a3b8;padding:2.5rem 1rem;background:#fff;border-radius:12px;border:1px dashed #E5E7EB">');
    h.push('<div style="font-size:1.5rem;margin-bottom:0.5rem">&#128194;</div>');
    h.push('<div style="font-weight:700;color:#6B7280">No '+prog+' '+level+' '+(subj==="All"?"resources":subj+" resources")+' yet</div>');
    h.push('<div style="font-size:0.75rem;color:#9CA3AF;margin-top:0.3rem">Click <strong>+ Add</strong> to add the first one</div>');
    h.push('</div>');
  } else {
    h.push('<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:0.6rem">');
    filtered.forEach(r=>{
      const ti=typeInfo(r.type);
      const globalIdx=resources.indexOf(r);
      h.push('<div style="background:#fff;border-radius:14px;box-shadow:0 1px 6px rgba(0,0,0,0.07);overflow:hidden;border-top:3px solid '+ti.color+'">');
      h.push('<div style="padding:0.7rem 0.8rem">');
      h.push('<div style="display:flex;align-items:flex-start;gap:0.4rem">');
      h.push('<span style="font-size:1rem">'+ti.icon+'</span>');
      h.push('<div style="flex:1;min-width:0">');
      h.push('<div style="font-weight:800;color:#111827;font-size:0.82rem;line-height:1.3">'+r.name+'</div>');
      h.push('<div style="font-size:0.67rem;color:#94a3b8;margin-top:1px">');
      h.push('<span style="background:#f1f5f9;border-radius:3px;padding:1px 5px;font-weight:700;color:#64748b;margin-right:3px">'+(r.prog||"MLP")+' '+(r.level||"K1")+'</span>');
      if(r.subject)h.push('<span>'+r.subject+'</span>');
      if(r.note)h.push(' &middot; <span style="font-style:italic">'+r.note+'</span>');
      h.push('</div></div>');
      h.push('<button onclick="DB.resources.splice('+globalIdx+',1);pushDB();render()" style="background:none;border:none;cursor:pointer;color:#cbd5e1;font-size:0.8rem;padding:0;flex-shrink:0" title="Remove">&#10005;</button>');
      h.push('</div>');
      h.push('<div style="margin-top:0.5rem;display:flex;gap:0.3rem;flex-wrap:wrap">');
      if(r.url.startsWith("http")||r.url.startsWith("/"))
        h.push('<a href="'+r.url+'" target="_blank" class="btn-sm" style="background:#FEF2F2;color:#B91C1C;text-decoration:none">&#128279; Open</a>');
      else
        h.push('<span class="btn-sm" style="background:#fef9c3;color:#92400e;cursor:default">&#128206; '+r.url+'</span>');
      h.push('</div></div></div>');
    });
    h.push('</div>');
  }
  h.push('</div>');
  return h.join('');
}
function openAddResourceModal(){
  const name=prompt("Resource name:");if(!name)return;
  const url=prompt("URL:");if(!url)return;
  const prog=prompt("Programme (MLP / IEP):",S.resProg||"MLP")||"MLP";
  const level=prompt("Level (K1 / K2 / K3):",S.resLevel||"K1")||"K1";
  const subject=prompt("Subject (e.g. English, Math, Phonics):",S.resSub!=="All"?S.resSub:"")||"";
  const type=prompt("Type (Slides/Video/Doc/Sheet/Audio/PDF/Link):")||"Link";
  const note=prompt("Note (optional):")||"";
  const id=Date.now();
  DB.resources=[...(DB.resources||[]),{id,prog,level,name,url,subject,type,note}];
  pushDB();render();
}

function openResourcePreview(idx){
  const r=DB.resources[idx];
  if(!r||!r.embedSrc)return;
  S.popup={type:"resourcePreview",resource:r};
  render();
  setTimeout(()=>{
    const container=document.getElementById("res-preview-container");
    if(!container)return;
    const iframe=document.createElement("iframe");
    iframe.src=r.embedSrc;
    iframe.style.cssText="width:100%;height:100%;border:none;display:block";
    iframe.title=r.name;
    container.appendChild(iframe);
  },50);
}

// ── STUDENTS TAB ──────────────────────────────────────────────────────────────
// ── BOOT ──────────────────────────────────────────────────────────────────────
// Restore last nav position from localStorage
try{
  const nav=JSON.parse(localStorage.getItem("navState")||"{}");
  if(nav.tab)S.tab=nav.tab;
  if(nav.tmView)S.tmView=nav.tmView;
  if(nav.tmTeacher)S.tmTeacher=nav.tmTeacher;
  if(nav.tmProg)S.tmProg=nav.tmProg;
  if(nav.cls)S.cls=nav.cls;
  if(nav.resProg)S.resProg=nav.resProg;
  if(nav.resLevel)S.resLevel=nav.resLevel;
  if(nav.resSub)S.resSub=nav.resSub;
}catch(e){}
auth.signInAnonymously().catch(()=>{});
startSync();
S.clockStr=nowTimeStr();
render();
