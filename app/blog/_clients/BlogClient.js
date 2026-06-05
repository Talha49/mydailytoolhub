'use client'

import { useState } from 'react'
import BlogFilter from '@/components/blog/BlogFilter'
import BlogCard from '@/components/sections/BlogCard'
import Pagination from '@/components/blog/Pagination'
import AdSlot from '@/components/sections/AdSlot'

const CATEGORIES = ['All', 'Developer', 'SEO', 'Security', 'Design', 'Tutorial', 'Tech News']

export default function BlogClient({ initialPosts }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredPosts = activeCategory === 'All'
    ? initialPosts
    : initialPosts.filter(post => post.category === activeCategory)

  // Simple pagination: 6 posts per page
  const postsPerPage = 6
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost)
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage) || 1

  return (
    <div className="space-y-8">
      <BlogFilter 
        categories={CATEGORIES} 
        activeCategory={activeCategory} 
        onSelect={(cat) => {
          setActiveCategory(cat)
          setCurrentPage(1)
        }} 
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 animate-slideUp [animation-delay:200ms]">
        {currentPosts.map((post) => (
          <BlogCard 
            key={post._id} 
            title={post.title}
            description={post.description}
            category={post.category}
            readTime={post.readTime}
            date={new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
            image={post.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800'}
            href={`/blog/${post.slug}`}
          />
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-20 text-text-muted-light dark:text-text-muted-dark italic">
          No articles found in this category.
        </div>
      )}

      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
        />
      )}

      <div className="mt-16">
        <AdSlot variant="leaderboard" />
      </div>
    </div>
  )
}
