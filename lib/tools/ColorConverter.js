/**
 * ColorConverter Class
 * Handles conversions between HEX, RGB, and HSL.
 */
export class ColorConverter {

    /**
     * Tries to interpret input as a color and returns all formats.
     * @param {string} input 
     * @returns {{ hex: string, rgb: string, hsl: string, valid: boolean } | null}
     */
    static parse(input) {
        if (!input) return null
        input = input.trim()

        let r, g, b

        // 1. Detect HEX
        if (input.startsWith('#') || /^[0-9A-Fa-f]{3,6}$/.test(input)) {
             const rgbObj = this.hexToRgb(input)
             if (rgbObj) {
                 r = rgbObj.r; g = rgbObj.g; b = rgbObj.b
             }
        }
        
        // 2. Detect RGB string "rgb(255, 0, 0)" or "255, 0, 0"
        else if (/^rgb/i.test(input) || /^\d{1,3},\s*\d{1,3},\s*\d{1,3}$/.test(input)) {
            const parts = input.match(/\d+/g)
            if (parts && parts.length >= 3) {
                r = parseInt(parts[0]); g = parseInt(parts[1]); b = parseInt(parts[2])
            }
        }

        // 3. Detect HSL "hsl(0, 100%, 50%)"
        else if (/^hsl/i.test(input)) {
             const parts = input.match(/\d+/g)
             if (parts && parts.length >= 3) {
                 const h = parseInt(parts[0])
                 const s = parseInt(parts[1])
                 const l = parseInt(parts[2])
                 const rgbObj = this.hslToRgb(h, s, l)
                 r = rgbObj.r; g = rgbObj.g; b = rgbObj.b
             }
        }

        if (r !== undefined && g !== undefined && b !== undefined) {
            // Validate range
            if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) return { valid: false, hex: '', rgb: '', hsl: '' }

            // Generate all formats
            const hex = this.rgbToHex(r, g, b)
            const hslObj = this.rgbToHsl(r, g, b)
            
            return {
                valid: true,
                hex: hex.toUpperCase(),
                rgb: `rgb(${r}, ${g}, ${b})`,
                hsl: `hsl(${hslObj.h}, ${hslObj.s}%, ${hslObj.l}%)`,
                raw: { r, g, b, ...hslObj }
            }
        }

        return { valid: false, hex: '', rgb: '', hsl: '' }
    }

    static hexToRgb(hex) {
        // Expand shorthand format (e.g. "03F") to full form (e.g. "0033FF")
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
        hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b)

        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null
    }

    static rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
    }

    static rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255
        const max = Math.max(r, g, b), min = Math.min(r, g, b)
        let h, s, l = (max + min) / 2

        if (max === min) {
            h = s = 0 // achromatic
        } else {
            const d = max - min
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break
                case g: h = (b - r) / d + 2; break
                case b: h = (r - g) / d + 4; break
            }
            h /= 6
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        }
    }

    static hslToRgb(h, s, l) {
        s /= 100
        l /= 100
        const k = n => (n + h / 30) % 12
        const a = s * Math.min(l, 1 - l)
        const f = n =>
            l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
            
        return {
            r: Math.round(255 * f(0)),
            g: Math.round(255 * f(8)),
            b: Math.round(255 * f(4))
        }
    }
}
