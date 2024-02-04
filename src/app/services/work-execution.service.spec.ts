import { TestBed } from '@angular/core/testing';

import { WorkExecutionService } from './work-execution.service';

describe('WorkExecutionService', () => {
  let service: WorkExecutionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkExecutionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
