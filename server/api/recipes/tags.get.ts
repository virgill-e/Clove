import { eq, like, and, sql } from 'drizzle-orm';
import { recipes } from '../../database/schema';
import { db } from '../../utils/db';

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const query = getQuery(event);
  const searchTerm = query.q as string || '';

  // Return distinct tags previously used by this user
  const results = await db.selectDistinct({
      tag: recipes.tag
    })
    .from(recipes)
    .where(
      and(
        eq(recipes.userId, user.id),
        searchTerm ? like(recipes.tag, `%${searchTerm}%`) : undefined
      )
    )
    .limit(10)
    .all();

  return results.map((r: { tag: string | null }) => r.tag).filter(Boolean) as string[];
});
