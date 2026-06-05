
import Breadcrumb from '@/components/layout/Breadcrumb'
import AdSlot from '@/components/sections/AdSlot'
import Accordion from '@/components/ui/Accordion'
import ToolHeader from '@/components/tools/ToolHeader'
import TimestampConverterWorkbench from '@/components/tools/TimestampConverterWorkbench'
import RelatedTools from '@/components/tools/RelatedTools'
import ToolSchema from '@/components/seo/ToolSchema'

export const metadata = {
  title: 'Timestamp Converter (Epoch to Date) | DevTools Pro',
  description: 'Convert Unix timestamps to human-readable dates and vice versa. Supports Seconds, Milliseconds, ISO 8601, and local time formats.',
  keywords: 'timestamp converter, epoch converter, unix time, date to epoch, epoch to date',
}

const TOOL_DATA = {
  title: 'Timestamp Converter',
  description: 'Translate between Unix Epoch times and human-readable dates. Essential for debugging server logs and database records.',
  category: 'Utilities',
  lastUpdated: 'Jan 28, 2026',
  breadcrumbs: [
    { label: 'Tools', href: '/tools' },
    { label: 'Utilities', href: '/tools/category/utilities' },
    { label: 'Timestamp Converter', href: '#', active: true },
  ]
}

const FAQ_ITEMS = [
  {
    title: 'What is a Unix Timestamp?',
    content: 'It is the number of seconds that have elapsed since January 1, 1970 (UTC). It is widely used in computing because it represents time as a single number.'
  },
  {
    title: 'Why are there two types of Epochs?',
    content: 'Standard Unix time uses **Seconds** (10 digits). JavaScript and some modern systems use **Milliseconds** (13 digits) for higher precision. Our tool detects this automatically.'
  },
  {
    title: 'What happens in 2038?',
    content: 'The "Year 2038 problem" affects systems using signed 32-bit integers to store time, which will overflow. Most modern systems (64-bit) are already safe for billions of years.'
  }
]

const RELATED_TOOLS = [
  { title: 'UUID Generator', category: 'Utilities', icon: 'fingerprint', href: '/tools/uuid-generator' },
  { title: 'JSON Formatter', category: 'Developer', icon: 'data_object', href: '/tools/json-formatter' },
  { title: 'Base64 Converter', category: 'Developer', icon: 'code', href: '/tools/base64-converter' },
]

export default function TimestampConverterPage() {
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

      <TimestampConverterWorkbench />

      <div className="grid lg:grid-cols-3 gap-12 mt-20">
        <div className="lg:col-span-2 space-y-12">
          <section className="prose prose-blue dark:prose-invert max-w-none">
             <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Navigating Time in Code</h2>
             <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-6">
                Developers constantly juggle time formats. Backend logs often use <strong>Epoch Seconds</strong> (`1609459200`), while frontend JavaScript uses <strong>Milliseconds</strong> (`1609459200000`).
                Mistaking one for the other results in persistent bugs (like dates appearing in 1970 or 50,000 AD).
            </p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-6">
               This converter intelligently detects your input format and provides all equivalent representations instantly.
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
