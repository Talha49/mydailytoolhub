import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import dbConnect from '@/lib/db'
import Post from '@/lib/models/Post'

// Helper to estimate read time
function calculateReadTime(text) {
  const wordsPerMinute = 200
  const words = text ? text.trim().split(/\s+/).length : 0
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}

// Middleware-like check for admin session
async function checkAuth() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  return session?.value === 'authenticated'
}

export async function GET() {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const posts = await Post.find({}).sort({ createdAt: -1 })
    return NextResponse.json({ success: true, data: posts })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const body = await request.json()

    // Estimate reading time from markdown length
    const readTime = calculateReadTime(body.markdown || '')

    // Check slug uniqueness
    const existingPost = await Post.findOne({ slug: body.slug })
    if (existingPost) {
      return NextResponse.json({ success: false, error: 'A post with this URL slug already exists.' }, { status: 400 })
    }

    const post = await Post.create({
      ...body,
      readTime,
    })

    return NextResponse.json({ success: true, data: post })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
