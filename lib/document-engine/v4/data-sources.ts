import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import type { DataSource, Mapping, ResolveContext } from './types';

const dbPath = path.resolve('data', 'temin360.sqlite');

export class SqliteDataSource implements DataSource {
  private db: DatabaseSync;

  constructor() {
    this.db = new DatabaseSync(dbPath);
  }

  resolve(mapping: Mapping, context: ResolveContext): unknown {
    if (mapping.kind === 'static') {
      return mapping.value;
    }

    if (mapping.kind === 'column') {
      const targetId = mapping.scopeId === 'documentId' ? context.documentId : context.globalId;
      try {
        const row = this.db
          .prepare(`SELECT ${mapping.column} FROM ${mapping.table} WHERE ${mapping.whereColumn} = ?`)
          .get(targetId) as Record<string, unknown> | undefined;
        return row ? row[mapping.column] : null;
      } catch (err) {
        console.error(`SqliteDataSource column resolve error (${mapping.table}.${mapping.column}):`, err);
        return null;
      }
    }

    if (mapping.kind === 'collection') {
      const targetId = mapping.scopeId === 'documentId' ? context.documentId : context.globalId;
      try {
        let sql = `SELECT * FROM ${mapping.table} WHERE ${mapping.whereColumn} = ?`;
        if (mapping.orderBy) {
          sql += ` ORDER BY ${mapping.orderBy}`;
        }
        const rows = this.db.prepare(sql).all(targetId) as Record<string, unknown>[];
        return rows.map((row) => {
          const item: Record<string, unknown> = {};
          for (const [targetKey, sourceCol] of Object.entries(mapping.fields)) {
            item[targetKey] = row[sourceCol];
          }
          return item;
        });
      } catch (err) {
        console.error(`SqliteDataSource collection resolve error (${mapping.table}):`, err);
        return [];
      }
    }

    if (mapping.kind === 'relation') {
      const targetId = mapping.scopeId === 'documentId' ? context.documentId : context.globalId;
      try {
        const sql = `
          SELECT r.${mapping.selectColumn}
          FROM ${mapping.table} l
          JOIN ${mapping.relatedTable} r ON l.${mapping.localColumn} = r.${mapping.foreignColumn}
          WHERE l.${mapping.whereColumn} = ?
        `;
        const row = this.db.prepare(sql).get(targetId) as Record<string, unknown> | undefined;
        return row ? row[mapping.selectColumn] : null;
      } catch (err) {
        console.error(`SqliteDataSource relation resolve error:`, err);
        return null;
      }
    }

    return null;
  }
}

