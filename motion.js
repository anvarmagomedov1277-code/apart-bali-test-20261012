export function startMotion() {
 const root=document.documentElement, button=document.querySelector('.motion-toggle');
 const preference=matchMedia('(prefers-reduced-motion: reduce)');
 let context=null, effect=null, manualPause=false, revision=0;
 const counters=[...document.querySelectorAll('.counter')];
 const format=new Intl.NumberFormat('ru-RU');
 function stop() {
  revision++;
  context?.revert(); context=null;
  effect?.dispose(); effect=null;
  counters.forEach(el=>el.textContent=format.format(Number(el.dataset.value)));
 }
 async function apply() {
  stop();
  const disabled=preference.matches||manualPause;
  root.dataset.motion=disabled?'paused':'full';
  button.setAttribute('aria-pressed',String(disabled));
  button.setAttribute('aria-label',disabled?'Включить анимацию':'Отключить анимацию');
  if(disabled||!window.gsap||!window.ScrollTrigger)return;
  const {gsap,ScrollTrigger,SplitText}=window;
  gsap.registerPlugin(ScrollTrigger); if(SplitText)gsap.registerPlugin(SplitText);
  ScrollTrigger.config({ignoreMobileResize:true});
  const version=revision;
  await document.fonts.ready;
  if(root.dataset.motion==='paused'||version!==revision)return;
  context=gsap.context(()=>{
   const intro=gsap.timeline({defaults:{ease:'expo.out'}});
   intro.from('.hero-brand',{opacity:.1,duration:1.3})
    .from('.hero-description',{y:16,opacity:.35,duration:.8},'-=.8')
    .from('.hero-offer h2',{opacity:.3,duration:.8},'-=.6');
   gsap.to('.hero-camera',{y:125,scale:1.22,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:.7}});
   gsap.to('.hero-brand',{y:-145,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:.7}});
   gsap.to('.hero-investment',{x:-85,y:-50,opacity:.2,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'55% top',scrub:.5}});
   gsap.fromTo('.scroll-progress span',{scaleX:0},{scaleX:1,ease:'none',scrollTrigger:{start:0,end:'max',scrub:.15}});
   gsap.to('.hero-offer h2',{x:-38,y:-45,ease:'none',scrollTrigger:{trigger:'.hero-offer',start:'top 50%',end:'bottom top',scrub:.3}});
   document.querySelectorAll('.section-intro,.management>p,.contact-heading>p').forEach((paragraph,index)=>{
    gsap.fromTo(paragraph,{y:65,x:index%2?20:-20},{y:-30,x:index%2?-12:12,ease:'none',scrollTrigger:{trigger:paragraph,start:'top bottom',end:'bottom top',scrub:.3}});
   });
   document.querySelectorAll('.resale-story>p:not(.resale-number)').forEach(paragraph=>{
    gsap.fromTo(paragraph,{x:12},{x:-8,ease:'none',scrollTrigger:{trigger:paragraph,start:'top bottom',end:'bottom top',scrub:.3}});
   });
   document.querySelectorAll('.fact-main,.fact-pair,.fact-area').forEach((row,index)=>{
    gsap.fromTo(row,{x:index%2?-18:18,y:35},{x:index%2?10:-10,y:-20,ease:'none',scrollTrigger:{trigger:row,start:'top bottom',end:'bottom top',scrub:.35}});
   });
   gsap.fromTo('.income-content',{y:55,scale:.84},{y:-45,scale:1.08,ease:'none',scrollTrigger:{trigger:'.income-stage',start:'top bottom',end:'bottom top',scrub:.4}});
   document.querySelectorAll('.split-heading').forEach(heading=>{
    gsap.fromTo(heading,{x:18,y:24},{x:-18,y:-18,ease:'none',scrollTrigger:{trigger:heading,start:'top bottom',end:'bottom top',scrub:.3}});
    if(!SplitText)return;
    SplitText.create(heading,{type:'words,chars',mask:'words',aria:'auto',onSplit(self){
     const sequence=gsap.timeline({scrollTrigger:{trigger:heading,start:'top 96%',end:'bottom 12%',scrub:.3}});
     sequence.from(self.chars,{yPercent:125,opacity:.15,stagger:.012,duration:1,ease:'power2.out'})
      .to(self.chars,{opacity:.65,stagger:.006,duration:.55,ease:'none'},'+=.9');
     return sequence;
    }});
   });
   gsap.fromTo('.panorama-image',{yPercent:-20,scale:1.3},{yPercent:0,scale:1,ease:'none',scrollTrigger:{trigger:'.project-panorama',start:'top bottom',end:'bottom top',scrub:.7}});
   gsap.fromTo('.panorama-window',{borderTopLeftRadius:100},{borderTopLeftRadius:0,ease:'none',scrollTrigger:{trigger:'.project-panorama',start:'top 95%',end:'top 25%',scrub:.5}});
   counters.forEach(el=>{
    const value=Number(el.dataset.value),state={value:value*.48};
    gsap.to(state,{value,duration:1.6,ease:'power3.out',onUpdate(){el.textContent=format.format(Math.round(state.value));},scrollTrigger:{trigger:el,start:'top 90%',once:true}});
   });
   gsap.to('.ribbon-track',{xPercent:-40,ease:'none',scrollTrigger:{trigger:'.project',start:'top bottom',end:'bottom top',scrub:.7}});
   gsap.fromTo('.capital-orbits g',{rotation:-25,scale:.72},{rotation:35,scale:1.1,ease:'none',scrollTrigger:{trigger:'.income-stage',start:'top bottom',end:'bottom top',scrub:.65}});
   document.querySelectorAll('.capital-orbits ellipse,.capital-orbits path').forEach(path=>{
    const length=path.getTotalLength();
    gsap.fromTo(path,{strokeDasharray:length,strokeDashoffset:length*.8},{strokeDashoffset:0,ease:'none',scrollTrigger:{trigger:'.income-stage',start:'top 95%',end:'bottom 35%',scrub:.7}});
   });
   gsap.fromTo('.resale-number',{x:-80,rotation:-6,scale:.8},{x:12,rotation:2,scale:1.05,ease:'none',scrollTrigger:{trigger:'.resale-story',start:'top bottom',end:'bottom 15%',scrub:.4}});
   gsap.fromTo('.pool-image',{yPercent:-20,scale:1.25},{yPercent:0,scale:1,ease:'none',scrollTrigger:{trigger:'.year-round-story',start:'top bottom',end:'bottom top',scrub:.7}});
   gsap.fromTo('.year-round-copy',{x:35,y:25},{x:0,y:0,ease:'none',scrollTrigger:{trigger:'.year-round-copy',start:'top 95%',end:'top 40%',scrub:.55}});
   gsap.to('.plan-halo',{rotation:60,scale:1.25,ease:'none',scrollTrigger:{trigger:'.apartment-stage',start:'top bottom',end:'bottom top',scrub:.5}});
   gsap.fromTo('.management-symbol',{rotation:-80,scale:.6,y:25},{rotation:40,scale:1.2,y:-15,ease:'none',scrollTrigger:{trigger:'.management',start:'top bottom',end:'bottom top',scrub:.4}});
   const pulses=gsap.timeline({repeat:-1,repeatDelay:2.2,paused:true});
   pulses.to('.hero-offer .button svg',{x:6,duration:.5,ease:'power2.inOut'}).to('.hero-offer .button svg',{x:0,duration:.5,ease:'power2.inOut'});
   ScrollTrigger.create({trigger:'.hero',start:'top bottom',end:'bottom top',onToggle:self=>self.isActive?pulses.play():pulses.pause()});
  });
  ScrollTrigger.refresh();
  try {
   const {createLightField}=await import('./fx.js');
   const result=await createLightField({active:()=>root.dataset.motion==='full'&&version===revision,layer:document.querySelector('#fx-layer')});
   if(version!==revision){result?.dispose();return;}
   effect=result;
  } catch { root.dataset.fx='fallback'; }
 }
 button.addEventListener('click',()=>{manualPause=!manualPause;apply();});
 preference.addEventListener('change',apply);
 document.querySelectorAll('img').forEach(image=>image.addEventListener('load',()=>window.ScrollTrigger?.refresh(),{once:true}));
 apply();
}
