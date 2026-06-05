/**
 * MinifierEngine Class
 * Handles minification of CSS, JavaScript, and HTML.
 * 
 * ALGORITHM & CONCEPTS:
 * 1. **CSS Minification**:
 *    - Removes comments (`\/* ... *\/`).
 *    - Removes unnecessary whitespace (newlines, tabs).
 *    - Removes space before/after colons and braces.
 * 
 * 2. **JavaScript Minification (Safe Mode)**:
 *    - Removes single-line comments (`//`) and multi-line comments (`\/* ... *\/`).
 *    - Collapses whitespace while preserving strings.
 *    - note: This is a "light" minifier. It does not rename variables (mangle) or perform AST-based optimization
 *      to avoid complex dependencies like Terser in this lightweight tool.
 * 
 * 3. **HTML Minification**:
 *    - Removes standard HTML comments (`<!-- ... -->`).
 *    - Collapses whitespace between tags.
 */
export class MinifierEngine {
    
    /**
     * Minifies regular CSS code.
     * @param {string} code 
     * @returns {string}
     */
    static minifyCSS(code) {
        if (!code) return ''
        return code
            .replace(/\/\*[\s\S]*?\*\//g, "") // Remove comments
            .replace(/\s+/g, " ")             // Collapse whitespace
            .replace(/\s*([{}:;])\s*/g, "$1") // Remove spaces around delimiters
            .replace(/;}/g, "}")              // Remove last semicolon
            .trim()
    }

    /**
     * Minifies HTML code.
     * @param {string} code 
     * @returns {string}
     */
    static minifyHTML(code) {
        if (!code) return ''
        return code
            .replace(/<!--[\s\S]*?-->/g, "")  // Remove comments
            .replace(/>\s+</g, "><")          // Remove space between tags
            .replace(/\s+/g, " ")             // Collapse internal whitespace
            .trim()
    }

    /**
     * Minifies JavaScript code using a state machine (Tokenizer).
     * Handles strings, regex, and comments robustly.
     * @param {string} code 
     * @returns {string}
     */
    static minifyJS(code) {
        if (!code) return ''
        
        let output = ''
        let i = 0
        const len = code.length
        
        // Contexts
        let inString = false        // false | '"' | "'" | '`'
        let stringChar = ''
        let inComment = false       // false | 'single' | 'multi'
        let inRegex = false
        
        // Tokenizer State
        // We need to track the "previous semantic token" to detect Regex syntax
        let lastToken = '' 
        let currentWord = '' // buffer for "return", "var", "function", "variableName"

        const flushWord = () => {
            if (currentWord) {
                lastToken = currentWord
                currentWord = ''
            }
        }

        while (i < len) {
            const char = code[i]
            const nextChar = code[i+1]
            const prevChar = i > 0 ? code[i-1] : ''

            // --- STRING CONTEXT ---
            if (inString) {
                output += char
                if (char === stringChar && prevChar !== '\\') {
                    inString = false
                    // String is a token/value
                    lastToken = 'STRING' 
                }
                i++
                continue
            }

            // --- COMMENT CONTEXT ---
            if (inComment === 'single') {
                if (char === '\n') {
                    inComment = false
                    // A comment is semantically whitespace (mostly), usually doesn't affect lastToken expected for regex?
                    // e.g. return //comment \n /regex/ -> Valid. 
                    // So we do NOT update lastToken when comment ends.
                }
                i++
                continue
            }
            if (inComment === 'multi') {
                if (char === '*' && nextChar === '/') {
                    inComment = false
                    i += 2
                } else {
                    i++
                }
                continue
            }
            
            // --- REGEX CONTEXT ---
            if (inRegex) {
                output += char
                if (char === '/' && prevChar !== '\\') {
                    inRegex = false
                    lastToken = 'REGEX'
                }
                i++
                continue
            }

            // --- CODE CONTEXT ---

            // 1. Strings
            if (char === '"' || char === "'" || char === '`') {
                flushWord()
                inString = true
                stringChar = char
                output += char
                i++
                continue
            }

            // 2. Comments
            if (char === '/' && nextChar === '/') {
                flushWord()
                inComment = 'single'
                i += 2
                continue
            }
            if (char === '/' && nextChar === '*') {
                flushWord()
                inComment = 'multi'
                i += 2
                continue
            }

            // 3. Regex Start vs Division
            if (char === '/') {
                flushWord()
                // Check lastToken to decide
                if (this._isRegexStart(lastToken)) {
                    inRegex = true
                    output += char
                    i++
                    continue
                }
                // Else it is division, treated as operator
                output += char
                lastToken = '/'
                i++
                continue
            }

            // 4. Whitespace
            if (/\s/.test(char)) {
                flushWord()
                // Collapsing logic:
                // Only add space if separating two alphanumerics
                // We check last output char.
                // Or simpler: If we just finished a word, and next char is word, we need space.
                // But we don't look ahead easily.
                // Let's use the standard "safe space" logic roughly
                
                // If the last thing output was a word/keyword, and the next significant char is also word/keyword
                // we need a space.
                
                // Let's peek ahead skipping whitespace
                let j = i + 1
                while (j < len && /\s/.test(code[j])) j++
                if (j < len) {
                     const nextSig = code[j]
                     // If both are word-like, we need space
                     // But we rely on 'currentWord' being flushed into 'lastToken' already?
                     // No, currentWord is what we JUST finished or empty.
                     // If lastToken is word-like and nextSig is word-like
                     // e.g. "return" ... "true"
                     if (this._isWord(lastToken) && this._isWordChar(nextSig)) {
                         // Only add space if we haven't already
                         if (!output.endsWith(' ')) output += ' '
                     }
                }
                i++
                continue
            }

            // 5. Normal Char (Alphanumeric or Operator)
            if (this._isWordChar(char)) {
                currentWord += char
                output += char
            } else {
                // Operator (like ( ) = ; etc)
                flushWord()
                lastToken = char
                output += char
            }
            i++
        }
        
        return output.trim()
    }

