import { type NextRequest, NextResponse } from 'next/server'

const CURRENCY_COOKIE = 'dsql_currency'

/**
 * Lightweight middleware — no Supabase dependency.
 * The site is public, so we don't redirect unauthenticated users,
 * but we strip the Supabase cookie logic out here.
 * Protected-route checks are done at the component/API level using the ds_token cookie.
 */
export async function middleware(request: NextRequest) {
    const response = NextResponse.next()

    // Regional pricing: decide INR vs USD once, from Vercel's edge geolocation (accurate,
    // free, no third-party IP-lookup call). Only set it if the visitor doesn't already have
    // a value — once set, this is also the user's own explicit toggle choice on /pricing,
    // and a later visit from a different country should not silently override that choice.
    if (!request.cookies.has(CURRENCY_COOKIE)) {
        const country = request.headers.get('x-vercel-ip-country')
        const currency = country === 'IN' ? 'INR' : 'USD'
        response.cookies.set(CURRENCY_COOKIE, currency, {
            maxAge: 60 * 60 * 24 * 180, // 180 days
            path: '/',
            sameSite: 'lax',
        })
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
