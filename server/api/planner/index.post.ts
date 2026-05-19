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

  const [inserted] = await db.insert(weeklyPlanner)
    .values({
      userId: user.id,
      recipeId,
      day,
      mealType: mealType || 'Meal'
    })
    .returning();
    
  return { success: true, action: 'created', id: inserted.id };
});
