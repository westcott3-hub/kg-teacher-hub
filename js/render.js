function render(){
  const root=document.getElementById("root");
  root.innerHTML=`
    ${renderHeader()}
    ${renderTabs()}
    <div id="tab-body" style="flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;position:relative">
      ${S.tab==="timetable"?renderTimetable():""}
      ${S.tab==="checkin"?renderCheckin():""}
      ${S.tab==="students"?renderStudents():""}
      ${S.tab==="resources"?renderResources():""}

    </div>
    ${S.popup?renderPopup():""}
  `;
  // Post-render hooks
  if(S.tab==="timetable"){
    setTimeout(()=>{updatePeriodProgress();},50);
  }
  if(S.tab==="analytics"){
    setTimeout(()=>{loadPanelLayouts("an-container");makePanelsDraggable(S.anEditMode);drawAnalyticsCharts();},80);
  }
}

// ── HEADER ────────────────────────────────────────────────────────────────────
function renderHeader(){
  const sw=getCurrentSchoolWeek();
  const now=new Date();
  const dayName=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][now.getDay()];
  const dateStr=now.toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"});
  const dc=todayDayColors();
  return`<div style="flex-shrink:0;border-bottom:1px solid #E5E7EB;
    box-shadow:0 1px 6px rgba(0,0,0,0.06)">
    <!-- ACS red top line -->
    <div style="height:3px;background:#B91C1C"></div>
    <!-- Main bar -->
    <div style="background:#fff;padding:0.55rem 1.1rem;display:flex;align-items:center;gap:0.9rem">
      <!-- Logo -->
      <img src="${SCHOOL_LOGO}"
        style="height:38px;width:auto;border-radius:4px;border:1px solid #E5E7EB;padding:2px;flex-shrink:0"
        alt="ACS">
      <!-- Name + motto -->
      <div style="border-right:1px solid #E5E7EB;padding-right:0.9rem;flex-shrink:0">
        <div style="font-weight:900;font-size:0.96rem;color:#111827;letter-spacing:-0.2px;line-height:1.15">
          Assumption College Sriracha</div>
        <div style="font-size:0.62rem;color:#6B7280;font-style:italic;margin-top:1px">
          Labor Omnia Vincit &nbsp;·&nbsp; Kindergarten Department</div>
      </div>
      <!-- Hub label -->
      <div style="flex-shrink:0;border-right:1px solid #E5E7EB;padding-right:0.9rem">
        <div style="font-weight:800;font-size:0.8rem;color:#B91C1C">Teacher Hub</div>
        <div style="font-size:0.6rem;color:#9CA3AF">${dayName}, ${dateStr}</div>
      </div>
      <!-- Week info + progress bar + duty badge -->
      <div style="flex:1;min-width:0">
        ${sw?`<div style="font-size:0.65rem;color:#6B7280;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
          📚 ${sw.sem} &nbsp;·&nbsp; Week ${sw.week} &nbsp;·&nbsp; ${sw.unit}</div>`:''}
        <div id="period-progress" style="margin-top:3px"></div>
      </div>

      <!-- Thai day pill -->
      <div style="background:${dc.bg};color:${dc.text};border-radius:20px;
        padding:0.22rem 0.7rem;font-size:0.65rem;font-weight:800;
        white-space:nowrap;flex-shrink:0;border:1px solid ${dc.border}">${dayName}</div>
      <!-- Clock -->
      <div id="header-clock"
        style="font-size:1.3rem;font-weight:900;color:#111827;
          font-variant-numeric:tabular-nums;letter-spacing:-0.5px;flex-shrink:0">
        ${nowTimeStr()}</div>
      <!-- Sync dot -->
      <div class="sync-dot ${S.syncStatus==='ok'?'sync-ok':S.syncStatus==='ing'?'sync-ing':'sync-err'}"
        title="Sync: ${S.syncStatus}" style="flex-shrink:0"></div>
    </div>
  </div>`;
}

// ── TABS ──────────────────────────────────────────────────────────────────────
function renderTabs(){
  return`<div class="scrl" style="background:#fff;padding:0 0.75rem;display:flex;gap:1px;flex-shrink:0;border-bottom:2px solid #E5E7EB">
    ${TABS.map(t=>{
      const active=S.tab===t.id;
      return`<button class="tab-btn" onclick="S.tab='${t.id}';if(t.id!=='timetable')S.tmView='classes';render()" style="
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
  const h=[];
  h.push('<div style="padding:0.75rem 1rem;display:flex;flex-direction:column;gap:0.75rem">');

  // Sub-nav card
  h.push('<div style="background:#fff;border-radius:12px;border:1px solid #E5E7EB;overflow:hidden;flex-shrink:0">');
  // Row 1: Classes/Teachers toggle
  h.push('<div style="display:flex;align-items:center;border-bottom:1px solid #E5E7EB">');
  [["classes","📋 Classes"],["teachers","👩‍🏫 Teachers"]].forEach(([v,lbl])=>{
    const act=S.tmView===v;
    const bg=act?'#FEF2F2':'transparent',clr=act?'var(--red)':'#6B7280',bb=act?'var(--red)':'transparent',fw=act?800:700;
    h.push('<button onclick="S.tmView=\''+v+'\';if(\''+v+'\'===\'classes\')S.tmProg=S.tmProg||(\'MLP\');render()" style="flex:1;padding:0.45rem 0.75rem;border:none;cursor:pointer;font-weight:'+fw+';font-size:0.78rem;background:'+bg+';color:'+clr+';border-bottom:2px solid '+bb+';margin-bottom:-1px;transition:all 0.15s">'+lbl+'</button>');
  });
  h.push('</div>');
  // Row 2: teacher pills
  h.push('<div style="padding:0.4rem 0.65rem;display:flex;align-items:center;gap:0.3rem;flex-wrap:wrap">');
  TEACHERS.forEach(t=>{
    const act=S.tmTeacher===t.id;
    const bg=act?'var(--red)':'#F9FAFB',bd=act?'var(--red)':'#E5E7EB',clr=act?'#fff':'#374151',fw=act?800:700;
    h.push('<button onclick="S.tmTeacher=\''+t.id+'\';S.tmView=\'teachers\';render()" style="padding:0.22rem 0.65rem;border-radius:6px;border:1px solid '+bd+';background:'+bg+';color:'+clr+';font-size:0.75rem;font-weight:'+fw+';cursor:pointer;transition:all 0.15s">'+t.full+'</button>');
  });
  h.push('</div>');
  h.push('</div>'); // end sub-nav card

  // Inner content (teacher timetable)
  h.push(innerHtml);
  h.push('</div>');
  return h.join('');
}

function renderTeacherPicker(){
  return '<div style="padding:2rem;text-align:center;color:#9CA3AF;font-style:italic">Select a teacher above to view their timetable</div>';
}

