'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import { DiffEngine } from '@/lib/tools/DiffEngine'
import { cn } from '@/lib/utils'

export default function DiffViewerWorkbench() {
    const [original, setOriginal] = useState('This is the original text.\nIt has two lines.')
    const [modified, setModified] = useState('This is the modified text.\nIt has three lines.\nNew line here.')
    const [diffResult, setDiffResult] = useState([])
    const [mode, setMode] = useState('lines') // lines | chars

    // Auto-compute diff
    useEffect(() => {
        const res = DiffEngine.compute(original, modified, mode)
        setDiffResult(res)
    }, [original, modified, mode])

    const handleClear = () => {
        setOriginal('')
        setModified('')
    }

    return (
        <div className="flex flex-col gap-6 animate-slideUp [animation-delay:100ms]">

            <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-3 rounded-lg border border-border-card-light dark:border-border-card-dark shadow-sm">
                <div className="flex gap-2">
                    <button
                        onClick={() => setMode('lines')}
                        className={cn("px-3 py-1 text-sm font-bold rounded-md transition-all", mode === 'lines' ? "bg-primary text-white" : "text-text-muted-light hover:text-primary")}
                    >
                        Line Diff
                    </button>
                    <button
                        onClick={() => setMode('chars')}
                        className={cn("px-3 py-1 text-sm font-bold rounded-md transition-all", mode === 'chars' ? "bg-primary text-white" : "text-text-muted-light hover:text-primary")}
                    >
                        Char Diff
                    </button>
                </div>
                <Button variant="ghost" size="sm" onClick={handleClear}>Clear All</Button>
            </div>

            {/* Input Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Original */}
                <div className="flex flex-col h-[300px]">
                    <label className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark mb-2">Original Text</label>
                    <textarea
                        className="flex-1 w-full p-4 bg-white dark:bg-gray-800 border border-border-card-light dark:border-border-card-dark rounded-xl resize-none focus:ring-2 focus:ring-primary/20 outline-none font-mono text-sm leading-relaxed"
                        value={original}
                        onChange={(e) => setOriginal(e.target.value)}
                        placeholder="Paste original text here..."
                    />
                </div>

                {/* Modified */}
                <div className="flex flex-col h-[300px]">
                    <label className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark mb-2">Modified Text</label>
                    <textarea
                        className="flex-1 w-full p-4 bg-white dark:bg-gray-800 border border-border-card-light dark:border-border-card-dark rounded-xl resize-none focus:ring-2 focus:ring-primary/20 outline-none font-mono text-sm leading-relaxed"
                        value={modified}
                        onChange={(e) => setModified(e.target.value)}
                        placeholder="Paste modified text here..."
                    />
                </div>
            </div>

            {/* Output View */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">Difference View</label>
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-soft overflow-hidden min-h-[300px] font-mono text-sm">
                    {diffResult.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-text-muted-light">No differences found (texts are identical).</div>
                    ) : (
                        <div className="p-4 overflow-auto custom-scrollbar max-h-[500px]">
                            {diffResult.map((part, idx) => (
                                <div
                                    key={idx}
                                    className={cn(
                                        "whitespace-pre-wrap break-all px-2 py-0.5 border-l-4",
                                        part.type === 'equal' ? "border-transparent text-gray-700 dark:text-gray-300" :
                                            part.type === 'insert' ? "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-900 dark:text-green-300" :
                                                "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-900 dark:text-red-300 line-through decoration-red-900/30"
                                    )}
                                >
                                    {part.text}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}
