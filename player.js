const Q=new URLSearchParams(location.search);
const L=makeLesson(Q.get('t')||'farm',Q.get('m')||'ipdpc',+(Q.get('min')||30),Q.get('s')||'1');

const VIEW=location.hash.indexOf('student')>-1?'student':'teacher';
const $=id=>document.getElementById(id);
// ---------- pictures (image slot with SVG fallback) ----------
const cloud=c=>`<g fill="${c}"><circle cx="38" cy="48" r="14"/><circle cx="54" cy="40" r="18"/><circle cx="70" cy="49" r="13"/><rect x="24" y="48" width="58" height="16" rx="8"/></g>`;
const ICON={sunny:`<circle cx="50" cy="50" r="18" fill="#F6B93B"/><g stroke="#F6B93B" stroke-width="5" stroke-linecap="round">${[0,1,2,3,4,5,6,7].map(i=>{const a=i*Math.PI/4;return `<line x1="${50+27*Math.cos(a)}" y1="${50+27*Math.sin(a)}" x2="${50+38*Math.cos(a)}" y2="${50+38*Math.sin(a)}"/>`}).join('')}</g>`,
rainy:`${cloud('#8FA3B5')}<g stroke="#2E7CC4" stroke-width="4" stroke-linecap="round"><line x1="34" y1="72" x2="30" y2="86"/><line x1="48" y1="72" x2="44" y2="86"/><line x1="62" y1="72" x2="58" y2="86"/><line x1="76" y1="72" x2="72" y2="86"/></g>`,
cloudy:`<g transform="translate(-8,-8)">${cloud('#C9D6E2')}</g><g transform="translate(6,6)">${cloud('#8FA3B5')}</g>`,
windy:`<g fill="none" stroke-linecap="round" stroke-width="5"><path d="M12 36H62a9 9 0 1 0-9-9" stroke="#4FA3D9"/><path d="M12 52H78a10 10 0 1 1-10 10" stroke="#2E7CC4"/><path d="M12 68H50a8 8 0 1 1-8 8" stroke="#4FA3D9"/></g>`};
// To use Gemini art: put weather-sunny.png etc. in a "media" folder next to this file. It replaces the drawn icon automatically.
const pic=(w,c)=>L.pics&&L.pics[w]?`<span class="pic ${c||''}" style="--c:${pc(w)}"><img src="${L.pics[w]}"></span>`:`<span class="pic ${c||''}" style="--c:${pc(w)}"><svg viewBox="0 0 100 100">${ICON[w]}</svg><img src="media/weather-${w}.png" style="display:none" onload="this.style.display='block';this.parentNode.querySelector('svg').remove()" onerror="this.remove()"></span>`;
const PAL=['#FF8A5B','#FF7AA8','#FFC83D','#6FC7F7','#8FD16B','#B28BFF'];const pc=w=>PAL[Math.max(0,L.words.indexOf(w))%PAL.length];
const sh=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
// ---------- shared state + sync ----------
let S={w3:{n:0,yaw:0,pitch:0,o:null,k:0},zp:{i:null,from:null,k:0},ex:{p:(L.explore&&L.explore.start)||null,o:null,k:0,d:0},st:0,fi:0,mime:null,cl:-1,tt:null,tn:0,ts:0,tp:null,topts:L.words.slice(),doors:L.words.map(w=>({w,o:0})),say:{t:'',n:0},sfx:{n:0,name:''},mood:{n:0,name:'idle'},rw:0,ph:0,yi:0,yp:0,yn:0,fx:{n:0,x:800,y:420},bl:null,sh:null,mm:null,wh:null,zm:null,ms:null,fd:null,sc:null,od:null,ct:null,v:{p:0,n:0,r:0},tapOff:0};
let seenSfx=0,seenV=0,seenR=0,seenFx=0;
function Tk(t){S.say={t,n:S.say.n+1}}
function win(x,y){S.ts++;S.fx={n:S.fx.n+1,x:x||800,y:y||430}}
function bnew(){const w=L.words,t=w[Math.floor(Math.random()*w.length)];const ws=sh(w.concat(sh(w).slice(0,2)));S.bl={t,t0:Date.now(),done:0,wob:-1,items:ws.map((x,i)=>({w:x,o:0,px:70+i*250,py:250+(i%2)*95+(i%3)*18,c:PAL[i%6]}))};Tk('Pop the '+t+'!')}
function snew(){const w=L.words,t=w[Math.floor(Math.random()*w.length)];S.sh={t,opts:sh(w),done:0,bad:null};Tk('Whose shadow is this?')}
function mnew(){const cs=[];L.words.slice(0,4).forEach(x=>{cs.push({k:x,t:0});cs.push({k:x,t:1})});S.mm={cards:sh(cs),up:[],done:[],lock:0};Tk('Find the matching pairs!')}
function burst(x,y){const root=VIEW==='student'?$('sv'):$('pv');const s=root&&root.firstElementChild;if(!s)return;const C=['#FF8A5B','#FF7AA8','#FFC83D','#6FC7F7','#8FD16B','#B28BFF'];for(let i=0;i<42;i++){const e=document.createElement('i');const z=14+Math.random()*18;e.style.cssText=`position:absolute;left:${x}px;top:${y}px;width:${z}px;height:${z*.6}px;background:${C[i%6]};border-radius:3px;z-index:8;pointer-events:none`;s.appendChild(e);const a=Math.random()*Math.PI*2,d=200+Math.random()*440;e.animate([{transform:'translate(0,0) rotate(0)',opacity:1},{transform:`translate(${Math.cos(a)*d}px,${Math.sin(a)*d+170}px) rotate(${Math.random()*720}deg)`,opacity:0}],{duration:1300+Math.random()*500,easing:'cubic-bezier(.1,.7,.3,1)'}).onfinish=()=>e.remove()}}
function YL(){return L.stages[S.st].yt||L.yt||[]}
function openSong(){const v=YL()[S.yi]||YL()[0];window.open('https://www.youtube.com/watch?v='+v.id,'k1song','width=1280,height=720')}
const HOSTED=location.protocol!=='file:';
const YTOK=HOSTED&&!/claude\.ai|claudeusercontent|anthropic/i.test(location.hostname)&&!location.search.includes('noyt');
let seenSay=0,studentOn=0;
const id=Math.random().toString(36).slice(2);
let bc=null;try{bc=new BroadcastChannel('k1player')}catch(e){}
const seen={};
function send(m){m.id=id+Math.random().toString(36).slice(2);m.from=VIEW;try{bc&&bc.postMessage(m)}catch(e){}try{localStorage.setItem('k1msg',JSON.stringify(m))}catch(e){}}
function recv(m){if(!m||m.from===VIEW||seen[m.id])return;seen[m.id]=1;
 if(m.type==='state'){S=m.S;apply()}
 else if(m.type==='act'&&VIEW==='teacher'){if(m.a==='nav')goSt(m.p);else if(m.a==='navstep')nextSt(m.p);else act(m.a,m.p,true)}
 else if(m.type==='hi'&&VIEW==='teacher'){studentOn=Date.now();send({type:'state',S});updWait()}}
if(bc)bc.onmessage=e=>recv(e.data);
addEventListener('storage',e=>{if(e.key==='k1msg'&&e.newValue){try{recv(JSON.parse(e.newValue))}catch(x){}}});
const speak=(t,r)=>{try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='en-GB';u.rate=r||.8;speechSynthesis.speak(u)}catch(e){}};
function mustSpeak(){return VIEW==='student'||Date.now()-studentOn>9000}
function playSfx(n){try{const a=new Audio(L.sfx[n]||'media/sound/'+n+'.mp3');a.play().catch(()=>{})}catch(e){}}
let MV=null,seenMood=-1;
function mnode(){if(!MV){MV=document.createElement('video');MV.className='mascot';MV.muted=true;MV.playsInline=true;MV.dataset.n='';MV.addEventListener('ended',()=>{if(MV.dataset.n!=='idle')setClip('idle')});}return MV}
function setClip(n){const m=mnode(),src=L.mascot&&(L.mascot[n]||L.mascot.idle);if(!src){m.style.display='none';return}m.dataset.n=L.mascot[n]?n:'idle';m.loop=(m.dataset.n==='idle');m.src=L.mascot[n]||L.mascot.idle;m.play().catch(()=>{})}
function mount(root){const m=mnode();if(!m.dataset.n)setClip('idle');const rs=L.stages[S.st].res;const hide=['video','real','zoomap','walk3d','intro'].includes(rs)||(rs==='yt'&&YTOK)||!L.mascot;m.style.display=hide?'none':'';root.firstElementChild.appendChild(m);if(!hide&&m.paused&&m.src)m.play().catch(()=>{})}
function apply(){draw();if(true){L.stages.forEach((_,i)=>{const b=document.getElementById('sl'+i);if(b)b.classList.toggle('on',i===S.st)})}
 if(S.fx&&S.fx.n!==seenFx){seenFx=S.fx.n;burst(S.fx.x,S.fx.y)}
 if(S.mood&&S.mood.n!==seenMood){seenMood=S.mood.n;setClip(S.mood.name)}
 if(S.sfx.n!==seenSfx){seenSfx=S.sfx.n;if(S.sfx.name&&mustSpeak())playSfx(S.sfx.name)}
 if(S.say.n!==seenSay){seenSay=S.say.n;updSay()}
 vsync()}
function updSay(){const e=document.getElementById('saynow');if(e)e.innerHTML=S.say.t?'<b>Say:</b> “'+S.say.t+'”':'<span style="color:#8aa2b5">Teacher prompts show here</span>'}
function vsync(){const v=document.getElementById('vid');if(!v)return;v.muted=!mustSpeak();
 if(S.v.r!==seenR){seenR=S.v.r;v.currentTime=0}
 if(S.v.p){v.play().catch(()=>{})}else v.pause()}