// ── TIMETABLE TAB ─────────────────────────────────────────────────────────────
function renderTimetable(){
  // Route to teacher view if tmView==='teachers'
  if(S.tmView==="teachers"){
    const teacher=S.tmTeacher?TEACHERS.find(t=>t.id===S.tmTeacher):null;
    return renderTimetableShell(teacher?renderTeacherTab(teacher):renderTeacherPicker());
  }
  const cls=S.cls;
  const tt=TIMETABLE[cls];
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
    return(DB.resources||[]).filter(r=>r.subject&&subj.includes(r.subject));
  }

  const h=[];
  h.push('<div style="padding:0.75rem 1rem;display:flex;flex-direction:column;gap:0.65rem">');

  // ── TIMETABLE SUB-NAV ─────────────────────────────────────────────────────
  {
    const MLP_CLS=["K1A","K1B","K2A","K2B","K3A","K3B"];
    const IEP_CLS=["K1/1","K1/2","K1/3","K2/1","K2/2","K2/3","K3/1","K3/2","K3/3","K3/4"];
    const curProg=S.tmProg||"MLP";
    const clsList=curProg==="IEP"?IEP_CLS:MLP_CLS;
    if(!clsList.includes(S.cls))S.cls=clsList[0];

    h.push('<div style="background:#fff;border-radius:12px;border:1px solid #E5E7EB;overflow:hidden;flex-shrink:0">');

    // Row 1: Classes / Teachers
    h.push('<div style="display:flex;align-items:center;border-bottom:1px solid #E5E7EB">');
    [["classes","📋 Classes"],["teachers","👩‍🏫 Teachers"]].forEach(([v,lbl])=>{
      const act=(S.tmView===v)||(v==="classes"&&!S.tmView);
      const bg=act?"#FEF2F2":"transparent",clr=act?"var(--red)":"#6B7280",bb=act?"var(--red)":"transparent",fw=act?800:700;
      h.push('<button onclick="S.tmView=\''+v+'\';if(\''+v+'\'===\'teachers\'&&!S.tmTeacher)S.tmTeacher=TEACHERS[0].id;render()" style="flex:1;padding:0.45rem 0.75rem;border:none;cursor:pointer;font-weight:'+fw+';font-size:0.78rem;background:'+bg+';color:'+clr+';border-bottom:2px solid '+bb+';margin-bottom:-1px;transition:all 0.15s">'+lbl+'</button>');
    });
    h.push('</div>');

    // Row 2 (classes view): MLP/IEP + class pills
    if(!S.tmView||S.tmView==="classes"){
      h.push('<div style="padding:0.4rem 0.65rem;display:flex;align-items:center;gap:0.35rem;flex-wrap:wrap">');
      ["MLP","IEP"].forEach(prog=>{
        const act=curProg===prog;
        const act2=curProg===prog;
        const bg2=act2?"var(--red)":"#F9FAFB",bd2=act2?"var(--red)":"#E5E7EB",c2=act2?"#fff":"#6B7280";
        h.push('<button onclick="S.tmProg=\''+prog+'\';S.cls=(\''+prog+'\'===\'IEP\'?\'K1/1\':\'K1A\');render()" style="padding:0.22rem 0.65rem;border-radius:20px;border:1px solid '+bd2+';background:'+bg2+';color:'+c2+';font-size:0.72rem;font-weight:700;cursor:pointer;transition:all 0.15s">'+prog+'</button>');
      });
      h.push('<div style="width:1px;height:18px;background:#E5E7EB"></div>');
      clsList.forEach(c=>{
        const act=S.cls===c;
        const act3=S.cls===c;
        const bg3=act3?"var(--red)":"#F9FAFB",bd3=act3?"var(--red)":"#E5E7EB",c3=act3?"#fff":"#374151",fw3=act3?800:700;
        h.push('<button onclick="S.cls=\''+c+'\';render()" style="padding:0.22rem 0.55rem;border-radius:6px;border:1px solid '+bd3+';background:'+bg3+';color:'+c3+';font-size:0.75rem;font-weight:'+fw3+';cursor:pointer;transition:all 0.15s">'+c+'</button>');
      });
      h.push('</div>');
    }

    // Row 2 (teachers view): teacher pills grouped MLP/IEP
    if(S.tmView==="teachers"){
      h.push('<div style="padding:0.4rem 0.65rem;display:flex;align-items:center;gap:0.3rem;flex-wrap:wrap">');
      TEACHERS.forEach(t=>{
        const act=S.tmTeacher===t.id;
        h.push('<button onclick="S.tmTeacher=\''+t.id+'\';render()" style="padding:0.22rem 0.65rem;border-radius:6px;border:1px solid '+(act?'var(--red)':'#E5E7EB')+';background:'+(act?'var(--red)':'#F9FAFB')+';color:'+(act?'#fff':'#374151')+';font-size:0.75rem;font-weight:'+(act?800:700)+';cursor:pointer;transition:all 0.15s">'+t.full+'</button>');
      });
      h.push('</div>');
    }

    h.push('</div>'); // end sub-nav card
  }


  // ── FULL DAY PROGRESS BAR ────────────────────────────────────────────────────
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

    h.push('<div style="background:'+dc.light+';border-radius:14px;padding:0.75rem 0.9rem;box-shadow:0 1px 6px rgba(0,0,0,0.07);border-top:4px solid '+dc.border+'">');
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

  // ── CLASS + DAY + WEEK SWITCHER ────────────────────────────────────────────
  h.push('<div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap">');


  // Day buttons
  h.push('<div style="display:flex;gap:0.25rem;flex-wrap:wrap">');
  DAYS.forEach(d=>{
    const isSelected=today===d;
    const isReal=realToday===d;
    const dc=THAI_DAY_COLORS[d]||{bg:"#e2e8f0",text:"#1e3a5f",border:"#94a3b8"};
    h.push('<button onclick="S.tmDay=\''+( isSelected&&S.tmDay?'null':d)+'\';render()" style="padding:0.3rem 0.55rem;border-radius:7px;border:none;cursor:pointer;font-family:\'Nunito\',sans-serif;font-weight:700;font-size:0.72rem;background:'+(isSelected?dc.bg:'#F9FAFB')+';color:'+(isSelected?dc.text:isReal?dc.text:'#94A3B8')+';'+(isReal&&!isSelected?'outline:2px solid '+dc.border+';outline-offset:-2px':'')+'">'
      +d.slice(0,3)+'</button>');
  });
  if(S.tmDay&&S.tmDay!=="null"){
    h.push('<button onclick="S.tmDay=null;render()" style="padding:0.3rem 0.55rem;border-radius:7px;border:2px solid #f59e0b;cursor:pointer;font-family:\'Nunito\',sans-serif;font-weight:700;font-size:0.68rem;background:#fef9c3;color:#92400e">Today</button>');
  }
  h.push('</div>');

  // Week selector — ‹ Wk N · Unit › with Now reset
  h.push('<div style="margin-left:auto;display:flex;align-items:center;gap:0.35rem;flex-shrink:0">');
  const wo=S.tmWeekOffset||0;
  h.push('<button onclick="S.tmWeekOffset='+(wo-1)+';render()" style="width:26px;height:26px;border-radius:6px;border:1px solid #E5E7EB;background:#F9FAFB;cursor:pointer;font-size:1rem;line-height:1;font-weight:700;color:#374151">&lsaquo;</button>');
  if(sw){
    h.push('<div style="text-align:center;min-width:80px;cursor:default">');
    h.push('<div style="font-size:0.78rem;font-weight:800;color:var(--red)">Wk '+sw.week+'</div>');
    h.push('<div style="font-size:0.6rem;color:#9CA3AF;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:90px">'+sw.unit+'</div>');
    h.push('</div>');
  } else {
    h.push('<div style="min-width:80px;text-align:center;font-size:0.7rem;color:#9CA3AF">No week</div>');
  }
  h.push('<button onclick="S.tmWeekOffset='+(wo+1)+';render()" style="width:26px;height:26px;border-radius:6px;border:1px solid #E5E7EB;background:#F9FAFB;cursor:pointer;font-size:1rem;line-height:1;font-weight:700;color:#374151">&rsaquo;</button>');
  if(wo!==0)h.push('<button onclick="S.tmWeekOffset=0;render()" style="padding:0.2rem 0.5rem;border-radius:6px;border:1px solid #E5E7EB;background:#FEF2F2;cursor:pointer;font-size:0.65rem;font-weight:700;color:var(--red)">Now</button>');
  h.push('</div>');

  h.push('</div>');

  // ── MORNING DUTY ROTA PANEL ─────────────────────────────────────────────────
  {
    const rota=getDutyRota(weekNum);
    const isGaryOnDuty=weekNum&&GARY_DUTY_WEEKS.has(weekNum);
    const todayLateDuty=LATE_DUTY_BY_DAY[realToday]||[];
    const foreignOnDuty=getForeignDutyTeachers(rota);
    const dutyNames=foreignOnDuty.join(', ');

    h.push('<div style="background:#fff;border-radius:12px;border:1px solid #E5E7EB;overflow:hidden">');

    // Header — red if Gary on duty, light red otherwise
    const headerBg=isGaryOnDuty?'background:linear-gradient(135deg,#B91C1C,#991B1B);color:#fff':'background:#FEF2F2;color:var(--red)';
    h.push('<div style="'+headerBg+';padding:0.55rem 0.85rem;display:flex;align-items:center;justify-content:space-between;cursor:pointer" onclick="S.dutyOpen=!S.dutyOpen;render()">');
    h.push('<div style="font-weight:800;font-size:0.88rem;display:flex;align-items:center;gap:0.5rem">');
    h.push('&#128205; Morning Duty Rota');
    if(weekNum&&rota){
      h.push('<span style="font-weight:600;font-size:0.78rem;opacity:0.85">· Wk '+weekNum+' · Rota '+rota.rota+'</span>');
      if(dutyNames){
        h.push('<span style="font-weight:800;font-size:0.8rem;'+(isGaryOnDuty?'':'opacity:0.9')+'">'+(isGaryOnDuty?'🔴':'👤')+' '+dutyNames+'</span>');
      }
    }
    h.push('</div>');
    h.push('<div style="font-size:0.72rem;opacity:0.7">'+(S.dutyOpen?'▲':'▼')+'</div>');
    h.push('</div>');

    if(S.dutyOpen){
      h.push('<div style="padding:0.6rem 0.75rem;display:grid;grid-template-columns:1fr 1fr;gap:0.5rem">');

      // Left column: duty positions
      h.push('<div>');
      h.push('<div style="font-size:0.7rem;font-weight:800;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.35rem">07:00–07:55 Positions (Rota '+(rota?rota.rota:'?')+')</div>');
      if(rota){
        rota.positions.forEach(p=>{
          const isGaryPos=p.staff.some(s=>s.includes('Gary'));
          h.push('<div style="margin-bottom:0.3rem;padding:0.3rem 0.45rem;border-radius:6px;background:'+(isGaryPos?'#FEF2F2':'#F9FAFB')+';border:1px solid '+(isGaryPos?'#FECACA':'#F3F4F6')+'">' );
          h.push('<div style="font-size:0.7rem;font-weight:700;color:'+(isGaryPos?'var(--red)':'#374151')+'">'+p.pos+'</div>');
          h.push('<div style="font-size:0.65rem;color:#6B7280">'+p.staff.join(', ')+'</div>');
          h.push('</div>');
        });
      } else {
        h.push('<div style="font-size:0.75rem;color:#9CA3AF;font-style:italic">No week selected</div>');
      }
      h.push('</div>');

      // Right column: late duty + today info
      h.push('<div>');
      h.push('<div style="font-size:0.7rem;font-weight:800;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.35rem">07:55–08:25 Gate Duty</div>');
      if(rota){
        h.push('<div style="padding:0.3rem 0.45rem;border-radius:6px;background:#F9FAFB;border:1px solid #F3F4F6;margin-bottom:0.4rem">');
        h.push('<div style="font-size:0.7rem;font-weight:700;color:#374151">'+rota.lateduty.pos+'</div>');
        h.push('<div style="font-size:0.65rem;color:#6B7280">'+rota.lateduty.staff.join(', ')+'</div>');
        h.push('</div>');
      }
      // Today's late duty
      if(todayLateDuty.length>0){
        h.push('<div style="font-size:0.7rem;font-weight:800;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.35rem;margin-top:0.4rem">Today ('+realToday+')</div>');
        h.push('<div style="padding:0.3rem 0.45rem;border-radius:6px;background:#F9FAFB;border:1px solid #F3F4F6">');
        h.push('<div style="font-size:0.65rem;color:#6B7280">'+todayLateDuty.join(', ')+'</div>');
        h.push('</div>');
      }
      // Rota schedule overview
      if(rota){
        h.push('<div style="font-size:0.7rem;font-weight:800;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.35rem;margin-top:0.4rem">Rota Weeks</div>');
        MORNING_DUTY_ROTA.forEach(r=>{
          const isCurrent=weekNum&&r.weeks.includes(weekNum);
          const hasGary=r.rota===3;
          h.push('<div style="display:flex;align-items:center;gap:0.4rem;margin-bottom:0.2rem">');
          h.push('<span style="font-size:0.68rem;font-weight:700;color:'+(isCurrent?'var(--red)':'#9CA3AF')+'">Rota '+r.rota+(hasGary?' 🔴':'')+'</span>');
          h.push('<span style="font-size:0.65rem;color:#9CA3AF">Wks '+r.weeks.join(', ')+'</span>');
          h.push('</div>');
        });
      }
      h.push('</div>');

      h.push('</div>'); // end grid
    }
    h.push('</div>'); // end panel
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

    h.push('<div style="background:#fff;border-radius:12px;padding:1rem;box-shadow:0 2px 12px rgba(185,28,28,0.12);border-top:4px solid '+col+'">');
    h.push('<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:0.5rem;margin-bottom:0.5rem">');
    h.push('<div>');
    h.push('<div style="font-size:0.68rem;font-weight:700;color:'+col+';text-transform:uppercase;letter-spacing:0.5px">NOW &mdash; '+PERIODS[activePeriodIdx].label+'</div>');
    h.push('<div style="font-weight:800;font-size:1.3rem;color:#111827">'+subj+'</div>');
    if(tchr)h.push('<div style="font-size:0.75rem;color:#94a3b8">&#128100; '+tchr+'</div>');
    if(topic)h.push('<div style="font-size:0.78rem;color:#475569;margin-top:0.2rem">&#128218; '+topic+'</div>');
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

    // Resources for this subject
    if(res.length>0){
      h.push('<div style="font-size:0.7rem;font-weight:700;color:#64748b;margin-bottom:0.4rem">&#128206; RESOURCES</div>');
      h.push('<div style="display:flex;flex-direction:column;gap:0.35rem">');
      res.forEach(r=>{
        const ti=typeInfo(r.type);
        h.push('<div style="display:flex;align-items:center;gap:0.5rem;background:#f8fafc;border-radius:8px;padding:0.45rem 0.6rem;border-left:3px solid '+ti.color+'">');
        h.push('<span>'+ti.icon+'</span>');
        h.push('<div style="flex:1;min-width:0"><div style="font-weight:700;font-size:0.78rem;color:#111827;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+r.name+'</div>');
        if(r.note)h.push('<div style="font-size:0.65rem;color:#94a3b8">'+r.note+'</div>');
        h.push('</div>');
        h.push('<a href="'+r.url+'" target="_blank" class="btn-sm" style="background:'+ti.color+'22;color:'+ti.color+';text-decoration:none;flex-shrink:0">Open</a>');
        if(r.embedSrc)h.push('<button class="btn-sm" style="background:#f1f5f9;color:#64748b;flex-shrink:0" onclick="S.popup={type:\'resourcePreview\',resource:DB.resources.find(x=>x.id==='+r.id+')};render()">&#128065;</button>');
        h.push('</div>');
      });
      h.push('</div>');
    }
    h.push('</div>');

    // Embed preview (if there's a single embeddable resource)
    const embedRes=res.find(r=>r.embedSrc);
    if(embedRes&&S.tmShowEmbed){
      h.push('<div style="background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.09)">');
      h.push('<div style="display:flex;align-items:center;justify-content:space-between;padding:0.5rem 0.75rem;background:#f8fafc;border-bottom:1px solid #e2e8f0">');
      h.push('<div style="font-weight:700;font-size:0.78rem;color:#111827">'+embedRes.name+'</div>');
      h.push('<button class="btn-sm" style="background:#fee2e2;color:#dc2626" onclick="S.tmShowEmbed=false;render()">&#10005; Close</button>');
      h.push('</div>');
      h.push('<iframe src="'+embedRes.embedSrc+'" style="width:100%;height:420px;border:none;display:block" title="'+embedRes.name+'"></iframe>');
      h.push('</div>');
    } else if(embedRes&&!S.tmShowEmbed){
      h.push('<button class="btn" style="width:100%;background:#eff6ff;color:#2563eb;border:2px dashed #bfdbfe" onclick="S.tmShowEmbed=true;render()">&#128065; Preview: '+embedRes.name+'</button>');
    }
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
      h.push('<div style="background:#FFFBEB;border-radius:12px;padding:0.9rem 1rem;border:1px solid #FDE68A;border-left:4px solid #D97706">');
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

    // Open two-column wrapper
    h.push('<div style="display:grid;grid-template-columns:1fr 1.6fr;gap:0.75rem;align-items:start">');

    // ── LEFT: Period list ────────────────────────────────────────────────────
    h.push('<div style="background:#fff;border-radius:12px;border:1px solid #E5E7EB;overflow:hidden">');
    // Card header
    h.push('<div style="background:#FEF2F2;border-bottom:1px solid #FECACA;padding:0.55rem 0.85rem;display:flex;align-items:center;justify-content:space-between">');
    h.push('<div style="font-weight:800;font-size:0.88rem;color:#B91C1C">'+viewDay+' &nbsp;·&nbsp; '+cls+'</div>');
    if(weekNum)h.push('<div style="font-size:0.68rem;color:#9CA3AF;font-weight:700">Wk '+weekNum+'</div>');
    h.push('</div>');
    // Period rows
    h.push('<div style="padding:0.5rem">');
    PERIODS.forEach((p,i)=>{
      const period=viewPeriods[i];
      if(!period)return;
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
      if(topic)h.push('<div class="period-topic">📖 '+topic+'</div>');
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
    h.push('<div style="background:#fff;border-radius:12px;border:1px solid #E5E7EB;overflow:hidden">');
    h.push('<div style="background:#FEF2F2;border-bottom:1px solid #FECACA;padding:0.55rem 0.85rem;display:flex;align-items:center;gap:0.5rem;cursor:pointer;user-select:none" onclick="S.tmGridOpen=!S.tmGridOpen;render()">');
    h.push('<div style="font-weight:800;font-size:0.88rem;color:#B91C1C">📅 Week Grid'+(weekNum?' <span style="font-size:0.72rem;color:#9CA3AF;font-weight:600">· Wk '+weekNum+(sw?' — '+sw.unit:'')+'</span>':'')+'</div>');
    h.push('<div style="margin-left:auto;font-size:0.72rem;color:#9CA3AF">'+(S.tmGridOpen?'▲':'▼')+'</div>');
    h.push('</div>');
    if(S.tmGridOpen){
      h.push('<div style="overflow-x:auto;padding:0.65rem 0.75rem">');
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
          const shortTopic=cellTopic?cellTopic.split('—').slice(-1)[0].split(':')[0].trim():null;
          const cellBg=isCurrent?col+'15':rowBg;
          const cellBorder=isCurrent?'1px solid '+col+'44':'none';
          h.push('<td style="padding:6px 10px;text-align:left;background:'+cellBg+';border-radius:6px;vertical-align:top;border:'+cellBorder+';min-width:90px">');
          if(period){
            h.push('<div class="week-cell-subj" style="color:'+col+'">'+subj+'</div>');
            if(period.teacher)h.push('<div class="week-cell-tchr">'+period.teacher+'</div>');
            if(shortTopic)h.push('<div class="week-cell-topic">'+shortTopic+'</div>');
          } else {
            h.push('<div style="color:#E5E7EB;font-size:0.8rem">—</div>');
          }
          h.push('</td>');
        });
        h.push('</tr>');
      });
      h.push('</tbody></table></div>');
    }
    h.push('</div>'); // end right col

    h.push('</div>'); // end two-column grid
  }

  // ── NEXT CLASS PREVIEW (between lessons) ────────────────────────────────────
  if(nextPeriod&&!activePeriod&&isSchoolTime&&(!S.tmDay||S.tmDay===realToday)){
    const col=subColor(nextPeriod.sub);
    const topic=getWeekTopic(nextPeriod.sub,weekNum,cls);
    const res=getResources(nextPeriod.sub);
    h.push('<div style="background:#fff;border-radius:12px;padding:0.9rem;box-shadow:0 1px 4px rgba(0,0,0,0.06);border:1px solid #E5E7EB;border-left:4px solid '+col+'">');
    h.push('<div style="font-size:0.68rem;font-weight:700;color:'+col+';text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.2rem">NEXT &mdash; '+nextP.label+' at '+nextP.start+'</div>');
    h.push('<div style="font-weight:800;font-size:1.1rem;color:#111827">'+nextPeriod.sub+'</div>');
    if(nextPeriod.teacher)h.push('<div style="font-size:0.72rem;color:#94a3b8">&#128100; '+nextPeriod.teacher+'</div>');
    if(topic)h.push('<div style="font-size:0.75rem;color:#475569;margin-top:0.2rem">&#128218; '+topic+'</div>');
    if(res.length>0){
      h.push('<div style="display:flex;gap:0.3rem;margin-top:0.5rem;flex-wrap:wrap">');
      res.forEach(r=>{
        const ti=typeInfo(r.type);
        h.push('<a href="'+r.url+'" target="_blank" class="btn-sm" style="background:'+ti.color+'22;color:'+ti.color+';text-decoration:none">'+ti.icon+' '+r.name+'</a>');
      });
      h.push('</div>');
    }
    h.push('</div>');
  }

  // ── AFTER SCHOOL SUMMARY ─────────────────────────────────────────────────────
  if(isAfterSchool&&!S.tmDay){
    const tomorrow=DAYS[(DAYS.indexOf(realToday)+1)%DAYS.length]||DAYS[0];
    const tomorrowPeriods=tt[tomorrow]||[];
    h.push('<div style="background:#F9FAFB;border-radius:12px;padding:0.8rem 1rem;border:1px solid #E5E7EB;border-top:3px solid #9CA3AF">');
    h.push('<div style="font-weight:800;color:#475569;margin-bottom:0.5rem">&#127769; School&apos;s out! Tomorrow: '+tomorrow+'</div>');
    const firstTwo=PERIODS.slice(0,3);
    firstTwo.forEach((p,i)=>{
      const period=tomorrowPeriods[i];
      if(!period)return;
      const col=subColor(period.sub);
      h.push('<div style="display:flex;align-items:center;gap:0.4rem;padding:0.25rem 0;border-top:1px solid #e2e8f0">');
      h.push('<div style="font-size:0.65rem;color:#94a3b8;width:26px">'+p.label+'</div>');
      h.push('<div style="font-weight:700;font-size:0.78rem;color:'+col+'">'+period.sub+'</div>');
      h.push('</div>');
    });
    h.push('</div>');
  }


  // ── SCHOOL CALENDAR ──────────────────────────────────────────────────────────
  (()=>{
    const now=new Date();
    const defaultMonth=now.toISOString().slice(0,7);
    const monthKey=S.tmCalMonth||defaultMonth;
    const calData=SCHOOL_CALENDAR[monthKey];
    const availableMonths=Object.keys(SCHOOL_CALENDAR);

    const typeStyle={
      holiday:{bg:"#fee2e2",text:"#dc2626",dot:"#ef4444"},
      break:   {bg:"#fef9c3",text:"#92400e",dot:"#f59e0b"},
      event:   {bg:"#dbeafe",text:"#1d4ed8",dot:"#3b82f6"},
      exam:    {bg:"#ede9fe",text:"#6d28d9",dot:"#8b5cf6"}
    };

    h.push('<div style="background:#fff;border-radius:12px;box-shadow:0 1px 4px rgba(26,43,74,0.06);border:1px solid #E4E8EE;overflow:hidden">');
    // Month switcher header
    h.push('<div style="display:flex;align-items:center;padding:0.6rem 0.9rem;border-bottom:1px solid #f1f5f9;gap:0.4rem;flex-wrap:wrap">');
    h.push('<div style="font-weight:800;font-size:0.82rem;color:#111827;margin-right:0.25rem">&#128197; School Calendar</div>');
    availableMonths.forEach(mk=>{
      const isActive=mk===monthKey;
      const mn=SCHOOL_CALENDAR[mk].name.split(" ")[0];
      h.push('<button onclick="S.tmCalMonth=\''+mk+'\';render()" style="padding:0.25rem 0.6rem;border-radius:20px;border:none;cursor:pointer;font-family:\'Nunito\',sans-serif;font-weight:700;font-size:0.7rem;background:'+(isActive?"#2563eb":"#f1f5f9")+';color:'+(isActive?"#fff":"#64748b")+'">'+mn+'</button>');
    });
    h.push('</div>');

    if(calData){
      const monthDate=new Date(monthKey+"-01T12:00:00");
      const year=monthDate.getFullYear();
      const month=monthDate.getMonth();
      const firstDay=new Date(year,month,1).getDay();
      const daysInMonth=new Date(year,month+1,0).getDate();

      h.push('<div style="padding:0.75rem 0.9rem">');
      // Day headers with Thai colours
      h.push('<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;margin-bottom:4px">');
      ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].forEach(d=>{
        const dc=THAI_DAY_COLORS[d]||{bg:"#e2e8f0",text:"#64748b"};
        h.push('<div style="text-align:center;font-size:0.62rem;font-weight:800;color:'+dc.text+';background:'+dc.bg+';border-radius:4px;padding:2px 0">'+d.slice(0,3)+'</div>');
      });
      h.push('</div>');

      // Calendar grid
      h.push('<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px">');
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

        const cellBg=isToday?"#2563eb":ts?ts.bg:isWeekend?"#f8fafc":"#fff";
        const cellText=isToday?"#fff":ts?ts.text:isWeekend?"#cbd5e1":"#1e3a5f";

        h.push('<div style="border-radius:6px;padding:3px 2px;min-height:44px;background:'+cellBg+';border:1px solid '+(isToday?"#1d4ed8":"#f1f5f9")+';position:relative" title="'+(topEntry?topEntry.label:"")+'">');
        h.push('<div style="font-size:0.68rem;font-weight:'+(isToday||topEntry?"800":"600")+';color:'+cellText+';text-align:center">'+day+'</div>');
        if(topEntry){
          h.push('<div style="font-size:0.47rem;font-weight:700;color:'+cellText+';text-align:center;line-height:1.2;padding:0 1px;overflow:hidden">'+topEntry.label.slice(0,20)+(topEntry.label.length>20?"…":"")+'</div>');
        }
        if(entries.length>1){
          h.push('<div style="position:absolute;top:2px;right:2px;width:5px;height:5px;border-radius:50%;background:'+(typeStyle[entries[1].type]?.dot||"#94a3b8")+'"></div>');
        }
        h.push('</div>');
      }
      h.push('</div>'); // end grid

      // Legend
      h.push('<div style="display:flex;gap:0.6rem;margin-top:0.6rem;flex-wrap:wrap">');
      Object.entries(typeStyle).forEach(([type,s])=>{
        h.push('<div style="display:flex;align-items:center;gap:3px"><div style="width:8px;height:8px;border-radius:50%;background:'+s.dot+'"></div><span style="font-size:0.62rem;color:#64748b;font-weight:700;text-transform:capitalize">'+type+'</span></div>');
      });
      h.push('</div>');
      h.push('</div>'); // end padding
    }
    h.push('</div>'); // end calendar card
  })();

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
  const TPERIODS=Object.values(periodIndex).sort((a,b)=>timeToMins(a.start)-timeToMins(b.start));
  const TBREAKS=[
    {label:"🥛 Milk & Break",start:"09:50",end:"10:10"},
    {label:"🍱 Lunch & Rest",start:"12:10",end:"14:00"}
  ];

  // Build today's lesson list for this teacher across all their classes
  function getTodayLessons(day){
    const lessons=[];
    teacher.classes.forEach(cls=>{
      const tt=TIMETABLE[cls]||{};
      const periods=getPeriodsForCls(cls);
      (tt[day]||[]).forEach((period,i)=>{
        if(period&&period.teacher===teacher.full){
          lessons.push({p:periods[i],cls,sub:period.sub,idx:i,
            topic:getWeekTopic(period.sub,weekNum,cls)});
        }
      });
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
  h.push('<div style="padding:0.75rem 1rem;display:flex;flex-direction:column;gap:0.65rem">');

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

    h.push('<div style="background:'+dc.light+';border-radius:14px;padding:0.75rem 0.9rem;box-shadow:0 1px 6px rgba(0,0,0,0.07);border-top:4px solid '+dc.border+'">');
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

  // ── DAY + WEEK SWITCHER ───────────────────────────────────────────────────
  h.push('<div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap">');
  h.push('<div style="display:flex;gap:0.25rem;flex-wrap:wrap">');
  WDAYS.forEach(d=>{
    const isSelected=today===d;
    const isReal=realToday===d;
    const dc=THAI_DAY_COLORS[d]||{bg:"#e2e8f0",text:"#1e3a5f",border:"#94a3b8"};
    const cnt=getTodayLessons(d).length;
    h.push('<button onclick="S.tmDay=\''+d+'\';render()" style="padding:0.3rem 0.55rem;border-radius:7px;border:none;cursor:pointer;font-weight:700;font-size:0.72rem;background:'+(isSelected?dc.bg:'#F9FAFB')+';color:'+(isSelected?dc.text:isReal?dc.text:'#94A3B8')+';'+(isReal&&!isSelected?'outline:2px solid '+dc.border+';outline-offset:-2px':'')+'">'
      +d.slice(0,3)+' <span style="font-size:0.62rem;opacity:0.75">('+cnt+')</span></button>');
  });
  if(S.tmDay&&S.tmDay!=="null"){
    h.push('<button onclick="S.tmDay=null;render()" style="padding:0.3rem 0.55rem;border-radius:7px;border:2px solid #f59e0b;cursor:pointer;font-weight:700;font-size:0.68rem;background:#fef9c3;color:#92400e">Today</button>');
  }
  h.push('</div>');
  // Week selector
  h.push('<div style="margin-left:auto;display:flex;align-items:center;gap:0.35rem;flex-shrink:0">');
  h.push('<button onclick="S.tmWeekOffset='+(wo-1)+';render()" style="width:26px;height:26px;border-radius:6px;border:1px solid #E5E7EB;background:#F9FAFB;cursor:pointer;font-size:1rem;line-height:1;font-weight:700;color:#374151">&lsaquo;</button>');
  if(sw){
    h.push('<div style="text-align:center;min-width:80px">');
    h.push('<div style="font-size:0.78rem;font-weight:800;color:var(--red)">Wk '+sw.week+'</div>');
    h.push('<div style="font-size:0.6rem;color:#9CA3AF;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:90px">'+sw.unit+'</div>');
    h.push('</div>');
  } else {
    h.push('<div style="min-width:80px;text-align:center;font-size:0.7rem;color:#9CA3AF">No week</div>');
  }
  h.push('<button onclick="S.tmWeekOffset='+(wo+1)+';render()" style="width:26px;height:26px;border-radius:6px;border:1px solid #E5E7EB;background:#F9FAFB;cursor:pointer;font-size:1rem;line-height:1;font-weight:700;color:#374151">&rsaquo;</button>');
  if(wo!==0)h.push('<button onclick="S.tmWeekOffset=0;render()" style="padding:0.2rem 0.5rem;border-radius:6px;border:1px solid #E5E7EB;background:#FEF2F2;cursor:pointer;font-size:0.65rem;font-weight:700;color:var(--red)">Now</button>');
  h.push('</div>');
  h.push('</div>');

  // ── ACTIVE LESSON FOCUS ───────────────────────────────────────────────────
  if(activeLesson&&today===realToday){
    const col=subColor(activeLesson.sub);
    const pct=Math.min(100,Math.round((nowMins-timeToMins(activeLesson.p.start))/(timeToMins(activeLesson.p.end)-timeToMins(activeLesson.p.start))*100));
    const minsLeft=timeToMins(activeLesson.p.end)-nowMins;
    h.push('<div style="background:#fff;border-radius:12px;padding:1rem;box-shadow:0 2px 12px rgba(185,28,28,0.12);border-top:4px solid '+col+'">');
    h.push('<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:0.5rem;margin-bottom:0.5rem">');
    h.push('<div>');
    h.push('<div style="font-size:0.68rem;font-weight:700;color:'+col+';text-transform:uppercase;letter-spacing:0.5px">NOW — '+activeLesson.p.label+' &nbsp;·&nbsp; '+activeLesson.cls+'</div>');
    h.push('<div style="font-weight:800;font-size:1.3rem;color:#111827">'+activeLesson.sub+'</div>');
    if(activeLesson.topic)h.push('<div style="font-size:0.78rem;color:#475569;margin-top:0.2rem">📖 '+activeLesson.topic+'</div>');
    h.push('</div>');
    h.push('<div style="text-align:right;flex-shrink:0"><div style="font-size:1.1rem;font-weight:800;color:'+col+'">'+minsLeft+'m</div><div style="font-size:0.62rem;color:#94a3b8">remaining</div></div>');
    h.push('</div>');
    h.push('<div style="background:#e2e8f0;border-radius:4px;height:6px"><div style="background:'+col+';border-radius:4px;height:6px;width:'+pct+'%;transition:width 1s"></div></div>');
    h.push('</div>');
  }

  // ── NEXT LESSON ───────────────────────────────────────────────────────────
  if(nextLesson&&!activeLesson&&today===realToday&&!isAfterSchool){
    const col=subColor(nextLesson.sub);
    const minsUntil=timeToMins(nextLesson.p.start)-nowMins;
    h.push('<div style="background:#fff;border-radius:12px;padding:0.9rem;box-shadow:0 1px 4px rgba(0,0,0,0.06);border:1px solid #E5E7EB;border-left:4px solid '+col+'">');
    h.push('<div style="font-size:0.65rem;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.2rem">NEXT · in '+minsUntil+'m · '+nextLesson.cls+'</div>');
    h.push('<div style="font-weight:800;font-size:1.1rem;color:#111827">'+nextLesson.sub+'</div>');
    if(nextLesson.topic)h.push('<div style="font-size:0.72rem;color:#64748b;margin-top:2px;font-style:italic">'+nextLesson.topic+'</div>');
    h.push('</div>');
  }

  // ── TWO-COL: Period list + Week grid ─────────────────────────────────────
  h.push('<div style="display:grid;grid-template-columns:1fr 1.6fr;gap:0.75rem;align-items:start">');

  // LEFT: Today's period list
  h.push('<div style="background:#fff;border-radius:12px;border:1px solid #E5E7EB;overflow:hidden">');
  h.push('<div style="background:#FEF2F2;border-bottom:1px solid #FECACA;padding:0.55rem 0.85rem;display:flex;align-items:center;justify-content:space-between">');
  h.push('<div style="font-weight:800;font-size:0.88rem;color:var(--red)">'+today+' &nbsp;·&nbsp; '+teacher.full+'</div>');
  if(weekNum)h.push('<div style="font-size:0.68rem;color:#9CA3AF;font-weight:700">Wk '+weekNum+'</div>');
  h.push('</div>');
  h.push('<div style="padding:0.5rem">');
  if(todayLessons.length===0){
    h.push('<div style="padding:1rem;text-align:center;color:#9CA3AF;font-size:0.82rem;font-style:italic">No lessons on '+today+'</div>');
  } else {
    // Show all period slots — lessons highlighted, gaps shown as free
    TPERIODS.forEach((p)=>{
      const lesson=todayLessons.find(l=>l.p.start===p.start&&l.p.label===p.label);
      const isNow=today===realToday&&timeToMins(p.start)<=nowMins&&nowMins<timeToMins(p.end);
      const isPast=today===realToday&&timeToMins(p.end)<nowMins;
      if(!lesson){
        // Free period — show faint
        h.push('<div style="display:flex;align-items:stretch;border-radius:8px;margin-bottom:4px;border:1px solid #F3F4F6;overflow:hidden;opacity:0.35">');
        h.push('<div style="width:2.8rem;flex-shrink:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0.4rem 0;background:#F9FAFB;border-right:1px solid #F3F4F6">');
        h.push('<div style="font-weight:800;font-size:0.7rem;color:#9CA3AF">'+p.label+'</div>');
        h.push('<div style="font-size:0.6rem;color:#D1D5DB;margin-top:1px">'+p.start+'</div>');
        h.push('</div>');
        h.push('<div style="width:3px;background:#E5E7EB;flex-shrink:0"></div>');
        h.push('<div style="flex:1;padding:0.55rem 0.7rem;font-size:0.75rem;color:#9CA3AF;font-style:italic">Free period</div>');
        h.push('</div>');
        return;
      }
      const col=subColor(lesson.sub);
      h.push('<div style="display:flex;align-items:stretch;border-radius:9px;margin-bottom:5px;border:1px solid '+(isNow?col+'44':'#F3F4F6')+';overflow:hidden;opacity:'+(isPast&&!isNow?'0.42':'1')+';background:'+(isNow?col+'0D':'#fff')+'">');
      h.push('<div style="width:2.8rem;flex-shrink:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0.4rem 0;background:#F9FAFB;border-right:1px solid #F3F4F6">');
      h.push('<div style="font-weight:800;font-size:0.72rem;color:#9CA3AF">'+p.label+'</div>');
      h.push('<div style="font-size:0.6rem;color:#D1D5DB;margin-top:1px;white-space:nowrap">'+p.start+'</div>');
      h.push('</div>');
      h.push('<div style="width:4px;background:'+col+';flex-shrink:0"></div>');
      h.push('<div style="flex:1;padding:0.55rem 0.7rem;min-width:0">');
      h.push('<div style="display:flex;align-items:center;gap:0.35rem;flex-wrap:wrap">');
      h.push('<div style="font-weight:800;font-size:1rem;color:'+col+'">'+lesson.sub+'</div>');
      if(isNow)h.push('<span style="font-size:0.6rem;background:'+col+';color:#fff;border-radius:4px;padding:1px 6px;font-weight:700">NOW</span>');
      h.push('<span style="font-size:0.68rem;font-weight:700;background:'+teacher.color+'18;color:'+teacher.color+';border-radius:4px;padding:1px 5px">'+lesson.cls+'</span>');
      h.push('</div>');
      if(lesson.topic)h.push('<div style="font-size:0.72rem;color:#6B7280;font-style:italic;margin-top:2px">'+lesson.topic+'</div>');
      h.push('</div>');
      h.push('<div style="font-size:0.62rem;color:#9CA3AF;padding:0 0.5rem;display:flex;align-items:center;flex-shrink:0;white-space:nowrap">'+p.start+'–'+p.end+'</div>');
      h.push('</div>');
    });
  }
  h.push('</div></div>');

  // RIGHT: Week grid
  const activeRows=TPERIODS.filter(p=>
    WDAYS.some(d=>getTodayLessons(d).some(l=>l.p.label===p.label&&l.p.start===p.start))
  );
  h.push('<div style="background:#fff;border-radius:12px;border:1px solid #E5E7EB;overflow:hidden">');
  h.push('<div style="background:#FEF2F2;border-bottom:1px solid #FECACA;padding:0.55rem 0.85rem;display:flex;align-items:center;justify-content:space-between">');
  h.push('<div style="font-weight:800;font-size:0.88rem;color:var(--red)">📅 Week Grid'+(weekNum?' · Wk '+weekNum:'')+'</div>');
  h.push('<div style="font-size:0.68rem;color:#9CA3AF;font-weight:700;cursor:pointer" onclick="S.tmGridOpen=!S.tmGridOpen;render()">'+(S.tmGridOpen?'▲ collapse':'▼ expand')+'</div>');
  h.push('</div>');
  if(S.tmGridOpen!==false){
    h.push('<div style="overflow-x:auto;padding:0.5rem 0.65rem">');
    h.push('<table style="border-collapse:collapse;width:100%;font-size:0.8rem"><thead><tr>');
    h.push('<th style="padding:5px 8px;color:#9CA3AF;font-weight:700;text-align:left;font-size:0.72rem;white-space:nowrap">Period</th>');
    WDAYS.forEach(d=>{
      const dc=THAI_DAY_COLORS[d]||{bg:"#F9FAFB",text:"#374151"};
      const isToday=d===realToday;
      const cnt=getTodayLessons(d).length;
      h.push('<th style="padding:5px 10px;text-align:left;background:'+(isToday?dc.bg:'#F9FAFB')+';color:'+(isToday?dc.text:'#374151')+';font-weight:800;border-radius:4px 4px 0 0;min-width:90px">'+d.slice(0,3)+(cnt?' <span style="font-size:0.62rem;font-weight:600;opacity:0.7">('+cnt+')</span>':'')+'</th>');
    });
    h.push('</tr></thead><tbody>');
    activeRows.forEach((p,ri)=>{
      h.push('<tr style="background:'+(ri%2===0?'#fff':'#FAFAFA')+'">');
      h.push('<td style="padding:5px 8px;font-weight:700;color:#9CA3AF;font-size:0.72rem;white-space:nowrap;border-right:1px solid #F3F4F6;vertical-align:top">'+p.label+'<br><span style="font-size:0.62rem;font-weight:500;color:#D1D5DB">'+p.start+'</span></td>');
      WDAYS.forEach(d=>{
        const lessons=getTodayLessons(d).filter(l=>l.p.label===p.label&&l.p.start===p.start);
        const isNow=d===realToday&&timeToMins(p.start)<=nowMins&&nowMins<timeToMins(p.end);
        if(lessons.length>0){
          const lesson=lessons[0];
          const col=subColor(lesson.sub);
          const shortTopic=lesson.topic?lesson.topic.split('—').slice(-1)[0].split(':')[0].trim():null;
          h.push('<td style="padding:5px 8px;vertical-align:top;border-radius:5px;background:'+(isNow?col+'12':'transparent')+';border:1px solid '+(isNow?col+'44':'transparent')+';min-width:90px">');
          h.push('<div style="font-weight:800;font-size:0.82rem;color:'+col+'">'+lesson.sub+'</div>');
          h.push('<div style="font-size:0.68rem;font-weight:700;color:'+teacher.color+';margin-top:1px">'+lesson.cls+'</div>');
          if(shortTopic)h.push('<div style="font-size:0.65rem;color:#6B7280;font-style:italic;margin-top:1px">'+shortTopic+'</div>');
          h.push('</td>');
        } else {
          h.push('<td style="padding:5px 8px;min-width:90px"><div style="color:#E5E7EB;font-size:0.78rem">—</div></td>');
        }
      });
      h.push('</tr>');
    });
    h.push('</tbody></table></div>');
  }
  h.push('</div>');

  h.push('</div>'); // end two-col

  // ── SCHOOL CALENDAR (same as class view) ─────────────────────────────────
  (()=>{
    const now=new Date();
    const defaultMonth=now.toISOString().slice(0,7);
    const monthKey=S.tmCalMonth||defaultMonth;
    const calData=SCHOOL_CALENDAR[monthKey];
    const availableMonths=Object.keys(SCHOOL_CALENDAR);
    const typeStyle={
      holiday:{bg:"#fee2e2",text:"#dc2626",dot:"#ef4444"},
      break:   {bg:"#fef9c3",text:"#92400e",dot:"#f59e0b"},
      event:   {bg:"#dbeafe",text:"#1d4ed8",dot:"#3b82f6"},
      exam:    {bg:"#ede9fe",text:"#6d28d9",dot:"#8b5cf6"}
    };
    h.push('<div style="background:#fff;border-radius:12px;box-shadow:0 1px 4px rgba(26,43,74,0.06);border:1px solid #E4E8EE;overflow:hidden">');
    h.push('<div style="display:flex;align-items:center;padding:0.6rem 0.9rem;border-bottom:1px solid #f1f5f9;gap:0.4rem;flex-wrap:wrap">');
    h.push('<div style="font-weight:800;font-size:0.82rem;color:#111827;margin-right:0.25rem">&#128197; School Calendar</div>');
    availableMonths.forEach(mk=>{
      const isActive=mk===monthKey;
      const mn=SCHOOL_CALENDAR[mk].name.split(" ")[0];
      h.push('<button onclick="S.tmCalMonth=\''+mk+'\';render()" style="padding:0.25rem 0.6rem;border-radius:20px;border:none;cursor:pointer;font-family:\'Nunito\',sans-serif;font-weight:700;font-size:0.7rem;background:'+(isActive?'var(--red)':'#f1f5f9')+';color:'+(isActive?'#fff':'#64748b')+'">'+mn+'</button>');
    });
    h.push('</div>');
    if(calData){
      const monthDate=new Date(monthKey+"-01T12:00:00");
      const year=monthDate.getFullYear();
      const month=monthDate.getMonth();
      const firstDay=new Date(year,month,1).getDay();
      const daysInMonth=new Date(year,month+1,0).getDate();
      h.push('<div style="padding:0.75rem 0.9rem">');
      h.push('<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;margin-bottom:4px">');
      ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].forEach(d=>{
        const dc=THAI_DAY_COLORS[d]||{bg:"#e2e8f0",text:"#64748b"};
        h.push('<div style="text-align:center;font-size:0.62rem;font-weight:800;color:'+dc.text+';background:'+dc.bg+';border-radius:4px;padding:2px 0">'+d.slice(0,3)+'</div>');
      });
      h.push('</div>');
      h.push('<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px">');
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
        h.push('<div style="border-radius:6px;padding:3px 2px;min-height:44px;background:'+cellBg+';border:1px solid '+(isToday?"var(--red-dark,#991B1B)":"#f1f5f9")+';position:relative" title="'+(topEntry?topEntry.label:"")+'">');
        h.push('<div style="font-size:0.68rem;font-weight:'+(isToday||topEntry?"800":"600")+';color:'+cellText+';text-align:center">'+day+'</div>');
        if(topEntry)h.push('<div style="font-size:0.47rem;font-weight:700;color:'+cellText+';text-align:center;line-height:1.2;padding:0 1px;overflow:hidden">'+topEntry.label.slice(0,20)+(topEntry.label.length>20?"…":"")+'</div>');
        if(entries.length>1)h.push('<div style="position:absolute;top:2px;right:2px;width:5px;height:5px;border-radius:50%;background:'+(typeStyle[entries[1].type]?.dot||"#94a3b8")+'"></div>');
        h.push('</div>');
      }
      h.push('</div>');
      h.push('<div style="display:flex;gap:0.6rem;margin-top:0.6rem;flex-wrap:wrap">');
      Object.entries(typeStyle).forEach(([type,s])=>{
        h.push('<div style="display:flex;align-items:center;gap:3px"><div style="width:8px;height:8px;border-radius:50%;background:'+s.dot+'"></div><span style="font-size:0.62rem;color:#64748b;font-weight:700;text-transform:capitalize">'+type+'</span></div>');
      });
      h.push('</div>');
      h.push('</div>');
    }
    h.push('</div>');
  })();

  h.push('</div>'); // end outer padding
  return h.join('');
}


