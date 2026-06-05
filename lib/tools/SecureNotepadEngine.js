/**
 * SecureNotepadEngine
 * Handles client-side encryption using Web Crypto API.
 * Algorithm: AES-GCM (256-bit) derived via PBKDF2.
 */
export class SecureNotepadEngine {

    /**
     * Encrypts text with a password.
     * @param {string} text 
     * @param {string} password 
     * @returns {Promise<{salt: string, iv: string, data: string}>} Base64 encoded artifacts
     */
    static async encrypt(text, password) {
        const enc = new TextEncoder()
        const keyMaterial = await this._getKeyMaterial(password)
        
        const salt = crypto.getRandomValues(new Uint8Array(16))
        const key = await this._deriveKey(keyMaterial, salt, ["encrypt"])
        
        const iv = crypto.getRandomValues(new Uint8Array(12))
        const encodedData = enc.encode(text)
        
        const cipherText = await crypto.subtle.encrypt(
            { name: "AES-GCM", iv: iv },
            key,
            encodedData
        )

        return {
            salt: this._buf2hex(salt),
            iv: this._buf2hex(iv),
            data: this._buf2hex(cipherText)
        }
    }

    /**
     * Decrypts data with a password.
     * @param {{salt: string, iv: string, data: string}} payload 
     * @param {string} password 
     * @returns {Promise<string>} Decrypted text
     * @throws Error if decryption fails (wrong password)
     */
    static async decrypt(payload, password) {
        const { salt, iv, data } = payload
        
        const saltBuf = this._hex2buf(salt)
        const ivBuf = this._hex2buf(iv)
        const dataBuf = this._hex2buf(data)

        const keyMaterial = await this._getKeyMaterial(password)
        const key = await this._deriveKey(keyMaterial, saltBuf, ["decrypt"])

        try {
            const decrypted = await crypto.subtle.decrypt(
                { name: "AES-GCM", iv: ivBuf },
                key,
                dataBuf
            )
            
            const dec = new TextDecoder()
            return dec.decode(decrypted)
        } catch (e) {
            throw new Error("Decryption failed. Wrong password or corrupted data.")
        }
    }

    // --- Helpers ---

    static async _getKeyMaterial(password) {
        const enc = new TextEncoder()
        return crypto.subtle.importKey(
            "raw",
            enc.encode(password),
            { name: "PBKDF2" },
            false,
            ["deriveBits", "deriveKey"]
        )
    }

    static async _deriveKey(keyMaterial, salt, usage) {
        return crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt: salt,
                iterations: 100000,
                hash: "SHA-256"
            },
            keyMaterial,
            { name: "AES-GCM", length: 256 },
            false,
            usage
        )
    }

    static _buf2hex(buffer) {
        return [...new Uint8Array(buffer)]
            .map(x => x.toString(16).padStart(2, '0'))
            .join('')
    }

    static _hex2buf(hex) {
        return new Uint8Array(
            hex.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16))
        )
    }
}
