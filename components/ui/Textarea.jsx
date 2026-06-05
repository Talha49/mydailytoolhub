import { cn } from '@/lib/utils'

/**
 * Reusable Textarea Component
 */
export default function Textarea({
    label,
    error,
    className,
    rows = 6,
    ...props
}) {
    return (
        <div className="w-full space-y-1.5">
            {label && (
                <label className="text-[11px] font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider block">
                    {label}
                </label>
            )}

            <textarea
                rows={rows}
                className={cn(
                    'w-full bg-white dark:bg-gray-800 border border-border-card-light dark:border-border-card-dark rounded-lg px-4 py-3 text-sm text-text-primary-light dark:text-text-primary-dark placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none resize-y',
                    error && 'border-error focus:ring-error/20 focus:border-error',
                    className
                )}
                {...props}
            />

            {error && (
                <p className="text-[10px] font-bold text-error animate-slideUp">
                    {error}
                </p>
            )}
        </div>
    )
}
