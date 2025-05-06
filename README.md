# ngx-surreal

- [Introduction](#introduction)
- [Compatibility](#compatibility)
- [Installation](#installation)
- [Initialization](#initialization)
  - [With standalone bootstrap](#with-standalone-bootstrap)
  - [With NgModule bootstrap](#with-ngmodule-bootstrap)
- [Configuration](#configuration)
- [Usage](#usage)
- [Links](#links)

## Introduction

This package is a simple wrapper around the [SurrealDB JavaScript SDK](https://www.npmjs.com/package/surrealdb.js). It exposes almost all of the same methods as the SDK, only converted to [RxJS `Observable`s](https://rxjs.dev/guide/observable) to make it easier to use within a standard Angular application. It also re-exports some classes and types from the SDK.
On service initialization, it sets up a single connection with the configuration supplied in the `SurrealModule.forRoot()` method.

## Compatibility

|ngx-surreal|Angular |SurrealDB   |
|-----------|--------|------------|
|^0.2.1     |>=18.0.0|^1.0.0      |
|^1.0.0     |>=18.0.0|^2.0.0      |

## Installation

```sh
# npm
npm install ngx-surreal

# pnpm
pnpm add ngx-surreal

# yarn
yarn add ngx-surrreal

# bun
bun add ngx-surreal
```

## Initialization

This package exposes a module called `SurrealModule` with only one method: `forRoot()`. The `forRoot()` method takes an object of type `SurrealConfig` with SurrealDB connection options.

### With standalone bootstrap

```ts
import { importProvidersFrom, type ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { SurrealModule, type SurrealConfig } from 'ngx-surreal';
import { routes } from './app.routes';

const surrealConfig: SurrealConfig = {
  url: 'http://localhost:8000/rpc',
  namespace: 'test',
  database: 'test'
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(SurrealModule.forRoot(surrealConfig))
  ]
};
```

### With NgModule bootstrap

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SurrealModule, type SurrealConfig } from 'ngx-surreal';
import { AppComponent } from './app.component';

const surrealConfig: SurrealConfig = {
  url: 'http://localhost:8000/rpc',
  namespace: 'test',
  database: 'test'
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    SurrealModule.forRoot(surrealConfig)
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

## Configuration

The type definition for `SurrealConfig` is as follows:

```ts
import type { Surreal } from 'surrealdb';

export type ConnectionOptions = Parameters<Surreal['connect']>[1];
export type SurrealConfig = ConnectionOptions & { url: string };
```

The following options are available for configuration:

```ts
url: string;
namespace?: string;
database?: string;
auth?: AnyAuth | Token;
prepare?: (connection: Surreal) => unknown;
versionCheck?: boolean;
versionCheckTimeout?: number;
```

## Usage

```ts
import { Component, signal, type OnInit } from '@angular/core';
import { SurrealService, RecordId, PreparedQuery } from 'ngx-surreal';

@Component({
  selector: 'app-example',
  templateUrl: 'example.component.html',
  styleUrl: 'example.component.scss'
})
export class ExampleComponent implements OnInit {
  public readonly items = signal([]);
  public readonly singleItem = signal({});

  private readonly surrealService = inject(SurrealService);
  // or
  constructor(private readonly surrealService: SurrealService) {}

  public ngOnInit() {
    console.log(this.surrealService.status());
  }

  public signup(email: string, password: string) {
    this.surrealService.signup({scope: 'user', email, password}).subscribe(console.log);
  }

  public signin(email: string, password: string) {
    this.surrealService.signin({scope: 'user', email, password}).subscribe(console.log);
  }

  public fetchAllItems() {
    this.surrealService.select('example').subscribe(records => this.items.set(records));
  }

  public fetchItem(id: string) {
    const recordId = new RecordId('example', id);
    this.surrealService.select(recordId).subscribe(record => this.singleItem.set(record));
  }

  public updateItem(id: string, updates: Record<string, unknown>) {
    this.surrealService.update(`example:${id}`, updates).subscribe(console.dir);
  }

  public deleteItem(id: string) {
    const recordId = new RecordId('example', id);
    this.surrealService.delete(recordId).subscribe(console.dir);
  }

  public queryAllItems() {
    this.surrealService.query('select * from example; select * from type::table($table)', {table: 'example2'}).subscribe(console.dir);
    // or
    const query = new PreparedQuery('select * from type::table($table)', {table: 'example'});
    this.surrealService.query(query).subscribe(console.dir);
  }
}
```

See for more examples and all available methods the [SurrealDB JavaScript SDK](https://surrealdb.com/docs/sdk/javascript/methods).

## Links

- [Angular docs](https://angular.dev/overview)
- [SurrealDB docs](https://surrealdb.com/docs/surrealdb/)
