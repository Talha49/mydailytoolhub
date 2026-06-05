import Badge from '@/components/ui/Badge'

/**
 * ToolHeader Component
 * Displays the tool title, description, and metadata.
 */
export default function ToolHeader({ title, description, category, lastUpdated }) {
    return (
        <div className="mb-8 animate-slideUp">
            <div className="flex items-center gap-3 mb-4">
                <Badge variant="primary" size="md">
                    {category}
                </Badge>
                {lastUpdated && (
                    <span className="text-xs font-medium text-text-muted-light dark:text-text-muted-dark">
                        Last updated: {lastUpdated}
                    </span>
                )}
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-text-primary-light dark:text-text-primary-dark mb-4 tracking-tight">
                {title}
            </h1>

            <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark max-w-3xl leading-relaxed">
                {description}
            </p>
        </div>
    )
}
