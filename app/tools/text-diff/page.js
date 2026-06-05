
import Breadcrumb from '@/components/layout/Breadcrumb'
import AdSlot from '@/components/sections/AdSlot'
import Accordion from '@/components/ui/Accordion'
import ToolHeader from '@/components/tools/ToolHeader'
import DiffViewerWorkbench from '@/components/tools/DiffViewerWorkbench'
import RelatedTools from '@/components/tools/RelatedTools'
import ToolSchema from '@/components/seo/ToolSchema'

export const metadata = {
  title: 'Text Diff Viewer (Online Compare) | DevTools Pro',
  description: 'Compare two text files or snippets and highlight differences instantly. Supports line-by-line and character-level diff checks.',
  keywords: 'text diff, diff checker, compare strings, diff viewer, online diff tool',
}

const TOOL_DATA = {
  title: 'Text Diff Checker',
  description: 'Visualize the difference between two texts. Essential for code reviews, version history comparison, and spotting changes in standard documents.',
  category: 'Developer',
  lastUpdated: 'Jan 28, 2026',
  breadcrumbs: [
    { label: 'Tools', href: '/tools' },
    { label: 'Developer', href: '/tools/category/developer' },
    { label: 'Text Diff', href: '#', active: true },
  ]
}

const FAQ_ITEMS = [
  {
    title: 'How does the diff algorithm work?',
    content: 'We use the Myers Difference Algorithm, which finds the shortest sequence of edits (insertions and deletions) to transform one text into another. It is the same standard used by Git.'
  },
  {
    title: 'Is my data private?',
    content: 'Yes! The comparison happens entirely in your browser using JavaScript. We never see or store your text.'
  }
]

const RELATED_TOOLS = [
  { title: 'JSON Formatter', category: 'Developer', icon: 'data_object', href: '/tools/json-formatter' },
  { title: 'Regex Tester', category: 'Developer', icon: 'regular_expression', href: '/tools/regex-tester' },
  { title: 'Code Minifier', category: 'Developer', icon: 'javascript', href: '/tools/code-minifier' },
]

export default function TextDiffPage() {
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

      <DiffViewerWorkbench />

      <div className="grid lg:grid-cols-3 gap-12 mt-20">
        <div className="lg:col-span-2 space-y-12">
          <section className="prose prose-blue dark:prose-invert max-w-none">
             <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Why use a Diff Tool?</h2>
             <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-6">
                Spotting small changes in large text blocks is hard for humans but easy for computers. 
                Whether you are checking a config file for typos, comparing two versions of a contract, or debugging code logic, a <strong>Diff Checker</strong> highlights exactly what changed.
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
