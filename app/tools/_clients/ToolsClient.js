'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import AdSlot from '@/components/sections/AdSlot'
import { ALL_TOOLS, TOOL_CATEGORIES } from '@/lib/tools-data'
import { cn } from '@/lib/utils'

export default function ToolsClient() {
  const searchParams = useSearchParams()

  const [activeCategory, setActiveCategory] = useState(() => {
    const catParam = searchParams.get('category')
    if (!catParam) return 'All'
    const matched = TOOL_CATEGORIES.find(cat => cat.id.toLowerCase() === catParam.toLowerCase())
    return matched ? matched.id : 'All'
  })
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '')

  const filteredTools = ALL_TOOLS.filter(tool => {
    const matchesCategory =
      activeCategory === 'All' || tool.category === activeCategory

    const matchesSearch =
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-transparent">
      {/* EVERYTHING BELOW IS EXACTLY YOUR UI — unchanged */}
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-border-light dark:border-border-dark pt-12 pb-8">
        <div className="container-custom">
          <h1 className="text-4xl font-black mb-4">
            Explore Our Tools
          </h1>

          <p className="text-lg max-w-2xl">
            We have built 20+ specialized utilities to help you code, write, and design faster.
          </p>

          <div className="mt-8 relative max-w-xl">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools..."
              className="w-full px-4 py-3 rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* rest of your JSX stays SAME */}
        <div className="container-custom py-8">
         <AdSlot variant="leaderboard" className="mb-10" />

         <div className="grid lg:grid-cols-4 gap-8">
            
            {/* Sidebar Filters (Desktop) */}
            <aside className="hidden lg:block space-y-2">
               <h3 className="text-xs font-bold text-text-muted-light uppercase tracking-wider mb-4 px-3">Categories</h3>
               {TOOL_CATEGORIES.map(cat => (
                 <button
                   key={cat.id}
                   onClick={() => setActiveCategory(cat.id)}
                   className={cn(
                     "flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-bold transition-all",
                     activeCategory === cat.id 
                       ? "bg-primary text-white shadow-md shadow-primary/25" 
                       : "text-text-secondary-light hover:bg-gray-100 dark:hover:bg-gray-800"
                   )}
                 >
                   <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
                   {cat.label}
                 </button>
               ))}
            </aside>

            {/* Mobile Filter (Horizontal Scroll) */}
            <div className="lg:hidden flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
               {TOOL_CATEGORIES.map(cat => (
                 <button
                   key={cat.id}
                   onClick={() => setActiveCategory(cat.id)}
                   className={cn(
                     "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border",
                     activeCategory === cat.id 
                       ? "bg-primary text-white border-primary" 
                       : "bg-white dark:bg-gray-800 border-border-light dark:border-border-dark text-text-secondary-light"
                   )}
                 >
                    {cat.label}
                 </button>
               ))}
            </div>

            {/* Tool Grid */}
            <div className="lg:col-span-3">
               <div className="flex justify-between items-center mb-6">
                  <h2 className="font-bold text-text-primary-light dark:text-text-primary-dark">
                    {activeCategory === 'All' ? 'All Tools' : `${activeCategory} Tools`}
                    <span className="ml-2 text-sm text-text-muted-light font-normal">({filteredTools.length})</span>
                  </h2>
               </div>

               {filteredTools.length > 0 ? (
                 <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredTools.map(tool => (
                      <Link 
                        key={tool.id} 
                        href={tool.href}
                        className="group bg-white dark:bg-gray-800 rounded-xl border border-border-card-light dark:border-border-card-dark p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-300 flex flex-col h-full"
                      >
                         <div className="size-12 rounded-lg bg-primary/5 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-2xl">{tool.icon}</span>
                         </div>
                         <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-2 group-hover:text-primary transition-colors">
                           {tool.title}
                         </h3>
                         <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-4 flex-1">
                           {tool.description}
                         </p>
                         <div className="flex items-center text-xs font-bold text-text-muted-light uppercase tracking-wider group-hover:text-primary transition-colors">
                            {tool.category} <span className="material-symbols-outlined text-[16px] ml-auto opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">arrow_forward</span>
                         </div>
                      </Link>
                    ))}
                 </div>
               ) : (
                 <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-dashed border-2 border-border-light dark:border-border-dark">
                    <span className="material-symbols-outlined text-4xl text-text-muted-light mb-4 block">search_off</span>
                    <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-2">No tools found</h3>
                    <p className="text-text-secondary-light">Try adjusting your search query or category.</p>
                 </div>
               )}
            </div>

         </div>
      </div>
    </div>
  )
}
