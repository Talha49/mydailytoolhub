import Hero from '@/components/sections/Hero'
import HomeSection from '@/components/sections/HomeSection'
import ToolCard from '@/components/sections/ToolCard'
import BlogCard from '@/components/sections/BlogCard'
import CategoryCard from '@/components/sections/CategoryCard'
import AdSlot from '@/components/sections/AdSlot'
import { TOOL_CATEGORIES } from '@/lib/constants'
import dbConnect from '@/lib/db'
import Post from '@/lib/models/Post'

export const dynamic = 'force-dynamic'

// Popular Tools
const POPULAR_TOOLS = [
  { 
    title: 'JSON Formatter', 
    description: 'Clean, validate and beautify your JSON code instantly.', 
    icon: 'data_object', 
    href: '/tools/json-formatter' 
  },
  { 
    title: 'QR Code Generator', 
    description: 'Create custom QR codes for WiFi, URLs, and text with colors.', 
    icon: 'qr_code_2', 
    href: '/tools/qr-generator' 
  },
  { 
    title: 'Password Generator', 
    description: 'Generate customizable, secure passwords for your accounts.', 
    icon: 'password', 
    href: '/tools/password-generator' 
  },
  { 
    title: 'Color Picker', 
    description: 'Pick colors and convert between HEX, RGB, and HSL formats.', 
    icon: 'palette', 
    href: '/tools/color-picker' 
  },
  { 
    title: 'UUID Generator', 
    description: 'Generate unique v1 and v4 UUIDs for your database bulk.', 
    icon: 'fingerprint', 
    href: '/tools/uuid-generator' 
  },
  { 
    title: 'Markdown Preview', 
    description: 'Write, edit, and preview Markdown content in real-time.', 
    icon: 'markdown', 
    href: '/tools/markdown-preview' 
  },
]

// Fallback Mock Data if database is empty
const MOCK_LATEST_GUIDES = [
  {
    title: 'How to optimize JSON for large scale performance',
    description: 'Discover advanced techniques for structuring JSON data to minimize latency and improve parsing speed in web apps.',
    category: 'Developer',
    readTime: '5 min read',
    date: '2023-11-20',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
    href: '/blog/optimize-json'
  },
  {
    title: 'Top 10 SEO practices for modern web apps in 2024',
    description: 'Stay ahead of the competition with our curated list of technical SEO checklist and content optimization tips.',
    category: 'SEO',
    readTime: '8 min read',
    date: '2023-11-15',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    href: '/blog/seo-practices-2024'
  },
  {
    title: 'Why browser-side processing is more secure for you',
    description: 'Learn why ToolHub processes your data locally and never sends your sensitive strings to our servers.',
    category: 'Security',
    readTime: '4 min read',
    date: '2023-11-10',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
    href: '/blog/browser-side-security'
  }
]

export default async function Home() {
  await dbConnect()
  
  // Fetch real articles from database
  let latestGuides = []
  try {
    const rawGuides = await Post.find({ status: 'published' }).sort({ createdAt: -1 }).limit(3)
    latestGuides = rawGuides.map(doc => {
      const p = doc.toObject()
      return {
        title: p.title,
        description: p.description,
        category: p.category,
        readTime: p.readTime,
        date: new Date(p.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        image: p.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
        href: `/blog/${p.slug}`
      }
    })
  } catch (err) {
    console.error('Failed to load database posts on homepage', err)
  }

  // Fallback if no posts exist in DB yet
  const guidesToRender = latestGuides.length > 0 ? latestGuides : MOCK_LATEST_GUIDES

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <Hero />

      {/* Top Advertisement */}
      <div className="container-custom py-8">
        <AdSlot variant="leaderboard" />
      </div>

      {/* Popular Tools Section */}
      <HomeSection 
        title="Popular Tools" 
        subtitle="Most used tools by our community today."
        viewAllHref="/tools"
        className="bg-background-light/50 dark:bg-background-dark/20"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {POPULAR_TOOLS.map((tool) => (
            <ToolCard key={tool.title} {...tool} />
          ))}
        </div>
      </HomeSection>

      {/* Explorer Categories */}
      <HomeSection 
        title="Explore by Category" 
        subtitle="Whatever your task, we have a specialized tool for it."
        className="bg-white dark:bg-background-dark"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {TOOL_CATEGORIES.map((cat) => (
            <CategoryCard 
              key={cat.id} 
              label={cat.label} 
              icon={cat.icon} 
              href={`/tools?category=${cat.id}`} 
            />
          ))}
        </div>
      </HomeSection>

      {/* Latest Guides Section */}
      <HomeSection 
        title="Latest Guides & Insights" 
        subtitle="Learn how to boost your productivity and workflow."
        viewAllHref="/blog"
        className="bg-background-light/50 dark:bg-background-dark/20"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guidesToRender.map((guide) => (
            <BlogCard key={guide.title} {...guide} />
          ))}
        </div>
      </HomeSection>

      {/* Bottom Call to Action or Advertisement */}
      <div className="container-custom py-12 mb-12">
        <AdSlot variant="rectangle" className="lg:max-w-4xl" />
      </div>
    </div>
  )
}
