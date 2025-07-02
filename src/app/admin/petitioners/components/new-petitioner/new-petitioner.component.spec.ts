import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPetitionerComponent } from './new-petitioner.component';

describe('NewPetitionerComponent', () => {
  let component: NewPetitionerComponent;
  let fixture: ComponentFixture<NewPetitionerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPetitionerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewPetitionerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
