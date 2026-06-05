import Breadcrumb from '@/components/layout/Breadcrumb'
import AdSlot from '@/components/sections/AdSlot'
import BlogCard from '@/components/sections/BlogCard'
import Accordion from '@/components/ui/Accordion'
import ToolHeader from '@/components/tools/ToolHeader'
import JsonFormatterWorkbench from '@/components/tools/JsonFormatterWorkbench'
import RelatedTools from '@/components/tools/RelatedTools'
import ToolSchema from '@/components/seo/ToolSchema'

export const metadata = {
  alternates: {
    canonical: 'https://www.corehubtools.com/tools/json-formatter',
  },
  title: 'JSON Formatter & Validator - Free Online Tool',
  description: 'Process your JSON data securely in your browser. Validate, format, minify, and fix JSON errors instantly with our free online tool.',
  keywords: 'json formatter, json validator, json minify, online json tool, secure json formatter',
}

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

export default function JsonFormatterPage() {
  return (
    <div className="container-custom py-8">
      <Breadcrumb items={TOOL_DATA.breadcrumbs} />
      <ToolSchema 
        name={TOOL_DATA.title} 
        description={TOOL_DATA.description} 
        applicationCategory={TOOL_DATA.category}
        faqItems={FAQ_ITEMS}
        breadcrumbs={TOOL_DATA.breadcrumbs}
        url="https://www.corehubtools.com/tools/json-formatter"
      />
      
      <ToolHeader 
        title={TOOL_DATA.title} 
        description={TOOL_DATA.description} 
        category={TOOL_DATA.category}
        lastUpdated={TOOL_DATA.lastUpdated}
      />

      <AdSlot variant="leaderboard" className="mb-12" />

      {/* JSON Specific Workbench */}
      <JsonFormatterWorkbench />

      <div className="grid lg:grid-cols-3 gap-12 mt-20">
        <div className="lg:col-span-2 space-y-12">
          <section className="prose prose-blue dark:prose-invert max-w-none">
             <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Why use a JSON Formatter?</h2>
             <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-6">
               JSON (JavaScript Object Notation) is the standard for data exchange across the modern web. However, to save bandwidth, APIs often return minified JSON that is nearly impossible for humans to read. Our <strong>JSON Formatter</strong> tool solves this by adding proper indentation and line breaks.
             </p>
             <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
               Whether you are debugging a complex API response or preparing configuration files, our tool provides a clean, professional environment for your data. We also validate your JSON in real-time, highlighting syntax errors like missing commas or mismatched brackets.
             </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">Frequently Asked Questions</h2>
            <Accordion items={FAQ_ITEMS} />
          </section>
          
          <AdSlot variant="inline" />
        </div>

        <aside className="space-y-8">
           <div className="sticky top-24 space-y-8">
             <RelatedTools tools={RELATED_TOOLS} />
             <AdSlot variant="rectangle" />
           </div>
        </aside>
      </div>
    </div>
  )
}
