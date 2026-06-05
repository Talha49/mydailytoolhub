import { describe, it, expect } from 'vitest'
import { HtmlEntityProcessor } from '../../lib/tools/HtmlEntityProcessor'

describe('HtmlEntityProcessor (Severe Testing)', () => {

    describe('Encoding', () => {
        it('should encode basic reserved characters', () => {
            const input = '<script>alert("XSS")</script>'
            // Expect safe output preventing execution
            expect(HtmlEntityProcessor.encode(input)).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;')
        })

        it('should handle ampersands correctly (prevent double encode?)', () => {
            // Standard behavior: & becomes &amp;
            const input = 'Tom & Jerry'
            expect(HtmlEntityProcessor.encode(input)).toBe('Tom &amp; Jerry')
        })

        it('should encode apostrophes', () => {
             const input = "It's me"
             expect(HtmlEntityProcessor.encode(input)).toBe('It&#39;s me')
        })

        it('should encode Unicode in "all" mode', () => {
            const input = 'Copyright © 2026'
            const result = HtmlEntityProcessor.encode(input, 'all')
            expect(result).toBe('Copyright &#169; 2026')
        })

        it('should encode Emojis in "all" mode', () => {
            const input = 'Hello 🌍'
            // Earth Globe numeric entity
            const result = HtmlEntityProcessor.encode(input, 'all')
            // Don't assert exact number unless known, but verify it starts with &#
            expect(result).not.toContain('🌍')
            expect(result).toContain('&#')
        })
    })

    describe('Decoding', () => {
        it('should decode named entities', () => {
            const input = '&lt;div&gt;&copy;'
            expect(HtmlEntityProcessor.decode(input)).toBe('<div>©')
        })

        it('should decode decimal entities', () => {
            // &#60; is <, &#62; is >
            const input = '&#60;div&#62;'
            expect(HtmlEntityProcessor.decode(input)).toBe('<div>')
        })

        it('should decode hex entities', () => {
            // &#x3C; is <
            const input = '&#x3C;div&#x3E;'
            expect(HtmlEntityProcessor.decode(input)).toBe('<div>')
        })

        it('should decode mixed content', () => {
            const input = 'Tom &amp; Jerry &#169; 2026'
            expect(HtmlEntityProcessor.decode(input)).toBe('Tom & Jerry © 2026')
        })

        it('should handle malformed or unknown entities gracefully', () => {
            const input = 'This is &unknown; entity'
            expect(HtmlEntityProcessor.decode(input)).toBe('This is &unknown; entity')
        })

        it('should handle entities without semicolons (legacy tolerance)', () => {
            // Regex /&(#?[\w\d]+);?/g allows optional semicolon
            const input = '&lt' // Browser sometimes handles this, but strictly it requires ;
            // Our regex expects ;? but matching greedy word chars might consume surrounding text? 
            // Let's check safely. 
            // In our regex: `&lt` matches match=`&lt`, entity=`lt`. Map has `lt`.
            expect(HtmlEntityProcessor.decode('1 &lt 2')).toBe('1 < 2')
        })
    })

    describe('Round Trip (Critical)', () => {
        it('should preserve content after encode -> decode', () => {
            const original = '<script> 1 < 2 && 3 > "4" </script> 🤡'
            const encoded = HtmlEntityProcessor.encode(original, 'all')
            const decoded = HtmlEntityProcessor.decode(encoded)
            expect(decoded).toBe(original)
        })
    })

})
