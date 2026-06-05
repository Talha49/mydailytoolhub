import { HtmlEntityProcessor } from './HtmlEntityProcessor'

/**
 * MarkdownProcessor Class
 * Converts Markdown text to HTML using regex-based parsing.
 * No external dependencies.
 */
export class MarkdownProcessor {

    /**
     * Converts markdown string to HTML.
     * @param {string} markdown 
     * @returns {string} html
     */
    static toHTML(markdown) {
        if (!markdown) return ''

        // 1. Pre-processing
        let html = markdown
            .replace(/\r\n/g, '\n') // Normalize newlines
            .replace(/\r/g, '\n')

        // 2. Block Level Elements

        // Code Blocks (```code```)
        // We handle this FIRST to protect content from other regexes
        // Use a placeholder strategy if needed, or just match and replace carefully.
        // We use a function replacement to escape the code content using HtmlEntityProcessor
        html = html.replace(/```(\w*)\n([\s\S]*?)\n```/g, (match, lang, code) => {
            const escapedCode = HtmlEntityProcessor.encode(code, 'basic')
            const langClass = lang ? ` class="language-${lang}"` : ''
            return `<pre><code${langClass}>${escapedCode}</code></pre>`
        })

        // Headers (h1-h6)
        html = html.replace(/^###### (.*$)/gim, '<h6>$1</h6>')
        html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>')
        html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>')
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>')
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>')
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>')

        // Blockquotes
        html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')

        // Horizontal Rules
        html = html.replace(/^-{3,}$/gim, '<hr />')

        // Lists (Unordered)
        // Matches - item or * item
        // This simple regex wraps each item in <li>. Wrapping in <ul> requires block detection.
        // For a lighter parser, we simple replace lines.
        // To do it properly (wrapping <ul>), we need a loop or more complex regex.
        // Simplified approach: replace bullet lines with <li>item</li>. 
        // Then we can wrap adjacent <li> with <ul> in a second pass?
        html = html.replace(/^\s*[-*] (.*$)/gim, '<li>$1</li>')
        
        // Lists (Ordered)
        html = html.replace(/^\s*\d+\. (.*$)/gim, '<li>$1</li>')
        
        // Wrap adjacent <li> in <ul> or <ol>
        // Use a heuristic: if we see <li>, check context. 
        // This is tricky with single regex. 
        // Let's settle for simple lists for now, or use a state machine if "severe" testing required for structure.
        // Given Phase 6/7 experience, users expect high quality.
        // Let's fix lists properly after other replacements.

        // 3. Inline Elements

        // Images: ![alt](url)
        html = html.replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')

        // Links: [text](url)
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')

        // Bold: **text** or __text__
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>')

        // Italic: *text* or _text_
        html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>')
        html = html.replace(/_([^_]+)_/g, '<em>$1</em>')

        // Inline Code: `text`
        html = html.replace(/`([^`]+)`/g, (match, code) => {
            return `<code>${HtmlEntityProcessor.encode(code, 'basic')}</code>`
        })

        // 4. Paragraphs and List Wrapping
        // Split by double newlines to treat as paragraphs
        const lines = html.split('\n')
        let output = []
        let inUL = false
        // let inOL = false // differentiating OL vs UL in simple replacement is hard if mapped to <li> already
        // Improved List Logic: DO NOT regex replace lists above. Do it here line by line.

        // Re-read raw markdown split? No, we already applied inline formatting.
        // Let's re-approach list handling to be robust. 
        // We will restart from step 2 for lists.
        
        // Revised Block Logic (State Machine-ish loop)
        // Actually, splitting by line is safer for structure.
        
        return this._processBlocks(markdown)
    }

    static _processBlocks(markdown) {
         const lines = markdown.split(/\n/)
         let output = []
         
         let inCodeBlock = false
         let codeBlockLang = ''
         let codeBlockContent = []
         
         let inUL = false
         let inOL = false
         
         for (let i = 0; i < lines.length; i++) {
             let line = lines[i]
             
             // --- Code Block Handling ---
             if (line.trim().startsWith('```')) {
                 if (inCodeBlock) {
                     // End block
                     const codeHtml = HtmlEntityProcessor.encode(codeBlockContent.join('\n'), 'basic')
                     const classAttr = codeBlockLang ? ` class="language-${codeBlockLang}"` : ''
                     output.push(`<pre><code${classAttr}>${codeHtml}</code></pre>`)
                     inCodeBlock = false
                     codeBlockContent = []
                     codeBlockLang = ''
                 } else {
                     // Start block
                     inCodeBlock = true
                     codeBlockLang = line.trim().slice(3).trim()
                 }
                 continue
             }
             if (inCodeBlock) {
                 codeBlockContent.push(line)
                 continue
             }

             // --- List Handling ---
             const isUL = /^\s*[-*] /.test(line)
             const isOL = /^\s*\d+\. /.test(line)
             
             if (isUL) {
                 if (!inUL) { output.push('<ul>'); inUL = true; }
                 if (inOL) { output.push('</ol>'); inOL = false; }
                 line = line.replace(/^\s*[-*] /, '')
                 output.push(`<li>${this._processInline(line)}</li>`)
                 continue
             }
             
