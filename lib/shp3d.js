/* K1 shapes 3D (three.js r149): solid shapes you can orbit all the way round (top and bottom too)
   and a magnetic-tile builder: drag a tile, it snaps onto the model, model can be turned any time. */
(function(){
const T=THREE;
T.ColorManagement.legacyMode=false;
const PAL={red:'#E8404A',orange:'#FF8A1F',yellow:'#FFC928',green:'#35B85A',blue:'#2F6FE0',purple:'#8E4FD0',pink:'#F0509C',cyan:'#1FB5C9'};
const s3=Math.sqrt(3)/2,HP=Math.sqrt(s3*s3-.25);
const V=(x,y,z)=>new T.Vector3(x,y,z);
const cvt=a=>V(a[0],a[2],-a[1]);
const X=[1,0,0],Y=[0,1,0],Z=[0,0,1];
/* ---------- tile models (same poses as the Blender builds) ---------- */
const BD={
 house:{n:4,P:[['sq','yellow',{1:[[0,-.5,0],X,Y]}],
  ['sq','red',{2:[[0,-.5,0],X,Z]}],['sq','blue',{2:[[0,.5,0],X,Z]}],['sq','green',{2:[[-.5,0,0],Y,Z]}],['sq','pink',{2:[[.5,0,0],Y,Z]}],
  ['tri','orange',{3:[[0,-.5,1],X,Z]}],['tri','yellow',{3:[[0,.5,1],X,Z]}],
  ['sq','cyan',{4:[[-.5,0,1],Y,[.5,0,s3]]}],['sq','purple',{4:[[.5,0,1],Y,[-.5,0,s3]]}]]},
 box:{n:3,P:[['sq','blue',{1:[[0,-.5,0],X,Y]}],
  ['sq','red',{2:[[0,-.5,0],X,Z]}],['sq','yellow',{2:[[0,.5,0],X,Z]}],['sq','green',{2:[[-.5,0,0],Y,Z]}],['sq','orange',{2:[[.5,0,0],Y,Z]}],
  ['sq','purple',{3:[[0,-.5,1],X,Y]}]]},
 pyramid:{n:3,P:[['sq','orange',{1:[[0,-.5,0],X,Y]}],
  ['tri','red',{2:[[0,-.5,0],X,[0,-1,0]],3:[[0,-.5,0],X,[0,.5,HP]]}],
  ['tri','yellow',{2:[[0,.5,0],X,[0,1,0]],3:[[0,.5,0],X,[0,-.5,HP]]}],
  ['tri','green',{2:[[-.5,0,0],Y,[-1,0,0]],3:[[-.5,0,0],Y,[.5,0,HP]]}],
  ['tri','blue',{2:[[.5,0,0],Y,[1,0,0]],3:[[.5,0,0],Y,[-.5,0,HP]]}]]}};
function mkPose(k,mid,u,v){const off=k==='sq'?.5:s3/3;u=cvt(u).normalize();v=cvt(v).normalize();const n=new T.Vector3().crossVectors(u,v);
 const c=cvt(mid).add(v.clone().multiplyScalar(off));const q=new T.Quaternion().setFromRotationMatrix(new T.Matrix4().makeBasis(u,v,n));return{p:c,q}}
function mkPieces(id){return BD[id].P.map((P,i)=>{const keys=Object.keys(P[2]).map(Number).sort((a,b)=>a-b),pz={};keys.forEach(k=>{const a=P[2][k];pz[k]=mkPose(P[0],a[0],a[1],a[2])});return{i,k:P[0],col:P[1],keys,pz,step:keys[0]-1}})}
const poseOf=(pc,fin)=>pc.pz[fin?pc.keys[pc.keys.length-1]:pc.keys[0]];
/* ---------- geometry ---------- */
function rpoly(pts,r,P){const sh=new P(),n=pts.length;for(let i=0;i<n;i++){const p=pts[i],a=pts[(i+n-1)%n],b=pts[(i+1)%n];
 const la=Math.hypot(a[0]-p[0],a[1]-p[1]),lb=Math.hypot(b[0]-p[0],b[1]-p[1]),ta=Math.min(.45,r/la),tb=Math.min(.45,r/lb);
 const s=[p[0]+(a[0]-p[0])*ta,p[1]+(a[1]-p[1])*ta],e=[p[0]+(b[0]-p[0])*tb,p[1]+(b[1]-p[1])*tb];
 if(i===0)sh.moveTo(s[0],s[1]);else sh.lineTo(s[0],s[1]);sh.quadraticCurveTo(p[0],p[1],e[0],e[1])}sh.closePath();return sh}
const PTS={sq:[[-.5,-.5],[.5,-.5],[.5,.5],[-.5,.5]],tri:[[-.5,-s3/3],[.5,-s3/3],[0,2*s3/3]]},KK={sq:.82,tri:.70};
const GEO={};
function tileGeo(k){if(GEO[k])return GEO[k];const pts=PTS[k],kk=KK[k],inner=pts.map(p=>[p[0]*kk,p[1]*kk]);
 const outer=rpoly(pts,k==='sq'?.07:.06,T.Shape);outer.holes.push(rpoly(inner,.035,T.Path));
 const fr=new T.ExtrudeGeometry(outer,{depth:.05,bevelEnabled:true,bevelThickness:.012,bevelSize:.012,bevelSegments:3,steps:1,curveSegments:6});fr.translate(0,0,-.025);
 const pn=new T.ExtrudeGeometry(rpoly(inner.map(p=>[p[0]*1.004,p[1]*1.004]),.035,T.Shape),{depth:.03,bevelEnabled:false,curveSegments:6});pn.translate(0,0,-.015);
 return GEO[k]={fr,pn}}
const MAT={};
function tileMats(c){if(MAT[c])return MAT[c];const col=new T.Color(PAL[c]),pc=col.clone().lerp(new T.Color(0xffffff),.32);
 return MAT[c]={fr:new T.MeshPhysicalMaterial({color:col,roughness:.22,clearcoat:.8,clearcoatRoughness:.12,envMapIntensity:.9}),
  pn:new T.MeshPhysicalMaterial({color:pc,roughness:.1,transparent:true,opacity:.7,envMapIntensity:.7,side:T.DoubleSide,depthWrite:false})}}
function mkTile(k,c){const g=tileGeo(k),m=tileMats(c),o=new T.Group();const a=new T.Mesh(g.fr,m.fr),b=new T.Mesh(g.pn,m.pn);b.renderOrder=2;o.add(a,b);return o}
const GM=new T.MeshBasicMaterial({color:0xFF9A1F,transparent:true,opacity:.8,depthTest:false,depthWrite:false}),GP=new T.MeshBasicMaterial({color:0xFFD36A,transparent:true,opacity:.3,depthTest:false,depthWrite:false});
function mkGhost(k){const g=tileGeo(k),o=new T.Group();const a=new T.Mesh(g.fr,GM),b=new T.Mesh(g.pn,GP);a.renderOrder=10;b.renderOrder=9;o.add(a,b);return o}
/* ---------- textures for the solids ---------- */
function canv(w,h,f){const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);t.anisotropy=4;t.encoding=T.sRGBEncoding;return t}
function ballTex(){return canv(1024,512,(x,w,h)=>{const cols=['#E8404A','#FFFFFF','#2F6FE0','#FFFFFF','#FFC928','#FFFFFF'];cols.forEach((c,i)=>{x.fillStyle=c;x.fillRect(i*w/6,0,w/6+1,h)});
 x.fillStyle='#FFE45C';x.fillRect(0,0,w,34);x.fillRect(0,h-34,w,34);x.fillStyle='#E8404A';x.fillRect(0,34,w,6);x.fillRect(0,h-40,w,6)})}
function hatTex(){return canv(256,512,(x,w,h)=>{const bands=['#F0509C','#FFFFFF','#FFC928','#FFFFFF'];for(let i=0;i<8;i++){x.fillStyle=bands[i%4];x.fillRect(0,i*h/8,w,h/8+1)}})}
function canTex(){return canv(1024,256,(x,w,h)=>{x.fillStyle='#E8404A';x.fillRect(0,0,w,h);x.fillStyle='#FFC928';x.fillRect(0,h*.34,w,h*.32);x.fillStyle='#FFFFFF';x.fillRect(0,h*.30,w,8);x.fillRect(0,h*.66,w,8);
 x.fillStyle='#E8404A';for(let i=0;i<8;i++){const cx=(i+.5)*w/8,cy=h*.5;x.beginPath();for(let j=0;j<10;j++){const r=j%2?16:38,a=-Math.PI/2+j*Math.PI/5;x.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r)}x.closePath();x.fill()}})}
