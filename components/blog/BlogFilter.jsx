'use client'

import { cn } from '@/lib/utils'

/**
 * BlogFilter Component
 * Scrollable tab list for filtering blog posts by category.
 */
export default function BlogFilter({ categories, activeCategory, onSelect }) {
    return (
        <div className="flex justify-center mb-12 animate-slideUp [animation-delay:100ms]">
            <div className="flex items-center gap-2 overflow-x-auto pb-4 md:pb-0 px-4 scrollbar-hide max-w-full">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => onSelect(cat)}
                        className={cn(
                            'px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300',
                            activeCategory === cat
                                ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-105'
                                : 'bg-white dark:bg-gray-800 text-text-secondary-light dark:text-text-secondary-dark border border-border-light dark:border-border-dark hover:border-primary hover:text-primary'
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>
    )
}