// actions: student view forwards them to the teacher window which owns the state
function act(a,p,fromNet){
 if(VIEW==='student'){send({type:'act',a,p});return}
 const w=L.words;
 const mood=n=>{S.mood={n:S.mood.n+1,name:n}};const talk=t=>{S.say={t,n:S.say.n+1}};const sfx=n=>{S.sfx={n:S.sfx.n+1,name:n}};
 if(a==='goto'){S.yi=0;S.w3={n:0,yaw:0,pitch:0,o:null,k:S.w3.k+1};S.zp={i:null,from:null,k:S.zp.k};if(L.explore)S.ex={p:L.explore.start,o:null,k:S.ex.k,d:0};S.st=p;S.fi=0;S.mime=null;S.cl=-1;S.tt=null;S.tp=null;S.tapOff=0;S.rw=0;S.ph=0;S.yi=0;S.yp=0;S.yn++;S.bl=null;S.sh=null;S.mm=null;S.wh=null;S.zm=null;S.ms=null;S.fd=null;S.sc=null;S.od=null;S.ct=null;S.v={p:0,n:S.v.n+1,r:S.v.r+1};S.doors=sh(L.words).map(w=>({w,o:0}));chantStop();mood(L.stages[p].mood||'idle');if(L.stages[p].res==='words')talk(w[0]);const gi=GI[L.stages[p].res];if(gi)gi()}
 else if(a==='fi'){S.fi=(S.fi+p+w.length)%w.length;talk(w[S.fi])}
 else if(a==='fir'){S.fi=Math.floor(Math.random()*w.length);talk(w[S.fi])}
 else if(a==='sayfi'){talk(w[S.fi])}
 else if(a==='sayletter'){talk(L.letter.say)}
 else if(a==='w3go'){const W=S.w3,n=Math.max(0,Math.min(K1W_N-1,W.n+p));if(n!==W.n){S.w3={n,yaw:0,pitch:0,o:null,k:W.k+1};sfx('tap');mood('windy');talk("Let's walk to "+W_NAMES[n]+"!")}}
 else if(a==='w3look'){S.w3.yaw=p.yaw;S.w3.pitch=p.pitch}
 else if(a==='w3open'){const w=W_ORDER[p],it=L.world.items[w];S.w3={n:S.w3.n,yaw:S.w3.yaw,pitch:S.w3.pitch,o:p,k:S.w3.k+1};sfx(L.sfx['an_'+w]?'an_'+w:'good');mood('happy');talk(it.say||("It's a "+w+"!"))}
 else if(a==='w3close'){S.w3={n:S.w3.n,yaw:0,pitch:0,o:null,k:S.w3.k+1};mood('happy');talk('Let\'s keep walking!')}
 else if(a==='zpgo'){const pp=L.zoo.places[p];if(pp){S.zp={i:p,from:null,k:S.zp.k+1};sfx(L.sfx['an_'+pp.w]?'an_'+pp.w:'tap');mood('windy');talk(pp.say||('Let\'s go to the '+pp.w+'!'))}}
 else if(a==='introgo'){sfx('open');nextSt(1)}
 else if(a==='zpback'){sfx('back');S.zp={i:null,from:S.zp.i,k:S.zp.k+1};mood('happy');talk('Back to the map!')}
 else if(a==='exgo'){const pl=exPlace(),to=pl.go&&pl.go[p];if(to){S.ex={p:to,o:null,k:S.ex.k+1,d:p==='r'?1:-1};sfx('tap');mood('windy');const np=exPlace();talk(np.say||("Let's go to "+np.name.replace(/^The /,"the ")+"!"))}}
 else if(a==='exopen'){const sp=exPlace().spots[p];if(sp){S.ex.o=p;sfx('good');mood('happy');talk(sp.say||("It's a "+sp.w+"!"))}}
 else if(a==='exclose'){S.ex.o=null}
 else if(a==='mime'){S.mime=w[Math.floor(Math.random()*w.length)];talk('Show me '+S.mime+'!')}
 else if(a==='tapnew'){S.tt=w[Math.floor(Math.random()*w.length)];S.tp=null;S.topts=sh(w);talk('Where is '+S.tt+'?')}
 else if(a==='tapsay'&&S.tt){talk('Where is '+S.tt+'?')}
 else if(a==='pick'&&S.tt&&!S.tp){S.tn++;S.tp=p;if(p===S.tt){win();sfx('good');mood('happy');talk('Yes! '+p+'!')}else{sfx('oops');mood('sad');talk('Try again!')}}
 else if(a==='rw'){S.rw=p;S.v={p:1,n:S.v.n+1,r:S.v.r+1};talk(w[p]+'!')}
 else if(a==='photo'){S.ph=S.ph?0:1}
 else if(a==='bnew'){bnew()}
 else if(a==='bsay'&&S.bl){talk('Pop the '+S.bl.t+'!')}
 else if(a==='bpop'){const b=S.bl;if(!b||b.done)return;const it=b.items[p];if(!it||it.o)return;if(it.w===b.t){it.o=1;b.done=1;sfx('good');mood('happy');win(it.px+105,it.py+120);talk('Yes! '+b.t+'!')}else{b.wob=p;sfx('oops');mood('sad');talk('Try again!')}}
 else if(a==='snew'){snew()}
 else if(a==='ssay'){talk('Whose shadow is this?')}
 else if(a==='spick'){const s=S.sh;if(!s||s.done)return;if(p===s.t){s.done=1;s.bad=null;sfx('good');mood('happy');win();talk('Yes! '+p+'!')}else{s.bad=p;sfx('oops');mood('sad');talk('Try again!')}}

 else if(a==='wspin'){const W=S.wh;if(!W||W.sp)return;const n=w.length,k=Math.floor(Math.random()*n),sg=360/n;W.f=W.rot;W.t=w[k];W.sp=1;W.done=0;W.rot=Math.ceil(W.rot/360)*360+1800+(360-(k+.5)*sg);sfx('tap');talk('Spin!');setTimeout(()=>{if(S.wh===W){W.sp=0;W.done=1;sfx('good');mood('happy');win(800,420);talk('Show me '+W.t+'!');send({type:'state',S});apply()}},3800)}
 else if(a==='wsay'&&S.wh&&S.wh.t){talk('Show me '+S.wh.t+'!')}
 else if(a==='znew'){znew()}
 else if(a==='zout'){const Z=S.zm;if(!Z||Z.done)return;Z.l++;sfx('tap');if(Z.l>=3){Z.l=3;Z.done=1;sfx('good');mood('happy');win();talk("It's a "+Z.t+'!')}else talk('What is it?')}
 else if(a==='zphoto'&&S.zm){S.zm.p=S.zm.p?0:1}
 else if(a==='msnew'){msnew()}
 else if(a==='msreorder'&&S.ms){S.ms={h:-1,rev:0,ord:sh(w)};talk('Look at the pictures!')}
 else if(a==='mshide'&&S.ms){S.ms.h=Math.floor(Math.random()*S.ms.ord.length);S.ms.rev=0;sfx('tap');talk("Close your eyes! Who is missing?")}
 else if(a==='msshow'&&S.ms&&S.ms.h>=0&&!S.ms.rev){S.ms.rev=1;sfx('good');mood('happy');win();talk('It was '+S.ms.ord[S.ms.h]+'!')}
 else if(a==='fnew'){fnew()}
 else if(a==='fsay'&&S.fd){talk('Find the '+S.fd.t+'!')}
 else if(a==='fpick'){const F=S.fd;if(!F||F.done)return;const it=F.items[p];if(!it||it.o)return;if(it.w===F.t){it.o=1;F.done=1;sfx('good');mood('happy');win(it.px+95,it.py+95);talk('Yes! '+F.t+'!')}else{F.wob=p;sfx('oops');mood('sad');talk('Try again!')}}
 else if(a==='scnew'){scnew()}
 else if(a==='sct'){const Q=S.sc;if(!Q||Q.done||Q.tiles[p])return;Q.tiles[p]=1;sfx('tap');talk('What is it?')}
 else if(a==='scall'&&S.sc&&!S.sc.done){S.sc.done=1;sfx('good');mood('happy');win();talk("It's a "+S.sc.t+'!')}
 else if(a==='onew'){onew()}
 else if(a==='osay'){talk('Which one is different?')}
 else if(a==='opick'){const O=S.od;if(!O||O.done)return;if(O.items[p]===O.b){O.done=1;O.bad=-1;sfx('good');mood('happy');win();talk("Yes! "+O.b+'!')}else{O.bad=p;sfx('oops');mood('sad');talk('Try again!')}}
 else if(a==='cnew'){cnew()}
 else if(a==='cnt'){const K=S.ct;if(!K||K.done||K.items[p])return;K.c++;K.items[p]=K.c;sfx('tap');talk(String(K.c));if(K.c===K.n){K.done=1;sfx('good');mood('happy');win();talk('Well done! '+K.n+'!')}}
 else if(a==='mnew'){mnew()}
 else if(a==='mflip'){const m=S.mm;if(!m||m.lock||m.up.includes(p)||m.done.includes(p))return;m.up.push(p);sfx('tap');if(m.up.length===2){const [x,y]=m.up;if(m.cards[x].k===m.cards[y].k){m.done.push(x,y);m.up=[];sfx('good');mood('happy');win();talk(m.cards[x].k+'!');if(m.done.length===m.cards.length){sfx('win');talk('Well done! You found them all!')}}else{m.lock=1;setTimeout(()=>{if(S.mm===m){m.up=[];m.lock=0;send({type:'state',S});apply()}},1300)}}}
 else if(a==='ytsel'){S.yi=p;S.yp=1;S.yn++}
 else if(a==='ytplay'){S.yp=1;S.yn++}
 else if(a==='ytpause'){S.yp=0;S.yn++}
 else if(a==='door'){const d=S.doors[p];if(d&&!d.o){d.o=1;sfx('tap');talk((L.doorSay||"It's ")+d.w+'!')}}
 else if(a==='shuf'){S.doors=sh(w).map(w=>({w,o:0}))}
 else if(a==='vplay'){S.v.p=1}
 else if(a==='vpause'){S.v.p=0}
 else if(a==='vtoggle'){S.v.p=S.v.p?0:1}
 else if(a==='vreset'){S.v={p:1,n:S.v.n+1,r:S.v.r+1}}
 else if(a==='tapt'){if(!S.tapOff){S.tapOff=1;win();sfx('win');mood('happy');talk('Well done! Turn the tap off. Save water!')}}
 else if(a==='tapreset'){S.tapOff=0}
 else if(a==='chant'){chantGo();return}
 else if(a==='chstop'){chantStop()}
 send({type:'state',S});apply();
}
let ctimer=null;
function chantStop(){clearTimeout(ctimer);S.cl=-1;try{speechSynthesis.cancel()}catch(e){}}
function chantGo(){clearTimeout(ctimer);let i=0;const step=()=>{if(i>=L.chant.length){S.cl=-1;send({type:'state',S});apply();return}
 S.cl=i;S.say={t:L.chant[i],n:S.say.n+1};send({type:'state',S});apply();i++;ctimer=setTimeout(step,3800)};step()}