function shadowTex(){return canv(128,128,(x,w,h)=>{const g=x.createRadialGradient(w/2,h/2,4,w/2,h/2,w/2);[[0,.3],[.25,.24],[.5,.12],[.75,.04],[1,0]].forEach(s=>g.addColorStop(s[0],'rgba(30,50,90,'+s[1]+')'));x.fillStyle=g;x.fillRect(0,0,w,h)})}
const std=(o)=>new T.MeshPhysicalMaterial(Object.assign({roughness:.35,clearcoat:.55,clearcoatRoughness:.2},o));
function roundBox(s,b){const r=s/2-b,sh=rpoly([[-r,-r],[r,-r],[r,r],[-r,r]],.06,T.Shape);const g=new T.ExtrudeGeometry(sh,{depth:2*r,bevelEnabled:true,bevelThickness:b,bevelSize:b,bevelSegments:5,curveSegments:8});g.translate(0,0,-r);return g}
function solid(n){const g=new T.Group();
 if(n==='ball'){const m=new T.Mesh(new T.SphereGeometry(1,72,44),std({map:ballTex(),roughness:.3,clearcoat:.8}));m.position.y=1;g.add(m);g.userData={h:2,r:1.25}}
 else if(n==='box'){const S=1.7,b=new T.Mesh(roundBox(S,.1),std({color:0x2F6FE0,roughness:.3,clearcoat:.7}));b.position.y=S/2;g.add(b);
  const ym=std({color:0xFFC928,roughness:.28,clearcoat:.7}),rw=.36;
  const r1=new T.Mesh(new T.BoxGeometry(rw,S+.05,S+.05),ym),r2=new T.Mesh(new T.BoxGeometry(S+.05,S+.05,rw),ym);r1.position.y=r2.position.y=S/2;g.add(r1,r2);
  const l1=new T.Mesh(new T.TorusGeometry(.3,.085,16,32),ym);l1.position.set(.3,S+.25,0);l1.rotation.set(0,Math.PI/2,Math.PI/5);const l2=l1.clone();l2.position.x=-.3;l2.rotation.z=-Math.PI/5;g.add(l1,l2);
  const kn=new T.Mesh(new T.SphereGeometry(.17,20,16),ym);kn.position.set(0,S+.08,0);g.add(kn);
  g.userData={h:S+.4,r:1.5}}
 else if(n==='cone'){const H=2,R=.9,c=new T.Mesh(new T.ConeGeometry(R,H,72,1,true),std({map:hatTex(),roughness:.4,side:T.DoubleSide}));c.position.y=H/2;g.add(c);
  const cap=new T.Mesh(new T.CircleGeometry(R,72),std({color:0xF0509C,roughness:.4}));cap.rotation.x=Math.PI/2;cap.position.y=.001;g.add(cap);
  const rim=new T.Mesh(new T.TorusGeometry(R,.05,12,72),std({color:0xFFFFFF}));rim.rotation.x=Math.PI/2;rim.position.y=.02;g.add(rim);
  const pp=new T.Mesh(new T.SphereGeometry(.2,24,18),std({color:0xFFC928,roughness:.6,clearcoat:.1}));pp.position.y=H+.02;g.add(pp);g.userData={h:H+.2,r:1.5}}
 else{const H=1.5,R=.85,b=new T.Mesh(new T.CylinderGeometry(R,R,H,72,1,true),std({map:canTex(),roughness:.35,clearcoat:.5}));b.position.y=H/2;g.add(b);
  const mm=new T.MeshStandardMaterial({color:0xDDE3EA,metalness:.95,roughness:.22});
  [0,H].forEach(y=>{const l=new T.Mesh(new T.CylinderGeometry(R+.03,R+.03,.07,72),mm);l.position.y=y;g.add(l);const d=new T.Mesh(new T.CylinderGeometry(R-.14,R-.14,.02,72),new T.MeshStandardMaterial({color:0xB8C2CE,metalness:.9,roughness:.3}));d.position.y=y+(y?.04:-.04);g.add(d);
   const t=new T.Mesh(new T.TorusGeometry(R-.02,.04,10,72),mm);t.rotation.x=Math.PI/2;t.position.y=y+(y?.035:-.035);g.add(t)});
  g.userData={h:H+.1,r:1.45}}
 return g}
