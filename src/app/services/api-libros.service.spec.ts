import { TestBed } from '@angular/core/testing';

import { ApiLibrosService } from './api-libros.service';

describe('ApiLibrosService', () => {
  let service: ApiLibrosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiLibrosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
