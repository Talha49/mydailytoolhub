import Breadcrumb from '@/components/layout/Breadcrumb'
import AdSlot from '@/components/sections/AdSlot'
import Accordion from '@/components/ui/Accordion'
import ToolHeader from '@/components/tools/ToolHeader'
import CronJobWorkbench from '@/components/tools/CronJobWorkbench'
import RelatedTools from '@/components/tools/RelatedTools'
import ToolSchema from '@/components/seo/ToolSchema'

export const metadata = {
  title: 'Cron Job Schedule Generator - Free Online Tool',
  description: 'Create, test, and explain cron job schedules instantly with our visual cron expression generator. Free online tool for developers and sysadmins.',
  keywords: 'cron job generator, cron expression generator, visual cron, cron schedule, crontab calculator',
  alternates: {
    canonical: 'https://www.corehubtools.com/tools/cron-job-generator',
  },
}

const TOOL_DATA = {
  title: 'Cron Job Schedule Generator',
  description: 'Generate cron expressions easily with our visual editor. Select your intervals for minutes, hours, days, and months to get the exact crontab syntax instantly.',
  category: 'Developer',
  lastUpdated: 'Nov 12, 2023',
  breadcrumbs: [
    { label: 'Tools', href: '/tools' },
    { label: 'Developer', href: '/tools/category/developer' },
    { label: 'Cron Job Generator', href: '#', active: true },
  ]
}

const FAQ_ITEMS = [
  {
    title: 'What is a Cron Job?',
    content: 'A cron job is a Linux/Unix utility that schedules commands or scripts to run automatically at a specified time and date. It is widely used for automated backups, maintenance, and periodic tasks.'
  },
  {
    title: 'How do I read a cron expression?',
    content: 'A standard cron expression consists of 5 fields separated by spaces: Minute (0-59), Hour (0-23), Day of Month (1-31), Month (1-12), and Day of Week (0-6, where 0 is Sunday). An asterisk (*) means every possible value.'
  },
  {
    title: 'Is my schedule data processed locally?',
    content: 'Yes! All cron expression generation and parsing happens entirely client-side within your browser. No data is transmitted to our servers.'
  }
]

const RELATED_TOOLS = [
  { title: 'JSON Formatter', category: 'Developer', icon: 'data_object', href: '/tools/json-formatter' },
  { title: 'Regex Tester', category: 'Developer', icon: 'bug_report', href: '/tools/regex-tester' },
  { title: 'Timestamp Converter', category: 'Utilities', icon: 'calendar_clock', href: '/tools/timestamp-converter' },
  { title: 'JWT Decoder', category: 'Developer', icon: 'vpn_key', href: '/tools/jwt-decoder' },
]

export default function CronJobGeneratorPage() {
  return (
    <div className="container-custom py-8">
      <Breadcrumb items={TOOL_DATA.breadcrumbs} />
      <ToolSchema 
        name={TOOL_DATA.title} 
        description={TOOL_DATA.description} 
        applicationCategory={TOOL_DATA.category}
        faqItems={FAQ_ITEMS}
        breadcrumbs={TOOL_DATA.breadcrumbs}
        url="https://www.corehubtools.com/tools/cron-job-generator"
      />
      
      <ToolHeader 
        title={TOOL_DATA.title} 
        description={TOOL_DATA.description} 
        category={TOOL_DATA.category}
        lastUpdated={TOOL_DATA.lastUpdated}
      />

      <AdSlot variant="leaderboard" className="mb-12" />

      {/* Cron Job Workbench */}
      <CronJobWorkbench />

      <div className="grid lg:grid-cols-3 gap-12 mt-20">
        <div className="lg:col-span-2 space-y-12">
          <section className="prose prose-blue dark:prose-invert max-w-none">
             <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Why use a visual Cron Job Generator?</h2>
             <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-6">
               Writing cron expressions by hand can be tricky and error-prone, especially when configuring complex schedules like "every Tuesday at 2:30 AM" or "every 15 minutes during business hours." Our visual <strong>Cron Job Generator</strong> simplifies this process by providing an intuitive, click-based interface.
             </p>
             <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
               Whether you are configuring server maintenance scripts, CI/CD pipelines, or database backups, our tool generates flawless crontab syntax instantly while providing human-readable explanations of when your job will execute.
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
