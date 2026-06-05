import { describe, it, expect } from 'vitest'
import { MarkdownProcessor } from '../../lib/tools/MarkdownProcessor'

describe('MarkdownProcessor', () => {

    describe('Headings', () => {
        it('should parse h1 to h6', () => {
            expect(MarkdownProcessor.toHTML('# H1')).toBe('<h1>H1</h1>')
            expect(MarkdownProcessor.toHTML('## H2')).toBe('<h2>H2</h2>')
            expect(MarkdownProcessor.toHTML('###### H6')).toBe('<h6>H6</h6>')
        })
    })

    describe('Inline Formatting', () => {
        it('should parse bold', () => {
            expect(MarkdownProcessor.toHTML('**bold**')).toContain('<strong>bold</strong>')
            expect(MarkdownProcessor.toHTML('__bold__')).toContain('<strong>bold</strong>')
        })
        it('should parse italic', () => {
            expect(MarkdownProcessor.toHTML('*italic*')).toContain('<em>italic</em>')
            expect(MarkdownProcessor.toHTML('_italic_')).toContain('<em>italic</em>')
        })
        it('should parse inline code', () => {
            expect(MarkdownProcessor.toHTML('`code`')).toContain('<code>code</code>')
        })
        it('should escape html in inline code', () => {
            expect(MarkdownProcessor.toHTML('`<script>`')).toContain('<code>&lt;script&gt;</code>')
        })
    })

    describe('Lists', () => {
        it('should parse unordered lists', () => {
            const input = `
- Item 1
- Item 2
            `
            const html = MarkdownProcessor.toHTML(input.trim())
            expect(html).toContain('<ul>')
            expect(html).toContain('<li>Item 1</li>')
            expect(html).toContain('<li>Item 2</li>')
            expect(html).toContain('</ul>')
        })

        it('should parse ordered lists', () => {
            const input = `
1. First
2. Second
            `
            const html = MarkdownProcessor.toHTML(input.trim())
            expect(html).toContain('<ol>')
            expect(html).toContain('<li>First</li>')
            expect(html).toContain('<li>Second</li>')
            expect(html).toContain('</ol>')
        })
    })

    describe('Code Blocks', () => {
        it('should parse code blocks with language', () => {
             const input = `
\`\`\`javascript
const a = 10;
\`\`\`
             `
             const html = MarkdownProcessor.toHTML(input.trim())
             expect(html).toContain('<pre><code class="language-javascript">')
             expect(html).toContain('const a = 10;')
             expect(html).toContain('</code></pre>')
        })
    })

    describe('Links and Images', () => {
        it('should parse links', () => {
            expect(MarkdownProcessor.toHTML('[Google](https://google.com)')).toContain('<a href="https://google.com">Google</a>')
        })
        it('should parse images', () => {
            expect(MarkdownProcessor.toHTML('![Alt](img.jpg)')).toContain('<img src="img.jpg" alt="Alt" />')
        })
    })
    
    describe('Tables', () => {
        it('should parse basic table', () => {
            const input = `
| Name | Role |
|------|------|
| Alice | Admin |
| Bob | User |
`
            const html = MarkdownProcessor.toHTML(input.trim())
            expect(html).toContain('<table class="w-full border-collapse border border-gray-300 dark:border-gray-700">')
            expect(html).toContain('Name</th>')
            expect(html).toContain('Alice</td>')
        })

        it('should handle alignment', () => {
            const input = `
| Left | Center | Right |
| :--- | :----: | ----: |
| A | B | C |
`
            const html = MarkdownProcessor.toHTML(input.trim())
            expect(html).toContain('text-left')
            expect(html).toContain('text-center')
            expect(html).toContain('text-right')
        })
        
        it('should process inline markdown in cells', () => {
            const input = `
| Code | Bold |
|------|------|
| \`var\` | **Bold** |
`
            const html = MarkdownProcessor.toHTML(input.trim())
            expect(html).toContain('<code>var</code>')
            expect(html).toContain('<strong>Bold</strong>')
        })
    })

    describe('Mixed Content', () => {
        it('should handle paragraphs and headers', () => {
            const input = `
# Title

This is a paragraph.

> Quote
            `
            const html = MarkdownProcessor.toHTML(input.trim())
            expect(html).toContain('<h1>Title</h1>')
            expect(html).toContain('<p>This is a paragraph.</p>')
            expect(html).toContain('<blockquote>Quote</blockquote>')
        })
    })

})
