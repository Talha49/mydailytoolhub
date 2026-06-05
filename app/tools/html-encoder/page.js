import Breadcrumb from '@/components/layout/Breadcrumb'
import AdSlot from '@/components/sections/AdSlot'
import Accordion from '@/components/ui/Accordion'
import ToolHeader from '@/components/tools/ToolHeader'
import HtmlEncoderWorkbench from '@/components/tools/HtmlEncoderWorkbench'
import RelatedTools from '@/components/tools/RelatedTools'
import ToolSchema from '@/components/seo/ToolSchema'

export const metadata = {
  title: 'HTML Entity Encoder / Decoder - Escape HTML',
  description: 'Convert special text characters to their HTML entity equivalents. Protect your code from XSS attacks and display code snippets safely.',
  keywords: 'html encoder, html decoder, html entities, escape html, xml encoder',
}

const TOOL_DATA = {
  title: 'HTML Entity Encoder',
  description: 'Escape characters for harmless display in HTML documents. Convert <, >, &, and " to their safe entity counterparts instantly.',
  category: 'Developer',
  lastUpdated: 'Oct 20, 2023',
  breadcrumbs: [
    { label: 'Tools', href: '/tools' },
    { label: 'Developer', href: '/tools/category/developer' },
    { label: 'HTML Encoder', href: '#', active: true },
  ]
}

const FAQ_ITEMS = [
  {
    title: 'Why do I need to encode HTML?',
    content: 'If you want to display code on a webpage (like showing a <div> tag), you must encode it. Otherwise, the browser will interpret it as actual code and try to render it.'
  },
  {
    title: 'Does this prevent XSS?',
    content: 'Yes, encoding user input before displaying it is a key defense against Cross-Site Scripting (XSS) attacks.'
  }
]

const RELATED_TOOLS = [
  { title: 'URL Encoder', category: 'Developer', icon: 'link', href: '/tools/url-encoder' },
  { title: 'Base64 Converter', category: 'Developer', icon: 'transform', href: '/tools/base64-converter' },
  { title: 'Markdown Preview', category: 'Writing', icon: 'markdown', href: '#' },
]

export default function HtmlEncoderPage() {
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

      <HtmlEncoderWorkbench />

      <div className="grid lg:grid-cols-3 gap-12 mt-20">
        <div className="lg:col-span-2 space-y-12">
          <section className="prose prose-blue dark:prose-invert max-w-none">
             <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Safe Character Escaping</h2>
             <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-6">
               In HTML, certain characters are reserved. For example, you cannot use the less than (`&lt;`) or greater than (`&gt;`) signs within your text, because the browser treats them as tags. To display these characters, you must replace them with "character entities".
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
