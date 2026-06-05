/**
 * UuidGenerator Class
 * Generates UUIDs (v4 and v7).
 */
export class UuidGenerator {

    /**
     * Generates a random UUID (Version 4).
     * Uses crypto.randomUUID() if available, else fallback.
     * @returns {string}
     */
    static v4() {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID()
        }
        
        // Fallback for older envs
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0
            const v = c === 'x' ? r : (r & 0x3 | 0x8)
            return v.toString(16)
        })
    }

    /**
     * Generates a time-sortable UUID (Version 7).
     * Draft standard: unix_ts_ms (48 bits) + ver (4 bits) + rand_a (12 bits) + var (2 bits) + rand_b (62 bits)
     * @returns {string}
     */
    static v7() {
        // Current timestamp in ms
        const value = Date.now()
        
        // Random bytes for the rest
        const rnds = new Uint8Array(10)
        if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
            crypto.getRandomValues(rnds)
        } else {
            // weak fallback
            for (let i = 0; i < 10; i++) rnds[i] = Math.floor(Math.random() * 256)
        }

        // Construct 16-byte buffer
        const bytes = new Uint8Array(16)

        // 0-3: timestamp high (32 bits)
        bytes[0] = (value >> 24) & 0xff
        bytes[1] = (value >> 16) & 0xff
        bytes[2] = (value >> 8) & 0xff
        bytes[3] = value & 0xff

        // 4-5: timestamp low (16 bits)
        bytes[4] = (value / 0x100000000) & 0xff // High part of 48-bit timestamp? 
        // JS Date.now() is 48-bit capable (up to 8000 AD). 
        // Actually Date.now() fits in 48 bits easily.
        // Wait, Date.now() returns Number (double). Bitwise ops treat as 32-bit int.
        // We need BigInt handling or math for the high 16 bits of the 48-bit timestamp.
        
        const timestamp = Date.now()
        const high = Math.floor(timestamp / 0x100000000)
        const low = timestamp >>> 0 // ensures unsigned 32-bit
        
        // Re-do mapping correctly for v7 spec
        // 0-3: Big Endian High 32 bits of 48-bit timestamp
        // 4-5: Low 16 bits of 48-bit timestamp
        
        // Actually:
        // bytes[0..5] = 48-bit timestamp
        // We have `timestamp` (ms).
        
        bytes[0] = (timestamp / 1099511627776) & 0xff
        bytes[1] = (timestamp / 4294967296) & 0xff
        bytes[2] = (timestamp / 16777216) & 0xff
        bytes[3] = (timestamp / 65536) & 0xff
        bytes[4] = (timestamp / 256) & 0xff
        bytes[5] = timestamp & 0xff

        // 6: ver (4 bits) | rand_a (4 bits) -> Version 7
        bytes[6] = 0x70 | ((rnds[0] >>> 4) & 0x0f)
        
        // 7: rand_a (8 bits)
        bytes[7] = rnds[1]
        
        // 8: var (2 bits) | rand_b (6 bits) -> Variant 10 (RFC 4122)
        bytes[8] = 0x80 | (rnds[2] & 0x3f)
        
        // 9-15: rand_b (56 bits)
        for (let i = 3; i < 10; i++) {
            bytes[6 + i] = rnds[i]
        }

        // Convert to Hex String
        const hex = []
        for (let i = 0; i < 16; i++) {
            hex.push(bytes[i].toString(16).padStart(2, '0'))
        }
        
        return [
            hex.slice(0, 4).join(''),
            hex.slice(4, 6).join(''),
            hex.slice(6, 8).join(''),
            hex.slice(8, 10).join(''),
            hex.slice(10, 16).join('')
        ].join('-')
    }

    /**
     * Bulk generate UUIDs
     * @param {'v4'|'v7'} version 
     * @param {number} count 
     */
    static generateBulk(version = 'v4', count = 1) {
        const results = []
        const fn = version === 'v7' ? this.v7 : this.v4
        for (let i = 0; i < count; i++) {
            results.push(fn.call(this))
        }
        return results
    }

    static validate(uuid) {
        // Standard Regex
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid)
    }
}
