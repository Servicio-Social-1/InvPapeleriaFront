import { TestBed } from '@angular/core/testing';

import { PetitionerService } from './petitioner.service';

describe('PetitionerService', () => {
  let service: PetitionerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PetitionerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
