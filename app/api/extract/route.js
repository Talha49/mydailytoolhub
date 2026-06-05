import { NextResponse } from 'next/server'
import { PDFParse } from 'pdf-parse'
import mammoth from 'mammoth'
import { createWorker } from 'tesseract.js'
import { pathToFileURL } from 'url'
import path from 'path'

export const dynamic = 'force-dynamic'

// Set the PDF.js worker path to the absolute node_modules location using a file:// URL
// This prevents Next.js Turbopack from failing to resolve the worker module on Windows and other OSs
try {
  const workerPath = path.join(process.cwd(), 'node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs')
  const workerUrl = pathToFileURL(workerPath).href
  PDFParse.setWorker(workerUrl)
} catch (e) {
  console.warn('Failed to configure PDF.js worker path:', e.message)
}

// Helper to normalize and sanitize extracted text
function normalizeText(text) {
  if (!text) return ''
  return text
    .replace(/\r\n/g, '\n') // Normalize line endings
    .replace(/[^\S\r\n]+/g, ' ') // Normalize spaces (collapse duplicates, keep newlines)
    .replace(/\n{3,}/g, '\n\n') // Collapse excessive newlines
    .trim()
}

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file was uploaded.' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = file.name
    const mimeType = file.type

    let extractedText = ''

    if (mimeType === 'application/pdf') {
      const parser = new PDFParse({ data: buffer })
      const data = await parser.getText()
      extractedText = data.text
      await parser.destroy()
    } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer })
      extractedText = result.value
    } else if (mimeType === 'text/plain') {
      extractedText = buffer.toString('utf-8')
    } else if (mimeType.startsWith('image/')) {
      const worker = await createWorker('eng')
      const ret = await worker.recognize(buffer)
      extractedText = ret.data.text
      await worker.terminate()
    } else {
      return NextResponse.json({ 
        success: false, 
        error: `Unsupported file type (${mimeType}). Please upload PDF, DOCX, TXT, or Image files.` 
      }, { status: 400 })
    }

    const cleanText = normalizeText(extractedText)

    if (!cleanText) {
      return NextResponse.json({ 
        success: false, 
        error: 'We were unable to extract any readable text from this file. Make sure it is not empty or corrupted.' 
      }, { status: 400 })
    }

    // Compute basic statistics
    const characterCount = cleanText.length
    const wordCount = cleanText.split(/\s+/).length

    return NextResponse.json({
      success: true,
      text: cleanText,
      stats: {
        filename,
        words: wordCount,
        characters: characterCount
      }
    })

  } catch (error) {
    console.error('File text extraction failed:', error)
    return NextResponse.json({ 
      success: false, 
      error: `Failed to extract text: ${error.message}` 
    }, { status: 500 })
  }
}
