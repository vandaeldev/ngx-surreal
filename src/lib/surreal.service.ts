import { computed, inject, Injectable } from '@angular/core';
import { from, type Observable } from 'rxjs';
import { type RecordId as _RecordId, type ActionResult, type Patch, RecordIdRange, type StringRecordId, Surreal, Table } from 'surrealdb';
import type { PrettyRecord, SurrealUseOptions } from './surreal.config';
import { SURREAL_CONFIG_TOKEN } from './surreal.module';

type RecordId<Tb extends string = string> = _RecordId<Tb> | StringRecordId;

@Injectable({
  providedIn: 'root'
})
export class SurrealService {
  /**
   * The connection object to the Surreal database.
   */
  public readonly connection = computed(() => this.db.connection);

  /**
   * A computed value that returns the emitter object from the Surreal database.
   */
  public readonly emitter = computed(() => this.db.emitter);

  /**
   * A computed value that returns the status of the Surreal database connection.
   */
  public readonly status = computed(() => this.db.status);

  private readonly db = new Surreal();
  private readonly config = inject(SURREAL_CONFIG_TOKEN);

  constructor() {
    this.connect().subscribe();
  }

  /**
   * Authenticates the current connection with a JWT token.
   * @param token - The JWT authentication token.
   */
  public authenticate(...args: Parameters<Surreal['authenticate']>) {
    return from(this.db.authenticate(...args));
  }

  /**
   * Disconnect the socket to the database.
   */
  public close() {
    return from(this.db.close());
  }

  /**
   * Establish a socket connection to the database.
   * The connection config as defined at bootstrap will be used.
   */
  public connect() {
    const { url, ...options } = this.config;
    return from(this.db.connect(new URL(url), options));
  }

  /**
   * Creates a record in the database.
   * @param thing - The table name or the specific record ID to create.
   * @param data - The document / record data to insert.
   */
  create<T extends PrettyRecord, U extends PrettyRecord = T>(thing: RecordId, data?: U): Observable<ActionResult<T>[]>;
  create<T extends PrettyRecord, U extends PrettyRecord = T>(thing: Table | string, data?: U): Observable<ActionResult<T>>;
  public create<T extends PrettyRecord, U extends PrettyRecord = T>(thing: (Table | string) & RecordId, data?: U) {
    return from(this.db.create<T, U>(thing, data));
  }

  /**
   * Deletes all records in a table, or a specific record, from the database.
   * @param thing - The table name or a record ID to select.
   */
  delete<T extends PrettyRecord>(thing: RecordId): Observable<ActionResult<T>[]>;
  delete<T extends PrettyRecord>(thing: RecordIdRange | Table | string): Observable<ActionResult<T>>;
  public delete<T extends PrettyRecord>(thing: (RecordIdRange | Table | string) & RecordId) {
    return from(this.db.delete<T>(thing));
  }

  /**
	 * Export the database and return the result as a string.
	 * @param options - Export configuration options.
	 */
  public export(...args: Parameters<Surreal['export']>) {
    return from(this.db.export(...args));
  }

  /**
	 * Import an existing export into the database.
	 * @param input - The data to import.
	 */
  public import(...args: Parameters<Surreal['import']>) {
    return from(this.db.import(...args));
  }

  /**
   * Selects everything from the [$auth](https://surrealdb.com/docs/surrealql/parameters) variable.
   * ```sql
   * SELECT * FROM $auth;
   * ```
   * Make sure the user actually has the permission to select their own record, otherwise you'll get back an empty result.
   * @return The record linked to the record ID used for authentication.
   */
  public info<T extends PrettyRecord>(): Observable<ActionResult<T> | undefined> {
    return from(this.db.info<T>());
  }

	/**
	 * Inserts one or multiple records in the database.
	 * @param table - The table name to insert into.
	 * @param data - The document(s) / record(s) to insert.
	 */
  insert<T extends PrettyRecord, U extends PrettyRecord = T>(data?: U | U[]): Observable<ActionResult<T>[]>;
  insert<T extends PrettyRecord, U extends PrettyRecord = T>(table: Table | string, data?: U): Observable<ActionResult<T>>;
  public insert<T extends PrettyRecord, U extends PrettyRecord = T>(table: Table | string, data?: U | U[]) {
    return !table ? from(this.db.insert<T, U>(data)) : from(this.db.insert<T, U>(table, data));
  }

	/**
	 * Inserts one or multiple records in the database.
	 * @param thing - The table name or the specific record ID to create.
	 * @param data - The document(s) / record(s) to insert.
	 */
    insertRelation<T extends PrettyRecord, U extends PrettyRecord = T>(data?: U | U[]): Observable<ActionResult<T>[]>;
    insertRelation<T extends PrettyRecord, U extends PrettyRecord = T>(thing: Table | string, data?: U | U[]): Observable<ActionResult<T>[]>;
    public insertRelation<T extends PrettyRecord, U extends PrettyRecord = T>(thing: Table | string, data?: U | U[]) {
      return !thing ? from(this.db.insertRelation<T, U>(data)) : from(this.db.insertRelation<T, U>(thing, data));
    }

