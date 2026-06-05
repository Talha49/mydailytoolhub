/**
 * RegexEngine Class
 * Handles Regular Expression testing and analysis.
 * 
 * ALGORITHM & CONCEPTS:
 * 1. **RegExp Object**: We use JavaScript's native RegExp engine.
 *    - `new RegExp(pattern, flags)`: Compiles the string pattern into a regex object.
 *    - We wrap this in a try-catch block to handle "SyntaxError" (e.g., if user types `[a-z` without closing bracket).
 * 
 * 2. **Matching Strategy (While Loop with exec)**:
 *    - The `exec()` method is powerful. It returns one match at a time.
 *    - If the 'g' (global) flag is present, we allow a `while` loop to find ALL matches.
 *    - If 'g' is missing, `exec` only finds the first match.
 * 
 * 3. **Input Sanitization**:
 *    - We must be careful with infinite loops. If a regex matches empty strings (like `a*`), 
 *    - we manually advance the `lastIndex` to prevent the browser from crashing.
 */
export class RegexEngine {
    /**
     * Tests a regex pattern against a text string.
     * @param {string} pattern - The regex pattern (e.g., "[0-9]+")
     * @param {string} flags - The regex flags (e.g., "g", "i", "m")
     * @param {string} text - The test string to search within.
     * @returns {Object} - Result object containing matches or error.
     */
    static test(pattern, flags, text) {
        // 1. Validate Inputs
        if (!pattern) return { matches: [], error: null, count: 0 }

        try {
            // 2. Compile Regex
            // This will throw an error if the pattern is invalid
            const regex = new RegExp(pattern, flags)
            
            // 3. Find Matches
            const matches = []
            let match
            
            // Safety measure: Prevent infinite loops with limits (optional but good for production tools)
            const MAX_MATCHES = 10000 

            // ALGORITHM: The exec() Loop
            // regex.exec(text) finds the next match and updates regex.lastIndex
            // We loop until it returns null (no more matches)
            
            // Handle global flag logic
            if (!flags.includes('g')) {
                // Non-global: Just run once
                match = regex.exec(text)
                if (match) {
                     matches.push(this._formatMatch(match))
                }
            } else {
                // Global: Run loop
                while ((match = regex.exec(text)) !== null) {
                    matches.push(this._formatMatch(match))
                    
                    if (matches.length >= MAX_MATCHES) break;

                    // INFINITE LOOP PROTECTION:
                    // If a regex matches an empty string (like `^` or `abc*` on 'd'), 
                    // lastIndex might not advance, causing an infinite loop.
                    if (match.index === regex.lastIndex) {
                        regex.lastIndex++
                    }
                }
            }

            return { 
                matches, 
                error: null,
                count: matches.length
            }

        } catch (e) {
            // 4. Error Handling
            // e.message usually looks like "Invalid regular expression: /.../: Unterminated group"
            return { 
                matches: [], 
                error: e.message, 
                count: 0 
            }
        }
    }

    /**
     * Helper to format a raw JS match array into a clean object.
     * @private
     */
    static _formatMatch(rawMatch) {
         // rawMatch is an array-like object: ["match text", "group1", "group2", index: 0, input: "..."]
        return {
            content: rawMatch[0],       // The full text matched
            index: rawMatch.index,      // Character position where match started
            groups: rawMatch.slice(1),   // Captured groups (e.g., (a)(b) -> ["a", "b"])
            length: rawMatch[0].length  // Length of the match
        }
    }
}