function renderCheckin(){
  const cls=S.cls;
  const students=cls==="K1A"?K1A_STUDENTS:(DB.studentRows[cls]||[]);
  const allDone=students.length>0&&students.every(s=>ciComplete(getCI(cls,s.id)));
  const presentCount=students.filter(s=>{const ci=getCI(cls,s.id);return ci&&ci.arrived;}).length;
  const absentCount=students.filter(s=>{const ci=getCI(cls,s.id);return ci&&!ci.arrived;}).length;

  return`<div style="padding:1rem">
    <div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:0.75rem;flex-wrap:wrap">
      <div style="font-size:1rem;font-weight:800;color:#111827">🌅 Morning Check-in · ${todayKey()}</div>
      <div style="margin-left:auto;display:flex;gap:0.4rem">
        ${["K1A","K1B","K2A","K2B","K3A","K3B","K1/1","K1/2","K1/3","K2/1","K2/2","K2/3","K3/1","K3/2","K3/3","K3/4"].map(c=>`<button class="btn ${S.cls===c?"btn-primary":""}" style="${S.cls!==c?"background:#F9FAFB;color:#6B7280;border:1px solid #E5E7EB":""}" onclick="S.cls='${c}';render()">${c}</button>`).join("")}
      </div>
    </div>
    <div style="display:flex;gap:0.5rem;margin-bottom:0.75rem;flex-wrap:wrap">
      <div style="background:#dcfce7;border-radius:8px;padding:0.4rem 0.8rem;font-size:0.78rem;font-weight:700;color:#15803d">✓ Present: ${presentCount}</div>
      <div style="background:#dbeafe;border-radius:8px;padding:0.4rem 0.8rem;font-size:0.78rem;font-weight:700;color:#1d4ed8">✗ Absent: ${absentCount}</div>
      <div style="background:#f0f4f8;border-radius:8px;padding:0.4rem 0.8rem;font-size:0.78rem;font-weight:700;color:#64748b">⭕ Pending: ${students.length-presentCount-absentCount}</div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(90px,1fr));gap:0.6rem">
      ${students.map(s=>{
        const ci=getCI(cls,s.id);
        const bg=ciColor(ci);
        const av=stuAvatarColor(s);
        return`<div class="stu-card" style="border-color:${bg==='"#e2e8f0"'?"#e2e8f0":bg};background:${bg}22" onclick="openCheckinPopup('${cls}',${s.id})">
          <div style="width:42px;height:42px;margin:0 auto 4px">${avatarSVG(s.gender,av.color)}</div>
          <div class="ci-name">${s.nickname||s.name}</div>
          <div class="ci-mood">${ci&&ci.mood?MOODS.find(m=>m.label===ci.mood)?.emoji||"":"❔"}</div>
        </div>`;
      }).join("")}
    </div>
    ${renderIssuesSummary(cls,students)}
  </div>`;
}

function renderIssuesSummary(cls,students){
  const issues=students.map(s=>{
    const ci=getCI(cls,s.id);
    if(!ci||!ciComplete(ci))return null;
    const flags=[];
    if(!ci.arrived)flags.push("Absent");
    else if(ci.arrivalTime==="late")flags.push("Late");
    else if(ci.arrivalTime==="very-late")flags.push("Very Late");
    if(!ci.uniform)flags.push("Uniform Issue");
    if(ci.injury)flags.push("⚠️ Injury");
    EQUIP_ITEMS.forEach(item=>{if(ci.equip&&ci.equip[item]===false)flags.push("Missing: "+item);});
    return flags.length>0?{s,flags,ci}:null;
  }).filter(Boolean);
  if(issues.length===0)return"";
  return`<div style="margin-top:1rem;background:#fff;border-radius:14px;padding:0.9rem;box-shadow:0 1px 6px rgba(0,0,0,0.07)">
    <div style="font-weight:800;color:#B91C1C;margin-bottom:0.5rem">⚠️ Issues Today</div>
    ${issues.map(({s,flags,ci})=>`<div style="display:flex;align-items:flex-start;gap:0.5rem;margin-bottom:0.4rem;padding:0.4rem;background:#fef2f2;border-radius:8px">
      <div style="font-weight:700;color:#111827;min-width:60px">${s.nickname||s.name}</div>
      <div style="flex:1;font-size:0.72rem;color:#ef4444">${flags.join(" · ")}</div>
      ${ci.injuryDriveLink?`<a href="${ci.injuryDriveLink}" target="_blank" style="font-size:0.68rem;color:#2563eb">📷 Photo</a>`:""}
    </div>`).join("")}
  </div>`;
}

function openCheckinPopup(cls,studentId){
  popupActive=true;
  const students=cls==="K1A"?K1A_STUDENTS:(DB.studentRows[cls]||[]);
  const stu=students.find(s=>s.id===studentId)||{name:"Student",id:studentId,gender:"M"};
  const existing=getCI(cls,studentId)||{};
  const existingDL=getDL(cls,studentId)||{};
  let draft={
    arrived:existing.arrived??true,
    arrivalTime:existing.arrivalTime||"on-time",
    uniform:existing.uniform??true,
    injury:existing.injury??false,
    injuryNote:existing.injuryNote||"",
    injuryDriveLink:existing.injuryDriveLink||"",
    mood:existing.mood||"",
    equip:{...Object.fromEntries(EQUIP_ITEMS.map(i=>[i,true])),...(existing.equip||{})},
    note:existing.note||"",
    // Daily tracking
    behaviour:existingDL.behaviour||"",
    participation:existingDL.participation||"",
    effort:existingDL.effort||"",
    strength:existingDL.strength||""
  };

  S.popup={type:"checkin",cls,studentId,stu,draft};
  render();
  setTimeout(()=>wireCheckinPopup(cls,studentId,draft),30);
}

function wireCheckinPopup(cls,studentId,draft){
  const box=document.getElementById("ci-popup-box");
  if(!box)return;

  function tog(sel,field,val){
    box.querySelectorAll(sel).forEach(b=>{
      const isOn=b.dataset.val===String(val);
      b.style.background=isOn?"#2563eb":"#f1f5f9";
      b.style.color=isOn?"#fff":"#1e3a5f";
    });
  }

  function refresh(){
    // Refresh equip display
    EQUIP_ITEMS.forEach(item=>{
      const btn=box.querySelector(`[data-equip="${item}"]`);
      if(btn){
        btn.style.background=draft.equip[item]?"#dcfce7":"#fee2e2";
        btn.style.color=draft.equip[item]?"#15803d":"#dc2626";
        btn.textContent=(draft.equip[item]?"✓ ":"✗ ")+item;
      }
    });
    // injury note
    const injDiv=box.querySelector("#injury-detail");
    if(injDiv)injDiv.style.display=draft.injury?"block":"none";
    // Save button
    const saveBtn=box.querySelector("#ci-save-btn");
    if(saveBtn){
      const ready=draft.mood&&(draft.arrived===false||(draft.arrived&&draft.arrivalTime));
      saveBtn.disabled=!ready;
      saveBtn.style.opacity=ready?"1":"0.5";
    }
  }

  // Arrived buttons
  box.querySelectorAll(".ci-arrived").forEach(b=>{
    b.onclick=()=>{
      draft.arrived=b.dataset.val==="true";
      tog(".ci-arrived","arrived",draft.arrived);
      refresh();
    };
  });
  // Arrival time
  box.querySelectorAll(".ci-atime").forEach(b=>{
    b.onclick=()=>{
      draft.arrivalTime=b.dataset.val;
      tog(".ci-atime","arrivalTime",draft.arrivalTime);
      refresh();
    };
  });
  // Uniform
  box.querySelectorAll(".ci-uniform").forEach(b=>{
    b.onclick=()=>{
      draft.uniform=b.dataset.val==="true";
      tog(".ci-uniform","uniform",draft.uniform);
      refresh();
    };
  });
  // Injury
  box.querySelectorAll(".ci-injury").forEach(b=>{
    b.onclick=()=>{
      draft.injury=b.dataset.val==="true";
      tog(".ci-injury","injury",draft.injury);
      refresh();
    };
  });
  // Equip
  EQUIP_ITEMS.forEach(item=>{
    const btn=box.querySelector(`[data-equip="${item}"]`);
    if(btn)btn.onclick=()=>{draft.equip[item]=!draft.equip[item];refresh();};
  });
  // Mood
  box.querySelectorAll(".ci-mood").forEach(b=>{
    b.onclick=()=>{
      draft.mood=b.dataset.mood;
      box.querySelectorAll(".ci-mood").forEach(x=>x.style.outline="none");
      b.style.outline="3px solid #2563eb";
      refresh();
    };
  });
  // Injury note/link
  const injNote=box.querySelector("#injury-note");
  if(injNote)injNote.oninput=e=>{draft.injuryNote=e.target.value;};
  const injLink=box.querySelector("#injury-link");
  if(injLink)injLink.oninput=e=>{draft.injuryDriveLink=e.target.value;};
  // General note
  const noteEl=box.querySelector("#ci-note");
  if(noteEl)noteEl.oninput=e=>{draft.note=e.target.value;};
  // Behaviour / Participation / Effort / Strength
  box.querySelectorAll(".ci-beh").forEach(b=>b.onclick=()=>{draft.behaviour=b.dataset.val;box.querySelectorAll(".ci-beh").forEach(x=>x.style.opacity="0.45");b.style.opacity="1";refresh();});
  box.querySelectorAll(".ci-par").forEach(b=>b.onclick=()=>{draft.participation=b.dataset.val;box.querySelectorAll(".ci-par").forEach(x=>x.style.opacity="0.45");b.style.opacity="1";refresh();});
  box.querySelectorAll(".ci-eff").forEach(b=>b.onclick=()=>{draft.effort=b.dataset.val;box.querySelectorAll(".ci-eff").forEach(x=>x.style.opacity="0.45");b.style.opacity="1";refresh();});
  box.querySelectorAll(".ci-str").forEach(b=>b.onclick=()=>{draft.strength=b.dataset.val==="toggle-off"?"":b.dataset.val;box.querySelectorAll(".ci-str").forEach(x=>{x.style.background="#f1f5f9";x.style.color="#475569";});if(draft.strength){b.style.background="#2563eb";b.style.color="#fff";}refresh();});
  // Save
  const saveBtn=box.querySelector("#ci-save-btn");
  if(saveBtn)saveBtn.onclick=()=>{
    saveCI(cls,studentId,draft);
    // Also save daily log if any tracking data present
    if(draft.behaviour||draft.participation||draft.effort||draft.strength){
      saveDL(cls,studentId,{
        behaviour:draft.behaviour,
        participation:draft.participation,
        effort:draft.effort,
        strength:draft.strength,
        mood:draft.mood,
        note:draft.note
      });
    }
    S.popup=null;popupActive=false;render();
  };
  // Cancel
  const cancelBtn=box.querySelector("#ci-cancel-btn");
  if(cancelBtn)cancelBtn.onclick=()=>{S.popup=null;popupActive=false;render();};

  tog(".ci-arrived","arrived",draft.arrived);
  tog(".ci-atime","arrivalTime",draft.arrivalTime);
  tog(".ci-uniform","uniform",draft.uniform);
  tog(".ci-injury","injury",draft.injury);
  refresh();
}

function renderPopup(){
  if(!S.popup)return"";
  if(S.popup.type==="checkin")return renderCheckinPopup();
  if(S.popup.type==="period")return renderPeriodPopup();
  if(S.popup.type==="resourcePreview")return renderResourcePreviewPopup();
  if(S.popup.type==="dailyLog")return renderDailyLogPopup();
  return"";
}

function openDailyLogPopup(cls,studentId,date){
  popupActive=true;
  const students=cls==="K1A"?K1A_STUDENTS:(DB.studentRows[cls]||[]);
  const stu=students.find(s=>s.id===studentId)||{name:"Student",id:studentId,gender:"M"};
  const existing=getDL(cls,studentId,date)||{};
  const draft={
    behaviour:existing.behaviour||"",
    participation:existing.participation||"",
    effort:existing.effort||"",
    strength:existing.strength||"",
    note:existing.note||""
  };
  S.popup={type:"dailyLog",cls,studentId,stu,date,draft};
  render();
  setTimeout(()=>wireDailyLogPopup(cls,studentId,date,draft),30);
}

function wireDailyLogPopup(cls,studentId,date,draft){
  const box=document.getElementById("dl-popup-box");
  if(!box)return;

  function highlight(sel,val){
    box.querySelectorAll(sel).forEach(b=>{
      const on=b.dataset.val===val;
      b.style.background=on?"#2563eb":"#f1f5f9";
      b.style.color=on?"#fff":"#475569";
      b.style.opacity=on?1:val?0.5:1;
    });
  }

  box.querySelectorAll(".dl-beh").forEach(b=>b.onclick=()=>{draft.behaviour=b.dataset.val;highlight(".dl-beh",draft.behaviour);});
  box.querySelectorAll(".dl-par").forEach(b=>b.onclick=()=>{draft.participation=b.dataset.val;highlight(".dl-par",draft.participation);});
  box.querySelectorAll(".dl-eff").forEach(b=>b.onclick=()=>{draft.effort=b.dataset.val;highlight(".dl-eff",draft.effort);});
  box.querySelectorAll(".dl-str").forEach(b=>b.onclick=()=>{
    draft.strength=draft.strength===b.dataset.val?"":b.dataset.val;
    box.querySelectorAll(".dl-str").forEach(x=>{x.style.background="#f1f5f9";x.style.color="#475569";});
    if(draft.strength){const sel=box.querySelector(`.dl-str[data-val="${draft.strength}"]`);if(sel){sel.style.background="#7c3aed";sel.style.color="#fff";}}
  });
  const noteEl=box.querySelector("#dl-note");
  if(noteEl)noteEl.oninput=e=>{draft.note=e.target.value;};

  box.querySelector("#dl-save").onclick=()=>{
    // Save daily log with the specific date
    const key=dlKey(cls,studentId,date);
    DB.dailyLogs={...DB.dailyLogs,[key]:{...draft,cls,studentId,date}};
    pushDB();
    S.popup=null;popupActive=false;render();
  };
  box.querySelector("#dl-cancel").onclick=()=>{S.popup=null;popupActive=false;render();};

  // Restore existing selections
  highlight(".dl-beh",draft.behaviour);
  highlight(".dl-par",draft.participation);
  highlight(".dl-eff",draft.effort);
  if(draft.strength){const sel=box.querySelector(`.dl-str[data-val="${draft.strength}"]`);if(sel){sel.style.background="#7c3aed";sel.style.color="#fff";}}
}

function renderDailyLogPopup(){
  const{stu,date,draft}=S.popup;
  const dayName=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][new Date(date+"T12:00:00").getDay()];
  const av=stuAvatarColor(stu);
  return`<div class="modal-bg" onclick="if(event.target===this){S.popup=null;popupActive=false;render()}">
    <div class="modal-box" id="dl-popup-box" style="max-width:400px">
      <div style="display:flex;align-items:center;gap:0.7rem;margin-bottom:1rem">
        <div style="width:44px;height:44px">${avatarSVG(stu.gender,av.color)}</div>
        <div>
          <div style="font-weight:800;font-size:1rem;color:#111827">${stu.nickname||stu.name}</div>
          <div style="font-size:0.72rem;color:#64748b">${dayName} · ${date}</div>
        </div>
        <button onclick="S.popup=null;popupActive=false;render()" style="margin-left:auto;background:none;border:none;cursor:pointer;color:#94a3b8;font-size:1.1rem">✕</button>
      </div>

      <div style="margin-bottom:0.75rem">
        <div style="font-weight:700;font-size:0.72rem;color:#64748b;margin-bottom:0.35rem">😇 BEHAVIOUR</div>
        <div style="display:flex;gap:0.3rem;flex-wrap:wrap">
          ${BEHAVIOUR_OPTS.map(o=>`<button class="dl-beh btn-sm" data-val="${o.val}" style="background:#f1f5f9;color:#475569">${o.label}</button>`).join("")}
        </div>
      </div>

      <div style="margin-bottom:0.75rem">
        <div style="font-weight:700;font-size:0.72rem;color:#64748b;margin-bottom:0.35rem">🙋 PARTICIPATION</div>
        <div style="display:flex;gap:0.3rem;flex-wrap:wrap">
          ${PARTICIPATION_OPTS.map(o=>`<button class="dl-par btn-sm" data-val="${o.val}" style="background:#f1f5f9;color:#475569">${o.label}</button>`).join("")}
        </div>
      </div>

      <div style="margin-bottom:0.75rem">
        <div style="font-weight:700;font-size:0.72rem;color:#64748b;margin-bottom:0.35rem">⭐ EFFORT</div>
        <div style="display:flex;gap:0.3rem;flex-wrap:wrap">
          ${EFFORT_OPTS.map(o=>`<button class="dl-eff btn-sm" data-val="${o.val}" style="background:#f1f5f9;color:#475569">${o.label}</button>`).join("")}
        </div>
      </div>

      <div style="margin-bottom:0.75rem">
        <div style="font-weight:700;font-size:0.72rem;color:#64748b;margin-bottom:0.35rem">💜 STRENGTH SPOTTED</div>
        <div style="display:flex;gap:0.3rem;flex-wrap:wrap">
          ${STRENGTH_OPTS.map(s=>`<button class="dl-str btn-sm" data-val="${s}" style="background:#f1f5f9;color:#475569">${s}</button>`).join("")}
        </div>
      </div>

      <div style="margin-bottom:0.9rem">
        <div style="font-weight:700;font-size:0.72rem;color:#64748b;margin-bottom:0.35rem">📝 NOTE</div>
        <textarea id="dl-note" placeholder="Optional note for today..." style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:0.5rem;font-size:0.75rem;height:55px;resize:none;font-family:'Nunito',sans-serif">${draft.note||""}</textarea>
      </div>

      <div style="display:flex;gap:0.5rem">
        <button id="dl-save" class="btn btn-primary" style="flex:1">💾 Save</button>
        <button id="dl-cancel" class="btn" style="background:#f1f5f9;color:#64748b">Cancel</button>
      </div>
    </div>
  </div>`;
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

function renderCheckinPopup(){
  const{cls,stu,draft}=S.popup;
  const av=stuAvatarColor(stu);
  return`<div class="modal-bg" onclick="if(event.target===this){S.popup=null;popupActive=false;render()}">
    <div class="modal-box" id="ci-popup-box">
      <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem">
        <div style="width:52px;height:52px">${avatarSVG(stu.gender,av.color)}</div>
        <div>
          <div style="font-weight:800;font-size:1.1rem;color:#111827">${stu.name}</div>
          <div style="font-size:0.75rem;color:#64748b">${cls} · Check-in</div>
        </div>
      </div>

      <div style="margin-bottom:0.8rem">
        <div style="font-weight:700;font-size:0.78rem;color:#64748b;margin-bottom:0.3rem">ATTENDANCE</div>
        <div class="toggle-row">
          <button class="tog ci-arrived" data-val="true" style="color:#15803d">✓ Present</button>
          <button class="tog ci-arrived" data-val="false" style="color:#dc2626">✗ Absent</button>
        </div>
        <div class="toggle-row" style="margin-top:0.3rem">
          <button class="tog ci-atime" data-val="on-time" style="color:#15803d;font-size:0.67rem">On time</button>
          <button class="tog ci-atime" data-val="late" style="color:#f59e0b;font-size:0.67rem">Late</button>
          <button class="tog ci-atime" data-val="very-late" style="color:#ef4444;font-size:0.67rem">Very Late</button>
        </div>
      </div>

      <div style="margin-bottom:0.8rem">
        <div style="font-weight:700;font-size:0.78rem;color:#64748b;margin-bottom:0.3rem">UNIFORM</div>
        <div class="toggle-row">
          <button class="tog ci-uniform" data-val="true" style="color:#15803d">✓ OK</button>
          <button class="tog ci-uniform" data-val="false" style="color:#dc2626">✗ Issue</button>
        </div>
      </div>

      <div style="margin-bottom:0.8rem">
        <div style="font-weight:700;font-size:0.78rem;color:#64748b;margin-bottom:0.3rem">EQUIPMENT</div>
        <div class="toggle-row">
          ${EQUIP_ITEMS.map(item=>`<button class="tog" data-equip="${item}" style="color:#15803d;background:#dcfce7">✓ ${item}</button>`).join("")}
        </div>
      </div>

      <div style="margin-bottom:0.8rem">
        <div style="font-weight:700;font-size:0.78rem;color:#64748b;margin-bottom:0.3rem">INJURY CHECK</div>
        <div class="toggle-row">
          <button class="tog ci-injury" data-val="false" style="color:#15803d">✓ No injury</button>
          <button class="tog ci-injury" data-val="true" style="color:#dc2626">⚠️ Injury found</button>
        </div>
        <div id="injury-detail" style="display:none;margin-top:0.4rem">
          <textarea id="injury-note" placeholder="Describe injury..." style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:0.5rem;font-size:0.75rem;height:60px;resize:none">${draft.injuryNote||""}</textarea>
          <input id="injury-link" type="url" placeholder="Google Drive photo link (optional)" value="${draft.injuryDriveLink||""}" style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:0.4rem 0.5rem;font-size:0.72rem;margin-top:4px"/>
        </div>
      </div>

      <div style="margin-bottom:0.8rem">
        <div style="font-weight:700;font-size:0.78rem;color:#64748b;margin-bottom:0.3rem">MOOD</div>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
          ${MOODS.map(m=>`<button class="ci-mood" data-mood="${m.label}" style="font-size:1.4rem;background:none;border:2px solid transparent;border-radius:10px;cursor:pointer;padding:4px 6px;transition:all 0.15s" title="${m.label}">${m.emoji}</button>`).join("")}
        </div>
      </div>


      <div style="border-top:1px solid #e2e8f0;margin:0.6rem 0 0.6rem;padding-top:0.6rem">
        <div style="font-size:0.72rem;font-weight:800;color:#111827;margin-bottom:0.5rem">📊 TODAY'S TRACKING</div>

        <div style="margin-bottom:0.6rem">
          <div style="font-weight:700;font-size:0.72rem;color:#64748b;margin-bottom:0.3rem">BEHAVIOUR</div>
          <div style="display:flex;gap:0.3rem;flex-wrap:wrap">
            ${BEHAVIOUR_OPTS.map(o=>`<button class="ci-beh btn-sm" data-val="${o.val}" style="background:#f1f5f9;color:#475569;opacity:${draft.behaviour===o.val?1:draft.behaviour?0.45:1}">${o.label}</button>`).join("")}
          </div>
        </div>

        <div style="margin-bottom:0.6rem">
          <div style="font-weight:700;font-size:0.72rem;color:#64748b;margin-bottom:0.3rem">PARTICIPATION</div>
          <div style="display:flex;gap:0.3rem;flex-wrap:wrap">
            ${PARTICIPATION_OPTS.map(o=>`<button class="ci-par btn-sm" data-val="${o.val}" style="background:#f1f5f9;color:#475569;opacity:${draft.participation===o.val?1:draft.participation?0.45:1}">${o.label}</button>`).join("")}
          </div>
        </div>

        <div style="margin-bottom:0.6rem">
          <div style="font-weight:700;font-size:0.72rem;color:#64748b;margin-bottom:0.3rem">EFFORT</div>
          <div style="display:flex;gap:0.3rem;flex-wrap:wrap">
            ${EFFORT_OPTS.map(o=>`<button class="ci-eff btn-sm" data-val="${o.val}" style="background:#f1f5f9;color:#475569;opacity:${draft.effort===o.val?1:draft.effort?0.45:1}">${o.label}</button>`).join("")}
          </div>
        </div>

        <div style="margin-bottom:0.6rem">
          <div style="font-weight:700;font-size:0.72rem;color:#64748b;margin-bottom:0.3rem">STRENGTH SPOTTED TODAY</div>
          <div style="display:flex;gap:0.3rem;flex-wrap:wrap">
            ${STRENGTH_OPTS.map(s=>`<button class="ci-str btn-sm" data-val="${s}" style="background:${draft.strength===s?"#2563eb":"#f1f5f9"};color:${draft.strength===s?"#fff":"#475569"}">${s}</button>`).join("")}
          </div>
        </div>
      </div>

      <div style="margin-bottom:1rem">
        <div style="font-weight:700;font-size:0.78rem;color:#64748b;margin-bottom:0.3rem">NOTE</div>
        <textarea id="ci-note" placeholder="Optional note..." style="width:100%;border:1px solid #e2e8f0;border-radius:8px;padding:0.5rem;font-size:0.75rem;height:55px;resize:none">${draft.note||""}</textarea>
      </div>

      <div style="display:flex;gap:0.5rem">
        <button id="ci-save-btn" class="btn btn-primary" style="flex:1" disabled>💾 Save Check-in</button>
        <button id="ci-cancel-btn" class="btn" style="background:#f1f5f9;color:#64748b">Cancel</button>
      </div>
    </div>
  </div>`;
}

// ── PERIOD POPUP ──────────────────────────────────────────────────────────────
function openPeriodPopup(cls,periodIdx,day){
  const period=(TIMETABLE[cls][day]||[])[periodIdx];
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
  const matchedRes=(DB.resources||[]).filter(r=>r.subject&&subj&&subj.includes(r.subject));
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


function renderAnalytics(){
  const editBar=`<div style="position:absolute;top:8px;right:8px;z-index:10;display:flex;gap:6px;align-items:center">
    <select style="font-size:0.72rem;border:1px solid #e2e8f0;border-radius:6px;padding:2px 6px" onchange="S.anCls=this.value;render()">
      <option value="K1A" ${S.anCls==="K1A"?"selected":""}>K1A</option>
      <option value="K1B" ${S.anCls==="K1B"?"selected":""}>K1B</option>
      <option value="K2A" ${S.anCls==="K2A"?"selected":""}>K2A</option>
      <option value="K2B" ${S.anCls==="K2B"?"selected":""}>K2B</option>
      <option value="K3A" ${S.anCls==="K3A"?"selected":""}>K3A</option>
      <option value="K3B" ${S.anCls==="K3B"?"selected":""}>K3B</option>
      <option value="K1/1" ${S.anCls==="K1/1"?"selected":""}>K1/1</option>
      <option value="K1/2" ${S.anCls==="K1/2"?"selected":""}>K1/2</option>
      <option value="K1/3" ${S.anCls==="K1/3"?"selected":""}>K1/3</option>
      <option value="K2/1" ${S.anCls==="K2/1"?"selected":""}>K2/1</option>
      <option value="K2/2" ${S.anCls==="K2/2"?"selected":""}>K2/2</option>
      <option value="K2/3" ${S.anCls==="K2/3"?"selected":""}>K2/3</option>
      <option value="K3/1" ${S.anCls==="K3/1"?"selected":""}>K3/1</option>
      <option value="K3/2" ${S.anCls==="K3/2"?"selected":""}>K3/2</option>
      <option value="K3/3" ${S.anCls==="K3/3"?"selected":""}>K3/3</option>
      <option value="K3/4" ${S.anCls==="K3/4"?"selected":""}>K3/4</option>
    </select>
    <select style="font-size:0.72rem;border:1px solid #e2e8f0;border-radius:6px;padding:2px 6px" onchange="S.anRange=Number(this.value);render()">
      <option value="7" ${S.anRange===7?"selected":""}>7 days</option>
      <option value="14" ${S.anRange===14?"selected":""}>14 days</option>
      <option value="30" ${S.anRange===30?"selected":""}>30 days</option>
    </select>
    ${S.anEditMode
      ?`<button class="btn-sm btn-primary" onclick="S.anEditMode=false;render()">✓ Done</button>
         <button class="btn-sm" style="background:#f1f5f9;color:#64748b" onclick="resetPanelLayouts('an-container',6);makePanelsDraggable(true)">↺ Reset</button>`
      :`<button class="btn-sm" style="background:#f1f5f9;color:#64748b" onclick="S.anEditMode=true;render()">⊞ Edit Layout</button>`}
  </div>`;

  const panels=[
    {pid:"an-attendance",title:"📅 Attendance (days)",canvas:"chart-attendance"},
    {pid:"an-mood",title:"😊 Mood Distribution",canvas:"chart-mood"},
    {pid:"an-arrival",title:"🕐 Arrival Times",canvas:"chart-arrival"},
    {pid:"an-equip",title:"🎒 Equipment Missing",canvas:"chart-equip"},
    {pid:"an-heatmap",title:"👤 Student Heatmap",canvas:"chart-heatmap"},
    {pid:"an-summary",title:"📋 Summary",canvas:null}
  ];

  const defaultPositions=[
    {left:8,top:8,w:300,h:220},
    {left:320,top:8,w:260,h:220},
    {left:592,top:8,w:260,h:220},
    {left:8,top:240,w:300,h:220},
    {left:320,top:240,w:340,h:220},
    {left:672,top:240,w:180,h:220}
  ];

  const panelHTML=panels.map((p,i)=>{
    const pos=defaultPositions[i];
    return`<div class="panel" data-pid="${p.pid}" style="left:${pos.left}px;top:${pos.top}px;width:${pos.w}px;height:${pos.h}px">
      <div class="panel-header">${p.title}</div>
      <div class="panel-body" style="padding:0.3rem;overflow:hidden">
        ${p.canvas
          ?`<canvas id="${p.canvas}" style="width:100%;height:100%"></canvas>`
          :`<div id="${p.canvas||p.pid+"-body"}" style="padding:0.3rem;font-size:0.72rem;height:100%;overflow-y:auto"></div>`}
      </div>
      <div class="resize-handle"></div>
    </div>`;
  }).join("");

  return`<div id="an-container" style="position:absolute;inset:0;overflow:hidden">
    ${editBar}${panelHTML}
  </div>`;
}

function drawAnalyticsCharts(){
  const cls=S.anCls;
  const students=cls==="K1A"?K1A_STUDENTS:(DB.studentRows[cls]||[]);
  const days=[];
  const today=new Date();
  for(let i=S.anRange-1;i>=0;i--){
    const d=new Date(today);d.setDate(today.getDate()-i);
    days.push(d.toISOString().slice(0,10));
  }

  // Gather data
  function getSnapshotOrLive(dateKey){
    if(dateKey===todayKey())return Object.fromEntries(
      Object.entries(DB.checkins||{}).filter(([k])=>k.startsWith(dateKey+"_"+cls+"_"))
    );
    const snap=DB.snapshots[dateKey]||{};
    return Object.fromEntries(Object.entries(snap).filter(([k])=>k.includes("_"+cls+"_")));
  }

  const attendanceData=days.map(d=>{
    const snap=getSnapshotOrLive(d);
    return students.filter(s=>snap[d+"_"+cls+"_"+s.id]?.arrived).length;
  });

  const moodCounts={};
  MOODS.forEach(m=>moodCounts[m.label]=0);
  days.forEach(d=>{
    const snap=getSnapshotOrLive(d);
    students.forEach(s=>{
      const ci=snap[d+"_"+cls+"_"+s.id];
      if(ci&&ci.mood&&moodCounts[ci.mood]!==undefined)moodCounts[ci.mood]++;
    });
  });

  const arrivalCounts={late:0,"very-late":0,"on-time":0};
  days.forEach(d=>{
    const snap=getSnapshotOrLive(d);
    students.forEach(s=>{
      const ci=snap[d+"_"+cls+"_"+s.id];
      if(ci&&ci.arrived&&ci.arrivalTime)arrivalCounts[ci.arrivalTime]=(arrivalCounts[ci.arrivalTime]||0)+1;
    });
  });

  const equipMissing={};
  EQUIP_ITEMS.forEach(item=>equipMissing[item]=0);
  days.forEach(d=>{
    const snap=getSnapshotOrLive(d);
    students.forEach(s=>{
      const ci=snap[d+"_"+cls+"_"+s.id];
      if(ci&&ci.equip)EQUIP_ITEMS.forEach(item=>{if(ci.equip[item]===false)equipMissing[item]++;});
    });
  });

  function drawBar(canvasId,labels,data,colors){
    const canvas=document.getElementById(canvasId);
    if(!canvas)return;
    const ctx=canvas.getContext("2d");
    canvas.width=canvas.offsetWidth;canvas.height=canvas.offsetHeight;
    const cw=canvas.width,ch=canvas.height;
    const pad=30,barW=Math.max(4,Math.floor((cw-pad*2)/data.length)-4);
    const maxV=Math.max(...data,1);
    ctx.clearRect(0,0,cw,ch);
    ctx.fillStyle="#f8fafc";ctx.fillRect(0,0,cw,ch);
    // Grid lines
    ctx.strokeStyle="#e2e8f0";ctx.lineWidth=1;
    for(let i=0;i<=4;i++){
      const y=pad+(ch-pad*2)*(1-i/4);
      ctx.beginPath();ctx.moveTo(pad,y);ctx.lineTo(cw-4,y);ctx.stroke();
      ctx.fillStyle="#94a3b8";ctx.font="9px Nunito,sans-serif";ctx.textAlign="right";
      ctx.fillText(Math.round(maxV*i/4),pad-2,y+3);
    }
    data.forEach((v,i)=>{
      const x=pad+i*(barW+4);
      const barH=(v/maxV)*(ch-pad*2);
      const y=ch-pad-barH;
      ctx.fillStyle=Array.isArray(colors)?colors[i%colors.length]:colors;
      ctx.beginPath();ctx.roundRect(x,y,barW,barH,2);ctx.fill();
      if(labels[i]){
        ctx.fillStyle="#64748b";ctx.font="8px Nunito,sans-serif";ctx.textAlign="center";
        const lbl=labels[i].length>4?labels[i].slice(5):labels[i];
        ctx.fillText(lbl,x+barW/2,ch-2);
      }
    });
  }

  function drawDonut(canvasId,labels,data,colors){
    const canvas=document.getElementById(canvasId);
    if(!canvas)return;
    const ctx=canvas.getContext("2d");
    canvas.width=canvas.offsetWidth;canvas.height=canvas.offsetHeight;
    const cw=canvas.width,ch=canvas.height;
    const cx=cw*0.45,cy=ch/2,r=Math.min(cx,cy)-12,ri=r*0.55;
    const total=data.reduce((a,b)=>a+b,0)||1;
    ctx.clearRect(0,0,cw,ch);
    ctx.fillStyle="#f8fafc";ctx.fillRect(0,0,cw,ch);
    let angle=-Math.PI/2;
    data.forEach((v,i)=>{
      const slice=(v/total)*Math.PI*2;
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,angle,angle+slice);ctx.closePath();
      ctx.fillStyle=colors[i%colors.length];ctx.fill();
      angle+=slice;
    });
    ctx.beginPath();ctx.arc(cx,cy,ri,0,Math.PI*2);ctx.fillStyle="#f8fafc";ctx.fill();
    // Legend
    ctx.font="9px Nunito,sans-serif";ctx.textAlign="left";
    labels.forEach((lbl,i)=>{
      const lx=cw*0.6,ly=14+i*16-(labels.length*8);
      if(ly<0||ly>ch)return;
      ctx.fillStyle=colors[i%colors.length];ctx.fillRect(lx,ly+ch/2-labels.length*8,10,10);
      ctx.fillStyle="#475569";ctx.fillText(`${lbl} (${data[i]})`,lx+13,ly+ch/2-labels.length*8+9);
    });
  }

  // Attendance line (using bar)
  drawBar("chart-attendance",days,attendanceData,"#2563eb");
  // Mood donut
  drawDonut("chart-mood",MOODS.map(m=>m.label),MOODS.map(m=>moodCounts[m.label]||0),MOODS.map(m=>m.color));
  // Arrival bar
  drawBar("chart-arrival",["On Time","Late","Very Late"],[arrivalCounts["on-time"]||0,arrivalCounts.late||0,arrivalCounts["very-late"]||0],["#22c55e","#f59e0b","#ef4444"]);
  // Equip missing bar
  drawBar("chart-equip",EQUIP_ITEMS,EQUIP_ITEMS.map(i=>equipMissing[i]),["#ef4444","#f97316","#f59e0b","#eab308","#84cc16","#22c55e"]);

  // Heatmap
  const heatCanvas=document.getElementById("chart-heatmap");
  if(heatCanvas){
    heatCanvas.width=heatCanvas.offsetWidth;heatCanvas.height=heatCanvas.offsetHeight;
    const ctx=heatCanvas.getContext("2d");
    const cw=heatCanvas.width,ch=heatCanvas.height;
    ctx.clearRect(0,0,cw,ch);ctx.fillStyle="#f8fafc";ctx.fillRect(0,0,cw,ch);
    const nameW=55,cellW=Math.max(8,Math.floor((cw-nameW)/Math.min(days.length,14)));
    const cellH=Math.max(8,Math.floor((ch-16)/students.length));
    const showDays=days.slice(-Math.floor((cw-nameW)/cellW));
    students.forEach((s,si)=>{
      ctx.fillStyle="#475569";ctx.font="8px Nunito,sans-serif";ctx.textAlign="right";
      ctx.fillText((s.nickname||s.name).slice(0,7),nameW-2,16+si*cellH+cellH*0.6);
      showDays.forEach((d,di)=>{
        const snap=getSnapshotOrLive(d);
        const ci=snap[d+"_"+cls+"_"+s.id];
        let fill="#e2e8f0";
        if(ci){fill=ciColor(ci);}
        ctx.fillStyle=fill;
        ctx.beginPath();ctx.roundRect(nameW+di*cellW+1,16+si*cellH+1,cellW-2,cellH-2,2);ctx.fill();
      });
    });
    // Day labels
    ctx.fillStyle="#94a3b8";ctx.font="7px Nunito,sans-serif";ctx.textAlign="center";
    showDays.forEach((d,di)=>{
      if(di%3===0)ctx.fillText(d.slice(5),nameW+di*cellW+cellW/2,11);
    });
  }

  // Summary
  const summaryEl=document.getElementById("an-summary-body");
  if(summaryEl){
    const totalPresent=attendanceData.reduce((a,b)=>a+b,0);
    const totalChecks=days.length*students.length;
    const pct=totalChecks?Math.round(totalPresent/totalChecks*100):0;
    const topMood=MOODS.reduce((a,m)=>moodCounts[m.label]>moodCounts[a.label]?m:a,MOODS[0]);
    summaryEl.innerHTML=`
      <div style="display:flex;flex-direction:column;gap:clamp(3px,1.5cqi,8px);padding:clamp(0.2rem,1.5cqi,0.5rem)">
        <div class="an-stat" style="background:#dbeafe">
          <div class="an-stat-val">${pct}%</div>
          <div class="an-stat-lbl">Attendance Rate</div>
        </div>
        <div class="an-stat" style="background:#dcfce7">
          <div class="an-stat-val" style="color:#15803d">${topMood.emoji}</div>
          <div class="an-stat-lbl">Top Mood: ${topMood.label}</div>
        </div>
        <div class="an-stat-lbl" style="text-align:center">${students.length} students · ${S.anRange} days</div>
        <div class="an-stat-lbl" style="text-align:center;color:#94a3b8">🔴 Live · locks midnight</div>
      </div>`;
  }
}

// ── CLASSES TAB ───────────────────────────────────────────────────────────────
function renderClasses(){
  const cls=S.cls;
  const students=cls==="K1A"?K1A_STUDENTS:(DB.studentRows[cls]||[]);
  return`<div style="padding:1rem">
    <div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:0.75rem;flex-wrap:wrap">
      <div style="font-weight:800;font-size:1rem;color:#111827">👥 Class Roster</div>
      <div style="margin-left:auto;display:flex;gap:0.4rem">
        ${["K1A","K1B","K2A","K2B","K3A","K3B","K1/1","K1/2","K1/3","K2/1","K2/2","K2/3","K3/1","K3/2","K3/3","K3/4"].map(c=>`<button class="btn ${S.cls===c?"btn-primary":""}" style="${S.cls!==c?"background:#F9FAFB;color:#6B7280;border:1px solid #E5E7EB":""}" onclick="S.cls='${c}';render()">${c}</button>`).join("")}
      </div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:0.75rem">
      ${students.map(s=>{
        const av=stuAvatarColor(s);
        const ci=getCI(cls,s.id);
        return`<div style="background:#fff;border-radius:14px;padding:0.75rem;text-align:center;box-shadow:0 1px 6px rgba(0,0,0,0.07)">
          <div style="width:50px;height:50px;margin:0 auto 6px">${avatarSVG(s.gender,av.color)}</div>
          <div class="roster-name">${s.name}</div>
          <div class="roster-nick">${s.nickname||""}</div>
          <div style="width:10px;height:10px;border-radius:50%;background:${ciColor(ci)};margin:4px auto 0"></div>
        </div>`;
      }).join("")}
    </div>
  </div>`;
}

// ── RESOURCES TAB ─────────────────────────────────────────────────────────────
function renderResources(){
  const resources=DB.resources||[];
  const filtered=S.resSub==="All"?resources:resources.filter(r=>r.subject===S.resSub);
  return`<div style="padding:1rem">
    <div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:0.6rem;flex-wrap:wrap">
      <div style="font-weight:800;font-size:1rem;color:#111827">📚 Resources</div>
      <button class="btn btn-primary" style="margin-left:auto;font-size:0.72rem" onclick="openAddResourceModal()">+ Add</button>
    </div>
    <div class="scrl" style="display:flex;gap:0.3rem;margin-bottom:0.75rem;padding-bottom:4px">
      ${SUBJECTS_ALL.map(s=>`<button class="btn-sm" style="background:${S.resSub===s?"#2563eb":"#f1f5f9"};color:${S.resSub===s?"#fff":"#64748b"};white-space:nowrap;flex-shrink:0" onclick="S.resSub='${s}';render()">${s}</button>`).join("")}
    </div>
    ${filtered.length===0
      ?`<div style="text-align:center;color:#94a3b8;padding:2rem">No resources for this subject yet.</div>`
      :`<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:0.6rem">
        ${filtered.map((r,i)=>{
          const ti=typeInfo(r.type);
          const globalIdx=resources.indexOf(r);
          return`<div style="background:#fff;border-radius:14px;box-shadow:0 1px 6px rgba(0,0,0,0.07);overflow:hidden;border-top:3px solid ${ti.color}">
            <div style="padding:0.7rem 0.8rem">
              <div style="display:flex;align-items:flex-start;gap:0.4rem">
                <span style="font-size:1rem">${ti.icon}</span>
                <div style="flex:1">
                  <div style="font-weight:800;color:#111827;font-size:0.82rem">${r.name}</div>
                  <div style="font-size:0.67rem;color:#94a3b8">${r.subject||""} ${r.note?'· '+r.note:''}</div>
                </div>
                <button onclick="DB.resources.splice(${globalIdx},1);pushDB();render()" style="background:none;border:none;cursor:pointer;color:#94a3b8;font-size:0.8rem;padding:0">✕</button>
              </div>
              <div style="margin-top:0.5rem;display:flex;gap:0.3rem;flex-wrap:wrap">
                ${r.url.startsWith("http")||r.url.startsWith("/")
                  ? `<a href="${r.url}" target="_blank" class="btn-sm" style="background:#FEF2F2;color:#B91C1C;text-decoration:none">🔗 Open</a>`
                  : `<span class="btn-sm" style="background:#fef9c3;color:#92400e;cursor:default" title="Upload this PDF to your Netlify site root to enable this link">📎 ${r.url}</span>`}
                ${r.embedSrc?`<button class="btn-sm" style="background:#f1f5f9;color:#64748b" onclick="openResourcePreview('${globalIdx}')">👁 Preview</button>`:""}
              </div>
            </div>
          </div>`;
        }).join("")}
      </div>`}
  </div>`;
}

function openAddResourceModal(){
  const name=prompt("Resource name:");if(!name)return;
  const url=prompt("URL:");if(!url)return;
  const subject=prompt("Subject (e.g. English, Math, Phonics):")||"";
  const type=prompt("Type (Slides/Video/Doc/Sheet/Audio/PDF/Link):")||"Link";
  const note=prompt("Note (optional):")||"";
  const id=Date.now();
  DB.resources=[...(DB.resources||[]),{id,name,url,subject,type,note}];
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
function renderStudents(){
  const cls=S.cls;
  const students=cls==="K1A"?K1A_STUDENTS:(DB.studentRows[cls]||[]);
  const sw=getCurrentSchoolWeek();

  // If a student is selected, show their detail view
  if(S.stuSel!==null){
    const stu=students.find(s=>s.id===S.stuSel);
    if(stu)return renderStudentDetail(cls,stu,sw);
  }

  // Grid view — all students with today's log summary
  return`<div style="padding:1rem">
    <div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:0.75rem;flex-wrap:wrap">
      <div style="font-weight:800;font-size:1rem;color:#111827">👤 Students · ${cls}</div>
      ${sw?`<div style="font-size:0.72rem;color:#64748B;font-weight:700">Week ${sw.week} · ${sw.unit}</div>`:""}
      <div style="margin-left:auto;display:flex;gap:0.4rem">
        ${["K1A","K1B","K2A","K2B","K3A","K3B","K1/1","K1/2","K1/3","K2/1","K2/2","K2/3","K3/1","K3/2","K3/3","K3/4"].map(c=>`<button class="btn ${S.cls===c?"btn-primary":""}" style="${S.cls!==c?"background:#F9FAFB;color:#6B7280;border:1px solid #E5E7EB":""}" onclick="S.cls='${c}';S.stuSel=null;render()">${c}</button>`).join("")}
      </div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:0.6rem">
      ${students.map(s=>{
        const av=stuAvatarColor(s);
        const dl=getDL(cls,s.id);
        const ci=getCI(cls,s.id);
        const beh=dl?BEHAVIOUR_OPTS.find(o=>o.val===dl.behaviour):null;
        const par=dl?PARTICIPATION_OPTS.find(o=>o.val===dl.participation):null;
        const eff=dl?EFFORT_OPTS.find(o=>o.val===dl.effort):null;
        return`<div onclick="S.stuSel=${s.id};render()" style="background:#fff;border-radius:14px;padding:0.75rem;text-align:center;box-shadow:0 1px 6px rgba(0,0,0,0.08);cursor:pointer;border:2px solid ${dl?"#2563eb22":"#f1f5f9"};transition:all 0.15s">
          <div style="width:46px;height:46px;margin:0 auto 5px">${avatarSVG(s.gender,av.color)}</div>
          <div class="roster-name">${s.nickname||s.name}</div>
          <div style="display:flex;justify-content:center;gap:3px;margin-top:5px;flex-wrap:wrap">
            ${ci?.mood?`<span title="Mood">${MOODS.find(m=>m.label===ci.mood)?.emoji||""}</span>`:""}
            ${beh?`<span title="Behaviour" style="font-size:0.6rem;background:${beh.color}22;color:${beh.color};border-radius:4px;padding:1px 4px;font-weight:700">${beh.label.split(" ")[0]}</span>`:""}
            ${par?`<span title="Participation" style="font-size:0.6rem;background:${par.color}22;color:${par.color};border-radius:4px;padding:1px 4px;font-weight:700">${par.label.split(" ")[0]}</span>`:""}
            ${eff?`<span title="Effort" style="font-size:0.6rem;background:${eff.color}22;color:${eff.color};border-radius:4px;padding:1px 4px;font-weight:700">${eff.label.split(" ")[0]}</span>`:""}
          </div>
          ${dl?.strength?`<div style="font-size:0.6rem;color:#7c3aed;margin-top:3px;font-weight:700">⭐ ${dl.strength}</div>`:""}
          ${!dl?`<div style="font-size:0.62rem;color:#cbd5e1;margin-top:4px">Not logged</div>`:""}
        </div>`;
      }).join("")}
    </div>
  </div>`;
}

function renderStudentDetail(cls,stu,swCurrent){
  const av=stuAvatarColor(stu);
  const ci=getCI(cls,stu.id);
  const dl=getDL(cls,stu.id);
  const sw=getSchoolWeekForOffset(S.stuWeekOffset);
  const isCurrentWeek=S.stuWeekOffset===0;

  function getLogsForSw(swData){
    if(!swData)return[];
    const logs=[];
    const s=new Date(swData.start),e=new Date(swData.end);
    for(let d=new Date(s);d<=e;d.setDate(d.getDate()+1)){
      const ds=d.toISOString().slice(0,10);
      const log=getDL(cls,stu.id,ds);
      if(log)logs.push(Object.assign({date:ds},log));
    }
    return logs;
  }
  const weekLogs=getLogsForSw(sw);
  const behC={};BEHAVIOUR_OPTS.forEach(o=>behC[o.val]=0);
  const parC={};PARTICIPATION_OPTS.forEach(o=>parC[o.val]=0);
  const effC={};EFFORT_OPTS.forEach(o=>effC[o.val]=0);
  const strs={};
  weekLogs.forEach(l=>{
    if(l.behaviour)behC[l.behaviour]=(behC[l.behaviour]||0)+1;
    if(l.participation)parC[l.participation]=(parC[l.participation]||0)+1;
    if(l.effort)effC[l.effort]=(effC[l.effort]||0)+1;
    if(l.strength)strs[l.strength]=(strs[l.strength]||0)+1;
  });
  const topStrength=(Object.entries(strs).sort((a,b)=>b[1]-a[1])[0]||[""])[0];
  const topBeh=BEHAVIOUR_OPTS.find(o=>o.val===(Object.entries(behC).sort((a,b)=>b[1]-a[1])[0]||[""])[0]);
  const topPar=PARTICIPATION_OPTS.find(o=>o.val===(Object.entries(parC).sort((a,b)=>b[1]-a[1])[0]||[""])[0]);
  const topEff=EFFORT_OPTS.find(o=>o.val===(Object.entries(effC).sort((a,b)=>b[1]-a[1])[0]||[""])[0]);

  // Store context on window so onclick handlers can access without string args
  window._stuCtx={cls,id:stu.id};

  const h=[];
  h.push(`<div style="padding:1rem">`);

  // Header
  h.push(`<div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:0.9rem">
    <button class="btn-sm" style="background:#f1f5f9;color:#64748b" onclick="S.stuSel=null;S.stuWeekOffset=0;S.aiComment=String();render()">&#8592; Back</button>
    <div style="width:44px;height:44px">${avatarSVG(stu.gender,av.color)}</div>
    <div>
      <div style="font-weight:800;font-size:1rem;color:#111827">${stu.name}</div>
      <div style="font-size:0.72rem;color:#64748b">${stu.nickname||''} &middot; ${cls}</div>
    </div>
  </div>`);

  // Today (current week only)
  if(isCurrentWeek){
    h.push(`<div style="background:#fff;border-radius:14px;padding:0.9rem;box-shadow:0 1px 6px rgba(0,0,0,0.07);margin-bottom:0.75rem">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.6rem">
        <div style="font-weight:800;color:#111827;font-size:0.85rem">&#128203; Today &middot; ${todayKey()}</div>
        <button class="btn-sm" style="background:#2563eb;color:#fff" onclick="openDailyLogPopup(window._stuCtx.cls,window._stuCtx.id,'${todayKey()}')">${dl?'&#9998; Edit':'&#43; Log Today'}</button>
      </div>`);
    if(dl){
      h.push(`<div style="display:flex;gap:0.4rem;flex-wrap:wrap">`);
      if(ci&&ci.mood){const m=MOODS.find(x=>x.label===ci.mood);if(m)h.push(`<span style="background:#f0fdf4;border-radius:8px;padding:0.3rem 0.6rem;font-size:0.78rem">${m.emoji} ${m.label}</span>`);}
      if(dl.behaviour){const b=BEHAVIOUR_OPTS.find(o=>o.val===dl.behaviour);if(b)h.push(`<span style="background:${b.color}22;border-radius:8px;padding:0.3rem 0.6rem;font-size:0.78rem;font-weight:700;color:${b.color}">${b.label}</span>`);}
      if(dl.participation){const p=PARTICIPATION_OPTS.find(o=>o.val===dl.participation);if(p)h.push(`<span style="background:${p.color}22;border-radius:8px;padding:0.3rem 0.6rem;font-size:0.78rem;font-weight:700;color:${p.color}">${p.label}</span>`);}
      if(dl.effort){const e=EFFORT_OPTS.find(o=>o.val===dl.effort);if(e)h.push(`<span style="background:${e.color}22;border-radius:8px;padding:0.3rem 0.6rem;font-size:0.78rem;font-weight:700;color:${e.color}">${e.label}</span>`);}
      if(dl.strength)h.push(`<span style="background:#ede9fe;border-radius:8px;padding:0.3rem 0.6rem;font-size:0.78rem;font-weight:700;color:#7c3aed">&#11088; ${dl.strength}</span>`);
      h.push(`</div>`);
      if(dl.note)h.push(`<div style="margin-top:0.4rem;font-size:0.72rem;color:#64748b;font-style:italic">${dl.note}</div>`);
    } else {
      h.push(`<div style="font-size:0.78rem;color:#94a3b8">Nothing logged yet today.</div>`);
    }
    h.push(`</div>`);
  }

  // Week panel
  h.push(`<div style="background:#fff;border-radius:14px;padding:0.9rem;box-shadow:0 1px 6px rgba(0,0,0,0.07);margin-bottom:0.75rem">`);
  h.push(`<div style="display:flex;align-items:center;gap:0.4rem;margin-bottom:0.7rem">
    <button class="btn-sm" style="background:#f1f5f9;color:#64748b" onclick="S.stuWeekOffset--;S.aiComment=String();render()">&#9664;</button>
    <div style="flex:1;text-align:center">
      <div style="font-weight:800;color:#111827;font-size:0.82rem">${sw?'Week '+sw.week+' &middot; '+sw.unit:'No week'}</div>
      <div style="font-size:0.65rem;color:#94a3b8">${sw?sw.start+' &rarr; '+sw.end:''} &middot; ${weekLogs.length}/5 days logged</div>
    </div>
    <button class="btn-sm" style="background:#f1f5f9;color:#64748b;${S.stuWeekOffset>=0?'opacity:0.3':''}" ${S.stuWeekOffset>=0?'disabled':''} onclick="S.stuWeekOffset++;S.aiComment=String();render()">&#9654;</button>
    ${!isCurrentWeek?'<button class="btn-sm" style="background:#2563eb;color:#fff" onclick="S.stuWeekOffset=0;S.aiComment=String();render()">Now</button>':''}
  </div>`);

  // Day rows
  if(sw){
    const s=new Date(sw.start),e=new Date(sw.end);
    for(let d=new Date(s);d<=e;d.setDate(d.getDate()+1)){
      const ds=d.toISOString().slice(0,10);
      const day=d.getDay();
      if(day===0||day===6)continue;
      const dayName=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][day];
      const log=getDL(cls,stu.id,ds);
      const isToday=ds===todayKey();
      const isFuture=ds>todayKey();
      h.push(`<div style="display:flex;align-items:center;gap:0.4rem;padding:0.4rem 0.5rem;border-radius:8px;margin-bottom:3px;background:${isToday?'#eff6ff':log?'#f8fafc':'#fafafa'};border:1px solid ${isToday?'#bfdbfe':'#f1f5f9'}">`);
      h.push(`<div style="font-size:0.7rem;font-weight:800;color:${isToday?'#2563eb':'#64748b'};width:32px">${dayName}</div>`);
      if(log){
        const b=BEHAVIOUR_OPTS.find(o=>o.val===log.behaviour);
        const p=PARTICIPATION_OPTS.find(o=>o.val===log.participation);
        const e2=EFFORT_OPTS.find(o=>o.val===log.effort);
        h.push(`<div style="display:flex;gap:3px;flex-wrap:wrap;flex:1">`);
        if(b)h.push(`<span style="font-size:0.62rem;background:${b.color}22;color:${b.color};border-radius:4px;padding:1px 5px;font-weight:700">${b.label}</span>`);
        if(p)h.push(`<span style="font-size:0.62rem;background:${p.color}22;color:${p.color};border-radius:4px;padding:1px 5px;font-weight:700">${p.label}</span>`);
        if(e2)h.push(`<span style="font-size:0.62rem;background:${e2.color}22;color:${e2.color};border-radius:4px;padding:1px 5px;font-weight:700">${e2.label}</span>`);
        if(log.strength)h.push(`<span style="font-size:0.62rem;color:#7c3aed;font-weight:700">&#11088;${log.strength}</span>`);
        h.push(`</div>`);
        h.push(`<button style="font-size:0.6rem;background:none;border:none;cursor:pointer;color:#94a3b8" onclick="openDailyLogPopup(window._stuCtx.cls,window._stuCtx.id,'${ds}')">&#9998;</button>`);
      } else {
        h.push(`<div style="flex:1;font-size:0.68rem;color:#cbd5e1">${isFuture?'&mdash;':'Not logged'}</div>`);
        if(!isFuture)h.push(`<button style="font-size:0.62rem;background:#dbeafe;border:none;cursor:pointer;color:#1d4ed8;border-radius:4px;padding:1px 6px;font-weight:700" onclick="openDailyLogPopup(window._stuCtx.cls,window._stuCtx.id,'${ds}')">+ Log</button>`);
      }
      h.push(`</div>`);
    }
  }

  // Week totals
  if(weekLogs.length>0){
    h.push(`<div style="display:grid;grid-template-columns:1fr 1fr;gap:0.4rem;margin-top:0.6rem;padding-top:0.5rem;border-top:1px solid #f1f5f9">`);
    if(topBeh)h.push(`<div style="background:#f8fafc;border-radius:8px;padding:0.4rem 0.6rem"><div style="font-size:0.6rem;color:#94a3b8;font-weight:700">BEHAVIOUR</div><div style="font-weight:700;color:${topBeh.color};font-size:0.78rem">${topBeh.label}</div></div>`);
    if(topPar)h.push(`<div style="background:#f8fafc;border-radius:8px;padding:0.4rem 0.6rem"><div style="font-size:0.6rem;color:#94a3b8;font-weight:700">PARTICIPATION</div><div style="font-weight:700;color:${topPar.color};font-size:0.78rem">${topPar.label}</div></div>`);
    if(topEff)h.push(`<div style="background:#f8fafc;border-radius:8px;padding:0.4rem 0.6rem"><div style="font-size:0.6rem;color:#94a3b8;font-weight:700">EFFORT</div><div style="font-weight:700;color:${topEff.color};font-size:0.78rem">${topEff.label}</div></div>`);
    if(topStrength)h.push(`<div style="background:#ede9fe;border-radius:8px;padding:0.4rem 0.6rem"><div style="font-size:0.6rem;color:#7c3aed;font-weight:700">TOP STRENGTH</div><div style="font-weight:700;color:#7c3aed;font-size:0.78rem">&#11088; ${topStrength}</div></div>`);
    h.push(`</div>`);
  }
  h.push(`</div>`); // end week panel

  // Parent comment
  h.push(`<div style="background:linear-gradient(135deg,#ede9fe,#dbeafe);border-radius:14px;padding:0.9rem;box-shadow:0 1px 6px rgba(0,0,0,0.07)">`);
  h.push(`<div style="font-weight:800;color:#111827;font-size:0.85rem;margin-bottom:0.4rem">&#9993;&#65039; Weekly Parent Comment</div>`);
  h.push(`<div style="font-size:0.72rem;color:#64748b;margin-bottom:0.7rem">Generates a short personalised comment from this week&apos;s logged data.</div>`);
  if(S.aiComment){
    h.push(`<div style="background:#fff;border-radius:10px;padding:0.8rem;font-size:0.82rem;color:#111827;line-height:1.7;margin-bottom:0.6rem">${S.aiComment}</div>`);
    h.push(`<div style="display:flex;gap:0.4rem;flex-wrap:wrap">
      <button class="btn-sm" style="background:#2563eb;color:#fff" onclick="copyComment()">&#128203; Copy</button>
      <button class="btn-sm" style="background:#f1f5f9;color:#64748b" onclick="S.regenOffset++;generateParentComment(window._stuCtx.cls,window._stuCtx.id)">&#128260; Regenerate</button>
      <button class="btn-sm" style="background:#fee2e2;color:#dc2626" onclick="S.aiComment=String();S.regenOffset=0;render()">&#10005; Clear</button>
    </div>`);
  } else {
    h.push(`<button class="btn btn-primary" style="width:100%" onclick="generateParentComment(window._stuCtx.cls,window._stuCtx.id)">&#9993;&#65039; Generate Parent Comment</button>`);
  }
  h.push(`</div>`);
  h.push(`</div>`);
  return h.join('');
}

