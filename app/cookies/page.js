import Breadcrumb from '@/components/layout/Breadcrumb'
import { APP_NAME } from '@/lib/constants'

export const metadata = {
  title: `Cookie Policy | ${APP_NAME}`,
  description: `Cookie Policy and tracking disclosure for ${APP_NAME}. Understand how Google Analytics, AdSense, and browser storage collect usage statistics.`,
  alternates: {
    canonical: 'https://www.corehubtools.com/cookies',
  },
}

export default function CookiesPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Cookie Policy', href: '/cookies', active: true },
  ]

  return (
    <div className="container-custom py-12">
      <Breadcrumb items={breadcrumbs} />
      
      <div className="max-w-4xl mx-auto mt-8 bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-medium border border-border-light dark:border-border-dark animate-fadeIn">
        <h1 className="text-3xl md:text-5xl font-black text-text-primary-light dark:text-text-primary-dark mb-6 tracking-tight">
          Cookie Policy
        </h1>
        <p className="text-sm font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-widest mb-8 border-b border-border-light dark:border-border-dark pb-6">
          Last Updated: May 18, 2026 • Effective Date: May 18, 2026
        </p>

        <div className="prose prose-blue dark:prose-invert max-w-none space-y-8 text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
          
          <section>
            <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
              1. What Are Cookies?
            </h2>
            <p>
              Cookies are small text files stored on your computer or mobile device when you visit a website. They allow the website to remember your actions, preferences, and analyze web traffic over time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
              2. How We Use Cookies
            </h2>
            <p>
              At <strong>{APP_NAME}</strong>, we use cookies for three main purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Strictly Necessary Storage</strong>: We use local storage (`localStorage`) to remember your developer configuration settings, drafts in the secure notepad, and dark/light mode preference. No tracking data is sent to our servers for this.
              </li>
              <li>
                <strong>Monetization & Advertising</strong>: Google AdSense utilizes advertising cookies to serve personalized or non-personalized ads, optimize ad loading speed, and detect fraudulent clicks.
              </li>
              <li>
                <strong>Analytics & Statistics</strong>: Google Analytics 4 (GA4) uses anonymous statistical cookies to help us track visitor traffic, browser types, and popular tools so we can optimize our codebases.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
              3. Managing Your Cookie Choices
            </h2>
            <p>
              When accessing our site, a Google-certified GDPR consent banner is presented to visitors in compliance with EU regulations. You can change your ad personalization settings at any time by clicking "Manage options" in that banner, or by visiting:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">Google Ads settings</a></li>
              <li><a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">AboutAds Opt-out</a></li>
            </ul>
          </section>

          <section className="border-t border-border-light dark:border-border-dark pt-8">
            <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
              4. Updates to This Policy
            </h2>
            <p>
              We may update our Cookie Policy from time to time. We encourage users to check this page frequently to stay informed about how we use cookies and related tracking technologies.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
