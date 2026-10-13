import { createDesktopMotion } from './desktop-motion.js?v=20261013-facade6';

export function startMotion() {
 const root=document.documentElement,preference=matchMedia('(prefers-reduced-motion: reduce)');
 let context=null,effect=null,revision=0;
 async function apply(){
  const version=++revision;
  context?.revert();effect?.dispose();context=null;effect=null;
  root.dataset.motion=preference.matches?'reduced':'full';
  root.dataset.motionMode='automatic';
  if(!window.gsap||!window.ScrollTrigger)return;
  const {gsap,ScrollTrigger,SplitText}=window;
  gsap.registerPlugin(ScrollTrigger);if(SplitText)gsap.registerPlugin(SplitText);
  ScrollTrigger.config({ignoreMobileResize:true});
  await document.fonts.ready;if(version!==revision)return;
  context=gsap.matchMedia();
  context.add({desktop:'(min-width:768px)',mobile:'(max-width:767px)'},media=>createDesktopMotion({gsap,ScrollTrigger,SplitText,desktop:media.conditions.desktop,reduced:preference.matches}));
  ScrollTrigger.refresh();
  if(preference.matches){root.dataset.fx='reduced';return;}
  try{
   const {createLightField}=await import('./fx.js?v=20261013-facade6');
   const result=await createLightField({active:()=>version===revision&&root.dataset.motion==='full',layer:document.querySelector('#fx-layer')});
   if(version!==revision){result?.dispose();return;}effect=result;
  }catch{root.dataset.fx='fallback';}
 }
 preference.addEventListener('change',apply);
 document.querySelectorAll('img').forEach(img=>img.addEventListener('load',()=>window.ScrollTrigger?.refresh(),{once:true}));
 apply();
}
