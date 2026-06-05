'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { MarkdownProcessor } from '@/lib/tools/MarkdownProcessor'

/**
 * MarkdownPreviewWorkbench Component
 * Split view editor for Markdown writing with real-time preview
 */
export default function MarkdownPreviewWorkbench() {
    const [markdown, setMarkdown] = useState('# Hello World\n\nStart typing **Markdown** here...\n\n- [ ] Task 1\n- [x] Task 2 check\n\n```javascript\nconst a = 10;\n```')
    const [html, setHtml] = useState('')
    const [viewMode, setViewMode] = useState('preview') // 'preview' | 'html'

    // Real-time rendering
    useEffect(() => {
        const rendered = MarkdownProcessor.toHTML(markdown)
        setHtml(rendered)
    }, [markdown])

    const handleCopy = () => {
        navigator.clipboard.writeText(html)
    }

    const handleDownload = () => {
        const blob = new Blob([html], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'document.html'
        a.click()
        URL.revokeObjectURL(url)
    }

    // Helper to insert markdown syntax
    const insertSyntax = (prefix, suffix = '') => {
        setMarkdown(prev => prev + '\n' + prefix + 'text' + suffix)
    }

    return (
        <div className="flex flex-col gap-4 animate-slideUp [animation-delay:100ms]">

            {/* Toolbar - Sticky Top */}
            <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg border border-border-card-light dark:border-border-card-dark shadow-sm flex-wrap gap-4 sticky top-0 z-20">
                <div className="flex gap-1 flex-wrap">
                    <Button variant="ghost" size="sm" onClick={() => insertSyntax('**', '**')} title="Bold"><span className="material-symbols-outlined">format_bold</span></Button>
                    <Button variant="ghost" size="sm" onClick={() => insertSyntax('*', '*')} title="Italic"><span className="material-symbols-outlined">format_italic</span></Button>
                    <Button variant="ghost" size="sm" onClick={() => insertSyntax('- ')} title="List"><span className="material-symbols-outlined">format_list_bulleted</span></Button>
                    <Button variant="ghost" size="sm" onClick={() => insertSyntax('[', '](url)')} title="Link"><span className="material-symbols-outlined">link</span></Button>
                    <Button variant="ghost" size="sm" onClick={() => insertSyntax('![', '](url)')} title="Image"><span className="material-symbols-outlined">image</span></Button>
                    <div className="w-px h-6 bg-border-light dark:bg-border-dark mx-2 hidden md:block" />
                    <Button variant="ghost" size="sm" onClick={() => insertSyntax('```\n', '\n```')} title="Code Block"><span className="material-symbols-outlined">code</span></Button>
                    <Button variant="ghost" size="sm" onClick={() => insertSyntax('> ')} title="Quote"><span className="material-symbols-outlined">format_quote</span></Button>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={handleCopy} className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">content_copy</span> Copy HTML
                    </Button>
                    <Button variant="primary" size="sm" onClick={handleDownload} className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">download</span> Export HTML
                    </Button>
                </div>
            </div>

            {/* 
               Workspace Grid
               Using strict height [700px] on desktop to force scrolling.
            */}
            <div className="grid lg:grid-cols-2 gap-6 lg:h-[700px] h-auto">

                {/* Left Panel: Editor */}
                <div className="flex flex-col h-[500px] lg:h-full bg-white dark:bg-gray-800 rounded-xl border border-border-card-light dark:border-border-card-dark shadow-sm overflow-hidden">
                    <div className="h-10 px-4 flex items-center border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                        <span className="text-xs font-bold text-text-muted-light uppercase tracking-wider">Markdown Input</span>
                    </div>

                    <div className="flex-1 relative">
                        <textarea
                            className="absolute inset-0 w-full h-full p-6 bg-transparent border-none resize-none focus:ring-0 font-mono text-sm leading-relaxed text-text-primary-light dark:text-text-primary-dark placeholder:text-text-muted-light/50 overflow-auto custom-scrollbar"
                            value={markdown}
                            onChange={(e) => setMarkdown(e.target.value)}
                            placeholder="# Type markdown here..."
                        />
                    </div>
                </div>

                {/* Right Panel: Preview / HTML */}
                <div className="flex flex-col h-[500px] lg:h-full bg-white dark:bg-gray-800 rounded-xl border border-border-card-light dark:border-border-card-dark shadow-sm overflow-hidden">
                    <div className="h-10 px-2 flex items-center justify-between border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                        <span className="text-xs font-bold text-text-muted-light uppercase tracking-wider ml-2">Output</span>

                        {/* Toggle Tabs */}
                        <div className="flex bg-gray-200 dark:bg-gray-700 p-0.5 rounded-lg">
                            <button
                                onClick={() => setViewMode('preview')}
                                className={cn(
                                    "px-3 py-0.5 text-[10px] font-bold rounded-md transition-all uppercase tracking-wide",
                                    viewMode === 'preview' ? "bg-white dark:bg-gray-600 shadow-sm text-primary" : "text-text-muted-light hover:text-text-primary-light"
                                )}
                            >
                                Preview
                            </button>
                            <button
                                onClick={() => setViewMode('html')}
                                className={cn(
                                    "px-3 py-0.5 text-[10px] font-bold rounded-md transition-all uppercase tracking-wide",
                                    viewMode === 'html' ? "bg-white dark:bg-gray-600 shadow-sm text-primary" : "text-text-muted-light hover:text-text-primary-light"
                                )}
                            >
                                HTML Source
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 relative bg-white dark:bg-gray-50">
                        {viewMode === 'preview' ? (
                            <div className="absolute inset-0 w-full h-full overflow-auto custom-scrollbar">
                                <div
                                    className="p-8 prose prose-slate dark:prose-invert max-w-none break-words"
                                    dangerouslySetInnerHTML={{ __html: html }}
                                />
                            </div>
                        ) : (
                            <textarea
                                readOnly
                                className="absolute inset-0 w-full h-full p-6 bg-gray-50 dark:bg-gray-900 border-none resize-none focus:ring-0 font-mono text-sm leading-relaxed text-blue-600 dark:text-blue-400 overflow-auto custom-scrollbar whitespace-pre"
                                value={html}
                            />
                        )}
                    </div>
                </div>

            </div>

        </div>
    )
}
