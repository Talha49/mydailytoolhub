import Breadcrumb from '@/components/layout/Breadcrumb'
import AdSlot from '@/components/sections/AdSlot'
import Accordion from '@/components/ui/Accordion'
import ToolHeader from '@/components/tools/ToolHeader'
import DocxStyleClonerWorkbench from '@/components/tools/DocxStyleClonerWorkbench'
import RelatedTools from '@/components/tools/RelatedTools'
import ToolSchema from '@/components/seo/ToolSchema'

export const metadata = {
  title: 'DOCX Style Cloner - Match Document Formatting Online',
  description: 'Clone formatting, fonts, color themes, and margins from one Word document (.docx) to another instantly. 100% client-side and secure.',
  keywords: 'docx style cloner, word layout matcher, match word formatting, copy docx styling, document format copier, brand guide tool',
}

const TOOL_DATA = {
  title: 'DOCX Style Cloner',
  description: 'Instantly extract typography, color schemes, and page geometries from a template Word document and apply them to another. Runs 100% locally in your browser for total privacy.',
  category: 'Writing',
  lastUpdated: 'Jun 7, 2026',
  breadcrumbs: [
    { label: 'Tools', href: '/tools' },
    { label: 'Writing', href: '/tools/category/writing' },
    { label: 'DOCX Style Cloner', href: '#', active: true },
  ]
}

const FAQ_ITEMS = [
  {
    title: 'How does the DOCX Style Cloner work?',
    content: 'Word files (.docx) are compressed ZIP archives containing styling sheets (styles.xml), themes, and layout rules. This tool unzips both documents in browser memory, extracts the styling rules and margins from the Template document, maps them onto the structure of the Target document, and recompiles the file. Your original text remains completely untouched.'
  },
  {
    title: 'Are my confidential documents uploaded to any server?',
    content: 'No. This tool runs entirely client-side using JavaScript in your web browser. Your documents are processed in your computer\'s RAM and are never uploaded to our servers. This complies with strict enterprise privacy requirements, NDAs, and data protection rules.'
  },
  {
    title: 'What does "Strip Direct Styling Overrides" do?',
    content: 'Word documents frequently contain manual formatting overrides (e.g., highlighting text and manually changing color or font size). These override the default stylesheets. Toggling this option strips these inline overrides so that the document is clean and inherits 100% of the template styles, while preserving bold, italic, and underline elements.'
  },
  {
    title: 'Can I clone headers, footers, and logo images?',
    content: 'Yes. By enabling the "Clone Headers & Footers" toggle, the tool transfers header/footer files and media directories (such as logos) from the template directly into the target document archive.'
  }
]

const RELATED_TOOLS = [
  { title: 'Plagiarism Checker & AI Detector', category: 'Utilities', icon: 'fact_check', href: '/tools/plagiarism-checker' },
  { title: 'Word Counter', category: 'Writing', icon: 'article', href: '/tools/word-counter' },
  { title: 'Case Converter', category: 'Writing', icon: 'change_circle', href: '/tools/case-converter' },
  { title: 'Text Diff Checker', category: 'Utilities', icon: 'difference', href: '/tools/text-diff' },
]

export default function DocxStyleClonerPage() {
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

      <DocxStyleClonerWorkbench />

      <div className="grid lg:grid-cols-3 gap-12 mt-20">
        <div className="lg:col-span-2 space-y-12">
          <section className="prose prose-blue dark:prose-invert max-w-none">
             <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Why Match Formatting Visually?</h2>
             <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-6">
               Adhering to corporate brand guidelines, invoice templates, and styling checklists is a common requirement in corporate teams, law firms, and universities. Manually copying formatting parameters can take hours of editing, leading to errors and inconsistencies.
             </p>
             <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
               With the DOCX Style Cloner, you can separate document structure from document aesthetics. By importing the styles, themes, margins, and headers directly into the file archive, you achieve pixel-perfect brand consistency in a fraction of a second.
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
