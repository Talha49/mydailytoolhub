/**
 * TimestampConverter Class
 * Handles conversion between Epoch (Seconds/MS) and Date objects.
 */
export class TimestampConverter {

    /**
     * Parses input into a Date object.
     * Detects Seconds vs Milliseconds based on magnitude.
     * @param {string|number} input 
     * @returns {Date|null}
     */
    static parse(input) {
        if (!input) return null
        
        // If input is a number or string of digits
        if (/^-?\d+(\.\d+)?$/.test(input)) {
            let num = Number(input)
            
            // Heuristic: If widely typical "seconds" range (e.g. year 1973 to 2286), treat as seconds.
            // 10 digits usually seconds (up to year 2286). 13 digits usually ms.
            // However, low numbers (like 0, 100) are ambiguous. 
            // Standard convention: < 100,000,000,000 (100 billion) is seconds?
            // Current time in seconds: 1,7xxx,xxx,xxx (10 digits)
            // Current time in ms: 1,7xxx,xxx,xxx,xxx (13 digits)
            
            // Cutoff: Year 5138 is 100,000,000,000 seconds.
            // But 100,000,000,000 ms is year 1973. 
            // So if > 30,000,000,000 (Year 2920 in seconds, or Year 1970 + 1 year in MS... wait)
            // Let's use a simpler heuristic typical for these tools:
            // If < 1e11 (100 billion), it's seconds. (Covers up to year 5138)
            // If >= 1e11, it's milliseconds. (Starts at year 1973)
            
            // Edge case: "0" - usually safe to assume Epoch start (Seconds or MS is same).
            
            if (Math.abs(num) < 100000000000) {
                num *= 1000
            }
            
            return new Date(num)
        }
        
        // Try parsing string (ISO, standard dates)
        const date = new Date(input)
        if (!isNaN(date.getTime())) {
            return date
        }

        return null
    }

    /**
     * Formats a date into various strings
     * @param {Date} date 
     */
    static format(date) {
        if (!date || isNaN(date.getTime())) return null

        return {
            epochSeconds: Math.floor(date.getTime() / 1000),
            epochMilliseconds: date.getTime(),
            iso: date.toISOString(),
            utc: date.toUTCString(),
            local: date.toString(),
            // Simple relative time (e.g. "Just now", "5 minutes ago" - simplified)
            relative: this.getRelativeTime(date)
        }
    }

    static getRelativeTime(date) {
        const now = Date.now()
        const diff = now - date.getTime()
        const absDiff = Math.abs(diff)
        const suffix = diff > 0 ? 'ago' : 'from now'
        
        const seconds = Math.floor(absDiff / 1000)
        const minutes = Math.floor(seconds / 60)
        const hours = Math.floor(minutes / 60)
        const days = Math.floor(hours / 24)
        const years = Math.floor(days / 365)

        if (seconds < 60) return 'Just now'
        if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ${suffix}`
        if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ${suffix}`
        if (days < 365) return `${days} day${days !== 1 ? 's' : ''} ${suffix}`
        return `${years} year${years !== 1 ? 's' : ''} ${suffix}`
    }
}