             if (isOL) {
                 if (!inOL) { output.push('<ol>'); inOL = true; }
                 if (inUL) { output.push('</ul>'); inUL = false; }
                 line = line.replace(/^\s*\d+\. /, '')
                 output.push(`<li>${this._processInline(line)}</li>`)
                 continue
             }
             
             // Close lists if we are not in one anymore (and line is not empty? Empty line typically breaks list or just space?)
             // Standard md: empty line breaks list.
             if ((inUL || inOL) && line.trim() === '') {
                 if (inUL) output.push('</ul>'); inUL = false;
                 if (inOL) output.push('</ol>'); inOL = false;
                 continue
             }
             // If line is text but not list, close list
             if ((inUL || inOL) && line.trim() !== '') {
                  if (inUL) output.push('</ul>'); inUL = false;
                  if (inOL) output.push('</ol>'); inOL = false;
             }
             
             // --- Headers ---
             if (line.startsWith('#')) {
                 const level = line.match(/^#+/)[0].length
                 if (level <= 6) {
                     const text = line.slice(level).trim()
                     output.push(`<h${level}>${this._processInline(text)}</h${level}>`)
                     continue
                 }
             }
             
             // --- Blockquotes ---
             if (line.startsWith('> ')) {
                 output.push(`<blockquote>${this._processInline(line.slice(2))}</blockquote>`)
                 continue
             }
             
             // --- HR ---
             if (/^-{3,}$/.test(line.trim())) {
                 output.push('<hr />')
                 continue
             }
             
             // --- Tables ---
             // Detection: Line contains | and next line looks like separator |---|
             const isTableStart = line.trim().startsWith('|')
             if (isTableStart && i + 1 < lines.length) {
                 const nextLine = lines[i+1].trim()
                 // Check if next line is separator line (e.g. |---| or | :--- |)
                 // Regex: Starts with |, contains only - : | space
                 if (/^\|[\s\-:|]+\|$/.test(nextLine)) {
                      // It is a table!
                      const headers = line.trim().split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1).map(h => h.trim())
                      // Actually simpler split: split by |, remove first and last empty strings if start/end with |
                      const rawHeaders = line.trim().split('|')
                      // Remove empty start/end if they exist (standard md tables wrap in |)
                      if (line.trim().startsWith('|')) rawHeaders.shift()
                      if (line.trim().endsWith('|')) rawHeaders.pop()
                      
                      const rawSeparators = nextLine.split('|')
                      if (nextLine.startsWith('|')) rawSeparators.shift()
                      if (nextLine.endsWith('|')) rawSeparators.pop()
                      
                      const alignments = rawSeparators.map(s => {
                          s = s.trim()
                          if (s.startsWith(':') && s.endsWith(':')) return 'center'
                          if (s.endsWith(':')) return 'right'
                          return 'left'
                      })
                      
                      output.push('<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-gray-300 dark:border-gray-700">')
                      output.push('<thead><tr>')
                      rawHeaders.forEach((h, idx) => {
                          const align = alignments[idx] || 'left'
                          output.push(`<th class="border border-gray-300 dark:border-gray-700 p-2 bg-gray-100 dark:bg-gray-800 text-${align} font-bold">${this._processInline(h.trim())}</th>`)
                      })
                      output.push('</tr></thead><tbody>')
                      
                      i += 2 // Skip header and separator
                      
                      // Process Body
                      while(i < lines.length) {
                          const rowLine = lines[i].trim()
                          if (!rowLine.startsWith('|')) break // End of table
                          
                          const cells = rowLine.split('|')
                          if (rowLine.startsWith('|')) cells.shift()
                          if (rowLine.endsWith('|')) cells.pop()
                          
                          output.push('<tr>')
                          cells.forEach((c, idx) => {
                               const align = alignments[idx] || 'left'
                               output.push(`<td class="border border-gray-300 dark:border-gray-700 p-2 text-${align}">${this._processInline(c.trim())}</td>`)
                          })
                          output.push('</tr>')
                          i++
                      }
                      output.push('</tbody></table></div>')
                      i-- // Backtrack one because loop increments i
                      continue
                 }
             }
             
             // --- Paragraphs ---
             if (line.trim() === '') {
                 // Empty line
                 continue 
             }
             
             // Default: Paragraph
             // Only wrap in <p> if previous line was blank? Or always?
             // Simplest: Always wrap textual lines.
             output.push(`<p>${this._processInline(line)}</p>`)
         }
         
         if (inUL) output.push('</ul>')
         if (inOL) output.push('</ol>')
         
         return output.join('\n')
    }

    static _processInline(text) {
        let t = text
        // Images
        t = t.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
        // Links
        t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
        // Bold
        t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        t = t.replace(/__([^_]+)__/g, '<strong>$1</strong>')
        // Italic
        t = t.replace(/\*([^*]+)\*/g, '<em>$1</em>')
        t = t.replace(/_([^_]+)_/g, '<em>$1</em>')
        // Inline Code
        t = t.replace(/`([^`]+)`/g, (m, c) => `<code>${HtmlEntityProcessor.encode(c, 'basic')}</code>`)
        
        return t
    }

}
