const selector = document.querySelector('#device-width');
const frame = document.querySelector('#mobile-preview');
const device = document.querySelector('#device');
const stage = document.querySelector('#device-stage');
function setSize() {
  const width = Number(selector.value);
  frame.style.width = `${width}px`;
  device.style.width = `${width + 24}px`;
  // Scale only the frame presentation; the site still sees an actual 844px viewport.
  const availableHeight = innerWidth > 600 ? Math.max(420, innerHeight - 175) : 911;
  const availableWidth = innerWidth > 800 ? innerWidth - 380 : innerWidth > 600 ? innerWidth - 240 : innerWidth - 32;
  const scale = Math.min(1, availableHeight / 911, availableWidth / (width + 24));
  device.style.maxWidth = 'none';
  device.style.transform = `scale(${scale})`;
  stage.style.width = `${(width + 24) * scale}px`;
  stage.style.height = `${911 * scale}px`;
  document.querySelector('#width-caption').textContent = `${width} px`;
}
selector.addEventListener('change', setSize);
window.addEventListener('resize', setSize);
document.querySelector('#reload-preview').addEventListener('click', () => frame.contentWindow.location.reload());
setSize();
