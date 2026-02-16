
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

console.log('Index.tsx starting...');

const container = document.getElementById('root');
const statusText = document.getElementById('boot-status');
const bootLoader = document.getElementById('boot-loader');

if (container) {
  try {
    if (statusText) statusText.textContent = 'Mounting Application...';
    
    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // Remove the boot loader once React has taken over
    // We use a small delay to allow the first paint to complete
    setTimeout(() => {
      if (bootLoader) {
        bootLoader.classList.add('ready');
        setTimeout(() => bootLoader.remove(), 500);
      }
      document.body.style.overflow = 'auto';
    }, 800);

  } catch (error) {
    console.error('Mounting failed:', error);
    if (statusText) statusText.textContent = 'Error: Failed to mount app.';
  }
}
