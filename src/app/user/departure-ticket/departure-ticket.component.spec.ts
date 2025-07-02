import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartureTicketComponent } from './departure-ticket.component';

describe('DepartureTicketComponent', () => {
  let component: DepartureTicketComponent;
  let fixture: ComponentFixture<DepartureTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartureTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartureTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
