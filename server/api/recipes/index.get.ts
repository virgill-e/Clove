import { eq } from 'drizzle-orm';
import { ingredients, recipeIngredients, recipes } from '../../database/schema';
import { db } from '../../utils/db';

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const userRecipes = await db.select().from(recipes).where(eq(recipes.userId, user.id)).all();

  // For each recipe, get ingredients
  // This is not the most efficient way (n+1), but OK for start
  // In a real app we'd join once and group by recipeId
  const result = [];
  for (const recipe of userRecipes) {
    const recipeIngs = await db.select({
        id: ingredients.id,
        name: ingredients.name,
        amount: recipeIngredients.amount
      })
      .from(recipeIngredients)
      .innerJoin(ingredients, eq(ingredients.id, recipeIngredients.ingredientId))
      .where(eq(recipeIngredients.recipeId, recipe.id))
      .all();

    result.push({
      ...recipe,
      ingredients: recipeIngs
    });
  }

  return result;
});
