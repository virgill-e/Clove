import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../database/schema';

let _db: any = null;

export const useDb = () => {
  if (!_db) {
    try {
      console.log('[DB] Lazy loading better-sqlite3...');
      const SQLite = (Database as any).default || Database;
      const sqlite = new SQLite(process.env.DATABASE_URL || 'local.db');
      _db = drizzle(sqlite, { schema });
      console.log('[DB] Drizzle connected.');
    } catch (e) {
      console.error('[DB] Connection error:', e);
      throw e;
    }
  }
  return _db;
};

// Exporting a lazy proxy for the 'db' object so existing code still works
export const db = new Proxy({} as any, {
  get(target, prop) {
    return useDb()[prop];
  }
});