/* ---------- renderer / camera ---------- */
let R=null,scene,cam,envT,dom,slot=null,cur=null,lastT=0,raf=0,aspect=1;
const O={yaw:.55,pitch:.32,v:0,vp:0,last:0,auto:false,drag:false,dist:6,tgt:V(0,1,0),tgtT:V(0,1,0),rad:1.5,radT:1.5,mv:null,cb:null};
function mkEnv(r){const s=new T.Scene(),g=new T.SphereGeometry(50,32,16),col=[],pos=g.attributes.position,c1=new T.Color('#c9d6e8'),c2=new T.Color('#ffffff'),c3=new T.Color('#b6d9ff');
 for(let i=0;i<pos.count;i++){const t=pos.getY(i)/50,c=t<0?c1.clone().lerp(c2,1+t):c2.clone().lerp(c3,t);col.push(c.r,c.g,c.b)}
 g.setAttribute('color',new T.Float32BufferAttribute(col,3));s.add(new T.Mesh(g,new T.MeshBasicMaterial({vertexColors:true,side:T.BackSide})));
 const lm=new T.MeshBasicMaterial({color:new T.Color(5,5,5.2),side:T.DoubleSide});
 [[-22,22,24,26,14],[26,12,-14,16,26],[0,46,0,30,30],[18,6,26,14,8]].forEach(a=>{const p=new T.Mesh(new T.PlaneGeometry(a[3],a[4]),lm);p.position.set(a[0],a[1],a[2]);p.lookAt(0,0,0);s.add(p)});
 const pm=new T.PMREMGenerator(r),rt=pm.fromScene(s,.03);pm.dispose();return rt.texture}
