// Element choreography: repeated entrances/exits, with a stable reading interval.
export function createDesktopMotion({gsap,ScrollTrigger,SplitText,desktop=true,reduced=false}){
 const root=document.documentElement,off=[],loops=[],sceneNodes=new Set(),heroScenes=new Map(),format=new Intl.NumberFormat('ru-RU');
 const listen=(node,type,handler,options)=>{node.addEventListener(type,handler,options);off.push(()=>node.removeEventListener(type,handler,options));};
 const link=(trigger,start='top bottom',end='bottom top',scrub=.25)=>({trigger,start,end,scrub});
 const addLoop=(loop,section)=>{loops.push({loop,section});ScrollTrigger.create({trigger:section,start:'top bottom',end:'bottom top',onToggle:syncLoops});return loop;};
 function scene(node,tl,name){
  sceneNodes.add(node);node.dataset.motionScene=name;
  if(node.closest('.hero'))heroScenes.set(node,tl);
  const play=()=>{node.dataset.motionRuns=String(Number(node.dataset.motionRuns||0)+1);tl.timeScale(1).restart();};
  const exit=()=>tl.timeScale(1.8).reverse();
  // The compact mobile picker is read as one panel, including its top and bottom.
  const trigger=(!desktop&&node.closest('#apartments'))||(node.classList.contains('zoom-button')&&node.closest('.apartment-stage'))||node;
  tl.scrollTrigger=ScrollTrigger.create({trigger,animation:tl,start:'top 85%',end:'bottom 10%',onEnter:play,onEnterBack:play,onLeave:exit,onLeaveBack:exit});
  const rect=trigger.getBoundingClientRect();if(rect.top<innerHeight*.85&&rect.bottom>innerHeight*.1&&!node.dataset.motionRuns)play();
  return tl;
 }
 function splitScene(node,type,name,from){
  if(!SplitText)return scene(node,gsap.timeline({paused:true}).fromTo(node,{y:reduced?0:42,opacity:.2},{y:0,opacity:1,duration:.6,ease:'power3.out'}),name);
  return SplitText.create(node,{type:'lines,words,chars',autoSplit:true,aria:'auto',onSplit(self){
   const targets=self[type],tl=gsap.timeline({paused:true});
   tl.fromTo(targets,reduced?{opacity:.3}:from,{x:0,y:0,rotation:0,scale:1,opacity:1,duration:reduced?.35:.52,stagger:{amount:reduced?.06:.14},ease:'power3.out'});
   return scene(node,tl,name);
  }});
 }
 root.dataset.desktopMotion=desktop?'active':'mobile';root.dataset.choreography='elements';
 const hero=document.querySelector('.hero'),brand=document.querySelector('.hero-brand'),letters=[...document.querySelectorAll('.desktop-wordmark>span')];
 const brandTargets=desktop?letters:brand;
 if(!reduced){
  const sunlight=document.querySelector('.hero-sunlight');
  const solar=addLoop(gsap.timeline({paused:true,repeat:-1}).fromTo(sunlight,{opacity:0,xPercent:-6,scale:.96},{opacity:.8,xPercent:0,scale:1,duration:2.2,ease:'sine.inOut'}).to(sunlight,{opacity:.3,xPercent:5,scale:1.08,duration:3.2,ease:'sine.inOut'}).to(sunlight,{opacity:0,xPercent:9,duration:1.8,ease:'sine.inOut'}).to({}, {duration:1.5}),hero);
  const intro=gsap.timeline({paused:true});
  intro.fromTo(brandTargets,{yPercent:desktop?130:240,opacity:.05,rotation:desktop?-2:0},{yPercent:0,opacity:1,rotation:0,duration:1.05,stagger:desktop?.1:0,ease:'power3.out'},.12);
  intro.fromTo('.hero-offer .button',{y:42,scale:.95,opacity:.3},{y:0,scale:1,opacity:1,duration:.55,ease:'power3.out'},.6);
  intro.fromTo('.hero-capital',{x:38,opacity:0},{x:0,opacity:1,duration:.6,ease:'power3.out'},.55);
  const replayHero=()=>{hero.dataset.motionRuns=String(Number(hero.dataset.motionRuns||0)+1);intro.restart();solar.restart();heroScenes.forEach((tl,node)=>{node.dataset.motionRuns=String(Number(node.dataset.motionRuns||0)+1);tl.timeScale(1).restart();});};
  hero.dataset.motionScene='facade-rise';sceneNodes.add(hero);
  ScrollTrigger.create({start:0,end:desktop?90:50,onEnterBack:replayHero});
  ScrollTrigger.create({trigger:hero,start:'top bottom',end:'bottom top',onLeave:()=>intro.pause(0)});
  if(scrollY<innerHeight*.5)replayHero();else intro.progress(1).pause();
  splitScene(document.querySelector('.hero-offer h2'),'words','offer-words',{y:64,x:16,rotation:3,opacity:0});
  splitScene(document.querySelector('.hero-description'),'lines','hero-lines',{y:35,opacity:0});
  splitScene(document.querySelector('.hero-investment'),'words','hero-investment',{x:-58,y:18,opacity:0});
  splitScene(document.querySelector('.hero-benefit'),'words','hero-benefit',{y:40,opacity:0});
  addLoop(gsap.to('.hero-scene',{y:-10,duration:6,repeat:-1,yoyo:true,ease:'sine.inOut',paused:true}),hero);
  addLoop(gsap.to('.scroll-hint svg',{y:8,duration:1.1,repeat:-1,yoyo:true,ease:'sine.inOut',paused:true}),hero);
  gsap.to('.hero-camera',{y:desktop?70:65,scale:1.08,ease:'none',scrollTrigger:link(hero,'top top','bottom top')});
  gsap.fromTo('.scroll-progress span',{scaleX:0},{scaleX:1,ease:'none',scrollTrigger:{start:0,end:'max',scrub:true}});
 }else gsap.set(brandTargets,{opacity:1,yPercent:0});
 document.querySelectorAll('.split-heading').forEach(heading=>{
  const block=heading.closest('#project,#investment,#apartments,#contact');
  let type='words',name='phrase-arrival',from={x:48,y:36,opacity:0};
  if(heading.closest('.year-round-copy')){name='season-pop';from={y:65,scale:1.15,rotation:4,opacity:0};}
  else if(heading.closest('.management-copy')){name='service-phrases';from={x:70,y:30,scale:.93,opacity:0};}
  else if(block?.id==='project'){type='chars';name='architecture-letters';from={x:i=>i%2?38:-38,y:48,rotation:i=>i%2?5:-5,opacity:0};}
  else if(block?.id==='investment'){type='lines';name='investment-lines';from={x:i=>i%2?90:-90,y:18,opacity:0};}
  else if(block?.id==='apartments'){type='chars';name='plan-letters';from={y:72,x:i=>i%3===0?-12:12,rotation:i=>i%2?5:-5,opacity:0};}
  else if(block?.id==='contact'){name='invitation-words';from={y:60,x:30,rotation:-3,opacity:0};}
  splitScene(heading,type,name,from);
 });
 document.querySelectorAll('.section-intro,.management-copy>p,.contact-heading>p,.territory-copy,.year-round-copy>p').forEach(copy=>splitScene(copy,'lines','copy-lines',{y:32,x:desktop?24:12,opacity:0}));
 document.querySelectorAll('.income-content,.fact-pair,.fact-area,.infrastructure-tags,.apartment-selector,.plan-navigation,.contact-direct').forEach(node=>{
  if(!reduced)scene(node,gsap.timeline({paused:true}).fromTo(node,{y:42,opacity:.2},{y:0,opacity:1,duration:.58,ease:'power3.out'}),'details-arrival');
 });
 document.querySelectorAll('.counter').forEach(counter=>{
  const value=Number(counter.dataset.value),state={value:reduced?value:0};counter.textContent=format.format(value);
  if(!reduced)gsap.to(state,{value,duration:.9,ease:'power3.out',onUpdate(){counter.textContent=format.format(Math.round(state.value));},scrollTrigger:{trigger:counter,start:'top 95%',once:true}});
 });
 if(!reduced){
  for(const [selector,trigger] of [['.panorama-image','.project-panorama'],['.pool-image','.year-round-story'],['.management-image','.management-visual']])gsap.fromTo(selector,{yPercent:-12,scale:1.12},{yPercent:0,scale:1,ease:'none',scrollTrigger:link(trigger)});
  const ribbon=document.querySelector('.ribbon-track'),gap=parseFloat(getComputedStyle(ribbon).gap)||30;
  addLoop(gsap.to(ribbon,{x:()=>-(ribbon.scrollWidth+gap)/2,duration:22,repeat:-1,ease:'none',paused:true}),document.querySelector('.project'));
  document.querySelectorAll('.capital-light').forEach(field=>addLoop(gsap.fromTo(field.querySelectorAll('i'),{xPercent:-160,opacity:.25},{xPercent:160,opacity:.9,duration:4.5,stagger:.6,repeat:-1,yoyo:true,ease:'sine.inOut',paused:true}),field.closest('.investment-scenario')));
  document.querySelectorAll('.panorama-window,.pool-window,.management-window').forEach((window,index)=>{
   scene(window,gsap.timeline({paused:true}).fromTo(window,{x:index%2?-65:65,opacity:.25,clipPath:'inset(8% 100% 8% 0)'},{x:0,opacity:1,clipPath:'inset(0% 0% 0% 0)',duration:.75,ease:'power3.out'}),'photo-unfold');
   addLoop(gsap.to(window,{scale:1.025,duration:5,repeat:-1,yoyo:true,paused:true,ease:'sine.inOut'}),window.closest('.project-panorama,.year-round-story,.management'));
  });
  const stage=document.querySelector('.apartment-stage');
  scene(stage,gsap.timeline({paused:true}).fromTo(stage,{y:70,scale:.88,opacity:0},{y:0,scale:1,opacity:1,duration:.7,ease:'power3.out'}),'plan-arrival');
 }
 const hover=matchMedia('(hover:hover) and (pointer:fine)');
 const controlObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>entry.target.classList.toggle('is-motion-visible',entry.isIntersecting));syncLoops();});
 off.push(()=>controlObserver.disconnect());
 document.querySelectorAll('.button,.text-link,.icon-button,.area-choice,.gallery-tile').forEach(control=>{
  control.dataset.motionControl='animated';
  if(!reduced&&!control.closest('.hero,.sticky-cta,dialog'))scene(control,gsap.timeline({paused:true}).fromTo(control,{y:26,opacity:.3},{y:0,opacity:1,duration:.5,ease:'power3.out'}),'control-arrival');
  let pressed=false;
  const enter=()=>{control.classList.add('is-motion-hover');if(!pressed)gsap.to(control,{scale:reduced?1:1.035,duration:.25,ease:'power2.out',overwrite:'auto'});};
  const leave=()=>{pressed=false;control.classList.remove('is-motion-hover');gsap.to(control,{scale:1,duration:.25,ease:'power2.out',overwrite:'auto'});};
  listen(control,'pointerenter',()=>{if(hover.matches)enter();});listen(control,'pointerleave',leave);listen(control,'focus',enter);listen(control,'blur',leave);
  listen(control,'pointerdown',()=>{pressed=true;gsap.to(control,{scale:reduced?1:.94,duration:.12,overwrite:'auto'});});
  listen(control,'pointerup',()=>{pressed=false;gsap.to(control,{scale:reduced?1:control.classList.contains('is-motion-hover')?1.035:1,duration:.2,overwrite:'auto'});});
  listen(control,'pointercancel',leave);
  listen(control,'keydown',event=>{if(event.key==='Enter'||event.key===' '){pressed=true;gsap.to(control,{scale:reduced?1:.94,duration:.1,overwrite:'auto'});}});listen(control,'keyup',event=>{if(event.key==='Enter'||event.key===' '){pressed=false;enter();}});
  controlObserver.observe(control);
  const arrow=control.querySelector(':scope>svg:last-child');
  if(arrow&&!reduced&&!control.closest('dialog')&&!control.classList.contains('zoom-button'))addLoop(gsap.to(arrow,{x:control.classList.contains('previous-plan')?-5:5,duration:1.1,repeat:-1,yoyo:true,ease:'sine.inOut',paused:true}),control);
  off.push(()=>{delete control.dataset.motionControl;control.classList.remove('is-motion-hover','is-motion-visible');gsap.killTweensOf(control);gsap.set(control,{clearProps:'transform,opacity'});});
 });
 if(!reduced)document.querySelectorAll('.split-heading,.hero-offer h2').forEach(heading=>{
  listen(heading,'pointerenter',()=>{if(!hover.matches||heading.getBoundingClientRect().top<0)return;gsap.to(heading,{color:heading.closest('.project,.apartments,.contact,.year-round-copy')?'#794628':'#f2ad85',duration:.25});});
  listen(heading,'pointerleave',()=>gsap.to(heading,{clearProps:'color',duration:.2}));
  off.push(()=>{gsap.killTweensOf(heading);gsap.set(heading,{clearProps:'color'});});
 });
 function syncLoops(){for(const {loop,section} of loops){const rect=section.getBoundingClientRect();if(!document.hidden&&rect.top<innerHeight&&rect.bottom>0)loop.play();else loop.pause();}}
 listen(document,'visibilitychange',syncLoops);syncLoops();
 return ()=>{off.reverse().forEach(dispose=>dispose());sceneNodes.forEach(node=>{delete node.dataset.motionScene;delete node.dataset.motionRuns;});root.dataset.desktopMotion='off';delete root.dataset.choreography;};
}
