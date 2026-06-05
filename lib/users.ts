import { getPrisma } from "./db";

/** Look up a user by email (used by the Credentials authorize callback). */
export async function getUserByEmail(email: string) {
  return getPrisma().user.findUnique({
    where: { email: email.trim().toLowerCase() },
  });
}
