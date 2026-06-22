export const ALL_TOOLS = [
    // Developer Tools
    {
      id: 'json-formatter',
      title: 'JSON Formatter',
      description: 'Validate, format, and fix JSON data instantly.',
      category: 'Developer',
      icon: 'data_object',
      href: '/tools/json-formatter',
      featured: true
    },
    {
      id: 'jwt-decoder',
      title: 'JWT Decoder',
      description: 'Decode and debug JWT tokens securely in browser.',
      category: 'Developer',
      icon: 'vpn_key',
      href: '/tools/jwt-decoder',
      featured: true
    },
    {
      id: 'regex-tester',
      title: 'Regex Tester',
      description: 'Test and debug javascript regex patterns.',
      category: 'Developer',
      icon: 'bug_report',
      href: '/tools/regex-tester',
      featured: true
    },
    {
      id: 'base64-converter',
      title: 'Base64 Converter',
      description: 'Encode and decode strings or images to Base64.',
      category: 'Developer',
      icon: 'transform',
      href: '/tools/base64-converter'
    },
    {
      id: 'url-encoder',
      title: 'URL Encoder',
      description: 'Escape special characters in URL strings.',
      category: 'Developer',
      icon: 'link',
      href: '/tools/url-encoder'
    },
    {
      id: 'code-minifier',
      title: 'Code Minifier',
      description: 'Minify JS, CSS, and HTML to reduce file size.',
      category: 'Developer',
      icon: 'javascript',
      href: '/tools/code-minifier'
    },
    {
      id: 'html-encoder',
      title: 'HTML Entity Encoder',
      description: 'Escape HTML characters for safe display.',
      category: 'Developer',
      icon: 'html',
      href: '/tools/html-encoder'
    },
    {
      id: 'lorem-ipsum-generator',
      title: 'Lorem Ipsum Generator',
      description: 'Generate placeholder text for designs.',
      category: 'Developer',
      icon: 'notes',
      href: '/tools/lorem-ipsum-generator'
    },
    {
      id: 'cron-job-generator',
      title: 'Cron Job Generator',
      description: 'Create cron schedules with a visual editor.',
      category: 'Developer',
      icon: 'schedule',
      href: '/tools/cron-job-generator'
    },
  
    // Writing Tools
    {
      id: 'docx-style-cloner',
      title: 'DOCX Style Cloner',
      description: 'Match styling and layout across Word documents.',
      category: 'Writing',
      icon: 'format_paint',
      href: '/tools/docx-style-cloner',
      featured: true
    },
    {
      id: 'markdown-preview',
      title: 'Markdown Preview',
      description: 'Write Markdown with real-time preview.',
      category: 'Writing',
      icon: 'markdown',
      href: '/tools/markdown-preview',
      featured: true
    },
    {
      id: 'word-counter',
      title: 'Word Counter',
      description: 'Count words, chars, and reading time.',
      category: 'Writing',
      icon: 'article',
      href: '/tools/word-counter'
    },
    {
      id: 'case-converter',
      title: 'Case Converter',
      description: 'Convert text case (Upper, lower, Camel, etc).',
      category: 'Writing',
      icon: 'change_circle',
      href: '/tools/case-converter'
    },
  
    // Utilities
    {
      id: 'uuid-generator',
      title: 'UUID Generator',
      description: 'Generate unique IDs (v1, v4) in bulk.',
      category: 'Utilities',
      icon: 'fingerprint',
      href: '/tools/uuid-generator'
    },
    {
      id: 'qr-generator',
      title: 'QR Code Generator',
      description: 'Create custom QR codes for WiFi and links.',
      category: 'Utilities',
      icon: 'qr_code_2',
      href: '/tools/qr-generator',
      featured: true
    },
    {
      id: 'text-diff',
      title: 'Text Diff Checker',
      description: 'Compare two text blocks for differences.',
      category: 'Utilities',
      icon: 'difference',
      href: '/tools/text-diff'
    },
    {
      id: 'timestamp-converter',
      title: 'Timestamp Converter',
      description: 'Convert Epoch to Human conversions.',
      category: 'Utilities',
      icon: 'calendar_clock',
      href: '/tools/timestamp-converter'
    },
    {
      id: 'secure-notepad',
      title: 'Secure Notepad',
      description: 'Encrypted local browser notepad.',
      category: 'Utilities',
      icon: 'lock',
      href: '/tools/secure-notepad'
    },
    {
      id: 'plagiarism-checker',
      title: 'Plagiarism Checker & AI Detector',
      description: 'Analyze documents for plagiarism, AI-generated text, and readability structures.',
      category: 'Utilities',
      icon: 'fact_check',
      href: '/tools/plagiarism-checker',
      featured: true
    },
  
    // Design
    {
      id: 'color-converter',
      title: 'Color Converter',
      description: 'Convert colors between HEX/RGB/HSL.',
      category: 'Design',
      icon: 'palette',
      href: '/tools/color-converter'
    },
  
    // Security / Marketing
    {
      id: 'password-generator',
      title: 'Password Generator',
      description: 'Create strong, secure random passwords.',
      category: 'Security',
      icon: 'password',
      href: '/tools/password-generator'
    },
    {
      id: 'meta-tag-generator',
      title: 'Meta Tag Generator',
      description: 'Generate SEO meta tags for websites.',
      category: 'Marketing',
      icon: 'search',
      href: '/tools/meta-tag-generator'
    }
  ]
  
  export const TOOL_CATEGORIES = [
    { id: 'All', label: 'All Tools', icon: 'grid_view' },
    { id: 'Developer', label: 'Developer', icon: 'developer_mode' },
    { id: 'Writing', label: 'Writing', icon: 'edit_note' },
    { id: 'Utilities', label: 'Utilities', icon: 'build' },
    { id: 'Design', label: 'Design', icon: 'palette' },
    { id: 'Security', label: 'Security', icon: 'security' },
    { id: 'Marketing', label: 'Marketing', icon: 'trending_up' }
  ]
