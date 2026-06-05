'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { Base64Processor } from '@/lib/tools/Base64Processor'

/**
 * Base64Workbench Component
 * Specialized UI for Base64 (Encode/Decode toggle + Dual textareas + File Support)
 */
export default function Base64Workbench() {
    const [mode, setMode] = useState('encode') // encode | decode
    const [input, setInput] = useState('')
    const [output, setOutput] = useState('')
    const [error, setError] = useState(null)
    const [isCopied, setIsCopied] = useState(false)

    // Process input whenever it changes or mode changes
    useEffect(() => {
        setError(null)
        if (!input) {
            setOutput('')
            return
        }

        try {
            if (mode === 'encode') {
                const encoded = Base64Processor.encode(input)
                setOutput(encoded)
            } else {
                const decoded = Base64Processor.decode(input)
                setOutput(decoded)
            }
        } catch (err) {
            // Only show error if input is substantial (avoid flashing on typing)
            if (input.length > 1) {
                setError(err.message)
                setOutput('')
            }
        }
    }, [input, mode])

    const handleCopy = async () => {
        if (!output) return
        try {
            await navigator.clipboard.writeText(output)
            setIsCopied(true)
            setTimeout(() => setIsCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy', err)
        }
    }

    const handleFileUpload = (e) => {
        const file = e.target.files[0]
        if (!file) return

        // If decoding, we expect a text file containing Base64
        if (mode === 'decode') {
            const reader = new FileReader()
            reader.onload = (e) => setInput(e.target.result)
            reader.readAsText(file)
            return
        }

        // If encoding, handle generic files (Images, PDFs) -> Data URI
        const reader = new FileReader()
        reader.onload = (e) => {
            // result is like "data:image/png;base64,....."
            // We usually just want the full Data URI for embedding
            const res = e.target.result
            setInput("File uploaded: " + file.name)
            setOutput(res) // Bypass normal processor for files to get the correct Data URI
        }
        reader.readAsDataURL(file)
    }

    return (
        <div className="flex flex-col gap-6 animate-slideUp [animation-delay:100ms]">

            {/* Mode Toggle */}
            <div className="mx-auto bg-gray-100 dark:bg-gray-800 p-1 rounded-lg inline-flex mb-4">
                <button
                    onClick={() => { setMode('encode'); setInput(''); setOutput('') }}
                    className={cn(
                        "px-6 py-2 rounded-md text-sm font-bold transition-all",
                        mode === 'encode' ? "bg-white dark:bg-gray-700 shadow-sm text-primary" : "text-text-secondary-light dark:text-text-secondary-dark hover:text-primary"
                    )}
                >
                    Encode
                </button>
                <button
                    onClick={() => { setMode('decode'); setInput(''); setOutput('') }}
                    className={cn(
                        "px-6 py-2 rounded-md text-sm font-bold transition-all",
                        mode === 'decode' ? "bg-white dark:bg-gray-700 shadow-sm text-primary" : "text-text-secondary-light dark:text-text-secondary-dark hover:text-primary"
                    )}
                >
                    Decode
                </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Input Area */}
                <div className="flex flex-col gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-card-light dark:border-border-card-dark shadow-soft overflow-hidden flex flex-col h-[400px]">
                        <div className="flex items-center justify-between px-4 py-3 bg-gray-50/50 dark:bg-gray-700/50 border-b border-border-light dark:border-border-dark">
                            <span className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">
                                {mode === 'encode' ? 'Plain Text Input' : 'Base64 Input'}
                            </span>
                            <div className="flex gap-2">
                                <label className="cursor-pointer text-xs font-bold text-primary hover:underline flex items-center gap-1">
                                    <input type="file" className="hidden" onChange={handleFileUpload} />
                                    <span className="material-symbols-outlined text-[16px]">upload_file</span>
                                    {mode === 'encode' ? 'File to Data URI' : 'Upload Text File'}
                                </label>
                            </div>
                        </div>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 w-full p-4 bg-transparent border-none resize-none focus:ring-0 font-mono text-sm text-text-primary-light dark:text-text-primary-dark placeholder:text-text-muted-light/50"
                            placeholder={mode === 'encode' ? "Type text or emojis to encode as Base64..." : "Paste Base64 string to decode..."}
                        />
                    </div>
                </div>

                {/* Output Area */}
                <div className="flex flex-col gap-4">
                    <div className={cn(
                        "bg-gray-900 rounded-xl border shadow-soft overflow-hidden flex flex-col h-[400px] transition-colors",
                        error ? "border-red-500/50" : "border-gray-700"
                    )}>
                        <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
                            <div className="flex items-center gap-2">
                                <span className={cn("material-symbols-outlined", error ? "text-red-400" : "text-success")}>
                                    {error ? 'error' : 'check_circle'}
                                </span>
                                <span className="text-sm font-bold text-white">
                                    {error ? 'Error' : (mode === 'encode' ? 'Base64 Result' : 'Decoded Text')}
                                </span>
                            </div>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleCopy}
                                className={cn("h-7 px-2", isCopied ? "text-success" : "text-gray-400 hover:text-white hover:bg-gray-700")}
                            >
                                <span className="material-symbols-outlined text-[16px] mr-1">
                                    {isCopied ? 'check' : 'content_copy'}
                                </span>
                                {isCopied ? 'Copied' : 'Copy'}
                            </Button>
                        </div>
                        <textarea
                            readOnly
                            value={error || output}
                            className={cn(
                                "flex-1 w-full p-4 bg-transparent border-none resize-none focus:ring-0 font-mono text-sm placeholder:text-gray-600",
                                error ? "text-red-400" : (mode === 'decode' ? "text-white" : "text-green-400 break-all")
                            )}
                            placeholder="Result will appear here..."
                        />
                    </div>
                </div>
            </div>

        </div>
    )
}
