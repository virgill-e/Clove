import { eq, inArray } from 'drizzle-orm';
import { weeklyPlanner, recipeIngredients, ingredients } from '../../database/schema';
import { db } from '../../utils/db';

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  // Get all recipes in the current user's planner
  const plannerEntries = await db.select({ recipeId: weeklyPlanner.recipeId })
    .from(weeklyPlanner)
    .where(eq(weeklyPlanner.userId, user.id))
    .all();

  const recipeIds = plannerEntries.map(e => e.recipeId);

  if (recipeIds.length === 0) {
    return [];
  }

  // Fetch ingredients for these recipes
  const ings = await db.select({
      name: ingredients.name,
      amount: recipeIngredients.amount,
      recipeId: recipeIngredients.recipeId
    })
    .from(recipeIngredients)
    .innerJoin(ingredients, eq(ingredients.id, recipeIngredients.ingredientId))
    .where(inArray(recipeIngredients.recipeId, recipeIds))
    .all();

  // Aggregate by ingredient name
  // If a recipe is in the planner twice, we need to account for it twice.
  // Let's count occurrences of each recipeId in the planner
  const recipeCounts: Record<string, number> = {};
  for (const id of recipeIds) {
    recipeCounts[id] = (recipeCounts[id] || 0) + 1;
  }

  const list: Record<string, string[]> = {};

  for (const ing of ings) {
    const count = recipeCounts[ing.recipeId];
    if (!list[ing.name]) {
      list[ing.name] = [];
    }
    for (let i = 0; i < count; i++) {
      if (ing.amount && ing.amount.trim() !== '') {
        list[ing.name].push(ing.amount);
      }
    }
  }

  // Convert to array
  const result = Object.keys(list).map(name => {
    return {
      name,
      amounts: list[name]
    };
  });

  // Sort alphabetically
  result.sort((a, b) => a.name.localeCompare(b.name));

  return result;
});
