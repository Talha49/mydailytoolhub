
import Breadcrumb from '@/components/layout/Breadcrumb'
import AdSlot from '@/components/sections/AdSlot'
import Accordion from '@/components/ui/Accordion'
import ToolHeader from '@/components/tools/ToolHeader'
import QrCodeWorkbench from '@/components/tools/QrCodeWorkbench'
import RelatedTools from '@/components/tools/RelatedTools'
import ToolSchema from '@/components/seo/ToolSchema'

export const metadata = {
  title: 'QR Code Generator (Free & Private) | DevTools Pro',
  description: 'Create custom QR codes for URLs, WiFi, or text. Secure client-side generation, no data sent to server.',
  keywords: 'qr code generator, create qr code, free qr code, secure qr generator',
}

const TOOL_DATA = {
  title: 'QR Code Generator',
  description: 'Generate high-quality QR codes for your content. Customize colors and error correction levels instantly.',
  category: 'Utilities',
  lastUpdated: 'Jan 28, 2026',
  breadcrumbs: [
    { label: 'Tools', href: '/tools' },
    { label: 'Utilities', href: '/tools/category/utilities' },
    { label: 'QR Generator', href: '#', active: true },
  ]
}

const FAQ_ITEMS = [
  {
    title: 'What is Error Correction?',
    content: 'QR codes have built-in redundancy. Lower levels (L) store less data but are smaller. Higher levels (H) can survive up to 30% damage (smudges, logos) but require larger codes.'
  },
  {
    title: 'Is it free to use?',
    content: 'Yes, widely free. This tool runs entirely in your browser. Feel free to use the generated images anywhere.'
  }
]

const RELATED_TOOLS = [
  { title: 'UUID Generator', category: 'Utilities', icon: 'fingerprint', href: '/tools/uuid-generator' },
  { title: 'Base64 Converter', category: 'Developer', icon: 'code', href: '/tools/base64-converter' },
  { title: 'URL Encoder', category: 'Developer', icon: 'link', href: '/tools/url-encoder' },
]

export default function QrCodePage() {
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

      <QrCodeWorkbench />

      <div className="grid lg:grid-cols-3 gap-12 mt-20">
        <div className="lg:col-span-2 space-y-12">
          <section className="prose prose-blue dark:prose-invert max-w-none">
             <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Uses for QR Codes</h2>
             <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-6">
                Quick Response (QR) codes are ubiquitous. Use them for:
            </p>
            <ul className="list-disc pl-5 text-text-secondary-light dark:text-text-secondary-dark space-y-2 mb-6">
                <li><strong>Website Links:</strong> Direct users to a signup page or menu.</li>
                <li><strong>WiFi Access:</strong> Share network credentials securely.</li>
                <li><strong>vCards:</strong> Share contact info instantly.</li>
            </ul>
             <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-6">
                Our generator creates standard ISO/IEC 18004 codes compatible with all smartphone cameras.
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
