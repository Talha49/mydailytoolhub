import { NextResponse } from 'next/server'
import { getEmbeddings } from '@/lib/embeddings'
import { loadSubmissions, addDocument, searchSimilarityLocal, dotProduct } from '@/lib/vector-store'
import { chunkText } from '@/lib/chunker'
import { analyzeReadability } from '@/lib/readability'
import { selectKeySentences, searchWeb, fetchWebPageText } from '@/lib/search'
import { analyzeAIWriting } from '@/lib/ai-detector'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    const { text, filename, saveToDb = true } = await request.json()

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ success: false, error: 'No text content provided for checking.' }, { status: 400 })
    }

    const words = text.split(/\s+/).filter(Boolean)
    const totalWords = words.length

    if (totalWords < 5) {
      return NextResponse.json({ success: false, error: 'Document must be at least 5 words long.' }, { status: 400 })
    }

    // 1. Run scientific AI writing analysis
    const aiAnalysis = analyzeAIWriting(text)

    // 2. Select key sentences and search the live web in parallel
    const searchQueries = selectKeySentences(text, 2)
    const webDocuments = []

    if (searchQueries.length > 0) {
      try {
        // Run searches in parallel
        const searchPromises = searchQueries.map(q => searchWeb(q))
        const searchResults = await Promise.all(searchPromises)
        const uniqueUrls = Array.from(new Set(searchResults.flat())).slice(0, 2) // Limit to top 2 URLs for speed

        if (uniqueUrls.length > 0) {
          // Crawl page text in parallel with abort limits
          const crawlPromises = uniqueUrls.map(async url => {
            const pageText = await fetchWebPageText(url)
            return { url, text: pageText }
          })
          const crawledPages = await Promise.all(crawlPromises)

          // Generate embeddings for crawled web text
          for (const page of crawledPages) {
            if (!page.text || page.text.length < 50) continue
            
            const webChunks = chunkText(page.text, 150).slice(0, 10) // Limit to top 10 chunks per page to prevent lag
            if (webChunks.length === 0) continue

            const webEmbeddings = await getEmbeddings(webChunks)
            
            let hostTitle = page.url
            try {
              const parsed = new URL(page.url)
              hostTitle = parsed.hostname.replace('www.', '')
            } catch (e) {
              // Ignore parse error
            }

            webDocuments.push({
              title: hostTitle,
              url: page.url,
              chunks: webChunks.map((cText, idx) => ({
                text: cText,
                embedding: webEmbeddings[idx]
              }))
            })
          }
        }
      } catch (err) {
        console.warn('Web plagiarism search failed (falling back to database only):', err.message)
      }
    }

    // 3. Chunk the uploaded document text
    const chunks = chunkText(text, 150)
    if (chunks.length === 0) {
      return NextResponse.json({ success: false, error: 'Failed to split text into chunks.' }, { status: 400 })
    }

    // Load persistent submissions from MongoDB
    const dbSubmissions = await loadSubmissions()

    // 4. Generate embeddings for each chunk
    const chunkEmbeddings = await getEmbeddings(chunks)

    // 5. Perform similarity searches on each chunk (Local DB + Crawled Web Pages)
    const chunkResults = []
    let totalMatchSum = 0
    const matchedSourcesMap = new Map() // url/filename -> sourceMetadata

    for (let i = 0; i < chunks.length; i++) {
      const chunkTextStr = chunks[i]
      const chunkEmbedding = chunkEmbeddings[i]

      // Search local database vectors
      const localMatches = searchSimilarityLocal(chunkEmbedding, dbSubmissions, 0.40, 3)

      // Search crawled web vector chunks
      const webMatches = []
      for (const doc of webDocuments) {
        for (const wChunk of doc.chunks) {
          const score = dotProduct(chunkEmbedding, wChunk.embedding)
          if (score >= 0.40) {
            webMatches.push({
              filename: doc.title,
              url: doc.url,
              text: wChunk.text,
              similarity: Math.round(score * 100)
            })
          }
        }
      }

      // Merge and sort matches by similarity descending
      const allMatches = [...localMatches, ...webMatches]
      allMatches.sort((a, b) => b.similarity - a.similarity)

      const topMatch = allMatches[0]
      const hasMatch = topMatch && topMatch.similarity >= 40

      if (hasMatch) {
        totalMatchSum += topMatch.similarity

        const key = topMatch.url || topMatch.filename
        const existing = matchedSourcesMap.get(key)

        if (!existing || topMatch.similarity > existing.percent) {
          // Identify source type
          let type = topMatch.url ? 'Web Search Match' : 'Academic Archive'
          if (topMatch.filename.includes('Wikipedia') || (topMatch.url && topMatch.url.includes('wikipedia.org'))) {
            type = 'Wiki'
          } else if (topMatch.filename.includes('GitHub') || (topMatch.url && topMatch.url.includes('github.com'))) {
            type = 'Open Source'
          } else if (topMatch.filename.includes('W3Schools') || (topMatch.url && topMatch.url.includes('w3schools.com'))) {
            type = 'Tutorial'
          }

          matchedSourcesMap.set(key, {
            title: topMatch.filename.replace('.txt', ''),
            url: topMatch.url || '#',
            percent: topMatch.similarity,
            type
          })
        }
      }

      chunkResults.push({
        text: chunkTextStr,
        isPlagiarized: hasMatch,
        similarity: hasMatch ? topMatch.similarity : 0,
        source: hasMatch ? {
          title: topMatch.filename.replace('.txt', ''),
          url: topMatch.url || '#'
        } : null
      })
    }

    // 6. Calculate overall similarity percentage
    const similarityScore = chunks.length > 0 
      ? Math.round(totalMatchSum / chunks.length) 
      : 0

    // 7. Structure highlights map at sentence level
    const paragraphs = text.split(/\n\n+/).filter(Boolean)
    let aiSentenceCount = 0
    let totalSentenceCount = 0

    const formattedParagraphs = paragraphs.map((para) => {
      const sentences = para.match(/[^.!?]+[.!?]+(\s+|$)/g) || [para]
      
      return sentences.map((sentence) => {
        const trimmedSentence = sentence.trim()
        if (!trimmedSentence) return null

        totalSentenceCount++
        
        // Find if this sentence is inside a plagiarized chunk
        let matchingChunk = null
        for (const res of chunkResults) {
          if (res.isPlagiarized && res.text.includes(trimmedSentence)) {
            matchingChunk = res
            break
          }
        }

        if (matchingChunk) {
          return {
            text: sentence,
            type: 'plagiarism',
            similarity: matchingChunk.similarity,
            source: matchingChunk.source
          }
        }

        // Sentence-level AI transition patterns
        const isAI = /\b(moreover|furthermore|consequently|in conclusion|delve|testament|not only but also|it is important to note|by analyzing|intricate|pivotal|multifaceted|beacon|reverberate)\b/i.test(trimmedSentence)
        if (isAI) {
          aiSentenceCount++
          return {
            text: sentence,
            type: 'ai',
            aiConfidence: Math.min(95, 75 + (trimmedSentence.length % 15))
          }
        }

        // Standard style check heuristic for passive voice
        const isGrammar = /\b(is|am|are|was|were|be|been|being)\s+([a-z]+ed|written|done|taken|given|seen|known|made|built)\b/i.test(trimmedSentence)
        if (isGrammar && trimmedSentence.split(/\s+/).length > 15) {
          return {
            text: sentence,
            type: 'grammar',
            suggestion: "Passive construct. Consider rewriting in the active voice to improve clarity."
          }
        }

        return {
          text: sentence,
          type: 'none'
        }
      }).filter(Boolean)
    })

    // 8. Perform dynamic grammar rules checklist
    const grammarIssues = []
    
    // Check double spacing
    if (/\s{2,}/.test(text)) {
      grammarIssues.push({
        type: 'Formatting',
        desc: 'Excessive spacing: Multiple consecutive spaces found.',
        suggestion: 'Clean up text to use standard single spaces between words.'
      })
    }

    // Check sentence length
    let longSentences = 0
    const rawSentences = text.match(/[^.!?]+[.!?]+(\s+|$)/g) || []
    for (const sent of rawSentences) {
      if (sent.split(/\s+/).filter(Boolean).length > 35) {
        longSentences++
      }
    }
    if (longSentences > 0) {
      grammarIssues.push({
        type: 'Style',
        desc: `Cluttered phrasing: Found ${longSentences} sentences exceeding 35 words.`,
        suggestion: 'Consider breaking down complex ideas into multiple distinct sentences.'
      })
    }

    // Passive voice count
    const passiveMatches = text.match(/\b(is|am|are|was|were|be|been|being)\s+([a-z]+ed|written|done|taken|given|seen|known|made|built)\b/gi)
    if (passiveMatches && passiveMatches.length > 0) {
      grammarIssues.push({
        type: 'Grammar',
        desc: `Passive construct: Used passive voice in ${passiveMatches.length} sentences.`,
        suggestion: 'Modify passive structures to active formats to improve clarity.'
      })
    }

    // 9. Compute citations
    const citationMatches = text.match(/\[\d+\]|\([A-Za-z]+,\s+\d{4}\)/g) || []
    const citationCount = citationMatches.length

    // 10. Compute readability metrics
    const readability = analyzeReadability(text)

    // 11. Compute combined Academic Integrity Rating
    const academicScore = Math.max(10, Math.min(100, Math.round(
      100 - (similarityScore * 0.3) - (aiAnalysis.score * 0.2) - (grammarIssues.length * 2.5)
    )))

    // 12. Optionally save vectors to database
    if (saveToDb) {
      const chunksWithEmbeddings = chunks.map((chunkTextStr, idx) => ({
        text: chunkTextStr,
        embedding: chunkEmbeddings[idx]
      }))
      await addDocument(filename || 'submission.txt', text, chunksWithEmbeddings)
    }

    return NextResponse.json({
      success: true,
      scores: {
        academic: academicScore,
        similarity: similarityScore,
        ai: aiAnalysis.score,
        grammar: grammarIssues.length,
        citations: citationCount,
        readingEase: readability.readingEase,
        readingLevel: readability.readingLevel,
        perplexity: aiAnalysis.perplexity,
        burstiness: aiAnalysis.burstiness
      },
      sources: Array.from(matchedSourcesMap.values()),
      paragraphs: formattedParagraphs,
      grammarIssues,
      stats: {
        filename: filename || 'document.txt',
        words: totalWords,
        characters: text.length,
        avgSentenceLength: readability.avgSentenceLength
      }
    })

  } catch (error) {
    console.error('Integrity check request failed:', error)
    return NextResponse.json({ success: false, error: `Failed to complete check: ${error.message}` }, { status: 500 })
  }
}
