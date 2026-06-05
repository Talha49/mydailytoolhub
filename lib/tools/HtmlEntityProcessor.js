/**
 * HtmlEntityProcessor Class
 * Handles robust HTML entity encoding and decoding.
 * Support for:
 * - Named entities (e.g., &lt;, &copy;)
 * - Decimal entities (e.g., &#60;)
 * - Hex definitions (e.g., &#x3C;)
 */
export class HtmlEntityProcessor {
    
    // Basic safe list
    static BASIC_MAP = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;' // or &apos; (standard in HTML5)
    }

    /**
     * Encodes text to HTML entities.
     * @param {string} text 
     * @param {'basic'|'all'} mode - 'basic' (safe chars) or 'all' (ASCII + Unicode)
     * @returns {string}
     */
    static encode(text, mode = 'basic') {
        if (!text) return ''
        
        // 1. Basic Encode (Safety)
        let encoded = text.replace(/[&<>"']/g, (char) => this.BASIC_MAP[char])
        
        // 2. Extended Encode (if requested)
        // Encodes anything > ASCII 127 to numerical entity &#xxxx;
        if (mode === 'all') {
             return encoded.replace(/[^\x00-\x7F]/g, (char) => {
                 return '&#' + char.charCodeAt(0) + ';'
             })
        }

        return encoded
    }

    /**
     * Decodes HTML entities (Named, Hex, Decimal) back to characters.
     * @param {string} text 
     * @returns {string}
     */
    static decode(text) {
        if (!text) return ''
        
        return text.replace(/&(#?[\w\d]+);?/g, (match, entity) => {
            // 1. Decimal (&#60;)
            if (entity.startsWith('#') && !entity.startsWith('#x')) {
                const code = parseInt(entity.slice(1), 10)
                if (!isNaN(code)) return String.fromCharCode(code)
            }
            
            // 2. Hex (&#x3C;)
            if (entity.startsWith('#x')) {
                const code = parseInt(entity.slice(2), 16)
                if (!isNaN(code)) return String.fromCharCode(code)
            }
            
            // 3. Named (&lt;)
            // We need a lookup for common named entities. 
            // Browser DOM has this built-in, but in Node/PureJS we need a map.
            // For a lightweight tool, we cover the most frequent ones.
            const lower = entity.toLowerCase()
            const map = {
                'lt': '<', 'gt': '>', 'amp': '&', 'quot': '"', 'apos': "'", 'nbsp': ' ',
                'copy': '©', 'reg': '®', 'trade': '™', 'euro': '€', 'pound': '£', 'yen': '¥',
                'cent': '¢', 'sect': '§', 'deg': '°', 'plusmn': '±', 'para': '¶', 'middot': '·',
                'bull': '•', 'ndash': '–', 'mdash': '—', 'lsquo': '‘', 'rsquo': '’', 'sbquo': '‚',
                'ldquo': '“', 'rdquo': '”', 'bdquo': '„', 'dagger': '†', 'ddagger': '‡',
                'permil': '‰', 'lsaquo': '‹', 'rsaquo': '›', 'euro': '€' 
            }
            
            if (map[lower]) return map[lower]
            
            // Fallback: return match if unknown (robustness)
            return match
        })
    }
}
