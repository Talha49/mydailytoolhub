import dbConnect from '@/lib/db'
import Post from '@/lib/models/Post'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { marked } from 'marked'

import Breadcrumb from '@/components/layout/Breadcrumb'
import AdSlot from '@/components/sections/AdSlot'
import BlogCard from '@/components/sections/BlogCard'
import Badge from '@/components/ui/Badge'
import ProgressBar from '@/components/blog/ProgressBar'
import ShareButtons from '@/components/blog/ShareButtons'
import NewsletterSignup from '@/components/blog/NewsletterSignup'
import RelatedTools from '@/components/tools/RelatedTools'
import { APP_NAME } from '@/lib/constants'
import { ALL_TOOLS } from '@/lib/tools-data'

export const dynamic = 'force-dynamic'

function renderMarkdownWithTools(markdownText) {
  if (!markdownText) return ''
  
  // Replace [[tool:slug]] shortcode with a highly professional HTML tool card
  let processedText = markdownText.replace(/\[\[tool:([a-zA-Z0-9-]+)\]\]/g, (match, slug) => {
    const tool = ALL_TOOLS.find(t => t.id === slug)
    if (!tool) return `<a href="/tools/${slug}" class="text-primary font-bold hover:underline">Open Tool (${slug})</a>`
    
    return `
<div class="not-prose my-8 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-border-light dark:border-border-dark bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl hover:shadow-medium hover:border-primary/40 transition-all duration-300 group">
  <div class="space-y-1">
    <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-primary/10 text-primary uppercase tracking-wider">
      <span class="size-1.5 rounded-full bg-primary animate-pulse"></span>
      Interactive Tool
    </span>
    <h4 class="text-lg font-black text-text-primary-light dark:text-text-primary-dark group-hover:text-primary transition-colors mt-1">
      ${tool.title}
    </h4>
    <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark leading-relaxed max-w-xl">
      ${tool.description}
    </p>
  </div>
  <a href="${tool.href}" class="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-primary/10 hover:shadow-primary/25 transition-all duration-300 shrink-0 select-none">
    Open Tool
    <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
  </a>
</div>
`
  })

  return marked.parse(processedText)
}

const AUTHOR = {
  name: 'Talha Ghauri',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
  role: 'Creator & Lead Developer'
}

const RELATED_TOOLS = [
  { title: 'JSON Formatter', category: 'Developer', icon: 'data_object', href: '/tools/json-formatter' },
  { title: 'Regex Tester', category: 'Developer', icon: 'bug_report', href: '/tools/regex-tester' },
  { title: 'UUID Generator', category: 'Utilities', icon: 'fingerprint', href: '/tools/uuid-generator' },
]

export async function generateMetadata({ params }) {
  const { slug } = await params
  await dbConnect()
  const post = await Post.findOne({ slug, status: 'published' })

  if (!post) {
    return {
      title: `Article Not Found | ${APP_NAME}`,
      description: 'The requested blog article could not be found.',
    }
  }

  return {
    title: `${post.title} | ${APP_NAME} Blog`,
    description: post.description,
    alternates: {
      canonical: `https://www.corehubtools.com/blog/${slug}`,
    },
  }
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params
  await dbConnect()
  const post = await Post.findOne({ slug, status: 'published' })

  if (!post) {
    notFound()
  }

  // Fetch recent articles excluding the current one
  const rawTrending = await Post.find({ slug: { $ne: slug }, status: 'published' })
    .sort({ createdAt: -1 })
    .limit(2)

  const trending = rawTrending.map((doc) => {
    const p = doc.toObject()
    p._id = p._id.toString()
    p.createdAt = p.createdAt.toISOString()
    return p
  })

  const contentHtml = renderMarkdownWithTools(post.markdown || '')

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: post.title,
    description: post.description,
    image: post.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200',
    author: {
      '@type': 'Person',
      name: AUTHOR.name,
      jobTitle: AUTHOR.role
    },
    publisher: {
      '@type': 'Organization',
      name: APP_NAME,
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.corehubtools.com/logo.png'
      }
    },
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.corehubtools.com/blog/${slug}`
    }
  }

  const breadcrumbs = [
    { label: 'Blog', href: '/blog' },
    { label: post.category, href: `/blog?category=${post.category}` },
    { label: post.title, href: '#', active: true },
  ]

  return (
    <>
      <Script
        id={`schema-article-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <ProgressBar />
      
      <div className="container-custom py-8">
        <Breadcrumb items={breadcrumbs} />
        
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Article Content */}
          <article className="lg:col-span-2">
            {/* Header */}
            <header className="mb-8 animate-slideUp">
              <div className="flex items-center gap-3 mb-6">
                <Badge variant="primary">{post.category}</Badge>
                <span className="text-sm font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-widest">
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })} • {post.readTime}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-black text-text-primary-light dark:text-text-primary-dark mb-6 leading-[1.15] tracking-tight">
                {post.title}
              </h1>
              
              <div className="flex items-center justify-between border-y border-border-light dark:border-border-dark py-6">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-gray-200 overflow-hidden">
                    <img src={AUTHOR.avatar} alt={AUTHOR.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">{AUTHOR.name}</p>
                    <p className="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">{AUTHOR.role}</p>
                  </div>
                </div>
                
                <ShareButtons title={post.title} url={`https://www.corehubtools.com/blog/${slug}`} />
              </div>
            </header>

            {/* Featured Image */}
            {post.image && (
              <div className="aspect-video w-full rounded-2xl overflow-hidden mb-10 shadow-medium animate-fadeIn">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
              </div>
            )}

            <AdSlot variant="inline" className="mb-10" />

            {/* Markdown rendered HTML */}
            <div 
              className="prose prose-lg prose-blue dark:prose-invert max-w-none mb-12 animate-slideUp [animation-delay:100ms] text-text-primary-light dark:text-text-primary-dark"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />

            {/* Footer Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="border-t border-border-light dark:border-border-dark pt-8 mb-12">
                <h4 className="text-sm font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-widest mb-4">
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:bg-primary hover:text-white transition-colors cursor-pointer">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </article>

          {/* Right Sidebar */}
          <aside className="space-y-10 lg:sticky lg:top-24 h-fit">
            <NewsletterSignup />
            
            {trending.length > 0 && (
              <div className="space-y-6">
                <h3 className="font-bold text-lg text-text-primary-light dark:text-text-primary-dark border-b border-border-light dark:border-border-dark pb-2">
                  Trending Articles
                </h3>
                <div className="grid gap-6">
                  {trending.map(guide => (
                    <BlogCard 
                      key={guide._id} 
                      title={guide.title}
                      description={guide.description}
                      category={guide.category}
                      readTime={guide.readTime}
                      date={new Date(guide.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                      image={guide.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800'}
                      href={`/blog/${guide.slug}`}
                    />
                  ))}
                </div>
              </div>
            )}

            <AdSlot variant="rectangle" />
            
            <RelatedTools tools={RELATED_TOOLS} />
          </aside>
        </div>
      </div>
    </>
  )
}
