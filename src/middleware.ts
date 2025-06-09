import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/admin', '/tai-khoan']; // Add all protected routes here
const publicRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/confirm-account',
  '/auth/forgot-password',
  '/auth/reset-password',
];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some(
    (route) => path.startsWith(route) // Check if path starts with any protected route
  );
  const isPublicRoute = publicRoutes.includes(path);
  const accessToken = req.cookies.get('accessToken')?.value;

  // Handle protected routes
  if (isProtectedRoute && !accessToken) {
    // Redirect to login if trying to access protected route without token
    return NextResponse.redirect(new URL('/auth/login', req.nextUrl));
  }

  // Handle public routes
  if (isPublicRoute && accessToken) {
    // Redirect away from public routes if already logged in
    return NextResponse.redirect(new URL('/admin', req.nextUrl));
  }

  // Allow the request to proceed if none of the above conditions are met
  return NextResponse.next();
}
