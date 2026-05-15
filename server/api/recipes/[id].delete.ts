import { recipes } from '../../database/schema';
import { db } from '../../utils/db';
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

  // Check ownership before deleting
  const existingRecipe = await db.select()
    .from(recipes)
    .where(
      and(
        eq(recipes.id, recipeId),
        eq(recipes.userId, user.id)
      )
    )
    .get();

  if (!existingRecipe) {
    throw createError({ statusCode: 404, statusMessage: 'Recipe not found or unauthorized' });
  }

  try {
    // Delete the recipe (recipeIngredients will be deleted via CASCADE)
    await db.delete(recipes).where(eq(recipes.id, recipeId));
    
    return { success: true };
  } catch (e) {
    console.error('Error deleting recipe:', e);
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' });
  }
});
