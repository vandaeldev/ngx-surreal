import { InjectionToken, type ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { SurrealService } from './surreal.service';
import type { SurrealConfig } from './surreal.config';

export const SurrealFactory = () => new SurrealService();

export const SURREAL_CONFIG_TOKEN = new InjectionToken<SurrealConfig>('__SURREAL_CONFIG__');

@NgModule()
export class SurrealModule {
  constructor(@Optional() @SkipSelf() parentModule?: SurrealModule) {
    if (parentModule) throw new Error('SurrealModule is already loaded. Import it in the AppModule or AppConfig only');
  }
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
