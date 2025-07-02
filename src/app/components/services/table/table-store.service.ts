import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Article } from '../../../shared/interfaces/article.interface';
import { DepartureTicketToTable } from 'src/app/shared/interfaces/departure-ticket-to-table';
import { Area } from 'src/app/shared/interfaces/article-exit-details.interface';
import { Petitioner } from '../../../shared/interfaces/petitioner.interface';

@Injectable({
    providedIn: 'root'
})
export class TableStoreService {

    private tableRows = new BehaviorSubject<number>(0);
    tableRows$ = this.tableRows.asObservable();

    private tableColumns = new BehaviorSubject<string[]>([]);
    tableColumns$ = this.tableColumns.asObservable();

    private tableContext = new BehaviorSubject<'departure-ticket' | 'inventory' | 'user' | 'article' | 'area' | 'petitioner'>('departure-ticket');
    tableContext$ = this.tableContext.asObservable();

    private selectedRow = new BehaviorSubject<DepartureTicketToTable | Article | Area | Petitioner | null>(null);
    selectedRow$ = this.selectedRow.asObservable();

    private rowToRemove = new Subject<DepartureTicketToTable | Article | Area | Petitioner | null>();
    rowToRemove$ = this.rowToRemove.asObservable();

    private listenRowToRemove = new Subject<boolean>();
    listenRowToRemove$ = this.listenRowToRemove.asObservable();

    constructor() { }

    setTableContext(context: 'departure-ticket' | 'inventory' | 'user' | 'article' | 'area' | 'petitioner') {
        this.tableContext.next(context);
    }

    setSelectedRow(rowData: DepartureTicketToTable | Article | Area | Petitioner | null) {
        this.selectedRow.next(rowData);
    }

    removeSelectedRow(rowData: DepartureTicketToTable | Article | Area | Petitioner | null) {
        this.rowToRemove.next(rowData);
    }

    setTableRows(tableRows: number) {
        this.tableRows.next(tableRows);
    }

    setTableColumns(tableColumns: string[]) {
        this.tableColumns.next(tableColumns);
    }

    toggleListenRowToRemove(value: boolean) {
        this.listenRowToRemove.next(value);
    }
}
