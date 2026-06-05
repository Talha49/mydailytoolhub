/**
 * TextAnalyzer Class
 * Analyzes string to extract word counts, chars, sentences, etc.
 */
export class TextAnalyzer {
    
    /**
     * Get statistics from text
     * @param {string} text 
     * @returns {Object} { words, chars, sentences, paragraphs, readingTime, speakingTime }
     */
    static analyze(text) {
        if (!text || text.trim().length === 0) {
            return {
                words: 0,
                chars: 0,
                sentences: 0,
                paragraphs: 0,
                readingTime: 0,
                speakingTime: 0
            }
        }

        const trimmedText = text.trim()

        // Characters
        const chars = text.length

        // Words (split by whitespace)
        // Match sequences of non-whitespace characters
        const wordMatch = trimmedText.match(/\S+/g)
        const words = wordMatch ? wordMatch.length : 0

        // Sentences (split by . ! ?)
        // Use a simple heuristic: boundary followed by whitespace or end of string
        const sentenceMatch = trimmedText.match(/[^.!?]+[.!?]+(?=\s|$)|[^.!?]+$/g)
        const sentences = sentenceMatch ? sentenceMatch.length : 0

        // Paragraphs (split by double newline or more)
        const paragraphMatch = trimmedText.split(/\n\s*\n/)
        const paragraphs = paragraphMatch.filter(p => p.trim().length > 0).length

        // Times (average reading 200 wpm, speaking 130 wpm)
        const readingTime = Math.ceil(words / 200)
        const speakingTime = Math.ceil(words / 130)

        return {
            words,
            chars,
            sentences,
            paragraphs,
            readingTime,
            speakingTime
        }
    }
}
