/**
 * Splits document text into cohesive semantic chunks of approximately targetWords.
 * Respects sentence boundaries to preserve vector embedding quality.
 * @param {string} text - The input text to chunk.
 * @param {number} targetWords - The target number of words per chunk.
 * @returns {string[]} An array of text chunks.
 */
export function chunkText(text, targetWords = 150) {
  if (!text || typeof text !== 'string') {
    return []
  }

  // Split into sentences using a regex that matches sentence terminators (. ! ?)
  // while preserving the terminator.
  const sentences = text.match(/[^.!?]+[.!?]+(\s+|$)/g) || [text]
  const chunks = []
  let currentChunk = []
  let currentWordCount = 0

  for (const sentence of sentences) {
    const trimmed = sentence.trim()
    if (!trimmed) continue

    const wordCount = trimmed.split(/\s+/).filter(Boolean).length
    
    if (currentWordCount + wordCount > targetWords && currentChunk.length > 0) {
      chunks.push(currentChunk.join(' '))
      currentChunk = [trimmed]
      currentWordCount = wordCount
    } else {
      currentChunk.push(trimmed)
      currentWordCount += wordCount
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(' '))
  }

  return chunks
}
