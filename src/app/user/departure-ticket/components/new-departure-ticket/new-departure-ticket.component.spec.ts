import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDepartureTicketComponent } from './new-departure-ticket.component';

describe('NewDepartureTicketComponent', () => {
  let component: NewDepartureTicketComponent;
  let fixture: ComponentFixture<NewDepartureTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewDepartureTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewDepartureTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
