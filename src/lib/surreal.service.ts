import { computed, inject, Injectable } from '@angular/core';
import { from, type Observable } from 'rxjs';
import { type RecordId as _RecordId, type ActionResult, type AnyAuth, type Patch, type ScopeAuth, type StringRecordId, Surreal, type Uuid } from 'surrealdb';
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
  create<T extends PrettyRecord, U extends PrettyRecord = T>(thing: string, data?: U): Observable<ActionResult<T>[]>;
  create<T extends PrettyRecord, U extends PrettyRecord = T>(thing: RecordId, data?: U): Observable<ActionResult<T>>;
  public create<T extends PrettyRecord, U extends PrettyRecord = T>(thing: string & RecordId, data?: U) {
    return from(this.db.create<T, U>(thing, data));
  }

  /**
   * Deletes all records in a table, or a specific record, from the database.
   * @param thing - The table name or a record ID to select.
   */
  delete<T extends PrettyRecord>(thing: string): Observable<ActionResult<T>[]>;
  delete<T extends PrettyRecord>(thing: RecordId): Observable<ActionResult<T>>;
  public delete<T extends PrettyRecord>(thing: string & RecordId) {
    return from(this.db.delete<T>(thing));
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
   * @param thing - The table name or the specific record ID to create.
   * @param data - The document(s) / record(s) to insert.
   */
  insert<T extends PrettyRecord, U extends PrettyRecord = T>(thing: string, data?: U | U[]): Observable<ActionResult<T>[]>;
  insert<T extends PrettyRecord, U extends PrettyRecord = T>(thing: RecordId, data?: U): Observable<ActionResult<T>>;
  public insert<T extends PrettyRecord, U extends PrettyRecord = T>(thing: string & RecordId, data?: U | U[]) {
    return from(this.db.insert<T, U>(thing, data));
  }

  /**
   * Invalidates the authentication for the current connection.
   */
  public invalidate() {
    return from(this.db.invalidate());
  }

  /**
   * Kill a live query
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
   * Start a live query and listen for the responses
   * @param table - The table that you want to receive live results for.
   * @param callback - Callback function that receives updates.
   * @param diff - If set to true, will return a set of patches instead of complete records
   */
  public live<Result extends Record<string, unknown> | Patch = Record<string, unknown>>(...args: Parameters<Surreal['live']>): Observable<Uuid> {
    return from(this.db.live<Result>(...args));
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
   * Ping SurrealDB instance
   */
  public ping() {
    return from(this.db.ping());
  }

  /**
   * Runs a set of SurrealQL statements against the database.
   * @param query - Specifies the SurrealQL statements.
   * @param bindings - Assigns variables which can be used in the query.
   */
  public query<T extends unknown[]>(...args: Parameters<Surreal['query']>) {
    return from(this.db.query<T>(...args));
  }

  /**
   * Runs a set of SurrealQL statements against the database.
   * @param query - Specifies the SurrealQL statements.
   * @param bindings - Assigns variables which can be used in the query.
   */
  public queryRaw<T extends unknown[]>(...args: Parameters<Surreal['query_raw']>) {
    return from(this.db.query_raw<T>(...args));
  }

  /**
   * Create an edge record between two records
   * @param from - The in property on the edge record
   * @param thing - The id of the edge record
   * @param to - The out property on the edge record
   * @param data - Optionally, provide a body for the edge record
   */
  relate<T extends PrettyRecord, U extends PrettyRecord = T>(from: string | RecordId | RecordId[], thing: string, to: string | RecordId | RecordId[], data?: U): Observable<T[]>;
  relate<T extends PrettyRecord, U extends PrettyRecord = T>(from: string | RecordId | RecordId[], thing: RecordId, to: string | RecordId | RecordId[], data?: U): Observable<T>;
  public relate<T extends PrettyRecord, U extends PrettyRecord = T>(fromRecord: string | RecordId | RecordId[], thing: string & RecordId, toRecord: string | RecordId | RecordId[], data?: U) {
    return from(this.db.relate<T, U>(fromRecord, thing, toRecord, data));
  }

  /**
   * Run a SurrealQL function
   * @param name - The full name of the function
   * @param args - The arguments supplied to the function. You can also supply a version here as a string, in which case the third argument becomes the parameter list.
   */
  run<T>(name: string, args?: unknown[]): Observable<T>;
  /**
   * Run a SurrealQL function
   * @param name - The full name of the function
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
   * Selects all records in a table, or a specific record, from the database.
   * @param thing - The table name or a record ID to select.
   */
  select<T extends PrettyRecord>(thing: string): Observable<ActionResult<T>[]>;
  select<T extends PrettyRecord>(thing: RecordId): Observable<ActionResult<T>>;
  public select<T extends PrettyRecord>(thing: string & RecordId) {
    return from(this.db.select<T>(thing));
  }

  /**
   * Signs in to a specific authentication scope.
   * @param vars - Variables used in a signin query.
   * @return The authentication token.
   */
  public signin(vars: AnyAuth) {
    return from(this.db.signin(vars));
  }

  /**
   * Signs up to a specific authentication scope.
   * @param vars - Variables used in a signup query.
   * @return The authentication token.
   */
  public signup(vars: ScopeAuth) {
    return from(this.db.signup(vars));
  }

  /**
   * Listen for live query responses by it's uuid
   * @param queryUuid - The LQ uuid that you want to receive live results for.
   * @param callback - Callback function that receives updates.
   */
  public subscribeLive<Result extends Record<string, unknown> | Patch = Record<string, unknown>>(...args: Parameters<Surreal['subscribeLive']>) {
    return from(this.db.subscribeLive<Result>(...args));
  }

  /**
   * Stop listening for live query responses for a uuid
   * @param queryUuid - The LQ uuid that you want to stop listening to.
   */
  public unsubscribeLive<Result extends Record<string, unknown> | Patch = Record<string, unknown>>(queryUuid: Uuid) {
    return from(this.db.unSubscribeLive<Result>(queryUuid, () => void 0));
  }

  /**
   * Remove a variable from the current socket connection.
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
  update<T extends PrettyRecord, U extends PrettyRecord = T>(thing: string, data?: U): Observable<ActionResult<T>[]>;
  update<T extends PrettyRecord, U extends PrettyRecord = T>(thing: RecordId, data?: U): Observable<ActionResult<T>>;
  public update<T extends PrettyRecord, U extends PrettyRecord = T>(thing: string & RecordId, data?: U) {
    return from(this.db.update<T, U>(thing, data));
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
   */
  public version() {
    return from(this.db.version());
  }
}
