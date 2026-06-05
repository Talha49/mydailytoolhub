import { describe, it, expect } from 'vitest'
import { JwtProcessor } from '../../lib/tools/JwtProcessor'

// Sample Valid JWT (Header: HS256, Payload: {sub: "1234567890", name: "John Doe", iat: 1516239022})
// Secret: 'your-256-bit-secret'
const VALID_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
                    'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.' + 
                    'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

describe('JwtProcessor', () => {
    
    describe('decode', () => {
        it('should correctly decode a valid token', () => {
            const result = JwtProcessor.decode(VALID_TOKEN)
            
            expect(result.error).toBeNull()
            
            // Check Header
            expect(result.header).toEqual({ alg: 'HS256', typ: 'JWT' })
            
            // Check Payload
            expect(result.payload.sub).toBe('1234567890')
            expect(result.payload.name).toBe('John Doe')
        })

        it('should handle invalid format (missing parts)', () => {
            const result = JwtProcessor.decode('invalid-token-string')
            expect(result.error).toContain('Invalid Token Format')
            expect(result.header).toBeNull()
        })

        it('should handle malformed Base64 parts', () => {
            // "Part1.Part2.Part3" but Part2 is not valid Base64 JSON
            const badToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.INVALID_BASE64.signature'
            const result = JwtProcessor.decode(badToken)
            expect(result.error).toContain('Decoding Failed')
        })
    })
})
