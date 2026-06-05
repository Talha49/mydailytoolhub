export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/tools', '/blog'],
      disallow: ['/api/', '/admin/', '/_clients/'],
    },
    sitemap: 'https://www.corehubtools.com/sitemap.xml',
  }
}
