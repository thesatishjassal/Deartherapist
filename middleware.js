// middleware.js
import { NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl.clone();
  if (url.protocol !== 'https:') {
    url.protocol = 'https:';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
