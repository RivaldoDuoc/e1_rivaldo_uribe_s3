import { TestBed } from '@angular/core/testing';

import { MisLecturasService } from './mis-lecturas.service';

describe('MisLecturasService', () => {
  let service: MisLecturasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MisLecturasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
