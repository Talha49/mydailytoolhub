import Breadcrumb from '@/components/layout/Breadcrumb'
import { APP_NAME } from '@/lib/constants'

export const metadata = {
  title: `Terms of Service | ${APP_NAME}`,
  description: `Terms of Service and usage agreement for ${APP_NAME}. Learn about our policies, client-side processing, and user guidelines.`,
  alternates: {
    canonical: 'https://www.corehubtools.com/terms',
  },
}

export default function TermsPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Terms of Service', href: '/terms', active: true },
  ]

  return (
    <div className="container-custom py-12">
      <Breadcrumb items={breadcrumbs} />
      
      <div className="max-w-4xl mx-auto mt-8 bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-medium border border-border-light dark:border-border-dark animate-fadeIn">
        <h1 className="text-3xl md:text-5xl font-black text-text-primary-light dark:text-text-primary-dark mb-6 tracking-tight">
          Terms of Service
        </h1>
        <p className="text-sm font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-widest mb-8 border-b border-border-light dark:border-border-dark pb-6">
          Last Updated: May 18, 2026 • Effective Date: May 18, 2026
        </p>

        <div className="prose prose-blue dark:prose-invert max-w-none space-y-8 text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
          
          <section>
            <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using <strong>{APP_NAME}</strong> (`corehubtools.com`), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
              2. Use License & Client-Side Operation
            </h2>
            <p>
              Our web applications, helper functions, and code processing utilities are designed to run fully client-side inside your local browser. Permission is granted to temporarily use the tools for personal or commercial development, writing, and design purposes.
            </p>
            <p>
              You agree that you will not:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use our utilities to generate malicious scripts, spam content, or violate international security guidelines.</li>
              <li>Attempt to reverse-engineer, modify, or scrape our tool routes or client-side assets in bulk.</li>
              <li>Use automated scripts or bots to access our static resources in a way that disrupts service performance.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
              3. Disclaimer of Warranties
            </h2>
            <p>
              The tools and materials on {APP_NAME} are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim all other warranties, including without limitation, implied warranties of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
            </p>
            <p>
              Because all code transformations (formatting, minifying, encoding) occur directly in your browser window, we are not responsible for any local data loss, compilation errors, or security misconfigurations resulting from the output of our tools.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
              4. Limitations of Liability
            </h2>
            <p>
              In no event shall {APP_NAME} or its developers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our platform, even if notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
              5. Advertising & Custom Ads
            </h2>
            <p>
              Users acknowledge that the website displays Google AdSense advertising. By using the site, you agree to comply with our cookie consent settings. Attempting to click ads fraudulently, exploit ad slots, or manipulate ad delivery mechanisms is strictly prohibited.
            </p>
          </section>

          <section className="border-t border-border-light dark:border-border-dark pt-8">
            <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
              6. Terms Modification
            </h2>
            <p>
              We reserve the right to revise these Terms of Service at any time without notice. By using this website, you are agreeing to be bound by the then-current version of these Terms of Service.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
