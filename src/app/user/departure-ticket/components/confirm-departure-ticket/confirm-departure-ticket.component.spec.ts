import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDepartureTicketComponent } from './confirm-departure-ticket.component';

describe('ConfirmDepartureTicketComponent', () => {
  let component: ConfirmDepartureTicketComponent;
  let fixture: ComponentFixture<ConfirmDepartureTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmDepartureTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmDepartureTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
