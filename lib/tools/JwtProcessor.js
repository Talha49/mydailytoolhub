/**
 * JwtProcessor Class
 * Handles parsing and decoding of JSON Web Tokens (JWT).
 * 
 * ALGORITHM & CONCEPTS:
 * 1. **JWT Structure**:
 *    - A JWT consists of three parts separated by dots (`.`):
 *      1. **Header**: Algorithm and token type (e.g., `{"alg": "HS256", "typ": "JWT"}`).
 *      2. **Payload**: The data/claims (e.g., `{"sub": "123", "name": "John"}`).
 *      3. **Signature**: Cryptographic signature to verify authenticity.
 * 
 * 2. **Base64Url Encoding**:
 *    - JWTs use a variation of Base64 called "Base64Url".
 *    - Differences:
 *      - `+` becomes `-`
 *      - `/` becomes `_`
 *      - No padding `=` is used.
 *    - To decode, we must swap these back before using standard Base64 decoding.
 * 
 * 3. **Security Note**:
 *    - This processor *decodes* the token to show its contents.
 *    - It does NOT *verify* the signature (which requires the server-side secret key).
 *    - Do not trust the data in a JWT on the client-side for critical logic without verification.
 */
import { Base64Processor } from './Base64Processor'

export class JwtProcessor {
    /**
     * Decodes a JWT token string.
     * @param {string} token - The raw JWT string.
     * @returns {Object} - result object { header, payload, signature, error }
     */
    static decode(token) {
        if (!token) return { header: null, payload: null, signature: null, error: null }

        const parts = token.split('.')

        if (parts.length !== 3) {
            return { 
                header: null, 
                payload: null, 
                signature: null, 
                error: 'Invalid Token Format: JWT must have 3 parts (Header.Payload.Signature)' 
            }
        }

        try {
            const [rawHeader, rawPayload, rawSignature] = parts

            // Decode Header and Payload
            const header = JSON.parse(this._base64UrlDecode(rawHeader))
            const payload = JSON.parse(this._base64UrlDecode(rawPayload))

            return {
                header,
                payload,
                signature: rawSignature, // storage only, can't verify here
                error: null
            }
        } catch (e) {
            return {
                header: null,
                payload: null,
                signature: null,
                error: 'Decoding Failed: ' + e.message 
            }
        }
    }

    /**
     * Encodes a header and payload into a JWT string (Unsigned/Dummy Signature).
     * @param {Object} header 
     * @param {Object} payload 
     * @returns {string} - The generated JWT token.
     */
    static encode(header, payload) {
        if (!header || !payload) return ''

        try {
            const encodedHeader = this._base64UrlEncode(JSON.stringify(header))
            const encodedPayload = this._base64UrlEncode(JSON.stringify(payload))
            const signature = 'unsigned-dummy-signature'

            return `${encodedHeader}.${encodedPayload}.${signature}`
        } catch (e) {
            throw new Error('Encoding Failed: ' + e.message)
        }
    }

    /**
     * Helper to decode Base64Url to string.
     * @private
     */
    static _base64UrlDecode(str) {
        // 1. Convert Base64Url characters back to Base64
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
        
        // 2. Add padding if necessary (Base64 length must be multiple of 4)
        while (base64.length % 4) {
            base64 += '='
        }

        // 3. Decode using our UTF-8 safe processor
        return Base64Processor.decode(base64)
    }

    /**
     * Helper to encode string to Base64Url.
     * @private
     */
    static _base64UrlEncode(str) {
        // 1. Encode using our UTF-8 safe processor
        const base64 = Base64Processor.encode(str)
        
        // 2. Convert Base64 to Base64Url
        return base64
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '') // Remove padding
    }
}
