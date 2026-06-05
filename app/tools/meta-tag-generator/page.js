import Breadcrumb from '@/components/layout/Breadcrumb'
import AdSlot from '@/components/sections/AdSlot'
import Accordion from '@/components/ui/Accordion'
import ToolHeader from '@/components/tools/ToolHeader'
import MetaTagWorkbench from '@/components/tools/MetaTagWorkbench'
import RelatedTools from '@/components/tools/RelatedTools'
import ToolSchema from '@/components/seo/ToolSchema'

export const metadata = {
  title: 'Meta Tag Generator - SEO Optimization Tool',
  description: 'Generate SEO-friendly meta tags for your website. Preview title, description, and keywords tags instantly.',
  keywords: 'meta tag generator, seo tool, meta description, html meta tags, seo generator',
}

const TOOL_DATA = {
  title: 'Meta Tag Generator',
  description: 'Boost your SEO with perfect meta tags. Generate the code for your Title, Description, Keywords, and Author tags to copy-paste into your HTML.',
  category: 'Marketing',
  lastUpdated: 'Nov 12, 2023',
  breadcrumbs: [
    { label: 'Tools', href: '/tools' },
    { label: 'Marketing', href: '/tools/category/marketing' },
    { label: 'Meta Tag Generator', href: '#', active: true },
  ]
}

const FAQ_ITEMS = [
  {
    title: 'Why are Meta Tags important?',
    content: 'Meta tags provide search engines (like Google) with information about your website. They control how your site appears in search results.'
  },
  {
    title: 'How long should my description be?',
    content: 'Google typically displays the first 150-160 characters of a meta description. Keep it punchy and relevant.'
  }
]

const RELATED_TOOLS = [
  { title: 'Word Counter', category: 'Writing', icon: 'article', href: '/tools/word-counter' },
  { title: 'HTML Encoder', category: 'Developer', icon: 'html', href: '/tools/html-encoder' },
  { title: 'Case Converter', category: 'Writing', icon: 'change_circle', href: '/tools/case-converter' },
]

export default function MetaTagPage() {
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

      <MetaTagWorkbench />

      <div className="grid lg:grid-cols-3 gap-12 mt-20">
        <div className="lg:col-span-2 space-y-12">
          <section className="prose prose-blue dark:prose-invert max-w-none">
             <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Master Your SEO</h2>
             <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-6">
               Search Engine Optimization (SEO) starts with the basics. Our **Meta Tag Generator** ensures you cover all the essential tags without needing to memorize header syntax. Just fill in the form and copy the code.
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
