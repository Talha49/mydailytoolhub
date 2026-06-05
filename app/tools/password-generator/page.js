
import Breadcrumb from '@/components/layout/Breadcrumb'
import AdSlot from '@/components/sections/AdSlot'
import Accordion from '@/components/ui/Accordion'
import ToolHeader from '@/components/tools/ToolHeader'
import PasswordGeneratorWorkbench from '@/components/tools/PasswordGeneratorWorkbench'
import RelatedTools from '@/components/tools/RelatedTools'
import ToolSchema from '@/components/seo/ToolSchema'

export const metadata = {
  title: 'Secure Password Generator | DevTools Pro',
  description: 'Generate strong, random passwords instantly using cryptographic security. Customizable length, symbols, and strength estimation.',
  keywords: 'password generator, secure password, random string, password strength, generator tool',
}

const TOOL_DATA = {
  title: 'Password Generator',
  description: 'Generate strong, secure passwords instantly with our client-side tool. Features custom length, symbol support, and exclusion of ambitious characters.',
  category: 'Security',
  lastUpdated: 'Jan 28, 2026',
  breadcrumbs: [
    { label: 'Tools', href: '/tools' },
    { label: 'Security', href: '/tools/category/security' },
    { label: 'Password Generator', href: '#', active: true },
  ]
}

const FAQ_ITEMS = [
  {
    title: 'Is this password generator secure?',
    content: 'Yes! We use the Web Crypto API (`window.crypto.getRandomValues`) which provides cryptographically secure random number generation. Your password is generated entirely in your browser and is NEVER sent to any server.'
  },
  {
    title: 'What makes a password strong?',
    content: 'A strong password is long (12+ characters), unpredictable (high entropy), and uses a mix of uppercase letters, lowercase letters, numbers, and symbols.'
  },
  {
    title: 'Why exclude similar characters?',
    content: 'Characters like "l" (lowercase L) and "1" (one), or "O" (uppercase o) and "0" (zero) can be confusing when reading a password. Excluding them makes the password easier for humans to read and type correctly.'
  }
]

const RELATED_TOOLS = [
  { title: 'UUID Generator', category: 'Developer', icon: 'fingerprint', href: '/tools/uuid-generator' },
  { title: 'Base64 Converter', category: 'Developer', icon: 'code', href: '/tools/base64-converter' },
  { title: 'HTML Encoder', category: 'Developer', icon: 'html', href: '/tools/html-encoder' },
]

export default function PasswordGeneratorPage() {
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

      <PasswordGeneratorWorkbench />

      <div className="grid lg:grid-cols-3 gap-12 mt-20">
        <div className="lg:col-span-2 space-y-12">
          <section className="prose prose-blue dark:prose-invert max-w-none">
             <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Why Use a Random Password Generator?</h2>
             <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-6">
                Humans are terrible at being random. We tend to pick patterns (like "Password123" or birthdates) that hackers can easily guess using dictionary attacks.
                A <strong>Password Generator</strong> creates a chaotic, unpredictable string of characters that is mathematically difficult to crack.
            </p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-6">
               Our tool runs 100% in your browser, ensuring maximum privacy.
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
