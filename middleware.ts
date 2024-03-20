import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(req: NextRequest, res: NextResponse) {
  if (
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.includes('/api/') ||
    PUBLIC_FILE.test(req.nextUrl.pathname)
  ) {
    return;
  }
  const token = req.cookies.get('token');
  if (token && req.nextUrl.pathname.includes('login')) {
    return NextResponse.redirect(new URL('/home', req.url))
  } else if ((!token || token === undefined) && !req.nextUrl.pathname.includes('login')) {
    return NextResponse.redirect(new URL('/home', req.url))
  }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/login', '/user/order/:path*', '/user/:path/address/:path*'],
};