// ---------- rendering the class screen ----------
function clouds(){if(NOCLOUD())return '';return [[80,60,260,38,60],[900,160,200,30,80],[400,700,300,40,70]].map(([x,y,w,h,s])=>`<div class="cl" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;animation-duration:${s}s"></div>`).join('')}

const rnd=a=>a[Math.floor(Math.random()*a.length)];
function wnew(){S.wh={rot:S.wh?S.wh.rot:0,f:0,t:null,done:0,sp:0};Tk('Spin the wheel!')}
function znew(){const w=L.words;S.zm={t:rnd(w),l:0,p:0,ox:20+Math.random()*60,oy:20+Math.random()*60,done:0};Tk('What is it?')}
function msnew(){S.ms={h:-1,rev:0,ord:sh(L.words)};Tk('Look at the pictures!')}
const FSLOTS=[[90,250],[470,235],[860,250],[1260,240],[190,470],[560,500],[960,470],[1330,500]];
function fnew(){const w=L.words,t=rnd(w);let pool=[];while(pool.length<8)pool=pool.concat(sh(w));pool=sh(pool.slice(0,8));if(!pool.includes(t))pool[0]=t;S.fd={t,done:0,wob:-1,items:pool.map((x,i)=>({w:x,o:0,px:FSLOTS[i][0],py:FSLOTS[i][1]}))};Tk('Find the '+t+'!')}
function scnew(){S.sc={t:rnd(L.words),tiles:Array(12).fill(0),done:0};Tk('What is hiding?')}
function onew(){const w=sh(L.words),a=w[0],b=w[1];S.od={a,b,done:0,bad:-1,items:sh([a,a,a,b])};Tk('Which one is different?')}
function cnew(){const w=rnd(L.words),n=2+Math.floor(Math.random()*4);S.ct={w,n,c:0,done:0,items:Array(n).fill(0)};Tk('How many? Tap and count!')}
const GI={balloons:bnew,shadow:snew,memory:mnew,wheel:wnew,zoom:znew,missing:msnew,find:fnew,scratch:scnew,odd:onew,count:cnew};
function lay(items,type){type=type||'grid';if(type==='row')return `<div class="row">${items.join('')}</div>`;
 if(type==='stagger')return `<div class="row" style="align-items:flex-start">${items.map((x,i)=>`<div style="transform:translateY(${i%2?60:-20}px) rotate(${i%2?4:-4}deg)">${x}</div>`).join('')}</div>`;
 if(type==='ring'){const n=items.length;return `<div class="ring" style="position:relative;width:1400px;height:520px">${items.map((x,i)=>{const a=-Math.PI/2+i*2*Math.PI/n;return `<div style="position:absolute;left:${700+500*Math.cos(a)-118}px;top:${270+170*Math.sin(a)-118}px">${x}</div>`}).join('')}</div>`}
 return `<div class="g2" style="${items.length>4?'grid-template-columns:repeat(3,330px)':''}">${items.join('')}</div>`}

function TH(){const s=L.stages[S.st];if(s&&s.res==='explore'&&L.explore){const p=exPlace();if(p&&p.theme)return Object.assign({},L.theme||{},p.theme)}return L.theme||{}}
function exPlace(){return L.explore.places.find(x=>x.id===S.ex.p)||L.explore.places[0]}
function scene(){const t=TH(),bg=(L.stages[S.st]&&L.stages[S.st].bg)||t.bg;if(bg)return `<img class="scene" src="${bg}" style="object-fit:cover"><div class="scene" style="background:radial-gradient(ellipse at 50% 45%,rgba(255,255,255,.18),rgba(0,0,0,0) 60%),linear-gradient(rgba(0,0,0,.06),rgba(0,0,0,.14))"></div>`;const k=t.scene||(t.deco==='farm'?'farm':'meadow');const f={ocean:sceneOcean,space:sceneSpace,snow:sceneSnow,party:sceneParty}[k];return f?f():sceneLand()}
const NOCLOUD=()=>!!((TH()).bg||(L.stages[S.st]&&L.stages[S.st].bg))||['ocean','space'].includes(TH().scene);
function sceneOcean(){let b='',f='',w='';for(let k=0;k<16;k++)b+=`<circle cx="${(k*113+60)%1600}" cy="900" r="${6+k%4*5}" fill="#fff" opacity=".35" style="animation:rise ${9+k%5*2}s linear ${-k*1.3}s infinite"/>`;
 for(let k=0;k<5;k++)f+=`<g style="animation:fly ${24+k*7}s linear ${-k*9}s infinite"><g transform="translate(0,${120+k*95}) scale(${.8+k%3*.25})"><ellipse rx="40" ry="22" fill="${['#FF9F43','#FF6B81','#FFD84D','#7BE0AD','#B28BFF'][k]}"/><path d="M-36 0 L-62 -22 L-62 22Z" fill="${['#FF9F43','#FF6B81','#FFD84D','#7BE0AD','#B28BFF'][k]}"/><circle cx="20" cy="-6" r="5" fill="#fff"/><circle cx="21" cy="-6" r="2.5" fill="#123"/></g></g>`;
 for(let k=0;k<9;k++){const x=40+k*190;w+=`<g style="transform-box:fill-box;transform-origin:50% 100%;animation:swayw ${3+k%3}s ease-in-out ${-k*.5}s infinite"><path d="M${x} 880 Q${x-30} 800 ${x} 740 Q${x+30} 690 ${x} 640" fill="none" stroke="${k%2?'#2FB067':'#3FCF86'}" stroke-width="16" stroke-linecap="round"/></g>`}
 return `<svg class="scene" viewBox="0 0 1600 900"><defs><linearGradient id="og" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5FD3F7"/><stop offset=".55" stop-color="#2A8FD8"/><stop offset="1" stop-color="#14529E"/></linearGradient></defs><rect width="1600" height="900" fill="url(#og)"/>${[200,560,980,1330].map((x,i)=>`<polygon points="${x},0 ${x+90},0 ${x+330-i*40},900 ${x-60},900" fill="#fff" opacity=".1" style="transform-box:fill-box;transform-origin:50% 0;animation:swayw ${9+i*2}s ease-in-out infinite"/>`).join('')}${b}${f}<path d="M0 800 Q300 740 640 790 T1300 780 T1600 770 V900 H0Z" fill="#F2D79B"/><path d="M0 850 Q400 810 900 850 T1600 835 V900 H0Z" fill="#E3C07A"/>${w}<g><ellipse cx="1420" cy="800" rx="90" ry="50" fill="#8a8fa8"/><ellipse cx="1500" cy="820" rx="60" ry="36" fill="#9aa0b8"/><g fill="#FF7AA8"><rect x="1180" y="720" width="18" height="100" rx="9"/><circle cx="1189" cy="716" r="22"/><rect x="1150" y="750" width="40" height="14" rx="7"/><circle cx="1148" cy="756" r="14"/></g><g fill="#FFA24D"><rect x="260" y="730" width="18" height="100" rx="9"/><circle cx="269" cy="726" r="22"/><circle cx="240" cy="760" r="16"/><circle cx="300" cy="765" r="16"/></g></g></svg>`}
function sceneSpace(){let s='';for(let k=0;k<70;k++)s+=`<circle cx="${(k*211+37)%1600}" cy="${(k*127+23)%820}" r="${1+k%4*1.2}" fill="#fff" style="animation:tw ${2+k%5}s ease-in-out ${-k*.37}s infinite"/>`;
 return `<svg class="scene" viewBox="0 0 1600 900"><defs><linearGradient id="spg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#090D2E"/><stop offset=".6" stop-color="#2B1B6B"/><stop offset="1" stop-color="#7A2F93"/></linearGradient><radialGradient id="pl" cx=".35" cy=".3"><stop offset="0" stop-color="#FFC27A"/><stop offset="1" stop-color="#E8683A"/></radialGradient><radialGradient id="pl2" cx=".35" cy=".3"><stop offset="0" stop-color="#9BE7FF"/><stop offset="1" stop-color="#3C7BE0"/></radialGradient></defs><rect width="1600" height="900" fill="url(#spg)"/>${s}<g transform="translate(1330,190)"><ellipse rx="210" ry="48" fill="none" stroke="#FFE0A8" stroke-width="16" opacity=".7" transform="rotate(-18)"/><circle r="110" fill="url(#pl)"/><ellipse rx="210" ry="48" fill="none" stroke="#FFE0A8" stroke-width="16" opacity=".9" transform="rotate(-18)" stroke-dasharray="330 400" stroke-dashoffset="-200"/></g><circle cx="190" cy="230" r="58" fill="url(#pl2)"/><circle cx="170" cy="210" r="14" fill="#fff" opacity=".3"/><path d="M420 120 a60 60 0 1 0 60 80 a46 46 0 1 1 -60 -80Z" fill="#FFF3C4" opacity=".95"/><g style="animation:shoot 9s linear 2s infinite"><path d="M1000 60 L1110 36" stroke="#fff" stroke-width="5" stroke-linecap="round"/><circle cx="1000" cy="60" r="6" fill="#fff"/></g><path d="M0 800 Q300 740 640 790 T1300 770 T1600 760 V900 H0Z" fill="#5B4A8F"/><path d="M0 850 Q420 815 900 850 T1600 835 V900 H0Z" fill="#46387A"/><ellipse cx="240" cy="830" rx="70" ry="14" fill="#382B66"/><ellipse cx="1180" cy="845" rx="90" ry="16" fill="#382B66"/><g transform="translate(1440,690)"><path d="M0 -90 q34 40 34 110 h-68 q0 -70 34 -110Z" fill="#fff"/><circle cy="-20" r="16" fill="#5BC8FF"/><path d="M-34 20 l-26 36 l26 -10Z M34 20 l26 36 l-26 -10Z" fill="#FF6B6B"/><path d="M-16 24 h32 l-16 40Z" fill="#FFC83D"/></g></svg>`}
