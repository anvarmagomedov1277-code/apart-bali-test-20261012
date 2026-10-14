import { siteConfig } from './data/site-config.js?v=20261014-media14';
import { startMotion, motionIsReduced } from './motion.js?v=20261014-media14';
import { whatsappUrl } from './data/whatsapp.js?v=20261014-media14';
import { apartmentPrices, formatMoney } from './data/pricing.js?v=20261014-media14';

const $ = selector => document.querySelector(selector);
const reducedMotion = motionIsReduced;
const navigation = $('#navigation-dialog'), planDialog = $('#plan-dialog'), sticky = $('.sticky-cta');
const galleryDialog=$('#gallery-dialog'), leadDialog=$('#lead-dialog'), desktopCapture=matchMedia('(min-width:768px)');
const dialogs=[navigation,planDialog,galleryDialog,leadDialog];
let currentApartment = siteConfig.apartments[0], transitionVersion = 0;
let requestedPlanId=currentApartment.id;
const planLoads=new Map();
function preparePlan(apartment){
 if(!planLoads.has(apartment.id)){
  const probe=new Image();probe.src=apartment.image;
  const loading=probe.decode();planLoads.set(apartment.id,loading);
  loading.catch(()=>{if(planLoads.get(apartment.id)===loading)planLoads.delete(apartment.id);});
 }
 return planLoads.get(apartment.id);
}
function warmNeighbors(){const index=siteConfig.apartments.indexOf(currentApartment);[0,-1,1].forEach(offset=>preparePlan(siteConfig.apartments[(index+offset+siteConfig.apartments.length)%siteConfig.apartments.length]).catch(()=>{}));}
const planWarmup=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){warmNeighbors();planWarmup.disconnect();}},{rootMargin:'400px'});
planWarmup.observe($('#apartments'));
const stickyLink = sticky.querySelector('a');
const contexts = { home:'installments', project:'project', gallery:'project', investment:'investment', apartments:'apartment', contact:'general' };
const sections = [...document.querySelectorAll('main > section')];
function updateContext() {
 const section = sections.find(item => { const r = item.getBoundingClientRect(); return r.top <= innerHeight * .5 && r.bottom > innerHeight * .5; }) || sections[0];
 stickyLink.dataset.waContext = contexts[section.id];
 stickyLink.href = whatsappUrl(contexts[section.id], currentApartment);
 stickyLink.querySelector('span').textContent = section.id === 'apartments' ? 'Получить расчёт ' + currentApartment.area + ' м²' : section.id === 'investment' ? 'Получить инвестиционный расчёт' : ['project','gallery'].includes(section.id) ? 'Получить презентацию комплекса' : 'Получить подробные условия';
}
let heroVisible = true, contactVisible = false;
function updateSticky() {
 const focused = ['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName);
 sticky.hidden = heroVisible || contactVisible || dialogs.some(dialog=>dialog.open) || focused;
}
for (const dialog of dialogs) {
 dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
 dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const r = dialog.getBoundingClientRect();
  if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
 });
 dialog.addEventListener('close', () => { document.body.style.overflow = ''; updateSticky(); });
}
function openDialog(dialog) { dialog.showModal(); document.body.style.overflow = 'hidden'; sticky.hidden = true;
 if(window.gsap&&!reducedMotion())window.gsap.fromTo(dialog.querySelectorAll('.dialog-top,.lead-content,.gallery-full,.gallery-dialog-bottom'),{y:18,opacity:0},{y:0,opacity:1,duration:.4,stagger:.04,clearProps:'transform,opacity',overwrite:true});
}
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
 image.width=apartment.width;image.height=apartment.height;
 image.alt = 'Планировка: ' + apartment.title.toLowerCase();
 $('#apartment-title').textContent = apartment.title;
 $('#apartment-description').textContent = apartment.description;
 $('#apartment-status').textContent = apartment.status;
 $('#apartment-features').replaceChildren(...apartment.features.map(text=>{const item=document.createElement('li');item.textContent=text;return item;}));
 $('#plan-position').textContent = (index + 1) + ' / ' + siteConfig.apartments.length;
 document.querySelectorAll('[data-apartment]').forEach(button => {
  const active = button.dataset.apartment === apartment.id;
  button.classList.toggle('is-active',active); button.setAttribute('aria-pressed',String(active));
 });
 currentApartment = apartment;
 const activeChoice=document.querySelector('[data-apartment="'+apartment.id+'"]'),rail=$('.apartment-selector');
 rail.scrollTo({left:Math.max(0,activeChoice.offsetLeft-rail.clientWidth/2+activeChoice.offsetWidth/2),behavior:reducedMotion()?'instant':'smooth'});
 const prices=apartmentPrices(apartment);
 $('#cash-price').textContent=prices?formatMoney(prices.cash):'Уточняется';
 $('#installment-price').textContent=prices?formatMoney(prices.installments):'Уточняется';
 $('#select-apartment').href = whatsappUrl('apartment', apartment);
 $('#select-apartment span').textContent = 'Получить расчёт ' + apartment.area + ' м²';
 updateContext(); refresh();
 warmNeighbors();
}
async function selectPlan(id, direction = 1) {
 const apartment = siteConfig.apartments.find(item => item.id === id);
 if (!apartment) return;
 requestedPlanId=id;
 const version = ++transitionVersion;
 if (currentApartment.id === id) { $('#apartment-status').textContent = currentApartment.status; return; }
 try { await preparePlan(apartment); } catch { if (version === transitionVersion) {requestedPlanId=currentApartment.id;$('#apartment-status').textContent = 'Не удалось загрузить планировку. Попробуйте переключить ещё раз.';} return; }
 if (version !== transitionVersion) return;
 const image = $('#apartment-image');
 window.gsap?.killTweensOf(image);
 updateApartment(apartment);
 if (window.gsap && !reducedMotion()) {
  window.gsap.fromTo(image, { x:direction * 60, scale:.92, opacity:0 }, { x:0, scale:1, opacity:1, duration:.55, ease:'power3.out', clearProps:'transform,opacity' });
  const details=[...document.querySelectorAll('.apartment-info>h3,.apartment-info>p,#apartment-features>li,.price-option')];
  window.gsap.killTweensOf(details);
  window.gsap.fromTo(details, { opacity:0, y:26 }, { opacity:1, y:0, duration:.4, stagger:.035, ease:'power3.out', overwrite:true, clearProps:'transform,opacity' });
 }
}
function cycle(direction) {
 const index = siteConfig.apartments.findIndex(plan=>plan.id===requestedPlanId);
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
 $('#plan-dialog-image').width=currentApartment.width;$('#plan-dialog-image').height=currentApartment.height;
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

// Desktop uses a local form preview; mobile follows the existing native WhatsApp href.
const leadTitles={installments:'Дубайская рассрочка',project:'Презентация комплекса',investment:'Инвестиционный расчёт',apartment:'Расчёт апартамента',general:'Персональное предложение'};
function configureCapture(){document.querySelectorAll('[data-wa-context]').forEach(link=>{
 if(desktopCapture.matches){link.setAttribute('aria-haspopup','dialog');link.setAttribute('aria-controls','lead-dialog');}
 else{link.removeAttribute('aria-haspopup');link.removeAttribute('aria-controls');}
});if(!desktopCapture.matches&&leadDialog.open)leadDialog.close();}
document.querySelectorAll('[data-wa-context]').forEach(link=>link.addEventListener('click',event=>{
 if(!desktopCapture.matches||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
 event.preventDefault();const context=link.dataset.waContext;
 $('#lead-title').textContent=leadTitles[context]||leadTitles.general;
 const prices=apartmentPrices(currentApartment);
 $('#lead-description').textContent=context==='apartment'?currentApartment.title+'. Полная оплата — '+formatMoney(prices.cash)+'; дубайская рассрочка — '+formatMoney(prices.installments)+'.':'Укажите имя и номер телефона для выбранного предложения.';
 leadDialog.dataset.context=context;openDialog(leadDialog);$('#lead-name').focus({preventScroll:true});
}));
desktopCapture.addEventListener('change',configureCapture);configureCapture();
const leadForm=$('#lead-form');
function clearLeadErrors(){for(const field of ['name','phone']){$('#lead-'+field+'-error').textContent='';$('#lead-'+field).removeAttribute('aria-invalid');}$('#lead-status').textContent='';}
leadDialog.addEventListener('close',()=>{leadForm.reset();clearLeadErrors();delete leadDialog.dataset.context;});
leadForm.addEventListener('input',clearLeadErrors);
leadForm.addEventListener('submit',event=>{
 event.preventDefault();clearLeadErrors();let firstInvalid=null;
 const invalidate=(field,message)=>{$('#lead-'+field+'-error').textContent=message;$('#lead-'+field).setAttribute('aria-invalid','true');firstInvalid||=$('#lead-'+field);};
 if(!$('#lead-name').value.trim())invalidate('name','Укажите ваше имя.');
 const phone=$('#lead-phone').value.trim(),digits=phone.replace(/\D/g,'');
 if(!/^[+\d\s().-]+$/.test(phone)||digits.length<10||digits.length>15)invalidate('phone','Введите номер телефона с кодом страны, от 10 до 15 цифр.');
 if(firstInvalid){firstInvalid.focus();return;}
 $('#lead-status').textContent='Данные заполнены корректно. Отправка пока не подключена — заявка не отправлена. Для связи позвоните по номеру ниже.';
});

// Full-resolution gallery, with a version guard against rapid navigation.
let galleryIndex=0,galleryVersion=0;
async function showGallery(index){
 galleryIndex=(index+siteConfig.gallery.length)%siteConfig.gallery.length;const item=siteConfig.gallery[galleryIndex],version=++galleryVersion;
 $('#gallery-dialog-title').textContent=item.title;$('#gallery-dialog-caption').textContent=item.caption;$('#gallery-position').textContent=(galleryIndex+1)+' / '+siteConfig.gallery.length;
 const image=$('#gallery-dialog-image');image.hidden=true;$('#gallery-load-status').textContent='Загружаем оригинал…';
 const probe=new Image();probe.src='assets/media/'+item.id+'.webp';
 try{await probe.decode();if(version!==galleryVersion||!galleryDialog.open)return;
  image.src=probe.src;image.width=item.width;image.height=item.height;image.alt=item.caption;image.hidden=false;$('#gallery-load-status').textContent='';
  if(window.gsap&&!reducedMotion())window.gsap.fromTo(image,{opacity:0,scale:.97},{opacity:1,scale:1,duration:.4,clearProps:'transform,opacity',overwrite:true});
 }catch{if(version===galleryVersion)$('#gallery-load-status').textContent='Не удалось загрузить изображение. Переключите ракурс или попробуйте ещё раз.';}
}
document.querySelectorAll('[data-gallery]').forEach(button=>button.addEventListener('click',()=>{openDialog(galleryDialog);showGallery(Number(button.dataset.gallery));}));
$('.gallery-prev').addEventListener('click',()=>showGallery(galleryIndex-1));$('.gallery-next').addEventListener('click',()=>showGallery(galleryIndex+1));
galleryDialog.addEventListener('close',()=>{galleryVersion++;$('#gallery-load-status').textContent='';});
galleryDialog.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();showGallery(galleryIndex+(event.key==='ArrowRight'?1:-1));}});
const galleryRail=$('.gallery-rail');
function scrollGallery(direction){galleryRail.scrollBy({left:direction*(galleryRail.querySelector('button').offsetWidth+20),behavior:reducedMotion()?'instant':'smooth'});}
$('.gallery-scroll-prev').addEventListener('click',()=>scrollGallery(-1));$('.gallery-scroll-next').addEventListener('click',()=>scrollGallery(1));
galleryRail.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();scrollGallery(event.key==='ArrowRight'?1:-1);}});
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
