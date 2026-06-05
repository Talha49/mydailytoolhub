'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { UrlProcessor } from '@/lib/tools/UrlProcessor'

/**
 * UrlEncoderWorkbench Component
 * Split view for Encode/Decode with real-time updates and mode selection
 */
export default function UrlEncoderWorkbench() {
    const [input, setInput] = useState('')
    const [output, setOutput] = useState('')
    const [mode, setMode] = useState('encode') // encode | decode
    const [componentMode, setComponentMode] = useState(true) // true = encodeURIComponent, false = encodeURI
    const [isCopied, setIsCopied] = useState(false)

    // Process input
    useEffect(() => {
        if (!input) {
            setOutput('')
            return
        }

        if (mode === 'encode') {
            const encoded = UrlProcessor.encode(input, componentMode)
            setOutput(encoded)
        } else {
            const decoded = UrlProcessor.decode(input)
            setOutput(decoded)
        }
    }, [input, mode, componentMode])

    const handleCopy = async () => {
        if (!output) return
        try {
            await navigator.clipboard.writeText(output)
            setIsCopied(true)
            setTimeout(() => setIsCopied(false), 2000)
        } catch (err) {
            console.error('Copy failed', err)
        }
    }

    const handleModeChange = (newMode) => {
        setMode(newMode)
        setInput('')
        setOutput('')
    }

    return (
        <div className="flex flex-col gap-6 animate-slideUp [animation-delay:100ms]">

            {/* Controls */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-border-card-light dark:border-border-card-dark shadow-sm">

                <div className="flex gap-4 items-center">
                    {/* Mode Toggle */}
                    <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                        <button
                            onClick={() => handleModeChange('encode')}
                            className={cn("px-4 py-1.5 text-sm font-bold rounded-md transition-all", mode === 'encode' ? "bg-white dark:bg-gray-600 shadow text-primary" : "text-text-secondary-light")}
                        >
                            Encode
                        </button>
                        <button
                            onClick={() => handleModeChange('decode')}
                            className={cn("px-4 py-1.5 text-sm font-bold rounded-md transition-all", mode === 'decode' ? "bg-white dark:bg-gray-600 shadow text-primary" : "text-text-secondary-light")}
                        >
                            Decode
                        </button>
                    </div>

                    {/* Encode Options (Only visible in Encode mode) */}
                    {mode === 'encode' && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-900 rounded-lg border border-border-light dark:border-border-dark">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={componentMode}
                                    onChange={(e) => setComponentMode(e.target.checked)}
                                    className="w-4 h-4 text-primary rounded focus:ring-primary"
                                />
                                <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark">
                                    Component Mode
                                </span>
                            </label>
                            <span className="material-symbols-outlined text-gray-400 text-[16px] cursor-help" title="Checked: Encodes everything (encodeURIComponent)&#10;Unchecked: Preserves URL structure (encodeURI)">help</span>
                        </div>
                    )}
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopy}
                        className={cn(isCopied ? "text-success" : "")}
                    >
                        <span className="material-symbols-outlined text-[18px] mr-1">{isCopied ? 'check' : 'content_copy'}</span>
                        {isCopied ? 'Copied' : 'Copy'}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setInput('')}>
                        <span className="material-symbols-outlined text-[18px] mr-1">delete</span>
                        Clear
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Input */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark ml-1 flex justify-between">
                        <span>{mode === 'encode' ? 'Decoded String (Input)' : 'Encoded String (Input)'}</span>
                    </label>
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-card-light dark:border-border-card-dark shadow-soft overflow-hidden h-[400px]">
                        <textarea
                            className="w-full h-full p-4 bg-transparent border-none resize-none focus:ring-0 font-mono text-sm leading-relaxed placeholder:text-text-muted-light/50 text-text-primary-light dark:text-text-primary-dark"
                            placeholder={mode === 'encode' ? "Enter text to encode (e.g. 'Hello World?')" : "Enter URL encoded text (e.g. 'Hello%20World%3F')"}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            spellCheck="false"
                        />
                    </div>
                </div>

                {/* Output */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark ml-1">
                        {mode === 'encode' ? 'Encoded String (Output)' : 'Decoded String (Output)'}
                    </label>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border border-border-light dark:border-border-dark overflow-hidden h-[400px]">
                        <textarea
                            readOnly
                            className="w-full h-full p-4 bg-transparent border-none resize-none focus:ring-0 font-mono text-sm leading-relaxed text-primary"
                            placeholder="Result will appear here..."
                            value={output}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
