import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  // Use requestAnimationFrame to ensure we remove the loader after the first successful paint
  // This is more reliable than a simple setTimeout
  requestAnimationFrame(() => {
    // Small delay to ensure smooth transition
    setTimeout(() => {
      const bootLoader = document.getElementById('boot-loader');
      if (bootLoader) {
        bootLoader.classList.add('ready');
        document.body.style.overflow = 'auto';
      }
    }, 500);
  });
}