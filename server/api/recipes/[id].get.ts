import { eq, and } from 'drizzle-orm';
import { ingredients, recipeIngredients, recipes } from '../../database/schema';
import { db } from '../../utils/db';

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const recipeId = event.context.params?.id;
  if (!recipeId) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid recipe ID' });
  }

  const recipe = await db.select()
    .from(recipes)
    .where(
      and(
        eq(recipes.id, recipeId),
        eq(recipes.userId, user.id)
      )
    )
    .get();

  if (!recipe) {
    throw createError({ statusCode: 404, statusMessage: 'Recipe not found' });
  }

  const recipeIngs = await db.select({
      id: ingredients.id,
      name: ingredients.name,
      amount: recipeIngredients.amount
    })
    .from(recipeIngredients)
    .innerJoin(ingredients, eq(ingredients.id, recipeIngredients.ingredientId))
    .where(eq(recipeIngredients.recipeId, recipe.id))
    .all();

  return {
    ...recipe,
    ingredients: recipeIngs
  };
});
