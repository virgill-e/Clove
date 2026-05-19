import { ingredients, recipeIngredients, recipes } from '../../database/schema';
import { db } from '../../utils/db';
import { eq, and } from 'drizzle-orm';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { deleteUpload } from '../../utils/files';

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const recipeId = event.context.params?.id;
  if (!recipeId) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid recipe ID' });
  }

  // Check ownership
  const existingRecipe = await db.select().from(recipes).where(and(eq(recipes.id, recipeId), eq(recipes.userId, user.id))).get();
  if (!existingRecipe) {
    throw createError({ statusCode: 404, statusMessage: 'Recipe not found or unauthorized' });
  }

  const formData = await readMultipartFormData(event);
  if (!formData) {
    throw createError({ statusCode: 400, statusMessage: 'No form data provided' });
  }

  const fields: Record<string, string> = {};
  let imageFile: any = null;

  for (const item of formData) {
    if (item.name === 'image') {
      imageFile = item;
    } else if (item.name) {
      fields[item.name] = item.data.toString();
    }
  }

  const { title, description, instructions, tag, cookingTime, ingredientInputs: rawIngredients } = fields;
  
  if (!title) {
    throw createError({ statusCode: 400, statusMessage: 'Title is required' });
  }

  let newImageUrl = null;
  let imageUrl = existingRecipe.imageUrl; // Keep old image by default
  
  if (imageFile && imageFile.data && imageFile.filename) {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const ext = imageFile.filename.substring(imageFile.filename.lastIndexOf('.')).toLowerCase();
    
    if (allowedExtensions.includes(ext)) {
      const timestamp = Date.now();
      const safeName = `${timestamp}-${imageFile.filename.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const uploadDir = join(process.cwd(), 'uploads');
      await mkdir(uploadDir, { recursive: true });
      const filePath = join(uploadDir, safeName);
      await writeFile(filePath, imageFile.data);
      
      newImageUrl = `/api/uploads/${safeName}`;
      imageUrl = newImageUrl;
    }
  }

  try {
    // 1. Update the recipe
    await db.update(recipes).set({
      title,
      description,
      instructions,
      imageUrl,
      tag: tag || 'Daily',
      cookingTime,
    }).where(eq(recipes.id, recipeId));

    // 2. Handle ingredients (Delete and Re-insert)
    if (rawIngredients) {
      const ingredientInputs = JSON.parse(rawIngredients);
      if (Array.isArray(ingredientInputs)) {
        // Delete old links
        await db.delete(recipeIngredients).where(eq(recipeIngredients.recipeId, recipeId));

        for (const input of ingredientInputs) {
          let ingredientId: string;
          const name = input.name.trim().toLowerCase();
          if (!name) continue;

          const existingIng = await db.select().from(ingredients).where(eq(ingredients.name, name)).get();

          if (existingIng) {
            ingredientId = existingIng.id;
          } else {
            const [newIngredient] = await db.insert(ingredients).values({ name }).returning();
            ingredientId = newIngredient.id;
          }

          await db.insert(recipeIngredients).values({
            recipeId,
            ingredientId,
            amount: input.amount,
          });
        }
      }
    }

    // Success! Now delete the old image if it was replaced
    if (newImageUrl && existingRecipe.imageUrl && newImageUrl !== existingRecipe.imageUrl) {
      await deleteUpload(existingRecipe.imageUrl);
    }

    return { success: true };
  } catch (e: any) {
    console.error('Error updating recipe:', e);
    // Cleanup NEWLY uploaded image if database update failed
    if (newImageUrl) {
      await deleteUpload(newImageUrl);
    }
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' });
  }
});
