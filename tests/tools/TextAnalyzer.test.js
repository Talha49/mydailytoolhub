import { describe, it, expect } from 'vitest'
import { TextAnalyzer } from '../../lib/tools/TextAnalyzer'

describe('TextAnalyzer', () => {

    it('should return 0s for empty text', () => {
        const stats = TextAnalyzer.analyze('')
        expect(stats.words).toBe(0)
        expect(stats.chars).toBe(0)
    })

    it('should count words and characters correctly', () => {
        const stats = TextAnalyzer.analyze('Hello world')
        expect(stats.words).toBe(2)
        expect(stats.chars).toBe(11)
    })

    it('should count sentences correctly', () => {
        const stats = TextAnalyzer.analyze('Hello! How are you? I am fine.')
        expect(stats.sentences).toBe(3)
    })

    it('should count paragraphs correctly', () => {
        const stats = TextAnalyzer.analyze('Para 1\n\nPara 2\n\nPara 3')
        expect(stats.paragraphs).toBe(3)
    })

    it('should calculate reading time', () => {
        // 200 words = 1 minute reading
        const text = new Array(201).fill('word').join(' ')
        const stats = TextAnalyzer.analyze(text)
        expect(stats.readingTime).toBe(2)
    })
})
