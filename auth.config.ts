import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe Auth.js config (no Prisma, no bcrypt) — imported by middleware.ts
 * for route gating, and spread into the full config in auth.ts. Keeping DB/crypto
 * out of here is what lets the middleware run on the edge.
 */
export const authConfig = {
  // Trust the deployment host (Vercel / custom domains) for callback URLs.
  trustHost: true,
  pages: { signIn: "/login" },
  providers: [], // real providers are added in auth.ts (Node runtime)
  callbacks: {
    // Route gate used by middleware. Everything is private except the auth pages.
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isPublic =
        pathname === "/" || // public marketing landing page
        pathname.startsWith("/login") ||
        pathname.startsWith("/signup") ||
        pathname.startsWith("/api/auth") ||
        // Blob upload: auth is enforced inside the route at token time; the
        // upload-completed callback (no session cookie) must reach it.
        pathname.startsWith("/api/upload");
      if (isPublic) return true;
      return Boolean(auth?.user);
    },
    jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      if (user) token.role = (user as { role?: string }).role ?? "user";
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) session.user.id = String(token.id);
      if (session.user) session.user.role = String(token.role ?? "user");
      return session;
    },
  },
} satisfies NextAuthConfig;
