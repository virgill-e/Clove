import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
});

export const recipes = sqliteTable('recipes', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  description: text('description'),
  instructions: text('instructions'),
  imageUrl: text('image_url'),
  tag: text('tag').default('Daily'),
  cookingTime: text('cooking_time'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
});

export const ingredients = sqliteTable('ingredients', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull().unique(),
});

export const recipeIngredients = sqliteTable('recipe_ingredients', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  recipeId: text('recipe_id').notNull().references(() => recipes.id, { onDelete: 'cascade' }),
  ingredientId: text('ingredient_id').notNull().references(() => ingredients.id),
  amount: text('amount'), // e.g. "200g", "2 pieces"
});

export const savedRecipes = sqliteTable('saved_recipes', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id),
  recipeId: text('recipe_id').notNull().references(() => recipes.id, { onDelete: 'cascade' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
});
