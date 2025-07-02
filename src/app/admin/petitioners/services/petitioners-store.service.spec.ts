import { TestBed } from '@angular/core/testing';

import { PetitionersStoreService } from './petitioners-store';

describe('PetitionersStoreService', () => {
  let service: PetitionersStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PetitionersStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
