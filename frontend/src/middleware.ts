import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect /admin routes
    if (pathname.startsWith('/admin')) {
        // Exclude login page from protection
        if (pathname === '/admin/login') {
            return NextResponse.next();
        }

        // Check for auth token (in a real app, this should be a secure cookie)
        // Since we are using localStorage in the client, we'll rely on the client-side check in layout.tsx for now
        // But for a more robust solution, we'd use cookies.
        // Let's add a placeholder check or rely on the Layout's useEffect.
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
