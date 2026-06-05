import { describe, it, expect } from 'vitest'
import { RegexEngine } from '../../lib/tools/RegexEngine'

describe('RegexEngine', () => {
    
    describe('basic matching', () => {
        it('should find simple text matches', () => {
            // Logic: Searching for "hello" in "hello world"
            const result = RegexEngine.test('hello', 'g', 'hello world')
            expect(result.matches).toHaveLength(1)
            expect(result.matches[0].content).toBe('hello')
            expect(result.matches[0].index).toBe(0)
        })

        it('should return multiple matches with global flag', () => {
             // Logic: Searching for digits (\d) in "a1 b2 c3"
            const result = RegexEngine.test('\\d', 'g', 'a1 b2 c3')
            expect(result.matches).toHaveLength(3)
            expect(result.matches[0].content).toBe('1')
            expect(result.matches[1].content).toBe('2')
            expect(result.matches[2].content).toBe('3')
        })

        it('should handle capturing groups', () => {
            // Logic: Pattern (\w+)-(\d+) captures "Word-Number"
            const result = RegexEngine.test('(\\w+)-(\\d+)', 'g', 'item-1 off')
            expect(result.matches).toHaveLength(1)
            expect(result.matches[0].groups[0]).toBe('item') // Group 1
            expect(result.matches[0].groups[1]).toBe('1')    // Group 2
        })
    })

    describe('error handling', () => {
        it('should catch invalid regex syntax', () => {
            // Logic: Unclosed bracket is invalid syntax
            const result = RegexEngine.test('[abc', 'g', 'abc')
            expect(result.error).toBeDefined()
            expect(result.matches).toHaveLength(0)
        })
    })

    describe('edge cases', () => {
        it('should handle empty string matching without crashing', () => {
            // Logic: 'a*' matches empty string. This often causes infinite loops if not handled.
            const result = RegexEngine.test('b*', 'g', 'aaa')
            // Matches 4 times (before 'a', before 'a', before 'a', after 'a') - typical simple regex engine behavior 
            // or just ensures it finishes execution.
            expect(result.error).toBeNull()
        })
    })
})
