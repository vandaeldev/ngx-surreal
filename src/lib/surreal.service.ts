import { computed, Injectable } from '@angular/core';
import { from } from 'rxjs';
import { Surreal } from 'surrealdb.js';
import type { SurrealConfig } from './surreal.config';

@Injectable({
  providedIn: 'root'
})
export class SurrealService {
  /**
   * The connection object to the Surreal database.
   */
  public connection = computed(() => this.db.connection);

  /**
   * A computed value that returns the emitter object from the Surreal database.
   */
  public emitter = computed(() => this.db.emitter);

  /**
   * A computed value that returns a boolean indicating whether the Surreal database is ready.
   */
  public ready = computed(async () => await this.db.ready);

  /**
   * A computed value that returns the status of the Surreal database connection.
   */
  public status = computed(() => this.db.status);

  private db = new Surreal();

  constructor(private config: SurrealConfig) {
    this.connect(config);
  }

  /**
   * Authenticates the user with the provided arguments using the Surreal database.
   */
  public authenticate(...args: Parameters<Surreal['authenticate']>) {
    return from(this.db.authenticate(...args));
  }

  /**
   * Closes the connection to the Surreal database.
   */
  public close() {
    return from(this.db.close());
  }

  /**
   * Creates a new record in the Surreal database using the provided arguments.
   */
  public create(...args: Parameters<Surreal['create']>) {
    return from(this.db.create(...args));
  }

  /**
   * Deletes a record from the Surreal database using the provided arguments.
   */
  public delete(...args: Parameters<Surreal['delete']>) {
    return from(this.db.delete(...args));
  }

  /**
   * Retrieves information from the Surreal database using the provided arguments.
   */
  public info(...args: Parameters<Surreal['info']>) {
    return from(this.db.info(...args));
  }

  /**
   * Inserts a new record into the Surreal database using the provided arguments.
   */
  public insert(...args: Parameters<Surreal['insert']>) {
    return from(this.db.insert(...args));
  }

  /**
   * Invalidates the Surreal database by calling the `invalidate` method on the `db` object.
   */
  public invalidate() {
    return from(this.db.invalidate());
  }

  /**
   * Executes the `kill` method on the `db` object with the provided arguments and returns an Observable that emits the result.
   */
  public kill(...args: Parameters<Surreal['kill']>) {
    return from(this.db.kill(...args));
  }

  /**
   * Executes the `let` method on the `db` object with the provided arguments and returns an Observable that emits the result.
   */
  public let(...args: Parameters<Surreal['let']>) {
    return from(this.db.let(...args));
  }

  /**
   * Executes the `live` method on the `db` object with the provided arguments and returns an Observable that emits the result.
   */
  public live(...args: Parameters<Surreal['live']>) {
    return from(this.db.live(...args));
  }

  /**
   * Executes the `merge` method on the `db` object with the provided arguments and returns an Observable that emits the result.
   */
  public merge(...args: Parameters<Surreal['merge']>) {
    return from(this.db.merge(...args));
  }

  /**
   * Executes the `patch` method on the `db` object with the provided arguments and returns an Observable that emits the result.
   */
  public patch(...args: Parameters<Surreal['patch']>) {
    return from(this.db.patch(...args));
  }

  /**
   * Executes the `ping` method on the `db` object and returns an Observable that emits the result.
   */
  public ping() {
    return from(this.db.ping());
  }

  /**
   * Executes the `query` method on the `db` object with the provided arguments and returns an Observable that emits the result.
   */
  public query(...args: Parameters<Surreal['query']>) {
    return from(this.db.query(...args));
  }

  /**
   * Executes the `query_raw` method on the `db` object with the provided arguments and returns an Observable that emits the result.
   */
  public queryRaw(...args: Parameters<Surreal['query_raw']>) {
    return from(this.db.query_raw(...args));
  }

  /**
   * Executes the `relate` method on the `db` object with the provided arguments and returns an Observable that emits the result.
   */
  public relate(...args: Parameters<Surreal['relate']>) {
    return from(this.db.relate(...args));
  }

  /**
   * Executes the `run` method on the `db` object with the provided arguments and returns an Observable that emits the result.
   */
  public run(...args: Parameters<Surreal['run']>) {
    return from(this.db.run(...args));
  }

  /**
   * Executes the `select` method on the `db` object with the provided arguments and returns an Observable that emits the result.
   */
  public select(...args: Parameters<Surreal['select']>) {
    return from(this.db.select(...args));
  }

  /**
   * Executes the `signin` method on the `db` object with the provided arguments and returns an Observable that emits the result.
   */
  public signin(...args: Parameters<Surreal['signin']>) {
    return from(this.db.signin(...args));
  }

  /**
   * Executes the `signup` method on the `db` object with the provided arguments and returns an Observable that emits the result.
   */
  public signup(...args: Parameters<Surreal['signup']>) {
    return from(this.db.signup(...args));
  }

  /**
   * Executes the `subscribeLive` method on the `db` object with the provided arguments and returns an Observable that emits the result.
   */
  public subscribeLive(...args: Parameters<Surreal['subscribeLive']>) {
    return from(this.db.subscribeLive(...args));
  }

  /**
   * Executes the `unSubscribeLive` method on the `db` object with the provided arguments and returns an Observable that emits the result.
   */
  public unsubscribeLive(...args: Parameters<Surreal['unSubscribeLive']>) {
    return from(this.db.unSubscribeLive(...args));
  }

  /**
   * Executes the `unset` method on the `db` object with the provided arguments and returns an Observable that emits the result.
   */
  public unset(...args: Parameters<Surreal['unset']>) {
    return from(this.db.unset(...args));
  }

  /**
   * Executes the `update` method on the `db` object with the provided arguments and returns an Observable that emits the result.
   */
  public update(...args: Parameters<Surreal['update']>) {
    return from(this.db.update(...args));
  }

  /**
   * Executes the `use` method on the `db` object with the provided arguments and returns an Observable that emits the result.
   */
  public use(...args: Parameters<Surreal['use']>) {
    return from(this.db.use(...args));
  }

  /**
   * Executes the `version` method on the `db` object and returns an Observable that emits the result.
   */
  public version() {
    return from(this.db.version());
  }

  private async connect({ url, ...options }: SurrealConfig) {
    await this.db.connect(new URL(url), options);
  }
}
