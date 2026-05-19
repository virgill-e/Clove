import { and, eq } from 'drizzle-orm';
import { weeklyPlanner, recipes } from '../../database/schema';
import { db } from '../../utils/db';

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const body = await readBody(event);
  const { recipeId, day, mealType } = body;

  if (!recipeId || !day || !mealType) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields' });
  }

  // Validate recipe exists
  const recipe = await db.select().from(recipes).where(eq(recipes.id, recipeId)).get();
  if (!recipe) {
    throw createError({ statusCode: 404, statusMessage: 'Recipe not found' });
  }

  // Check if there's already an entry for this day and mealType for this user
  const existing = await db.select()
    .from(weeklyPlanner)
    .where(
      and(
        eq(weeklyPlanner.userId, user.id),
        eq(weeklyPlanner.day, day),
        eq(weeklyPlanner.mealType, mealType)
      )
    ).get();

  if (existing) {
    // Update existing
    await db.update(weeklyPlanner)
      .set({ recipeId })
      .where(eq(weeklyPlanner.id, existing.id));
    return { success: true, action: 'updated', id: existing.id };
  } else {
    // Insert new
    const [inserted] = await db.insert(weeklyPlanner)
      .values({
        userId: user.id,
        recipeId,
        day,
        mealType
      })
      .returning();
    return { success: true, action: 'created', id: inserted.id };
  }
});
