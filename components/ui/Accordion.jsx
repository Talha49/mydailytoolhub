"use client"
import { useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * Reusable Accordion Component
 * 
 * Perfect for FAQ sections. Supporting multiple sections.
 */
export default function Accordion({ items = [], className }) {
    const [openIndex, setOpenIndex] = useState(0)

    const toggle = (index) => {
        setOpenIndex(openIndex === index ? -1 : index)
    }

    return (
        <div className={cn('space-y-4', className)}>
            {items.map((item, index) => {
                const isOpen = openIndex === index

                return (
                    <div
                        key={index}
                        className="group bg-white dark:bg-gray-900 border border-border-card-light dark:border-border-card-dark rounded-xl overflow-hidden transition-all duration-300"
                    >
                        <button
                            onClick={() => toggle(index)}
                            className="w-full p-4 flex items-center justify-between text-left focus:outline-none"
                        >
                            <span className={cn(
                                'font-bold transition-colors',
                                isOpen ? 'text-primary' : 'text-text-primary-light dark:text-text-primary-dark'
                            )}>
                                {item.title}
                            </span>
                            <span className={cn(
                                'material-symbols-outlined transition-transform duration-300',
                                isOpen ? 'rotate-180 text-primary' : 'text-text-muted-light dark:text-text-muted-dark'
                            )}>
                                expand_more
                            </span>
                        </button>

                        <div
                            className={cn(
                                'overflow-hidden transition-all duration-300 ease-in-out',
                                isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                            )}
                        >
                            <div className="p-4 pt-0 text-sm leading-relaxed text-text-secondary-light dark:text-text-secondary-dark border-t border-border-light/50 dark:border-border-dark/50">
                                {item.content}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
