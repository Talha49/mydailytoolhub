'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import Input from '@/components/ui/Input'
import { ALL_TOOLS } from '@/lib/tools-data'

/**
 * Search Component
 * Advanced global search with dropdown results
 */

export default function Search({ className }) {
    const [query, setQuery] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Mock results for demonstration replaces with real logic below

    // Filter tools based on query
    const results = query.length > 1 ? ALL_TOOLS.filter(tool =>
        tool.title.toLowerCase().includes(query.toLowerCase()) ||
        tool.description.toLowerCase().includes(query.toLowerCase())
    ).map(tool => ({
        title: tool.title,
        type: tool.category || 'Tool',
        href: tool.href
    })).slice(0, 5) : []

    return (
        <div ref={containerRef} className={cn('relative w-full max-w-sm', className)}>
            <Input
                placeholder="Search tools & guides..."
                icon="search"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value)
                    setIsOpen(true)
                }}
                onFocus={() => setIsOpen(true)}
                className="w-full"
            />

            {isOpen && query.length > 0 && (
                <div className="absolute top-full mt-2 left-0 w-full bg-white dark:bg-gray-800 rounded-xl border border-border-card-light dark:border-border-card-dark shadow-strong p-2 animate-fadeIn z-50">
                    {results.length > 0 ? (
                        <div className="space-y-1">
                            <div className="px-3 py-1.5 text-xs font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">
                                Best Matches
                            </div>
                            {results.map((result, i) => (
                                <a
                                    key={i}
                                    href={result.href}
                                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 group transition-colors"
                                >
                                    <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark group-hover:text-primary">
                                        {result.title}
                                    </span>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-text-secondary-light dark:text-text-secondary-dark">
                                        {result.type}
                                    </span>
                                </a>
                            ))}
                            {query.length > 0 && (
                                <a href={`/tools?q=${query}`} className="block px-3 py-2 text-xs font-bold text-primary text-center hover:underline">
                                    View all results
                                </a>
                            )}
                        </div>
                    ) : (
                        <div className="p-4 text-center text-sm text-text-muted-light dark:text-text-muted-dark">
                            No results found for "{query}"
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
