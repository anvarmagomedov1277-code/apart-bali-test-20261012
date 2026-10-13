// Automatic motion: reveal early, keep copy still while it is being read.
export function createDesktopMotion({gsap,ScrollTrigger,SplitText,desktop=true,reduced=false}){
 const root=document.documentElement,off=[],loops=[],format=new Intl.NumberFormat('ru-RU');
 const listen=(node,type,handler,options)=>{node.addEventListener(type,handler,options);off.push(()=>node.removeEventListener(type,handler,options));};
 const link=(trigger,start='top bottom',end='bottom top',scrub=.25)=>({trigger,start,end,scrub});
 root.dataset.desktopMotion=desktop?'active':'mobile';
 const letters=[...document.querySelectorAll('.desktop-wordmark>span')];
 if(!reduced){
  gsap.from(desktop?letters:'.hero-brand',{y:8,opacity:.7,duration:.6,stagger:.06,ease:'power2.out'});
  gsap.to('.hero-camera',{y:desktop?70:65,scale:1.08,ease:'none',scrollTrigger:link('.hero','top top','bottom top')});
  if(desktop)letters.forEach((letter,index)=>gsap.to(letter,{y:-20-index*5,ease:'none',scrollTrigger:link('.hero','top top','bottom top')}));
  gsap.fromTo('.scroll-progress span',{scaleX:0},{scaleX:1,ease:'none',scrollTrigger:{start:0,end:'max',scrub:true}});
 }
 document.querySelectorAll('.split-heading,.hero-offer h2').forEach(heading=>{
  if(reduced||!SplitText){gsap.from(heading,{opacity:.7,duration:.35});return;}
  SplitText.create(heading,{type:'lines,words,chars',autoSplit:true,aria:'auto',onSplit(self){
   if(heading.getBoundingClientRect().top<innerHeight*.8)return gsap.from(self.chars,{y:4,opacity:.65,stagger:{amount:.08},duration:.25,ease:'power2.out'});
   return gsap.fromTo(self.chars,{y:8,opacity:.55},{y:0,opacity:1,stagger:{amount:.08},duration:.25,ease:'none',scrollTrigger:{trigger:heading,start:'top 97%',end:'top 80%',scrub:true}});
  }});
 });
 document.querySelectorAll('.section-intro,.management-copy>p,.contact-heading>p,.territory-copy').forEach(copy=>{
  if(reduced)return;
  gsap.fromTo(copy,{y:8,opacity:.6},{y:0,opacity:1,ease:'none',scrollTrigger:{trigger:copy,start:'top 98%',end:'top 80%',scrub:true}});
 });
 document.querySelectorAll('.counter').forEach(counter=>{
  const value=Number(counter.dataset.value),state={value:reduced?value:value*.8};
  counter.textContent=format.format(value);
  if(!reduced)gsap.to(state,{value,duration:.75,ease:'power2.out',onUpdate(){counter.textContent=format.format(Math.round(state.value));},scrollTrigger:{trigger:counter,start:'top 92%',once:true}});
 });
 if(!reduced){
  for(const [selector,trigger,amount] of [['.panorama-image','.project-panorama',-12],['.pool-image','.year-round-story',-12],['.management-image','.management-visual',-12]]){
   gsap.fromTo(selector,{yPercent:amount,scale:1.12},{yPercent:0,scale:1,ease:'none',scrollTrigger:link(trigger)});
  }
  gsap.to('.ribbon-track',{xPercent:desktop?-25:-35,ease:'none',scrollTrigger:link('.project')});
  document.querySelectorAll('.capital-light').forEach(field=>{
   gsap.fromTo(field.querySelectorAll('i'),{x:-20,opacity:.2},{x:20,opacity:.7,ease:'none',scrollTrigger:link(field.closest('.investment-scenario'))});
  });
  if(desktop)document.querySelectorAll('#project,#investment,#contact').forEach(section=>{
   const field=document.createElement('div');field.className='architectural-light';field.setAttribute('aria-hidden','true');field.innerHTML='<span></span><span></span><span></span>';
   section.appendChild(field);off.push(()=>field.remove());
   gsap.fromTo(field,{xPercent:-4,yPercent:3},{xPercent:4,yPercent:-3,ease:'none',scrollTrigger:link(section)});
   const loop=gsap.timeline({repeat:-1,yoyo:true,paused:true}).to(field.querySelectorAll('span'),{opacity:.2,x:18,duration:5,stagger:.3,ease:'sine.inOut'});
   loops.push({loop,section});ScrollTrigger.create({trigger:section,start:'top bottom',end:'bottom top',onToggle:syncLoops});
  });
 }
 function syncLoops(){for(const {loop,section} of loops){const rect=section.getBoundingClientRect();if(!document.hidden&&rect.top<innerHeight&&rect.bottom>0)loop.play();else loop.pause();}}
 listen(document,'visibilitychange',syncLoops);syncLoops();
 if(desktop&&!reduced){
  const hover=matchMedia('(hover:hover) and (pointer:fine)');
  document.querySelectorAll('.button,.text-link,.icon-button,.area-choice').forEach(control=>{
   const moving=[...control.querySelectorAll(':scope>span,:scope>svg')];
   const quick=new Map(moving.map(el=>[el,{x:gsap.quickTo(el,'x',{duration:.18,ease:'power2.out'}),y:gsap.quickTo(el,'y',{duration:.18,ease:'power2.out'})}]));
   const leave=()=>{control.classList.remove('is-motion-hover');gsap.to(moving,{x:0,y:0,scale:1,duration:.18,overwrite:true});};
   listen(control,'pointerenter',()=>{if(hover.matches){control.classList.add('is-motion-hover');gsap.to(moving,{x:2,duration:.2,overwrite:'auto'});}});
   listen(control,'pointermove',event=>{if(!hover.matches)return;const r=control.getBoundingClientRect();for(const pair of quick.values()){pair.x(((event.clientX-r.left)/r.width-.5)*6);pair.y(((event.clientY-r.top)/r.height-.5)*4);}});
   listen(control,'pointerleave',leave);listen(control,'blur',leave);
   listen(control,'pointerdown',()=>gsap.to(moving,{scale:.97,duration:.1,overwrite:'auto'}));
   listen(control,'pointerup',()=>gsap.to(moving,{scale:1,duration:.15,overwrite:'auto'}));
   off.push(()=>{control.classList.remove('is-motion-hover');gsap.killTweensOf(moving);gsap.set(moving,{clearProps:'transform'});});
  });
  document.querySelectorAll('h2,h3,.desktop-wordmark').forEach(heading=>{
   let chars=[];
   listen(heading,'pointerenter',()=>{if(!hover.matches)return;chars=heading.matches('.desktop-wordmark')?[...heading.children]:[...heading.querySelectorAll('div')].filter(el=>el.children.length===0);gsap.to(chars,{color:heading.closest('.project,.apartments,.contact,.year-round-copy')?'#794628':'#f2ad85',duration:.25,stagger:{amount:.1}});});
   listen(heading,'pointerleave',()=>gsap.to(chars,{clearProps:'color',duration:.2}));
   off.push(()=>{gsap.killTweensOf(chars);gsap.set(chars,{clearProps:'color'});});
  });
 }
 return ()=>{off.reverse().forEach(dispose=>dispose());root.dataset.desktopMotion='off';};
}
