// Full preview is an explicit site preference; it never changes operating-system settings.
const motionChoice=new URL(location.href).searchParams.get('motion');
let savedMotion=null;
try{
 if(motionChoice==='full')localStorage.setItem('bali-motion-preview','full');
 if(motionChoice==='system')localStorage.removeItem('bali-motion-preview');
 savedMotion=localStorage.getItem('bali-motion-preview');
}catch{}
if(motionChoice==='full'||(motionChoice!=='system'&&savedMotion==='full'))document.documentElement.dataset.motionOverride='full';
document.documentElement.dataset.motionPreference=document.documentElement.dataset.motionOverride==='full'?'explicit-full':'system';
// Before first paint; no-JS stays visible, and failed modules restore the fallback.
document.documentElement.dataset.motionBoot='waiting';
setTimeout(()=>document.documentElement.removeAttribute('data-motion-boot'),1800);
