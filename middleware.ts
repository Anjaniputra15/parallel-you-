import { auth } from "./auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isProtectedRoute =
    nextUrl.pathname.startsWith("/new") ||
    nextUrl.pathname.startsWith("/session") ||
    nextUrl.pathname.startsWith("/history");

  if (isProtectedRoute && !isLoggedIn) {
    return Response.redirect(new URL("/", nextUrl));
  }

  return undefined;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
