import { allBlogs } from 'contentlayer/generated';
import siteMetadata from '@/src/utils/siteMetaData';
import { slug } from 'github-slugger';

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
    url: `${siteUrl}${blog.url}`,
    lastModified: new Date(blog.updatedAt || blog.publishedAt),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Categories
  const categorySlugs = [
    ...new Set(
      allBlogs.flatMap((blog) =>
        (blog.tags ?? []).map((tag) => slug(tag))
      )
    ),
  ];
  const categoryPages = categorySlugs.map((category) => ({
    url: `${siteUrl}/categories/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticPages, ...blogPages, ...categoryPages];
}
