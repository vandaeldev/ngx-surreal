import { TestBed } from '@angular/core/testing';

import { NgxSurrealService } from './ngx-surreal.service';

describe('NgxSurrealService', () => {
  let service: NgxSurrealService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxSurrealService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
