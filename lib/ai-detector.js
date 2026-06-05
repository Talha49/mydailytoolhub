/**
 * Scientific AI Writing Signature Analyzer.
 * Measures syntactic characteristics of text: vocabulary diversity (Type-Token Ratio)
 * and sentence length variance (Burstiness) to detect robotic or repetitive content.
 * 
 * @param {string} text - The input text to analyze.
 * @returns {Object} AI detection metrics and overall confidence score.
 */
export function analyzeAIWriting(text) {
  if (!text || typeof text !== 'string') {
    return {
      score: 5,
      perplexity: 'High',
      burstiness: 'High',
      stdDev: 0,
      ttr: 100
    }
  }

  // Normalize words and split
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0)
  const sentences = text.split(/[.!?]+(\s+|$)/).map(s => s.trim()).filter(s => s.length > 0)
  
  const totalWords = words.length
  const totalSentences = Math.max(1, sentences.length)
  
  if (totalWords < 5) {
    return {
      score: 5,
      perplexity: 'High',
      burstiness: 'High',
      stdDev: 0,
      ttr: 100
    }
  }

  // 1. Vocabulary Richness: Type-Token Ratio (TTR)
  // Human writing shows high vocabulary diversity. AI tends to be repetitive.
  const uniqueWords = new Set(words)
  const ttr = uniqueWords.size / totalWords
  
  // 2. Burstiness: Standard Deviation of Sentence Lengths
  // Human writers vary sentence lengths extensively. AI writes in uniform chunks.
  const sentenceLengths = sentences.map(s => s.split(/\s+/).filter(Boolean).length)
  const avgSentenceLength = totalWords / totalSentences
  const variance = sentenceLengths.reduce((acc, len) => acc + Math.pow(len - avgSentenceLength, 2), 0) / totalSentences
  const stdDev = Math.sqrt(variance)
  
  // 3. Common LLM Transition Phrasing matches
  const aiKeywords = /\b(moreover|furthermore|consequently|in conclusion|delve|testament|not only but also|it is important to note|by analyzing|intricate|pivotal|multifaceted|beacon|reverberate)\b/gi
  const aiKeywordMatches = text.match(aiKeywords) || []
  const keywordDensity = (aiKeywordMatches.length / totalWords) * 100
  
  // 4. Calculate AI Probability Score
  let score = 50 // Baseline

  // Standard deviation impact (Burstiness)
  if (stdDev > 8) {
    score -= 25 // High burstiness -> Human
  } else if (stdDev > 5) {
    score -= 10
  } else if (stdDev < 3) {
    score += 25 // Low burstiness -> AI
  }

  // TTR impact (Perplexity)
  if (ttr > 0.6) {
    score -= 15 // High richness -> Human
  } else if (ttr < 0.42) {
    score += 20 // Low richness -> AI
  }

  // Keyword density impact
  if (keywordDensity > 1.2) {
    score += 25
  } else if (keywordDensity > 0.5) {
    score += 10
  } else {
    score -= 10
  }

  // Normalize final score between 5% and 95%
  const finalScore = Math.max(5, Math.min(95, Math.round(score)))
  
  // Assign qualitative labels
  let perplexityLabel = 'High' // TTR classes
  if (ttr < 0.42) {
    perplexityLabel = 'Low'
  } else if (ttr < 0.55) {
    perplexityLabel = 'Medium'
  }
  
  let burstinessLabel = 'High' // sentence variance classes
  if (stdDev < 3.2) {
    burstinessLabel = 'Low'
  } else if (stdDev < 6.0) {
    burstinessLabel = 'Medium'
  }
  
  return {
    score: finalScore,
    perplexity: perplexityLabel,
    burstiness: burstinessLabel,
    stdDev: Math.round(stdDev * 10) / 10,
    ttr: Math.round(ttr * 100)
  }
}
