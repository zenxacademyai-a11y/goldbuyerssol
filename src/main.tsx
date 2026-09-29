import {StrictMode} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './components/ThemeProvider.js';
import { ErrorBoundary } from './components/ErrorBoundary.js';

// Register PWA service worker
if ('serviceWorker' in navigator && (import.meta as any).env?.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => {
        console.log('PWA Service Worker registered successfully:', reg.scope);
      })
      .catch((err) => {
        console.error('PWA Service Worker registration failed:', err);
      });
  });
}

const rootElement = document.getElementById('root')!;
const appElement = (
  <StrictMode>
    <ThemeProvider defaultTheme="light">
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </ThemeProvider>
  </StrictMode>
);

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, appElement);
} else {
  createRoot(rootElement).render(appElement);
}
