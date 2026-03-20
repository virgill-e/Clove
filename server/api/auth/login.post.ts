import bcrypt from 'bcryptjs';
import { users } from '../../database/schema';
import { db } from '../../utils/db';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body;

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Missing fields' });
  }

  // Find user
  const user = await db.select().from(users).where(eq(users.email, email)).get();
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' });
  }

  // Check password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' });
  }

  // Set session cookie
  setCookie(event, 'auth_user', JSON.stringify({ id: user.id, name: user.name }), {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
    sameSite: 'lax',
  });

  return { success: true, user: { id: user.id, name: user.name } };
});
