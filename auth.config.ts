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
        pathname.startsWith("/login") ||
        pathname.startsWith("/signup") ||
        pathname.startsWith("/api/auth");
      if (isPublic) return true;
      return Boolean(auth?.user);
    },
    jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) session.user.id = String(token.id);
      return session;
    },
  },
} satisfies NextAuthConfig;
