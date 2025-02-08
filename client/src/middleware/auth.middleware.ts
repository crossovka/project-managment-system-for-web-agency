import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function authMiddleware(request: NextRequest) {
	const token = request.cookies.get('token')?.value;
	const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
	const isApiRequest = request.nextUrl.pathname.startsWith('/api');

	// Skip middleware for API routes
	if (isApiRequest) {
		return NextResponse.next();
	}

	if (!token && !isAuthPage) {
		const loginUrl = new URL('/login', request.url);
		loginUrl.searchParams.set('from', request.nextUrl.pathname);
		return NextResponse.redirect(loginUrl);
	}

	if (token && isAuthPage) {
		return NextResponse.redirect(new URL('/dashboard', request.url));
	}

	return NextResponse.next();
}
