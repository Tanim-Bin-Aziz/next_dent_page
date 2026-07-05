import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  // Not logged in → only /login allowed
  if (!user && !pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user) {
    // Get role from profiles table
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role;

    // Redirect logged-in user away from login
    if (pathname === "/login") {
      if (role === "admin")
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      if (role === "doctor")
        return NextResponse.redirect(new URL("/doctor/dashboard", request.url));
      if (role === "patient")
        return NextResponse.redirect(
          new URL("/patient/dashboard", request.url),
        );
    }

    // Role-based route protection
    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (pathname.startsWith("/doctor") && role !== "doctor") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (pathname.startsWith("/patient") && role !== "patient") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/login", "/admin/:path*", "/doctor/:path*", "/patient/:path*"],
};
