'use client'

import { useState, useEffect, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { RegexEngine } from '@/lib/tools/RegexEngine'

/**
 * RegexWorkbench Component
 * specialized UI for Regex Testing (Pattern + Flags + Test String)
 */
export default function RegexWorkbench() {
    const [pattern, setPattern] = useState('([A-Z])\\w+')
    const [flags, setFlags] = useState({ g: true, i: false, m: false })
    const [testString, setTestString] = useState('Hello World\nThis is a Test String for Regex 101.')
    const [result, setResult] = useState({ matches: [], error: null, count: 0 })

    // Compute active flags string (e.g., "gim")
    const activeFlags = useMemo(() => {
        return Object.keys(flags).filter(f => flags[f]).join('')
    }, [flags])

    // Real-time execution
    useEffect(() => {
        const res = RegexEngine.test(pattern, activeFlags, testString)
        setResult(res)
    }, [pattern, activeFlags, testString])

    const toggleFlag = (flag) => {
        setFlags(prev => ({ ...prev, [flag]: !prev[flag] }))
    }

    return (
        <div className="grid lg:grid-cols-2 gap-6 animate-slideUp [animation-delay:100ms]">
            {/* Input Area */}
            <div className="flex flex-col gap-4">

                {/* Pattern Input */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-card-light dark:border-border-card-dark shadow-soft overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50/50 dark:bg-gray-700/50 border-b border-border-light dark:border-border-dark">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">regular_expression</span>
                            <span className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">Regular Expression</span>
                        </div>
                    </div>
                    <div className="p-4 flex items-center gap-2">
                        <span className="text-gray-400 font-mono text-lg">/</span>
                        <input
                            type="text"
                            value={pattern}
                            onChange={(e) => setPattern(e.target.value)}
                            className="flex-1 bg-transparent border-none focus:ring-0 font-mono text-lg text-text-primary-light dark:text-text-primary-dark placeholder:text-text-muted-light"
                            placeholder="Type your regex pattern..."
                        />
                        <span className="text-gray-400 font-mono text-lg">/</span>
                        <div className="flex gap-1">
                            {['g', 'i', 'm'].map(flag => (
                                <button
                                    key={flag}
                                    onClick={() => toggleFlag(flag)}
                                    className={cn(
                                        "size-8 rounded font-mono text-sm font-bold transition-colors",
                                        flags[flag]
                                            ? "bg-primary text-white"
                                            : "bg-gray-100 dark:bg-gray-700 text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-200 dark:hover:bg-gray-600"
                                    )}
                                    title={`Toggle '${flag}' flag`}
                                >
                                    {flag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Test String Input */}
                <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl border border-border-card-light dark:border-border-card-dark shadow-soft overflow-hidden flex flex-col h-[300px]">
                    <div className="px-4 py-3 bg-gray-50/50 dark:bg-gray-700/50 border-b border-border-light dark:border-border-dark">
                        <span className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">Test String</span>
                    </div>
                    <textarea
                        value={testString}
                        onChange={(e) => setTestString(e.target.value)}
                        className="flex-1 w-full p-4 bg-transparent border-none resize-none focus:ring-0 font-mono text-sm text-text-primary-light dark:text-text-primary-dark placeholder:text-text-muted-light/50"
                        placeholder="Paste your text here to test against the regex..."
                        spellCheck="false"
                    />
                </div>
            </div>

            {/* Output Area */}
            <div className="flex flex-col gap-4">
                <div className={cn(
                    "bg-gray-900 rounded-xl border shadow-soft overflow-hidden flex flex-col h-full min-h-[460px] transition-colors",
                    result.error ? "border-red-500/50" : "border-gray-700"
                )}>
                    {/* Toolbar */}
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
                        <div className="flex items-center gap-2">
                            <span className={cn("material-symbols-outlined", result.error ? "text-red-400" : "text-success")}>
                                {result.error ? 'error' : 'check_circle'}
                            </span>
                            <span className="text-sm font-bold text-white">
                                {result.error ? 'Syntax Error' : `Match Information (${result.count})`}
                            </span>
                        </div>
                    </div>

                    {/* Result Area */}
                    <div className="flex-1 p-4 overflow-auto scrollbar-thin">
                        {result.error ? (
                            <div className="p-4 bg-red-500/10 rounded-lg text-red-400 font-mono text-sm border border-red-500/20">
                                {result.error}
                            </div>
                        ) : result.count === 0 ? (
                            <div className="text-gray-500 text-sm italic text-center mt-20">
                                No matches found. Try adjusting the pattern.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {result.matches.map((match, i) => (
                                    <div key={i} className="bg-gray-800/50 rounded-lg border border-gray-700 p-3 hover:bg-gray-800 transition-colors group">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Match {i + 1}</span>
                                            <span className="text-[10px] text-gray-500 font-mono">Index: {match.index} • Length: {match.length}</span>
                                        </div>

                                        <div className="font-mono text-sm text-white bg-black/20 p-2 rounded mb-2 border border-gray-700/50">
                                            {match.content}
                                        </div>

                                        {match.groups.length > 0 && (
                                            <div className="space-y-1">
                                                {match.groups.map((group, gIndex) => (
                                                    <div key={gIndex} className="flex text-xs pl-2 border-l-2 border-gray-600">
                                                        <span className="text-gray-400 w-16">Group {gIndex + 1}:</span>
                                                        <span className="text-green-400 font-mono">{group}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
