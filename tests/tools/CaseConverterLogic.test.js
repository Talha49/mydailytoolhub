import { describe, it, expect } from 'vitest'
import { CaseConverterLogic } from '../../lib/tools/CaseConverterLogic'

describe('CaseConverterLogic', () => {

    it('should convert to uppercase', () => {
        expect(CaseConverterLogic.toUpperCase('hello world')).toBe('HELLO WORLD')
    })

    it('should convert to lowercase', () => {
        expect(CaseConverterLogic.toLowerCase('HELLO WORLD')).toBe('hello world')
    })

    it('should convert to title case', () => {
        expect(CaseConverterLogic.toTitleCase('hello world from test')).toBe('Hello World From Test')
    })

    it('should convert to camel case', () => {
        expect(CaseConverterLogic.toCamelCase('hello world from test')).toBe('helloWorldFromTest')
        expect(CaseConverterLogic.toCamelCase('HELLO WORLD')).toBe('helloWorld')
    })

    it('should convert to snake case', () => {
        expect(CaseConverterLogic.toSnakeCase('hello world from test')).toBe('hello_world_from_test')
        expect(CaseConverterLogic.toSnakeCase('camelCaseTest')).toBe('camel_case_test')
    })

    it('should convert to alternating case', () => {
        expect(CaseConverterLogic.toAlternatingCase('hello world')).toBe('hElLo wOrLd')
    })
})
