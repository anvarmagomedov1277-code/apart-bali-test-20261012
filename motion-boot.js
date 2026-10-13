// Before first paint; no-JS stays visible, and failed modules restore the fallback.
document.documentElement.dataset.motionBoot='waiting';
setTimeout(()=>document.documentElement.removeAttribute('data-motion-boot'),1800);
