import api from '@/lib/api'
import { NextResponse } from 'next/server'

export async function GET(request: NextResponse) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  const response = await api.post('/register', { code })
  const { token } = response.data

  const redirectTo = request.cookies.get('redirectTo')?.value
  const redirectURL = redirectTo ?? new URL('/', request.url)

  const expiresTokenInSeconds = 60 * 60 * 24 * 30

  return NextResponse.redirect(redirectURL, {
    headers: {
      'Set-Cookie': `token=${token}; Path=/; max-age=${expiresTokenInSeconds};`,
    },
  })
}
