import { savedRecipes, recipes } from '../../../database/schema';
import { db } from '../../../utils/db';
import { eq, and } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const recipeId = event.context.params?.id;
  if (!recipeId) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid recipe ID' });
  }

  // 1. Check if recipe exists
  const recipe = await db.select().from(recipes).where(eq(recipes.id, recipeId)).get();
  if (!recipe) {
    throw createError({ statusCode: 404, statusMessage: 'Recipe not found' });
  }

  // 2. Don't save if already owner
  if (recipe.userId === user.id) {
    return { success: true, message: 'You are the owner of this recipe' };
  }

  // 3. Check if already saved
  const existingSave = await db.select()
    .from(savedRecipes)
    .where(
      and(
        eq(savedRecipes.userId, user.id),
        eq(savedRecipes.recipeId, recipeId)
      )
    )
    .get();

  if (existingSave) {
    return { success: true, message: 'Recipe already saved' };
  }

  // 4. Save it
  await db.insert(savedRecipes).values({
    userId: user.id,
    recipeId: recipeId,
  });

  return { success: true };
});
