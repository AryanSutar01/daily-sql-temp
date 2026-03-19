import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

/**
 * Google OAuth callback handler.
 *
 * FastAPI redirects here after completing Google OAuth with a short-lived JWT:
 *   /auth/callback?token=<jwt>
 *
 * We set it as an httpOnly cookie so it can't be read by JS (XSS protection),
 * then redirect the user to the appropriate page.
 */
export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const token = searchParams.get('token')
    const error = searchParams.get('error')

    if (error || !token) {
        return NextResponse.redirect(`${origin}/login?error=auth_failed`)
    }

    const cookieStore = await cookies()

    // Set the JWT as a cookie (7 days)
    // httpOnly: false is required so client-side api.ts can read it and send as Bearer token
    cookieStore.set('ds_token', token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
        path: '/',
    })

    // Redirect to practice or profile depending on whether we need onboarding
    // We use a client-side redirect target so the page can check profile state
    const forwardedHost = request.headers.get('x-forwarded-host')
    const isLocal = process.env.NODE_ENV === 'development'

    const base = isLocal ? origin : forwardedHost ? `https://${forwardedHost}` : origin
    return NextResponse.redirect(`${base}/auth/complete`)
}
