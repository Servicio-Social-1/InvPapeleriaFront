import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Paginator } from '../../interfaces/paginator.interface';
import { PageEvent } from '@angular/material/paginator';
import { paginatorInitialState } from '../../../shared/states/paginator.state';

@Injectable({
    providedIn: 'root'
})
export class PaginatorService {

    paginatorInitialState: PageEvent = paginatorInitialState;

    private paginator = new BehaviorSubject<PageEvent>(this.paginatorInitialState);
    paginator$ = this.paginator.asObservable();

    constructor() { }

    updatePaginator(pageEvent: PageEvent) {
        this.paginator.next(pageEvent);
    }

    reset() {
        this.paginator.next(paginatorInitialState);
    }
}

