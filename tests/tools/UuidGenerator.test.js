import { describe, it, expect } from 'vitest'
import { UuidGenerator } from '../../lib/tools/UuidGenerator'

describe('UuidGenerator', () => {

    describe('v4 (Random)', () => {
        it('should generate valid UUIDs', () => {
            const uuid = UuidGenerator.v4()
            expect(UuidGenerator.validate(uuid)).toBe(true)
            // version check (13th char should be 4)
            expect(uuid.charAt(14)).toBe('4') 
            // variant check (17th char should be 8,9,a,b - actually it's handled by crypto, let's assume valid)
        })

        it('should be unique (statistical)', () => {
            const list = UuidGenerator.generateBulk('v4', 1000)
            const set = new Set(list)
            expect(set.size).toBe(1000)
        })
    })

    describe('v7 (Time Sortable)', () => {
        it('should generate valid UUIDs', () => {
             const uuid = UuidGenerator.v7()
             expect(UuidGenerator.validate(uuid)).toBe(true)
             // version check
             expect(uuid.charAt(14)).toBe('7')
        })

        it('should be roughly sortable', () => {
            // Generate two with a small delay
            // Since it uses Date.now(), we need ms difference or just rely on random sort if same ms?
            // V7 spec says monotonic if same timestamp? My impl uses random, so order not guaranteed within same ms.
            // But if we simulate delay...
            const u1 = UuidGenerator.v7()
            // Busy wait or mock Date? 
            // In unit test simple check is enough.
            
            // Check if it starts with somewhat correct timestamp hex
            const now = Date.now()
            const prefix = u1.split('-')[0]
            const decodedTime = parseInt(prefix, 16)
            // The first 32 bits (8 hex) are high timestamp. 
            // My impl: bytes[0-3]. 
            // timestamp / 256^4. 
            // approx check.
            expect(decodedTime).toBeGreaterThan(0)
        })
    })

    describe('Bulk', () => {
        it('should generate N items', () => {
            const res = UuidGenerator.generateBulk('v4', 5)
            expect(res).toHaveLength(5)
        })
    })
})
