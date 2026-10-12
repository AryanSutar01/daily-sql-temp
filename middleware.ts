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

    // Regional pricing: pick INR vs USD once, from the host's edge geolocation (Vercel / Cloudflare
    // headers — free, no third-party IP lookup). Only set when there is no cookie yet: once set it is
    // also the visitor's own toggle choice on /pricing and /payment, which a later visit from another
    // country must not silently override. Without a country header (local dev, other hosts) nothing is
    // set and the pages default to INR.
    if (!request.cookies.has(CURRENCY_COOKIE)) {
        const country = request.headers.get('x-vercel-ip-country') || request.headers.get('cf-ipcountry')
        if (country && country !== 'XX') {
            response.cookies.set(CURRENCY_COOKIE, country === 'IN' ? 'INR' : 'USD', {
                maxAge: 60 * 60 * 24 * 180, // 180 days
                path: '/',
                sameSite: 'lax',
            })
        }
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