function sceneSnow(){let s='';for(let k=0;k<40;k++)s+=`<circle cx="${(k*157+20)%1600}" cy="-20" r="${3+k%4*2}" fill="#fff" opacity=".9" style="animation:fall ${7+k%6*2}s linear ${-k*.9}s infinite"/>`;
 const pine=(x,y,z)=>`<g transform="translate(${x},${y}) scale(${z})"><rect x="-10" y="40" width="20" height="40" fill="#7a5230"/><path d="M0 -110 L55 -20 H-55Z M0 -60 L70 30 H-70Z M0 -10 L85 50 H-85Z" fill="#2F8F5B"/><path d="M0 -110 L22 -76 Q0 -66 -22 -76Z M0 -60 L28 -22 Q0 -10 -28 -22Z" fill="#fff"/></g>`;
 return `<svg class="scene" viewBox="0 0 1600 900"><defs><linearGradient id="snk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FC4FF"/><stop offset="1" stop-color="#E8F5FF"/></linearGradient></defs><rect width="1600" height="900" fill="url(#snk)"/><circle cx="1390" cy="170" r="74" fill="#FFF3C4" opacity=".9"/><circle cx="1390" cy="170" r="120" fill="#fff" opacity=".25"/><path d="M0 660 Q300 580 620 650 T1240 640 T1600 610 V900 H0Z" fill="#DCEBFA"/>${pine(130,610,1.1)}${pine(260,640,.8)}${pine(1480,590,1.15)}<path d="M0 745 Q380 670 760 745 T1600 715 V900 H0Z" fill="#F3F9FF"/><path d="M0 830 Q420 780 900 830 T1600 810 V900 H0Z" fill="#fff"/><g transform="translate(1330,700)"><circle cy="70" r="62" fill="#fff"/><circle cy="-10" r="46" fill="#fff"/><circle cy="-78" r="34" fill="#fff"/><circle cx="-12" cy="-86" r="4" fill="#123"/><circle cx="12" cy="-86" r="4" fill="#123"/><path d="M0 -76 l36 8 l-36 6Z" fill="#FF8A3D"/><path d="M-36 -48 q36 22 72 0 v16 q-36 22 -72 0Z" fill="#E94B5B"/><circle cy="-6" r="5" fill="#123"/><circle cy="24" r="5" fill="#123"/><path d="M-18 -112 h36 v14 h-36Z M-26 -98 h52 v10 h-52Z" fill="#3B4B6B"/></g>${s}</svg>`}
function sceneParty(){let f='';const cols=['#FF6B8B','#FFC83D','#6FD6FF','#8FE08A','#B28BFF'];for(let k=0;k<20;k++){const x=k*84+20,y=118+Math.sin(k/19*Math.PI)*46;f+=`<path d="M${x} ${y} l36 0 l-18 52Z" fill="${cols[k%5]}" transform="rotate(${(k-10)*1.2} ${x+18} ${y})"/>`}
 let c='';for(let k=0;k<36;k++)c+=`<rect x="${(k*181+30)%1600}" y="${(k*97+210)%560}" width="${10+k%3*5}" height="${6+k%2*4}" rx="2" fill="${cols[k%5]}" opacity=".7" transform="rotate(${k*37} 0 0)" style="animation:tw ${3+k%4}s ease-in-out ${-k*.3}s infinite"/>`;
 const bal=(x,y,col)=>`<g style="transform-box:fill-box;transform-origin:50% 100%;animation:swayw 4s ease-in-out infinite"><path d="M${x} ${y+110} q-14 90 6 190" fill="none" stroke="#fff" stroke-width="4" opacity=".8"/><ellipse cx="${x}" cy="${y}" rx="78" ry="98" fill="${col}"/><ellipse cx="${x-26}" cy="${y-34}" rx="16" ry="26" fill="#fff" opacity=".4"/><path d="M${x} ${y+98} l-12 18 h24Z" fill="${col}"/></g>`;
 return `<svg class="scene" viewBox="0 0 1600 900"><defs><linearGradient id="pg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFD3EA"/><stop offset=".5" stop-color="#D2C2FF"/><stop offset="1" stop-color="#A8E6FF"/></linearGradient><pattern id="chk" width="80" height="80" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#fff" opacity=".35"/><rect x="40" y="40" width="40" height="40" fill="#fff" opacity=".35"/></pattern></defs><rect width="1600" height="900" fill="url(#pg)"/><path d="M0 118 Q800 190 1600 118" fill="none" stroke="#fff" stroke-width="5" opacity=".8"/>${f}${c}<rect y="780" width="1600" height="120" fill="#FF9EC7"/><rect y="780" width="1600" height="120" fill="url(#chk)"/><rect y="772" width="1600" height="14" fill="#fff" opacity=".7"/>${bal(1480,640,'#FF6B8B')}${bal(1380,700,'#FFC83D')}${bal(140,650,'#6FD6FF')}<g transform="translate(1180,690)"><rect width="110" height="90" rx="8" fill="#8E7CF0"/><rect x="48" width="14" height="90" fill="#FFC83D"/><rect y="-22" width="110" height="26" rx="8" fill="#6A58D8"/><path d="M55 -22 q-34 -40 -10 -44 q22 4 10 44 q12 -40 36 -34 q14 14 -36 34Z" fill="#FFC83D"/></g></svg>`}
function zooMapSVG(){const Z=L.zoo,pl=Z.places;let d=`M800 900 C800 820 ${pl[0].x} ${pl[0].y+120} ${pl[0].x} ${pl[0].y+60}`;pl.slice(1).forEach(p=>{d+=` S ${p.x} ${p.y+140} ${p.x} ${p.y+60}`});
 const tree=(x,y,s)=>`<g transform="translate(${x},${y}) scale(${s})"><rect x="-8" y="0" width="16" height="50" fill="#8a5a33"/><circle cy="-10" r="46" fill="#5CB85C"/><circle cx="-24" cy="12" r="30" fill="#4FA84F"/><circle cx="26" cy="12" r="30" fill="#4FA84F"/></g>`;
 let trees='';for(let k=0;k<26;k++)trees+=tree((k*173+60)%1560+20,(k*97+40)%860+20,.55+(k%4)*.12);
 const enc=pl.map(p=>`<g><ellipse cx="${p.x}" cy="${p.y+20}" rx="190" ry="120" fill="#CFEFB0" stroke="#fff" stroke-width="10"/><ellipse cx="${p.x}" cy="${p.y+20}" rx="190" ry="120" fill="none" stroke="#8a5a33" stroke-width="6" stroke-dasharray="14 12"/></g>`).join('');
 return `<svg style="position:absolute;left:0;top:0" width="1600" height="900" viewBox="0 0 1600 900"><defs><linearGradient id="zg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9BE08A"/><stop offset="1" stop-color="#6CC56C"/></linearGradient></defs><rect width="1600" height="900" fill="url(#zg)"/><ellipse cx="1380" cy="760" rx="150" ry="70" fill="#6FC7F7" stroke="#fff" stroke-width="8"/>${trees}<path d="${d}" fill="none" stroke="#fff" stroke-width="64" stroke-linecap="round" opacity=".9"/><path d="${d}" fill="none" stroke="#E8C79A" stroke-width="46" stroke-linecap="round"/>${enc}<g transform="translate(800,880)"><rect x="-120" y="-60" width="240" height="70" rx="16" fill="#FFC83D" stroke="#B8860B" stroke-width="6"/><text y="-12" text-anchor="middle" font-family="Fredoka,sans-serif" font-weight="700" font-size="44" fill="#16324F">ZOO</text></g></svg>`}
function EXD(t){const d=t.deco;
 if(d==='gate')return `<g><rect x="250" y="360" width="60" height="400" fill="#B8865A"/><rect x="1290" y="360" width="60" height="400" fill="#B8865A"/><path d="M230 380 Q800 180 1370 380 L1370 440 Q800 250 230 440Z" fill="#D9A066" stroke="#8a5a33" stroke-width="8"/><rect x="560" y="268" width="480" height="104" rx="26" fill="#FFC83D" stroke="#B8860B" stroke-width="8"/><text x="800" y="344" text-anchor="middle" font-family="Fredoka,sans-serif" font-weight="700" font-size="74" fill="#16324F">${t.sign||'Welcome'}</text>${[0,1,2,3,4,5,6].map(i=>`<circle cx="${590+i*70}" cy="256" r="9" fill="${['#FF7AA8','#FFC83D','#6FC7F7','#8FD16B'][i%4]}"/>`).join('')}</g>`;
 if(d==='pond')return `<g><ellipse cx="800" cy="800" rx="520" ry="96" fill="#3C9BD8"/><ellipse cx="800" cy="790" rx="480" ry="76" fill="#6FC7F7"/><ellipse cx="620" cy="786" rx="150" ry="18" fill="#fff" opacity=".35"/>${[300,420,1180,1300].map((x,i)=>`<g transform="translate(${x},${780-i%2*10})"><path d="M0 40 Q-6 -40 0 -90 M14 40 Q22 -30 16 -70" stroke="#3f9a4a" stroke-width="6" fill="none"/><ellipse cx="0" cy="-100" rx="10" ry="26" fill="#8a5a33"/></g>`).join('')}<ellipse cx="960" cy="816" rx="48" ry="14" fill="#6fcf6f"/><ellipse cx="560" cy="826" rx="38" ry="11" fill="#6fcf6f"/></g>`;
 if(d==='rocks')return `<g><path d="M120 800 Q180 640 330 700 Q420 600 560 720 L580 820Z" fill="#9aa5ad"/><path d="M1020 820 Q1100 640 1260 700 Q1400 610 1500 780 L1500 830Z" fill="#8c979f"/></g>`;
 if(d==='bars'){let b='';for(let x=60;x<1560;x+=70)b+=`<rect x="${x}" y="360" width="14" height="440" rx="6" fill="#5b6b7a" opacity=".85"/>`;return `<g>${b}<rect x="40" y="360" width="1520" height="16" rx="8" fill="#47566a"/><rect x="40" y="700" width="1520" height="16" rx="8" fill="#47566a"/></g>`}
 return ''}
