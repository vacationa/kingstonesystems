# Kingstone Systems

Voice AI Agent Consulting & Development website with blog.

## Setup

Install dependencies:
```bash
npm install
```

## Development

Run the development server:
```bash
npm run dev
```

Visit:
- Main site: http://localhost:5173/
- Blog: http://localhost:5173/blog-new.html

## Build

Build for production:
```bash
npm run build
```

The built files will be in the `dist/` directory.

## Project Structure

```
src/
├── components/       # Reusable React components
│   ├── Navigation.tsx
│   ├── Footer.tsx
│   ├── BlogCard.tsx
│   ├── BlogHero.tsx
│   ├── FeaturedPost.tsx
│   └── BlogCTA.tsx
├── pages/
│   └── blog/
│       ├── index.tsx      # Main blog listing page
│       └── BlogPost.tsx   # Individual blog post template
├── types/
│   └── blog.ts           # TypeScript type definitions
├── blog.tsx              # Blog entry point
└── index.css             # Global styles

css/
└── styles.css            # Main stylesheet (imported by React)
```

## Technology Stack

- React 18
- TypeScript
- Vite (build tool)
- CSS (custom styles)
