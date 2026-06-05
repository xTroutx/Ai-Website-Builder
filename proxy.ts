import NextAuth from "next-auth";
import type { NextRequest } from "next/server";
import { authConfig } from "./auth.config";

/**
 * Route gating (Next 16 "proxy" convention, formerly "middleware"). Runs on the
 * edge using only the edge-safe Auth.js config — the `authorized` callback in
 * auth.config.ts redirects unauthenticated users to /login for any private route.
 */
const { auth } = NextAuth(authConfig);

// Next 16 requires a function export here (a const binding isn't recognized),
// so we wrap the Auth.js handler in a function declaration.
export default function proxy(request: NextRequest, event: unknown) {
  return (
    auth as unknown as (
      req: NextRequest,
      ev: unknown,
    ) => Response | Promise<Response | undefined>
  )(request, event);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
