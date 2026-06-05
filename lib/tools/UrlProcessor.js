/**
 * UrlProcessor Class
 * Handles URL encoding and decoding operations.
 * 
 * ALGORITHM & CONCEPTS:
 * 1. **URL Encoding (Percent-Encoding)**:
 *    - Replaces unsafe ASCII characters with a `%` followed by two hexadecimal digits.
 *    - Example: Space ` ` becomes `%20`.
 * 
 * 2. **The Two Modes**:
 *    - **Component Mode (`encodeURIComponent`)**: 
 *      - Encodes *everything* that has special meaning in a URL (like `/`, `:`, `&`, `?`).
 *      - USE CASE: When encoding a *value* of a query parameter (e.g., `?name=John Doe&`).
 * 
 *    - **Full URL Mode (`encodeURI`)**:
 *      - Preserves URL structure characters (`:`, `/`, `?`, `#`).
 *      - Encodes only invalid characters (like spaces or non-ASCII).
 *      - USE CASE: When encoding a whole URL to make it safe for transmission.
 * 
 * 3. **Validation**:
 *    - `decodeURIComponent` throws a URIError if it encounters a malformed sequence (e.g., `%E0` without following bytes).
 */
export class UrlProcessor {
    /**
     * Encodes a string.
     * @param {string} input - Text to encode.
     * @param {boolean} componentMode - If true, treats input as a query param value (encodes / ? : etc).
     * @returns {string} - Encoded URL string.
     */
    static encode(input, componentMode = true) {
        if (!input) return ''
        return componentMode ? encodeURIComponent(input) : encodeURI(input)
    }

    /**
     * Decodes a URL string.
     * @param {string} input - Encoded URL.
     * @returns {string} - Decoded text.
     */
    static decode(input) {
        if (!input) return ''
        try {
            return decodeURIComponent(input)
        } catch (e) {
            // "URIError" happens on malformed sequences like "%" or "%2"
            return 'Error: Malformed URL sequence'
        }
    }
}
