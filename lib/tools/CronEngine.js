/**
 * CronEngine Class
 * Builds and parses basic cron expressions
 */
export class CronEngine {
    
    /**
     * Build a cron string from state
     * @param {Object} state 
     * @returns {string} 
     */
    static build(state) {
        // state shape: { Minute: { type: 'every', value: '*' }, Hour: { type: 'specific', value: '5' }, ... }
        const mapUnit = (unitState) => {
            if (unitState.type === 'every') {
                return '*'
            }
            if (unitState.type === 'step') {
                return `*/${unitState.value || '1'}`
            }
            if (unitState.type === 'specific') {
                return unitState.value.length ? unitState.value.join(',') : '0'
            }
            return '*'
        }

        const parts = [
            mapUnit(state.Minute),
            mapUnit(state.Hour),
            mapUnit(state.Day),
            mapUnit(state.Month),
            mapUnit(state.Weekday)
        ]

        return parts.join(' ')
    }

    /**
     * Very basic human readable description for the simple supported subset
     * @param {string} expr 
     * @returns {string}
     */
    static describe(expr) {
        if (!expr) return 'Invalid expression'
        const parts = expr.split(' ')
        if (parts.length !== 5) return 'Expression must have 5 parts'

        const [min, hour, day, month, week] = parts
        let desc = 'At '

        if (min === '*' && hour === '*' && day === '*' && month === '*' && week === '*') {
            return 'Every minute'
        }

        if (min.startsWith('*/')) {
            desc += `every ${min.substring(2)} minutes`
        } else if (min === '*') {
            desc += 'every minute'
        } else {
            desc += `minute ${min}`
        }

        if (hour.startsWith('*/')) {
            desc += ` past every ${hour.substring(2)} hours`
        } else if (hour !== '*') {
            desc += ` past hour ${hour}`
        }

        if (day !== '*') {
            desc += ` on day-of-month ${day}`
        }

        if (month !== '*') {
            desc += ` in month ${month}`
        }

        if (week !== '*') {
            desc += ` on day-of-week ${week}`
        }

        return desc + '.'
    }
}
