'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { APP_NAME } from '@/lib/constants'

/**
 * AdminSidebar Component
 * Vertical navigation for the dashboard.
 */
export default function AdminSidebar() {
    const pathname = usePathname()
    const router = useRouter()

    const handleLogout = async () => {
        if (!confirm('Are you sure you want to log out?')) return
        
        try {
            const res = await fetch('/api/admin/auth', { method: 'DELETE' })
            if (res.ok) {
                router.push('/admin/login')
                router.refresh()
            }
        } catch (err) {
            console.error('Logout failed', err)
        }
    }

    const navItems = [
        { label: 'Dashboard', icon: 'dashboard', href: '/admin' },
        { label: 'All Posts', icon: 'article', href: '/admin/posts' },
        { label: 'Create New', icon: 'edit_square', href: '/admin/new' },
        { label: 'Media Library', icon: 'image', href: '/admin/media' },
        { label: 'Settings', icon: 'settings', href: '/admin/settings' },
    ]

    return (
        <aside className="w-64 bg-white dark:bg-gray-900 border-r border-border-light dark:border-border-dark h-screen fixed left-0 top-0 flex flex-col z-50">
            {/* Brand */}
            <div className="h-16 flex items-center px-6 border-b border-border-light dark:border-border-dark">
                <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white mr-3">
                    <span className="material-symbols-outlined text-[18px]">terminal</span>
                </div>
                <span className="text-lg font-black text-text-primary-light dark:text-text-primary-dark tracking-tight">
                    {APP_NAME} <span className="text-xs font-medium text-text-muted-light bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded ml-1">Admin</span>
                </span>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                            pathname === item.href
                                ? 'bg-primary/10 text-primary font-bold'
                                : 'text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary'
                        )}
                    >
                        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                        {item.label}
                    </Link>
                ))}
            </nav>

            {/* User Footer */}
            <div className="p-4 border-t border-border-light dark:border-border-dark">
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="size-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-500" />
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-text-primary-light dark:text-text-primary-dark truncate">Admin User</p>
                        <p className="text-[10px] text-text-muted-light dark:text-text-muted-dark truncate">admin@devtoolspro.com</p>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="text-text-muted-light hover:text-error transition-colors"
                        title="Logout"
                    >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                    </button>
                </div>
            </div>
        </aside>
    )
}
