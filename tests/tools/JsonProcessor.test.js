import { describe, it, expect } from 'vitest'
import { JsonProcessor } from '../../lib/tools/JsonProcessor'

describe('JsonProcessor', () => {
  
  describe('validate', () => {
    it('should return valid for correct JSON', () => {
      const input = '{"key": "value"}'
      const result = JsonProcessor.validate(input)
      expect(result.isValid).toBe(true)
      expect(result.error).toBeNull()
    })

    it('should return invalid for malformed JSON', () => {
      const input = '{"key": "value"' // Missing brace
      const result = JsonProcessor.validate(input)
      expect(result.isValid).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should return invalid for empty input', () => {
      const result = JsonProcessor.validate('')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Input is empty')
    })
  })

  describe('format', () => {
    it('should format JSON with default indentation (2 spaces)', () => {
      const input = '{"a":1,"b":2}'
      const expected = '{\n  "a": 1,\n  "b": 2\n}'
      expect(JsonProcessor.format(input)).toBe(expected)
    })

    it('should format JSON with custom indentation', () => {
      const input = '{"a":1}'
      const expected = '{\n    "a": 1\n}'
      expect(JsonProcessor.format(input, 4)).toBe(expected)
    })

    it('should throw error for invalid JSON', () => {
      expect(() => JsonProcessor.format('{bad')).toThrow()
    })
  })

  describe('minify', () => {
    it('should remove whitespace', () => {
      const input = '{\n  "a": 1\n}'
      const expected = '{"a":1}'
      expect(JsonProcessor.minify(input)).toBe(expected)
    })
  })
})
