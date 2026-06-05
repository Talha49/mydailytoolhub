import Breadcrumb from '@/components/layout/Breadcrumb'
import AdSlot from '@/components/sections/AdSlot'
import BlogCard from '@/components/sections/BlogCard'
import Accordion from '@/components/ui/Accordion'
import ToolHeader from '@/components/tools/ToolHeader'
import ToolWorkbench from '@/components/tools/ToolWorkbench'
import RelatedTools from '@/components/tools/RelatedTools'
import { APP_NAME } from '@/lib/constants'
import ToolSchema from '@/components/seo/ToolSchema'

// Mock Data for specific tool (JSON Formatter)
const TOOL_DATA = {
  title: 'JSON Formatter & Validator',
  description: 'Clean, format, and validate your JSON data instantly. Our tool makes unreadable minified code beautiful and easy to debug with syntax highlighting and error detection.',
  category: 'Developer',
  lastUpdated: 'Oct 24, 2023',
  breadcrumbs: [
    { label: 'Tools', href: '/tools' },
    { label: 'Developer', href: '/tools/category/developer' },
    { label: 'JSON Formatter', href: '#', active: true },
  ]
}

const FAQ_ITEMS = [
  {
    title: 'Is my JSON data secure?',
    content: 'Yes, absolutely. We process all data locally in your browser using JavaScript. Your JSON data is never uploaded to our servers or stored in any database. Privacy is our top priority.'
  },
  {
    title: 'What is the difference between Formatting and Minifying?',
    content: 'Formatting (or beautifying) adds whitespace and indentation to make JSON readable for humans. Minifying removes all unnecessary whitespace to reduce file size for machine processing and bandwidth efficiency.'
  },
  {
    title: 'Does this tool support large JSON files?',
    content: 'Yes! Since we process data client-side, the limit depends on your browser and computer memory. We regularly test with files up to 50MB without issues.'
  }
]

const RELATED_TOOLS = [
  { title: 'XML Formatter', category: 'Developer', icon: 'data_object', href: '#' },
  { title: 'JS Beautifier', category: 'Developer', icon: 'javascript', href: '#' },
  { title: 'CSS Minifier', category: 'Design', icon: 'palette', href: '#' },
  { title: 'HTML Entity Encoder', category: 'Utilities', icon: 'html', href: '#' },
]

export const metadata = {
  title: TOOL_DATA.title,
  description: TOOL_DATA.description,
}

/**
 * Tool Page Template ([slug])
 * Currently explicitly mocking JSON Formatter for Phase 3.2
 */
export default function ToolPage({ params }) {
  return (
    <div className="container-custom py-8">
      {/* Top Section */}
      <Breadcrumb items={TOOL_DATA.breadcrumbs} />
      <ToolSchema name={TOOL_DATA.title} description={TOOL_DATA.description} applicationCategory={TOOL_DATA.category} />
      
      <ToolHeader 
        title={TOOL_DATA.title} 
        description={TOOL_DATA.description} 
        category={TOOL_DATA.category}
        lastUpdated={TOOL_DATA.lastUpdated}
      />

      <AdSlot variant="leaderboard" className="mb-12" />

      {/* Main Workbench Area */}
      <ToolWorkbench />

      {/* Content & Sidebar Layout */}
      <div className="grid lg:grid-cols-3 gap-12 mt-20">
        
        {/* Left Content Column */}
        <div className="lg:col-span-2 space-y-12">
          {/* SEO / Info Content */}
          <section className="prose prose-blue dark:prose-invert max-w-none">
             <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Why use a JSON Formatter?</h2>
             <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-6">
               JSON (JavaScript Object Notation) is the standard for data exchange across the modern web. However, to save bandwidth, APIs often return minified JSON that is nearly impossible for humans to read. Our <strong>JSON Formatter</strong> tool solves this by adding proper indentation and line breaks.
             </p>
             <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
               Whether you are debugging a complex API response or preparing configuration files, our tool provides a clean, professional environment for your data. We also validate your JSON in real-time, highlighting syntax errors like missing commas or mismatched brackets.
             </p>
          </section>

          {/* FAQ Section */}
          <section>
            <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">Frequently Asked Questions</h2>
            <Accordion items={FAQ_ITEMS} />
          </section>
          
          <AdSlot variant="inline" />
        </div>

        {/* Right Sidebar Column */}
        <aside className="space-y-8">
           <div className="sticky top-24 space-y-8">
             <RelatedTools tools={RELATED_TOOLS} />
             <AdSlot variant="rectangle" />
           </div>
        </aside>

      </div>
      
      {/* Related Guides (Bottom) */}
      <section className="mt-20 border-t border-border-light dark:border-border-dark pt-12">
        <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-8">Latest Developer Guides</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <BlogCard 
            title="Mastering JSON Data Structures" 
            description="Learn the fundamental rules of JSON and how to structure your data for high-performance scale." 
            category="Tutorial"
            readTime="5 min"
            date="2023-10-26"
            image="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=800"
            href="#"
          />
           <BlogCard 
            title="JSON vs XML: Which one to choose?"
            description="A deep dive comparison between JSON and XML for modern web application development." 
            category="Optimization"
            readTime="6 min"
            date="2023-10-15"
            image="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=800"
            href="#"
          />
           <BlogCard 
            title="Safe Parsing of Untrusted JSON"
            description="Avoid common security pitfalls when parsing JSON data from external API providers." 
            category="Security"
            readTime="4 min"
            date="2023-10-12"
            image="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800"
            href="#"
          />
        </div>
      </section>
    </div>
  )
}