function sceneLand(){const t=TH(),sk=t.sky||['#5EC8FF','#B9E8FF','#FFF4D6'],hl=t.hills||['#A8E08A','#7CCB6B','#58B558'];
const fl=(n,y0,sp,seed)=>{let s='';for(let k=0;k<n;k++){const x=(k*sp+seed*37)%1640-20,y=y0+((k*53+seed*11)%40),c=['#FF7AA8','#FFC83D','#fff','#B28BFF','#FF8A5B'][(k+seed)%5];s+=`<g transform="translate(${x},${y})"><rect x="-1.5" y="0" width="3" height="22" fill="#3f9a4a"/><circle r="8" cy="-2" fill="${c}"/><circle r="3.5" cy="-2" fill="#FFE27A"/></g>`}return s};
const tree=(x,y,s,c)=>`<g transform="translate(${x},${y}) scale(${s})"><rect x="-9" y="-10" width="18" height="70" rx="6" fill="#8a5a33"/><circle cx="0" cy="-40" r="52" fill="${c}"/><circle cx="-34" cy="-14" r="34" fill="${c}"/><circle cx="34" cy="-14" r="34" fill="${c}"/><circle cx="-14" cy="-58" r="18" fill="#fff" opacity=".18"/></g>`;
const barn=`<g transform="translate(1180,610)"><rect x="0" y="40" width="190" height="130" fill="#D8483B"/><path d="M-12 44 L95 -26 L202 44Z" fill="#B53226"/><path d="M-12 44 L95 -26 L202 44" fill="none" stroke="#8f2418" stroke-width="6" stroke-linejoin="round"/><rect x="58" y="86" width="74" height="84" fill="#fff"/><path d="M58 86 L132 170 M132 86 L58 170" stroke="#D8483B" stroke-width="8"/><rect x="58" y="86" width="74" height="84" fill="none" stroke="#D8483B" stroke-width="8"/><circle cx="95" cy="26" r="13" fill="#fff"/><rect x="190" y="70" width="42" height="100" fill="#C23B2E"/><path d="M186 74 L211 44 L236 74Z" fill="#8f2418"/></g>`;
const fence=(x0,x1,y)=>{let s=`<rect x="${x0}" y="${y+14}" width="${x1-x0}" height="9" rx="4" fill="#fff"/><rect x="${x0}" y="${y+38}" width="${x1-x0}" height="9" rx="4" fill="#fff"/>`;for(let x=x0;x<x1;x+=56)s+=`<rect x="${x}" y="${y}" width="16" height="62" rx="6" fill="#fff"/><rect x="${x}" y="${y+54}" width="16" height="8" fill="#e5e9ee"/>`;return s};
const farm=t.deco==='farm'||t.scene==='farm';
return `<svg class="scene" viewBox="0 0 1600 900"><defs><linearGradient id="skg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sk[0]}"/><stop offset=".62" stop-color="${sk[1]}"/><stop offset="1" stop-color="${sk[2]||sk[1]}"/></linearGradient><radialGradient id="glow"><stop offset="0" stop-color="#FFF3B0" stop-opacity=".95"/><stop offset="1" stop-color="#FFF3B0" stop-opacity="0"/></radialGradient><pattern id="rows" width="46" height="46" patternUnits="userSpaceOnUse" patternTransform="skewX(-20)"><rect width="23" height="46" fill="#fff" opacity=".07"/></pattern><linearGradient id="shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#0b3d2a" stop-opacity=".32"/></linearGradient></defs>
<rect width="1600" height="900" fill="url(#skg)"/>
<g transform="translate(1390,170)"><circle r="330" fill="url(#glow)" opacity=".7"/><g style="transform-origin:0 0;animation:spin 60s linear infinite">${Array.from({length:12},(_,k)=>`<path d="M-16 -150 L0 -270 L16 -150Z" fill="#FFF3B0" opacity=".3" transform="rotate(${k*30})"/>`).join('')}</g><circle r="92" fill="#FFD84D"/><circle r="74" fill="#FFC72C"/><circle cx="-22" cy="-24" r="22" fill="#fff" opacity=".35"/></g>
<g opacity=".9" fill="#fff"><g class="bird" style="animation:fly 28s linear infinite"><path d="M0 0 q14 -16 28 0 q14 -16 28 0" fill="none" stroke="#2c5d86" stroke-width="5" stroke-linecap="round"/></g><g class="bird" style="animation:fly 38s linear -14s infinite;transform:translateY(80px)"><path d="M0 0 q10 -12 20 0 q10 -12 20 0" fill="none" stroke="#2c5d86" stroke-width="4" stroke-linecap="round"/></g></g>
<path d="M0 600 Q220 520 470 585 T930 560 T1300 590 T1600 560 V900 H0Z" fill="#8FD3C7" opacity=".75"/>
<path d="M0 690 Q300 590 620 680 T1240 660 T1600 640 V900 H0Z" fill="${hl[0]}"/><path d="M0 690 Q300 590 620 680 T1240 660 T1600 640 V900 H0Z" fill="url(#rows)"/>
${farm?barn:''}${tree(150,640,1.05,'#4FAE5A')}${tree(1500,625,.9,'#58B968')}${farm?'':tree(1000,650,.8,'#4FAE5A')}
<path d="M0 760 Q380 680 760 760 T1600 730 V900 H0Z" fill="${hl[1]}"/><path d="M0 760 Q380 680 760 760 T1600 730 V900 H0Z" fill="url(#rows)"/>
${farm?fence(1430,1620,712):''}${EXD(t)}${fl(30,745,57,1)}
<path d="M0 835 Q420 785 900 835 T1600 815 V900 H0Z" fill="${hl[2]}"/><rect y="780" width="1600" height="120" fill="url(#shade)"/>${fl(26,838,63,3)}
<g fill="#fff" opacity=".5">${Array.from({length:14},(_,k)=>`<circle cx="${(k*131+70)%1600}" cy="${(k*97+60)%520}" r="${3+k%3*2}" style="animation:tw ${3+k%4}s ease-in-out ${k*.4}s infinite"/>`).join('')}</g></svg>`}
const STAR='<svg width="40" height="40" viewBox="0 0 24 24"><path fill="#FFB800" d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 21l1.6-7L2 9.2l7.1-.6z"/></svg>';
function prog(){return `<div class="prog">${L.stages.map((s,i)=>`<i class="${i<S.st?'d':i===S.st?'n':''}"></i>`).join('')}</div>`+(S.ts>0?`<div class="score">${STAR}${S.ts}</div>`:'')}
function stageHTML(){const r=L.stages[S.st].res,w=L.words,cur=w[S.fi];let h='';
 if(r==='hello')h=L.hello&&L.hello.pic?`<div class="q1">${L.hello.q}</div>${pic(L.hello.pic,'bigp')}<div class="t2">${L.hello.t||''}</div>`:`<div class="q1">${L.hello?L.hello.q:"What's the weather today?"}</div><div class="row">${w.map(x=>pic(x,'smp')).join('')}</div><div class="t2">${L.hello?L.hello.t:'Look at the window!'}</div>`;
 else if(r==='video')h=`<video id="vid" src="${L.video}" playsinline preload="auto" onclick="act('vtoggle')" style="width:1400px;height:788px;object-fit:cover;border-radius:30px;box-shadow:0 14px 40px rgba(0,0,0,.3);background:#000"></video><div class="hint">${L.videoHint||'Tap the picture to play or pause'}</div>`;
 else if(r==='yt'&&!YTOK){const v=YL()[S.yi]||YL()[0];h=`<div class="songcard"><svg width="150" height="150" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#fff"/><path d="M10 7.5v9l7-4.5z" fill="#5B8DEF"/></svg><div class="q1" style="font-size:84px">Song time!</div><div class="t2">${v.t}</div></div>`}
 else if(r==='yt'){const v=YL()[S.yi]||YL()[0];h=`<div style="position:relative"><iframe id="yt" data-id="${v.id}" src="https://www.youtube.com/embed/${v.id}?enablejsapi=1&rel=0&playsinline=1&modestbranding=1&mute=${VIEW==='teacher'?1:0}" allow="autoplay; encrypted-media" allowfullscreen style="width:1240px;height:698px;border:0;border-radius:30px;box-shadow:0 14px 40px rgba(0,0,0,.3);background:#000"></iframe></div><div class="t2">${v.t}</div>`}
 else if(r==='real'){const wd=w[S.rw||0];h=`<div style="position:relative"><video id="vid" src="${L.real[wd]}" playsinline loop preload="auto" onclick="act('vtoggle')" style="width:1240px;height:698px;object-fit:cover;border-radius:30px;box-shadow:0 14px 40px rgba(0,0,0,.3);background:#000"></video><div style="position:absolute;left:44px;top:20px;font-size:92px;font-weight:900;color:#fff;text-shadow:0 4px 18px rgba(0,0,0,.65)">${wd}</div></div><div class="t2">Real ${wd}</div>`}
 else if(r==='tapoff')h=`<div class="t2">${S.tapOff?'Well done! Save water!':'Oh no! Turn the tap off!'}</div><div onclick="act('tapt')" style="cursor:pointer;width:1000px;height:560px;border-radius:30px;overflow:hidden;box-shadow:0 14px 40px rgba(0,0,0,.25);background:#fff"><img src="${S.tapOff?L.tapOffImg:L.tapOnImg}" style="width:100%;height:100%;object-fit:contain"></div>`;
 else if(r==='letter'){const q=L.letter;h=`<div onclick="act('sayletter')" style="cursor:pointer;text-align:center"><div style="font:700 480px/1 Fredoka,sans-serif;color:#fff;-webkit-text-stroke:26px var(--ink);paint-order:stroke fill;text-shadow:0 16px 0 var(--ink)">${q.u}${q.l}</div><div class="t2" style="margin-top:6px">${q.sound}</div></div><div class="row">${w.map(x=>pic(x,'smp')).join('')}</div>`}
else if(r==='intro'){const T0=(L.title||'Lesson'),ws=T0.split(' '),fs=Math.max(84,Math.min(170,Math.round(1500/(T0.length*.56)))),cols=['#FF8A5B','#FFC83D','#6FC7F7','#8FD16B','#FF7AA8','#B28BFF'];let li=0;const bg=L.theme&&L.theme.bg?`<img src="${L.theme.bg}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">`:'';
 h=`<div class="intro">${bg}<div class="shade"></div><div class="rib">${(L.level||'K1')} · English</div><div class="tt" style="--fs:${fs}px">${ws.map(wd=>`<div style="display:flex">${[...wd].map(ch=>`<span style="color:${cols[(li++)%6]};animation-delay:${(li*.07).toFixed(2)}s,${(li*.2).toFixed(2)}s">${ch}</span>`).join('')}</div>`).join('')}</div><div class="bd">${w.slice(0,6).map((x,i)=>`<div style="animation-delay:${(.6+i*.1).toFixed(1)}s">${pic(x,'')}<b>${x}</b></div>`).join('')}</div><button class="go" onclick="act('introgo')">Let's go!</button></div>`}
 else if(r==='zoomap'){const Z=L.zoo,Y=S.zp,pl=Z.places,mp=Z.map?`<img src="${Z.map}" style="position:absolute;left:0;top:0;width:1600px;height:900px">`:zooMapSVG();const sc=2.6,tf=i=>`--tx:${(800-pl[i].x*sc).toFixed(0)}px;--ty:${(450-pl[i].y*sc).toFixed(0)}px;--sc:${sc}`;
  const pins=pl.map((p,i)=>`<div class="zpin" style="left:${p.x}px;top:${p.y}px" onclick="act('zpgo',${i})"><div class="zpb">${pic(p.w,'smp')}</div><div class="exlb">${p.w}</div></div>`).join('');
  if(Y.i==null){const anim=Y.from!=null?`animation:zout .9s ease-out both;${tf(Y.from)}`:'';h=`<div class="zmap" style="${anim}">${mp}${pins}</div><div class="exname" style="top:70px">${Z.title||'The Zoo'}</div><div class="exdots" style="top:160px"><span class="t2" style="font-size:40px">${Y.from!=null?'':'Tap an animal to go there!'}</span></div>`}
  else{const p=pl[Y.i];h=`<div class="zmap" style="animation:zin 1.1s ease-in-out both;${tf(Y.i)}">${mp}${pins}</div><div class="zov"><div class="zvid"><video id="zv" src="${p.clip}" autoplay muted loop playsinline style="width:100%;height:100%;object-fit:cover"></video><div class="zword">${p.w}</div></div><div class="t2 zfact">${p.fact||''}</div><button class="zback" onclick="act('zpback')">Map</button></div>`}}
 else if(r==='explore'){const P=exPlace(),E=S.ex;const dots=L.explore.places.map(x=>`<i class="${x.id===P.id?'n':''}"></i>`).join('');const sp=P.spots.map((s,i)=>`<div class="exsp" style="left:${s.x}px;top:${s.y}px;animation-delay:-${(i*.7).toFixed(1)}s" onclick="act('exopen',${i})">${pic(s.w,'midp')}<div class="exlb">${s.w}</div></div>`).join('');const arr=['l','r'].map(d=>P.go&&P.go[d]?`<div class="exar ${d}" onclick="act('exgo','${d}')"><svg width="110" height="110" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#FFC83D"/><path fill="#16324F" d="${d==='r'?'M9 6l6 6-6 6-1.6-1.6L11.8 12 7.4 7.6z':'M15 6l-6 6 6 6 1.6-1.6L12.2 12l4.4-4.4z'}"/></svg><span>${L.explore.places.find(x=>x.id===P.go[d]).name}</span></div>`:'').join('');const o=E.o!=null?P.spots[E.o]:null;const card=o?`<div class="excard" onclick="act('exclose')">${pic(o.w,'bigp')}<div class="wd" style="font-size:130px">${o.w}</div><div class="t2">${o.fact||''}</div></div>`:'';h=`<div class="exwrap ${E.d?'exin'+(E.d>0?'r':'l'):''}" data-k="${E.k}"><div class="exname">${P.name}</div><div class="exdots">${dots}</div>${sp}${arr}${card}</div>`}
 else if(r==='words')h=`<div onclick="act('sayfi')">${S.ph&&L.realPics?`<span class="pic bigp"><img src="${L.realPics[cur]}"></span>`:pic(cur,'bigp')}</div><div class="wd">${cur}</div><div class="t2" style="color:#2E7CC4">${L.wordSay||"It's "}${cur}.</div>`;
 else if(r==='mime'){h=S.mime?`${pic(S.mime,'bigp')}<div class="wd">${S.mime}</div><div class="t2">Show me!</div>`:`<div class="q1">${L.mimeQ||'Stand up! Show me the weather!'}</div><div class="row">${w.map(x=>pic(x,'smp')).join('')}</div>`}
 else if(r==='chant')h=`<div class="panel">${L.chant.map((l,i)=>`<div class="cline ${S.cl===i?'hl':''}">${l}<small>${L.chantActions[i]}</small></div>`).join('')}</div>`;
 else if(r==='tap'){h=S.tt?`<div class="t2">${S.tp?(S.tp===S.tt?'Yes!':'Try again!'):'Tap the '+S.tt+'!'}</div>${lay(S.topts.map(x=>`<div class="card ${S.tp===x?(x===S.tt?'ok':'no'):''}" onclick="act('pick','${x}')">${pic(x,'midp')}</div>`),L.stages[S.st].layout)}<div class="hint">Stars: ${S.ts}</div>`:`<div class="q1">Listen and tap!</div><div class="row">${w.map(x=>pic(x,'smp')).join('')}</div>`}
 else if(r==='balloons'){const b=S.bl;if(!b)h='<div class="q1">Pop the balloons!</div>';else{const el=(Date.now()-b.t0)/1000;h=`<div class="top"><div class="q1">${b.done?'Pop! '+b.t+'!':'Pop the '+b.t+'!'}</div></div>`+b.items.map((it,i)=>`<div class="bln ${it.o?'gone':''} ${b.wob===i?'wob':''}" style="left:${it.px}px;top:${it.py}px;--c:${it.c};animation-delay:-${((el+i*.5)%3.2).toFixed(2)}s" onclick="act('bpop',${i})"><div class="bb">${pic(it.w)}</div><div class="knot"></div><div class="str"></div></div>`).join('')}}
 else if(r==='shadow'){const s=S.sh;if(!s)h='<div class="q1">Whose shadow?</div>';else h=`<div class="t2">${s.done?"It's a "+s.t+'!':'Whose shadow is this?'}</div><div style="height:300px;display:flex;align-items:center">${s.done?pic(s.t,'midp'):`<img class="sil" src="${L.sil[s.t]}">`}</div><div class="row">${s.opts.map(x=>`<div class="card ${s.bad===x?'no':''} ${s.done&&x===s.t?'ok':''}" onclick="act('spick','${x}')">${pic(x,'smp')}</div>`).join('')}</div>`}
 else if(r==='memory'){const m=S.mm;if(!m)h='<div class="q1">Memory game</div>';else{const all=m.done.length===m.cards.length;h=`<div class="t2">${all?'You found them all!':'Find the matching pairs!'}</div><div class="mgrid">${m.cards.map((c,i)=>{const op=m.up.includes(i)||m.done.includes(i);return `<div class="mc ${op?'':'back'} ${m.up.includes(i)?'up':''} ${m.done.includes(i)?'dn':''}" style="--c:${pc(c.k)}" onclick="act('mflip',${i})">${op?(c.t&&L.realPics?`<img class="rp" src="${L.realPics[c.k]}">`:pic(c.k,'mp')):'?'}</div>`}).join('')}</div>`}}
 else if(r==='wheel'){const W=S.wh;if(!W)h='<div class="q1">Spin the wheel!</div>';else{const n=w.length,sg=360/n,P=(a,rr)=>[(350+rr*Math.sin(a*Math.PI/180)).toFixed(1),(350-rr*Math.cos(a*Math.PI/180)).toFixed(1)];const C=PAL;const segs=w.map((x,i)=>{const a0=i*sg,a1=(i+1)*sg,p0=P(a0,340),p1=P(a1,340),mid=(a0+a1)/2;return `<path d="M350 350 L${p0} A340 340 0 0 1 ${p1}Z" fill="${C[i%6]}" stroke="#fff" stroke-width="8"/><g transform="rotate(${mid} 350 350)"><image href="${L.pics[x]}" x="265" y="60" width="170" height="170" style="clip-path:inset(0 round 24px)"/></g>`}).join('');const anim=W.sp?`animation:wspin 3.6s cubic-bezier(.12,.7,.1,1) both;--f:${W.f}deg;--t:${W.rot}deg`:`transform:rotate(${W.rot}deg)`;h=`<div class="top"><div class="t2" style="font-size:50px">${W.done?'Show me '+W.t+'!':'Tap the wheel to spin!'}</div></div><div class="wheelbox" onclick="act('wspin')"><svg class="wheel" viewBox="0 0 700 700" style="${anim}">${segs}</svg><svg class="pointer" viewBox="0 0 68 90"><path d="M34 90 L4 20 A34 34 0 1 1 64 20Z" fill="#FF8A5B" stroke="#fff" stroke-width="6"/></svg><div class="hub">SPIN</div></div>`}}
 else if(r==='zoom'){const Z=S.zm;if(!Z)h='<div class="q1">What is it?</div>';else{const sc=[7,4,2,1],f=sc[Math.max(0,Z.l-1)],tt=sc[Z.l];h=`<div class="t2">${Z.done?"It's a "+Z.t+'!':'What is it?'}</div><div onclick="act('zout')" class="pic bigp zoomf" style="--c:${pc(Z.t)}"><img src="${Z.l===3&&L.realPics&&Z.p?L.realPics[Z.t]:L.pics[Z.t]}" style="--ox:${Z.ox}%;--oy:${Z.oy}%;${Z.l>0&&!Z.done?`animation:zz .9s ease-out both;--f:${f};--t:${tt}`:`transform:scale(${tt})`}"></div>${Z.done?`<div class="wd" style="font-size:130px">${Z.t}</div>`:''}`}}
 else if(r==='missing'){const M=S.ms;if(!M)h='<div class="q1">Who is missing?</div>';else{h=`<div class="t2">${M.h<0?'Look at the pictures!':M.rev?'It was '+M.ord[M.h]+'!':"Who is missing?"}</div><div class="row">${M.ord.map((x,i)=>M.h===i&&!M.rev?`<div class="mc back" style="width:230px;height:230px" onclick="act('msshow')">?</div>`:`<div class="card ${M.h===i&&M.rev?'ok':''}">${pic(x,'smp')}</div>`).join('')}</div>`}}
 else if(r==='find'){const F=S.fd;if(!F)h='<div class="q1">Find it!</div>';else{h=`<div class="top"><div class="q1">${F.done?'You found it!':'Find the '+F.t+'!'}</div></div>`+F.items.map((it,i)=>`<div class="fi ${it.o?'o':''} ${F.wob===i?'wob':''}" style="left:${it.px}px;top:${it.py}px;transform:rotate(${(i*37)%13-6}deg)" onclick="act('fpick',${i})">${pic(it.w)}</div>`).join('')}}
 else if(r==='scratch'){const Q=S.sc;if(!Q)h='<div class="q1">What is hiding?</div>';else{h=`<div class="t2">${Q.done?"It's a "+Q.t+'!':'What is hiding? Tap to look!'}</div><div style="position:relative;width:740px;height:430px">${pic(Q.t,'bigp')}${Q.tiles.map((o,i)=>`<div class="stile ${o||Q.done?'o':''}" style="left:${(i%4)*185}px;top:${Math.floor(i/4)*143.33}px;width:185px;height:143.4px" onclick="act('sct',${i})">?</div>`).join('')}</div>`}}
 else if(r==='odd'){const O=S.od;if(!O)h='<div class="q1">Which is different?</div>';else{h=`<div class="t2">${O.done?"Yes! It's a "+O.b+'!':'Which one is different?'}</div>${lay(O.items.map((x,i)=>`<div class="card ${O.bad===i?'no':''} ${O.done&&x===O.b?'ok':''}" onclick="act('opick',${i})">${pic(x,'smp')}</div>`),L.stages[S.st].layout||'row')}`}}
 else if(r==='count'){const K=S.ct;if(!K)h='<div class="q1">How many?</div>';else{h=`<div class="t2">${K.done?'Well done!':'How many? Tap and count!'}</div><div class="row">${K.items.map((o,i)=>`<div class="ci ${o?'o':''}" onclick="act('cnt',${i})">${pic(K.w,'smp')}${o?`<div class="cnum">${o}</div>`:''}</div>`).join('')}</div>${K.done?`<div class="bigno">${K.n}</div>`:''}`}}
 else if(r==='doors')h=`<div class="t2">${L.doorsQ||"What's the weather?"}</div><div class="g2" style="grid-template-columns:repeat(4,330px);gap:24px">${S.doors.map((d,i)=>`<div class="door ${d.o?'open':''}" onclick="act('door',${i})">${d.o?pic(d.w)+d.w:i+1}</div>`).join('')}</div>`;
 else if(r==='draw')h=`<div class="q1">${L.drawQ||'Draw the weather!'}</div><div class="row">${w.map(x=>pic(x,'midp')).join('')}</div>`;
 else if(r==='show')h=`<div class="q1">Show your friend!</div><div class="t2">What's this?</div><div class="row">${w.map(x=>pic(x,'smp')).join('')}</div>`;
 else if(r==='bye')h=`<div class="q1">${L.bye?L.bye.q:'Show me sunny! Goodbye!'}</div>${pic(L.bye?L.bye.pic:'sunny','bigp')}`;
 return scene()+clouds()+prog()+`<div class="main ${L.stages[S.st].skin?'sk-'+L.stages[S.st].skin:''}">${h}</div>`}
