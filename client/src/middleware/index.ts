import type { NextRequest } from 'next/server';
import { authMiddleware } from './auth.middleware';

export function middleware(request: NextRequest) {
	// Auth middleware
	return authMiddleware(request);
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public folder
		 * - api routes
		 */
		'/((?!_next/static|_next/image|favicon.ico|public|api/).*)',
	],
};
