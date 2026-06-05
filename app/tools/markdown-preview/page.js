import Breadcrumb from '@/components/layout/Breadcrumb'
import AdSlot from '@/components/sections/AdSlot'
import Accordion from '@/components/ui/Accordion'
import ToolHeader from '@/components/tools/ToolHeader'
import MarkdownPreviewWorkbench from '@/components/tools/MarkdownPreviewWorkbench'
import RelatedTools from '@/components/tools/RelatedTools'
import ToolSchema from '@/components/seo/ToolSchema'

export const metadata = {
  title: 'Markdown Editor & Preview - Online Viewer',
  description: 'Write and preview Markdown in real-time. Export to HTML or PDF. The best free online markdown editor for developers and writers.',
  keywords: 'markdown editor, markdown preview, online markdown, md viewer, markdown to html',
}

const TOOL_DATA = {
  title: 'Markdown Preview',
  description: 'The distraction-free editor for Markdown. Write documentation, READMEs, or blog posts with instant side-by-side preview.',
  category: 'Writing',
  lastUpdated: 'Dec 10, 2023',
  breadcrumbs: [
    { label: 'Tools', href: '/tools' },
    { label: 'Writing', href: '/tools/category/writing' },
    { label: 'Markdown Preview', href: '#', active: true },
  ]
}

const FAQ_ITEMS = [
  {
    title: 'What is Markdown?',
    content: 'Markdown is a lightweight markup language that used to add formatting elements to plaintext text documents. It is widely used for creating websites and documentation.'
  },
  {
    title: 'Can I export to HTML?',
    content: 'Yes! Once you are done writing, you can copy the raw HTML output to use in your website or CMS.'
  }
]

const RELATED_TOOLS = [
  { title: 'HTML Encoder', category: 'Developer', icon: 'html', href: '/tools/html-encoder' },
  { title: 'Word Counter', category: 'Writing', icon: 'article', href: '/tools/word-counter' },
  { title: 'Lorem Ipsum', category: 'Developer', icon: 'notes', href: '/tools/lorem-ipsum-generator' },
]

export default function MarkdownPreviewPage() {
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

      <MarkdownPreviewWorkbench />

      <div className="grid lg:grid-cols-3 gap-12 mt-20">
        <div className="lg:col-span-2 space-y-12">
          <section className="prose prose-blue dark:prose-invert max-w-none">
             <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Write Faster with Markdown</h2>
             <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-6">
  Stop fighting with complex word processors. <strong>Markdown</strong> lets you format text as you type.
  Use <code>**bold**</code> for bold, <code>#</code> for headers, and <code>{'>'}</code> for quotes.
  Our <strong>Live Preview</strong> shows you exactly how it will look when published.
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
