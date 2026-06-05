import { describe, it, expect } from 'vitest'
import { DiffEngine } from '../../lib/tools/DiffEngine'

describe('DiffEngine', () => {

    describe('compute (Lines)', () => {
        it('should handle identity (no changes)', () => {
             const text = "A\nB\nC"
             const diff = DiffEngine.compute(text, text)
             expect(diff).toHaveLength(1)
             expect(diff[0]).toEqual({ type: 'equal', text: "A\nB\nC" })
        })

        it('should detect simple insertion', () => {
            const oldT = "A"
            const newT = "A\nB"
            const diff = DiffEngine.compute(oldT, newT)
            // Expect A (equal), B (insert)
            // Implementation compacts?
            // "A" -> equal "A"
            // "B" -> insert "B"
            expect(diff).toEqual([
                { type: 'equal', text: 'A' },
                { type: 'insert', text: 'B' }
            ])
        })

        it('should detect deletion', () => {
            const oldT = "A\nB"
            const newT = "A"
            const diff = DiffEngine.compute(oldT, newT)
            expect(diff).toEqual([
                { type: 'equal', text: 'A' },
                { type: 'delete', text: 'B' }
            ])
        })

         it('should detect modification (delete + insert)', () => {
             const oldT = "A"
             const newT = "B"
             const diff = DiffEngine.compute(oldT, newT)
             // Should indicate delete A, insert B (or vice versa depending on path, but Myers usually prefers deletes then inserts?)
             // Order matters for UI but technically both valid.
             const types = diff.map(d => d.type)
             expect(types).toContain('delete')
             expect(types).toContain('insert')
         })
    })
    
    describe('compute (Chars)', () => {
        it('should handle char diffs', () => {
            const diff = DiffEngine.compute('cat', 'cut', 'chars')
            // c (eq), a(del), u(ins), t(eq)
            // compacted: c (eq), a(del), u(ins), t(eq)
            // actually "c" eq
            // "a" del
            // "u" ins
            // "t" eq
            
            // Expected: "c" equal, "a" delete, "u" insert, "t" equal
            // Or compact? "c"
            // But wait, our compactor joins with separator.
            // If separator is empty string (for chars), it joins correct?
            
            // "c" -> current
            // "a" -> type change -> push "c", current="a" (del)
            // "u" -> type chaneg -> push "a", current="u" (ins)
            // "t" -> type change -> push "u", current="t" (eq)
            
            expect(diff[0].text).toBe('c')
            expect(diff[0].type).toBe('equal')
        })
    })
})
