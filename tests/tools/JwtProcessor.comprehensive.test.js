import { describe, it, expect } from 'vitest'
import { JwtProcessor } from '../../lib/tools/JwtProcessor'

describe('JwtProcessor - Advanced Implementation Tests', () => {

    describe('Decoding Tests (TC-02 to TC-06)', () => {
        // TC-02: JWT with Unicode / emoji
        it('TC-02: should handle Unicode and Emojis correctly', () => {
            // Payload: {"name":"Alice ❤ 🌍","roles":["editor","user"]}
            const payload = { "name": "Alice ❤ 🌍", "roles": ["editor", "user"] }
            const header = { "alg": "HS256", "typ": "JWT" }
            const token = JwtProcessor.encode(header, payload)
            
            const decoded = JwtProcessor.decode(token)
            expect(decoded.payload.name).toBe("Alice ❤ 🌍")
            expect(decoded.payload.roles).toContain("editor")
        })

        // TC-03: JWT with nested JSON
        it('TC-03: should preserve nested JSON objects', () => {
            // Payload: {"user":{"id":1,"profile":{"email":"alice@example.com","age":29}}}
            const payload = { "user": { "id": 1, "profile": { "email": "alice@example.com", "age": 29 } } }
            const header = { "alg": "HS256" }
            const token = JwtProcessor.encode(header, payload)

            const decoded = JwtProcessor.decode(token)
            expect(decoded.payload.user.profile.email).toBe("alice@example.com")
            expect(decoded.payload.user.profile.age).toBe(29)
        })

        // TC-04: JWT with array of objects
        it('TC-04: should preserve array of objects structure', () => {
            // Payload: {"logs":[{"event":"login","time":"..."},{"event":"logout","time":"..."}]}
            const payload = { 
                "logs": [
                    { "event": "login", "time": "2026-01-27T12:00:00Z" },
                    { "event": "logout", "time": "2026-01-27T13:00:00Z" }
                ] 
            }
            const header = { "alg": "HS256" }
            const token = JwtProcessor.encode(header, payload)

            const decoded = JwtProcessor.decode(token)
            expect(decoded.payload.logs).toHaveLength(2)
            expect(decoded.payload.logs[0].event).toBe("login")
            expect(decoded.payload.logs[1].event).toBe("logout")
        })

        // TC-05: JWT with special characters
        it('TC-05: should handle special characters', () => {
            // Payload: {"data":"!@#$%^&*()_+-=[]{}|;:',.<>/?~"}
            const specialChars = "!@#$%^&*()_+-=[]{}|;:',.<>/?~"
            const payload = { "data": specialChars }
            const header = { "alg": "HS256" }
            const token = JwtProcessor.encode(header, payload)

            const decoded = JwtProcessor.decode(token)
            expect(decoded.payload.data).toBe(specialChars)
        })

        // TC-06: Malformed JWT
        it('TC-06: should gracefully handle malformed JWT', () => {
            // Input: abc.def (only 2 parts)
            const result = JwtProcessor.decode("abc.def")
            expect(result.error).toBeDefined()
            // Expect: Error / warning, tool does not crash
            expect(result.error).toContain("Invalid Token Format")
        })
    })

    describe('Encoding Tests (TC-07 to TC-10)', () => {
        // TC-07: Encode simple JSON
        it('TC-07: should encode simple JSON and round-trip successfully', () => {
            const header = { "alg": "HS256", "typ": "JWT" }
            const payload = { "name": "John Doe" }
            
            const token = JwtProcessor.encode(header, payload)
            // Should contain 2 dots
            expect(token.split('.').length).toBe(3)
            
            // Round trip
            const decoded = JwtProcessor.decode(token)
            expect(decoded.payload.name).toBe("John Doe")
        })

        // TC-08: Encode JSON with Unicode / emojis
        it('TC-08: should round-trip Unicode/Emojis', () => {
            const payload = { "message": "Hello ❤ 🌍" }
            const header = { "alg": "HS256" }
            
            const token = JwtProcessor.encode(header, payload)
            const decoded = JwtProcessor.decode(token)
            expect(decoded.payload.message).toBe("Hello ❤ 🌍")
        })

        // TC-09: Encode JSON with nested objects
        it('TC-09: should round-trip nested objects', () => {
            const payload = { "user": { "id": 1, "details": { "email": "a@b.com", "age": 25 } } }
            const header = { "alg": "HS256" }
            
            const token = JwtProcessor.encode(header, payload)
            const decoded = JwtProcessor.decode(token)
            expect(decoded.payload.user.details.email).toBe("a@b.com")
        })

        // TC-10: Encode large payload
        it('TC-10: should round-trip large payloads without truncation', () => {
            // Payload: 500+ characters, mixed text, emojis, special chars
            let largeString = "START "
            for(let i=0; i<50; i++) largeString += "🚀 Only unique! " + i + " ";
            largeString += " END"
            
            const payload = { "data": largeString }
            const header = { "alg": "HS256" }

            const token = JwtProcessor.encode(header, payload)
            const decoded = JwtProcessor.decode(token)
            
            expect(decoded.payload.data).toBe(largeString)
            expect(decoded.payload.data.length).toBeGreaterThan(500)
        })
    })

})
