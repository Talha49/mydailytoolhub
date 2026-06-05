import Link from 'next/link'
import { Card } from '@/components/ui/Card'

/**
 * ToolCard Component for Homepage grid
 */
export default function ToolCard({ title, description, icon, href }) {
    return (
        <Card variant="hover" className="group">
            <Card.Body className="p-6 h-full flex flex-col">
                <div className="size-14 bg-primary/5 dark:bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm border border-primary/10 group-hover:border-primary group-hover:shadow-primary/30 group-hover:scale-110">
                    <span className="material-symbols-outlined text-[28px]">{icon}</span>
                </div>

                <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-3 group-hover:text-primary transition-colors tracking-tight">
                    {title}
                </h3>

                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-6 line-clamp-2 leading-relaxed flex-1">
                    {description}
                </p>

                <Link
                    href={href}
                    className="inline-flex items-center gap-2 text-sm font-bold text-primary group-hover:gap-3 transition-all underline-offset-4 hover:underline mt-auto"
                >
                    Open Tool
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
            </Card.Body>
        </Card>
    )
}
