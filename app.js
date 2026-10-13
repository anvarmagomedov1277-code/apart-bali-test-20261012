import { siteConfig } from './data/site-config.js';
import { startMotion, motionIsReduced } from './motion.js?v=20261013-scenes9';
import { whatsappUrl } from './data/whatsapp.js';

const $ = selector => document.querySelector(selector);
const reducedMotion = motionIsReduced;
const navigation = $('#navigation-dialog'), planDialog = $('#plan-dialog'), sticky = $('.sticky-cta');
let currentApartment = siteConfig.apartments[0], transitionVersion = 0;
const planLoads=new Map();
function preparePlan(apartment){
 if(!planLoads.has(apartment.id)){
  const probe=new Image();probe.src=apartment.image;
  const loading=probe.decode();planLoads.set(apartment.id,loading);
  loading.catch(()=>{if(planLoads.get(apartment.id)===loading)planLoads.delete(apartment.id);});
 }
 return planLoads.get(apartment.id);
}
const planWarmup=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){siteConfig.apartments.forEach(apartment=>preparePlan(apartment).catch(()=>{}));planWarmup.disconnect();}},{rootMargin:'400px'});
planWarmup.observe($('#apartments'));
const stickyLink = sticky.querySelector('a');
const contexts = { home:'installments', project:'project', investment:'investment', apartments:'apartment', contact:'general' };
const sections = [...document.querySelectorAll('main > section')];
function updateContext() {
 const section = sections.find(item => { const r = item.getBoundingClientRect(); return r.top <= innerHeight * .5 && r.bottom > innerHeight * .5; }) || sections[0];
 stickyLink.dataset.waContext = contexts[section.id];
 stickyLink.href = whatsappUrl(contexts[section.id], currentApartment);
 stickyLink.querySelector('span').textContent = section.id === 'apartments' ? 'Получить расчёт ' + currentApartment.area + ' м²' : section.id === 'investment' ? 'Получить инвестиционный расчёт' : section.id === 'project' ? 'Получить презентацию комплекса' : 'Получить подробные условия';
}
let heroVisible = true, contactVisible = false;
function updateSticky() {
 const focused = ['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName);
 sticky.hidden = heroVisible || contactVisible || navigation.open || planDialog.open || focused;
}
for (const dialog of [navigation, planDialog]) {
 dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
 dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const r = dialog.getBoundingClientRect();
  if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
 });
 dialog.addEventListener('close', () => { document.body.style.overflow = ''; updateSticky(); });
}
function openDialog(dialog) { dialog.showModal(); document.body.style.overflow = 'hidden'; sticky.hidden = true; }
$('.menu-button').addEventListener('click', () => openDialog(navigation));
navigation.querySelectorAll('nav a').forEach(link => link.addEventListener('click', () => {
 navigation.close();
 const section = $(link.getAttribute('href'));
 section.tabIndex = -1; section.focus({ preventScroll:true });
}));
function refresh() { window.ScrollTrigger?.refresh(); }
function updateApartment(apartment) {
 const image = $('#apartment-image');
 const index = siteConfig.apartments.indexOf(apartment);
 image.src = apartment.image;
 image.alt = 'Планировка: ' + apartment.title.toLowerCase();
 $('#apartment-title').textContent = apartment.title;
 $('#apartment-description').textContent = apartment.description;
 $('#apartment-status').textContent = apartment.status;
 $('#apartment-features').replaceChildren(...apartment.features.map(text=>{const item=document.createElement('li');item.textContent=text;return item;}));
 $('#plan-position').textContent = (index + 1) + ' / ' + siteConfig.apartments.length;
 const indicator = $('.selector-indicator');
 const state = window.Flip && !reducedMotion() ? window.Flip.getState(indicator) : null;
 indicator.style.width = 100 / siteConfig.apartments.length + '%';
 indicator.style.left = index * 100 / siteConfig.apartments.length + '%';
 if (state) window.Flip.from(state, { duration:.55, ease:'expo.out', absolute:true });
 document.querySelectorAll('[data-apartment]').forEach(button => {
  const active = button.dataset.apartment === apartment.id;
  button.classList.toggle('is-active',active); button.setAttribute('aria-pressed',String(active));
 });
 currentApartment = apartment;
 $('#select-apartment').href = whatsappUrl('apartment', apartment);
 $('#select-apartment span').textContent = 'Получить расчёт ' + apartment.area + ' м²';
 updateContext(); refresh();
}
async function selectPlan(id, direction = 1) {
 const apartment = siteConfig.apartments.find(item => item.id === id);
 if (!apartment) return;
 const version = ++transitionVersion;
 if (currentApartment.id === id) { $('#apartment-status').textContent = currentApartment.status; return; }
 try { await preparePlan(apartment); } catch { if (version === transitionVersion) $('#apartment-status').textContent = 'Не удалось загрузить планировку. Попробуйте переключить ещё раз.'; return; }
 if (version !== transitionVersion) return;
 const image = $('#apartment-image');
 window.gsap?.killTweensOf(image);
 updateApartment(apartment);
 if (window.gsap && !reducedMotion()) {
  window.gsap.fromTo(image, { x:direction * 60, scale:.92, opacity:0 }, { x:0, scale:1, opacity:1, duration:.55, ease:'power3.out', clearProps:'transform,opacity' });
  const details=[...document.querySelectorAll('.apartment-info>h3,.apartment-info>p,#apartment-features>li')];
  window.gsap.killTweensOf(details);
  window.gsap.fromTo(details, { opacity:0, y:26 }, { opacity:1, y:0, duration:.4, stagger:.035, ease:'power3.out', overwrite:true, clearProps:'transform,opacity' });
 }
}
function cycle(direction) {
 const index = siteConfig.apartments.indexOf(currentApartment);
 selectPlan(siteConfig.apartments[(index + direction + siteConfig.apartments.length) % siteConfig.apartments.length].id,direction);
}
document.querySelectorAll('[data-apartment]').forEach(button => button.addEventListener('click',()=>selectPlan(button.dataset.apartment)));
$('.previous-plan').addEventListener('click',()=>cycle(-1));
$('.next-plan').addEventListener('click',()=>cycle(1));
$('.apartment-stage').addEventListener('keydown',event=>{
 if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
 event.preventDefault(); cycle(event.key === 'ArrowRight' ? 1 : -1);
});
let pointerStart = null;
$('.apartment-stage').addEventListener('pointerdown',event=>{ pointerStart = {x:event.clientX,y:event.clientY}; });
$('.apartment-stage').addEventListener('pointerup',event=>{
 if (!pointerStart || window.Draggable?.get($('.plan-drag'))) { pointerStart = null; return; }
 const dx=event.clientX-pointerStart.x, dy=event.clientY-pointerStart.y; pointerStart=null;
 if (Math.abs(dx)>45 && Math.abs(dx)>Math.abs(dy)*1.4) cycle(dx<0 ? 1 : -1);
});
$('.zoom-button').addEventListener('click',()=>{
 $('#plan-dialog-title').textContent=currentApartment.title;
 $('#plan-dialog-image').src=currentApartment.image;
 $('#plan-dialog-image').alt='Увеличенная планировка: '+currentApartment.title.toLowerCase();
 $('#plan-dialog-caption').textContent=currentApartment.status;
 openDialog(planDialog);
});
const observer=new IntersectionObserver(entries=>{
 for(const e of entries) { if(e.target.id==='home')heroVisible=e.isIntersecting; if(e.target.id==='contact')contactVisible=e.isIntersecting; }
 updateSticky();
},{threshold:0});
observer.observe($('#home')); observer.observe($('#contact'));
$('.apartment-stage').addEventListener('pointercancel',()=>{pointerStart=null;});
let scrollPending=false;
window.addEventListener('scroll',()=>{if(scrollPending)return;scrollPending=true;requestAnimationFrame(()=>{updateContext();scrollPending=false;});},{passive:true});
window.addEventListener('resize',updateContext);
updateContext();
document.addEventListener('focusin',updateSticky); document.addEventListener('focusout',()=>requestAnimationFrame(updateSticky));
function init() {
 if (window.gsap && window.Flip) window.gsap.registerPlugin(window.Flip);
 if (window.gsap && window.Draggable) {
  window.gsap.registerPlugin(window.Draggable);
  window.Draggable.create('.plan-drag',{type:'x',bounds:{minX:-80,maxX:80},edgeResistance:.75,allowNativeTouchScrolling:true,minimumMovement:8,
   onDragEnd(){const x=this.x;window.gsap.to(this.target,{x:0,duration:reducedMotion()?0:.35,ease:'expo.out'});if(Math.abs(x)>40)cycle(x<0?1:-1);}
  });
 }
 startMotion();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
