import React from 'react';
import ReactDOM from 'react-dom/client';
import VideosPage from './pages/videos/index';
import './index.css';

const root = document.getElementById('videos-root');

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <VideosPage />
    </React.StrictMode>
  );
}






