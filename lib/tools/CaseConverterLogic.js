/**
 * CaseConverterLogic Class
 * Handles various string case transformations
 */
export class CaseConverterLogic {

    static toUpperCase(text) {
        return text ? text.toUpperCase() : ''
    }

    static toLowerCase(text) {
        return text ? text.toLowerCase() : ''
    }

    static toTitleCase(text) {
        if (!text) return ''
        return text.replace(
            /\w\S*/g,
            (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        )
    }

    static toCamelCase(text) {
        if (!text) return ''
        return text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
            return index === 0 ? word.toLowerCase() : word.toUpperCase()
        }).replace(/\s+/g, '')
    }

    static toSnakeCase(text) {
        if (!text) return ''
        return text
            .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
            ?.map(x => x.toLowerCase())
            ?.join('_') || text.toLowerCase().replace(/\s+/g, '_')
    }

    static toAlternatingCase(text) {
        if (!text) return ''
        let result = ''
        let isLower = true
        for (let i = 0; i < text.length; i++) {
            const char = text[i]
            if (/[a-zA-Z]/.test(char)) {
                result += isLower ? char.toLowerCase() : char.toUpperCase()
                isLower = !isLower
            } else {
                result += char
            }
        }
        return result
    }
}