    static _isRegexStart(token) {
        if (!token) return true
        // Keywords that trigger regex
        const keywords = ['case', 'else', 'in', 'of', 'instanceof', 'new', 'return', 'throw', 'typeof', 'void', 'yield', 'await', 'delete']
        if (keywords.includes(token)) return true
        
        // Operators
        // ( [ { = ; : ? ! , | & ^ ~ * + - % < >
        // Note: ')' and ']' usually mean division follows (e.g. (a)/b )
        return /^[([{:?!=,;&|^~*+%<>-]$/.test(token)
    }

    static _isWordChar(char) {
        return /[\w$]/.test(char)
    }
    
    static _isWord(token) {
        return /^[\w$]+$/.test(token)
    }

    /**
     * Formats (Beautifies) JavaScript code.
     * Uses a state machine to track indentation levels and contexts.
     * @param {string} code 
     * @returns {string}
     */
    static beautifyJS(code) {
        if (!code) return ''
        let output = ''
        let indentLevel = 0
        const indentString = '  ' // 2 spaces
        
        let i = 0
        // Clean input first of simple whitespace logic, but keep structure? 
        // Actually, mixing a tokenizer and formatter is tricky if we don't start clean.
        // Let's rely on the tokenizer to handle whitespace collapse/expand.
        // We will process the raw code.
        const len = code.length
        
        let inString = false        
        let stringChar = ''
        let inComment = false       
        let inRegex = false
        
        let lastToken = '' 
        let currentWord = '' 
        
        // Helper to output indented new line
        const newLine = () => {
             // Trim trailing space from last line
             output = output.trimEnd()
             output += '\n' + indentString.repeat(indentLevel)
        }

        while (i < len) {
            const char = code[i]
            const nextChar = code[i+1]
            const prevChar = i > 0 ? code[i-1] : ''

            // --- CONTEXT: STRING ---
            if (inString) {
                output += char
                if (char === stringChar && prevChar !== '\\') {
                    inString = false
                    lastToken = 'STRING'
                }
                i++
                continue
            }

            // --- CONTEXT: COMMENT ---
            if (inComment === 'single') {
                output += char
                if (char === '\n') {
                    inComment = false
                    // Keep newline for single comments
                    newLine() 
                }
                i++
                continue
            }
            if (inComment === 'multi') {
                output += char
                if (char === '*' && nextChar === '/') {
                    inComment = false
                    output += '/'
                    i += 2
                    // Usually we want a newline after multi-line comment block
                    // but not always (e.g. /* inline */). 
                    // Let's leave whitespace handling to next chars or token logic.
                } else {
                    i++
                }
                continue
            }
            
            // --- CONTEXT: REGEX ---
            if (inRegex) {
                output += char
                if (char === '/' && prevChar !== '\\') {
                    inRegex = false
                    lastToken = 'REGEX'
                }
                i++
                continue
            }

            // --- CONTEXT: CODE ---
            
            // 1. Strings
            if (char === '"' || char === "'" || char === '`') {
                inString = true
                stringChar = char
                output += char
                i++
                continue
            }

            // 2. Comments
            if (char === '/' && nextChar === '/') {
                inComment = 'single'
                output += '//'
                i += 2
                continue
            }
            if (char === '/' && nextChar === '*') {
                inComment = 'multi'
                output += '/*'
                i += 2
                continue
            }

            // 3. Regex Start vs Division
            if (char === '/') {
                // Check recent token (simplified logic from minifyJS)
                // We use our helper and lastToken
                // Note: we need to maintain 'lastToken' correctly in this loop too.
                // We only update lastToken when we hit a non-whitespace semantic char/word.
                
                // Need to flush word if we were reading one? 
                // In formatter, we process char by char. If we hit '/', we might have just finished a word.
                // But we don't have a 'currentWord' buffer here, we are outputting directly constantly.
                // So 'lastToken' needs to be updated whenever we output a semantic char.
                // This is harder than Minifier where we buffer/flush.
                
                // Let's try heuristic: "What was the last non-whitespace char outputted?"
                // No, 'return /regex/' -> Last output is 'return' (maybe space). 
                // So we can look at 'output' trimming space.
                
                const trimmedOutput = output.trim()
                const lastCharOutput = trimmedOutput.length > 0 ? trimmedOutput[trimmedOutput.length - 1] : ''
                
                // For keywords like 'return', we need to check the last WORD outputted.
                const lastWordMatch = trimmedOutput.match(/(\w+)$/)
                const lastWord = lastWordMatch ? lastWordMatch[1] : ''
                const lastThing = lastWord || lastCharOutput
                
                if (this._isRegexStart(lastThing) || this._isRegexStart(lastCharOutput)) {
                     inRegex = true
                     output += char
                     i++
                     continue
                }
                output += char
                lastToken = '/'
                i++
                continue
            }

            // 4. Formatting Logic (Braces, Semicolons)
            if (char === '{') {
                indentLevel++
                if (!output.endsWith(' ')) output += ' ' // Force space before {
                output += '{\n' + indentString.repeat(indentLevel)
                i++
                continue
            }
            if (char === '}') {
                indentLevel = Math.max(0, indentLevel - 1)
                // If we are not already on a new line (ignoring current indent), add one
                // Simple logic: remove trailing whitespace, add newline
                output = output.trimEnd()
                output += '\n' + indentString.repeat(indentLevel) + '}'
                // If next char is not ';', maybe add newline? Depends on context.
                i++
                continue
            }
            if (char === ';') {
                output += ';\n' + indentString.repeat(indentLevel)
                i++
                continue
            }
            
            // 5. Newlines in Input
            if (char === '\n') {
                // Respect user's newlines, but enforce indentation
                if (!output.endsWith('\n' + indentString.repeat(indentLevel))) {
                    output = output.trimEnd() + '\n' + indentString.repeat(indentLevel)
                }
                i++
                continue
            }
            
            // 6. Whitespace (collapse multiple spaces to one, usually)
            if (/\s/.test(char)) {
                if (output.length > 0 && !/\s$/.test(output)) {
                    // Only add space if last char wasn't space/newline
                     output += ' '
                }
                i++
                continue
            }

            // 7. Normal Char
            output += char
            i++
        }
        
        // Final cleanup
        return output.replace(/\n\s*\n\s*\n/g, '\n\n').trim()
    }

    /**
     * Formats (Beautifies) CSS code.
     * @param {string} code 
     * @returns {string}
     */
    static beautifyCSS(code) {
        if (!code) return ''
        let output = ''
        let indentLevel = 0
        const indentString = '  '
        
        // Simple token formatting
        // Remove newlines first to start fresh
        const clean = code.replace(/\s+/g, ' ').trim()
        
        let i = 0
        let inContent = false // inside {}

        while (i < clean.length) {
            const char = clean[i]
            
            if (char === '{') {
                indentLevel++
                output += ' {\n' + indentString.repeat(indentLevel)
                inContent = true
                i++
                continue
            }
            if (char === '}') {
                indentLevel = Math.max(0, indentLevel - 1)
                output = output.trimEnd() + '\n' + indentString.repeat(indentLevel) + '}\n\n' + indentString.repeat(indentLevel)
                inContent = false
                i++
                continue
            }
            if (char === ';') {
                output += ';\n' + indentString.repeat(indentLevel)
                i++
                continue
            }
            
            output += char
            i++
        }
        return output.trim()
    }

    /**
     * Formats (Beautifies) HTML code.
     * @param {string} code 
     * @returns {string}
     */
    static beautifyHTML(code) {
        if (!code) return ''
        // Remove spaces between tags
        const clean = code.replace(/>\s+</g, '><').trim()
        
        let indentLevel = 0
        const indentString = '  '
        let output = ''
        
        // Split by tags
        const tokens = clean.split(/(<[^>]+>)/g).filter(Boolean)
        
        tokens.forEach(token => {
            if (token.startsWith('</')) {
                // Closing tag
                indentLevel = Math.max(0, indentLevel - 1)
                output += '\n' + indentString.repeat(indentLevel) + token
            } else if (token.startsWith('<') && !token.startsWith('<!') && !token.endsWith('/>') && !token.startsWith('<meta') && !token.startsWith('<link') && !token.startsWith('<img') && !token.startsWith('<br') && !token.startsWith('<hr') && !token.startsWith('<input')) {
                 // Opening tag (excluding void tags)
                 output += '\n' + indentString.repeat(indentLevel) + token
                 indentLevel++
            } else if (token.startsWith('<')) {
                // Self-closing or void tag or comment
                output += '\n' + indentString.repeat(indentLevel) + token
            } else {
                // Text content
                output += token.trim()
            }
        })
        
        return output.trim()
    }

    /**
     * explicit validation using simple heuristics
     * @param {string} code 
     * @param {'javascript'|'css'|'html'} lang 
     * @returns {boolean} true if valid (or unsure), false if definitely wrong language
     */
    static validate(code, lang) {
        if (!code || code.trim().length === 0) return true
        const snippet = code.trim().slice(0, 500) // check first 500 chars

        switch (lang) {
            case 'html':
                // HTML should start with < or contain typical tags
                return /<[a-z!][\s\S]*>/i.test(snippet)
            case 'css':
                // CSS usuall has { and : or @import
                // If it looks like HTML (has tags), it's definitely not CSS
                if (/<[a-z][\s\S]*>/i.test(snippet)) return false 
                return /\{[\s\S]*:[\s\S]*\}/.test(snippet) || /@import/.test(snippet) || /^[\w\d\s\-\_]+$/.test(snippet) === false
            case 'javascript':
                // JS is hard, but if it has HTML tags, it's not JS
                if (/^\s*<!DOCTYPE/i.test(snippet)) return false
                if (/^\s*<html/i.test(snippet)) return false
                return true
            default:
                return true
        }
    }
}
