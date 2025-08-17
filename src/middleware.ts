import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get('authCookie');

    const isProtectedRoute = request.nextUrl.pathname.startsWith('/admin/dashboard');

    // Redirect to login if user isn't logged in
    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Redirect to dashboard if user is logged in
    if (token && request.nextUrl.pathname.startsWith('/admin/login')) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher:['/admin/login','/admin/dashboard'],
}