import Breadcrumb from '@/components/layout/Breadcrumb'
import AdSlot from '@/components/sections/AdSlot'
import Accordion from '@/components/ui/Accordion'
import ToolHeader from '@/components/tools/ToolHeader'
import UrlEncoderWorkbench from '@/components/tools/UrlEncoderWorkbench'
import RelatedTools from '@/components/tools/RelatedTools'
import ToolSchema from '@/components/seo/ToolSchema'

export const metadata = {
  title: 'URL Encoder / Decoder - Escape URL Strings',
  description: 'Online URL encoder and decoder. Convert text to URL-safe format and back. Works instantly in your browser.',
  keywords: 'url encoder, url decoder, percent encoding, uri encoder',
}

const TOOL_DATA = {
  title: 'URL Encoder / Decoder',
  description: 'Encode special characters in URLs to their percent-encoded equivalent. Essential for debugging API queries and ensuring safe data transmission.',
  category: 'Developer',
  lastUpdated: 'Nov 05, 2023',
  breadcrumbs: [
    { label: 'Tools', href: '/tools' },
    { label: 'Developer', href: '/tools/category/developer' },
    { label: 'URL Encoder', href: '#', active: true },
  ]
}

const FAQ_ITEMS = [
  {
    title: 'What represents a space in URL encoding?',
    content: 'A space is typically encoded as "%20". In some contexts (like query parameters), it might be encoded as a plus sign "+".'
  },
  {
    title: 'Why do I need to encode URLs?',
    content: 'URLs can only send a limited set of characters (ASCII). Any other characters (like spaces, emojis, or foreign letters) must be encoded to avoid breaking the link.'
  }
]

const RELATED_TOOLS = [
  { title: 'Base64 Converter', category: 'Developer', icon: 'transform', href: '/tools/base64-converter' },
  { title: 'HTML Entity Encoder', category: 'Developer', icon: 'html', href: '#' },
  { title: 'Slug Generator', category: 'Writing', icon: 'link', href: '#' },
]

// Force rebuild
export default function UrlEncoderPage() {
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

      <UrlEncoderWorkbench />

      <div className="grid lg:grid-cols-3 gap-12 mt-20">
        <div className="lg:col-span-2 space-y-12">
          <section className="prose prose-blue dark:prose-invert max-w-none">
             <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Percent Encoding Explained</h2>
             <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-6">
               URL encoding (or Percent-encoding) is a mechanism for encoding information in a Uniform Resource Identifier (URI). Characters that are not allowed in a URL (like `Space`, `!`, `#`, `$`, `&`) are replaced with a `%` followed by two hexadecimal digits.
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
