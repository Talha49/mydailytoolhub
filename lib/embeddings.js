import { pipeline } from '@xenova/transformers'

let extractor = null

/**
 * Lazy loads and retrieves the embedding extractor instance.
 */
async function getExtractor() {
  if (!extractor) {
    extractor = await pipeline('feature-extraction', 'Xenova/bge-small-en-v1.5')
  }
  return extractor
}

/**
 * Generates a normalized 384-dimensional vector embedding for a single text chunk.
 * @param {string} text - The input text segment.
 * @returns {Promise<number[]>} Array of floats representing the embedding.
 */
export async function getEmbedding(text) {
  if (!text || typeof text !== 'string') {
    throw new Error('Input text must be a non-empty string.')
  }
  
  const pipelineInstance = await getExtractor()
  const output = await pipelineInstance(text, { pooling: 'mean', normalize: true })
  
  return Array.from(output.data)
}

/**
 * Generates embeddings for multiple text chunks in a single batch.
 * @param {string[]} texts - Array of input text segments.
 * @returns {Promise<number[][]>} Array of float arrays representing the embeddings.
 */
export async function getEmbeddings(texts) {
  if (!Array.isArray(texts) || texts.length === 0) {
    return []
  }
  
  const pipelineInstance = await getExtractor()
  const output = await pipelineInstance(texts, { pooling: 'mean', normalize: true })
  
  const embeddings = []
  const dimension = 384
  const flatData = Array.from(output.data)
  
  for (let i = 0; i < texts.length; i++) {
    embeddings.push(flatData.slice(i * dimension, (i + 1) * dimension))
  }
  
  return embeddings
}
