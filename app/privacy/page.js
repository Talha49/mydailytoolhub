import Breadcrumb from '@/components/layout/Breadcrumb'
import { APP_NAME } from '@/lib/constants'

export const metadata = {
  title: `Privacy Policy & Terms of Service | ${APP_NAME}`,
  description: `Privacy Policy and data processing terms for ${APP_NAME}. Learn how we protect your data with secure client-side browser processing.`,
  alternates: {
    canonical: 'https://www.corehubtools.com/privacy',
  },
}

export default function PrivacyPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Privacy Policy', href: '/privacy', active: true },
  ]

  return (
    <div className="container-custom py-12">
      <Breadcrumb items={breadcrumbs} />
      
      <div className="max-w-4xl mx-auto mt-8 bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-medium border border-border-light dark:border-border-dark animate-fadeIn">
        <h1 className="text-3xl md:text-5xl font-black text-text-primary-light dark:text-text-primary-dark mb-6 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-widest mb-8 border-b border-border-light dark:border-border-dark pb-6">
          Last Updated: May 18, 2026 • Effective Date: May 18, 2026
        </p>

        <div className="prose prose-blue dark:prose-invert max-w-none space-y-8 text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
          
          <section>
            <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
              1. Core Philosophy: Client-Side Data Processing
            </h2>
            <p>
              At <strong>{APP_NAME}</strong> (`corehubtools.com`), your privacy and data security are our absolute highest priorities. Unlike traditional web utilities that upload your files to remote servers, our platform is architected around <strong>secure client-side browser processing</strong>. 
            </p>
            <p>
              When you use tools such as our JSON Formatter, Secure Notepad, JWT Decoder, or Regex Tester, all data manipulation occurs locally inside your own device memory (via JavaScript and Web Workers). <strong>We do not upload, transmit, log, or store your input strings, files, or confidential data on our servers.</strong> Once you close your browser tab, your temporary processing data is permanently erased.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
              2. Google AdSense & Advertising Cookies
            </h2>
            <p>
              To keep our suite of developer tools 100% free for the global community, we monetize our platform using Google AdSense. Third-party vendors, including Google, use cookies to serve ads based on your prior visits to our website or other websites on the internet.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Google’s use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.
              </li>
              <li>
                You may opt out of personalized advertising by visiting <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Google Ads Settings</a>. Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://aboutads.info" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">aboutads.info</a>.
              </li>
            </ul>
            <p className="mt-4">
              For visitors from the European Economic Area (EEA) and California, we utilize a certified Consent Management Platform (CMP) to collect and manage your ad personalization preferences in full compliance with GDPR and CCPA regulations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
              3. Google Analytics 4 (GA4)
            </h2>
            <p>
              We use Google Analytics 4 (GA4) to analyze aggregated, anonymized website traffic (such as page views, bounce rates, and device types) to improve our tool suite and user experience. Google Analytics utilizes cookies to evaluate your use of the website and compile statistical reports.
            </p>
            <p>
              Your IP address is anonymized by default. We do not track or associate any personally identifiable information (PII) with your analytics session. You can prevent Google Analytics from recognizing you on return visits by disabling cookies in your browser or installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Google Analytics Opt-out Browser Add-on</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
              4. Local Storage & Browser Caching
            </h2>
            <p>
              Certain tools on our platform (such as the Secure Notepad or Dark Mode toggle) may utilize your browser's native `localStorage` to save your ongoing drafts or theme preferences. This data remains strictly on your personal hard drive and is never accessible by {APP_NAME} or any third party. You can clear this data at any time via your browser's clearing history and cache settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
              5. External Links
            </h2>
            <p>
              Our website and developer guides may contain links to external websites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.
            </p>
          </section>

          <section className="border-t border-border-light dark:border-border-dark pt-8">
            <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
              6. Contact Information
            </h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your data, please contact us at:
            </p>
            <p className="font-bold text-text-primary-light dark:text-text-primary-dark mt-2">
              privacy@corehubtools.com
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
