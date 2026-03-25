import { ingredients, recipeIngredients, recipes } from '../../database/schema';
import { db } from '../../utils/db';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const body = await readBody(event);
  const { title, description, instructions, imageUrl, tag, cookingTime, ingredientInputs } = body;

  if (!title) {
    throw createError({ statusCode: 400, statusMessage: 'Title is required' });
  }

  try {
    // 1. Create the recipe
    const [newRecipe] = await db.insert(recipes).values({
      userId: user.id,
      title,
      description,
      instructions,
      imageUrl,
      tag: tag || 'Daily',
      cookingTime,
    }).returning();

    // 2. Handle ingredients
    if (ingredientInputs && Array.isArray(ingredientInputs)) {
      for (const input of ingredientInputs) {
        let ingredientId: number;

        // Check if ingredient already exists (case-insensitive search would be better, but let's do simple first)
        const name = input.name.trim().toLowerCase();
        const existing = await db.select().from(ingredients).where(eq(ingredients.name, name)).get();

        if (existing) {
          ingredientId = existing.id;
        } else {
          const [newIngredient] = await db.insert(ingredients).values({ name }).returning();
          ingredientId = newIngredient.id;
        }

        // Link to recipe
        await db.insert(recipeIngredients).values({
          recipeId: newRecipe.id,
          ingredientId,
          amount: input.amount, // e.g. "200g"
        });
      }
    }

    return { success: true, recipe: newRecipe };
  } catch (e: any) {
    console.error('Error creating recipe:', e);
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' });
  }
});
