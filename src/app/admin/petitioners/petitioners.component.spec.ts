import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetitionersComponent } from './petitioners.component';

describe('PetitionersComponent', () => {
  let component: PetitionersComponent;
  let fixture: ComponentFixture<PetitionersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PetitionersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetitionersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
