'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0 })
  const [recentPosts, setRecentPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const res = await fetch('/api/admin/posts')
        const data = await res.json()
        if (data.success) {
          const posts = data.data
          const published = posts.filter(p => p.status === 'published').length
          const drafts = posts.filter(p => p.status === 'draft').length
          setStats({ total: posts.length, published, drafts })
          setRecentPosts(posts.slice(0, 5))
        }
      } catch (err) {
        console.error('Failed to load admin stats', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminSidebar />

      <div className="flex-1 ml-64 flex flex-col">
        <AdminHeader 
          title="Dashboard Overview" 
          actions={
            <Link href="/admin/new">
              <Button size="sm" variant="primary" icon="add">New Article</Button>
            </Link>
          }
        />
        
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <Card.Body className="flex items-center gap-4 py-6">
                  <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[28px]">article</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-muted-light dark:text-text-muted-dark">Total Articles</p>
                    <p className="text-3xl font-black text-text-primary-light dark:text-text-primary-dark mt-1">
                      {loading ? '...' : stats.total}
                    </p>
                  </div>
                </Card.Body>
              </Card>

              <Card>
                <Card.Body className="flex items-center gap-4 py-6">
                  <div className="size-12 rounded-xl bg-success/10 text-success flex items-center justify-center">
                    <span className="material-symbols-outlined text-[28px]">publish</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-muted-light dark:text-text-muted-dark">Published</p>
                    <p className="text-3xl font-black text-success mt-1">
                      {loading ? '...' : stats.published}
                    </p>
                  </div>
                </Card.Body>
              </Card>

              <Card>
                <Card.Body className="flex items-center gap-4 py-6">
                  <div className="size-12 rounded-xl bg-warning/10 text-warning flex items-center justify-center">
                    <span className="material-symbols-outlined text-[28px]">edit_note</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-muted-light dark:text-text-muted-dark">Drafts</p>
                    <p className="text-3xl font-black text-warning mt-1">
                      {loading ? '...' : stats.drafts}
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </div>

            {/* Quick Navigation Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <Card.Header title="Content Management" />
                <Card.Body className="space-y-4">
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    Write high-ranking, technical blogs that connect visitors directly back to your offline dev tools.
                  </p>
                  <div className="flex gap-3">
                    <Link href="/admin/new">
                      <Button size="sm" variant="primary">Write New Post</Button>
                    </Link>
                    <Link href="/admin/posts">
                      <Button size="sm" variant="secondary">View All Posts</Button>
                    </Link>
                  </div>
                </Card.Body>
              </Card>

              <Card>
                <Card.Header title="System & Analytics" />
                <Card.Body className="space-y-4">
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    Configure Google Analytics, track page-views, view sitemap generation status, and verify Search Console.
                  </p>
                  <div className="flex gap-3">
                    <a href="https://search.google.com/search-console" target="_blank" rel="noreferrer">
                      <Button size="sm" variant="secondary" icon="open_in_new">Search Console</Button>
                    </a>
                    <a href="https://analytics.google.com" target="_blank" rel="noreferrer">
                      <Button size="sm" variant="secondary" icon="open_in_new">Analytics</Button>
                    </a>
                  </div>
                </Card.Body>
              </Card>
            </div>

            {/* Recent Posts Table */}
            <Card>
              <Card.Header title="Recent Articles" />
              <Card.Body className="p-0">
                {loading ? (
                  <div className="p-8 text-center text-text-muted-light">Loading articles...</div>
                ) : recentPosts.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-border-light dark:border-border-dark text-text-muted-light font-bold">
                          <th className="p-4">Title</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Date Created</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-light dark:divide-border-dark">
                        {recentPosts.map((post) => (
                          <tr key={post._id} className="hover:bg-gray-100/50 dark:hover:bg-gray-800/20 transition-colors">
                            <td className="p-4 font-bold text-text-primary-light dark:text-text-primary-dark">
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
                            <td className="p-4 text-text-muted-light dark:text-text-muted-dark">
                              {new Date(post.createdAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </td>
                            <td className="p-4 text-right space-x-2">
                              <Link href={`/admin/posts/edit/${post._id}`}>
                                <button className="p-1 text-primary hover:bg-primary/5 rounded transition-all">
                                  <span className="material-symbols-outlined text-[18px]">edit</span>
                                </button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-12 text-center text-text-secondary-light">
                    <span className="material-symbols-outlined text-4xl text-text-muted-light mb-2">article</span>
                    <p className="font-bold">No articles found</p>
                    <p className="text-xs text-text-muted-light mt-1">Get started by writing your first article!</p>
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