function w3load(cb){if(window.K1W)return cb();if(window._w3q){window._w3q.push(cb);return}window._w3q=[cb];const a=document.createElement('script');a.src='lib/three.min.js';a.onload=()=>{const b=document.createElement('script');b.src='lib/world.js';b.onload=()=>{const q=window._w3q;window._w3q=null;q.forEach(f=>f())};document.head.appendChild(b)};document.head.appendChild(a)}
let _lk=0;
function w3draw(root){const s16=root.firstElementChild;
 if(!root._w3||root.dataset.w3!==String(S.st)){root.dataset.w3=S.st;root._w3=null;root._w3o='x';s16.innerHTML=`<div class="w3host" style="position:absolute;inset:0;overflow:hidden;background:#BFE8FF"></div><div class="w3ui"></div>`;
  w3load(()=>{if(root.dataset.w3!==String(S.st)||root._w3)return;const host=s16.querySelector('.w3host');if(!host)return;
   root._w3=K1W.create(host,L.world,{look:(y,p)=>{const n=performance.now();if(n-_lk<70)return;_lk=n;act('w3look',{yaw:y,pitch:p})},go:d=>act('w3go',d),open:i=>act('w3open',i)});root._w3.set(S.w3);w3ui(root)})}
 else{root._w3.set(S.w3);w3ui(root)}
 if(VIEW==='teacher'){stHL();ctl()}else{fitFull()}}
