import { describe, it, expect } from 'vitest'
import { CronEngine } from '../../lib/tools/CronEngine'

describe('CronEngine', () => {

    it('should build expression from state', () => {
        const state = {
            Minute: { type: 'every' },
            Hour: { type: 'specific', value: ['5', '12'] },
            Day: { type: 'every' },
            Month: { type: 'every' },
            Weekday: { type: 'step', value: '2' }
        }

        expect(CronEngine.build(state)).toBe('* 5,12 * * */2')
    })

    it('should describe basic expressions', () => {
        expect(CronEngine.describe('* * * * *')).toBe('Every minute')
        expect(CronEngine.describe('*/5 * * * *')).toBe('At every 5 minutes.')
        expect(CronEngine.describe('0 12 * * *')).toBe('At minute 0 past hour 12.')
    })

})
