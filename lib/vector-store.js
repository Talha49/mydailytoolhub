import dbConnect from './db.js'
import AcademicSubmission from './models/AcademicSubmission.js'
import { getPlagiarismScore } from './similarity.js'

/**
 * Calculates a dummy dot product (retained for backward compatibility if imported elsewhere).
 */
export function dotProduct(a, b) {
  return 0
}

/**
 * Fetches all academic submissions from the persistent MongoDB database.
 * Project constraints: selective loading (skips heavy full-text fields) to keep queries lightning fast.
 * @returns {Promise<Object[]>} List of submissions with chunks.
 */
export async function loadSubmissions() {
  try {
    await dbConnect()
    return await AcademicSubmission.find({}, 'filename uploadedAt chunks.id chunks.text chunks.embedding').lean()
  } catch (error) {
    console.error('Failed to load submissions from MongoDB:', error)
    return []
  }
}

/**
 * Saves a checked document to MongoDB.
 * @param {string} filename - The uploaded filename.
 * @param {string} text - The raw extracted text.
 * @param {Array<{text: string, embedding?: number[]}>} chunks - List of text chunks.
 * @returns {Promise<Object>} The saved database document.
 */
export async function addDocument(filename, text, chunks) {
  try {
    await dbConnect()
    
    const documentId = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
    const formattedChunks = chunks.map((chunk, index) => ({
      id: `${documentId}_chunk_${index}`,
      text: chunk.text,
      embedding: chunk.embedding || []
    }))

    const newSubmission = await AcademicSubmission.create({
      filename,
      text,
      chunks: formattedChunks
    })

    return newSubmission
  } catch (error) {
    console.error('Failed to add document to MongoDB:', error)
    throw error
  }
}

/**
 * Performs local similarity checks against pre-loaded database submissions in memory.
 * Avoids repeated round-trip database queries for each chunk.
 * @param {string} queryText - The text segment of the search query.
 * @param {Object[]} dbSubmissions - Pre-loaded list of database submissions.
 * @param {number} threshold - Minimum similarity index.
 * @param {number} limit - Max matches to return.
 * @returns {Array<Object>} List of matched sources.
 */
export function searchSimilarityLocal(queryText, dbSubmissions, threshold = 0.40, limit = 5) {
  const matches = []

  for (const doc of dbSubmissions) {
    if (!doc.chunks) continue
    
    for (const chunk of doc.chunks) {
      if (!chunk.text) continue
      
      const score = getPlagiarismScore(queryText, chunk.text)
      
      if (score >= threshold) {
        matches.push({
          documentId: doc._id.toString(),
          filename: doc.filename,
          uploadedAt: doc.uploadedAt,
          text: chunk.text,
          similarity: Math.round(score * 100)
        })
      }
    }
  }

  // Sort by similarity score descending
  matches.sort((a, b) => b.similarity - a.similarity)

  return matches.slice(0, limit)
}
