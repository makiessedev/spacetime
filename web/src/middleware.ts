import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  const redirectURL = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`

  if (!token)
    return NextResponse.redirect(redirectURL, {
      headers: {
        'Set-Cookie': `redirectTo=${request.url}; HttpOnly; Path=/; max-age=60`,
      },
    })

  return NextResponse.next()
}

export const config = {
  matcher: '/memories/:path*',
}
