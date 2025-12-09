import React from 'react';
import ReactDOM from 'react-dom/client';
import { Analytics } from "@vercel/analytics/react"
import { injectSpeedInsights } from "@vercel/speed-insights";
import App from './App';
import './index.css';

// Initialize Vercel Speed Insights for performance monitoring
injectSpeedInsights();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>
);