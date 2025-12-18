import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// This is for the main homepage - keep existing HTML structure
const root = document.getElementById('root');

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <div>Main site loaded with React</div>
    </React.StrictMode>
  );
}