  /**
   * Invalidates the authentication for the current connection.
   */
  public invalidate() {
    return from(this.db.invalidate());
  }

  /**
   * Kill a live query.
   * @param queryUuid - The query that you want to kill.
   */
  public kill(...args: Parameters<Surreal['kill']>) {
    return from(this.db.kill(...args));
  }

	/**
	 * Specify a variable for the current socket connection.
	 * @param key - Specifies the name of the variable.
	 * @param val - Assigns the value to the variable name.
	 */
  public let(...args: Parameters<Surreal['let']>) {
    return from(this.db.let(...args));
  }

	/**
	 * Start a live select query and invoke the callback with responses.
	 * @param table - The table that you want to receive live results for.
	 * @param callback - Callback function that receives updates.
	 * @param diff - If set to true, will return a set of patches instead of complete records.
	 * @returns A unique subscription ID.
	 */
  public live<T extends Record<string, unknown> | Patch = Record<string, unknown>>(...args: Parameters<Surreal['live']>) {
    return from(this.db.live<T>(...args));
  }

	/**
	 * Modifies all records in a table, or a specific record, in the database.
	 *
	 * ***NOTE: This function merges the current document / record data with the specified data.***
	 * @param thing - The table name or the specific record ID to change.
	 * @param data - The document / record data to insert.
	 */
  merge<T extends PrettyRecord, U extends PrettyRecord = Partial<T>>(thing: string, data?: U): Observable<ActionResult<T>[]>;
  merge<T extends PrettyRecord, U extends PrettyRecord = Partial<T>>(thing: RecordId, data?: U): Observable<ActionResult<T>>;
  public merge<T extends PrettyRecord, U extends PrettyRecord = Partial<T>>(thing: string & RecordId, data?: U) {
    return from(this.db.merge<T, U>(thing, data));
  }

  /**
   * Applies JSON Patch changes to all records, or a specific record, in the database.
   *
   * ***NOTE: This function patches the current document / record data with the specified JSON Patch data.***
   * @param thing - The table name or the specific record ID to modify.
   * @param data - The JSON Patch data with which to modify the records.
   */
  patch<T extends PrettyRecord>(thing: RecordId, data?: Patch[], diff?: false): Observable<ActionResult<T>>;
  patch<T extends PrettyRecord>(thing: string, data?: Patch[], diff?: false): Observable<ActionResult<T>[]>;
  patch(thing: RecordId, data: undefined | Patch[], diff: true): Observable<Patch[]>;
  patch(thing: string, data: undefined | Patch[], diff: true): Observable<Patch[][]>;
  public patch<T extends PrettyRecord>(thing: string & RecordId, data?: Patch[], diff?: boolean) {
    return from(this.db.patch<T>(thing, data, diff as never));
  }

  /**
   * Ping SurrealDB instance.
   */
  public ping() {
    return from(this.db.ping());
  }

  /**
   * Runs a set of [SurrealQL statements](https://surrealdb.com/docs/surrealql) against the database.
   * @param query - Specifies the SurrealQL statements.
   * @param bindings - Assigns variables which can be used in the query.
   */
  public query<T extends unknown[]>(...args: Parameters<Surreal['query']>) {
    return from(this.db.query<T>(...args));
  }

  /**
   * Runs a set of [SurrealQL statements](https://surrealdb.com/docs/surrealql) against the database.
   * @param query - Specifies the SurrealQL statements.
   * @param bindings - Assigns variables which can be used in the query.
   */
  public queryRaw<T extends unknown[]>(...args: Parameters<Surreal['queryRaw']>) {
    return from(this.db.queryRaw<T>(...args));
  }

  /**
   * An observable which completes when the connection is ready.
   */
	public ready() {
    return from(this.db.ready);
  };

  /**
   * Create an edge record between two records.
   * @param from - The in property on the edge record.
   * @param thing - The id of the edge record.
   * @param to - The out property on the edge record.
   * @param data - Optionally, provide a body for the edge record.
   */
  relate<T extends PrettyRecord, U extends PrettyRecord = T>(from: string | RecordId | RecordId[], thing: string, to: string | RecordId | RecordId[], data?: U): Observable<T[]>;
  relate<T extends PrettyRecord, U extends PrettyRecord = T>(from: string | RecordId | RecordId[], thing: RecordId, to: string | RecordId | RecordId[], data?: U): Observable<T>;
  public relate<T extends PrettyRecord, U extends PrettyRecord = T>(fromRecord: string | RecordId | RecordId[], thing: string & RecordId, toRecord: string | RecordId | RecordId[], data?: U) {
    return from(this.db.relate<T, U>(fromRecord, thing, toRecord, data));
  }

