const canvas=document.getElementById("canvas"),ctx=canvas.getContext("2d");
const status=document.getElementById("status"),start=document.getElementById("start"),again=document.getElementById("again");
let regions=[],i=0,running=false,tf;

function color(c){
  if(Math.max(...c)<=1)c=c.map(v=>Math.round(v*255));
  return `rgb(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])})`;
}
function prepare(){
  let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
  for(const r of regions)for(const [x,y] of r.contour){
    minX=Math.min(minX,x);maxX=Math.max(maxX,x);
    minY=Math.min(minY,y);maxY=Math.max(maxY,y);
  }
  const w=maxX-minX,h=maxY-minY,s=Math.min(600/w,600/h);
  canvas.width=Math.ceil(w*s);canvas.height=Math.ceil(h*s);
  return {s,cx:(minX+maxX)/2,cy:(minY+maxY)/2};
}
function drawRegion(r){
  const p=r.contour;if(!p||p.length<3)return;
  ctx.beginPath();
  let x=(p[0][0]-tf.cx)*tf.s+canvas.width/2;
  let y=(tf.cy-p[0][1])*tf.s+canvas.height/2;
  ctx.moveTo(x,y);
  for(let j=1;j<p.length;j++){
    x=(p[j][0]-tf.cx)*tf.s+canvas.width/2;
    y=(tf.cy-p[j][1])*tf.s+canvas.height/2;
    ctx.lineTo(x,y);
  }
  ctx.closePath();ctx.fillStyle=color(r.color);ctx.fill();
}
function frame(){
  if(!running)return;
  if(i>=regions.length){
    running=false;status.textContent="¡Listo! 🌻";again.hidden=false;return;
  }
  drawRegion(regions[i++]);
  status.textContent=`Dibujando... ${i} / ${regions.length}`;
  requestAnimationFrame(frame);
}
function startDrawing(){
  i=0;running=true;again.hidden=true;
  ctx.clearRect(0,0,canvas.width,canvas.height);frame();
}
async function load(){
  try{
    const res=await fetch("sunflowers.json");
    if(!res.ok)throw Error("No se pudo cargar el JSON");
    regions=await res.json();tf=prepare();
    ctx.fillStyle="#000";ctx.fillRect(0,0,canvas.width,canvas.height);
    status.textContent=`Encontré ${regions.length} regiones.`;
    start.disabled=false;
  }catch(e){
    console.error(e);
    status.textContent="No se pudo cargar el JSON. Necesitamos abrirlo con un servidor local.";
  }
}
start.onclick=startDrawing;again.onclick=startDrawing;load();
