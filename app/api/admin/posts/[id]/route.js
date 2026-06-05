import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import dbConnect from '@/lib/db'
import Post from '@/lib/models/Post'

function calculateReadTime(text) {
  const wordsPerMinute = 200
  const words = text ? text.trim().split(/\s+/).length : 0
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}

async function checkAuth() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  return session?.value === 'authenticated'
}

export async function GET(request, { params }) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await dbConnect()
    const post = await Post.findById(id)
    
    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: post })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await dbConnect()
    const body = await request.json()

    // Estimate reading time from markdown length
    const readTime = calculateReadTime(body.markdown || '')

    // Check slug uniqueness (if changed)
    const existingPost = await Post.findOne({ slug: body.slug, _id: { $ne: id } })
    if (existingPost) {
      return NextResponse.json({ success: false, error: 'A post with this URL slug already exists.' }, { status: 400 })
    }

    const post = await Post.findByIdAndUpdate(
      id,
      { ...body, readTime },
      { new: true, runValidators: true }
    )

    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: post })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await dbConnect()
    const post = await Post.findByIdAndDelete(id)

    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Post deleted successfully' })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
