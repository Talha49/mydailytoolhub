import { describe, it, expect } from 'vitest'
import { PasswordGenerator } from '../../lib/tools/PasswordGenerator'

describe('PasswordGenerator', () => {

    describe('Generation', () => {
        it('should generate password of correct length', () => {
            const pwd = PasswordGenerator.generate(16)
            expect(pwd.length).toBe(16)
        })

        it('should use requested character sets', () => {
            const options = { uppercase: false, lowercase: false, numbers: true, symbols: false }
            const pwd = PasswordGenerator.generate(50, options) // long enough to likely hit chars
            expect(pwd).toMatch(/^\d+$/) // Should be only numbers
        })

        it('should exclude similar characters if requested', () => {
            // I, l, 1, O, 0
            const options = { excludeSimilar: true, uppercase: true, lowercase: true, numbers: true, symbols: false }
            // Generate a very long password to ensure we'd hit them if they were there
            const pwd = PasswordGenerator.generate(200, options)
            expect(pwd).not.toMatch(/[Il1O0]/)
        })

        it('should handle symbols', () => {
            const options = { uppercase: false, lowercase: false, numbers: false, symbols: true }
             const pwd = PasswordGenerator.generate(20)
             // Should contain at least one symbol from the set
             expect(pwd).toMatch(/[!@#$%^&*()_+~`|}{[\]:;?><,./\-=]+/)
        })
    })

    describe('Entropy & Strength', () => {
        it('should calculate entropy correctly', () => {
            // "abc" -> pool 26. 3 * log2(26) = 3 * 4.7 = ~14.1
            const entropy = PasswordGenerator.calculateEntropy('abc')
            expect(entropy).toBeGreaterThan(13)
            expect(entropy).toBeLessThan(15)
        })

        it('should evaluate strength', () => {
            expect(PasswordGenerator.getStrength(10)).toBe('Very Weak')
            expect(PasswordGenerator.getStrength(40)).toBe('Reasonable')
            expect(PasswordGenerator.getStrength(100)).toBe('Strong')
            expect(PasswordGenerator.getStrength(150)).toBe('Very Strong')
        })
    })
})
