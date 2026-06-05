/**
 * JsonProcessor Class
 * Handles JSON validation, formatting, and minification.
 */
export class JsonProcessor {
  /**
   * Validates a JSON string.
   * @param {string} input - The JSON string to validate.
   * @returns {Object} - { isValid: boolean, error: string | null }
   */
  static validate(input) {
    if (!input || input.trim() === '') {
      return { isValid: false, error: 'Input is empty' }
    }
    try {
      JSON.parse(input)
      return { isValid: true, error: null }
    } catch (e) {
      return { isValid: false, error: e.message }
    }
  }

  /**
   * Formats a JSON string with specified indentation.
   * @param {string} input - The JSON string to format.
   * @param {number} indent - Number of spaces for indentation (default 2).
   * @returns {string} - The formatted JSON string.
   * @throws {Error} - If input is invalid JSON.
   */
  static format(input, indent = 2) {
    const parsed = JSON.parse(input)
    return JSON.stringify(parsed, null, indent)
  }

  /**
   * Minifies a JSON string (removes whitespace).
   * @param {string} input - The JSON string to minify.
   * @returns {string} - The minified JSON string.
   * @throws {Error} - If input is invalid JSON.
   */
  static minify(input) {
    const parsed = JSON.parse(input)
    return JSON.stringify(parsed)
  }
}
