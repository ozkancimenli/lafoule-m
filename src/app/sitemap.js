import { allBlogs } from 'contentlayer/generated';
import siteMetadata from '@/src/utils/siteMetaData';

export default function sitemap() {
  const siteUrl = siteMetadata.siteUrl;
  
  // Static pages
  const staticPages = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // Blog posts
  const blogPages = allBlogs.map((blog) => ({
    url: `${siteUrl}/blogs/${blog.slug}`,
    lastModified: new Date(blog.publishedAt),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Categories
  const categories = [...new Set(allBlogs.map(blog => blog.tags).flat())];
  const categoryPages = categories.map((category) => ({
    url: `${siteUrl}/categories/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticPages, ...blogPages, ...categoryPages];
}
