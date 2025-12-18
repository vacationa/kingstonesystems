import React from 'react';
import { Navigation } from '../../components/Navigation';
import { BlogHero } from '../../components/BlogHero';
import { FeaturedPost } from '../../components/FeaturedPost';
import { BlogCard } from '../../components/BlogCard';
import { BlogCTA } from '../../components/BlogCTA';
import { Footer } from '../../components/Footer';

// Real blog posts from blog folder
const featuredPost = {
  title: "AI Voice Agent Services for Businesses: Complete 2026 Guide",
  excerpt: "Transform your business communication with AI voice agent services. Comprehensive guide covering implementation, ROI, use cases, and best practices for enterprise voice AI solutions.",
  category: "Business Solutions",
  date: "December 17, 2025",
  readTime: "16 min",
  slug: "ai-voice-agent-services-for-businesses",
};

const blogPosts = [
  {
    title: "How to Use Agentic AI: Complete Implementation Guide",
    excerpt: "Master agentic AI with our comprehensive guide. Learn implementation strategies, best practices, and real-world applications for autonomous AI agents.",
    category: "Implementation",
    date: "December 17, 2025",
    readTime: "15 min",
    slug: "how-to-use-agentic-ai",
  },
  {
    title: "How to Build AI Agents: A Complete Step-by-Step Guide for 2025",
    excerpt: "Master the art of building AI agents with our comprehensive guide. Learn the tools, frameworks, and best practices for creating intelligent, scalable AI agents.",
    category: "Development",
    date: "December 17, 2025",
    readTime: "18 min",
    slug: "how-to-build-ai-agents",
  },
  {
    title: "How to Create Industry-Specific Knowledge Bases for AI Agents",
    excerpt: "Master the art of building specialized knowledge bases that power intelligent AI agents. Step-by-step guide with real-world examples and best practices.",
    category: "Development",
    date: "December 17, 2025",
    readTime: "14 min",
    slug: "how-to-create-industry-specific-knowledge-bases-for-ai-agents",
  },
  {
    title: "AI Voice Agents for Law Firms: Complete Implementation Guide",
    excerpt: "Learn how AI voice agents are revolutionizing law firm operations. Reduce overhead by 70%, never miss a client call, and maintain 24/7 availability with intelligent voice automation.",
    category: "Industry Solutions",
    date: "December 17, 2025",
    readTime: "17 min",
    slug: "ai-voice-agents-for-law-firms",
  },
  {
    title: "Best AI Voice Agent Solutions for Business Phone Systems (2025)",
    excerpt: "Comprehensive guide to choosing the best AI voice agent solutions for your business phone system. Expert analysis, feature comparisons, and implementation strategies.",
    category: "Solutions",
    date: "December 17, 2025",
    readTime: "13 min",
    slug: "best-ai-voice-agent-solutions-for-business-phone-systems",
  },
  {
    title: "Best Voice AI Agents for Telecom and Utility Providers",
    excerpt: "Complete guide to selecting and implementing voice AI agents for telecommunications and utility companies. Reduce costs, improve customer satisfaction, and scale operations with AI automation.",
    category: "Industry Solutions",
    date: "December 17, 2025",
    readTime: "16 min",
    slug: "best-voice-ai-agents-for-telecom-and-utility-providers",
  },
  {
    title: "How Do AI Chatbots Compare to Human Agents? Complete 2026 Analysis",
    excerpt: "An in-depth comparison of AI chatbots and human agents covering costs, capabilities, limitations, and when to use each solution for optimal customer service.",
    category: "Analysis",
    date: "December 17, 2025",
    readTime: "12 min",
    slug: "how-do-ai-chatbots-compare-to-human-agents",
  },
  {
    title: "How to Control Emotional Tone of AI Agent Responses",
    excerpt: "Master the art of controlling emotional tone in AI agent responses with proven techniques and implementation strategies for natural, empathetic interactions.",
    category: "Development",
    date: "December 17, 2025",
    readTime: "11 min",
    slug: "how-to-control-emotional-tone-of-ai-agent-responses",
  },
  {
    title: "Why Voice AI Will Replace Traditional Call Centers in 2026",
    excerpt: "The shift from traditional call centers to AI-powered voice systems is accelerating. Discover the economic and operational factors driving this transformation.",
    category: "Trends",
    date: "December 17, 2025",
    readTime: "10 min",
    slug: "why-voice-ai-will-replace-traditional-call-centers-in-2026",
  },
];

export const BlogPage: React.FC = () => {
  return (
    <>
      <Navigation currentPage="blog" />
      
      <BlogHero />
      
      <FeaturedPost {...featuredPost} />
      
      {blogPosts.length > 0 && (
        <section className="blog-posts-section">
          <div className="container">
            <div className="blog-posts-grid">
              {blogPosts.map((post, index) => (
                <BlogCard key={index} {...post} />
              ))}
            </div>
          </div>
        </section>
      )}
      
      <BlogCTA />
      
      <Footer />
    </>
  );
};

export default BlogPage;

