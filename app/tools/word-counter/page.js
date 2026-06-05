import Breadcrumb from '@/components/layout/Breadcrumb'
import AdSlot from '@/components/sections/AdSlot'
import Accordion from '@/components/ui/Accordion'
import ToolHeader from '@/components/tools/ToolHeader'
import WordCounterWorkbench from '@/components/tools/WordCounterWorkbench'
import RelatedTools from '@/components/tools/RelatedTools'
import ToolSchema from '@/components/seo/ToolSchema'

export const metadata = {
  title: 'Word Counter & Character Count - Real-time Stats',
  description: 'Count words, characters, sentences, and paragraphs in real-time. Check reading time and speaking time for your text, essays, and blog posts.',
  keywords: 'word counter, character count, sentence counter, reading time calculator, essay checker',
}

const TOOL_DATA = {
  title: 'Word Counter',
  description: 'More than just a counter. Analyze your text with detail statistics including reading time, speaking time, and keyword density visualization.',
  category: 'Writing',
  lastUpdated: 'Nov 15, 2023',
  breadcrumbs: [
    { label: 'Tools', href: '/tools' },
    { label: 'Writing', href: '/tools/category/writing' },
    { label: 'Word Counter', href: '#', active: true },
  ]
}

const FAQ_ITEMS = [
  {
    title: 'Does this count spaces?',
    content: 'Our "Character Count" metric includes spaces. We also provide a "Characters (no spaces)" metric if you need strict density analysis.'
  },
  {
    title: 'Is there a limit?',
    content: 'No hard limit. Since it runs in your browser, you can paste entire books (e.g., 200,000 words) and it will process them instantly.'
  }
]

const RELATED_TOOLS = [
  { title: 'Case Converter', category: 'Writing', icon: 'change_circle', href: '/tools/case-converter' },
  { title: 'Lorem Ipsum', category: 'Developer', icon: 'notes', href: '#' },
  { title: 'Markdown Preview', category: 'Writing', icon: 'markdown', href: '#' },
]

export default function WordCounterPage() {
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

      <WordCounterWorkbench />

      <div className="grid lg:grid-cols-3 gap-12 mt-20">
        <div className="lg:col-span-2 space-y-12">
          <section className="prose prose-blue dark:prose-invert max-w-none">
             <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Optimized for Writers</h2>
             <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-6">
               Whether you are writing a tweet (280 chars), a blog post (1500 words), or a novel, keeping track of your length is crucial. Our **Word Counter** updates instantly as you type, helping you hit your targets without breaking your flow.
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
