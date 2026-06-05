import { NextResponse } from 'next/server'

export function middleware(request) {
  const path = request.nextUrl.pathname

  // Protect all /admin routes except for the login page
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const session = request.cookies.get('admin_session')
    
    if (session?.value !== 'authenticated') {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
