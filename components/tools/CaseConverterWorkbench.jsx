'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { CaseConverterLogic } from '@/lib/tools/CaseConverterLogic'

/**
 * CaseConverterWorkbench Component
 * Instant conversion buttons for text transformation
 */
export default function CaseConverterWorkbench() {
    const [text, setText] = useState('Welcome to Case Converter')

    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0
    const charCount = text.length

    const handleCopy = () => navigator.clipboard.writeText(text)
    const handleClear = () => setText('')

    const conversions = [
        { label: 'UPPERCASE', icon: 'uppercase', action: () => setText(CaseConverterLogic.toUpperCase(text)) },
        { label: 'lowercase', icon: 'lowercase', action: () => setText(CaseConverterLogic.toLowerCase(text)) },
        { label: 'camelCase', icon: 'match_case', action: () => setText(CaseConverterLogic.toCamelCase(text)) },
        { label: 'snake_case', icon: 'show_chart', action: () => setText(CaseConverterLogic.toSnakeCase(text)) }, // using abstract icon
        { label: 'Capitalized Case', icon: 'title', action: () => setText(CaseConverterLogic.toTitleCase(text)) },
        { label: 'Alternating cAsE', icon: 'texture', action: () => setText(CaseConverterLogic.toAlternatingCase(text)) },
    ]

    return (
        <div className="flex flex-col gap-6 animate-slideUp [animation-delay:100ms]">

            {/* Editor */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-card-light dark:border-border-card-dark shadow-soft flex flex-col min-h-[300px]">
                <div className="flex items-center justify-between px-4 py-2 border-b border-border-light dark:border-border-dark bg-gray-50/50 dark:bg-gray-700/50">
                    <span className="text-xs font-bold text-text-muted-light uppercase tracking-wider">Input Text</span>
                    <div className="flex gap-2">
                        <button onClick={handleCopy} className="text-xs font-bold text-primary hover:underline">Copy to Clipboard</button>
                        <button onClick={handleClear} className="text-xs font-bold text-error hover:underline">Clear</button>
                    </div>
                </div>
                <textarea
                    className="flex-1 w-full p-6 bg-transparent border-none resize-none focus:ring-0 text-lg leading-relaxed text-text-primary-light dark:text-text-primary-dark placeholder:text-text-muted-light custom-scrollbar"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
            </div>

            {/* Action Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {conversions.map((conv) => (
                    <button
                        key={conv.label}
                        onClick={conv.action}
                        className="flex flex-col items-center justify-center gap-2 p-4 bg-white dark:bg-gray-800 border border-border-card-light dark:border-border-card-dark rounded-xl hover:border-primary hover:shadow-md transition-all group"
                    >
                        <span className="material-symbols-outlined text-text-secondary-light group-hover:text-primary transition-colors">{conv.icon}</span>
                        <span className="text-xs font-bold text-text-primary-light dark:text-text-primary-dark">{conv.label}</span>
                    </button>
                ))}
            </div>

            <div className="flex justify-between items-center text-sm text-text-secondary-light px-2">
                <span>Word Count: {wordCount}</span>
                <span>Character Count: {charCount}</span>
            </div>

        </div>
    )
}
