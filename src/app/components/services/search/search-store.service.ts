import { Injectable } from '@angular/core';
import { DepartureTicket, User } from '../../../shared/interfaces/departure-ticket.interface';
import { Subject } from 'rxjs';
import { Article } from '../../../shared/interfaces/article.interface';
import { Petitioner } from 'src/app/shared/interfaces/petitioner.interface';
import { Area } from 'src/app/shared/interfaces/area.interface';

@Injectable({
    providedIn: 'root'
})
export class SearchStoreService {

    // TODO: agregar para inventory y users
    private itemsFromSearch = new Subject<DepartureTicket[] | Article[] | Petitioner[] | Area[] | User[]>();
    itemsFromSearch$ = this.itemsFromSearch.asObservable();

    private value = new Subject<string>();
    value$ = this.value.asObservable();

    // Triggerers para escuchar cambios en las busquedas;
    private listenDepartureTicketSearchChanges = new Subject<boolean>();
    public listenDepartureTicketSearchChanges$ = this.listenDepartureTicketSearchChanges.asObservable();


    constructor() { }

    updateItems(items: DepartureTicket[] | Article[] | Petitioner[] | Area[] | User[]) {
        this.itemsFromSearch.next(items);
    }

    updateValue(value: string | null = '') {
        if (!value) {
            value = '';
        }
        this.value.next(value);
    }

    toggleSearchListener(context: 'departure-ticket' | 'inventory' | 'user' | 'article' | 'area' | 'petitioner', value: boolean) {
        const options = {
            'departure-ticket': () => {
                this.listenDepartureTicketSearchChanges.next(value);
            },
            inventory: () => {
            },
            user: () => {
            },
            article: () => {
            },
            area: () => {
            },
            petitioner: () => {
            },
            default: () => { }
        }
        return options[context] ? options[context]() : options.default();
    }
}
