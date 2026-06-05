/**
 * Application Constants
 * 
 * Global constants used throughout the application.
 */

export const APP_NAME = 'DevTools Pro'
export const APP_DESCRIPTION = 'Free, fast, and private online utility tools for developers and content creators.'
export const APP_URL = 'https://devtools-pro.com'

// Navigation Links
export const NAV_LINKS = [
  { label: 'Tools', href: '/tools' },
  { label: 'Blog', href: '/blog' },
  { label: 'API', href: '/api' },
]

// Footer Links
export const FOOTER_LINKS = {
  tools: [
    { label: 'JSON Formatter', href: '/tools/json-formatter' },
    { label: 'Regex Tester', href: '/tools/regex-tester' },
    { label: 'Base64 Converter', href: '/tools/base64-converter' },
    { label: 'Password Generator', href: '/tools/password-generator' },
  ],
  resources: [
    { label: 'Blog / Guides', href: '/blog' },
    { label: 'API Docs', href: '/api' },
    { label: 'Support', href: 'mailto:support@corehubtools.com' },
    { label: 'Changelog', href: '/changelog' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Ad Disclosure', href: '/ad-disclosure' },
  ],
}

// Tool Categories
export const TOOL_CATEGORIES = [
  { id: 'developer', label: 'Developer', icon: 'developer_mode_tv' },
  { id: 'writing', label: 'Writing', icon: 'edit_note' },
  { id: 'design', label: 'Design', icon: 'palette' },
  { id: 'marketing', label: 'Marketing', icon: 'analytics' },
  { id: 'security', label: 'Security', icon: 'security' },
  { id: 'utilities', label: 'Utilities', icon: 'grid_view' },
]

// SEO Defaults
export const SEO_DEFAULTS = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  keywords: ['developer tools', 'online tools', 'free tools', 'web utilities'],
  ogImage: '/og-image.png',
}
