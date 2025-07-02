import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from 'rxjs';
import { DepartureTicket } from '../../../shared/interfaces/departure-ticket.interface';
import { DepartureTicketToTable } from '../../../shared/interfaces/departure-ticket-to-table';


@Injectable({ providedIn: 'root' })
export class DepartureTicketStore {

    private displayedDepartureTickets = new BehaviorSubject<DepartureTicket[]>([]);
    displayedDepartureTickets$ = this.displayedDepartureTickets.asObservable();

    private newDepartureTicket = new Subject<DepartureTicketToTable>();
    newDepartureTicket$ = this.newDepartureTicket.asObservable();

    private updatedDepartureTicket = new Subject<DepartureTicketToTable>();
    updatedDepartureTicket$ = this.updatedDepartureTicket.asObservable();
    
    updateDisplayedDepartureTickets(departureTickets: DepartureTicket[]) {
        this.displayedDepartureTickets.next(departureTickets);
    }

    emitNewDepartureTicket(departureTicket: DepartureTicketToTable) {
        this.newDepartureTicket.next(departureTicket);
    }

    updateDepartureTicket(departureTicket: DepartureTicketToTable) {
        this.updatedDepartureTicket.next(departureTicket);
      }
}