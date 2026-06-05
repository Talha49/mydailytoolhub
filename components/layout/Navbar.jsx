'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { APP_NAME, NAV_LINKS } from '@/lib/constants'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Search from '@/components/Search'

/**
 * Professional Navbar Component
 * 
 * Features: Mobile-first, Sticky, Search integration, Dynamic links
 */
export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-border-light dark:border-border-dark">
            <div className="container-custom h-16 flex items-center justify-between gap-4">
                {/* Logo & Desktop Nav */}
                <div className="flex items-center gap-8 lg:gap-12">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="size-9 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-[20px]">terminal</span>
                        </div>
                        <span className="text-text-primary-light dark:text-text-primary-dark font-black tracking-tight text-lg">
                            {APP_NAME}
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm font-bold text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Search & Actions */}
                <div className="flex items-center gap-4 flex-1 justify-end max-w-sm">
                    <div className="hidden sm:block flex-1">
                        <Search className="w-full" />
                    </div>

                    <div className="flex items-center gap-3">


                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden p-2 text-text-primary-light dark:text-text-primary-dark hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <span className="material-symbols-outlined">
                                {isMobileMenuOpen ? 'close' : 'menu'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-gray-900 border-b border-border-light dark:border-border-dark animate-fadeIn shadow-xl">
                    <nav className="flex flex-col p-6 gap-4">
                        <div className="sm:hidden mb-4">
                            <Input
                                type="text"
                                placeholder="Search tools..."
                                icon="search"
                            />
                        </div>
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-base font-bold text-text-primary-light dark:text-text-primary-dark px-2 py-1"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="h-px bg-border-light dark:bg-border-dark my-2" />
                        <Button variant="primary" className="w-full">
                            Sign Up
                        </Button>
                    </nav>
                </div>
            )}
        </header>
    )
}
