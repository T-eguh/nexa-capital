import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { QueryProvider } from './providers/QueryProvider';
import { LanguageProvider } from './context/LanguageContext';
import { registerServiceWorker } from './registerSW';

// Register PWA Service Worker
registerServiceWorker();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </QueryProvider>
    </ErrorBoundary>
  </StrictMode>
);
