import { and, eq } from 'drizzle-orm';
import { weeklyPlanner } from '../../database/schema';
import { db } from '../../utils/db';

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const plannerId = event.context.params?.id;
  if (!plannerId) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid planner ID' });
  }

  // Ensure user owns this planner entry before deleting
  const existing = await db.select()
    .from(weeklyPlanner)
    .where(
      and(
        eq(weeklyPlanner.id, plannerId),
        eq(weeklyPlanner.userId, user.id)
      )
    ).get();

  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Planner entry not found' });
  }

  await db.delete(weeklyPlanner).where(eq(weeklyPlanner.id, plannerId));

  return { success: true };
});
