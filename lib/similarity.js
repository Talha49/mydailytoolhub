/**
 * Pure JavaScript Text Similarity & N-Gram Plagiarism Detection Engine.
 * 100% serverless compatible, zero-cost, and runs at native speeds without 
 * external C++ dependencies or heavy model downloads.
 */

/**
 * Normalizes text and splits it into lowercase alphanumeric word tokens.
 */
function tokenize(text) {
  if (!text) return []
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "")
    .split(/\s+/)
    .filter(Boolean)
}

/**
 * Computes Jaccard Similarity based on 3-gram overlaps (verbatim phrase copying).
 * @param {string} textA - First text.
 * @param {string} textB - Second text.
 * @returns {number} Jaccard similarity index (0 to 1).
 */
export function computeJaccardSimilarity(textA, textB) {
  const tokensA = tokenize(textA)
  const tokensB = tokenize(textB)
  
  if (tokensA.length === 0 || tokensB.length === 0) return 0
  
  const getNgrams = (tokens, n = 3) => {
    const ngrams = new Set()
    for (let i = 0; i <= tokens.length - n; i++) {
      ngrams.add(tokens.slice(i, i + n).join(" "))
    }
    return ngrams
  }
  
  const ngramsA = getNgrams(tokensA, 3)
  const ngramsB = getNgrams(tokensB, 3)
  
  if (ngramsA.size === 0 || ngramsB.size === 0) return 0
  
  let intersectionSize = 0
  for (const ngram of ngramsA) {
    if (ngramsB.has(ngram)) {
      intersectionSize++
    }
  }
  
  const unionSize = ngramsA.size + ngramsB.size - intersectionSize
  return intersectionSize / unionSize
}

/**
 * Computes Cosine Similarity based on Term Frequency (TF) vectors (vocabulary matching).
 * @param {string} textA - First text.
 * @param {string} textB - Second text.
 * @returns {number} Cosine similarity index (0 to 1).
 */
export function computeCosineSimilarity(textA, textB) {
  const tokensA = tokenize(textA)
  const tokensB = tokenize(textB)
  
  if (tokensA.length === 0 || tokensB.length === 0) return 0
  
  const getTermFrequencies = (tokens) => {
    const tf = {}
    for (const token of tokens) {
      tf[token] = (tf[token] || 0) + 1
    }
    return tf
  }
  
  const tfA = getTermFrequencies(tokensA)
  const tfB = getTermFrequencies(tokensB)
  
  const uniqueTerms = new Set([...Object.keys(tfA), ...Object.keys(tfB)])
  
  let dotProduct = 0
  let magnitudeA = 0
  let magnitudeB = 0
  
  for (const term of uniqueTerms) {
    const valA = tfA[term] || 0
    const valB = tfB[term] || 0
    
    dotProduct += valA * valB
    magnitudeA += valA * valA;
    magnitudeB += valB * valB;
  }
  
  const magA = Math.sqrt(magnitudeA)
  const magB = Math.sqrt(magnitudeB)
  
  if (magA === 0 || magB === 0) return 0
  return dotProduct / (magA * magB)
}

/**
 * Combined Plagiarism Score.
 * Takes a weighted combination of Cosine Similarity (semantic vocab matching)
 * and Jaccard 3-gram Similarity (verbatim copypasta detection).
 * @param {string} textA - First text segment.
 * @param {string} textB - Second text segment.
 * @returns {number} Combined similarity percentage (0 to 1).
 */
export function getPlagiarismScore(textA, textB) {
  if (!textA || !textB) return 0
  
  const cosine = computeCosineSimilarity(textA, textB)
  const jaccard = computeJaccardSimilarity(textA, textB)
  
  // We prioritize exact phrase copies (Jaccard) while considering overall sentence vocabulary footprint.
  const score = Math.max(cosine * 0.6 + jaccard * 0.4, jaccard)
  return Math.min(1.0, score)
}
