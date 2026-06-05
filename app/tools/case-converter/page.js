import Breadcrumb from '@/components/layout/Breadcrumb'
import AdSlot from '@/components/sections/AdSlot'
import Accordion from '@/components/ui/Accordion'
import ToolHeader from '@/components/tools/ToolHeader'
import CaseConverterWorkbench from '@/components/tools/CaseConverterWorkbench'
import RelatedTools from '@/components/tools/RelatedTools'
import ToolSchema from '@/components/seo/ToolSchema'

export const metadata = {
  title: 'Case Converter - Uppercase, Lowercase, Title Case',
  description: 'Convert text case instantly. Switch between UPPERCASE, lowercase, CamelCase, Snake_case, and more.',
  keywords: 'case converter, uppercase converter, lowercase converter, title case, camelCase converter',
}

const TOOL_DATA = {
  title: 'Case Converter',
  description: 'Easily fix capitalization errors or format code variables. Instantly convert text between all common case styles.',
  category: 'Writing',
  lastUpdated: 'Nov 02, 2023',
  breadcrumbs: [
    { label: 'Tools', href: '/tools' },
    { label: 'Writing', href: '/tools/category/writing' },
    { label: 'Case Converter', href: '#', active: true },
  ]
}

const FAQ_ITEMS = [
  {
    title: 'What is CamelCase?',
    content: 'CamelCase is a naming convention where words are joined without spaces, and each word (except typically the first) begins with a capital letter. Example: myVariableName.'
  },
  {
    title: 'What is Title Case?',
    content: 'Title Case Capitalizes The First Letter Of Every Word. It is commonly used for headlines and book titles.'
  }
]

const RELATED_TOOLS = [
  { title: 'Word Counter', category: 'Writing', icon: 'article', href: '/tools/word-counter' },
  { title: 'Lorem Ipsum', category: 'Developer', icon: 'notes', href: '/tools/lorem-ipsum-generator' },
  { title: 'Clean Text', category: 'Writing', icon: 'cleaning_services', href: '#' },
]

export default function CaseConverterPage() {
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

      <CaseConverterWorkbench />

      <div className="grid lg:grid-cols-3 gap-12 mt-20">
        <div className="lg:col-span-2 space-y-12">
          <section className="prose prose-blue dark:prose-invert max-w-none">
             <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Fix Accidental CAPS LOCK</h2>
             <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-6">
               Did you accidentally leave Caps Lock on? Don't retype everything. Just paste your text into our **Case Converter** and click "Sentence case" to fix it instantly. Developers can also use this to quickly format variable names.
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
