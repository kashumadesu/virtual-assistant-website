import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import type { UserRole } from '@/types';

const ROLE_HOME: Record<UserRole, string> = {
  admin: '/admin/dashboard',
  employee: '/employee/dashboard',
  client: '/client/dashboard',
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { supabaseResponse, user, supabase } = await updateSession(request);

  // ── Public paths ───────────────────────────────────────────────
  const isPublic =
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/auth/');

  // If not authenticated and trying to access protected area → login
  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If authenticated and hitting a public/login page → redirect to role dashboard
  if (user && (pathname === '/login' || pathname === '/')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role) {
      const url = request.nextUrl.clone();
      url.pathname = ROLE_HOME[profile.role as UserRole] ?? '/login';
      return NextResponse.redirect(url);
    }
  }

  // ── Role enforcement ────────────────────────────────────────────
  if (user && !isPublic) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const role = profile?.role as UserRole | undefined;

    const isAdminPath = pathname.startsWith('/admin');
    const isEmployeePath = pathname.startsWith('/employee');
    const isClientPath = pathname.startsWith('/client');

    if (isAdminPath && role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = role ? ROLE_HOME[role] : '/login';
      return NextResponse.redirect(url);
    }
    if (isEmployeePath && role !== 'employee') {
      const url = request.nextUrl.clone();
      url.pathname = role ? ROLE_HOME[role] : '/login';
      return NextResponse.redirect(url);
    }
    if (isClientPath && role !== 'client') {
      const url = request.nextUrl.clone();
      url.pathname = role ? ROLE_HOME[role] : '/login';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
