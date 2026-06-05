/**
 * Base64Processor Class
 * Handles Base64 encoding and decoding with proper UTF-8 support.
 * 
 * ALGORITHM & CONCEPTS:
 * 1. **Base64 System**: 
 *    - Base64 represents binary data using 64 printable characters (A-Z, a-z, 0-9, +, /).
 *    - Process: 3 Bytes (8-bit * 3 = 24 bits) -> 4 Characters (6-bit * 4 = 24 bits).
 *    - Padding: If data isn't divisible by 3, '=' characters are added to the end.
 * 
 * 2. **The "Latin1" Problem (btoa/atob)**:
 *    - JavaScript's native `btoa()` (Binary to ASCII) and `atob()` only support Latin1 (0-255).
 *    - They throw errors if you try to encode emojis or Chinese characters directly.
 * 
 * 3. **The Solution (UTF-8 Encoding)**:
 *    - We use `TextEncoder` to convert the UTF-8 string into a Uint8Array (bytes).
 *    - We then convert that byte array to a binary string that `btoa` can handle.
 *    - This ensures emojis 🚀 and special characters work perfectly.
 */
export class Base64Processor {
    /**
     * Encodes a string to Base64 (UTF-8 safe).
     * @param {string} input - Text to encode.
     * @returns {string} - Base64 encoded string.
     */
    static encode(input) {
        if (!input) return ''
        
        try {
            // Modern Browser Approach (UTF-8 Safe)
            // 1. Encode string to UTF-8 bytes
            const encoder = new TextEncoder()
            const bytes = encoder.encode(input)
            
            // 2. Convert bytes to binary string
            // We use spread syntax -> String.fromCharCode to avoid stack overflow on huge strings,
            // but for a web tool, a chunked approach or simple loop is safer for massive inputs.
            // For simplicity and common use cases:
            let binary = ''
            for (let i = 0; i < bytes.length; i++) {
                binary += String.fromCharCode(bytes[i])
            }
            
            // 3. Convert binary string to Base64
            return btoa(binary)
        } catch (e) {
            throw new Error('Encoding failed: ' + e.message)
        }
    }

    /**
     * Decodes a Base64 string to text (UTF-8 safe).
     * @param {string} input - Base64 string.
     * @returns {string} - Decoded text.
     */
    static decode(input) {
        if (!input) return ''

        try {
            // 1. Convert Base64 to binary string
            const binary = atob(input)
            
            // 2. Convert binary string to byte array
            const bytes = new Uint8Array(binary.length)
            for (let i = 0; i < binary.length; i++) {
                bytes[i] = binary.charCodeAt(i)
            }
            
            // 3. Decode bytes as UTF-8
            const decoder = new TextDecoder()
            return decoder.decode(bytes)
        } catch (e) {
            throw new Error('Invalid Base64 string')
        }
    }

    /**
     * Checks if a string is valid Base64.
     * @param {string} str 
     */
    static isValid(str) {
        if (str ==='' || str.trim() === '') return false;
        try {
            return btoa(atob(str)) === str;
        } catch (err) {
            return false;
        }
    }
}
