# Kingstone Systems

A clean, modern website with purple accents and white background.

## Getting Started

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

This will start the development server on `http://localhost:3000` and automatically open your browser.

## Project Structure

```
kingstonesystems/
├── index.html          # Homepage
├── why-stall.html      # Why AI initiatives stall page
├── css/
│   └── styles.css      # Main stylesheet
├── js/
│   └── script.js       # JavaScript functionality
└── assets/             # Static assets (images, etc.)
```

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- Live Server (for development)

## Scripts

- `npm run dev` - Start development server on port 3000
- `npm start` - Alias for `npm run dev`

## Deployment

### Netlify Deployment

This project is configured for easy deployment to Netlify:

1. **Connect your repository** to Netlify:
   - Go to [Netlify](https://www.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git provider and select this repository

2. **Build settings** (automatically configured via `netlify.toml`):
   - Build command: (none - static site)
   - Publish directory: `.` (root directory)

3. **Deploy**: Netlify will automatically deploy on every push to your main branch.

The project includes:
- `netlify.toml` - Configuration for headers, caching, and build settings
- `_redirects` - SPA fallback routing for proper navigation

All asset paths are configured to work correctly in production.
