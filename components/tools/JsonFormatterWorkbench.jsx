'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { JsonProcessor } from '@/lib/tools/JsonProcessor'

export default function JsonFormatterWorkbench() {
    const [input, setInput] = useState('')
    const [output, setOutput] = useState('')
    const [error, setError] = useState(null)
    const [stats, setStats] = useState({ lines: 0, chars: 0, size: '0 B' })
    const [isCopied, setIsCopied] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)

    // Update stats on input change
    useEffect(() => {
        setStats({
            lines: input.split('\n').length,
            chars: input.length,
            size: new Blob([input]).size + ' B'
        })
    }, [input])

    const processWithWorker = (action) => {
        if (!input) return
        setError(null)
        setIsProcessing(true)

        if (typeof window !== 'undefined' && window.Worker) {
            const worker = new Worker('/workers/jsonWorker.js')
            worker.onmessage = (e) => {
                setIsProcessing(false)
                if (e.data.success) {
                    setOutput(e.data.result)
                } else {
                    setError(e.data.error)
                    setOutput('')
                }
                worker.terminate()
            }
            worker.onerror = () => {
                setIsProcessing(false)
                setError('Worker execution failed.')
                setOutput('')
                worker.terminate()
            }
            worker.postMessage({ action, payload: input, tabSize: 2 })
        } else {
            // Fallback if Web Workers not supported
            try {
                if (action === 'format') {
                    setOutput(JsonProcessor.format(input, 2))
                } else {
                    setOutput(JsonProcessor.minify(input))
                }
            } catch (err) {
                setError(err.message)
                setOutput('')
            } finally {
                setIsProcessing(false)
            }
        }
    }

    const handleFormat = () => processWithWorker('format')
    const handleMinify = () => processWithWorker('minify')

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

    const handleClear = () => {
        setInput('')
        setOutput('')
        setError(null)
    }

    const handleUpload = (e) => {
        const file = e.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
            setInput(event.target.result)
        }
        reader.readAsText(file)
    }

    return (
        <div className="grid lg:grid-cols-2 gap-6 animate-slideUp [animation-delay:100ms]">
            {/* Input Area */}
            <div className="flex flex-col gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-card-light dark:border-border-card-dark shadow-soft overflow-hidden flex flex-col h-[500px]">
                    {/* Toolbar */}
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50/50 dark:bg-gray-700/50 border-b border-border-light dark:border-border-dark">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">data_object</span>
                            <span className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">Input JSON</span>
                        </div>

                        <div className="flex gap-1">
                            <label className="cursor-pointer p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-text-secondary-light dark:text-text-secondary-dark transition-colors" title="Upload File">
                                <input type="file" accept=".json,.txt" className="hidden" onChange={handleUpload} />
                                <span className="material-symbols-outlined text-[18px]">upload_file</span>
                            </label>
                            <button onClick={handleClear} className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-text-secondary-light dark:text-text-secondary-dark transition-colors" title="Clear">
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                        </div>
                    </div>

                    {/* Editor Area */}
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 w-full p-4 bg-transparent border-none resize-none focus:ring-0 font-mono text-sm text-text-primary-light dark:text-text-primary-dark placeholder:text-text-muted-light/50"
                        placeholder='{"paste": "your", "json": "here"}'
                        spellCheck="false"
                    />

                    <div className="px-4 py-2 border-t border-border-light dark:border-border-dark bg-gray-50/30 dark:bg-gray-800/50 text-[10px] text-text-muted-light dark:text-text-muted-dark flex justify-between">
                        <span>{stats.lines} lines</span>
                        <span>{stats.chars} chars • {stats.size}</span>
                    </div>
                </div>

                {/* Mobile Controls */}
                <div className="flex lg:hidden justify-center gap-2">
                    <Button variant="primary" onClick={handleFormat}>Format</Button>
                    <Button variant="secondary" onClick={handleMinify}>Minify</Button>
                </div>
            </div>

            {/* Output Area */}
            <div className="flex flex-col gap-4">
                <div className={cn(
                    "bg-gray-900 rounded-xl border shadow-soft overflow-hidden flex flex-col h-[500px] transition-colors",
                    error ? "border-red-500/50" : "border-gray-700"
                )}>
                    {/* Toolbar */}
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
                        <div className="flex items-center gap-2">
                            <span className={cn("material-symbols-outlined", isProcessing ? "text-info animate-spin" : (error ? "text-red-400" : "text-success"))}>
                                {isProcessing ? 'autorenew' : (error ? 'error' : 'check_circle')}
                            </span>
                            <span className="text-sm font-bold text-white">
                                {isProcessing ? 'Processing in Web Worker...' : (error ? 'Error Detected' : 'Result')}
                            </span>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleCopy}
                                disabled={isProcessing}
                                className={cn("h-7 px-2", isCopied ? "text-success" : "text-gray-400 hover:text-white hover:bg-gray-700")}
                            >
                                <span className="material-symbols-outlined text-[16px] mr-1">
                                    {isCopied ? 'check' : 'content_copy'}
                                </span>
                                {isCopied ? 'Copied' : 'Copy'}
                            </Button>
                        </div>
                    </div>

                    {/* Result Area */}
                    <div className="flex-1 p-4 overflow-auto scrollbar-thin relative">
                        {isProcessing ? (
                            <div className="flex items-center justify-center h-full text-blue-400 font-mono text-sm animate-pulse">
                                Offloading heavy JSON parsing to Web Worker...
                            </div>
                        ) : error ? (
                            <div className="text-red-400 font-mono text-sm whitespace-pre-wrap">
                                {error}
                            </div>
                        ) : (
                            <pre className="font-mono text-sm text-blue-300">
                                {output || (
                                    <span className="text-gray-600 italic">
                                        {'// Result will appear here...'}
                                    </span>
                                )}
                            </pre>
                        )}
                    </div>
                </div>

                {/* Desktop Controls */}
                <div className="hidden lg:flex items-center justify-end gap-3">
                    <Button variant="secondary" icon="compress" onClick={handleMinify}>Minify</Button>
                    <Button variant="primary" icon="format_align_left" onClick={handleFormat}>Format JSON</Button>
                </div>
            </div>
        </div>
    )
}
