import { eq } from 'drizzle-orm';
import { weeklyPlanner, recipes } from '../../database/schema';
import { db } from '../../utils/db';

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  // Fetch all planner entries for this user, including recipe details
  const entries = await db.select({
      id: weeklyPlanner.id,
      day: weeklyPlanner.day,
      mealType: weeklyPlanner.mealType,
      recipeId: weeklyPlanner.recipeId,
      recipe: {
        title: recipes.title,
        imageUrl: recipes.imageUrl,
        cookingTime: recipes.cookingTime,
      }
    })
    .from(weeklyPlanner)
    .innerJoin(recipes, eq(recipes.id, weeklyPlanner.recipeId))
    .where(eq(weeklyPlanner.userId, user.id))
    .all();

  return entries;
});
