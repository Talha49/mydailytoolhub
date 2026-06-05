/**
 * DiffEngine Class
 * Implements Myers Diff Algorithm for text comparison.
 */
export class DiffEngine {

    /**
     * Computes the difference between two texts.
     * @param {string} oldText 
     * @param {string} newText 
     * @param {'lines'|'chars'} mode 
     * @returns {Array<{type: 'equal'|'insert'|'delete', text: string}>}
     */
    static compute(oldText, newText, mode = 'lines') {
        if (!oldText && !newText) return []
        if (!oldText) return [{ type: 'insert', text: newText }]
        if (!newText) return [{ type: 'delete', text: oldText }]

        const separator = mode === 'lines' ? '\n' : ''
        const oldParts = mode === 'lines' ? oldText.split('\n') : oldText.split('')
        const newParts = mode === 'lines' ? newText.split('\n') : newText.split('')

        const changes = this._myersDiff(oldParts, newParts)
        
        // Post-processing to join parts back if needed (for chars it might be granular)
        // But usually for valid UI we want the array of "blocks"
        // The raw myers returns matches. We need to convert to diff blocks.
        
        return this._buildDiffResult(changes, oldParts, newParts, separator)
    }

    /**
     * Internal Myers Diff implementation.
     * Returns the trace of shortest edit script.
     */
    static _myersDiff(a, b) {
        const n = a.length
        const m = b.length
        const max = n + m
        const v = new Int32Array(2 * max + 1)
        v[1] = 0
        const trace = []

        for (let d = 0; d <= max; d++) {
            const vClone = new Int32Array(v) // Snapshot for backtrack
            trace.push(vClone)
            
            for (let k = -d; k <= d; k += 2) {
                let x
                if (k === -d || (k !== d && v[k - 1 + max] < v[k + 1 + max])) {
                    x = v[k + 1 + max]
                } else {
                    x = v[k - 1 + max] + 1
                }
                
                let y = x - k
                while (x < n && y < m && a[x] === b[y]) {
                    x++
                    y++
                }
                
                v[k + max] = x
                if (x >= n && y >= m) {
                    return this._backtrack(trace, a, b)
                }
            }
        }
        return []
    }

    static _backtrack(trace, a, b) {
        const n = a.length
        const m = b.length
        let x = n
        let y = m
        const script = []

        for (let d = trace.length - 1; d >= 0; d--) {
            const v = trace[d]
            const max = n + m
            const k = x - y
            
            let prevK
            if (k === -d || (k !== d && v[k - 1 + max] < v[k + 1 + max])) {
                prevK = k + 1
            } else {
                prevK = k - 1
            }
            
            const prevX = v[prevK + max]
            const prevY = prevX - prevK

            while (x > prevX && y > prevY) {
                // Diagonal = equal
                script.unshift({ type: 'equal', count: 1 }) // simplify later
                x--
                y--
            }

            if (d > 0) {
                if (x === prevX) {
                    script.unshift({ type: 'insert', count: 1 }) // Vertical move in graph
                    y--
                } else {
                    script.unshift({ type: 'delete', count: 1 }) // Horizontal move in graph
                    x--
                }
            }
        }
        return script
    }
    
    static _buildDiffResult(script, a, b, separator) {
        const result = []
        let aIndex = 0
        let bIndex = 0
        
        script.forEach(op => {
            if (op.type === 'equal') {
                const text = a[aIndex] // Same in b
                result.push({ type: 'equal', text: text })
                aIndex++
                bIndex++
            } else if (op.type === 'delete') {
                const text = a[aIndex]
                result.push({ type: 'delete', text: text })
                aIndex++
            } else if (op.type === 'insert') {
                const text = b[bIndex]
                result.push({ type: 'insert', text: text })
                bIndex++
            }
        })
        
        // Compact consecutive types?
        // Usually better for UI to keep separate or grouping?
        // Let's grouping consecutive types for cleaner output structure
        const compacted = []
        if (result.length === 0) return []

        let current = { type: result[0].type, text: result[0].text }
        
        for (let i = 1; i < result.length; i++) {
            const next = result[i]
            if (next.type === current.type) {
                current.text += separator + next.text
            } else {
                compacted.push(current)
                current = { type: next.type, text: next.text }
            }
        }
        compacted.push(current)
        
        return compacted
    }
}
