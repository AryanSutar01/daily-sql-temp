import { type NextRequest, NextResponse } from 'next/server'

/**
 * Lightweight middleware — no Supabase dependency.
 * The site is public, so we don't redirect unauthenticated users,
 * but we strip the Supabase cookie logic out here.
 * Protected-route checks are done at the component/API level using the ds_token cookie.
 */
export async function middleware(request: NextRequest) {
    return NextResponse.next()
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
