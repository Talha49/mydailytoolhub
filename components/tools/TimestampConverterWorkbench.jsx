'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import { TimestampConverter } from '@/lib/tools/TimestampConverter'
import { cn } from '@/lib/utils'

export default function TimestampConverterWorkbench() {
    const [input, setInput] = useState('')
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)

    // Auto-update clock
    const [currentTime, setCurrentTime] = useState(null)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    const handleParse = (val) => {
        setInput(val)
        if (!val) {
            setResult(null)
            setError(null)
            return
        }

        const date = TimestampConverter.parse(val)
        if (date) {
            setResult(TimestampConverter.format(date))
            setError(null)
        } else {
            setResult(null)
            setError('Invalid Date or Timestamp')
        }
    }

    const setNow = () => {
        const now = new Date()
        const ts = Math.floor(now.getTime() / 1000)
        handleParse(ts.toString())
    }

    // Initial load
    useEffect(() => {
        setNow()
    }, [])

    const handleCopy = (text) => {
        if (text) navigator.clipboard.writeText(text)
    }

    return (
        <div className="flex flex-col gap-6 animate-slideUp [animation-delay:100ms]">

            <div className="grid lg:grid-cols-2 gap-6">

                {/* Left Panel: Input */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between px-1">
                        <label className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">Input</label>
                        {currentTime && (
                            <span className="text-xs font-mono text-text-muted-light">
                                Current Epoch: {Math.floor(currentTime.getTime() / 1000)}
                            </span>
                        )}
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-card-light dark:border-border-card-dark shadow-soft p-6 h-full flex flex-col gap-6 justify-center">

                        <div className="flex flex-col gap-3">
                            <label className="text-sm font-medium text-text-muted-light">Timestamp, Date String, or ISO</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    className={cn(
                                        "flex-1 p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg focus:ring-2 outline-none font-mono text-lg transition-all",
                                        error ? "border-error focus:ring-error/20" : "border-gray-200 dark:border-gray-700 focus:ring-primary/20 focus:border-primary"
                                    )}
                                    placeholder="e.g. 1609459200 or 2021-01-01"
                                    value={input}
                                    onChange={(e) => handleParse(e.target.value)}
                                />
                                <Button onClick={setNow} variant="outline" className="px-6">Now</Button>
                            </div>
                            {error && <span className="text-xs font-bold text-error">{error}</span>}
                        </div>

                        <div className="text-xs text-text-muted-light">
                            <p>Supports: </p>
                            <ul className="list-disc pl-4 mt-1 space-y-1">
                                <li>Unix Epoch (Seconds): <code>1609459200</code></li>
                                <li>Unix Epoch (Milliseconds): <code>1609459200000</code></li>
                                <li>ISO 8601: <code>2021-01-01T00:00:00Z</code></li>
                                <li>Human Readable: <code>Jan 1, 2021</code></li>
                            </ul>
                        </div>

                    </div>
                </div>

                {/* Right Panel: Output */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between px-1">
                        <label className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">Converted Values</label>
                    </div>

                    <div className="bg-gray-900 rounded-xl border border-gray-700 shadow-soft overflow-hidden h-full flex flex-col">

                        {result ? (
                            <div className="p-6 flex flex-col gap-4 flex-1 overflow-auto custom-scrollbar">
                                <OutputRow label="Epoch (Seconds)" value={result.epochSeconds} onCopy={() => handleCopy(result.epochSeconds)} highlight />
                                <OutputRow label="Epoch (Milliseconds)" value={result.epochMilliseconds} onCopy={() => handleCopy(result.epochMilliseconds)} />
                                <div className="h-px bg-gray-800 my-2" />
                                <OutputRow label="ISO 8601" value={result.iso} onCopy={() => handleCopy(result.iso)} />
                                <OutputRow label="UTC String" value={result.utc} onCopy={() => handleCopy(result.utc)} />
                                <OutputRow label="Local String" value={result.local} onCopy={() => handleCopy(result.local)} />
                                <OutputRow label="Relative" value={result.relative} onCopy={() => handleCopy(result.relative)} />
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
                                Enter a valid date to see results.
                            </div>
                        )}

                    </div>
                </div>

            </div>
        </div>
    )
}

function OutputRow({ label, value, onCopy, highlight }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-gray-400">{label}</span>
            <div className="flex gap-2">
                <div className={cn(
                    "flex-1 bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 font-mono text-sm overflow-x-auto whitespace-nowrap custom-scrollbar",
                    highlight ? "text-green-400 font-bold" : "text-gray-300"
                )}>
                    {value}
                </div>
                <Button variant="ghost" size="sm" onClick={onCopy} className="text-gray-400 hover:text-white">
                    <span className="material-symbols-outlined text-[18px]">content_copy</span>
                </Button>
            </div>
        </div>
    )
}
