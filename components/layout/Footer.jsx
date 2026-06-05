import Link from 'next/link'
import { APP_NAME, APP_DESCRIPTION, FOOTER_LINKS } from '@/lib/constants'

/**
 * Robust Site Footer
 * 
 * Features: Multi-column links, brand section, social icons, copyright
 */
export default function Footer() {
    return (
        <footer className="bg-white dark:bg-background-dark border-t border-border-light dark:border-border-dark pt-16 pb-12">
            <div className="container-custom">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Info */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-6 group">
                            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[18px]">terminal</span>
                            </div>
                            <span className="text-text-primary-light dark:text-text-primary-dark font-black tracking-tight text-lg">
                                {APP_NAME}
                            </span>
                        </Link>
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-6 max-w-xs">
                            {APP_DESCRIPTION}
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="size-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-text-muted-light dark:text-text-muted-dark hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-xl">share</span>
                            </a>
                            <a href="#" className="size-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-text-muted-light dark:text-text-muted-dark hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-xl">rss_feed</span>
                            </a>
                        </div>
                    </div>

                    {/* Tools Links */}
                    <div>
                        <h4 className="font-black text-xs uppercase tracking-widest text-text-primary-light dark:text-text-primary-dark mb-6">
                            Tools
                        </h4>
                        <ul className="space-y-4">
                            {FOOTER_LINKS.tools.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div>
                        <h4 className="font-black text-xs uppercase tracking-widest text-text-primary-light dark:text-text-primary-dark mb-6">
                            Resources
                        </h4>
                        <ul className="space-y-4">
                            {FOOTER_LINKS.resources.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h4 className="font-black text-xs uppercase tracking-widest text-text-primary-light dark:text-text-primary-dark mb-6">
                            Legal
                        </h4>
                        <ul className="space-y-4">
                            {FOOTER_LINKS.legal.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Copyright Bar */}
                <div className="pt-8 border-t border-border-light dark:border-border-dark flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-muted-light dark:text-text-muted-dark">
                    <p>© {new Date().getFullYear()} {APP_NAME} Platform. All rights reserved.</p>
                    <div className="flex gap-6 items-center">
                        <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-[16px]">language</span> English
                        </button>
                        <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-[16px]">dark_mode</span> Dark Mode
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    )
}
