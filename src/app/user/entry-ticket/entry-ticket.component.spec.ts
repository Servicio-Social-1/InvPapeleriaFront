import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryTicketComponent } from './entry-ticket.component';

describe('EntryTicketComponent', () => {
  let component: EntryTicketComponent;
  let fixture: ComponentFixture<EntryTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntryTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntryTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
