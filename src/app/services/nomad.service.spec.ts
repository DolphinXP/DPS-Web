import { TestBed } from '@angular/core/testing';

import { NomadService } from './nomad.service';

describe('NomandServiceService', () => {
  let service: NomadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NomadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
