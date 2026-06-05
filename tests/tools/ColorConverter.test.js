import { describe, it, expect } from 'vitest'
import { ColorConverter } from '../../lib/tools/ColorConverter'

describe('ColorConverter', () => {

    describe('Hex <-> RGB', () => {
        it('should convert Hex to RGB', () => {
            expect(ColorConverter.hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 })
            expect(ColorConverter.hexToRgb('00ff00')).toEqual({ r: 0, g: 255, b: 0 }) // without hash
        })
        
        it('should handle shorthand hex', () => {
             expect(ColorConverter.hexToRgb('#F00')).toEqual({ r: 255, g: 0, b: 0 })
        })

        it('should convert RGB to Hex', () => {
            expect(ColorConverter.rgbToHex(255, 0, 0)).toBe('#ff0000')
            expect(ColorConverter.rgbToHex(0, 0, 0)).toBe('#000000')
        })
    })

    describe('RGB <-> HSL', () => {
        it('should convert RGB to HSL', () => {
            // Red
            expect(ColorConverter.rgbToHsl(255, 0, 0)).toEqual({ h: 0, s: 100, l: 50 })
            // White
            expect(ColorConverter.rgbToHsl(255, 255, 255)).toEqual({ h: 0, s: 0, l: 100 })
        })

        it('should convert HSL to RGB', () => {
            // Blue: hsl(240, 100%, 50%) -> 0,0,255
            expect(ColorConverter.hslToRgb(240, 100, 50)).toEqual({ r: 0, g: 0, b: 255 })
        })
    })

    describe('Smart Parse', () => {
        it('should detect Hex input', () => {
            const res = ColorConverter.parse('#fff')
            expect(res.valid).toBe(true)
            expect(res.hex).toBe('#FFFFFF')
            expect(res.rgb).toBe('rgb(255, 255, 255)')
        })

        it('should detect valid rgb input', () => {
            const res = ColorConverter.parse('rgb(0,0,0)')
            expect(res.valid).toBe(true)
            expect(res.hex).toBe('#000000')
        })

        it('should handle invalid input gracefully', () => {
             const res = ColorConverter.parse('invalid')
             expect(res.valid).toBe(false)
        })
    })
})
