import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEntryTicketComponent } from './new-entry-ticket.component';

describe('NewEntryTicketComponent', () => {
  let component: NewEntryTicketComponent;
  let fixture: ComponentFixture<NewEntryTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewEntryTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewEntryTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
