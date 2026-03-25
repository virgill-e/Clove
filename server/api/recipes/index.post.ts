import { ingredients, recipeIngredients, recipes } from '../../database/schema';
import { db } from '../../utils/db';
import { eq } from 'drizzle-orm';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const formData = await readMultipartFormData(event);
  if (!formData) {
    throw createError({ statusCode: 400, statusMessage: 'No form data provided' });
  }

  // Extract fields from multipart form data
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

  let imageUrl = null;
  if (imageFile && imageFile.data && imageFile.filename) {
    // Validate format
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const ext = imageFile.filename.substring(imageFile.filename.lastIndexOf('.')).toLowerCase();
    
    if (!allowedExtensions.includes(ext)) {
       throw createError({ statusCode: 400, statusMessage: 'Invalid image format. Use JPG, PNG or WebP.' });
    }

    // Generate unique name
    const timestamp = Date.now();
    const safeName = `${timestamp}-${imageFile.filename.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const uploadDir = join(process.cwd(), 'public/uploads');
    
    // Ensure dir exists
    await mkdir(uploadDir, { recursive: true });
    
    const filePath = join(uploadDir, safeName);
    await writeFile(filePath, imageFile.data);
    
    imageUrl = `/uploads/${safeName}`;
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
    if (rawIngredients) {
      const ingredientInputs = JSON.parse(rawIngredients);
      if (Array.isArray(ingredientInputs)) {
        for (const input of ingredientInputs) {
          let ingredientId: number;
          const name = input.name.trim().toLowerCase();
          if (!name) continue;

          const existing = await db.select().from(ingredients).where(eq(ingredients.name, name)).get();

          if (existing) {
            ingredientId = existing.id;
          } else {
            const [newIngredient] = await db.insert(ingredients).values({ name }).returning();
            ingredientId = newIngredient.id;
          }

          await db.insert(recipeIngredients).values({
            recipeId: newRecipe.id,
            ingredientId,
            amount: input.amount,
          });
        }
      }
    }

    return { success: true, recipe: newRecipe };
  } catch (e: any) {
    console.error('Error creating recipe:', e);
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' });
  }
});
