import { TestBed } from '@angular/core/testing';
import { AreasStore } from './areas-store';


describe('AreasStore', () => {
  let service: AreasStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AreasStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
