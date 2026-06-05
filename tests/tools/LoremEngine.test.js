import { describe, it, expect } from 'vitest'
import { LoremEngine } from '../../lib/tools/LoremEngine'

describe('LoremEngine', () => {

    it('should generate requested number of words', () => {
        const words = LoremEngine.generate(10, 'words', false)
        expect(words.split(' ').length).toBe(10)
    })

    it('should start with Lorem Ipsum when requested', () => {
        const text = LoremEngine.generate(1, 'sentences', true)
        expect(text).toMatch(/^Lorem ipsum dolor sit amet/)
    })

    it('should NOT start with Lorem Ipsum when flag is false', () => {
        const text = LoremEngine.generate(1, 'sentences', false)
        expect(text).not.toMatch(/^Lorem ipsum dolor sit amet/)
    })

    it('should generate multiple paragraphs separated by double newline', () => {
        const text = LoremEngine.generate(3, 'paragraphs', false)
        const parts = text.split('\n\n')
        expect(parts.length).toBe(3)
    })

})
