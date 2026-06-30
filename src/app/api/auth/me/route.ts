import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth_token');
  return NextResponse.json({ isLoggedIn: !!token?.value });
}
