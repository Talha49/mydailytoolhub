import { describe, it, expect } from 'vitest'
import { TimestampConverter } from '../../lib/tools/TimestampConverter'

describe('TimestampConverter', () => {

    describe('Parsing', () => {
        it('should parse 10-digit timestamp as seconds', () => {
             // 1609459200 = 2021-01-01T00:00:00Z
             const date = TimestampConverter.parse(1609459200)
             expect(date.toISOString()).toBe('2021-01-01T00:00:00.000Z')
        })

        it('should parse 13-digit timestamp as milliseconds', () => {
             // 1609459200000 = 2021-01-01T00:00:00Z
             const date = TimestampConverter.parse(1609459200000)
             expect(date.toISOString()).toBe('2021-01-01T00:00:00.000Z')
        })

        it('should parse ISO string', () => {
            const date = TimestampConverter.parse('2023-12-25T12:00:00Z')
            expect(date.toISOString()).toBe('2023-12-25T12:00:00.000Z')
        })
    })

    describe('Formatting', () => {
        it('should return all formats', () => {
            const date = new Date('2021-01-01T00:00:00Z')
            const fmt = TimestampConverter.format(date)
            
            expect(fmt.epochSeconds).toBe(1609459200)
            expect(fmt.epochMilliseconds).toBe(1609459200000)
            expect(fmt.iso).toBe('2021-01-01T00:00:00.000Z')
            expect(fmt.utc).toContain('Fri, 01 Jan 2021')
        })
    })
})