function w3ui(root){const ui=root.querySelector('.w3ui'),W=root._w3;if(!ui||!W)return;const E=S.w3,key=E.n+'/'+E.o+'/'+E.k;if(root._w3o===key)return;root._w3o=key;
 const names=W.names,it=E.o!=null?L.world.items[W.order[E.o]]:null,wd=E.o!=null?W.order[E.o]:null;
 ui.innerHTML=prog()+(E.o==null?`<div class="exname" style="top:70px;z-index:6">${names[E.n]}</div>`:'')+(E.o==null?`<div class="w3bar">${E.n>0?`<button onclick="act('w3go',-1)">&#9664; Back</button>`:''}<span class="t2" style="font-size:36px">Drag to look around</span>${E.n<W.nodes-1?`<button onclick="act('w3go',1)">Walk &#9654;</button>`:''}</div>`:`<div class="w3card" style="animation-delay:.9s"><div class="zword2">${wd}</div><div class="zvid" style="width:760px;height:428px"><video src="${it.clip}" autoplay muted loop playsinline style="width:100%;height:100%;object-fit:cover"></video></div><div class="t2 zfact" style="max-width:760px;font-size:38px">${it.fact||''}</div></div><button class="zback" onclick="act('w3close')">Back to the zoo</button>`)}
const K1W_N=4,W_NAMES=['the zoo gate','the lion and zebra','the elephant and giraffe','the monkey and penguin'],W_ORDER=['lion','zebra','elephant','giraffe','monkey','penguin'];
function fit(box){const k=box.clientWidth/1600;const s=box.firstElementChild;s.style.transform=`scale(${k})`;box.style.height=(900*k)+'px'}
function render(root){const ent=root.dataset.stg!==String(S.st);root.dataset.stg=S.st;const s=root.firstElementChild;s.innerHTML=stageHTML();mount(root);if(ent){s.classList.add('entering');clearTimeout(s._t);s._t=setTimeout(()=>s.classList.remove('entering'),1100)}}
function draw(){const root=VIEW==='student'?$('sv'):$('pv');if(!root)return;const rr=L.stages[S.st].res,vk=S.st+'/'+(S.rw||0);if(root._w3&&rr!=='walk3d'){try{root._w3.dispose()}catch(e){}root._w3=null;root.dataset.w3=''}if(rr==='walk3d'){w3draw(root);return}if(rr==='yt'&&YTOK){const k='yt/'+S.yi;if(root.dataset.vs===k&&root.querySelector('#yt')){ytSync(root);if(VIEW==='teacher'){stHL();ctl()}return}root.dataset.vs=k;render(root);const f=root.querySelector('#yt');f.onload=()=>{try{f.contentWindow.postMessage(JSON.stringify({event:'listening'}),'*')}catch(e){}setTimeout(()=>ytSync(root,1),700)};if(VIEW==='teacher'){stHL();ctl()}else{fitFull()}return}const isV=rr==='video'||rr==='real';if(isV&&root.dataset.vs===vk&&root.querySelector('#vid')){if(VIEW==='teacher'){stHL();ctl()}return}root.dataset.vs=isV?vk:'';render(root);
 if(VIEW==='teacher'){stHL();ctl()}else{fitFull()}}
let ytSeen=-1;function ytSync(root,force){const f=root.querySelector('#yt');if(!f)return;if(!force&&S.yn===ytSeen)return;ytSeen=S.yn;try{f.contentWindow.postMessage(JSON.stringify({event:'command',func:S.yp?'playVideo':'pauseVideo',args:''}),'*')}catch(e){}}
function fitFull(){const b=$('sv'),k=Math.min(innerWidth/1600,innerHeight/900);const s=b.firstElementChild;s.style.transform=`scale(${k})`;b.style.width=1600*k+'px';b.style.height=900*k+'px'}
// ---------- teacher UI ----------
let cur=0,left=0,run=false;
function stHL(){L.stages.forEach((_,j)=>{const b=$('st'+j);if(b){b.classList.toggle('on',j==S.st);b.classList.toggle('done',j<S.st)}})}
function ctl(){const r=L.stages[S.st].res;const B=(t,a,p,c)=>`<button class="b ${c||''}" onclick="act('${a}'${p!==undefined?','+JSON.stringify(p).replace(/"/g,"&quot;"):''})">${t}</button>`;let h='';
 if(r==='words')h=B('Back','fi',-1)+B('Prompt','sayfi','','y')+B('Next','fi',1)+B('Random','fir','','g')+(L.realPics?B(S.ph?'Show cartoon':'Show real photo','photo','','g'):'');
 else if(r==='walk3d')h=B('Walk forward','w3go',1,'y')+B('Walk back','w3go',-1,'')+B('Back to the zoo','w3close','','g');
 else if(r==='intro')h=B("Let's go!",'introgo','','y');else if(r==='zoomap')h=L.zoo.places.map((p,i)=>B(p.w,'zpgo',i,S.zp.i===i?'y':'')).join('')+B('Back to map','zpback','','g');
 else if(r==='explore')h=B('Walk left','exgo','l','y')+B('Walk right','exgo','r','y')+B('Close','exclose','','g');
 else if(r==='letter')h=B('Say the sound','sayletter','','y');
 else if(r==='mime')h=B('Random mime','mime','','y');
 else if(r==='chant')h=B('Play along','chant','','y')+B('Stop','chstop','','g');
 else if(r==='tap')h=B('Next','tapnew','','y')+B('Say again','tapsay','','g')+`<span class="lab">Stars: ${S.ts}</span>`;
 else if(r==='doors')h=B('Shuffle doors','shuf','','y');
 else if(r==='video')h=B('Play','vplay','','y')+B('Pause','vpause','','g')+B('Restart','vreset','','g');
 else if(r==='wheel')h=B('Spin','wspin','','y')+B('Say again','wsay','','g')+`<span class="lab">Stars: ${S.ts}</span>`;
 else if(r==='zoom')h=B('Zoom out','zout','','y')+B('Next picture','znew','','g')+(L.realPics?B('Real photo','zphoto','','g'):'')+`<span class="lab">Stars: ${S.ts}</span>`;
 else if(r==='missing')h=B('Hide one','mshide','','y')+B('Show who','msshow','','g')+B('New order','msreorder','','g')+`<span class="lab">Stars: ${S.ts}</span>`;
 else if(r==='find')h=B('Next round','fnew','','y')+B('Say again','fsay','','g')+`<span class="lab">Stars: ${S.ts}</span>`;
 else if(r==='scratch')h=B('Reveal all','scall','','y')+B('Next picture','scnew','','g')+`<span class="lab">Stars: ${S.ts}</span>`;
 else if(r==='odd')h=B('Next','onew','','y')+B('Say again','osay','','g')+`<span class="lab">Stars: ${S.ts}</span>`;
 else if(r==='count')h=B('Next','cnew','','y')+`<span class="lab">Stars: ${S.ts}</span>`;
 else if(r==='balloons')h=B('Next balloons','bnew','','y')+B('Say again','bsay','','g')+`<span class="lab">Stars: ${S.ts}</span>`;
 else if(r==='shadow')h=B('Next shadow','snew','','y')+B('Say again','ssay','','g')+`<span class="lab">Stars: ${S.ts}</span>`;
 else if(r==='memory')h=B('New game','mnew','','y')+`<span class="lab">Stars: ${S.ts}</span>`;
 else if(r==='yt'&&!YTOK)h=YL().map((x,i)=>B(x.b||x.t,'ytsel',i,i===S.yi?'y':'g')).join('')+`<button class="b y" onclick="openSong()">Open song in new window</button><span class="lab">YouTube cannot play inside this preview page. Press Open song, then drag that window onto the TV (it plays inside the page once the site is on its own web address).</span>`
 else if(r==='yt')h=YL().map((x,i)=>B(x.b||x.t,'ytsel',i,i===S.yi?'y':'g')).join('')+B('Play','ytplay','','y')+B('Pause','ytpause','','g')+`<a href="https://www.youtube.com/watch?v=${(YL()[S.yi]||YL()[0]).id}" target="_blank" style="margin-left:10px;font-size:14px">Open on YouTube</a>`
 else if(r==='real')h=L.words.map((x,i)=>B(x,'rw',i,i===(S.rw||0)?'y':'g')).join('')+B('Play','vplay','','y')+B('Pause','vpause','','g')
 else if(r==='tapoff')h=B('Reset tap','tapreset','','g');
 $('ctl').innerHTML=h}
function fmt(s){s=Math.abs(s);return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
function drawTimer(){const t=$('timer');t.textContent=(left<0?'+':'')+fmt(left);t.classList.toggle('late',left<0)}
function tgl(){run=!run;$('pbtn').textContent=run?'Pause':'Resume'}
function goSt(i){act('goto',i);const s=L.stages[i];left=s.min*60;run=true;$('pbtn').textContent='Pause';
 $('teach').innerHTML=`<h2>${s.name}</h2><div class="m">${s.phase?`<span class="phase">${s.phase}</span> `:''}${s.min} minutes · stage ${i+1} of ${L.stages.length}</div>`+s.steps.map(p=>`<label class="step"><input type="checkbox"><span>${p.do}${p.say?`<span class="say">“${p.say}”</span>`:''}</span></label>`).join('')+`<div class="box watch"><b>Watch for:</b> ${s.watch}</div><div class="box short"><b>Short on time:</b> ${s.short}</div>`;drawTimer()}
function nextSt(d){const n=S.st+d;if(n>=0&&n<L.stages.length)goSt(n)}
function begin(){$('start').style.display='none';goSt(0)}
function full(){$('cls').classList.toggle('full');fitPv()}
function fitPv(){setTimeout(()=>fit($('pv')),30)}
function openStudent(){const u=location.href.split('#')[0]+'#student';window.open(u,'k1student','width=1280,height=720')}
function updWait(){}
addEventListener('resize',()=>{if(VIEW==='student')fitFull();else fitPv()});
document.addEventListener('keydown',e=>{if(VIEW==='teacher'&&$('cls').classList.contains('full')){if(e.key==='Escape')full();if(e.key==='ArrowRight')nextSt(1);if(e.key==='ArrowLeft')nextSt(-1)}});
// ---------- build the page ----------
if(VIEW==='student'){
 document.body.style.cssText='background:#0B1B33;align-items:center;justify-content:center';
 document.body.innerHTML=`<div class="fit" id="sv"><div class="s16"></div></div><div class="wait" id="wt" style="cursor:pointer">Tap here to start the class screen<br><small style="font-size:22px">Then press Start on the teacher page. (This tap lets sounds and video play.)</small></div>`;
 document.body.insertAdjacentHTML('beforeend',`<div id="snav"><button onclick="send({type:'act',a:'navstep',p:-1})" aria-label="Back">&#9664;</button><button id="smenu" onclick="document.getElementById('slist').classList.toggle('open')" aria-label="Menu">&#9776;</button><button onclick="send({type:'act',a:'navstep',p:1})" aria-label="Next">&#9654;</button></div><div id="slist">${L.stages.map((s,i)=>`<button id="sl${i}" onclick="send({type:'act',a:'nav',p:${i}});document.getElementById('slist').classList.remove('open')">${i+1}. ${s.name}</button>`).join('')}</div>`);
 let _nt;const _nv=()=>{const n=$('snav');n.classList.add('show');clearTimeout(_nt);_nt=setTimeout(()=>{n.classList.remove('show')},4500)};addEventListener('pointerdown',_nv);addEventListener('mousemove',_nv);addEventListener('keydown',e=>{if(e.key==='ArrowRight')send({type:'act',a:'navstep',p:1});if(e.key==='ArrowLeft')send({type:'act',a:'navstep',p:-1})});
 const hi=()=>send({type:'hi'});hi();setInterval(hi,3000);
 $('wt').onclick=()=>{$('wt').remove();hi()};
 fitFull();
}else{
 document.body.insertAdjacentHTML('beforeend',`<div id="start">${L.mascot&&L.mascot.hello?`<video src="${L.mascot.hello}" autoplay muted playsinline loop style="width:280px"></video>`:''}<div style="font-size:18px;color:#b9d3e8">${L.sub}</div><h1>${L.title}</h1><div style="font-size:18px;max-width:700px">${L.objective}</div><div style="font-size:20px;font-weight:bold;margin-top:8px">Before you start</div><ul>${L.prep.map(p=>`<li>${p}</li>`).join('')}</ul><button class="b y" style="font-size:22px;padding:12px 26px" onclick="begin()">Start lesson</button><div class="acs-foot" style="position:absolute;left:0;right:0;bottom:0;margin:0;border-radius:0;padding:8px 14px"><span class="m1">Labor omnia vincit</span><span class="m2">Work conquers all</span><span class="m3">Empowering Learning Through AI &amp; Innovation, for Student Well-Being</span></div></div>
 <div id="top"><img src="acs_logo.png" alt="ACS" style="height:40px;border-radius:5px;margin-right:12px"><div><h1>${L.title}</h1><div class="sub">${L.sub}</div></div><span style="flex:1"></span><div id="timer">00:00</div><button class="b y" id="pbtn" onclick="tgl()">Pause</button><button class="b g" onclick="nextSt(-1)">Back stage</button><button class="b g" onclick="nextSt(1)">Next stage</button><button class="b" onclick="openStudent()">Open student screen</button></div>
 <div id="wrap"><div id="rail">${L.stages.map((s,i)=>`<button class="st" id="st${i}" onclick="goSt(${i})">${i+1}. ${s.name}<small>${s.min} min</small></button>`).join('')}</div>
 <div id="teach"></div><div id="cls"><div class="lab">Class screen (what the children see)</div><div class="fit" id="pv"><div class="s16"></div></div><div id="saynow"></div><div id="ctl"></div><div id="snav" style="opacity:.7"><button onclick="nextSt(-1)" aria-label="Back">&#9664;</button><button onclick="document.getElementById('slist').classList.toggle('open')" aria-label="Menu">&#9776;</button><button onclick="nextSt(1)" aria-label="Next">&#9654;</button></div><div id="slist">${L.stages.map((s,i)=>`<button id="sl${i}" onclick="goSt(${i});document.getElementById('slist').classList.remove('open')">${i+1}. ${s.name}</button>`).join('')}</div><button class="b y" onclick="full()">Full screen (one screen only)</button><button class="b y" id="exitfs" onclick="full()">Back to teacher view</button></div></div>`);
 setInterval(()=>{if(run){left--;drawTimer()}},1000);
 fit($('pv'));draw();
}
