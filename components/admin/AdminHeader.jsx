'use client'

import Button from '@/components/ui/Button'

/**
 * AdminHeader Component
 * Top bar for dashboard actions.
 */
export default function AdminHeader({ title, actions }) {
    return (
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-border-light dark:border-border-dark flex items-center justify-between px-8 sticky top-0 z-40">
            <h1 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                {title}
            </h1>

            <div className="flex items-center gap-3">
                {actions}
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                    View Site <span className="material-symbols-outlined text-[16px] ml-1">open_in_new</span>
                </Button>
            </div>
        </header>
    )
}