  /**
   * Send a raw message to the SurrealDB instance.
   * @param method - Type of message to send.
   * @param params - Parameters for the message.
   */
  public rpc<T>(...args: Parameters<Surreal['rpc']>) {
    return from(this.db.rpc<T>(...args));
  };

  /**
   * Run a SurrealQL function.
   * @param name - The full name of the function.
   * @param args - The arguments supplied to the function. You can also supply a version here as a string, in which case the third argument becomes the parameter list.
   */
  run<T>(name: string, args?: unknown[]): Observable<T>;
  /**
   * Run a SurrealQL function.
   * @param name - The full name of the function.
   * @param version - The version of the function. If omitted, the second argument is the parameter list.
   * @param args - The arguments supplied to the function.
   */
  run<T>(name: string, version: string, args?: unknown[]): Observable<T>;
  public run<T>(name: string, versionOrArgs?: string | unknown[], args?: unknown[]) {
    return typeof versionOrArgs === 'string'
      ? from(this.db.run<T>(name, versionOrArgs, args))
      : from(this.db.run<T>(name, args));
  }

  /**
   * Select all records in a table, or a specific record.
   * @param thing - The table name or a record ID to select.
   */
  select<T extends PrettyRecord>(thing: RecordId): Observable<ActionResult<T>[]>;
  select<T extends PrettyRecord>(thing: RecordIdRange | Table | string): Observable<ActionResult<T>>;
  public select<T extends PrettyRecord>(thing: (RecordIdRange | Table | string) & RecordId) {
    return from(this.db.select<T>(thing));
  }

  /**
   * Signs in to a specific authentication scope.
   * @param vars - Variables used in a signin query.
   * @return The authentication token.
   */
  public signin(...args: Parameters<Surreal['signin']>) {
    return from(this.db.signin(...args));
  }

  /**
   * Signs up to a specific authentication scope.
   * @param vars - Variables used in a signup query.
   * @return The authentication token.
   */
  public signup(...args: Parameters<Surreal['signup']>) {
    return from(this.db.signup(...args));
  }

  /**
   * Register a callback for a running live query.
   * @param queryUuid - The live query UUID that you want to receive live results for.
   * @param callback - Callback function that receives updates.
   */
  public subscribeLive<Result extends Record<string, unknown> | Patch = Record<string, unknown>>(...args: Parameters<Surreal['subscribeLive']>) {
    return from(this.db.subscribeLive<Result>(...args));
  }

	/**
	 * Unsubscribe a callback from a live select query.
	 * @param queryUuid - The unique ID of an existing live query you want to ubsubscribe from.
	 * @param callback - The previously subscribed callback function.
	 */
  public unsubscribeLive<Result extends Record<string, unknown> | Patch = Record<string, unknown>>(...args: Parameters<Surreal['unSubscribeLive']>) {
    return from(this.db.unSubscribeLive<Result>(...args));
  }

  /**
   * Remove a parameter for the connection.
   * @param variable - Specifies the name of the variable.
   */
  public unset(...args: Parameters<Surreal['unset']>) {
    return from(this.db.unset(...args));
  }

	/**
	 * Updates all records in a table, or a specific record, in the database.
	 *
	 * ***NOTE: This function replaces the current document / record data with the specified data.***
	 * @param thing - The table name or the specific record ID to update.
	 * @param data - The document / record data to insert.
	 */
  update<T extends PrettyRecord, U extends PrettyRecord = T>(thing: RecordId, data?: U): Observable<ActionResult<T>[]>;
  update<T extends PrettyRecord, U extends PrettyRecord = T>(thing: RecordIdRange | Table | string, data?: U): Observable<ActionResult<T>>;
  public update<T extends PrettyRecord, U extends PrettyRecord = T>(thing: (RecordIdRange | Table | string) & RecordId, data?: U) {
    return from(this.db.update<T, U>(thing, data));
  }

  /**
   * Upserts all records in a table, or a specific record, in the database.
   *
   * ***NOTE: This function replaces the current document / record data with the specified data.***
   * @param thing - The table name or the specific record ID to upsert.
   * @param data - The document / record data to insert.
   */
  upsert<T extends PrettyRecord, U extends PrettyRecord = T>(thing: RecordId, data?: U): Observable<ActionResult<T>>;
  upsert<T extends PrettyRecord, U extends PrettyRecord = T>(thing: RecordIdRange | Table | string, data?: U): Observable<ActionResult<T>[]>;
  public upsert<T extends PrettyRecord, U extends PrettyRecord = T>(thing: (RecordIdRange | Table | string) & RecordId, data?: U) {
    return from(this.db.upsert<T, U>(thing, data));
  }

  /**
   * Switch to a specific namespace and database.
   * @param options.database - Switches to a specific namespace.
   * @param options.db - Switches to a specific database.
   */
  public use(options: SurrealUseOptions) {
    return from(this.db.use(options));
  }

	/**
	 * Obtain the version of the SurrealDB instance
	 * @example `surrealdb-2.1.0`
	 */
  public version() {
    return from(this.db.version());
  }
}
