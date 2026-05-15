import { eq, or, and, sql } from 'drizzle-orm';
import { ingredients, recipeIngredients, recipes, savedRecipes, users } from '../../database/schema';
import { db } from '../../utils/db';

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  // 1. Get owned recipes
  const owned = await db.select({
      recipe: recipes,
      creatorName: users.name
    })
    .from(recipes)
    .innerJoin(users, eq(users.id, recipes.userId))
    .where(eq(recipes.userId, user.id))
    .all();

  // 2. Get saved recipes
  const saved = await db.select({
      recipe: recipes,
      creatorName: users.name
    })
    .from(savedRecipes)
    .innerJoin(recipes, eq(recipes.id, savedRecipes.recipeId))
    .innerJoin(users, eq(users.id, recipes.userId))
    .where(eq(savedRecipes.userId, user.id))
    .all();

  // Merge and deduplicate
  const combined = [...owned, ...saved];
  const uniqueRecipes = Array.from(new Map(combined.map(item => [item.recipe.id, item])).values());

  const result = [];
  for (const item of uniqueRecipes) {
    const { recipe, creatorName } = item;
    
    // Ingredients
    const recipeIngs = await db.select({
        id: ingredients.id,
        name: ingredients.name,
        amount: recipeIngredients.amount
      })
      .from(recipeIngredients)
      .innerJoin(ingredients, eq(ingredients.id, recipeIngredients.ingredientId))
      .where(eq(recipeIngredients.recipeId, recipe.id))
      .all();

    // Save count
    const saveStats = await db.select({ count: sql<number>`count(*)` })
      .from(savedRecipes)
      .where(eq(savedRecipes.recipeId, recipe.id))
      .get();

    result.push({
      ...recipe,
      creatorName,
      ingredients: recipeIngs,
      isOwner: recipe.userId === user.id,
      saveCount: saveStats?.count || 0
    });
  }

  return result;
});
