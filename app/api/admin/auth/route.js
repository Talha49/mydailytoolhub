import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const DEFAULT_PASSWORD = 'admin123'

export async function POST(request) {
  try {
    const { password } = await request.json()
    const adminPassword = process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD

    if (password === adminPassword) {
      const cookieStore = await cookies()
      cookieStore.set('admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      })

      return NextResponse.json({ success: true, message: 'Authenticated successfully' })
    }

    return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function GET() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')

  if (session?.value === 'authenticated') {
    return NextResponse.json({ authenticated: true })
  }

  return NextResponse.json({ authenticated: false })
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.set('admin_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0, // Immediately expire
  })

  return NextResponse.json({ success: true, message: 'Logged out successfully' })
}
