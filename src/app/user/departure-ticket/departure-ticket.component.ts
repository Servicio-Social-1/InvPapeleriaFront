import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogService } from '../../components/services/dialog/dialog.service';
import { NewDepartureTicketComponent } from './components/new-departure-ticket/new-departure-ticket.component';
import { DepartureTicketService } from './services/departure-ticket.service';
import { Subscription } from 'rxjs';
import { LoadingService } from '../../shared/services/loading.service';
import { Traduction } from '../../shared/interfaces/translate.type';
import { PageEvent } from '@angular/material/paginator';
import { ErrorResponse } from '../../shared/interfaces/error-response.interface';
import { LimitAndOffset } from '../../components/interfaces/limit-offset.interface';
import { PaginatorService } from '../../components/services/paginator/paginator.service';
import { Paginator } from '../../components/interfaces/paginator.interface';
import { paginatorInitialState } from '../../shared/states/paginator.state';
import { SearchStoreService } from '../../components/services/search/search-store.service';
import { DepartureTicketStore } from './services/departure-ticket.store';
import { TableStoreService } from '../../components/services/table/table-store.service';
import { DepartureTicket } from 'src/app/shared/interfaces/departure-ticket.interface';
import { DepartureTicketToTable } from '../../shared/interfaces/departure-ticket-to-table';
import { AuthService } from '../../auth/services/auth/auth.service';

@Component({
    selector: 'app-departure-ticket',
    templateUrl: './departure-ticket.component.html',
    styleUrls: ['./departure-ticket.component.css']
})
export class DepartureTicketComponent implements OnInit, OnDestroy {

    departureTicketCount = 1;
    limitAndOffsetAndSize = {
        limit: 25,
        offset: 0
    }
    isSearching: boolean = false;

    departureTickets!: DepartureTicketToTable[];
    errorMsg!: string;
    columns: Traduction[] = [];

    isLoading!: boolean;
    departureTicketCountSubs!: Subscription;
    loadingSubs!: Subscription;
    departureTicketsSubs!: Subscription;
    newDepartureTicketSubs!: Subscription;
    paginatorSubs!: Subscription;
    updatedDepartureTicketSubs!: Subscription;
    deleteDepartureTicketSubs!: Subscription;
    listenDeleteDepartureTicketSubs!: Subscription;

    itemsFromSearchSubs!: Subscription;
    valueSearchSubs!: Subscription;
    departureTicketsFromSearch!: DepartureTicketToTable[]
    newDepartureTicketFormIsOpenSubs!: Subscription;

    paginatorStatepaginator!: Paginator;

    userStatusSubs!: Subscription;
    isAdmin!: boolean;

    paginatorState: PageEvent = paginatorInitialState;

    listeningSearchChanges!: boolean;
    listeningSearchChangesSubs!: Subscription;

    constructor(
        private dialogService: DialogService,
        private departureTicketService: DepartureTicketService,
        private loadingService: LoadingService,
        private readonly paginatorService: PaginatorService,
        private searchStoreService: SearchStoreService,
        private departureTicketStore: DepartureTicketStore,
        private tableStoreService: TableStoreService,
        private authService: AuthService,
    ) { }

    ngOnInit(): void {
        this.loadingService.toggleLoading(true);
        this.tableStoreService.setTableContext('departure-ticket');
        this.paginatorService.reset();

        this.userStatusSubs = this.authService.adminStatus().subscribe((isAdmin: boolean) => {
            this.isAdmin = isAdmin;

            this.listenDeleteDepartureTicketSubs = this.tableStoreService.listenRowToRemove$.subscribe(value => {
                if (value) {
                    return this.deleteDepartureTicketSubs = this.tableStoreService.rowToRemove$.subscribe((departureTicket) => this.handleDeleteDepartureTicket(departureTicket as DepartureTicketToTable));
                }
                return this.deleteDepartureTicketSubs?.unsubscribe();
            })
            this.newDepartureTicketSubs = this.departureTicketStore.newDepartureTicket$.subscribe((departureTicket: DepartureTicketToTable) => {
                // si los elementos mostrados en la tabla son menores a 25(el limite por pargina se agrega a la vista);
                if (this.departureTickets.length < 25) {
                    this.departureTickets.push(departureTicket);
                    this.departureTickets = [...this.departureTickets];
                }
            })
            this.updatedDepartureTicketSubs = this.departureTicketStore.updatedDepartureTicket$.subscribe((departureTicket: DepartureTicketToTable) => {
                const updatedDepartureTicketIndex = this.departureTickets.findIndex((dp: DepartureTicketToTable) => dp.id === departureTicket.id);
                this.departureTickets[updatedDepartureTicketIndex] = departureTicket;
                this.departureTickets = [...this.departureTickets];
            });
            this.loadingSubs = this.loadingService.isLoading$.subscribe((isLoading: boolean) => {
                this.isLoading = isLoading;
            });
            this.departureTicketCountSubs = this.departureTicketService.getCount().subscribe((count: number) => {
                this.departureTicketCount = count;
            });
            this.paginatorSubs = this.paginatorService.paginator$.subscribe((paginator: PageEvent) => {
                this.paginatorState = paginator;
                this.pageChanged(this.paginatorState);
            });
            this.valueSearchSubs = this.searchStoreService.value$.subscribe(value => this.handleValueSearchSubs(value));
            this.itemsFromSearchSubs = this.searchStoreService.itemsFromSearch$.subscribe((items) => this.handleItemsFromSearch(items));
            this.listeningSearchChangesSubs = this.searchStoreService.listenDepartureTicketSearchChanges$.subscribe((value: boolean) => {
                if(!value) {
                    this.unsubscribeWhenOpenDialog();
                    return;
                }
                this.tableStoreService.setTableContext('departure-ticket');
                this.valueSearchSubs = this.searchStoreService.value$.subscribe((value) => this.handleValueSearchSubs(value));
                this.departureTicketCountSubs = this.departureTicketService.getCount().subscribe((count: number) => {
                    this.departureTicketCount = count;
                });
                this.searchStoreService.updateValue('');
                this.itemsFromSearchSubs = this.searchStoreService.itemsFromSearch$.subscribe((items) => this.handleItemsFromSearch(items));
                this.deleteDepartureTicketSubs = this.tableStoreService.rowToRemove$.subscribe((departureTicket) => this.handleDeleteDepartureTicket(departureTicket as DepartureTicketToTable));
            });
        });
    }

