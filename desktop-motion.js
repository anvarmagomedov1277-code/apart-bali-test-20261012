// Continuous facade light + early assembly; copy stays still in its reading zone.
export function createDesktopMotion({gsap,ScrollTrigger,SplitText,desktop=true,reduced=false}){
 const root=document.documentElement,off=[],loops=[],format=new Intl.NumberFormat('ru-RU');
 const listen=(node,type,handler,options)=>{node.addEventListener(type,handler,options);off.push(()=>node.removeEventListener(type,handler,options));};
 const link=(trigger,start='top bottom',end='bottom top',scrub=.25)=>({trigger,start,end,scrub});
 const addLoop=(loop,section)=>{loops.push({loop,section});ScrollTrigger.create({trigger:section,start:'top bottom',end:'bottom top',onToggle:syncLoops});};
 root.dataset.desktopMotion=desktop?'active':'mobile';
 const letters=[...document.querySelectorAll('.desktop-wordmark>span')];
 if(!reduced){
  gsap.from(desktop?letters:'.hero-brand',{y:18,opacity:.3,duration:.8,stagger:.08,ease:'power3.out'});
  addLoop(gsap.to('.hero-scene',{y:-10,duration:6,repeat:-1,yoyo:true,ease:'sine.inOut',paused:true}),document.querySelector('.hero'));
  addLoop(gsap.to('.scroll-hint svg',{y:6,duration:1.1,repeat:-1,yoyo:true,ease:'sine.inOut',paused:true}),document.querySelector('.hero'));
  gsap.to('.hero-camera',{y:desktop?70:65,scale:1.08,ease:'none',scrollTrigger:link('.hero','top top','bottom top')});
  if(desktop)letters.forEach((letter,index)=>gsap.to(letter,{y:-20-index*5,ease:'none',scrollTrigger:link('.hero','top top','bottom top')}));
  gsap.fromTo('.scroll-progress span',{scaleX:0},{scaleX:1,ease:'none',scrollTrigger:{start:0,end:'max',scrub:true}});
 }
 document.querySelectorAll('.split-heading,.hero-offer h2').forEach(heading=>{
  if(reduced||!SplitText){gsap.from(heading,{opacity:.7,duration:.35});return;}
  SplitText.create(heading,{type:'lines,words,chars',autoSplit:true,aria:'auto',onSplit(self){
   if(heading.getBoundingClientRect().top<innerHeight*.8)return gsap.from(self.chars,{y:18,opacity:.3,stagger:{amount:.12},duration:.55,ease:'power3.out'});
   return gsap.fromTo(self.chars,{y:28,opacity:.25},{y:0,opacity:1,stagger:{amount:.12},duration:.4,ease:'none',scrollTrigger:{trigger:heading,start:'top 100%',end:'top 78%',scrub:true}});
  }});
 });
 document.querySelectorAll('.section-intro,.management-copy>p,.contact-heading>p,.territory-copy').forEach(copy=>{
  if(reduced)return;
  gsap.fromTo(copy,{y:18,opacity:.45},{y:0,opacity:1,ease:'none',scrollTrigger:{trigger:copy,start:'top 100%',end:'top 78%',scrub:true}});
 });
 document.querySelectorAll('.counter').forEach(counter=>{
  const value=Number(counter.dataset.value),state={value:reduced?value:0};
  counter.textContent=format.format(value);
  if(!reduced)gsap.to(state,{value,duration:1,ease:'power3.out',onUpdate(){counter.textContent=format.format(Math.round(state.value));},scrollTrigger:{trigger:counter,start:'top 95%',once:true}});
 });
 if(!reduced){
  for(const [selector,trigger,amount] of [['.panorama-image','.project-panorama',-12],['.pool-image','.year-round-story',-12],['.management-image','.management-visual',-12]]){
   gsap.fromTo(selector,{yPercent:amount,scale:1.12},{yPercent:0,scale:1,ease:'none',scrollTrigger:link(trigger)});
  }
  const ribbon=document.querySelector('.ribbon-track');
  addLoop(gsap.to(ribbon,{x:()=>-(ribbon.scrollWidth+30)/2,duration:22,repeat:-1,ease:'none',paused:true}),document.querySelector('.project'));
  document.querySelectorAll('.capital-light').forEach(field=>{
   addLoop(gsap.fromTo(field.querySelectorAll('i'),{xPercent:-160,opacity:.25},{xPercent:160,opacity:.9,duration:4.5,stagger:.6,repeat:-1,yoyo:true,ease:'sine.inOut',paused:true}),field.closest('.investment-scenario'));
  });
  document.querySelectorAll('.panorama-window,.pool-window,.management-window').forEach(window=>{
   const section=window.closest('.project-panorama,.year-round-story,.management');
   gsap.from(window,{x:desktop?26:14,opacity:.55,duration:.75,ease:'power3.out',scrollTrigger:{trigger:window,start:'top 95%',once:true}});
   addLoop(gsap.to(window,{scale:1.025,duration:5,repeat:-1,yoyo:true,paused:true,ease:'sine.inOut'}),section);
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
