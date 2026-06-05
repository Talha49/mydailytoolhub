/**
 * LoremEngine Class
 * Generates Lorem Ipsum placeholder text without external dependencies.
 */
export class LoremEngine {
    static WORDS = [
        "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
        "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
        "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation",
        "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo", "consequat", "duis",
        "aute", "irure", "in", "reprehenderit", "voluptate", "velit", "esse", "cillum", "dolore",
        "eu", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non",
        "proident", "sunt", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est",
        "laborum", "curabitur", "pretium", "tincidunt", "lacus", "nulla", "gravida", "orci", "a",
        "odio", "nullam", "varius", "turpis", "et", "commodo", "pharetra", "est", "eros", "bibendum",
        "elit", "nec", "luctus", "magna", "felis", "sollicitudin", "mauris", "integer", "in", "justo",
        "eaque", "ipsa", "quae", "ab", "illo", "inventore", "veritatis", "quasi", "architecto", "beatae",
        "vitae", "dicta", "sunt", "explicabo", "nemo", "enim", "ipsam", "voluptatem", "quia", "voluptas",
        "sit", "aspernatur", "aut", "odit", "aut", "fugit", "sed", "quia", "consequuntur", "magni", "dolores",
        "eos", "qui", "ratione", "voluptatem", "sequi", "nesciunt", "neque", "porro", "quisquam", "est",
        "qui", "dolorem", "ipsum", "quia", "dolor", "sit", "amet", "consectetur", "adipisci", "velit",
        "sed", "quia", "non", "numquam", "eius", "modi", "tempora", "incidunt", "ut", "labore", "et",
        "dolore", "magnam", "aliquam", "quaerat", "voluptatem"
    ];

    /**
     * Generate text based on count, type, and start flag.
     * @param {number} count 
     * @param {string} type 'paragraphs' | 'sentences' | 'words'
     * @param {boolean} startWithLorem If true, text starts with "Lorem ipsum dolor sit amet"
     * @returns {string} Generated text
     */
    static generate(count, type = 'paragraphs', startWithLorem = true) {
        if (count <= 0) return '';
        
        let output = '';

        if (type === 'words') {
            output = this._generateWords(count, startWithLorem);
        } else if (type === 'sentences') {
            output = this._generateSentences(count, startWithLorem);
        } else {
            // paragraphs
            const paragraphs = [];
            for (let i = 0; i < count; i++) {
                // First paragraph uses startWithLorem, subsequent ones don't
                const useStart = startWithLorem && i === 0;
                // A paragraph is randomly between 4 to 8 sentences
                const sentenceCount = Math.floor(Math.random() * 5) + 4;
                paragraphs.push(this._generateSentences(sentenceCount, useStart));
            }
            // Join with double newlines
            output = paragraphs.join('\n\n');
        }

        return output;
    }

    static _generateWords(count, startWithLorem) {
        const words = [];
        let startIndex = 0;

        if (startWithLorem && count >= 5) {
            words.push("Lorem", "ipsum", "dolor", "sit", "amet");
            startIndex = 5;
            count -= 5;
        } else if (startWithLorem && count > 0) {
            const loremStart = ["Lorem", "ipsum", "dolor", "sit", "amet"];
            return loremStart.slice(0, count).join(' ');
        }

        for (let i = 0; i < count; i++) {
            const word = this.WORDS[Math.floor(Math.random() * this.WORDS.length)];
            words.push(word);
        }

        return words.join(' ');
    }

    static _generateSentences(count, startWithLorem) {
        const sentences = [];
        
        for (let i = 0; i < count; i++) {
            // A sentence is randomly between 6 to 15 words
            const wordCount = Math.floor(Math.random() * 10) + 6;
            let sentence = '';

            if (startWithLorem && i === 0) {
                // Prepend standard lorem ipsum to the first sentence if requested
                const startPhrase = "Lorem ipsum dolor sit amet, consectetur adipiscing elit";
                const remainingWords = Math.max(0, wordCount - 8);
                const rest = remainingWords > 0 ? ' ' + this._generateWords(remainingWords, false) : '';
                sentence = startPhrase + rest + '.';
            } else {
                let rawWords = this._generateWords(wordCount, false);
                sentence = this._capitalizeFirstLetter(rawWords) + '.';
            }
            sentences.push(sentence);
        }

        return sentences.join(' ');
    }

    static _capitalizeFirstLetter(string) {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}
