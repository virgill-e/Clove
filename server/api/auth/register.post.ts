import bcrypt from 'bcryptjs';
import { users } from '../../database/schema';
import { db } from '../../utils/db';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, email, password } = body;

  if (!name || !email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Missing fields' });
  }

  // Check if user already exists
  const existing = await db.select().from(users).where(eq(users.email, email)).get();
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'User already exists' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert user
  const newUser = await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
  }).returning().get();

  // Set session cookie (simplified)
  setCookie(event, 'auth_user', JSON.stringify({ id: newUser.id, name: newUser.name }), {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
    sameSite: 'lax',
  });

  return { success: true, user: { id: newUser.id, name: newUser.name } };
});
