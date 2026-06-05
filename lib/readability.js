/**
 * Counts syllables in a word using basic linguistic heuristics.
 * @param {string} word - The word to check.
 * @returns {number} The syllable count.
 */
export function countSyllables(word) {
  const cleanWord = word.toLowerCase().trim().replace(/[^a-z]/g, '')
  if (cleanWord.length <= 2) return 1

  // Remove trailing silent 'e', 'es', 'ed'
  let formattedWord = cleanWord.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
  formattedWord = formattedWord.replace(/^y/, '') // Handle y at start

  const vowels = formattedWord.match(/[aeiouy]{1,2}/g)
  return vowels ? vowels.length : 1
}

/**
 * Computes Flesch Reading Ease and estimated reading parameters.
 * @param {string} text - The input text.
 * @returns {Object} Readability statistics.
 */
export function analyzeReadability(text) {
  if (!text || typeof text !== 'string') {
    return {
      words: 0,
      sentences: 0,
      readingEase: 0,
      readingLevel: 'Empty Document',
      avgSentenceLength: 0
    }
  }

  const words = text.split(/\s+/).filter(Boolean)
  const sentences = text.match(/[^.!?]+[.!?]+(\s+|$)/g) || [text]
  
  const wordCount = words.length
  const sentenceCount = Math.max(1, sentences.length)
  
  let syllableCount = 0
  
  for (const word of words) {
    syllableCount += countSyllables(word)
  }
  
  const avgSentenceLength = wordCount / sentenceCount
  const avgSyllablesPerWord = syllableCount / Math.max(1, wordCount)
  
  // Flesch Reading Ease Formula
  let readingEase = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord)
  readingEase = Math.max(0, Math.min(100, Math.round(readingEase)))
  
  // Translate score to readability labels
  let readingLevel = 'Standard (High School)'
  if (readingEase < 30) {
    readingLevel = 'Professional (College Graduate)'
  } else if (readingEase < 50) {
    readingLevel = 'Difficult (College Student)'
  } else if (readingEase < 60) {
    readingLevel = 'Fairly Difficult (Grade 10-12)'
  } else if (readingEase < 70) {
    readingLevel = 'Standard (Grade 8-9)'
  } else if (readingEase < 80) {
    readingLevel = 'Easy (Grade 7)'
  } else if (readingEase < 90) {
    readingLevel = 'Very Easy (Grade 6)'
  } else {
    readingLevel = 'Extremely Easy (Grade 5)'
  }
  
  return {
    words: wordCount,
    sentences: sentenceCount,
    readingEase,
    readingLevel,
    avgSentenceLength: Math.round(avgSentenceLength * 10) / 10
  }
}
