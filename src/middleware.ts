import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/dashboard'];
const publicRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/confirm-account',
  '/auth/forgot-password',
  '/auth/reset-password',
];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);
  const accessToken = req.cookies.get('accessToken')?.value;
  if (isProtectedRoute && !accessToken) {
    return NextResponse.redirect(new URL('/auth/login', req.nextUrl));
  }
  if (isProtectedRoute && accessToken) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  if (isPublicRoute && accessToken) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  return NextResponse.next();
}
