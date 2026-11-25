/* K1 walk-around world (three.js r149). Toon-shaded cartoon zoo you look around and walk through. */
(function(){
const T=THREE,INK=0x16324F;
const GRAD=(()=>{const d=new Uint8Array([110,170,225,255]);const t=new T.DataTexture(d,4,1,T.RedFormat);t.minFilter=t.magFilter=T.NearestFilter;t.needsUpdate=true;return t})();
const mat=(c,o)=>new T.MeshToonMaterial(Object.assign({color:c,gradientMap:GRAD},o||{}));
function M(geo,col,opt){opt=opt||{};const m=new T.Mesh(geo,opt.mat||mat(col));if(opt.out!==false){const o=new T.Mesh(geo,new T.MeshBasicMaterial({color:INK,side:T.BackSide}));o.scale.setScalar(opt.os||1.07);m.add(o)}m.castShadow=false;return m}
const sph=(r,w=24,h=18)=>new T.SphereGeometry(r,w,h),cyl=(a,b,h,s=16)=>new T.CylinderGeometry(a,b,h,s),cone=(r,h,s=16)=>new T.ConeGeometry(r,h,s);
function at(m,x,y,z){m.position.set(x,y,z);return m}
function sc(m,x,y,z){m.scale.set(x,y,z);return m}
function eyes(g,x,y,z,s,sep){[-1,1].forEach(k=>{const e=M(sph(.1*s),0xffffff,{os:1.12});at(e,x+k*sep,y,z);const p=at(M(sph(.055*s),0x111111,{out:false}),0,0,.075*s);e.add(p);g.add(e)})}
function stripeTex(){const c=document.createElement('canvas');c.width=256;c.height=64;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,256,64);x.fillStyle='#1b1b24';for(let i=0;i<16;i++){x.fillRect(i*16+2,0,8,64)}const t=new T.CanvasTexture(c);t.wrapS=T.RepeatWrapping;return t}
function spotTex(){const c=document.createElement('canvas');c.width=256;c.height=128;const x=c.getContext('2d');x.fillStyle='#F6C640';x.fillRect(0,0,256,128);x.fillStyle='#A8641F';[[30,30],[90,80],[150,25],[200,90],[60,110],[230,40],[120,55],[180,10]].forEach(p=>{x.beginPath();x.ellipse(p[0],p[1],15,12,.5,0,7);x.fill()});return new T.CanvasTexture(c)}
/* ---- animals (each faces +z, feet at y=0, ~3 units tall) ---- */
const A={
lion(){const g=new T.Group(),tan=0xE9A94A;
 g.add(at(sc(M(sph(1),tan),1.5,1,1),0,1.5,-.2));
 [[-.9,.5],[.9,.5],[-.9,-.9],[.9,-.9]].forEach(p=>g.add(at(M(cyl(.28,.24,1.1),tan),p[0]*.7,.55,p[1])));
 const h=new T.Group();h.position.set(0,2.2,1.1);g.add(h);h.userData.head=1;
 h.add(M(sph(1.15),0x9A5B25));h.add(at(M(sph(.8),tan),0,-.05,.55));
 [-1,1].forEach(k=>h.add(at(M(sph(.28),tan),k*.8,.9,.1)));
 h.add(at(M(sph(.2),0x5A2E12,{out:false}),0,.1,1.3));h.add(at(sc(M(sph(.3),0xF4C9A4),1.3,.8,1),0,-.3,1.2));
 eyes(h,0,.45,1.05,1.2,.36);g.add(h);
 const tail=new T.Group();tail.position.set(0,1.6,-1.7);tail.userData.tail=1;tail.add(at(M(cyl(.07,.07,1.6),tan),0,-.6,-.3));tail.rotation.x=.9;tail.add(at(M(sph(.28),0x9A5B25),0,-1.45,-.7));g.add(tail);return g},
elephant(){const g=new T.Group(),gr=0x9FB1C4;
 g.add(at(sc(M(sph(1.6),gr),1.15,1,1.5),0,2.2,0));
 [[-1,1.1],[1,1.1],[-1,-1.1],[1,-1.1]].forEach(p=>g.add(at(M(cyl(.55,.5,1.6),gr),p[0],.8,p[1])));
 const h=new T.Group();h.position.set(0,2.8,1.9);h.userData.head=1;g.add(h);
 h.add(M(sph(1.2),gr));
 [-1,1].forEach(k=>{h.add(at(sc(M(sph(1),0xB8C7D6),.18,1.25,1.05),k*1.25,.15,-.15))});
 const curve=new T.CatmullRomCurve3([new T.Vector3(0,.1,1),new T.Vector3(0,-.6,1.5),new T.Vector3(0,-1.5,1.65),new T.Vector3(0,-2.1,1.2),new T.Vector3(0,-2.15,.8)]);
 h.add(M(new T.TubeGeometry(curve,24,.34,12),gr));
 [-1,1].forEach(k=>h.add(at(sc(M(cone(.14,.8),0xFFF6DD),1,1,1),k*.6,-.9,1.35)));
 eyes(h,0,.45,1.05,1.2,.5);
 const tail=at(M(cyl(.06,.06,1.3),gr),0,2.2,-2.1);tail.rotation.x=.3;g.add(tail);return g},
giraffe(){const g=new T.Group(),tex=spotTex(),b=mat(0xffffff,{map:tex});
 g.add(at(sc(M(sph(1),0,{mat:b}),1.2,1,1.8),0,3,0));
 [[-.8,.9],[.8,.9],[-.8,-.9],[.8,-.9]].forEach(p=>g.add(at(M(cyl(.22,.18,3),0xF6C640),p[0],1.45,p[1])));
 const neck=at(M(cyl(.45,.55,3.6),0,{mat:mat(0xffffff,{map:tex})}),0,4.8,1.4);neck.rotation.x=-.25;g.add(neck);
 const h=new T.Group();h.position.set(0,6.6,2.05);h.userData.head=1;g.add(h);
 h.add(sc(M(sph(.7),0xF6C640),1,.9,1.3));h.add(at(sc(M(sph(.42),0xE8B060),1,.8,1),0,-.2,.8));
 [-1,1].forEach(k=>{h.add(at(M(cyl(.08,.08,.5),0xA8641F),k*.25,.8,0));h.add(at(M(sph(.12),0x5A2E12),k*.25,1.08,0));h.add(at(sc(M(sph(.2),0xF6C640),.5,1.2,1),k*.55,.45,-.15))});
 eyes(h,0,.2,.6,1.1,.3);
 const tail=at(M(cyl(.05,.05,1.7),0xF6C640),0,3.2,-1.8);tail.rotation.x=.3;g.add(tail);return g},
monkey(){const g=new T.Group(),br=0x8A5A33,fc=0xF1CFA6;
 g.add(at(sc(M(sph(1),br),.9,1.1,.8),0,1.5,0));
 [-1,1].forEach(k=>{g.add(at(M(cyl(.18,.15,1.4),br),k*1.0,1.5,.15));g.add(at(sc(M(sph(.35),br),1,.7,1.5),k*.55,.35,.55))});
 const h=new T.Group();h.position.set(0,2.95,.2);h.userData.head=1;g.add(h);
 h.add(M(sph(.85),br));h.add(at(sc(M(sph(.62),fc),1,.85,.7),0,-.05,.55));
 [-1,1].forEach(k=>h.add(at(M(sph(.36),fc),k*1.0,.1,0)));
 h.add(at(M(sph(.12),0x333,{out:false}),0,-.05,1.1));eyes(h,0,.3,.75,1,.26);
 const curve=new T.CatmullRomCurve3([new T.Vector3(0,1,-.6),new T.Vector3(0,.7,-1.6),new T.Vector3(0,1.6,-2.3),new T.Vector3(0,2.5,-1.9),new T.Vector3(0,2.5,-1.2)]);
 const tail=M(new T.TubeGeometry(curve,24,.12,8),br);tail.userData.tail=1;g.add(tail);g.scale.setScalar(1.1);return g},
penguin(){const g=new T.Group();
 g.add(at(sc(M(sph(1),0x23283A),1,1.4,.9),0,1.7,0));g.add(at(sc(M(sph(.9),0xffffff,{out:false}),.95,1.3,.7),0,1.6,.38));
 [-1,1].forEach(k=>{g.add(at(sc(M(sph(.5),0xFF9A1F),1,.3,1.5),k*.45,.12,.35));const f=at(sc(M(sph(.6),0x23283A),.25,1.25,.7),k*1.05,1.7,0);f.userData.flap=k;f.rotation.z=k*.35;g.add(f)});
 const h=new T.Group();h.position.set(0,3.1,.1);h.userData.head=1;g.add(h);
 h.add(M(sph(.8),0x23283A));h.add(at(sc(M(sph(.55),0xffffff,{out:false}),1,.8,.5),0,-.1,.4));
 const bk=at(M(cone(.25,.7),0xFF9A1F),0,-.05,.95);bk.rotation.x=Math.PI/2;h.add(bk);eyes(h,0,.2,.68,1,.3);g.scale.setScalar(1.15);return g},
zebra(){const g=new T.Group(),st=stripeTex(),b=mat(0xffffff,{map:st});
 g.add(at(sc(M(sph(1),0,{mat:b}),1,1,1.7),0,2.1,0));
 [[-.7,1],[.7,1],[-.7,-1],[.7,-1]].forEach(p=>g.add(at(M(cyl(.2,.17,1.9),0xffffff),p[0],.95,p[1])));
 const neck=at(M(cyl(.42,.55,1.9),0,{mat:mat(0xffffff,{map:st})}),0,3.0,1.3);neck.rotation.x=-.5;g.add(neck);
 const h=new T.Group();h.position.set(0,3.9,2.0);h.userData.head=1;g.add(h);
 h.add(at(sc(M(sph(.7),0xffffff),.85,.95,1.4),0,0,.2));h.add(at(sc(M(sph(.4),0x2b2b33),1,.8,1),0,-.28,1.0));
 [-1,1].forEach(k=>h.add(at(sc(M(cone(.18,.5),0x1b1b24),1,1,.6),k*.32,.78,-.1)));
 g.add(at(sc(M(sph(.3),0x1b1b24),.3,2.2,.7),0,3.5,.55).rotateX(-.2));
 eyes(h,0,.25,.5,1,.38);
 const tail=at(M(cyl(.05,.05,1.5),0x1b1b24),0,2.1,-1.8);tail.rotation.x=.4;tail.userData.tail=1;g.add(tail);return g}
};
function label(txt){const c=document.createElement('canvas');c.width=512;c.height=256;const x=c.getContext('2d');x.fillStyle='#FFC83D';x.fillRect(0,0,512,256);x.strokeStyle='#B8860B';x.lineWidth=18;x.strokeRect(9,9,494,238);x.fillStyle='#16324F';x.font='700 120px Fredoka,Nunito,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(txt,256,136);const t=new T.CanvasTexture(c);t.anisotropy=4;return new T.MeshBasicMaterial({map:t})}
function tree(x,z,s,col){const g=new T.Group(),k=(Math.abs(x*7+z*3)|0)%3,pal=[[0x3F9B45,0x57B552,0x2F8A3E],[0x4FA84F,0x6CC76C,0x3A9444],[0x2F8F4E,0x49B067,0x267A42]][k],c=col?[col,col,col]:pal;
 g.add(at(M(cyl(.28,.46,2.8),0x7A5230,{os:1.05}),0,1.4,0));
 [[0,3.6,0,1.7],[-1.1,3.0,.4,1.25],[1.1,3.1,-.3,1.3],[.2,4.7,.1,1.15],[-.5,4.1,-.9,1],[.7,3.9,.9,1.05]].forEach((q,i)=>{const m=M(new T.IcosahedronGeometry(q[3],1),c[i%3],{os:1.03});g.add(at(m,q[0],q[1],q[2]))});
 g.position.set(x,0,z);g.scale.setScalar(s);return g}
function cloud(x,y,z,s){const g=new T.Group();[[0,0,0,2.2],[2,-.3,0,1.7],[-2,-.3,0,1.6],[.9,.9,0,1.5]].forEach(p=>g.add(at(new T.Mesh(sph(p[3],14,10),new T.MeshBasicMaterial({color:0xffffff})),p[0],p[1],p[2])));g.position.set(x,y,z);g.scale.setScalar(s);return g}
const NODES=[{z:36,name:'Zoo gate',a:[]},{z:6,name:'Lion and zebra',a:[0,1]},{z:-18,name:'Elephant and giraffe',a:[2,3]},{z:-42,name:'Monkey and penguin',a:[4,5]}];
const ORDER=['lion','zebra','elephant','giraffe','monkey','penguin'];
const EN=[[-11,0],[11,0],[-11,0],[11,0],[-11,0],[11,0]];
let _mq=null;function getModels(cb){if(window.K1M)return cb();if(_mq){_mq.push(cb);return}_mq=[cb];const a=document.createElement('script');a.src='lib/models.js';a.onload=()=>{const q=_mq;_mq=null;q.forEach(f=>f())};a.onerror=()=>{_mq=null};document.head.appendChild(a)}
function create(host,cfg,hooks){
 const W=1600,H=900,ren=new T.WebGLRenderer({antialias:true,alpha:false,preserveDrawingBuffer:false});ren.setPixelRatio(Math.min(devicePixelRatio||1,2));ren.setSize(W,H,false);ren.domElement.style.cssText='width:1600px;height:900px;display:block;touch-action:none;cursor:grab';host.appendChild(ren.domElement);
 const sc3=new T.Scene();sc3.fog=new T.Fog(0xDDF3FF,45,150);
 const sky=document.createElement('canvas');sky.width=2;sky.height=256;{const x=sky.getContext('2d'),g=x.createLinearGradient(0,0,0,256);g.addColorStop(0,'#4FB3FF');g.addColorStop(.55,'#A9DCFF');g.addColorStop(1,'#FFF3D6');x.fillStyle=g;x.fillRect(0,0,2,256)}
 const dome=new T.Mesh(new T.SphereGeometry(300,24,16),new T.MeshBasicMaterial({map:new T.CanvasTexture(sky),side:T.BackSide,fog:false}));sc3.add(dome);
 sc3.add(new T.HemisphereLight(0xffffff,0x88b878,.8));const dl=new T.DirectionalLight(0xfff2d0,.85);dl.position.set(-30,60,40);sc3.add(dl);
 const sun=new T.Mesh(sph(7,20,14),new T.MeshBasicMaterial({color:0xFFE27A,fog:false}));sun.position.set(-80,90,-120);sc3.add(sun);
 // ground + path
 const gr=new T.Mesh(new T.CircleGeometry(260,48),mat(0x6CC95A));gr.rotation.x=-Math.PI/2;sc3.add(gr);
 for(let i=0;i<26;i++){const p=new T.Mesh(new T.CircleGeometry(6+i%5*2,24),mat(i%2?0x7CCB67:0x93DD7C));p.rotation.x=-Math.PI/2;p.position.set(((i*53)%90)-45,.02,((i*37)%120)-70);sc3.add(p)}
 const pathM=new T.Mesh(new T.PlaneGeometry(6,120),mat(0xE6C48A));pathM.rotation.x=-Math.PI/2;pathM.position.set(0,.04,-20);sc3.add(pathM);
 [-3.1,3.1].forEach(x=>{const e=new T.Mesh(new T.PlaneGeometry(.35,120),mat(0xffffff));e.rotation.x=-Math.PI/2;e.position.set(x,.05,-20);sc3.add(e)});
 // distant hills
 [[-120,-150,55,0x8FC98A],[-40,-170,70,0x7DBB7C],[60,-160,60,0x93CF8F],[140,-120,50,0x86C283],[-160,-60,48,0x92CC8C],[170,-30,56,0x7FBE7E],[0,60,40,0x8CC889]].forEach(q=>{const h=new T.Mesh(new T.SphereGeometry(q[2],20,12,0,Math.PI*2,0,Math.PI/2),new T.MeshBasicMaterial({color:q[3]}));h.position.set(q[0],0,q[1]);h.scale.y=.55;sc3.add(h)});
 // gate
 const gate=new T.Group();[-6,6].forEach(x=>gate.add(at(M(new T.BoxGeometry(1.2,7,1.2),0xC98F5B),x,3.5,0)));
 const arch=M(new T.TorusGeometry(6,.55,10,32,Math.PI),0xD9A066);arch.position.y=6.5;gate.add(arch);
 const sg=new T.Mesh(new T.BoxGeometry(7,2.2,.4),label('ZOO'));sg.position.set(0,9.4,0);gate.add(sg);gate.position.set(0,0,14);sc3.add(gate);
 // trees, flowers
 for(let i=0;i<46;i++){const side=i%2?1:-1,x=side*(13+((i*17)%38)),z=30-((i*29)%110);sc3.add(tree(x,z,.9+(i%4)*.2))}
 for(let i=0;i<10;i++){const side=i%2?1:-1;if(NODES.slice(1).some(n=>Math.abs(32-i*8-(n.z-.5))<7))continue;sc3.add(tree(side*(4.8),32-i*8,.5+(i%3)*.1))}
 const fl=new T.InstancedMesh(sph(.22,8,6),new T.MeshBasicMaterial({color:0xffffff}),260),dm=new T.Object3D(),cols=[0xFF7AA8,0xFFC83D,0xffffff,0xB28BFF,0xFF8A5B];
 for(let i=0;i<260;i++){const sd=i%2?1:-1;dm.position.set(sd*(3.9+((i*31)%100)/12),.25,34-((i*17)%100)*.95);dm.updateMatrix();fl.setMatrixAt(i,dm.matrix);fl.setColorAt(i,new T.Color(cols[i%5]))}sc3.add(fl);
 const clouds=[[-40,38,-20,2.2],[30,45,-60,2.8],[55,36,10,1.9],[-60,50,-80,3],[10,55,-120,3.2],[-20,42,30,1.8]].map(p=>{const c=cloud(...p);sc3.add(c);return c});
 // enclosures + animals
 const items=cfg.items,pick=[],anims=[];
 ORDER.forEach((w,i)=>{const nd=NODES[1+(i>>1)],ex=EN[i][0],ez=nd.z-3,g=new T.Group();g.position.set(ex,0,ez);
  const HAB={lion:[0xD8C27E,0xC2A95F],zebra:[0xC9D38A,0xB3C070],elephant:[0xC9A46A,0xB48D55],giraffe:[0xB6D97F,0xA2CC6A],monkey:[0x7CC468,0x5FAF55],penguin:[0xF4FAFF,0xD6EAF7]}[w];
  const grass=new T.Mesh(new T.CircleGeometry(6.2,40),mat(HAB[0]));grass.rotation.x=-Math.PI/2;grass.position.y=.05;g.add(grass);
  const g2=new T.Mesh(new T.CircleGeometry(4.2,32),mat(HAB[1]));g2.rotation.x=-Math.PI/2;g2.position.set(-.8,.07,.6);g.add(g2);
  const R=6.2,WOOD=0x9A6B3F;for(let k=0;k<24;k++){const a=k/24*Math.PI*2;if(Math.abs(Math.cos(a))>.7&&((ex<0&&Math.cos(a)>0)||(ex>0&&Math.cos(a)<0)))continue;g.add(at(M(cyl(.14,.16,1.5),WOOD,{os:1.12}),Math.cos(a)*R,.75,Math.sin(a)*R))}
  [.55,1.05].forEach(h=>{const r=M(new T.TorusGeometry(R,.07,6,64),0xB98A55,{out:false});r.rotation.x=Math.PI/2;r.position.y=h;g.add(r)});
  const rock=(x,z,s,c)=>{const r=at(sc(M(new T.IcosahedronGeometry(1,0),c||0x9AA0A6),s*1.2,s*.8,s),x,s*.45,z);r.rotation.y=x*3;g.add(r)};
  const pond=(x,z,r,c)=>{const p=new T.Mesh(new T.CircleGeometry(r,32),new T.MeshBasicMaterial({color:c}));p.rotation.x=-Math.PI/2;p.position.set(x,.09,z);g.add(p);const e=new T.Mesh(new T.RingGeometry(r,r+.35,32),mat(0xD9C9A4));e.rotation.x=-Math.PI/2;e.position.set(x,.08,z);g.add(e)};
  const acacia=(x,z,s)=>{const t=new T.Group();t.add(at(M(cyl(.18,.3,3.4),0x7A5230,{os:1.1}),0,1.7,0));t.add(at(sc(M(sph(1.8),0x6FAE3D),1.6,.38,1.6),0,3.7,0));t.add(at(sc(M(sph(1.3),0x7FBF4A),1.4,.3,1.4),.6,4.2,.4));t.position.set(x,0,z);t.scale.setScalar(s);g.add(t)};
  const palm=(x,z,s)=>{const t=new T.Group();const tr=at(M(cyl(.2,.3,4),0x8A6A3A,{os:1.1}),0,2,0);tr.rotation.z=.12;t.add(tr);for(let k=0;k<7;k++){const l=at(sc(M(sph(1),0x3FA34D),1.9,.12,.5),Math.cos(k)*1.3,4.1,Math.sin(k)*1.3);l.rotation.y=-k;l.rotation.z=.25;t.add(l)}t.position.set(x,0,z);t.scale.setScalar(s);g.add(t)};
  const sd=ex<0?1:-1;
  if(w==='lion'){rock(2.6*sd,-3,1.5);rock(3.6*sd,-2,.9);acacia(-2.5*sd,-4,.9)}
  if(w==='zebra'){acacia(2.5*sd,-3.5,1);rock(-3*sd,-3.5,.8)}
  if(w==='elephant'){pond(-2.2*sd,-2.6,2.2,0x5FB7E8);rock(3.4*sd,-3.5,1.3,0xA7ADB3);rock(4.4*sd,-2.2,.8,0xA7ADB3)}
  if(w==='giraffe'){acacia(2.8*sd,-3.6,1.5);acacia(-3*sd,-4.2,1.1)}
  if(w==='monkey'){palm(2.8*sd,-3.6,1.1);palm(-3*sd,-4,.9);rock(1*sd,-4.2,1.1,0x8E9A8A)}
  if(w==='penguin'){pond(-1.2*sd,-2.4,2.4,0x7FD0F5);[[3.2,-3.2,1.1],[4.2,-1.8,.8],[2.2,-4.4,.7]].forEach(q=>rock(q[0]*sd,q[1],q[2],0xDDF2FF))}
  const an=new T.Group();const fb=A[w]();const MD={lion:2.9,elephant:4.4,giraffe:7.6,monkey:2.7,penguin:3.3,zebra:3.7}[w];fb.scale.multiplyScalar(w==='giraffe'?.95:w==='elephant'?1.05:1.35);an.add(fb);
  an.rotation.y=(ex<0?1:-1)*(Math.PI/2)+(ex<0?-.55:.55);g.add(an);anims.push(an);
  const shd=new T.Mesh(new T.CircleGeometry(1,24),new T.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.28,depthWrite:false}));shd.rotation.x=-Math.PI/2;shd.position.set(0,.1,0);shd.scale.set(MD*.55,MD*.55,1);g.add(shd);
  if(T.GLTFLoader){getModels(()=>{try{const b64=window.K1M&&window.K1M[w];if(!b64)return;const bin=atob(b64),u=new Uint8Array(bin.length);for(let q=0;q<bin.length;q++)u[q]=bin.charCodeAt(q);new T.GLTFLoader().parse(u.buffer,'',gl=>{const o=gl.scene;o.traverse(q=>{if(q.isMesh){const ms=Array.isArray(q.material)?q.material:[q.material];ms.forEach(m=>{if(m.metalness!=null)m.metalness=0;if(m.roughness!=null)m.roughness=.95;if(m.color&&w!=='zebra'&&w!=='penguin')m.color.multiplyScalar(1.35)})}});const bx=new T.Box3().setFromObject(o),sz=bx.getSize(new T.Vector3()),ct=bx.getCenter(new T.Vector3()),k=MD/sz.y;o.scale.setScalar(k);o.position.set(-ct.x*k,-bx.min.y*k,-ct.z*k);const wr=new T.Group();wr.add(o);an.remove(fb);an.add(wr);an.userData.model=wr;shd.scale.set(sz.z*k*.45+.6,sz.x*k*.5+.6,1)},()=>{})}catch(e){}})}
  const sgn=new T.Mesh(new T.BoxGeometry(3,1.5,.2),label(w));sgn.position.set(ex<0?5.4:-5.4,1.1,-7.4);sgn.rotation.y=ex<0?-.5:.5;sgn.scale.setScalar(.8);const pst=at(M(cyl(.1,.1,1.6),0x8a5a33,{out:false}),sgn.position.x,.5,sgn.position.z);g.add(sgn,pst);
  const hit=new T.Mesh(new T.SphereGeometry(4.6,10,8),new T.MeshBasicMaterial({visible:false}));hit.position.set(0,2.6,0);hit.userData.idx=i;g.add(hit);pick.push(hit);
  sc3.add(g);anims[i].userData.home=g;});
 // arrows
 const arrows=[];function mkArrow(x,z,rot,idx){const sh=new T.Shape();sh.moveTo(0,1.1);sh.lineTo(1.3,-.1);sh.lineTo(.55,-.1);sh.lineTo(.55,-.9);sh.lineTo(-.55,-.9);sh.lineTo(-.55,-.1);sh.lineTo(-1.3,-.1);sh.closePath();
  const m=new T.Mesh(new T.ShapeGeometry(sh),new T.MeshBasicMaterial({color:0xFFC83D}));const o=new T.Mesh(new T.ShapeGeometry(sh),new T.MeshBasicMaterial({color:0xffffff}));o.scale.setScalar(1.25);o.position.z=-.01;const g=new T.Group();g.add(o,m);g.rotation.x=-Math.PI/2;g.rotation.z=rot;g.position.set(x,.12,z);g.userData.idx=idx;g.scale.setScalar(1.4);sc3.add(g);arrows.push(g);return g}
 const fwd=NODES.map((n,i)=>i<NODES.length-1?mkArrow(0,n.z-6,0,'f'+i):null),back=NODES.map((n,i)=>i>0?mkArrow(0,n.z+5,Math.PI,'b'+i):null);
 const cam=new T.PerspectiveCamera(66,W/H,.1,400);cam.rotation.order='YXZ';
 const ray=new T.Raycaster(),mv=new T.Vector2();
 const V={x:0,y:1.5,z:NODES[0].z,yaw:0,pitch:0},tgt={n:0,yaw:0,pitch:0,o:null,k:0};let tw=null,seenK=-1,last=performance.now(),t0=0;
 function nodePos(n,o){if(o!=null){const i=o,ex=EN[i][0],ez=NODES[1+(i>>1)].z-3,sd=ex<0?1:-1,dst=w=>({lion:7,zebra:8.4,elephant:9.5,giraffe:15.5,monkey:6.6,penguin:7.6})[w]||6;return{x:ex+sd*dst(ORDER[i]),y:1.7,z:ez+1.6,yaw:ex<0?Math.PI/2-.7:-Math.PI/2-.26,pitch:ORDER[i]==='giraffe'?.16:.04}}return{x:0,y:1.5,z:NODES[n].z,yaw:V.yaw,pitch:0}}
 function setTarget(s){tgt.yaw=s.yaw||0;tgt.pitch=s.pitch||0;const key=s.n+'/'+s.o+'/'+s.k;if(key!==tgt.key){tgt.key=key;const p=nodePos(s.n,s.o);const from={x:V.x,y:V.y,z:V.z,yaw:V.yaw,pitch:V.pitch};const yawTo=s.o!=null?p.yaw:(s.yawSnap!=null?s.yawSnap:s.yaw||0);tw={t:0,d:s.o!=null?1.1:1.4,from,to:{x:p.x,y:p.y,z:p.z,yaw:yawTo,pitch:s.o!=null?p.pitch:s.pitch||0},free:s.o==null}}tgt.n=s.n;tgt.o=s.o}
 const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
 function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;t0+=dt;
  if(tw){tw.t+=dt/tw.d;const e=ease(Math.min(1,tw.t));V.x=tw.from.x+(tw.to.x-tw.from.x)*e;V.y=tw.from.y+(tw.to.y-tw.from.y)*e;V.z=tw.from.z+(tw.to.z-tw.from.z)*e;
   if(!tw.free){let dy=tw.to.yaw-tw.from.yaw;dy=Math.atan2(Math.sin(dy),Math.cos(dy));V.yaw=tw.from.yaw+dy*e;V.pitch=tw.from.pitch+(tw.to.pitch-tw.from.pitch)*e}if(tw.t>=1)tw=null}
  if(!tw&&tgt.o==null){V.yaw+=(tgt.yaw-V.yaw)*Math.min(1,dt*10);V.pitch+=(tgt.pitch-V.pitch)*Math.min(1,dt*10)}
  cam.position.set(V.x,V.y,V.z);cam.rotation.set(V.pitch,V.yaw,0);
  clouds.forEach((c,i)=>{c.position.x+=dt*(.4+i*.08);if(c.position.x>90)c.position.x=-90});
  arrows.forEach((a,i)=>{const s=1.4+Math.sin(t0*3+i)*.12;a.scale.setScalar(s);a.visible=!!a.userData.idx&&tgt.o==null&&(((a.userData.idx[0]==='f')&&+a.userData.idx.slice(1)===tgt.n)||((a.userData.idx[0]==='b')&&+a.userData.idx.slice(1)===tgt.n))});
  anims.forEach((an,i)=>{const mo=an.userData.model;if(mo){mo.rotation.y=Math.sin(t0*.6+i)*.1;mo.scale.y=1+Math.sin(t0*1.7+i)*.014;mo.position.y=Math.max(0,Math.sin(t0*1.1+i*2))*.05}an.position.y=mo?0:Math.abs(Math.sin(t0*1.6+i))*.06;an.traverse(o=>{if(o.userData.head)o.rotation.y=Math.sin(t0*.8+i)*.25;if(o.userData.tail)o.rotation.z=Math.sin(t0*3+i)*.3;if(o.userData.flap)o.rotation.z=o.userData.flap*(.35+Math.sin(t0*4)*.25)});if(an.userData.jump>0){an.userData.jump-=dt;an.position.y+=Math.abs(Math.sin((.6-an.userData.jump)*Math.PI/.6))*1.2}});
  ren.render(sc3,cam);requestAnimationFrame(frame)}
 requestAnimationFrame(frame);
 // input
 const el=ren.domElement;let drag=null;const pt=e=>{const r=el.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width*W,y:(e.clientY-r.top)/r.height*H}};
 el.addEventListener('pointerdown',e=>{el.setPointerCapture(e.pointerId);drag={p:pt(e),yaw:V.yaw,pitch:V.pitch,moved:false,t:performance.now()};el.style.cursor='grabbing'});
 el.addEventListener('pointermove',e=>{if(!drag||tgt.o!=null)return;const p=pt(e),dx=p.x-drag.p.x,dy=p.y-drag.p.y;if(Math.hypot(dx,dy)>8)drag.moved=true;if(drag.moved){const yaw=drag.yaw+dx*.0036,pitch=Math.max(-.5,Math.min(.5,drag.pitch+dy*.0028));hooks.look(yaw,pitch)}});
 el.addEventListener('pointerup',e=>{el.style.cursor='grab';if(!drag)return;const d=drag;drag=null;if(d.moved)return;const p=pt(e);mv.set(p.x/W*2-1,-(p.y/H)*2+1);ray.setFromCamera(mv,cam);
  const hits=ray.intersectObjects(pick,false);const ah=ray.intersectObjects(arrows.filter(a=>a.visible).flatMap(a=>a.children),false);
  if(ah.length){const id=ah[0].object.parent.userData.idx;hooks.go(id[0]==='f'?1:-1);return}
  if(hits.length){const i=hits[0].object.userData.idx;anims[i].userData.jump=.6;hooks.open(i)}});
 window.__K1={cam,anims,V};return{set:setTarget,names:NODES.map(n=>n.name),order:ORDER,dispose(){ren.dispose();el.remove()},nodes:NODES.length};
}
window.K1W={create,ORDER,NODES};
})();
