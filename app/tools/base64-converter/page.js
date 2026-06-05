import Breadcrumb from '@/components/layout/Breadcrumb'
import AdSlot from '@/components/sections/AdSlot'
import Accordion from '@/components/ui/Accordion'
import ToolHeader from '@/components/tools/ToolHeader'
import Base64Workbench from '@/components/tools/Base64Workbench'
import RelatedTools from '@/components/tools/RelatedTools'
import ToolSchema from '@/components/seo/ToolSchema'

export const metadata = {
  title: 'Base64 Encoder / Decoder - Free Online Tool',
  description: 'Encode and decode Base64 strings instantly. Support for text and file conversion with a secure, client-side interface.',
  keywords: 'base64 encoder, base64 decoder, base64 converter, online base64, image to base64',
}

const TOOL_DATA = {
  title: 'Base64 Encoder / Decoder',
  description: 'Convert text or files to Base64 format and back again. Essential for debugging data URIs, API authentication headers, and binary data transmission.',
  category: 'Developer',
  lastUpdated: 'Oct 28, 2023',
  breadcrumbs: [
    { label: 'Tools', href: '/tools' },
    { label: 'Developer', href: '/tools/category/developer' },
    { label: 'Base64 Converter', href: '#', active: true },
  ]
}

const FAQ_ITEMS = [
  {
    title: 'What is Base64 encoding?',
    content: 'Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. It is commonly used to embed images directly into HTML/CSS or transmit complex data over media that are designed to deal with textual data.'
  },
  {
    title: 'Can I convert images?',
    content: 'Yes! Our tool supports both text and file inputs. You can upload an image to generate its Data URI string (e.g., data:image/png;base64...).'
  }
]

const RELATED_TOOLS = [
  { title: 'URL Encoder', category: 'Developer', icon: 'link', href: '#' },
  { title: 'JWT Decoder', category: 'Developer', icon: 'vpn_key', href: '#' },
  { title: 'Hash Generator', category: 'Security', icon: 'tag', href: '#' },
]

export default function Base64Page() {
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

      <Base64Workbench />

      <div className="grid lg:grid-cols-3 gap-12 mt-20">
        <div className="lg:col-span-2 space-y-12">
          <section className="prose prose-blue dark:prose-invert max-w-none">
             <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Understanding Base64</h2>
             <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-6">
               Base64 is a group of binary-to-text encoding schemes that represent binary data in an ASCII string format by translating it into a radix-64 representation.
             </p>
             <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
               It is extremely common in web development for embedding small assets, handling email attachments, or managing Basic Authentication headers.
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