function init(){if(R)return;R=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});R.setClearColor(0x000000,0);R.setPixelRatio(1);R.outputEncoding=T.sRGBEncoding;R.toneMapping=T.NoToneMapping;
 dom=R.domElement;dom.style.cssText='display:block;width:100%;height:100%;touch-action:none';scene=new T.Scene();envT=mkEnv(R);scene.environment=envT;
 cam=new T.PerspectiveCamera(32,1,.1,100);scene.add(new T.HemisphereLight(0xffffff,0xc4d4ea,.5));const dl=new T.DirectionalLight(0xffffff,.8);dl.position.set(3,6,4);scene.add(dl)}
function clear(){for(let i=scene.children.length-1;i>=0;i--){const o=scene.children[i];if(o.userData&&o.userData.k1)scene.remove(o)}}
function fitDist(){const fv=cam.fov*Math.PI/360,fh=Math.atan(Math.tan(fv)*cam.aspect),f=Math.min(fv,fh);O.dist=O.rad*(cur&&cur.t==='build'?.98:1.1)/Math.sin(f)}
function place(){const cp=Math.cos(O.pitch);cam.position.set(O.tgt.x+O.dist*cp*Math.sin(O.yaw),O.tgt.y+O.dist*Math.sin(O.pitch),O.tgt.z+O.dist*cp*Math.cos(O.yaw));cam.up.set(0,1,0);cam.lookAt(O.tgt)}
const wrap=a=>{while(a>Math.PI)a-=2*Math.PI;while(a<-Math.PI)a+=2*Math.PI;return a};
const ease=t=>1-Math.pow(1-t,3),back=t=>{const c=1.9;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2)};
const anims=[];
function loop(ts){raf=requestAnimationFrame(loop);if(!slot||!slot.isConnected){return}
 const dt=Math.min(.05,(ts-lastT)/1000||.016);lastT=ts;const rr=slot.getBoundingClientRect(),w=Math.max(2,Math.round(Math.min(2,devicePixelRatio||1)*rr.width)),h=Math.max(2,Math.round(Math.min(2,devicePixelRatio||1)*rr.height));
 if(dom.width!==w||dom.height!==h){R.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();aspect=w/h;fitDist()}
 const now=performance.now();
 const kk=Math.min(1,dt*3.5);O.rad+=(O.radT-O.rad)*kk;O.tgt.lerp(O.tgtT,kk);fitDist();
 if(O.mv){const m=O.mv;m.t+=dt/m.d;const k=ease(Math.min(1,m.t));O.yaw=m.y0+m.dy*k;O.pitch=m.p0+m.dp*k;if(m.t>=1)O.mv=null;if(O.cb)O.cb(O.yaw,O.pitch,1)}
 else if(!O.drag){if(Math.abs(O.v)>.02||Math.abs(O.vp)>.02){O.yaw+=O.v*dt;O.pitch=clampP(O.pitch+O.vp*dt);const f=Math.pow(.08,dt);O.v*=f;O.vp*=f}else{O.v=O.vp=0;if(O.auto&&now-O.last>2500)O.yaw+=.55*dt}}
 for(let i=anims.length-1;i>=0;i--){const a=anims[i];a.t+=dt/a.d;const k=Math.min(1,a.t),e=a.ease==='back'?back(k):ease(k);a.o.position.lerpVectors(a.f.p,a.to.p,e);a.o.quaternion.slerpQuaternions(a.f.q,a.to.q,ease(k));const s=a.f.s+(1-a.f.s)*ease(k);a.o.scale.setScalar(s);if(k>=1){anims.splice(i,1);if(a.done)a.done()}}
 if(cur&&cur.t==='build'){const o=.5+.3*Math.sin(now/260);GM.opacity=.55+.4*Math.abs(Math.sin(now/380));GP.opacity=.2+.2*Math.abs(Math.sin(now/380))}
 place();R.render(scene,cam)}
