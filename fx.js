// A single bounded WebGL light field. No geometry or commercial data is invented.
export async function createLightField({active,layer}) {
 const root=document.documentElement;
 const canvas=document.createElement('canvas');
 const gl=canvas.getContext('webgl2',{alpha:true,antialias:false,powerPreference:'low-power'});
 if(!gl){root.dataset.fx='fallback';return null;}
 const THREE=await import('./vendor/three.module.js');
 if(!active())return null;
 const renderer=new THREE.WebGLRenderer({canvas,context:gl,alpha:true,antialias:false});
 renderer.setPixelRatio(1);
 const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-1,1,1,-1,0,1);
 const uniforms={uTime:{value:0},uScroll:{value:0},uPointer:{value:new THREE.Vector2(.5,.5)},uAspect:{value:1}};
 const material=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms,
  vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position.xy,0.0,1.0);}',
  fragmentShader:'uniform float uTime; uniform float uScroll; uniform float uAspect; uniform vec2 uPointer; varying vec2 vUv; void main(){vec2 p=vUv;float t=uTime*.22+uScroll*1.6;vec2 q=vec2(p.x*uAspect,p.y);float a=sin(q.x*10.0+sin(q.y*8.0+t)*1.4+t);float b=cos(q.y*12.0+cos(q.x*9.0-t)*1.2-t*.6);float caustic=pow(max(0.0,1.0-abs(a+b)*.75),7.0);float ray=pow(max(0.0,sin(p.x*8.0+p.y*3.0+t)),9.0);float ripple=sin(distance(p,uPointer)*38.0-t*5.0)*.5+.5;float edge=smoothstep(0.0,.12,p.y)*(1.0-smoothstep(.8,1.0,p.y));float alpha=(caustic*.22+ray*.13+ripple*.025)*edge;gl_FragColor=vec4(vec3(.94,.77,.43),alpha);}'
 });
 const geometry=new THREE.PlaneGeometry(2,2),mesh=new THREE.Mesh(geometry,material);
 mesh.frustumCulled=false;scene.add(mesh);
 layer.appendChild(canvas);root.dataset.fx='webgl';
 let raf=0,disposed=false,last=0,frames=0;
 function size(){const rect=layer.getBoundingClientRect();renderer.setSize(rect.width,innerHeight,false);uniforms.uAspect.value=rect.width/innerHeight;}
 size();
 function pointer(event){const rect=layer.getBoundingClientRect();uniforms.uPointer.value.set(Math.max(0,Math.min(1,(event.clientX-rect.left)/rect.width)),1-event.clientY/innerHeight);}
 function draw(time){
  if(disposed)return;
  raf=requestAnimationFrame(draw);
  if(document.hidden||!active()||time-last<32)return;
  last=time;uniforms.uTime.value=time/1000;uniforms.uScroll.value=scrollY/innerHeight;
  renderer.render(scene,camera);frames++;
  if(frames%15===0)canvas.dataset.frames=String(frames);
 }
 raf=requestAnimationFrame(draw);
 window.addEventListener('resize',size);window.addEventListener('pointermove',pointer,{passive:true});
 canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();root.dataset.fx='fallback';cancelAnimationFrame(raf);});
 return {dispose(){disposed=true;cancelAnimationFrame(raf);window.removeEventListener('resize',size);window.removeEventListener('pointermove',pointer);geometry.dispose();material.dispose();renderer.dispose();canvas.remove();root.dataset.fx='off';}};
}
