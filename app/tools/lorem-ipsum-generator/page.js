import Breadcrumb from '@/components/layout/Breadcrumb'
import AdSlot from '@/components/sections/AdSlot'
import Accordion from '@/components/ui/Accordion'
import ToolHeader from '@/components/tools/ToolHeader'
import LoremIpsumWorkbench from '@/components/tools/LoremIpsumWorkbench'
import RelatedTools from '@/components/tools/RelatedTools'
import ToolSchema from '@/components/seo/ToolSchema'

export const metadata = {
  title: 'Lorem Ipsum Generator - Dummy Text Placeholder',
  description: 'Generate standard Lorem Ipsum filler text for your designs. Customize paragraph count, sentence length, and format.',
  keywords: 'lorem ipsum, dummy text, placeholder text, lipsum generator',
}

const TOOL_DATA = {
  title: 'Lorem Ipsum Generator',
  description: 'Create professional placeholder text for web design, mockups, and typography. The industry standard dummy text generator.',
  category: 'Developer',
  lastUpdated: 'Oct 10, 2023',
  breadcrumbs: [
    { label: 'Tools', href: '/tools' },
    { label: 'Developer', href: '/tools/category/developer' },
    { label: 'Lorem Ipsum', href: '#', active: true },
  ]
}

const FAQ_ITEMS = [
  {
    title: 'What is Lorem Ipsum?',
    content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. It has been the industry standard dummy text since the 1500s.'
  },
  {
    title: 'Where does it come from?',
    content: 'It comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC.'
  }
]

const RELATED_TOOLS = [
  { title: 'Word Counter', category: 'Writing', icon: 'article', href: '/tools/word-counter' },
  { title: 'HTML Encoder', category: 'Developer', icon: 'html', href: '#' },
  { title: 'Font Tester', category: 'Design', icon: 'font_download', href: '#' },
]

export default function LoremIpsumPage() {
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

      <LoremIpsumWorkbench />

      <div className="grid lg:grid-cols-3 gap-12 mt-20">
        <div className="lg:col-span-2 space-y-12">
          <section className="prose prose-blue dark:prose-invert max-w-none">
             <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">The Standard Placeholder</h2>
             <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-6">
               Designers and developers use **Lorem Ipsum** because it has a more-or-less normal distribution of letters, as opposed to using "Content here, content here", making it look like readable English. This allows viewers to focus on the layout rather than the text content.
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
