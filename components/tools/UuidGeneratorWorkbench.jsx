'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import { UuidGenerator } from '@/lib/tools/UuidGenerator'
import { cn } from '@/lib/utils'

export default function UuidGeneratorWorkbench() {
    const [version, setVersion] = useState('v4') // v4 | v7
    const [count, setCount] = useState(1)
    const [uppercase, setUppercase] = useState(false)
    const [hyphens, setHyphens] = useState(true)
    const [output, setOutput] = useState('')

    // Generate on count/version change or manually
    useEffect(() => {
        handleGenerate()
    }, [version, count]) // Auto-update when main params change? Or wait for button?
    // "Generate" button is usually better for bulk. 
    // But for single item, auto is nice. 
    // Let's do auto for small counts, manual for large? 
    // User preference: Explicit is usually better for "bulk" tools.
    // But let's stick to auto-init.

    // Initial generation
    useEffect(() => {
        if (!output) handleGenerate()
    }, [])

    const handleGenerate = () => {
        const uuids = UuidGenerator.generateBulk(version, count)

        // Formatting
        let formatted = uuids.join('\n')

        if (!hyphens) {
            formatted = formatted.replace(/-/g, '')
        }

        if (uppercase) {
            formatted = formatted.toUpperCase()
        }

        setOutput(formatted)
    }

    // Copy
    const handleCopy = () => {
        if (output) navigator.clipboard.writeText(output)
    }

    // Download
    const handleDownload = () => {
        const blob = new Blob([output], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `uuids-${version}-${count}.txt`
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="flex flex-col gap-6 animate-slideUp [animation-delay:100ms]">

            {/* Main Grid: Config Left, Output Right */}
            <div className="grid lg:grid-cols-2 gap-6">

                {/* Left Panel: Configuration */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between px-1">
                        <label className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">Configuration</label>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-card-light dark:border-border-card-dark shadow-soft p-6 h-full flex flex-col gap-6">

                        {/* Version Selection */}
                        <div className="flex flex-col gap-3">
                            <span className="text-sm font-medium text-text-muted-light">UUID Version</span>
                            <div className="grid grid-cols-2 gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                                <button
                                    onClick={() => setVersion('v4')}
                                    className={cn(
                                        "py-2 rounded-md text-sm font-bold transition-all",
                                        version === 'v4' ? "bg-white dark:bg-gray-600 shadow text-primary" : "text-text-muted-light hover:text-text-primary-light"
                                    )}
                                >
                                    Version 4 (Random)
                                </button>
                                <button
                                    onClick={() => setVersion('v7')}
                                    className={cn(
                                        "py-2 rounded-md text-sm font-bold transition-all",
                                        version === 'v7' ? "bg-white dark:bg-gray-600 shadow text-primary" : "text-text-muted-light hover:text-text-primary-light"
                                    )}
                                >
                                    Version 7 (Time)
                                </button>
                            </div>
                        </div>

                        {/* Quantity */}
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-text-muted-light">Quantity</span>
                                <span className="text-xl font-bold text-primary">{count}</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="500"
                                value={count}
                                onChange={(e) => setCount(parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                            <div className="flex gap-2 mt-2">
                                {[1, 5, 10, 50, 100].map(v => (
                                    <button
                                        key={v}
                                        onClick={() => setCount(v)}
                                        className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 font-mono"
                                    >
                                        {v}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-gray-100 dark:bg-gray-700" />

                        {/* Formatting Options */}
                        <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <input type="checkbox" checked={uppercase} onChange={() => setUppercase(!uppercase)} className="w-5 h-5 rounded text-primary focus:ring-primary border-gray-300" />
                                <span className="text-sm font-medium">Uppercase</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <input type="checkbox" checked={!hyphens} onChange={() => setHyphens(!hyphens)} className="w-5 h-5 rounded text-primary focus:ring-primary border-gray-300" />
                                <span className="text-sm font-medium">Remove Hyphens</span>
                            </label>
                        </div>

                        <div className="mt-auto pt-4">
                            <Button
                                size="lg"
                                className="w-full shadow-lg shadow-primary/25"
                                onClick={handleGenerate}
                            >
                                Generate UUIDs
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Output */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between px-1">
                        <label className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">Output</label>
                        <span className="text-xs font-medium text-text-muted-light">{count} generated</span>
                    </div>

                    <div className="bg-gray-900 rounded-xl border border-gray-700 shadow-soft overflow-hidden h-[500px] flex flex-col relative">
                        <textarea
                            readOnly
                            value={output}
                            className="flex-1 w-full p-6 bg-transparent border-none resize-none focus:ring-0 font-mono text-sm leading-relaxed text-green-400 whitespace-pre overflow-auto custom-scrollbar"
                            spellCheck="false"
                        />

                        <div className="absolute top-4 right-4 flex gap-2">
                            <Button
                                size="sm"
                                variant="ghost"
                                className="bg-gray-800/80 backdrop-blur text-white hover:bg-gray-700"
                                onClick={handleCopy}
                            >
                                <span className="material-symbols-outlined text-[16px] mr-1">content_copy</span> Copy
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="bg-gray-800/80 backdrop-blur text-white hover:bg-gray-700"
                                onClick={handleDownload}
                            >
                                <span className="material-symbols-outlined text-[16px] mr-1">download</span> Save
                            </Button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
