import { TestBed } from '@angular/core/testing';

import { PetitionersService } from './petitioners.service';

describe('PetitionersService', () => {
  let service: PetitionersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PetitionersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
