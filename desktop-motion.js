// Desktop choreography. Created inside GSAP matchMedia; its returned cleanup owns events.
export function createDesktopMotion({gsap,ScrollTrigger,SplitText}) {
 const root=document.documentElement,off=[],loops=[],format=new Intl.NumberFormat('ru-RU');
 const hover=matchMedia('(hover: hover) and (pointer: fine)');
 const listen=(node,type,handler,options)=>{node.addEventListener(type,handler,options);off.push(()=>node.removeEventListener(type,handler,options));};
 const link=(trigger,start='top bottom',end='bottom top',scrub=.35)=>({trigger,start,end,scrub});
 const letters=[...document.querySelectorAll('.desktop-wordmark>span')];
 root.dataset.desktopMotion='active';
 const intro=gsap.timeline({defaults:{ease:'expo.out'}});
 intro.from(letters,{yPercent:95,rotationX:-45,opacity:.05,duration:1.15,stagger:.08})
  .from('.hero-description',{y:28,opacity:.25,duration:.8},'-=.7')
  .from('.hero-offer',{y:25,opacity:.35,duration:.9},'-=.6');
 gsap.to('.hero-camera',{y:155,scale:1.16,ease:'none',scrollTrigger:link('.hero','top top','bottom top',.45)});
 letters.forEach((letter,index)=>gsap.to(letter,{y:-80-index*20,rotation:index%2?2:-2,ease:'none',scrollTrigger:link('.hero','top top','bottom top',.4)}));
 gsap.to('.hero-description',{y:-65,ease:'none',scrollTrigger:link('.hero','top top','bottom top')});
 gsap.to('.hero-investment',{x:-85,y:-70,ease:'none',scrollTrigger:link('.hero','top top','bottom top')});
 gsap.to('.hero-capital',{x:22,opacity:.5,ease:'none',scrollTrigger:link('.hero','top top','bottom top')});
 gsap.fromTo('.scroll-progress span',{scaleX:0},{scaleX:1,ease:'none',scrollTrigger:{start:0,end:'max',scrub:.15}});

 document.querySelectorAll('.split-heading,.hero-offer h2').forEach((heading,index)=>{
  gsap.fromTo(heading,{x:index%2?-25:25},{x:index%2?15:-15,ease:'none',scrollTrigger:link(heading)});
  if(!SplitText)return;
  SplitText.create(heading,{type:'lines,words,chars',mask:'lines',autoSplit:true,aria:'auto',onSplit(self){
   self.lines.forEach(line=>line.parentElement.classList.add('desktop-text-mask'));
   const sequence=gsap.timeline({scrollTrigger:link(heading,'top 96%','bottom 8%',.3)});
   sequence.from(self.chars,{yPercent:100,rotationX:-30,opacity:.25,stagger:{amount:.32},duration:.9,ease:'power2.out'})
    .to(self.chars,{opacity:.75,duration:.3},'+=1.1');
   return sequence;
  }});
 });
 document.querySelectorAll('.section-intro,.management-copy>p,.contact-heading>p,.territory-copy').forEach((copy,index)=>{
  gsap.fromTo(copy,{y:35,x:index%2?24:-24},{y:-28,x:index%2?-14:14,ease:'none',scrollTrigger:link(copy)});
 });
 document.querySelectorAll('.fact-main,.fact-pair,.fact-area').forEach((fact,index)=>{
  gsap.fromTo(fact,{x:index%2?-40:40,opacity:.55},{x:0,opacity:1,ease:'none',scrollTrigger:link(fact,'top 95%','top 40%')});
 });
 gsap.fromTo('.panorama-image',{yPercent:-22,scale:1.28},{yPercent:0,scale:1,ease:'none',scrollTrigger:link('.project-panorama')});
 gsap.to('.ribbon-track',{xPercent:-42,ease:'none',scrollTrigger:link('.project')});
 document.querySelectorAll('.counter').forEach(counter=>{
  const state={value:Number(counter.dataset.value)*.45};
  gsap.to(state,{value:Number(counter.dataset.value),duration:1.3,ease:'power3.out',onUpdate(){counter.textContent=format.format(Math.round(state.value));},scrollTrigger:{trigger:counter,start:'top 92%',once:true}});
 });
 document.querySelectorAll('.investment-scenario').forEach((stage,index)=>{
  gsap.fromTo(stage.querySelector('.income-content'),{y:50,scale:.83},{y:-35,scale:1.08,ease:'none',scrollTrigger:link(stage)});
  gsap.fromTo(stage.querySelector('.capital-orbits g'),{rotation:index?-40:35,scale:.78},{rotation:index?45:-40,scale:1.12,ease:'none',scrollTrigger:link(stage)});
  stage.querySelectorAll('ellipse,path').forEach(path=>{const length=path.getTotalLength();gsap.fromTo(path,{strokeDasharray:length,strokeDashoffset:length*.8},{strokeDashoffset:0,ease:'none',scrollTrigger:link(stage,'top 98%','bottom 30%')});});
 });
 gsap.fromTo('.scenario-or',{scale:.65,opacity:.25},{scale:1.15,opacity:1,ease:'none',scrollTrigger:link('.investment-scenarios')});
 gsap.fromTo('.pool-image',{yPercent:-22,scale:1.2},{yPercent:0,scale:1,ease:'none',scrollTrigger:link('.year-round-story')});
 gsap.fromTo('.year-round-copy',{x:65},{x:-12,ease:'none',scrollTrigger:link('.year-round-story')});
 gsap.fromTo('.management-image',{yPercent:-20,scale:1.22},{yPercent:0,scale:1,ease:'none',scrollTrigger:link('.management')});
 gsap.fromTo('.management-symbol',{rotation:-65,scale:.65},{rotation:35,scale:1.2,ease:'none',scrollTrigger:link('.management')});
 gsap.fromTo('.plan-halo',{rotation:-40,scale:.85},{rotation:85,scale:1.2,ease:'none',scrollTrigger:link('.apartments')});
 gsap.fromTo('.contact-direct',{x:35},{x:-18,ease:'none',scrollTrigger:link('.contact')});
 gsap.fromTo('.site-footer .brand',{y:30},{y:-20,ease:'none',scrollTrigger:link('.site-footer','top bottom','bottom bottom')});

 // Independent graphics keep each visible section alive even after the entrance has finished.
 document.querySelectorAll('main>section').forEach((section,index)=>{
  const field=document.createElement('div');field.className='desktop-graphic';field.setAttribute('aria-hidden','true');
  field.innerHTML='<span></span><span></span><span></span>';section.appendChild(field);off.push(()=>field.remove());
  gsap.fromTo(field,{xPercent:index%2?-15:15,yPercent:30,rotation:-15},{xPercent:index%2?15:-15,yPercent:-25,rotation:25,ease:'none',scrollTrigger:link(section)});
  const loop=gsap.timeline({repeat:-1,yoyo:true,paused:true}).to(field.querySelectorAll('span'),{rotation:index%2?22:-22,scale:1.1,duration:6,stagger:.4,ease:'sine.inOut'});
  loops.push({loop,section});
  ScrollTrigger.create({trigger:section,start:'top bottom',end:'bottom top',onToggle(){syncLoops();}});
 });
 function syncLoops(){for(const {loop,section} of loops){const rect=section.getBoundingClientRect();if(!document.hidden&&rect.top<innerHeight&&rect.bottom>0)loop.play();else loop.pause();}}
 listen(document,'visibilitychange',syncLoops);syncLoops();

 // Hover never moves the clickable target: only its label/icon and an optical light pass.
 document.querySelectorAll('a,button').forEach(control=>{
  if(control.classList.contains('skip-link')||control.classList.contains('motion-toggle'))return;
  const moving=[...control.querySelectorAll(':scope>span,:scope>svg')].filter(el=>!el.classList.contains('selector-indicator'));
  if(!moving.length&&control.children.length===0){const label=document.createElement('span');label.className='desktop-control-label';while(control.firstChild)label.appendChild(control.firstChild);control.appendChild(label);moving.push(label);off.push(()=>{while(label.firstChild)control.insertBefore(label.firstChild,label);label.remove();});}
  const settle=()=>{control.classList.remove('is-motion-hover');gsap.to(moving,{x:0,y:0,rotation:0,scale:1,duration:.25,ease:'power3.out',overwrite:true});};
  const enter=()=>{if(!hover.matches)return;control.classList.add('is-motion-hover');gsap.to(moving,{x:4,y:-2,duration:.25,ease:'power3.out',overwrite:true});};
  const move=event=>{if(!hover.matches)return;const rect=control.getBoundingClientRect();const x=(event.clientX-rect.left)/rect.width-.5,y=(event.clientY-rect.top)/rect.height-.5;for(const el of moving){const quick=pointerTweens.get(el);quick?.x(x*12);quick?.y(y*7);}};
  const pointerTweens=new Map(moving.map(el=>[el,{x:gsap.quickTo(el,'x',{duration:.22,ease:'power3.out'}),y:gsap.quickTo(el,'y',{duration:.22,ease:'power3.out'})}]));
  listen(control,'pointerenter',enter);listen(control,'pointermove',move);listen(control,'pointerleave',settle);listen(control,'focus',enter);listen(control,'blur',settle);
  listen(control,'pointerdown',()=>gsap.to(moving,{scale:.92,duration:.12,overwrite:'auto'}));
  listen(control,'pointerup',()=>gsap.to(moving,{scale:1,duration:.2,overwrite:'auto'}));
  listen(control,'click',()=>{gsap.fromTo(moving,{rotation:-3},{rotation:0,duration:.3,ease:'expo.out',overwrite:'auto'});});
  off.push(()=>{control.classList.remove('is-motion-hover');gsap.killTweensOf(moving);gsap.set(moving,{clearProps:'transform'});});
 });
 document.querySelectorAll('h2,h3,.desktop-wordmark').forEach(heading=>{
  let current=[];
  const enter=()=>{if(!hover.matches)return;current=[...heading.querySelectorAll('div')].filter(el=>el.children.length===0&&el.textContent.trim()) ;if(heading.matches('.desktop-wordmark'))current=[...heading.children];
   gsap.to(current,{y:-5,rotation:2,color:'#eadcb5',stagger:{amount:.15},duration:.3,ease:'power3.out',overwrite:'auto'});
  };
  const leave=()=>gsap.to(current,{y:0,rotation:0,color:'',duration:.3,ease:'power3.out',overwrite:'auto'});
  listen(heading,'pointerenter',enter);listen(heading,'pointerleave',leave);
  off.push(()=>{gsap.killTweensOf(current);gsap.set(current,{clearProps:'color,transform'});});
 });
 return ()=>{off.reverse().forEach(dispose=>dispose());root.dataset.desktopMotion='off';};
}
