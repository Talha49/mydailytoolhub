import Breadcrumb from '@/components/layout/Breadcrumb'
import AdSlot from '@/components/sections/AdSlot'
import Accordion from '@/components/ui/Accordion'
import ToolHeader from '@/components/tools/ToolHeader'
import SecureNotepadWorkbench from '@/components/tools/SecureNotepadWorkbench'
import RelatedTools from '@/components/tools/RelatedTools'
import ToolSchema from '@/components/seo/ToolSchema'

export const metadata = {
  title: 'Secure Online Notepad - Encrypted Browser Notes',
  description: 'Write and store encrypted notes locally in your browser. Free secure online notepad with auto-save and clear on exit features for absolute privacy.',
  keywords: 'secure notepad, online notepad, encrypted notes, private notepad, local storage notes',
  alternates: {
    canonical: 'https://www.corehubtools.com/tools/secure-notepad',
  },
}

const TOOL_DATA = {
  title: 'Secure Online Notepad',
  description: 'A fast, private, and encrypted notepad that stores your notes locally in your browser. Features auto-save, word count, and an explicit clear on exit privacy toggle.',
  category: 'Utilities',
  lastUpdated: 'Nov 15, 2023',
  breadcrumbs: [
    { label: 'Tools', href: '/tools' },
    { label: 'Utilities', href: '/tools/category/utilities' },
    { label: 'Secure Notepad', href: '#', active: true },
  ]
}

const FAQ_ITEMS = [
  {
    title: 'How is my notepad data secured?',
    content: 'Your notes are encrypted and stored exclusively in your browser\'s LocalStorage. They are never transmitted over the internet or saved to any cloud database. Only you have access to your text.'
  },
  {
    title: 'What happens when I close the tab?',
    content: 'By default, your notes persist locally so you can resume your work later. However, you can toggle the "Clear on Exit" feature to automatically wipe all data when your session ends.'
  },
  {
    title: 'Can I use this notepad offline?',
    content: 'Yes! Once the tool page is loaded in your browser, the secure notepad functions completely offline without requiring an active internet connection.'
  }
]

const RELATED_TOOLS = [
  { title: 'Password Generator', category: 'Security', icon: 'password', href: '/tools/password-generator' },
  { title: 'Markdown Preview', category: 'Writing', icon: 'markdown', href: '/tools/markdown-preview' },
  { title: 'Word Counter', category: 'Writing', icon: 'article', href: '/tools/word-counter' },
  { title: 'Text Diff Checker', category: 'Utilities', icon: 'difference', href: '/tools/text-diff' },
]

export default function SecureNotepadPage() {
  return (
    <div className="container-custom py-8">
      <Breadcrumb items={TOOL_DATA.breadcrumbs} />
      <ToolSchema 
        name={TOOL_DATA.title} 
        description={TOOL_DATA.description} 
        applicationCategory={TOOL_DATA.category}
        faqItems={FAQ_ITEMS}
        breadcrumbs={TOOL_DATA.breadcrumbs}
        url="https://www.corehubtools.com/tools/secure-notepad"
      />
      
      <ToolHeader 
        title={TOOL_DATA.title} 
        description={TOOL_DATA.description} 
        category={TOOL_DATA.category}
        lastUpdated={TOOL_DATA.lastUpdated}
      />

      <AdSlot variant="leaderboard" className="mb-12" />

      {/* Secure Notepad Workbench */}
      <SecureNotepadWorkbench />

      <div className="grid lg:grid-cols-3 gap-12 mt-20">
        <div className="lg:col-span-2 space-y-12">
          <section className="prose prose-blue dark:prose-invert max-w-none">
             <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Why use a Secure Online Notepad?</h2>
             <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-6">
               When working with sensitive snippets of text, temporary API keys, or private drafts, pasting them into cloud-synced note apps can pose a severe security risk. Our <strong>Secure Online Notepad</strong> provides a safe, isolated sandbox right inside your browser.
             </p>
             <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
               Engineered with zero-knowledge privacy principles, your text stays encrypted on your device. With instant auto-save and dark mode support, it is the ultimate scratchpad for developers and privacy-conscious users.
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