const clampP=p=>Math.max(-1.5,Math.min(1.5,p));
function stop(){if(raf)cancelAnimationFrame(raf);raf=0}
/* ---------- public API ---------- */
const S3=window.S3={ready:true,
 mount(el){init();slot=el;if(dom.parentNode!==el){el.appendChild(dom)}if(!raf){lastT=performance.now();raf=requestAnimationFrame(loop)}},
 idle(){slot=null;stop();cur=null},
 onCam(f){O.cb=f},
 getCam(){return{y:O.yaw,p:O.pitch}},
 setCam(y,p,anim){if(O.drag)return;O.last=performance.now();O.v=O.vp=0;if(anim){O.mv={t:0,d:.7,y0:O.yaw,dy:wrap(y-O.yaw),p0:O.pitch,dp:clampP(p)-O.pitch}}else{O.mv=null;O.yaw=y;O.pitch=clampP(p)}},
 view(n){const v={front:[0,.12],top:[O.yaw,1.5],bottom:[O.yaw,-1.5],side:[Math.PI/2,.12],back:[Math.PI,.12],iso:[.55,.32]}[n]||[.55,.32];S3.setCam(v[0],v[1],1);if(O.cb)O.cb(v[0],v[1],1)},
 nudge(dy,dp){O.mv=null;O.last=performance.now();S3.setCam(O.yaw+dy,clampP(O.pitch+dp),1);if(O.cb)O.cb(O.yaw+dy,clampP(O.pitch+dp),1)},
 dragStart(){O.drag=true;O.mv=null;O.v=O.vp=0;O.last=performance.now()},
 dragMove(dx,dy,dt){if(!O.drag)return;const rr=slot?slot.getBoundingClientRect():{width:600,height:600};const ay=-dx/rr.width*4.4,ap=dy/rr.height*3.2;O.yaw+=ay;O.pitch=clampP(O.pitch+ap);O.last=performance.now();if(dt>0){O.v=.6*O.v+.4*ay/dt;O.vp=.6*O.vp+.4*ap/dt}if(O.cb)O.cb(O.yaw,O.pitch)},
 dragEnd(){O.drag=false;O.last=performance.now();O.v=Math.max(-5,Math.min(5,O.v));O.vp=Math.max(-3,Math.min(3,O.vp));if(O.cb)O.cb(O.yaw,O.pitch,1)},
 pieces(id){return BD[id]?mkPieces(id).map(p=>({i:p.i,k:p.k,col:p.col,step:p.step})):[]},
 slots(id,k){return mkPieces(id).filter(p=>p.step===k).map(p=>p.i)},
 defCol(id,i){return BD[id].P[i][1]},
 pick(u,v){const b=cur;if(!b||b.t!=='build'||!b.ghosts.length)return-1;cam.updateMatrixWorld();let best=-1,bd=1e9;
  b.ghosts.forEach(g=>{const p=g.pos.clone().project(cam),x=(p.x+1)/2,y=(1-p.y)/2,d=Math.hypot((x-u)*aspect,y-v);if(d<bd){bd=d;best=g.i}});return best},
 show(sp){if(!R)return;if(sp.t==='solid')setSolid(sp.n);else setBuild(sp)}};
