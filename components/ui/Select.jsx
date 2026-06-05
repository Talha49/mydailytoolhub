import { cn } from '@/lib/utils'

/**
 * Reusable Select Component
 */
export default function Select({
    label,
    options = [],
    error,
    className,
    ...props
}) {
    return (
        <div className="w-full space-y-1.5">
            {label && (
                <label className="text-[11px] font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider block">
                    {label}
                </label>
            )}

            <div className="relative">
                <select
                    className={cn(
                        'w-full appearance-none bg-white dark:bg-gray-800 border border-border-card-light dark:border-border-card-dark rounded-lg px-4 py-2.5 text-sm text-text-primary-light dark:text-text-primary-dark cursor-pointer transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none',
                        error && 'border-error focus:ring-error/20 focus:border-error',
                        className
                    )}
                    {...props}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>

                {/* Custom Chevron */}
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted-light dark:text-text-muted-dark text-[18px]">
                    expand_more
                </span>
            </div>

            {error && (
                <p className="text-[10px] font-bold text-error animate-slideUp">
                    {error}
                </p>
            )}
        </div>
    )
}
