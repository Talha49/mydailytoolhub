import Breadcrumb from '@/components/layout/Breadcrumb'
import AdSlot from '@/components/sections/AdSlot'
import Accordion from '@/components/ui/Accordion'
import ToolHeader from '@/components/tools/ToolHeader'
import ColorConverterWorkbench from '@/components/tools/ColorConverterWorkbench'
import RelatedTools from '@/components/tools/RelatedTools'
import ToolSchema from '@/components/seo/ToolSchema'

export const metadata = {
  title: 'Color Converter & Picker - HEX, RGB, HSL, CMYK',
  description: 'Convert colors instantly between HEX, RGB, HSL, and CMYK formats. Free online color picker and palette conversion tool for web designers and developers.',
  keywords: 'color converter, color picker, hex to rgb, rgb to hsl, cmyk converter, online color tool',
  alternates: {
    canonical: 'https://www.corehubtools.com/tools/color-converter',
  },
}

const TOOL_DATA = {
  title: 'Color Converter & Picker',
  description: 'Convert color codes seamlessly between HEX, RGB, HSL, and CMYK formats. Features an interactive color picker, alpha transparency support, and instant CSS snippet generation.',
  category: 'Design',
  lastUpdated: 'Nov 18, 2023',
  breadcrumbs: [
    { label: 'Tools', href: '/tools' },
    { label: 'Design', href: '/tools/category/design' },
    { label: 'Color Converter', href: '#', active: true },
  ]
}

const FAQ_ITEMS = [
  {
    title: 'What color formats are supported?',
    content: 'Our tool supports full bidirectional conversion between HEX (with/without alpha), RGB/RGBA, HSL/HSLA, and CMYK formats, providing precise values for CSS and print design.'
  },
  {
    title: 'How does HSL differ from RGB?',
    content: 'RGB (Red, Green, Blue) represents colors based on light emission, which is standard for digital screens. HSL (Hue, Saturation, Lightness) represents colors in a more intuitive, human-friendly cylindrical coordinate system, making it easier to create harmonious color palettes.'
  },
  {
    title: 'Are my color selections private?',
    content: 'Yes! All color picking and mathematical conversion calculations are performed locally in your browser using JavaScript.'
  }
]

const RELATED_TOOLS = [
  { title: 'CSS Minifier', category: 'Developer', icon: 'palette', href: '/tools/code-minifier' },
  { title: 'Lorem Ipsum Generator', category: 'Developer', icon: 'notes', href: '/tools/lorem-ipsum-generator' },
  { title: 'HTML Entity Encoder', category: 'Utilities', icon: 'html', href: '/tools/html-encoder' },
  { title: 'QR Code Generator', category: 'Utilities', icon: 'qr_code_2', href: '/tools/qr-generator' },
]

export default function ColorConverterPage() {
  return (
    <div className="container-custom py-8">
      <Breadcrumb items={TOOL_DATA.breadcrumbs} />
      <ToolSchema 
        name={TOOL_DATA.title} 
        description={TOOL_DATA.description} 
        applicationCategory={TOOL_DATA.category}
        faqItems={FAQ_ITEMS}
        breadcrumbs={TOOL_DATA.breadcrumbs}
        url="https://www.corehubtools.com/tools/color-converter"
      />
      
      <ToolHeader 
        title={TOOL_DATA.title} 
        description={TOOL_DATA.description} 
        category={TOOL_DATA.category}
        lastUpdated={TOOL_DATA.lastUpdated}
      />

      <AdSlot variant="leaderboard" className="mb-12" />

      {/* Color Converter Workbench */}
      <ColorConverterWorkbench />

      <div className="grid lg:grid-cols-3 gap-12 mt-20">
        <div className="lg:col-span-2 space-y-12">
          <section className="prose prose-blue dark:prose-invert max-w-none">
             <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Why use an Online Color Converter?</h2>
             <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-6">
               Modern web design requires working across multiple color spaces. You might receive brand guidelines in CMYK or HEX, but need HSLA values to implement dynamic CSS hover states or transparency effects. Our <strong>Color Converter & Picker</strong> bridges this gap instantly.
             </p>
             <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
               Featuring real-time visual feedback and one-click copying for CSS rules, it streamlines your frontend development workflow while ensuring exact color fidelity across digital and print mediums.
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
