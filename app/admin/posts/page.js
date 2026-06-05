'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'

export default function AdminPostsListPage() {
  const [posts, setPosts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function fetchPosts() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/posts')
      const data = await res.json()
      if (data.success) {
        setPosts(data.data)
      } else {
        setError(data.error || 'Failed to load posts')
      }
    } catch (err) {
      setError('Connection error. Failed to load posts.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return
    }

    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success) {
        alert('Post deleted successfully')
        fetchPosts() // Reload list
      } else {
        alert(data.error || 'Failed to delete post')
      }
    } catch (err) {
      alert('Network error. Failed to delete post.')
    }
  }

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminSidebar />

      <div className="flex-1 ml-64 flex flex-col">
        <AdminHeader 
          title="All Blog Articles" 
          actions={
            <Link href="/admin/new">
              <Button size="sm" variant="primary" icon="add">New Article</Button>
            </Link>
          }
        />
        
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Filter Bar */}
            <div className="flex gap-4 items-center">
              <div className="max-w-md flex-1">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles by title or category..."
                  prefix="search"
                  className="bg-white dark:bg-gray-900 border border-border-light dark:border-border-dark"
                />
              </div>
            </div>

            {error && (
              <div className="text-xs font-bold text-error bg-error/10 border border-error/20 p-3.5 rounded-xl flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {error}
              </div>
            )}

            {/* List Card */}
            <Card className="animate-slideUp">
              <Card.Body className="p-0">
                {loading ? (
                  <div className="p-12 text-center text-text-muted-light">Loading blog articles...</div>
                ) : filteredPosts.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-border-light dark:border-border-dark text-text-muted-light font-bold">
                          <th className="p-4">Title</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Read Time</th>
                          <th className="p-4">Date Created</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-light dark:divide-border-dark">
                        {filteredPosts.map((post) => (
                          <tr key={post._id} className="hover:bg-gray-100/50 dark:hover:bg-gray-800/20 transition-colors">
                            <td className="p-4 font-bold text-text-primary-light dark:text-text-primary-dark max-w-sm truncate">
                              {post.title}
                            </td>
                            <td className="p-4 text-text-secondary-light dark:text-text-secondary-dark">
                              {post.category}
                            </td>
                            <td className="p-4">
                              <Badge variant={post.status === 'published' ? 'success' : 'warning'}>
                                {post.status === 'published' ? 'Published' : 'Draft'}
                              </Badge>
                            </td>
                            <td className="p-4 text-text-secondary-light dark:text-text-secondary-dark">
                              {post.readTime}
                            </td>
                            <td className="p-4 text-text-muted-light dark:text-text-muted-dark">
                              {new Date(post.createdAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </td>
                            <td className="p-4 text-right space-x-2">
                              <Link href={`/admin/posts/edit/${post._id}`}>
                                <button className="p-1.5 text-primary hover:bg-primary/5 rounded-lg transition-all" title="Edit Post">
                                  <span className="material-symbols-outlined text-[18px]">edit</span>
                                </button>
                              </Link>
                              <button 
                                onClick={() => handleDelete(post._id, post.title)}
                                className="p-1.5 text-error hover:bg-error/5 rounded-lg transition-all" 
                                title="Delete Post"
                              >
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-16 text-center text-text-secondary-light">
                    <span className="material-symbols-outlined text-4xl text-text-muted-light mb-2">search_off</span>
                    <p className="font-bold">No articles found</p>
                    <p className="text-xs text-text-muted-light mt-1">Try another search query or write a new post!</p>
                  </div>
                )}
              </Card.Body>
            </Card>

          </div>
        </main>
      </div>
    </div>
  )
}
