/**
 * Web Search and Crawling Engine.
 * Enables zero-cost plagiarism checks by crawling public search engine indexes 
 * and matching scraped page contents using vector embeddings.
 */

/**
 * Extracts unique, descriptive sentences from the input text suitable for search queries.
 * @param {string} text - The input text.
 * @param {number} limit - Maximum sentences to select.
 * @returns {string[]} Selected search queries.
 */
export function selectKeySentences(text, limit = 2) {
  if (!text) return []
  // Split into sentences and clean
  const sentences = text
    .split(/[.!?]+(\s+|$)/)
    .map(s => s.trim())
    .filter(s => s.split(/\s+/).length >= 10 && s.length < 180) // 10+ words, below DDG character limits
  
  // Sort by word count descending to select the most unique/distinct phrases
  sentences.sort((a, b) => b.length - a.length)
  
  // Return unique sentences
  return Array.from(new Set(sentences)).slice(0, limit)
}

/**
 * Queries DuckDuckGo HTML endpoint to fetch top search result URLs.
 * @param {string} query - The exact sentence to search.
 * @returns {Promise<string[]>} Array of unique result URLs.
 */
export async function searchWeb(query) {
  if (!query) return []
  try {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`
    
    const res = await fetch(url, {
      signal: AbortSignal.timeout(3000), // 3s timeout
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    })

    if (!res.ok) {
      console.warn(`Search request failed for query: "${query}" with status: ${res.status}`)
      return []
    }

    const html = await res.text()
    const urls = []
    
    // Scan class="result__url" href="..." links
    const urlRegex = /<a\s+class="result__url"\s+href="([^"]+)"/g
    let match
    
    while ((match = urlRegex.exec(html)) !== null && urls.length < 3) {
      let resultUrl = match[1]
      
      // Decode DuckDuckGo redirection link structure (uddg=...)
      if (resultUrl.includes('uddg=')) {
        try {
          const parsed = new URL(resultUrl, 'https://html.duckduckgo.com')
          const dec = parsed.searchParams.get('uddg')
          if (dec) resultUrl = dec
        } catch (e) {
          // Fallback to raw link
        }
      }
      
      // Exclude common search directories or loops
      if (resultUrl && !resultUrl.includes('duckduckgo.com') && !urls.includes(resultUrl)) {
        urls.push(resultUrl)
      }
    }
    
    return urls
  } catch (error) {
    console.error(`Web search query "${query}" failed:`, error.message)
    return []
  }
}

/**
 * Crawls a URL and strips HTML tags to return clean page text.
 * @param {string} url - The target URL.
 * @returns {Promise<string>} The stripped text content of the page.
 */
export async function fetchWebPageText(url) {
  if (!url || url === '#') return ''
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(3500), // 3.5s timeout to keep API route snappy
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    })

    if (!res.ok) return ''
    const html = await res.text()
    
    // Strip headers, scripts, CSS, and HTML comments
    let cleanText = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      // Replace generic HTML tags with spaces
      .replace(/<[^>]+>/g, ' ')
      // Standardize entities
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      // Collapse whitespace
      .replace(/\s+/g, ' ')
      .trim()

    // Limit length to avoid inflating embedding token weights
    return cleanText.substring(0, 15000)
  } catch (error) {
    console.error(`Failed to fetch web content for ${url}:`, error.message)
    return ''
  }
}
