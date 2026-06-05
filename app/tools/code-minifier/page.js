import Breadcrumb from '@/components/layout/Breadcrumb'
import AdSlot from '@/components/sections/AdSlot'
import Accordion from '@/components/ui/Accordion'
import ToolHeader from '@/components/tools/ToolHeader'
import CodeMinifierWorkbench from '@/components/tools/CodeMinifierWorkbench'
import RelatedTools from '@/components/tools/RelatedTools'
import ToolSchema from '@/components/seo/ToolSchema'

export const metadata = {
  title: 'Code Minifier - JS, CSS, HTML Compression',
  description: 'Minify JavaScript, CSS, and HTML code to reduce file size and improve page load speed. Free online code compressor.',
  keywords: 'code minifier, js minifier, css minifier, html minifier, code compressor',
}

const TOOL_DATA = {
  title: 'Code Minifier',
  description: 'Shrink your code size by removing whitespace, comments, and unnecessary characters. Supports JavaScript, CSS, and HTML.',
  category: 'Developer',
  lastUpdated: 'Nov 30, 2023',
  breadcrumbs: [
    { label: 'Tools', href: '/tools' },
    { label: 'Developer', href: '/tools/category/developer' },
    { label: 'Code Minifier', href: '#', active: true },
  ]
}

const FAQ_ITEMS = [
  {
    title: 'Does minification break my code?',
    content: 'No, minification only removes characters that are not required for code execution (like newlines, comments, and extra spaces). The logic remains exactly the same.'
  },
  {
    title: 'How much space can I save?',
    content: 'It depends on your coding style, but typically you can expect numeric reductions of 30-60% in file size.'
  }
]

const RELATED_TOOLS = [
  { title: 'JSON Formatter', category: 'Developer', icon: 'data_object', href: '/tools/json-formatter' },
  { title: 'HTML Encoder', category: 'Developer', icon: 'html', href: '/tools/html-encoder' },
  { title: 'Base64 Converter', category: 'Developer', icon: 'transform', href: '/tools/base64-converter' },
]

export default function CodeMinifierPage() {
  return (
    <div className="container-custom py-8">
      <Breadcrumb items={TOOL_DATA.breadcrumbs} />
      <ToolSchema name={TOOL_DATA.title} description={TOOL_DATA.description} applicationCategory={TOOL_DATA.category} />
      
      <ToolHeader 
        title={TOOL_DATA.title} 
        description={TOOL_DATA.description} 
        category={TOOL_DATA.category}
        lastUpdated={TOOL_DATA.lastUpdated}
      />

      <AdSlot variant="leaderboard" className="mb-12" />

      <CodeMinifierWorkbench />

      <div className="grid lg:grid-cols-3 gap-12 mt-20">
        <div className="lg:col-span-2 space-y-12">
          <section className="prose prose-blue dark:prose-invert max-w-none">
             <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Boost Website Performance</h2>
             <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-6">
               Every byte counts when it comes to SEO and User Experience. **Code Minification** is one of the easiest ways to improve your PageSpeed score. By stripping comments and whitespace, your files download faster without changing functionality.
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
