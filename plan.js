const Q=new URLSearchParams(location.search);const L=makeLesson(Q.get('t')||'farm',Q.get('m')||'ipdpc',+(Q.get('min')||30),Q.get('s')||'1');
const LV0=String(L.level||'K1').split(/\s*\u00b7\s*/)[0],LVF=String(L.level||'K1 (age 3)').replace(/\s*\u00b7\s*(.*)$/,' ($1)');
const e=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const tot=L.stages.reduce((a,s)=>a+s.min,0);
let h=`<h1>${e(LV0)} English Lesson Plan: ${e(L.title)}</h1><div style="color:#555;font-style:italic;margin-bottom:10px">${e(L.sub)}</div><table>
<tr><td class=k>Teacher</td><td>${e(L.teacher||'')}</td></tr><tr><td class=k>Level</td><td>${e(LVF)}</td></tr>
<tr><td class=k>Teaching method</td><td>${e(L.method)}</td></tr><tr><td class=k>Time</td><td>${tot} minutes</td></tr>
<tr><td class=k>Target words</td><td>${L.words.map(e).join(', ')}</td></tr><tr><td class=k>Objective</td><td>${e(L.objective||'')}</td></tr>
<tr><td class=k>Materials</td><td>${(Array.isArray(L.prep)?L.prep:[L.prep||'']).map(x=>'• '+e(x)).join('<br>')}</td></tr></table>
<h2>Lesson stages</h2><table><tr><th>#</th><th>Stage</th><th>Min</th><th>What to do / say</th></tr>`;
L.stages.forEach((s,i)=>{h+=`<tr><td>${i+1}</td><td><b>${e(s.name)}</b><div class=ph>${e(s.phase)}</div></td><td>${s.min}</td><td>`+s.steps.map(t=>`<div>${e(t.do)}</div>`+(t.say?`<div><b class=say>Say: </b><i>${e(t.say)}</i></div>`:'')).join('')+(s.watch?`<div><b>Watch for: </b>${e(s.watch)}</div>`:'')+(s.short?`<div><b>Short on time: </b>${e(s.short)}</div>`:'')+'</td></tr>'});
h+='</table>';
if(L.chant&&L.chant.length){h+=`<h2>${e(L.title)} chant</h2>`+L.chant.map((l,i)=>`<div><b>${e(l)}</b> <i style="color:#555">Action: ${e((L.chantActions||[])[i]||'')}</i></div>`).join('')}
h+=`<h2>Assessment (informal)</h2><div>Tick who can say or mime each word: ${L.words.map(e).join(', ')}. Praise any sound or mime.</div>`;
document.title=L.title+' plan';document.getElementById('o').innerHTML=h;

async function dl(){
const d=window.docx,{Document,Packer,Paragraph,TextRun,Table,TableRow,TableCell,WidthType,ShadingType,BorderStyle,HeadingLevel}=d;
const F='Arial',W=10466;
const p=(t,o={})=>new Paragraph({spacing:{after:80},...o,children:[new TextRun({text:t,font:F,size:21,...(o.r||{})})]});
const rich=(runs,o={})=>new Paragraph({spacing:{after:60},...o,children:runs.map(r=>new TextRun({font:F,size:21,...r}))});
const bd={style:BorderStyle.SINGLE,size:4,color:'BBBBBB'};const B={top:bd,bottom:bd,left:bd,right:bd};
const cell=(kids,w,fill)=>new TableCell({width:{size:w,type:WidthType.DXA},borders:B,margins:{top:70,bottom:70,left:110,right:110},shading:fill?{type:ShadingType.CLEAR,fill,color:'auto'}:undefined,children:kids});
const kv=rows=>new Table({width:{size:W,type:WidthType.DXA},columnWidths:[2300,W-2300],rows:rows.map(([a,b])=>new TableRow({children:[cell([p(a,{r:{bold:true}})],2300,'E8F1FB'),cell(Array.isArray(b)?b:[p(b)],W-2300)]}))});
const h=t=>new Paragraph({heading:HeadingLevel.HEADING_1,children:[new TextRun({text:t,font:F})]});
const kids=[new Paragraph({heading:HeadingLevel.TITLE,children:[new TextRun({text:`${LV0} English Lesson Plan: ${L.title}`,font:F})]}),p(L.sub||'',{r:{italics:true,color:'555555'}})];
kids.push(kv([['Teacher',L.teacher||''],['Level',LVF],['Teaching method',L.method],['Time',tot+' minutes'],['Target words',L.words.join(', ')],['Objective',L.objective||''],['Materials',(Array.isArray(L.prep)?L.prep:[L.prep||'']).map(x=>p('• '+x))],['Lesson player','Open the lesson player on the laptop (teacher view) and the student view on the TV. Use Chrome or Edge.']]));
kids.push(h('Lesson stages'));
const cw=[500,2000,700,W-3200];
const hdr=new TableRow({tableHeader:true,children:['#','Stage','Min','What to do / say'].map((t,i)=>cell([p(t,{r:{bold:true,color:'FFFFFF'}})],cw[i],'2E6DA4'))});
const rows=L.stages.map((s,i)=>{const k=[];s.steps.forEach(st=>{k.push(rich([{text:st.do}]));if(st.say)k.push(rich([{text:'Say: ',bold:true,color:'2E6DA4'},{text:st.say,italics:true}]))});
 if(s.watch)k.push(rich([{text:'Watch for: ',bold:true},{text:s.watch}]));if(s.short)k.push(rich([{text:'Short on time: ',bold:true},{text:s.short}]));
 return new TableRow({children:[cell([p(String(i+1))],cw[0]),cell([p(s.name,{r:{bold:true}}),p(s.phase,{r:{italics:true,color:'2E6DA4',size:18}})],cw[1]),cell([p(String(s.min))],cw[2]),cell(k,cw[3])]})});
kids.push(new Table({width:{size:W,type:WidthType.DXA},columnWidths:cw,rows:[hdr,...rows]}));
if(L.chant&&L.chant.length){kids.push(h(L.title+' chant'));L.chant.forEach((l,i)=>kids.push(rich([{text:l,bold:true},{text:'   Action: '+((L.chantActions||[])[i]||''),italics:true,color:'555555'}])))}
kids.push(h('Assessment (informal)'),p('Tick who can say or mime each word: '+L.words.join(', ')+'. Praise any sound or mime.'));
const st=n=>({run:{font:F,size:n[0],bold:true,color:'1F4E79'},paragraph:{spacing:{before:n[1],after:n[2]},keepNext:true}});
const doc=new Document({styles:{default:{document:{run:{font:F,size:21}}},paragraphStyles:[{id:'Title',name:'Title',basedOn:'Normal',run:{font:F,size:40,bold:true,color:'1F4E79'},paragraph:{spacing:{after:80}}},{id:'Heading1',name:'Heading 1',basedOn:'Normal',next:'Normal',quickFormat:true,...st([28,280,120])}]},sections:[{properties:{page:{size:{width:11906,height:16838},margin:{top:720,bottom:720,left:720,right:720}}},children:kids}]});
const blob=await Packer.toBlob(doc);const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=LV0+'_'+L.title.replace(/\W+/g,'_')+'_'+(Q.get('m')||'ipdpc')+'_'+tot+'min_Lesson_Plan.docx';document.body.appendChild(a);a.click();a.remove()}
