import { eq, and } from 'drizzle-orm';
import { ingredients, recipeIngredients, recipes, users, savedRecipes } from '../../database/schema';
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

  const recipeData = await db.select({
      recipe: recipes,
      creatorName: users.name
    })
    .from(recipes)
    .innerJoin(users, eq(users.id, recipes.userId))
    .where(eq(recipes.id, recipeId))
    .get();

  if (!recipeData) {
    throw createError({ statusCode: 404, statusMessage: 'Recipe not found' });
  }

  const { recipe, creatorName } = recipeData;

  const recipeIngs = await db.select({
      id: ingredients.id,
      name: ingredients.name,
      amount: recipeIngredients.amount
    })
    .from(recipeIngredients)
    .innerJoin(ingredients, eq(ingredients.id, recipeIngredients.ingredientId))
    .where(eq(recipeIngredients.recipeId, recipe.id))
    .all();

  const isOwner = recipe.userId === user.id;
  
  let savedBy: any[] = [];
  if (isOwner) {
    savedBy = await db.select({
        name: users.name,
      })
      .from(savedRecipes)
      .innerJoin(users, eq(users.id, savedRecipes.userId))
      .where(eq(savedRecipes.recipeId, recipe.id))
      .all();
  }

  return {
    ...recipe,
    creatorName,
    ingredients: recipeIngs,
    isOwner,
    savedBy // Only populated for owners
  };
});
