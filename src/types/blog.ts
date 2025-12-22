// Blog post type definitions

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  featured: boolean;
  image?: string;
  videoUrl?: string; // YouTube video URL for related tutorial
  author?: {
    name: string;
    role: string;
  };
  relatedPosts?: string[]; // Array of post IDs
}

export interface BlogCategory {
  id: string;
  name: string;
  description: string;
}

export interface BlogMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
}

