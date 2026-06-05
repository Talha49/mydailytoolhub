import { describe, it, expect } from 'vitest'
import { UrlProcessor } from '../../lib/tools/UrlProcessor'

describe('UrlProcessor', () => {
    
    describe('encode (Component Mode)', () => {
        it('should encode reserved characters like / and ?', () => {
            const input = 'https://example.com/search?q=hello world'
            // Expected: https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world
            const result = UrlProcessor.encode(input, true)
            expect(result).toContain('%3A') // colon
            expect(result).toContain('%2F') // slash
        })

        it('should encode spaces to %20', () => {
            const result = UrlProcessor.encode('hello world', true)
            expect(result).toBe('hello%20world')
        })
    })

    describe('encode (Full URL Mode)', () => {
        it('should PRESERVE reserved characters like / and ?', () => {
            const input = 'https://example.com/search?q=hello world'
            // Expected: https://example.com/search?q=hello%20world
            const result = UrlProcessor.encode(input, false)
            expect(result).toContain('https://') // Preserved
            expect(result).toContain('?q=')      // Preserved
            expect(result).toContain('hello%20world') // Encoded space
        })
    })

    describe('decode', () => {
        it('should decode percent-encoded sequences', () => {
            const input = 'hello%20world%21'
            expect(UrlProcessor.decode(input)).toBe('hello world!')
        })

        it('should handle malformed sequences gracefully', () => {
            const input = '%E0%A4%A' // Incomplete sequence
            const result = UrlProcessor.decode(input)
            expect(result).toContain('Error')
        })
    })
})
