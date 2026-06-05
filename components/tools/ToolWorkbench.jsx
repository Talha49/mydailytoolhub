'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

/**
 * ToolWorkbench Component
 * The main interactive area for tools (Input -> Controls -> Output)
 */
export default function ToolWorkbench() {
    const [activeTab, setActiveTab] = useState('editor')

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
                            <button className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-text-secondary-light dark:text-text-secondary-dark transition-colors" title="Upload File">
                                <span className="material-symbols-outlined text-[18px]">upload_file</span>
                            </button>
                            <button className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-text-secondary-light dark:text-text-secondary-dark transition-colors" title="Clear">
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                        </div>
                    </div>

                    {/* Editor Area */}
                    <textarea
                        className="flex-1 w-full p-4 bg-transparent border-none resize-none focus:ring-0 font-mono text-sm text-text-primary-light dark:text-text-primary-dark placeholder:text-text-muted-light/50"
                        placeholder='{"paste": "your", "json": "here"}'
                        spellCheck="false"
                    />

                    <div className="px-4 py-2 border-t border-border-light dark:border-border-dark bg-gray-50/30 dark:bg-gray-800/50 text-[10px] text-text-muted-light dark:text-text-muted-dark flex justify-between">
                        <span>0 lines</span>
                        <span>0 chars</span>
                    </div>
                </div>
            </div>

            {/* Control Actions (Mobile only - hidden on Desktop usually, but here central) */}
            <div className="flex lg:hidden justify-center gap-2">
                <Button variant="primary">Format</Button>
                <Button variant="secondary">Minify</Button>
            </div>

            {/* Output Area */}
            <div className="flex flex-col gap-4">
                <div className="bg-gray-900 rounded-xl border border-gray-700 shadow-soft overflow-hidden flex flex-col h-[500px]">
                    {/* Toolbar */}
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-success">check_circle</span>
                            <span className="text-sm font-bold text-white">Result</span>
                        </div>

                        <div className="flex gap-2">
                            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-700 h-7 px-2">
                                <span className="material-symbols-outlined text-[16px] mr-1">content_copy</span> Copy
                            </Button>
                            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-700 h-7 px-2">
                                <span className="material-symbols-outlined text-[16px] mr-1">download</span> Save
                            </Button>
                        </div>
                    </div>

                    {/* Result Area */}
                    <div className="flex-1 p-4 overflow-auto scrollbar-thin">
                        <pre className="font-mono text-sm text-blue-300">
                            {`{
  "status": "waiting",
  "message": "Enter JSON to format..."
}`}
                        </pre>
                    </div>
                </div>

                {/* Desktop Controls */}
                <div className="hidden lg:flex items-center justify-end gap-3">
                    <Button variant="secondary" icon="compress">Minify</Button>
                    <Button variant="primary" icon="format_align_left">Format JSON</Button>
                </div>
            </div>
        </div>
    )
}
