import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';
import { initTheme } from './lib/theme';

// Apply the saved light/dark choice before the first paint.
initTheme();

// The single-file build inlines this script in <head>; wait for the body before mounting.
const mount = () => createRoot(document.getElementById('root')!).render(<App />);
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
else mount();

// Offline support for the standalone site. The artifact frame refuses service workers.
if (!__ARTIFACT__) navigator.storage?.persist?.().catch(() => undefined);
if (!__ARTIFACT__ && 'serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('./sw.js').catch(() => undefined);
}
