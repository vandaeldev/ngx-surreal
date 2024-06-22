import type { ConnectionOptions, Prettify } from 'surrealdb.js';

export type SurrealConfig = ConnectionOptions & { url: string };
export type PrettyRecord = Prettify<Record<string, unknown>>;

export interface SurrealUseOptions {
  namespace?: string;
  database?: string;
}
