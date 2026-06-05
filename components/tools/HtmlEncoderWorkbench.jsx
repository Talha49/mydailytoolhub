'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { HtmlEntityProcessor } from '@/lib/tools/HtmlEntityProcessor'

/**
 * HtmlEncoderWorkbench Component (Refactored from HtmlEntityWorkbench)
 * Encodes/Decodes HTML entities with real-time preview.
 */
export default function HtmlEncoderWorkbench() {
    const [input, setInput] = useState('')
    const [output, setOutput] = useState('')
    const [mode, setMode] = useState('encode') // encode | decode
    const [encodeAll, setEncodeAll] = useState(false) // if true, encodes all non-ascii

    const handleProcess = () => {
        if (!input) {
            setOutput('')
            return
        }

        if (mode === 'encode') {
            const result = HtmlEntityProcessor.encode(input, encodeAll ? 'all' : 'basic')
            setOutput(result)
        } else {
            const result = HtmlEntityProcessor.decode(input)
            setOutput(result)
        }
    }

    // Auto-process when dependencies change
    const onInputChange = (val) => {
        setInput(val)
        if (mode === 'encode') {
            setOutput(HtmlEntityProcessor.encode(val, encodeAll ? 'all' : 'basic'))
        } else {
            setOutput(HtmlEntityProcessor.decode(val))
        }
    }

    const toggleMode = (m) => {
        setMode(m)
        // Recalculate immediately
        if (m === 'encode') {
            setOutput(HtmlEntityProcessor.encode(input, encodeAll ? 'all' : 'basic'))
        } else {
            setOutput(HtmlEntityProcessor.decode(input))
        }
    }

    const toggleEncodeAll = () => {
        const newVal = !encodeAll
        setEncodeAll(newVal)
        if (mode === 'encode') {
            setOutput(HtmlEntityProcessor.encode(input, newVal ? 'all' : 'basic'))
        }
    }

    return (
        <div className="flex flex-col gap-6 animate-slideUp [animation-delay:100ms]">

            {/* Controls */}
            <div className="flex justify-between items-center flex-wrap gap-4">
                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
                    <button
                        onClick={() => toggleMode('encode')}
                        className={cn(
                            "px-6 py-2 rounded-md text-sm font-bold transition-all",
                            mode === 'encode' ? "bg-white dark:bg-gray-700 shadow text-primary" : "text-text-secondary-light dark:text-text-secondary-dark hover:text-primary"
                        )}
                    >
                        Encode
                    </button>
                    <button
                        onClick={() => toggleMode('decode')}
                        className={cn(
                            "px-6 py-2 rounded-md text-sm font-bold transition-all",
                            mode === 'decode' ? "bg-white dark:bg-gray-700 shadow text-primary" : "text-text-secondary-light dark:text-text-secondary-dark hover:text-primary"
                        )}
                    >
                        Decode
                    </button>
                </div>

                {mode === 'encode' && (
                    <button
                        onClick={toggleEncodeAll}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium transition-all",
                            encodeAll
                                ? "bg-primary/10 border-primary text-primary"
                                : "bg-transparent border-border-light dark:border-border-dark text-text-muted-light hover:border-primary/50"
                        )}
                    >
                        <span className="material-symbols-outlined text-[16px]">
                            {encodeAll ? 'check_circle' : 'circle'}
                        </span>
                        Encode All Characters (Unicode)
                    </button>
                )}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Input */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between px-1">
                        <label className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">
                            {mode === 'encode' ? 'Raw HTML / Text' : 'Encoded Entities'}
                        </label>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-card-light dark:border-border-card-dark shadow-soft overflow-hidden h-[300px] flex flex-col">
                        <textarea
                            className="flex-1 w-full p-4 bg-transparent border-none resize-none focus:ring-0 font-mono text-sm leading-relaxed text-text-primary-light dark:text-text-primary-dark placeholder:text-text-muted-light"
                            placeholder={mode === 'encode' ? 'Type text to encode (e.g. <script>)...' : 'Type entities to decode (e.g. &lt;div&gt;)...'}
                            value={input}
                            onChange={(e) => onInputChange(e.target.value)}
                        />
                    </div>
                </div>

                {/* Output */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between px-1">
                        <label className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">
                            {mode === 'encode' ? 'Encoded Output' : 'Decoded Text'}
                        </label>
                    </div>
                    <div className="bg-gray-900 rounded-xl border border-gray-700 shadow-soft overflow-hidden h-[300px] relative flex flex-col">
                        <textarea
                            readOnly
                            className="flex-1 w-full p-4 bg-transparent border-none resize-none focus:ring-0 font-mono text-sm leading-relaxed text-blue-300"
                            placeholder="Result will appear here..."
                            value={output}
                        />
                        {output && (
                            <div className="absolute top-4 right-4 animate-fadeIn sticky">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="bg-gray-800/80 backdrop-blur text-white hover:bg-gray-700 hover:text-white"
                                    onClick={() => navigator.clipboard.writeText(output)}
                                >
                                    <span className="material-symbols-outlined text-[16px] mr-1">content_copy</span> Copy
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-center mt-4">
                <p className="text-xs text-text-muted-light max-w-lg text-center">
                    {mode === 'encode'
                        ? "Converts special characters to their corresponding HTML entities to prevent execution or display issues."
                        : "Converts encoded HTML entities back to their original characters."}
                </p>
            </div>
        </div>
    )
}
