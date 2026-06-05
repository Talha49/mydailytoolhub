
import Breadcrumb from '@/components/layout/Breadcrumb'
import AdSlot from '@/components/sections/AdSlot'
import Accordion from '@/components/ui/Accordion'
import ToolHeader from '@/components/tools/ToolHeader'
import UuidGeneratorWorkbench from '@/components/tools/UuidGeneratorWorkbench'
import RelatedTools from '@/components/tools/RelatedTools'
import ToolSchema from '@/components/seo/ToolSchema'

export const metadata = {
  title: 'UUID Generator (v4 & v7) | DevTools Pro',
  description: 'Generate bulk random UUIDs (v4) and time-sortable UUIDs (v7). Free online tool for developers needing unique identifiers.',
  keywords: 'uuid generator, guid generator, uuid v4, uuid v7, bulk uuid, random string',
}

const TOOL_DATA = {
  title: 'UUID Generator',
  description: 'Create universally unique identifiers (UUIDs) instantly. Supports the standard random Version 4 and the simplified, sortable Version 7.',
  category: 'Developer',
  lastUpdated: 'Jan 28, 2026',
  breadcrumbs: [
    { label: 'Tools', href: '/tools' },
    { label: 'Developer', href: '/tools/category/developer' },
    { label: 'UUID Generator', href: '#', active: true },
  ]
}

const FAQ_ITEMS = [
  {
    title: 'What is the difference between v4 and v7?',
    content: 'Version 4 is completely random, making it great for most uses but hard to index efficiently in databases. Version 7 is time-sortable (it starts with a timestamp), which makes it much faster for databases to index and sort.'
  },
  {
    title: 'Are these UUIDs truly unique?',
    content: 'Yes. The probability of a collision (two identical UUIDs) in Version 4 is roughly 1 in 2.7 quintillion. You are more likely to be hit by a meteorite than generate a duplicate UUID.'
  },
  {
    title: 'How many can I generate at once?',
    content: 'This tool is optimized to generate up to 500 UUIDs per batch directly in your browser without lag.'
  }
]

const RELATED_TOOLS = [
  { title: 'Password Generator', category: 'Security', icon: 'lock', href: '/tools/password-generator' },
  { title: 'JSON Formatter', category: 'Developer', icon: 'data_object', href: '/tools/json-formatter' },
  { title: 'Base64 Converter', category: 'Developer', icon: 'code', href: '/tools/base64-converter' },
]

export default function UuidGeneratorPage() {
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

      <UuidGeneratorWorkbench />

      <div className="grid lg:grid-cols-3 gap-12 mt-20">
        <div className="lg:col-span-2 space-y-12">
          <section className="prose prose-blue dark:prose-invert max-w-none">
             <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Understanding UUID Versions</h2>
             <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-6">
                A <strong>UUID (Universally Unique Identifier)</strong> is a 128-bit number used to identify information in computer systems.
            </p>
            <ul className="list-disc pl-5 text-text-secondary-light dark:text-text-secondary-dark space-y-2 mb-6">
                <li><strong>Version 4:</strong> The industry standard. Uses random numbers. Best for general use where sorting doesn't matter.</li>
                <li><strong>Version 7:</strong> The modern successor to v1. Includes a timestamp so IDs are generated in order. Perfect for database primary keys.</li>
            </ul>
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
