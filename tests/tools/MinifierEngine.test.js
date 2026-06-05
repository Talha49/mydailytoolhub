import { describe, it, expect } from 'vitest'
import { MinifierEngine } from '../../lib/tools/MinifierEngine'

describe('MinifierEngine', () => {
    
    // ... existing CSS/HTML tests ...
    describe('minifyCSS', () => {
        it('should remove comments and whitespace', () => {
             const css = `body { color: red; }`
             expect(MinifierEngine.minifyCSS(css)).toBe('body{color:red}')
        })
    })

    describe('minifyHTML', () => {
        it('should remove comments and collapse whitespace', () => {
            const html = `<div> <p> Hi </p> </div>`
            expect(MinifierEngine.minifyHTML(html)).toBe('<div><p> Hi </p></div>')
        })
    })

    describe('minifyJS', () => {
        // REPLACING WITH ROBUST TESTS
        
        it('should handle complex mixed content (User Report)', () => {
            const input = `
            // Utility functions
            const sum = (a, b) => {
              return a + b;
            };

            /* Async example */
            async function fetchData(url) {
              try {
                const response = await fetch(url);
                return await response.json();
              } catch (error) {
                console.error("Error:", error);
              }
            }

            // Regex & strings
            const regex = /^[A-Z]{3}-\\d{2,4}$/;
            const message = "This string contains // fake comment";

            /**
             * Execute
             */
            console.log(sum(5, 10));
            `
            
            const result = MinifierEngine.minifyJS(input)
            
            // Critical checks
            expect(result).toContain('const message="This string contains // fake comment"') // String preserved
            expect(result).toContain('console.log(sum(5,10))') // Last line preserved vs merged into string
            expect(result).not.toContain('// Utility functions') // Actual comment removed
            expect(result).toContain('const regex=/^[A-Z]{3}-\\d{2,4}$/') // Regex preserved
        })

        it('should handle regex literals containing comment markers', () => {
            const input = 'const r = /http:\\/\\//; console.log(r);'
            const result = MinifierEngine.minifyJS(input)
            expect(result).toBe('const r=/http:\\/\\//;console.log(r);')
        })

        it('should handle regex after return keyword (Edge Case)', () => {
            // "return /abc/" might be ambiguous with division "return / 10" (invalid syntax usually but context matters)
            const input = `function getRegex() { return /  regex  /; }`
            const result = MinifierEngine.minifyJS(input)
            expect(result).toBe('function getRegex(){return/  regex  /;}')
        })
    })

    describe('beautifyJS', () => {
        it('should handle strings correctly', () => {
            const input = 'const s="hello { world }";'
            const result = MinifierEngine.beautifyJS(input)
            expect(result).toContain('hello { world }') // braces inside string not broken
        })

        it('should handle regex with braces correctly (Quantifiers)', () => {
            const input = 'const r = /\\d{2,4}/;' 
            const result = MinifierEngine.beautifyJS(input)
            // Should NOT add newlines inside the regex
            expect(result).toContain('/\\d{2,4}/')
            expect(result).not.toContain('{\n')
        })
    })
    
    // ... existing beautify/validate tests (can leave them or update) ...
     describe('validate', () => {
        it('should detect HTML correctly', () => {
            expect(MinifierEngine.validate('<div></div>', 'html')).toBe(true)
        })
    })
})