function copyComment(){
  if(S.aiComment)navigator.clipboard.writeText(S.aiComment).then(()=>{
    const btn=document.querySelector("[onclick='copyComment()']");
    if(btn){btn.textContent="✓ Copied!";setTimeout(()=>{btn.textContent="📋 Copy";},2000);}
  });
}

function generateParentComment(cls,studentId){
  const students=cls==="K1A"?K1A_STUDENTS:(DB.studentRows[cls]||[]);
  const stu=students.find(s=>s.id===studentId);
  if(!stu)return;

  const weekLogs=getWeekLogs(cls,studentId);
  const ci=getCI(cls,studentId);
  const name=stu.nickname||stu.name.split(" ")[0];
  const sw=getCurrentSchoolWeek();
  const weekNum=sw?sw.week:1;

  // Tally the week
  const behTally={};const effTally={};const parTally={};
  const strengths=[];
  weekLogs.forEach(l=>{
    if(l.behaviour)behTally[l.behaviour]=(behTally[l.behaviour]||0)+1;
    if(l.effort)effTally[l.effort]=(effTally[l.effort]||0)+1;
    if(l.participation)parTally[l.participation]=(parTally[l.participation]||0)+1;
    if(l.strength&&!strengths.includes(l.strength))strengths.push(l.strength);
  });
  const topBeh=Object.entries(behTally).sort((a,b)=>b[1]-a[1])[0]?.[0]||"";
  const topEff=Object.entries(effTally).sort((a,b)=>b[1]-a[1])[0]?.[0]||"";
  const topPar=Object.entries(parTally).sort((a,b)=>b[1]-a[1])[0]?.[0]||"";
  const topStr=strengths[0]||"";
  const mood=ci?.mood||"";

  // Build a pool of relevant phrases, then pick one based on week number
  // so the same student gets a different phrase each week
  const pool=[];

  // Behaviour phrases
  if(topBeh==="great"){
    pool.push(`${name} had a great week! 😊`);
    pool.push(`Wonderful behaviour this week! 🌟`);
    pool.push(`${name} was a star in class! ⭐`);
  }
  if(topBeh==="ok"){
    pool.push(`${name} had a good week! 👍`);
    pool.push(`Solid week from ${name}! 😊`);
  }
  if(topBeh==="needs-work"){
    pool.push(`${name} is working on focus. 💪`);
    pool.push(`Please remind ${name} to listen carefully. 🎯`);
    pool.push(`${name} needs extra encouragement at home. 🏠`);
  }
  if(topBeh==="disruptive"){
    pool.push(`${name} had a challenging week. 🙏`);
    pool.push(`Please talk to ${name} about listening in class. 💬`);
  }

  // Effort phrases
  if(topEff==="excellent"){
    pool.push(`Excellent effort this week! ⭐`);
    pool.push(`${name} tried so hard — well done! 🏆`);
    pool.push(`Amazing effort from ${name}! 🚀`);
  }
  if(topEff==="good"){
    pool.push(`Good effort from ${name}! 👍`);
    pool.push(`${name} worked really well this week! 💪`);
  }
  if(topEff==="low"){
    pool.push(`Please encourage ${name} at home. 🏠`);
    pool.push(`${name} can do more — cheer ${stu.gender==="F"?"her":"him"} on! 📣`);
  }

  // Participation phrases
  if(topPar==="active"){
    pool.push(`Very active in class this week! 🙋`);
    pool.push(`${name} loved joining in! 🎉`);
    pool.push(`Great participation from ${name}! 🙌`);
  }
  if(topPar==="distracted"){
    pool.push(`${name} needs help staying focused. 🎯`);
    pool.push(`Please remind ${name} to pay attention. 👀`);
  }

  // Strength phrases
  const strPool={
    Kind:[`${name} was so kind to friends! 💛`,`Such a caring classmate! 🤗`],
    Creative:[`${name} showed great creativity! 🎨`,`So imaginative this week! 🌈`],
    Leader:[`${name} was a class leader! 🌟`,`Natural leader this week! 👑`],
    Helper:[`${name} was a wonderful helper! 🤝`,`Always helping others! 💚`],
    Curious:[`${name} asked such great questions! 🔍`,`So curious and eager! 🧠`],
    Brave:[`${name} was so brave this week! 🦁`,`Trying new things bravely! 💪`],
    Focused:[`${name} had amazing focus! 🎯`,`Super concentrated this week! 🔬`],
    Friendly:[`${name} made everyone smile! 😄`,`Such a friendly classmate! 🌸`],
    Listener:[`${name} listened so well! 👂`,`Great listening this week! 🌟`],
    Energetic:[`Full of energy this week! ⚡`,`${name}'s energy is contagious! 🌟`],
    Careful:[`${name} was so careful and thorough! ✅`,`Great attention to detail! 🔎`],
    "Hard Worker":[`${name} worked so hard! 💪`,`Such a dedicated learner! 📚`]
  };
  if(topStr&&strPool[topStr])pool.push(...strPool[topStr]);

  // Mood phrases
  if(mood==="Happy")   pool.push(`${name} was happy and engaged! 😊`,`Such a joyful day! ☀️`);
  if(mood==="Energetic")pool.push(`Full of energy this week! ⚡`);
  if(mood==="Tired")   pool.push(`${name} seemed tired — rest up! 😴`,`Make sure ${name} gets enough sleep! 🌙`);
  if(mood==="Sad")     pool.push(`${name} had a quiet week — extra cuddles needed! 🤗`);

  // Fallback
  if(pool.length===0)pool.push(`${name} had a lovely week! 😊`,`Great to have ${name} in class! 🌟`);

  // Deduplicate pool
  const unique=[...new Set(pool)];

  // Get previously used comments for this student to avoid repeats
  const usedKey=cls+"_"+studentId+"_usedComments";
  let used=[];
  try{used=JSON.parse(localStorage.getItem(usedKey)||"[]");}catch(e){}

  // Filter out recently used (last 5 weeks), fall back to full pool if exhausted
  let available=unique.filter(p=>!used.includes(p));
  if(available.length===0){used=[];available=unique;}

  // Pick using week number + regenOffset so Regenerate always moves to next phrase
  const pick=available[(weekNum+S.regenOffset)%available.length];

  // Save to used history (keep last 5)
  used.push(pick);
  if(used.length>5)used=used.slice(-5);
  try{localStorage.setItem(usedKey,JSON.stringify(used));}catch(e){}

  S.aiComment=pick;
  render();
}

// ── BOOT ──────────────────────────────────────────────────────────────────────
auth.signInAnonymously().catch(()=>{});
startSync();
S.clockStr=nowTimeStr();
render();
