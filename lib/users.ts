import { getPrisma } from "./db";

/** Look up a user by email (used by the Credentials authorize callback). */
export async function getUserByEmail(email: string) {
  return getPrisma().user.findUnique({
    where: { email: email.trim().toLowerCase() },
  });
}

/** Look up a user by id. */
export async function getUserById(id: string) {
  return getPrisma().user.findUnique({ where: { id } });
}

/** Update a user's bcrypt password hash. */
export async function updateUserPassword(id: string, passwordHash: string) {
  await getPrisma().user.update({ where: { id }, data: { passwordHash } });
}

/** Update a user's display name. */
export async function updateUserName(id: string, name: string) {
  await getPrisma().user.update({ where: { id }, data: { name } });
}
