import Breadcrumb from '@/components/layout/Breadcrumb'
import AdSlot from '@/components/sections/AdSlot'

import Accordion from '@/components/ui/Accordion'
import ToolHeader from '@/components/tools/ToolHeader'
import RegexWorkbench from '@/components/tools/RegexWorkbench'
import RelatedTools from '@/components/tools/RelatedTools'
import ToolSchema from '@/components/seo/ToolSchema'

export const metadata = {
  title: 'Regex Tester & Debugger - Free Online Tool',
  description: 'Test and debug JavaScript regular expressions (Regex) in real-time. Visualize matches, groups, and explain patterns instantly in your browser.',
  keywords: 'regex tester, regex debugger, regular expression, javascript regex, online regex tool',
}

const TOOL_DATA = {
  title: 'Regex Tester & Debugger',
  description: 'Write, test, and debug regular expressions with real-time highlighting. Our tool helps you understand complex patterns and visualize matches against your test strings.',
  category: 'Developer',
  lastUpdated: 'Nov 01, 2023',
  breadcrumbs: [
    { label: 'Tools', href: '/tools' },
    { label: 'Developer', href: '/tools/category/developer' },
    { label: 'Regex Tester', href: '#', active: true },
  ]
}

const FAQ_ITEMS = [
  {
    title: 'Which Regex flavor is supported?',
    content: 'We use the native JavaScript RegExp engine. This supports most standard features including lookaheads, styling, and standard character classes. It runs directly in your browser.'
  },
  {
    title: 'How do I capture groups?',
    content: 'Use parentheses ( ) to define capturing groups. Our tool will list all captured groups in the output panel below the match visualization.'
  },
  {
    title: 'Is this secure?',
    content: 'Yes. Your regex patterns and test strings are processed entirely on your device. Nothing is sent to our servers.'
  }
]

const RELATED_TOOLS = [
  { title: 'JSON Formatter', category: 'Developer', icon: 'data_object', href: '/tools/json-formatter' },
  { title: 'String Encoder', category: 'Developer', icon: 'code', href: '#' },
  { title: 'UUID Generator', category: 'Utilities', icon: 'fingerprint', href: '#' },
]

export default function RegexTesterPage() {
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

      <RegexWorkbench />

      <div className="grid lg:grid-cols-3 gap-12 mt-20">
        <div className="lg:col-span-2 space-y-12">
          <section className="prose prose-blue dark:prose-invert max-w-none">
             <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Mastering Regular Expressions</h2>
             <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-6">
               Regular expressions (Regex) are powerful tools for pattern matching and text manipulation. While they can be intimidating at first, our **Regex Tester** provides a visual playground to experiment safely.
             </p>
             <h3 className="text-lg font-bold mt-6 mb-3">Common Patterns</h3>
             <ul className="list-disc pl-5 space-y-2 text-text-secondary-light dark:text-text-secondary-dark">
                <li><code>^</code> - Start of string</li>
                <li><code>$</code> - End of string</li>
                <li><code>\d</code> - Any digit (0-9)</li>
                <li><code>\w</code> - Any word character (a-z, A-Z, 0-9, _)</li>
                <li><code>+</code> - One or more quantifiers</li>
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
