import dbConnect from '@/lib/db'
import Post from '@/lib/models/Post'
import Breadcrumb from '@/components/layout/Breadcrumb'
import BlogHeader from '@/components/blog/BlogHeader'
import BlogClient from './_clients/BlogClient'
import { APP_NAME } from '@/lib/constants'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: `Guides, Tutorials & Insights | ${APP_NAME} Blog`,
  description: 'Learn SEO practices, JSON structure optimization, developer tips, and why client-side utility processing is more secure.',
  alternates: {
    canonical: 'https://www.corehubtools.com/blog',
  },
}

export default async function BlogListingPage() {
  await dbConnect()
  
  // Query all published posts from newest to oldest
  const rawPosts = await Post.find({ status: 'published' }).sort({ createdAt: -1 })

  // Serialize Mongoose docs for Next.js client component compatibility
  const posts = rawPosts.map((doc) => {
    const post = doc.toObject()
    post._id = post._id.toString()
    post.createdAt = post.createdAt.toISOString()
    post.updatedAt = post.updatedAt.toISOString()
    return post
  })

  return (
    <div className="container-custom py-8">
      <Breadcrumb items={[{ label: 'Blog', href: '/blog', active: true }]} />
      
      <BlogHeader />
      
      <BlogClient initialPosts={posts} />
    </div>
  )
}
