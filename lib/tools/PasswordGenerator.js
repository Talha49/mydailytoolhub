/**
 * PasswordGenerator Class
 * Generates secure passwords and calculates entropy.
 */
export class PasswordGenerator {

    static CHAR_SETS = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
    }

    static SIMILAR_CHARS = 'Il1O0'

    /**
     * Generates a secure password.
     * @param {number} length 
     * @param {Object} options 
     */
    static generate(length = 12, options = {}) {
        const {
            uppercase = true,
            lowercase = true,
            numbers = true,
            symbols = true,
            excludeSimilar = false
        } = options

        let charset = ''
        if (uppercase) charset += this.CHAR_SETS.uppercase
        if (lowercase) charset += this.CHAR_SETS.lowercase
        if (numbers) charset += this.CHAR_SETS.numbers
        if (symbols) charset += this.CHAR_SETS.symbols

        if (excludeSimilar) {
            charset = charset.split('').filter(c => !this.SIMILAR_CHARS.includes(c)).join('')
        }

        if (!charset) return '' // No characters selected

        let password = ''
        const charsetLength = charset.length

        // Secure Random Generation
        // In Node/Browser, crypto.getRandomValues is standard now.
        // We generate a buffer of random values and map them to the charset.
        
        // Safety check for environment
        const cryptoObj = typeof crypto !== 'undefined' ? crypto : (typeof window !== 'undefined' ? window.crypto : null)
        
        if (cryptoObj && cryptoObj.getRandomValues) {
             const values = new Uint32Array(length)
             cryptoObj.getRandomValues(values)
             for (let i = 0; i < length; i++) {
                 password += charset[values[i] % charsetLength]
             }
        } else {
            // Fallback (Warn user in UI if possible, but for logic we just use Math.random)
            // Ideally we shouldn't hit this in modern browsers or Node 18+
            for (let i = 0; i < length; i++) {
                password += charset[Math.floor(Math.random() * charsetLength)]
            }
        }

        return password
    }

    /**
     * Calculates entropy in bits.
     * Entropy = length * log2(poolSize)
     * @param {string} password 
     */
    static calculateEntropy(password) {
        if (!password) return 0
        
        let poolSize = 0
        if (/[A-Z]/.test(password)) poolSize += 26
        if (/[a-z]/.test(password)) poolSize += 26
        if (/[0-9]/.test(password)) poolSize += 10
        if (/[^A-Za-z0-9]/.test(password)) poolSize += 30 // Approx symbols
        
        if (poolSize === 0) return 0
        
        return Math.floor(password.length * Math.log2(poolSize))
    }

    /**
     * Returns strength label based on entropy.
     * @param {number} entropy 
     */
    static getStrength(entropy) {
        if (entropy < 28) return 'Very Weak'
        if (entropy < 36) return 'Weak'
        if (entropy < 60) return 'Reasonable'
        if (entropy < 128) return 'Strong'
        return 'Very Strong'
    }
}
