import './styles.css';
import { startApp } from './app';

startApp().catch((error) => {
  console.error(error);
  const root = document.querySelector('#app');
  if (root) root.innerHTML = '<main id="main" class="legal"><h1>The workspace could not open</h1><p>Reload the page. If the problem continues, clear this site’s browser data and try again.</p></main>';
});

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch((error) => console.warn('Offline setup failed', error)));
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data?.type !== 'UPDATE_AVAILABLE') return;
    const toast = document.querySelector<HTMLElement>('#toast');
    if (toast) { toast.textContent = 'A fresh map is ready. Reload when convenient.'; toast.hidden = false; }
  });
}
