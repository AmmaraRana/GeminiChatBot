import { StrictMode } from 'react';
import React from 'react'; 
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Ensure the 'root' element exists in your HTML
const rootElement = document.getElementById('root');

// Create a root and render the App component
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} else {
  console.error('Root element not found');
}

