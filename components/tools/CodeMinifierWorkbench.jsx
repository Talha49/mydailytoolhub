'use client'

import { useState, useMemo } from 'react'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { MinifierEngine } from '@/lib/tools/MinifierEngine'

/**
 * CodeMinifierWorkbench Component
 * Multi-language minification AND formatting tool (JS, CSS, HTML)
 */
export default function CodeMinifierWorkbench() {
    const [lang, setLang] = useState('javascript') // javascript | css | html
    const [input, setInput] = useState('')
    const [output, setOutput] = useState('')
    const [error, setError] = useState(null)
    const [action, setAction] = useState('minify') // minify | format

    // reset output on action change
    const onActionClick = (newAction) => {
        setAction(newAction)
        setOutput('')
        setError(null)
    }

    const handleProcess = () => {
        if (!input) {
            setOutput('')
            setError(null)
            return
        }

        // 1. Validation
        const isValid = MinifierEngine.validate(input, lang)
        if (!isValid) {
            setError(`That doesn't look like valid ${lang.toUpperCase()} code. Please check your input.`)
            setOutput('')
            return
        }
        setError(null)

        // 2. Process (Minify or Format)
        let result = ''

        if (action === 'minify') {
            switch (lang) {
                case 'javascript': result = MinifierEngine.minifyJS(input); break;
                case 'css': result = MinifierEngine.minifyCSS(input); break;
                case 'html': result = MinifierEngine.minifyHTML(input); break;
                default: result = input;
            }
        } else {
            // Beautify
            try {
                switch (lang) {
                    case 'javascript': result = MinifierEngine.beautifyJS(input); break;
                    case 'css': result = MinifierEngine.beautifyCSS(input); break;
                    case 'html': result = MinifierEngine.beautifyHTML(input); break;
                    default: result = input;
                }
            } catch (e) {
                setError('Formatting failed. Code might be syntactically invalid.')
                return
            }
        }

        setOutput(result)
    }

    const stats = useMemo(() => {
        if (!input || !output || action !== 'minify') return null

        const originalSize = new Blob([input]).size
        const minifiedSize = new Blob([output]).size
        const savedBytes = originalSize - minifiedSize
        const savedPercent = originalSize > 0 ? ((savedBytes / originalSize) * 100).toFixed(1) : 0

        return {
            original: formatBytes(originalSize),
            minified: formatBytes(minifiedSize),
            savedPercent,
            savedBytes: formatBytes(savedBytes)
        }
    }, [input, output, action])

    function formatBytes(bytes) {
        if (bytes === 0) return '0 B'
        const k = 1024
        const sizes = ['B', 'KB', 'MB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    return (
        <div className="flex flex-col gap-6 animate-slideUp [animation-delay:100ms]">

            {/* Language Tabs */}
            <div className="flex justify-between items-center flex-wrap gap-4">
                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
                    {['javascript', 'css', 'html'].map(l => (
                        <button
                            key={l}
                            onClick={() => {
                                setLang(l)
                                setInput('')
                                setOutput('')
                                setError(null)
                            }}
                            className={cn(
                                "px-6 py-2 rounded-md text-sm font-bold uppercase transition-all",
                                lang === l ? "bg-white dark:bg-gray-700 shadow text-primary" : "text-text-secondary-light dark:text-text-secondary-dark hover:text-primary"
                            )}
                        >
                            {l === 'javascript' ? 'JS' : l.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* Mode Toggles */}
                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
                    <button
                        onClick={() => onActionClick('minify')}
                        className={cn(
                            "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                            action === 'minify' ? "bg-white dark:bg-gray-600 shadow text-primary font-bold" : "text-text-muted-light hover:text-text-primary-light"
                        )}
                    >
                        <span className="material-symbols-outlined text-[18px]">compress</span>
                        Minify
                    </button>
                    <button
                        onClick={() => onActionClick('format')}
                        className={cn(
                            "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                            action === 'format' ? "bg-white dark:bg-gray-600 shadow text-primary font-bold" : "text-text-muted-light hover:text-text-primary-light"
                        )}
                    >
                        <span className="material-symbols-outlined text-[18px]">format_align_left</span>
                        Format
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Input */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between px-1">
                        <label className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">Input Code</label>
                        <span className={cn("text-xs font-medium", error ? "text-error font-bold" : "text-text-muted-light")}>
                            {error ? "⚠️ Validation Error" : (stats ? `Size: ${stats.original}` : '')}
                        </span>
                    </div>
                    <div className={cn(
                        "bg-white dark:bg-gray-800 rounded-xl border shadow-soft overflow-hidden h-[450px] flex flex-col transition-colors",
                        error ? "border-error/50" : "border-border-card-light dark:border-border-card-dark"
                    )}>
                        <textarea
                            className="flex-1 w-full p-4 bg-transparent border-none resize-none focus:ring-0 font-mono text-sm leading-relaxed text-text-primary-light dark:text-text-primary-dark placeholder:text-text-muted-light"
                            placeholder={`Paste your ${lang.toUpperCase()} code here...`}
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value)
                                if (error) setError(null)
                            }}
                            spellCheck="false"
                        />
                    </div>
                </div>

                {/* Output */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between px-1">
                        <label className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">
                            {action === 'minify' ? 'Minified Output' : 'Formatted Output'}
                        </label>
                        {stats && action === 'minify' ? (
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded">-{stats.savedPercent}% Saved</span>
                                <span className="text-xs font-medium text-text-muted-light">Size: {stats.minified}</span>
                            </div>
                        ) : null}
                    </div>
                    <div className="bg-gray-900 rounded-xl border border-gray-700 shadow-soft overflow-hidden h-[450px] relative flex flex-col">
                        <textarea
                            readOnly
                            className="flex-1 w-full p-4 bg-transparent border-none resize-none focus:ring-0 font-mono text-sm leading-relaxed text-blue-300 whitespace-pre overflow-x-auto"
                            placeholder={action === 'minify' ? "Minified code..." : "Formatted code..."}
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

            <div className="flex justify-center">
                <Button
                    size="lg"
                    className="px-12 shadow-lg shadow-primary/25"
                    onClick={handleProcess}
                    disabled={!input}
                >
                    {action === 'minify' ? 'Minify' : 'Format'} {lang === 'javascript' ? 'JS' : lang.toUpperCase()}
                </Button>
            </div>

        </div>
    )
}
