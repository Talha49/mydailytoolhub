'use client'

import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Search from '@/components/Search'

/**
 * High-conversion Hero section for Homepage
 */
export default function Hero() {
    const popularTags = ['JSON Lint', 'Word Counter', 'Base64', 'QR Maker', 'Diff Checker']

    return (
        <section className="relative overflow-hidden pt-20 pb-24 bg-white dark:bg-background-dark">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 opacity-30 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] size-[400px] bg-primary/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] right-[-10%] size-[300px] bg-blue-400/10 rounded-full blur-[80px]" />
            </div>

            <div className="container-custom">
                <div className="flex flex-col items-center text-center gap-10">
                    {/* Tagline */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 border border-primary/10 rounded-full text-xs font-black text-primary uppercase tracking-widest animate-fadeIn">
                        <span className="material-symbols-outlined text-[16px]">verified</span>
                        100% Client-Side & Private
                    </div>

                    {/* Heading */}
                    <div className="space-y-8 max-w-4xl mx-auto">
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-[1.1] tracking-tight text-text-primary-light dark:text-text-primary-dark animate-slideUp drop-shadow-sm">
                            All the tools you need in <br className="hidden md:block" />
                            <span className="text-gradient relative inline-block">
                                one elite place
                                <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary opacity-30" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                                </svg>
                            </span>.
                        </h1>
                        <p className="text-lg md:text-xl text-text-secondary-light dark:text-text-secondary-dark max-w-2xl mx-auto leading-relaxed animate-slideUp [animation-delay:100ms] font-medium">
                            Free, lightning-fast, and private online utility tools for high-performance developers and content creators.
                        </p>
                    </div>

                    {/* Search Box */}

                    {/* Popular Tags */}
                    <div className="flex flex-wrap justify-center items-center gap-4 text-sm font-bold animate-slideUp [animation-delay:300ms]">
                        <span className="text-text-muted-light dark:text-text-muted-dark uppercase text-[11px] tracking-widest">Popular:</span>
                        {popularTags.map((tag) => (
                            <a
                                key={tag}
                                href="#"
                                className="px-4 py-1.5 bg-gray-50 dark:bg-gray-800/50 border border-border-light dark:border-border-dark rounded-full text-text-secondary-light dark:text-text-secondary-dark hover:border-primary hover:text-primary transition-all active:scale-95"
                            >
                                {tag}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
