import Breadcrumb from '@/components/layout/Breadcrumb'
import { APP_NAME } from '@/lib/constants'

export const metadata = {
  title: `Product Changelog | ${APP_NAME}`,
  description: `Track new feature updates, tool additions, and performance optimizations on the official ${APP_NAME} changelog.`,
  alternates: {
    canonical: 'https://www.corehubtools.com/changelog',
  },
}

export default function ChangelogPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Changelog', href: '/changelog', active: true },
  ]

  const updates = [
    {
      version: 'v1.1.0',
      date: 'May 18, 2026',
      title: 'DevTools Pro Launch Edition',
      description: 'Official enterprise release of DevTools Pro, featuring a fully optimized, private tool suite, global CDN delivery, and full analytics.',
      tags: ['Release', 'Features'],
      changes: [
        'Added 20+ fully client-side developer, design, and writing utilities.',
        'Offloaded JSON Formatter logic to optimized Web Workers to keep main-thread rendering stable.',
        'Fully integrated verified GDPR/CCPA Consent Management banners.',
        'Implemented global Schema.json-LD graph schemas for all tool routes to optimize Google organic search visibility.',
      ],
    },
    {
      version: 'v1.0.0',
      date: 'April 20, 2026',
      title: 'Beta Launch',
      description: 'Initial developer preview version showcasing core client-side code formatters and encoders.',
      tags: ['Beta', 'Performance'],
      changes: [
        'Implemented core modules for Base64 Converter, JWT Decoder, and Regex Tester.',
        'Configured dark mode and system theme synchronization.',
      ],
    },
  ]

  return (
    <div className="container-custom py-12">
      <Breadcrumb items={breadcrumbs} />
      
      <div className="max-w-4xl mx-auto mt-8">
        <h1 className="text-3xl md:text-5xl font-black text-text-primary-light dark:text-text-primary-dark mb-4 tracking-tight">
          Product Updates & Changelog
        </h1>
        <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark mb-10 leading-relaxed">
          Stay up to date with new tool releases, platform performance updates, and developer features added to {APP_NAME}.
        </p>

        <div className="space-y-12">
          {updates.map((update) => (
            <div
              key={update.version}
              className="relative pl-8 md:pl-12 border-l-2 border-primary/20 dark:border-primary/10 pb-8 last:pb-0"
            >
              {/* Version Bullet Indicator */}
              <div className="absolute -left-[9px] top-1.5 size-4 rounded-full bg-primary border-4 border-white dark:border-gray-900 shadow-md" />
              
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-soft border border-border-light dark:border-border-dark hover:shadow-medium transition-all">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="text-sm font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-lg">
                    {update.version}
                  </span>
                  <span className="text-xs font-bold text-text-muted-light">
                    {update.date}
                  </span>
                  <div className="flex gap-2 ml-auto">
                    {update.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-black uppercase tracking-wider bg-gray-100 dark:bg-gray-700 text-text-secondary-light dark:text-text-secondary-dark px-2.5 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
                  {update.title}
                </h3>
                
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-6 leading-relaxed">
                  {update.description}
                </p>

                <h4 className="text-xs font-black uppercase tracking-wider text-text-primary-light dark:text-text-primary-dark mb-3">
                  Key Changes
                </h4>
                
                <ul className="list-disc pl-5 space-y-2 text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                  {update.changes.map((change, idx) => (
                    <li key={idx}>{change}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
