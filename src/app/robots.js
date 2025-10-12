import siteMetadata from '../utils/siteMetaData';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/private/', '/admin/'],
    },
    sitemap: `${siteMetadata.siteUrl}/sitemap.xml`,
  };
}
