import React from 'react';
import ReactDOM from 'react-dom/client';
import BlogPage from './pages/blog/index';
import './index.css';

const root = document.getElementById('blog-root');

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <BlogPage />
    </React.StrictMode>
  );
}

