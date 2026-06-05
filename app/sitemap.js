import dbConnect from '@/lib/db'
import Post from '@/lib/models/Post'

export const dynamic = 'force-dynamic'

export default async function sitemap() {
  const baseUrl = 'https://www.corehubtools.com'
  
  const tools = [
    'json-formatter', 'jwt-decoder', 'regex-tester', 'base64-converter',
    'url-encoder', 'code-minifier', 'html-encoder', 'markdown-preview',
    'password-generator', 'uuid-generator', 'color-converter', 'text-diff',
    'qr-generator', 'timestamp-converter', 'secure-notepad', 'lorem-ipsum-generator',
    'cron-job-generator', 'word-counter', 'case-converter', 'meta-tag-generator'
  ]

  let dbBlogPosts = []
  try {
    await dbConnect()
    const posts = await Post.find({ status: 'published' }).select('slug updatedAt')
    dbBlogPosts = posts.map(p => ({
      slug: p.slug,
      updatedAt: p.updatedAt
    }))
  } catch (e) {
    // Build fallback to prevent compile crashes when DB is not connected
    dbBlogPosts = [
      { slug: 'seo-practices-2024', updatedAt: new Date() },
      { slug: 'optimize-json', updatedAt: new Date() },
      { slug: 'browser-side-security', updatedAt: new Date() }
    ]
  }

  const toolRoutes = tools.map(tool => ({
    url: `${baseUrl}/tools/${tool}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const blogRoutes = dbBlogPosts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt || new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const complianceRoutes = [
    'privacy', 'terms', 'cookies', 'ad-disclosure', 'api', 'changelog'
  ].map(route => ({
    url: `${baseUrl}/${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...toolRoutes,
    ...blogRoutes,
    ...complianceRoutes
  ]
}
