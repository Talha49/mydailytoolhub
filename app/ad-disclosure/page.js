import Breadcrumb from '@/components/layout/Breadcrumb'
import { APP_NAME } from '@/lib/constants'

export const metadata = {
  title: `Advertising Disclosure | ${APP_NAME}`,
  description: `Monetization and advertising transparency disclosure for ${APP_NAME}. Learn how we use Google AdSense to fund our free developer tools.`,
  alternates: {
    canonical: 'https://www.corehubtools.com/ad-disclosure',
  },
}

export default function AdDisclosurePage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Ad Disclosure', href: '/ad-disclosure', active: true },
  ]

  return (
    <div className="container-custom py-12">
      <Breadcrumb items={breadcrumbs} />
      
      <div className="max-w-4xl mx-auto mt-8 bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-medium border border-border-light dark:border-border-dark animate-fadeIn">
        <h1 className="text-3xl md:text-5xl font-black text-text-primary-light dark:text-text-primary-dark mb-6 tracking-tight">
          Advertising & Monetization Disclosure
        </h1>
        <p className="text-sm font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-widest mb-8 border-b border-border-light dark:border-border-dark pb-6">
          Published: May 18, 2026
        </p>

        <div className="prose prose-blue dark:prose-invert max-w-none space-y-8 text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
          
          <section>
            <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
              1. Keeping DevTools Pro 100% Free
            </h2>
            <p>
              At <strong>{APP_NAME}</strong>, our mission is to provide developers, students, and writers with premium, private, and high-performance browser tools. To keep these tools entirely free to use without requiring registration or premium subscriptions, we display third-party advertisements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
              2. Our Partnership with Google AdSense
            </h2>
            <p>
              We monetize our web application using <strong>Google AdSense</strong>. When you view or interact with ad units across our tool dashboards:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Google may use cookies and web beacons to serve ads based on your geographic location, browser language, and previous browsing history.</li>
              <li>We only serve ads through verified and compliant AdSense slots (leaderboards, rectangles, and responsive in-article cards) to ensure that the layout remains clean and readable.</li>
              <li>We do not share any personal coding details, formatted JSON, encrypted notes, or other data typed into our input fields with advertisers. All processing remains strictly local.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
              3. User Choice & Cookie Controls
            </h2>
            <p>
              We respect your right to control your ad personalization. You can modify your preferences via the Consent Management Platform (CMP) dialog that appears when you visit our website, or manually manage tracking through the Google Ads Settings dashboard.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
