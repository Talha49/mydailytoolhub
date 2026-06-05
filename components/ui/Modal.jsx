import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

/**
 * Reusable Modal Component
 * 
 * Uses React Portals to render outside the main DOM tree.
 * Features: Background blur, ESC to close, click outside to close, scroll lock.
 */
export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    className,
    size = 'md',
}) {
    // Handle ESC key press
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && isOpen) onClose()
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [isOpen, onClose])

    // Scroll visibility lock
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!isOpen) return null

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        full: 'max-w-[95vw] h-[95vh]',
    }

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-background-dark/60 backdrop-blur-sm cursor-pointer"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={cn(
                'relative w-full bg-white dark:bg-gray-900 border border-border-card-light dark:border-border-card-dark rounded-2xl shadow-strong flex flex-col overflow-hidden animate-slideUp',
                sizes[size],
                className
            )}>
                {/* Header */}
                {(title || onClose) && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border-light dark:border-border-dark bg-gray-50/50 dark:bg-gray-800/50">
                        <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
                            {title}
                        </h3>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-full text-text-muted-light dark:text-text-muted-dark hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary transition-all active:scale-90"
                            aria-label="Close modal"
                        >
                            <span className="material-symbols-outlined text-[24px]">close</span>
                        </button>
                    </div>
                )}

                {/* Body */}
                <div className="flex-1 overflow-auto p-6 scrollbar-thin">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    )
}
