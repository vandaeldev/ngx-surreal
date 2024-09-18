import type { Surreal, Prettify } from 'surrealdb';

export type ConnectionOptions = Parameters<Surreal['connect']>[1];
export type SurrealConfig = ConnectionOptions & { url: string };
export type PrettyRecord = Prettify<Record<string, unknown>>;

export interface SurrealUseOptions {
  namespace?: string;
  database?: string;
}
