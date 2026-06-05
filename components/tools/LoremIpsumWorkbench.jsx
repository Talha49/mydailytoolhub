'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { LoremEngine } from '@/lib/tools/LoremEngine'

/**
 * LoremIpsumWorkbench Component
 * Generator with configuration for Paragraphs/Sentences/Words
 */
export default function LoremIpsumWorkbench() {
    const [count, setCount] = useState(5)
    const [type, setType] = useState('paragraphs') // paragraphs | sentences | words
    const [startWithLorem, setStartWithLorem] = useState(true)
    const [output, setOutput] = useState('')

    // Generate initial text on mount
    useEffect(() => {
        handleGenerate()
    }, [])

    const handleGenerate = () => {
        const generated = LoremEngine.generate(Number(count), type, startWithLorem)
        setOutput(generated)
    }

    const handleCopy = () => {
        if (output) {
            navigator.clipboard.writeText(output)
        }
    }

    // Split paragraphs for nice rendering if type is paragraphs
    const displayBlocks = type === 'paragraphs' ? output.split('\n\n') : [output]

    return (
        <div className="grid lg:grid-cols-3 gap-8 animate-slideUp [animation-delay:100ms]">

            {/* Config */}
            <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-card-light dark:border-border-card-dark shadow-soft p-6">
                    <h3 className="text-sm font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider mb-6">Settings</h3>

                    <div className="space-y-6">
                        {/* Type Selection */}
                        <div>
                            <label className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark mb-2 block">Generate</label>
                            <div className="flex flex-col gap-2">
                                {['paragraphs', 'sentences', 'words'].map(t => (
                                    <label key={t} className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <input
                                            type="radio"
                                            name="type"
                                            checked={type === t}
                                            onChange={() => setType(t)}
                                            className="accent-primary size-4"
                                        />
                                        <span className="text-sm font-medium capitalize">{t}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Count Input */}
                        <div>
                            <label className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark mb-2 block">Quantity</label>
                            <input
                                type="number"
                                min="1"
                                max="1000"
                                value={count}
                                onChange={(e) => setCount(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-900 border border-border-light dark:border-border-dark rounded-lg px-4 py-2 text-sm font-bold"
                            />
                        </div>

                        {/* Checkbox */}
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={startWithLorem}
                                onChange={(e) => setStartWithLorem(e.target.checked)}
                                className="accent-primary size-4"
                            />
                            <span className="text-sm font-medium">Start with "Lorem ipsum..."</span>
                        </label>
                    </div>
                </div>

                <Button size="lg" className="w-full" onClick={handleGenerate}>Generate Text</Button>
            </div>

            {/* Output */}
            <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-card-light dark:border-border-card-dark shadow-soft flex flex-col h-full min-h-[500px]">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border-light dark:border-border-dark bg-gray-50/50 dark:bg-gray-700/50">
                        <span className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">Generated Text</span>
                        <Button variant="ghost" size="sm" icon="content_copy" onClick={handleCopy}>Copy</Button>
                    </div>
                    <div className="p-6 flex-1 overflow-auto custom-scrollbar">
                        {displayBlocks.map((block, idx) => (
                            <p key={idx} className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-4 last:mb-0">
                                {block}
                            </p>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    )
}
