import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { SurrealService } from './surreal.service';
import type { SurrealConfig } from './surreal.config';

export const SurrealFactory = (config: SurrealConfig) => new SurrealService(config);

export const SURREAL_CONFIG_TOKEN = new InjectionToken<SurrealConfig>('__SURREAL_CONFIG__');

@NgModule()
export class SurrealModule {
  static forRoot(config: SurrealConfig): ModuleWithProviders<SurrealModule> {
    return {
      ngModule: SurrealModule,
      providers: [
        { provide: SURREAL_CONFIG_TOKEN, useValue: config },
        { provide: SurrealService, useFactory: SurrealFactory, deps: [SURREAL_CONFIG_TOKEN] }
      ]
    }
  }
}
