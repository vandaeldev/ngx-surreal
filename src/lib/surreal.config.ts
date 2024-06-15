import type { ConnectionOptions } from 'surrealdb.js';

export type SurrealConfig = ConnectionOptions & { url: string };
