import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

/**
 * Algebra Practise - Entry Point
 * Handles the initial mount and transitions the UI from the loader to the app.
 */

const boot = () => {
  const container = document.getElementById('root');
  const bootLoader = document.getElementById('boot-loader');
  const statusText = document.getElementById('boot-status');

  if (!container) {
    console.error('Fatal: Root container not found.');
    return;
  }

  try {
    if (statusText) statusText.textContent = 'Mounting Interface...';

    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    // Hide the loader once React has had a moment to begin rendering
    setTimeout(() => {
      if (bootLoader) {
        bootLoader.classList.add('ready');
        document.body.style.overflow = 'auto';
        
        // Fully remove from DOM after transition for performance
        setTimeout(() => {
          if (bootLoader.parentNode) bootLoader.remove();
        }, 1000);
      }
    }, 500);

  } catch (error) {
    console.error('Mount Error:', error);
    if (statusText) statusText.textContent = 'Hardware Error: Failed to start.';
  }
};

// Start the application
boot();
