'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

/**
 * TextDiffWorkbench Component
 * Dual-pane text comparison tool
 */
export default function TextDiffWorkbench() {
    return (
        <div className="flex flex-col gap-6 animate-slideUp [animation-delay:100ms]">

            {/* Controls */}
            <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl border border-border-card-light dark:border-border-card-dark shadow-sm">
                <h2 className="font-bold text-text-primary-light">Compare Text</h2>
                <div className="flex gap-3">
                    <Button variant="ghost" size="sm" icon="swap_horiz">Swap</Button>
                    <Button variant="primary" size="sm" icon="difference">Find Difference</Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
                {/* Original */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center px-1">
                        <label className="text-xs font-bold text-text-muted-light uppercase">Original Text</label>
                        <button className="text-xs font-bold text-primary hover:underline">Clear</button>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-card-light dark:border-border-card-dark shadow-soft overflow-hidden h-[500px]">
                        <textarea
                            className="w-full h-full p-4 bg-transparent border-none resize-none focus:ring-0 font-mono text-sm leading-relaxed text-text-primary-light dark:text-text-primary-dark placeholder:text-text-muted-light/50"
                            placeholder="Paste original text here..."
                            defaultValue="The quick brown fox jumps over the lazy dog."
                        />
                    </div>
                </div>

                {/* Modified */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center px-1">
                        <label className="text-xs font-bold text-text-muted-light uppercase">Modified Text</label>
                        <button className="text-xs font-bold text-primary hover:underline">Clear</button>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-border-card-light dark:border-border-card-dark shadow-soft overflow-hidden h-[500px]">
                        <textarea
                            className="w-full h-full p-4 bg-transparent border-none resize-none focus:ring-0 font-mono text-sm leading-relaxed text-text-primary-light dark:text-text-primary-dark placeholder:text-text-muted-light/50"
                            placeholder="Paste modified text here..."
                            defaultValue="The quick red fox jumps over the lazy dog."
                        />
                    </div>
                </div>
            </div>

        </div>
    )
}
