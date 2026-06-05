import Breadcrumb from '@/components/layout/Breadcrumb'
import { APP_NAME } from '@/lib/constants'

export const metadata = {
  title: `Developer API Portal | ${APP_NAME}`,
  description: `Access high-performance developer tools, code helpers, and text processing via our unified REST API.`,
  alternates: {
    canonical: 'https://www.corehubtools.com/api',
  },
}

export default function ApiPortalPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Developer API', href: '/api', active: true },
  ]

  return (
    <div className="container-custom py-12">
      <Breadcrumb items={breadcrumbs} />
      
      <div className="max-w-4xl mx-auto mt-8 relative overflow-hidden bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-medium border border-border-light dark:border-border-dark text-center">
        {/* Decorative background glow */}
        <div className="absolute -top-40 -right-40 size-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 size-80 rounded-full bg-primary/5 blur-3xl" />
        
        <div className="relative z-10">
          <div className="size-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-[36px]">api</span>
          </div>
          
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-primary/10 text-primary uppercase tracking-widest mb-4">
            <span className="size-2 rounded-full bg-primary animate-pulse" />
            Beta Coming Soon
          </span>
          
          <h1 className="text-3xl md:text-5xl font-black text-text-primary-light dark:text-text-primary-dark mb-4 tracking-tight">
            Developer API Portal
          </h1>
          
          <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark max-w-2xl mx-auto mb-8 leading-relaxed">
            Integrate our high-performance code formatters, converters, encoders, and generators directly into your local workflows, IDEs, and CI/CD pipelines.
          </p>

          {/* Quick Mockup representing premium code interface */}
          <div className="bg-gray-950 text-gray-300 rounded-2xl p-6 text-left font-mono text-sm border border-gray-800 shadow-strong max-w-xl mx-auto mb-10 overflow-x-auto">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-3">
              <span className="size-3 rounded-full bg-error-light" />
              <span className="size-3 rounded-full bg-warning-light" />
              <span className="size-3 rounded-full bg-success-light" />
              <span className="text-xs text-gray-500 font-bold ml-2">POST /api/v1/tools/json-formatter</span>
            </div>
            <pre className="text-xs md:text-sm text-green-400">
{`curl -X POST https://api.corehubtools.com/v1/json/format \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "code": "{\\"debug\\":\\"on\\",\\"window\\":{\\"title\\":\\"DevTools Pro\\"}}" }'`}
            </pre>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 md:p-8 max-w-xl mx-auto border border-border-light dark:border-border-dark">
            <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
              Get Early Beta Access
            </h3>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-6">
              Subscribe to get notified as soon as our public API keys become available for request.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your developer email"
                required
                className="flex-1 px-4 py-3 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-primary hover:bg-primary-dark text-white text-sm font-black rounded-xl transition-all shadow-md shadow-primary/10 hover:shadow-primary/20 whitespace-nowrap"
              >
                Join Waitlist
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
