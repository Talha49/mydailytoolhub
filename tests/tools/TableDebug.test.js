import { describe, it, expect } from 'vitest'
import { MarkdownProcessor } from '../../lib/tools/MarkdownProcessor'

describe('MarkdownProcessor Tables', () => {
    it('should parse basic table', () => {
        const input = `
| Name | Role |
|------|------|
| Alice | Admin |
| Bob | User |
`
        const html = MarkdownProcessor.toHTML(input.trim())
        console.log('Output:', html)
            expect(html).toContain('<table class="w-full border-collapse border border-gray-300 dark:border-gray-700">')
            expect(html).toContain('Name</th>')
            expect(html).toContain('Alice</td>')
    })
})