function reset3(yaw,pitch,auto){clear();anims.length=0;O.yaw=yaw;O.pitch=pitch;O.auto=auto;O.v=O.vp=0;O.mv=null}
function setSolid(n){if(cur&&cur.t==='solid'&&cur.n===n)return;const was=cur&&cur.t==='solid';clear();anims.length=0;if(!was){O.yaw=.55;O.pitch=.32}cur={t:'solid',n};O.auto=true;O.last=0;
 const g=solid(n);g.userData.k1=1;scene.add(g);const h=g.userData.h,r=g.userData.r;O.tgt.set(0,h/2,0);O.tgtT.copy(O.tgt);O.rad=O.radT=r;fitDist();
 const sh=new T.Mesh(new T.PlaneGeometry(r*2.6,r*2.6),new T.MeshBasicMaterial({map:shadowTex(),transparent:true,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.position.y=.004;sh.userData.k1=1;scene.add(sh)}
function setBuild(sp){const id=sp.id;let b=cur;
 if(!b||b.t!=='build'||b.id!==id){clear();anims.length=0;const pcs=mkPieces(id);b={t:'build',id,pieces:pcs,meshes:{},ghosts:[],gh:[],k:-1,fin:false,lastN:0,root:new T.Group()};b.root.userData.k1=1;scene.add(b.root);cur=b;
  const bb=new T.Box3(),bf=new T.Box3();pcs.forEach(p=>Object.keys(p.pz).forEach(k=>{const m=new T.Matrix4().compose(p.pz[k].p,p.pz[k].q,V(1,1,1));PTS[p.k].forEach(q=>{const w=V(q[0],q[1],0).applyMatrix4(m);bb.expandByPoint(w);if(+k===p.keys[p.keys.length-1])bf.expandByPoint(w)})}));
  const c=bb.getCenter(V(0,0,0)),sz=bb.getSize(V(0,0,0));b.cAll=c;b.rAll=sz.length()*.5+.15;b.cFin=bf.getCenter(V(0,0,0));b.rFin=bf.getSize(V(0,0,0)).length()*.5+.25;
  O.tgt.copy(c);O.tgtT.copy(c);O.rad=O.radT=b.rAll;fitDist();O.yaw=.62;O.pitch=.4;O.auto=false;O.v=O.vp=0;O.mv=null;
  const sh=new T.Mesh(new T.PlaneGeometry(b.rFin*2.8,b.rFin*2.8),new T.MeshBasicMaterial({map:shadowTex(),transparent:true,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.position.set(c.x,bb.min.y-.012,c.z);sh.userData.k1=1;scene.add(sh)}
 const n=BD[id].n,fin=sp.k>=n,cols=sp.cols||{};O.auto=fin;O.radT=fin?b.rFin:b.rAll;O.tgtT.copy(fin?b.cFin:b.cAll);
 b.pieces.forEach(pc=>{const col=cols[pc.i],m=b.meshes[pc.i];
  if(!col){if(m){b.root.remove(m.o);delete b.meshes[pc.i]}return}
  const tp=poseOf(pc,fin);
  if(!m){const o=mkTile(pc.k,col);o.position.copy(tp.p);o.quaternion.copy(tp.q);b.root.add(o);b.meshes[pc.i]={o,col,fin};
   if(sp.last&&sp.last.s===pc.i&&sp.last.n!==b.lastN){b.lastN=sp.last.n;const fp=startPos(sp.last.u,sp.last.v,tp);anims.push({o,f:{p:fp,q:tp.q.clone(),s:1.3},to:tp,t:0,d:.42,ease:'back'})}
   else if(sp.last==null||sp.last.s!==pc.i){/* restored or skipped: pop in */o.scale.setScalar(.01);anims.push({o,f:{p:tp.p.clone().add(V(0,.5,0)),q:tp.q.clone(),s:.01},to:tp,t:0,d:.35,ease:'back'})}}
  else{if(m.col!==col){b.root.remove(m.o);const o=mkTile(pc.k,col);o.position.copy(tp.p);o.quaternion.copy(tp.q);b.root.add(o);b.meshes[pc.i]={o,col,fin}}
   else if(m.fin!==fin){m.fin=fin;const f={p:m.o.position.clone(),q:m.o.quaternion.clone(),s:1};anims.push({o:m.o,f,to:tp,t:0,d:1.5,ease:'cubic'})}}});
 b.ghosts.forEach(g=>b.root.remove(g.o));b.ghosts=[];
 if(!fin)b.pieces.forEach(pc=>{if(pc.step===sp.k&&!cols[pc.i]){const tp=poseOf(pc,false),o=mkGhost(pc.k);o.position.copy(tp.p);o.quaternion.copy(tp.q);b.root.add(o);b.ghosts.push({i:pc.i,o,pos:tp.p.clone()})}});
 b.k=sp.k;b.fin=fin}
function startPos(u,v,tp){if(u==null||v==null)return tp.p.clone().add(V(0,.7,0));cam.updateMatrixWorld();const nx=V(u*2-1,1-v*2,.5).unproject(cam),d=nx.sub(cam.position).normalize();const dist=cam.position.distanceTo(O.tgt)*.85;return cam.position.clone().add(d.multiplyScalar(dist))}
})();