    unsubscribeWhenOpenDialog() {
        this.itemsFromSearchSubs?.unsubscribe();
        this.valueSearchSubs?.unsubscribe();
        this.searchStoreService.updateItems([]);
        this.deleteDepartureTicketSubs?.unsubscribe();
    }

    handleItemsFromSearch(departureTickets: any) {
        this.departureTicketsFromSearch = (departureTickets as DepartureTicket[]).map((departureTicket) => {
            // TODO: Error al editar vale de salida, cuando se buscar truena la tabla de vales
            return {
                area: departureTicket.area.name,
                petitioner: departureTicket.petitioner.name,
                user: departureTicket.user.email,
                id: departureTicket.id,
                date: departureTicket.date,
                time: departureTicket.time,
                status: departureTicket.status,
                options: this.isAdmin ? ['edit', 'picture_as_pdf'] : ['edit', 'picture_as_pdf'],
                articleExitDetail: departureTicket.articleExitDetail
            };
        })
    }

    handleDeleteDepartureTicket(departureTicket: DepartureTicketToTable) {
        if (!this.departureTickets.length) {
            return;
        }
        const removeIndex = this.departureTickets.findIndex((item) => {
            return item.id === departureTicket?.id
        });
        this.departureTickets.splice(removeIndex, 1);
        this.departureTickets = [...this.departureTickets];
    }

    handleValueSearchSubs(value: string) {
        this.isSearching = !!value;
    }

    getDepartureTickets({ limit, offset }: LimitAndOffset) {
        return this.departureTicketService.getDepartureTickets(
            { limit, offset }
        ).subscribe({
            error: (err: ErrorResponse) => this.setTableErrorData(err),
            next: (departureTickets: DepartureTicket[]) => this.setTableData(departureTickets)
        });
    }

    // Cuando no encuentra resultados en la api define mensaje de error en la tabla y establece columnas por defecto
    setTableErrorData(err: ErrorResponse) {
        this.columns = ['id', 'date', 'time', 'petitioner', 'area', 'user', 'options'];
        this.departureTickets = []
        this.errorMsg = err?.error?.message;
        this.loadingService.toggleLoading(false);
    }

    setTableData(departureTickets: DepartureTicket[]) {
        this.columns = ['id', 'date', 'time', 'petitioner', 'area', 'user', 'options'];
        this.departureTickets = departureTickets.map((departureTicket) => {
            return {
                id: departureTicket.id,
                date: departureTicket.date,
                time: departureTicket.time,
                petitioner: departureTicket.petitioner.name,
                area: departureTicket.area.name,
                user: departureTicket.user.email,
                options: this.isAdmin ? ['edit', 'picture_as_pdf'] : ['edit', 'picture_as_pdf']
            }
        });
        this.departureTicketStore.updateDisplayedDepartureTickets(departureTickets);
        this.loadingService.toggleLoading(false);
    }

    pageChanged(event: PageEvent) {
        this.paginatorState = { ...event };
        this.loadingService.toggleLoading(true);
        this.departureTicketsSubs = this.getDepartureTickets({
            limit: 25,
            offset: event.pageIndex * 25
        });
    }

    openNewDepartureTicketDialog() {
        this.unsubscribeWhenOpenDialog();
        this.dialogService.openDialog({
            component: NewDepartureTicketComponent, callback: () => {
                this.tableStoreService.setTableContext('departure-ticket');
                this.valueSearchSubs = this.searchStoreService.value$.subscribe((value) => this.handleValueSearchSubs(value));
                this.departureTicketCountSubs = this.departureTicketService.getCount().subscribe((count: number) => {
                    this.departureTicketCount = count;
                });
                this.searchStoreService.updateValue('');
                this.itemsFromSearchSubs = this.searchStoreService.itemsFromSearch$.subscribe((items) => this.handleItemsFromSearch(items));
                this.deleteDepartureTicketSubs = this.tableStoreService.rowToRemove$.subscribe((departureTicket) => this.handleDeleteDepartureTicket(departureTicket as DepartureTicketToTable));
            },
            data: { title: 'Nuevo vale de salida' }
        });
    }

    ngOnDestroy(): void {
        this.searchStoreService.updateValue('');
        this.newDepartureTicketFormIsOpenSubs?.unsubscribe();
        this.listenDeleteDepartureTicketSubs?.unsubscribe();
        this.updatedDepartureTicketSubs?.unsubscribe();
        this.departureTicketCountSubs?.unsubscribe();
        this.departureTicketsSubs?.unsubscribe();
        this.valueSearchSubs?.unsubscribe();
        this.loadingSubs?.unsubscribe();
        this.paginatorSubs?.unsubscribe();
        this.newDepartureTicketSubs?.unsubscribe();
        this.deleteDepartureTicketSubs?.unsubscribe();
        this.userStatusSubs?.unsubscribe();
        this.itemsFromSearchSubs?.unsubscribe();
    }

}
