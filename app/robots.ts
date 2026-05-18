import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/practice/history'],
    },
    sitemap: 'https://dailysql.in/sitemap.xml',
  };
}
