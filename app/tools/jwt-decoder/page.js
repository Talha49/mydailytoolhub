import Breadcrumb from '@/components/layout/Breadcrumb'
import AdSlot from '@/components/sections/AdSlot'
import Accordion from '@/components/ui/Accordion'
import ToolHeader from '@/components/tools/ToolHeader'
import JwtDecoderWorkbench from '@/components/tools/JwtDecoderWorkbench'
import RelatedTools from '@/components/tools/RelatedTools'
import ToolSchema from '@/components/seo/ToolSchema'

export const metadata = {
  title: 'JWT Decoder - Decode JSON Web Tokens',
  description: 'Decode and debug JWT tokens securely in your browser. View header, payload, and verify signatures without sending data to servers.',
  keywords: 'jwt decoder, decode jwt, json web token, jwt debugger, jwt verifier',
}

const TOOL_DATA = {
  title: 'JWT Decoder',
  description: 'Visualize and debug your JSON Web Tokens (JWT). See exactly what claims are hidden inside your tokens with our secure, client-side decoder.',
  category: 'Developer',
  lastUpdated: 'Nov 25, 2023',
  breadcrumbs: [
    { label: 'Tools', href: '/tools' },
    { label: 'Developer', href: '/tools/category/developer' },
    { label: 'JWT Decoder', href: '#', active: true },
  ]
}

const FAQ_ITEMS = [
  {
    title: 'Is it safe to paste my production tokens?',
    content: 'Yes. Every calculation happens right here in your browser using JavaScript. We never transmit your tokens or secrets to any external server.'
  },
  {
    title: 'Can I verify the signature?',
    content: 'Yes, if you assume the algorithm (e.g. HS256) and provide the secret key, we can verify if the signature matches the payload.'
  }
]

const RELATED_TOOLS = [
  { title: 'Base64 Converter', category: 'Developer', icon: 'transform', href: '/tools/base64-converter' },
  { title: 'JSON Formatter', category: 'Developer', icon: 'data_object', href: '/tools/json-formatter' },
  { title: 'URL Encoder', category: 'Developer', icon: 'link', href: '/tools/url-encoder' },
]

export default function JwtDecoderPage() {
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

      <JwtDecoderWorkbench />

      <div className="grid lg:grid-cols-3 gap-12 mt-20">
        <div className="lg:col-span-2 space-y-12">
          <section className="prose prose-blue dark:prose-invert max-w-none">
             <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Debugging Auth Tokens</h2>
             <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-6">
               JSON Web Tokens (JWT) are the standard for modern authentication. However, they are just Base64Url encoded strings. Our **JWT Decoder** helps you inspect the contents—like `sub`, `iat`, `exp`—to understand why a user might be getting a 401 Unauthorized error.
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
