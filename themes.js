/* KG Lesson Builder - occasion themes (Nov 2026).
   Choice: URL ?th=  >  localStorage 'kgTheme'  >  'auto' (by date).
   KGT.prep(DATA,LESSONS,topic) runs BEFORE makeLesson: swaps Cloud's clips and puts
   themed songs first (originals stay further down the lists).
   KGT.mount(stageEl, stageKind) adds the festive overlay (one canvas) to the class screen.
   To add a theme: add an entry to THEMES (name, icon, auto [m1,d1,m2,d2], mascot dir,
   songs {greet,dance,bye,<topic key>}, draw style) and make its mascot clips. */
(function(){
const Y=(id,t,b)=>({id,t:'Song: '+t,b});
const THEMES={
 christmas:{name:'Christmas',icon:'\u{1F384}',auto:[12,1,12,31],mascot:'shared/xmas/mascot/',
  bg:{farm:'farm',zoo:'zoo',weather:'meadow',phonics:'playground',things:'classroom_soft',shapes:'classroom_soft',senses:'garden_soft'},bgDir:'shared/xmas/bg/',
  poster:{farm:'farm',weather:'weather',zoo:'zoo'},posterDir:'shared/xmas/poster/',
  songs:{
   greet:[Y('ZUi1YJVChpg','Hello, Reindeer (Super Simple Songs)','Hello, reindeer'),Y('qDL2HBPy9uQ','Hello Reindeer, Goodbye Snowman (Super Simple Songs)','Hello reindeer'),Y('4YBGRGBj7_w','Jingle Bells (Super Simple Songs)','Jingle Bells'),Y('mGAYzlqj-aE','S-A-N-T-A (Super Simple Songs)','S-A-N-T-A'),Y('s2rgaLmyiFU','Up On The Housetop (Super Simple Songs)','Up on the housetop'),Y('VJXg2xmdG7k','Jingle Jingle Little Bell (Super Simple Songs)','Jingle jingle little bell'),Y('AvCcpY3UBCM','C-H-R-I-S-T-M-A-S (Super Simple Songs)','C-H-R-I-S-T-M-A-S'),Y('uZuzK16g19U','Twinkle Twinkle Christmas Star (The Kiboomers)','Christmas star'),Y('2Expn6UPZqI','Hello Reindeer, Goodbye Snowman (Noodle & Pals)','Hello reindeer (Noodle)')],
   dance:[Y('eo9bpiwKpx4','Christmas Freeze Dance (The Kiboomers)','Christmas freeze dance'),Y('7ZOPX85PXGw','Shake Your Santa Hat! (The Kiboomers)','Shake your Santa hat'),Y('E48dJsivx7s','Reindeer Hokey Pokey (The Kiboomers)','Reindeer hokey pokey'),Y('BfBPW9rQ-1k',"Santa's Little Reindeer (The Kiboomers)","Santa's little reindeer"),Y('zgbHfniNyLQ','Christmas Floor Is Lava (The Kiboomers)','Floor is lava'),Y('6qs0gGxb_Ms','Santa Freeze Dance (Danny Go!)','Santa freeze dance'),Y('WYYJ7yaL9WU','Five Little Elves (Super Simple Songs)','Five little elves'),Y('Av_U0SP2aBI',"Danny's Sleigh Ride (Danny Go!)",'Sleigh ride'),Y('bB2aJP9KvTM','Santa Dance (Takabloo)','Santa dance'),Y('P0KjRThyGcM','Christmas Yoga Freeze Dance (Yoga Guppy)','Christmas yoga freeze'),Y('kN9x19YWpHs','Jingle Bell Opposites (The Kiboomers)','Jingle bell opposites'),Y('Lj0q3Zn-Ml4','Jingle Bells Dance (Children Love to Sing)','Jingle Bells dance'),Y('rHjxTnThKQk','Up on the Housetop Dance (Love to Sing)','Housetop dance'),Y('7PG6PPahpLE','Five Little Reindeer (The Kiboomers)','Five little reindeer')],
   bye:[Y('Nu3R6d54KNo','Goodbye, Snowman (Super Simple Songs)','Goodbye, snowman'),Y('hNkvV4PR-q0','We Wish You A Merry Christmas (Super Simple Songs)','Merry Christmas'),Y('qDL2HBPy9uQ','Hello Reindeer, Goodbye Snowman (Super Simple Songs)','Goodbye snowman'),Y('8qVdptyCpKg','Goodbye Christmas (Bumbola Kids)','Goodbye Christmas'),Y('SSvtEpc9oFA','Merry Merry Christmas (The Singing Walrus)','Merry merry Christmas'),Y('2Expn6UPZqI','Hello Reindeer, Goodbye Snowman (Noodle & Pals)','Goodbye snowman (Noodle)')],
   farm:[Y('7EYwZYrBfvE','Old MacDonald Had a Christmas Farm (The Beanies)','Christmas farm'),Y('4i_dd96IECQ',"Jingle Bells on Old MacDonald's Farm (JRS 3D)",'Jingle Bells farm'),Y('2PJHaYkjTgY','Holiday Farm (Hooray Kids Songs)','Holiday farm'),Y('zPjlKunYZ2k','Animal Sound Song, Christmas version (EduFam)','Animal sounds'),Y('1SjAyIPYLGQ','Jingle Bells on the Farm (CC and Friends)','Jingle Bells on the farm'),Y('klp4dXzRpys','Jingle Bells with Farm Animals (Wow Nursery Rhymes)','Farm animal Jingle Bells'),Y('FTQgVXw2C9k','Moo! Baa! Jingle Bells! (BibleKidz)','Moo! Baa! Jingle Bells!'),Y('89hF8d3W494','Christmas on the Farm (Moo & Friends Farm)','Christmas on the farm')],
   zoo:[Y('w0XdKJyKIz8','Jingle Bells, Penguins Version (CoComelon)','Penguin Jingle Bells'),Y('lM6mDRhKAcA','Rudolph the Red-Nosed Reindeer (The Kiboomers)','Rudolph'),Y('dflOyBPPuu0',"We're Going To The Reindeer Games (Super Simple Songs)",'Reindeer games'),Y('BfBPW9rQ-1k',"Santa's Little Reindeer (The Kiboomers)","Santa's reindeer"),Y('MnZVL_gr3Mc','Christmas Animals: Reindeer, Penguin, Polar Bear (Little Star)','Christmas animals'),Y('UWhtKesAm1w',"Santa's Christmas Animal Adventure (Little Wonders)",'Animal adventure'),Y('CNhD66AobgI','Snow Sleigh Ride Animal Song (Pip & Pals)','Snow sleigh ride'),Y('7PG6PPahpLE','Five Little Reindeer (The Kiboomers)','Five little reindeer')],
   weather:[Y('Fxzd0bMs7oI','Snowy Day Weather Song (Hoppalina)','Snowy day weather'),Y('tbbKjDjMDok','Little Snowflake (Super Simple Songs)','Little snowflake'),Y('FczqntFwb6k',"I'm A Little Snowman (Super Simple Songs)",'Little snowman'),Y('F0Fe576R7C4',"Let's Make A Snowman (Super Simple Songs)",'Make a snowman'),Y('q6LCduKAVQk','Hello Winter! (Smartie the Alpaca)','Hello winter'),Y('TDJIhayM9dw','Snowflakes Snowflakes (The Kiboomers)','Snowflakes snowflakes'),Y('QgWf8qwVZ6w','5 Snowflakes Falling Down (Miss Molly)','5 snowflakes'),Y('ttfVPZtHaoE','Winter Day Song (Joyoo Kids)','Winter day')],
   shapes:[Y('rPeU7Dj2K80','Christmas Shapes Song (Dream English Kids)','Christmas shapes'),Y('iKY2Tj2hBVc','Draw Shapes On the Christmas Tree (The Kiboomers)','Shapes on the tree'),Y('Dbr78YOqOZw','Shapes Christmas Song (English Tree)','Shapes Christmas song'),Y('ZLtrenU-D9Q','5 Presents: Christmas Shapes (After School Cubs)','5 presents'),Y('4lfgcKkQBYs','Christmas Shapes: Decorating the Tree (Chichi Kids)','Decorate with shapes'),Y('Rse_Fj_eTzw','Learn Shapes with a Christmas Tree (Tiny Turtles)','Christmas tree shapes'),Y('FgY12TZNL2g','The Christmas Shapes Song (Hello Cookie)','Christmas shapes 2'),Y('u3vlu91y7TQ','Christmas Shapes: Circle, Triangle, Square & Star (Peeklora)','Circle, triangle, star')],
   things:[Y('VVdN7nez48o',"What's in the Present? (Wild Things)","What's in the present?"),Y('drKG1nYXIpo',"Decorate Our Christmas Tree (Oliver's Melody Club)",'Decorate the tree'),Y('WYYJ7yaL9WU','Five Little Elves (Super Simple Songs)','Five little elves'),Y('QoB1DAocjdc','Five Presents: Classroom Objects (Ms Bayrak)','Five presents'),Y('4NdCC6l1X30',"Let's Decorate Our Christmas Tree (Super Simple Songs)",'Decorate our tree'),Y('VvHhQBelGZE','The Great Christmas Tree Hunt (Super Simple Songs)','Christmas tree hunt'),Y('Vwmwp91g0-o','Decorate The Christmas Tree (Noodle & Pals)','Decorate the tree 2')],
   senses:[Y('LjjpGZfub60','Christmas Five Senses Song (Miss Linky)','Christmas five senses'),Y('RJQMVqh-Ytw',"Shake the Present: Guess What's Inside (Hoppalina)",'Shake the present'),Y('4YBGRGBj7_w','Jingle Bells (Super Simple Songs)','Jingle Bells'),Y('VJXg2xmdG7k','Jingle Jingle Little Bell (Super Simple Songs)','Listen: little bell'),Y('kN9x19YWpHs','Jingle Bell Opposites (The Kiboomers)','Loud and quiet bells'),Y('4NdCC6l1X30',"Let's Decorate Our Christmas Tree (Super Simple Songs)",'Look: decorate the tree'),Y('VVdN7nez48o',"What's in the Present? (Wild Things)",'Guess the present')],
   clothes:[Y('jG83tDb-cfc','He Has a Red, Red Coat: Santa Dance',"Santa's red coat"),Y('c7s-Twed45g','Winter Clothing Song: Put On My Hat (Dream English Kids)','Put on my hat'),Y('vhZKgPy_qHM','Santa, Where Is Your Hat? (Dragon Dee)',"Santa's hat"),Y('voNYbMzKpfQ','Put On Your Shoes, Santa (TigiBoo)',"Santa's shoes"),Y('Khn7qktHfII',"Look, It's Santa! (TevESL)","Look, it's Santa!"),Y('oHnWrn0ed10','Bundle Up! Winter Clothes (Rosie, Leo & Pip)','Bundle up'),Y('5V76K-mPi_M','Wrap Up Warm! (Kallipo Studio)','Wrap up warm'),Y('AsZwvuUmHGU','Put On Your Boots (Super Simple Songs)','Put on your boots'),Y('wL1EAi_5Yog','Bundle Up! (Stacey Peasley)','Bundle up 2')],
   phonics:[Y('Pn9ZA9QPhNU','Alphabet Christmas (Bounce Patrol)','Christmas ABC'),Y('C9KUJg1ujrA',"Christmas ABC Phonics Song (Rock 'N Learn)",'Christmas phonics'),Y('MFgA-0HjecI','Christmas ABC (Pinkfong)','Pinkfong Christmas ABC'),Y('_Os8Q_zO53U','Alphabet Christmas with Sounds (JunyTony)','ABC Christmas sounds'),Y('Tr8C4trHdkQ','Christmas Phonics Song (HooplaKidz)','Christmas phonics 2'),Y('EzxVQrNZrEc','ABC Christmas Song (Lah-Lah)','Holiday phonics'),Y('AvCcpY3UBCM','C-H-R-I-S-T-M-A-S (Super Simple Songs)','C-H-R-I-S-T-M-A-S')]
  }}
};
const ORDER=['auto','off','christmas'];
function topicKey(t){t=t||'';if(t.startsWith('phonics_'))return 'phonics';if(t.startsWith('senses'))return 'senses';if(t.startsWith('pp1_'))return 'clothes';return t}
function byDate(d){d=d||new Date();const v=(d.getMonth()+1)*100+d.getDate();for(const k in THEMES){const a=THEMES[k].auto;if(!a)continue;const s=a[0]*100+a[1],e=a[2]*100+a[3];if(s<=e?(v>=s&&v<=e):(v>=s||v<=e))return k}return 'off'}
function choice(){let q=null;try{q=new URLSearchParams(location.search).get('th')}catch(e){}if(q&&(q in THEMES||q==='off'||q==='auto'))return q;let c=null;try{c=localStorage.getItem('kgTheme')}catch(e){}return c&&(c in THEMES||c==='off')?c:'auto'}
function active(){const c=choice();return c==='auto'?byDate():c}
function set(v){try{v==='auto'?localStorage.removeItem('kgTheme'):localStorage.setItem('kgTheme',v)}catch(e){}}
function label(v){if(v==='auto'){const a=byDate();return 'Automatic ('+(a==='off'?'none today':THEMES[a].name)+')'}if(v==='off')return 'No theme';return THEMES[v].icon+' '+THEMES[v].name}
const dedupe=a=>{const s={};return a.filter(x=>!x||!x.id||s[x.id]?!x||!x.id:(s[x.id]=1))};
let DONE=false;
function prep(DATA,LESSONS,topic){const k=active(),T=THEMES[k];document.documentElement.dataset.theme=k;if(!T||DONE)return k;DONE=true;
 const S=T.songs,B=DATA&&DATA.BANK,Lx=LESSONS&&LESSONS[topic],tk=S[topicKey(topic)]||[];
 if(B){B.greet=dedupe((S.greet||[]).concat(Lx&&!(Lx.yt||[]).length?tk:[],B.greet||[]));B.dance=dedupe((S.dance||[]).concat(B.dance||[]));B.bye=dedupe((S.bye||[]).concat(B.bye||[]))}
 if(Lx){if((Lx.yt||[]).length&&tk.length)Lx.yt=dedupe(tk.concat(Lx.yt));
  const bk=T.bg&&T.bg[topicKey(topic)];if(bk&&Lx.theme){Lx.theme=Object.assign({},Lx.theme,{bg:T.bgDir+bk+'.jpg'})}
  const pk=T.poster&&T.poster[topicKey(topic)];if(pk&&Lx.poster)Lx.poster=T.posterDir+pk+'.jpg';
  if(Lx.mascot&&T.mascot){const m={};for(const n in Lx.mascot){const f=String(Lx.mascot[n]).match(/cloud_(\w+)\.webm$/);m[n]=f?T.mascot+'cloud_'+f[1]+'.webm':Lx.mascot[n]}Lx.mascot=m}}
 return k}

/* ---------- festive overlay: one canvas per screen, state kept in JS so re-renders don't restart it ---------- */
const NOSNOW=['video','yt','clips','real','walk3d','solids'];
function mkFx(w,h,opt){const c=document.createElement('canvas');c.className='kgt-fx';c.width=w;c.height=h;const g=c.getContext('2d');
 const N=opt.flakes||46,fl=[];for(let i=0;i<N;i++)fl.push({x:Math.random()*w,y:Math.random()*h,r:3+Math.random()*5.5,s:.35+Math.random()*.9,p:Math.random()*6.3,a:.55+Math.random()*.4});
 const bulbs=[],cols=['#FF4B4B','#FFD23F','#3DDC84','#4FC3F7','#FF7AD9'];if(opt.garland){const n=Math.round(w/64);for(let i=0;i<=n;i++)bulbs.push({x:i*w/n,c:cols[i%cols.length],p:Math.random()*6.3})}
 c._snow=true;let last=0,FR=null;
 if(opt.frost){FR=document.createElement('canvas');FR.width=w;FR.height=h;const q=FR.getContext('2d');[[0,0],[w,0],[0,h],[w,h]].forEach(([x,y])=>{const r=Math.min(w,h)*.5,gr=q.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba(255,255,255,.8)');gr.addColorStop(.4,'rgba(230,242,255,.38)');gr.addColorStop(1,'rgba(235,245,255,0)');q.fillStyle=gr;q.fillRect(0,0,w,h)})}
 function sag(x){const seg=w/(opt.swags||5),u=(x%seg)/seg;return 4+Math.sin(u*Math.PI)*18}
 function frame(t){if(!c.isConnected){c._raf=0;return}c._raf=requestAnimationFrame(frame);if(t-last<33)return;last=t;g.clearRect(0,0,w,h);if(FR&&c._snow&&!c._nofrost)g.drawImage(FR,0,0);
  if(c._snow)for(const f of fl){f.y+=f.s*1.6;f.x+=Math.sin(t/1400+f.p)*.5;if(f.y>h+8){f.y=-8;f.x=Math.random()*w}
   g.beginPath();g.arc(f.x,f.y,f.r,0,6.3);g.fillStyle=(opt.tint||'rgba(255,255,255,')+f.a+')';g.shadowColor='rgba(60,90,140,.7)';g.shadowBlur=opt.tint?0:6;g.fill()}
  g.shadowBlur=0;
  if(opt.garland){g.lineWidth=7;g.strokeStyle='#1E7B3A';g.beginPath();for(let x=0;x<=w;x+=8){const y=sag(x);x?g.lineTo(x,y):g.moveTo(x,y)}g.stroke();
   g.lineWidth=3;g.strokeStyle='#2FA155';g.stroke();
   for(const b of bulbs){const y=sag(b.x)+10,on=.55+.45*Math.sin(t/420+b.p);g.save();g.translate(b.x,y);g.fillStyle='#555';g.fillRect(-4,-9,8,7);
    g.shadowColor=b.c;g.shadowBlur=18*on;g.globalAlpha=.6+.4*on;g.fillStyle=b.c;g.beginPath();g.ellipse(0,5,8,12,0,0,6.3);g.fill();g.restore()}}
  if(opt.drift&&c._snow&&!c._nofrost){g.fillStyle='rgba(255,255,255,.92)';g.shadowColor='rgba(120,150,200,.5)';g.shadowBlur=10;g.beginPath();g.moveTo(0,h);g.lineTo(0,h-opt.drift*.6);
   for(let x=0;x<=w;x+=40)g.quadraticCurveTo(x+20,h-opt.drift-(x/40%2?6:14),x+40,h-opt.drift*.7);g.lineTo(w,h);g.closePath();g.fill();g.shadowBlur=0}}
 c._raf=requestAnimationFrame(frame);c._wake=()=>{if(!c._raf)c._raf=requestAnimationFrame(frame)};return c}
let FX=null;
function mount(stage,kind){const k=active(),T=THEMES[k];if(!stage)return;if(!T){if(FX)FX.remove();return}
 if(!FX)FX=mkFx(1600,900,{garland:true,swags:6,flakes:56,frost:true,drift:40});FX._snow=!NOSNOW.includes(kind);FX._nofrost=!!stage.querySelector('.poster');
 if(FX.parentElement!==stage)stage.appendChild(FX);FX._wake()}
function page(el,opt){const k=active();if(!THEMES[k]||!el)return null;const c=mkFx(opt&&opt.w||1600,opt&&opt.h||900,Object.assign({flakes:60},opt||{}));c.classList.add('kgt-page');el.appendChild(c);c._wake();return c}
/* picker (used by player top bar and the index page) */
function picker(onchange){const s=document.createElement('select');s.className='kgt-pick';s.title='Theme';s.setAttribute('aria-label','Theme');
 ORDER.concat(Object.keys(THEMES).filter(k=>!ORDER.includes(k))).forEach(v=>s.add(new Option(label(v),v)));
 const h=document.createElement('option');h.disabled=true;h.textContent='\u{1F383} Halloween (coming soon)';s.add(h);
 s.value=choice();s.onchange=()=>{set(s.value);onchange&&onchange(s.value)};return s}
const css=document.createElement('style');css.textContent=
 '.s16>canvas.kgt-fx{position:absolute;left:0;top:0;width:1600px;height:900px;pointer-events:none;z-index:3}'+
 'canvas.kgt-page{position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:0}'+
 'select.kgt-pick{font:inherit;font-weight:800;font-size:14px;border-radius:10px;padding:6px 8px;border:1.5px solid #E7E5E1;background:#fff;color:#16324F;cursor:pointer;max-width:230px}'+
 '[data-theme=christmas] .poster{background:#FBF4E8 url(shared/xmas/poster/frame.jpg) center/100% 100% no-repeat}'+
 '[data-theme=christmas] .poster img{left:258px;top:150px;width:1084px;height:610px;object-fit:cover;border-radius:22px;box-shadow:0 0 0 8px #fff,0 14px 34px rgba(60,30,10,.35)}'+
 '[data-theme=christmas] .poster::before{content:"\\2744  Merry Christmas!  \\2744";position:absolute;left:50%;top:62px;transform:translateX(-50%);z-index:2;white-space:nowrap;font:700 52px Fredoka,Nunito,sans-serif;color:#FFE08A;background:linear-gradient(#D62828,#A4161A);padding:8px 46px 12px;border-radius:999px;box-shadow:0 6px 0 #7A0F12,0 12px 24px rgba(0,0,0,.25);text-shadow:0 3px 0 #7A0F12}'+
 '[data-theme=christmas] #start{background:radial-gradient(ellipse at 50% 0%,#1E6B45,#0F3D2E 55%,#5C1012)!important}'+
 '[data-theme=christmas] #start::before{content:"\\1F384  Merry Christmas!  \\1F384";font:700 30px Fredoka,Nunito,sans-serif;color:#FFE08A;background:#B91C1C;padding:6px 26px 8px;border-radius:999px;box-shadow:0 4px 0 #7A0F12}'+
 '[data-theme=christmas] #start .b.y{background:#D62828;color:#fff;box-shadow:0 5px 0 #7A0F12}'+
 '[data-theme=christmas] #top{background:linear-gradient(90deg,#7F1D1D,#B91C1C 45%,#14532D)!important}'+
 '[data-theme=christmas] .hdr{border-bottom:4px solid transparent;border-image:repeating-linear-gradient(90deg,#B91C1C 0 18px,#fff 18px 26px,#15803D 26px 44px,#fff 44px 52px) 4}';
(document.head||document.documentElement).appendChild(css);
addEventListener('storage',e=>{if(e.key==='kgTheme'&&!new URLSearchParams(location.search).get('th'))location.reload()});
window.KGT={THEMES,active,choice,set,prep,mount,page,picker,label,topicKey,byDate};
})();
