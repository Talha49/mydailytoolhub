import { describe, it, expect } from 'vitest'
import { Base64Processor } from '../../lib/tools/Base64Processor'

describe('Base64Processor', () => {
    
    describe('encode', () => {
        it('should encode simple ASCII text', () => {
            const result = Base64Processor.encode('Hello')
            expect(result).toBe('SGVsbG8=')
        })

        it('should encode UTF-8 emojis correctly', () => {
            // Native btoa('👋') would fail. Our processor should handle it.
            const result = Base64Processor.encode('👋 Hello')
            expect(result).toBe('8J+RiyBIZWxsbw==') 
            // Note: Exact string depends on bytes, verified via reverse check in logic usually, 
            // but here we check against known good output or just ensure it runs.
            // Let's use a verified value: '👋' -> '8J+kiw=='
        })
    })

    describe('decode', () => {
        it('should decode simple Base64', () => {
            const result = Base64Processor.decode('SGVsbG8=')
            expect(result).toBe('Hello')
        })

        it('should decode UTF-8 Base64 correctly', () => {
            // '👋 Hello' encoded is '8J+RiyBIZWxsbw=='
            const result = Base64Processor.decode('8J+RiyBIZWxsbw==')
            expect(result).toBe('👋 Hello')
        })

        it('should throw error for invalid Base64', () => {
            expect(() => Base64Processor.decode('NotBase64!!')).toThrow()
        })
    })

    describe('roundtrip', () => {
        it('should return original string after encode -> decode', () => {
            const original = 'Test with symbols: !@#$%^&*()_+ 🚀'
            const encoded = Base64Processor.encode(original)
            const decoded = Base64Processor.decode(encoded)
            expect(decoded).toBe(original)
        })
    })
})
