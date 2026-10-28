import { createDesktopMotion } from './desktop-motion.js?v=20261028-mobile1';

export const motionIsReduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches&&document.documentElement.dataset.motionOverride!=='full';

export function startMotion() {
 const root=document.documentElement,preference=matchMedia('(prefers-reduced-motion: reduce)');
 const fields=[...document.querySelectorAll('.ambient-field')],visible=new Set();
 const syncAmbient=()=>{root.dataset.pageVisibility=document.hidden?'hidden':'visible';fields.forEach(field=>field.classList.toggle('is-paused',document.hidden||!visible.has(field)));};
 const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)visible.add(entry.target);else visible.delete(entry.target);});syncAmbient();});
 fields.forEach(field=>{field.classList.add('is-paused');observer.observe(field);});
 document.addEventListener('visibilitychange',syncAmbient);
 let context=null,effect=null,revision=0;
 async function apply(){
  const version=++revision;
  context?.revert();effect?.dispose();context=null;effect=null;
  const reduced=motionIsReduced();
  root.dataset.motion=reduced?'reduced':'full';
  root.dataset.motionMode='automatic';
  if(!window.gsap||!window.ScrollTrigger){delete root.dataset.motionBoot;return;}
  const {gsap,ScrollTrigger,SplitText}=window;
  gsap.registerPlugin(ScrollTrigger);if(SplitText)gsap.registerPlugin(SplitText);
  ScrollTrigger.config({ignoreMobileResize:true});
  await document.fonts.ready;if(version!==revision)return;
  delete root.dataset.motionBoot;
  context=gsap.matchMedia();
  context.add({desktop:'(min-width:768px)',mobile:'(max-width:767px)'},media=>createDesktopMotion({gsap,ScrollTrigger,SplitText,desktop:media.conditions.desktop,reduced}));
  ScrollTrigger.refresh();
  if(reduced){root.dataset.fx='reduced';return;}
  try{
   const {createLightField}=await import('./fx.js?v=20261028-mobile1');
   const result=await createLightField({active:()=>version===revision&&root.dataset.motion==='full',layer:document.querySelector('#fx-layer')});
   if(version!==revision){result?.dispose();return;}effect=result;
  }catch{root.dataset.fx='fallback';}
 }
 preference.addEventListener('change',apply);
 document.querySelectorAll('img').forEach(img=>img.addEventListener('load',()=>window.ScrollTrigger?.refresh(),{once:true}));
 apply();
}
