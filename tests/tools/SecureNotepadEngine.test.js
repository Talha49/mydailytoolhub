import { describe, it, expect, beforeAll } from 'vitest'
import { SecureNotepadEngine } from '../../lib/tools/SecureNotepadEngine'

// Polyfill Web Crypto if in Node environment (Vitest default)
// Node 19+ has global crypto. Older nodes might need this.
if (typeof crypto === 'undefined' && typeof global !== 'undefined') {
    const { webcrypto } = require('crypto')
    global.crypto = webcrypto
}

describe('SecureNotepadEngine', () => {

    it('should encrypt and decrypt correctly', async () => {
        const text = "This is a secret message"
        const password = "password123"

        const encrypted = await SecureNotepadEngine.encrypt(text, password)
        
        expect(encrypted.salt).toBeDefined()
        expect(encrypted.iv).toBeDefined()
        expect(encrypted.data).toBeDefined()
        
        const decrypted = await SecureNotepadEngine.decrypt(encrypted, password)
        expect(decrypted).toBe(text)
    })

    it('should produce different outputs for same input (Salt/IV randomization)', async () => {
        const text = "Same text"
        const password = "pass"

        const enc1 = await SecureNotepadEngine.encrypt(text, password)
        const enc2 = await SecureNotepadEngine.encrypt(text, password)
        
        expect(enc1.data).not.toBe(enc2.data)
        expect(enc1.iv).not.toBe(enc2.iv)
        expect(enc1.salt).not.toBe(enc2.salt)
    })

    it('should fail to decrypt with wrong password', async () => {
        const text = "Secret"
        const password = "correct"
        const wrongPassword = "wrong"

        const encrypted = await SecureNotepadEngine.encrypt(text, password)
        
        await expect(SecureNotepadEngine.decrypt(encrypted, wrongPassword)).rejects.toThrow()
    })

})
