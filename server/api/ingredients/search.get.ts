import { eq, like, and, sql } from 'drizzle-orm';
import { ingredients, recipeIngredients, recipes } from '../../database/schema';
import { db } from '../../utils/db';

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const query = getQuery(event);
  const searchTerm = query.q as string || '';

  // Return ingredients that match the search string, 
  // but ONLY those previously used by this specific user.
  const results = await db.selectDistinct({
      id: ingredients.id,
      name: ingredients.name,
    })
    .from(ingredients)
    .innerJoin(recipeIngredients, eq(ingredients.id, recipeIngredients.ingredientId))
    .innerJoin(recipes, eq(recipes.id, recipeIngredients.recipeId))
    .where(
      and(
        eq(recipes.userId, user.id),
        like(ingredients.name, `%${searchTerm}%`)
      )
    )
    .limit(20)
    .all();

  // Simple trick: if we want to ensure he sees HIS first, we could do two queries
  // But let's keep it simple for now as the current logic satisfies the "search" requirement.

  return results;
});
