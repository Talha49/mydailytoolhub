import Link from 'next/link'
import { Card } from '@/components/ui/Card'

/**
 * RelatedTools Sidebar Widget
 */
export default function RelatedTools({ tools = [] }) {
    return (
        <div className="space-y-4 animate-slideUp [animation-delay:200ms]">
            <h3 className="font-bold text-text-primary-light dark:text-text-primary-dark flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">hub</span>
                Related Tools
            </h3>

            <div className="grid gap-3">
                {tools.map((tool, index) => (
                    <Link key={index} href={tool.href} className="block group">
                        <Card variant="hover" className="border-l-4 border-l-transparent hover:border-l- transition-all">
                            <Card.Body className="p-3 flex items-center gap-3">
                                <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">{tool.icon}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark truncate group-hover:text-primary transition-colors">
                                        {tool.title}
                                    </p>
                                    <p className="text-[10px] text-text-secondary-light dark:text-text-secondary-dark truncate">
                                        {tool.category}
                                    </p>
                                </div>
                                <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark text-[16px] group-hover:translate-x-1 transition-transform">
                                    chevron_right
                                </span>
                            </Card.Body>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
