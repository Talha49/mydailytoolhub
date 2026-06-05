import { cn } from '@/lib/utils'

/**
 * Reusable Input Component
 * 
 * Variants: default, error
 */
export default function Input({
    label,
    error,
    className,
    type = 'text',
    icon: Icon,
    maxLength,
    value,
    ...props
}) {
    const charCount = value?.length || 0

    return (
        <div className="w-full space-y-1.5">
            {label && (
                <label className="text-[11px] font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider block">
                    {label}
                </label>
            )}

            <div className="relative group">
                {Icon && (
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark text-[20px] transition-colors group-focus-within:text-primary">
                        {Icon}
                    </span>
                )}

                <input
                    type={type}
                    className={cn(
                        'w-full bg-white dark:bg-gray-800 border border-border-card-light dark:border-border-card-dark rounded-lg px-4 py-2 text-sm text-text-primary-light dark:text-text-primary-dark placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none',
                        Icon && 'pl-10',
                        error && 'border-error focus:ring-error/20 focus:border-error',
                        className
                    )}
                    maxLength={maxLength}
                    value={value}
                    {...props}
                />

                {maxLength && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-text-muted-light dark:text-text-muted-dark">
                        {charCount}/{maxLength}
                    </div>
                )}
            </div>

            {error && (
                <p className="text-[10px] font-bold text-error animate-slideUp">
                    {error}
                </p>
            )}
        </div>
    )
}
