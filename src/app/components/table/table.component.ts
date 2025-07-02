import { Component, Input, AfterViewInit, OnInit, TemplateRef, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Traduction } from '../../shared/interfaces/translate.type';
import { TranslateService } from '../../shared/services/translate.service';
import { LoadingService } from '../../shared/services/loading.service';
import { TableStoreService } from '../services/table/table-store.service';
import { Area, User } from '../../shared/interfaces/departure-ticket.interface';
import { Article } from '../../shared/interfaces/article.interface';
import { DialogService } from '../services/dialog/dialog.service';
import { NewDepartureTicketComponent } from '../../user/departure-ticket/components/new-departure-ticket/new-departure-ticket.component';
import { DepartureTicketService } from '../../user/departure-ticket/services/departure-ticket.service';
import { Petitioner } from '../../shared/interfaces/petitioner.interface';
import { InventoryService } from '../../user/inventory/services/inventory/inventory.service';
import { NewArticleComponent } from '../../user/inventory/components/new-article/new-article.component';
import { DepartureTicketToTable } from 'src/app/shared/interfaces/departure-ticket-to-table';
import { DialogMessageComponent } from '../../shared/components/dialog-message/dialog-message.component';
import { DialogMessageService } from '../../shared/services/dialog-message.service';
import { Subscription } from 'rxjs';
import { UsersService } from '../../admin/users/services/users.service';
import { NewUserComponent } from '../../admin/users/components/new-user/new-user.component';
import { AreasService } from 'src/app/admin/areas/services/areas.service';
import { NewAreaComponent } from 'src/app/admin/areas/components/new-area/new-area.component';
import { PetitionersService } from '../../admin/petitioners/services/petitioners.service';
import { NewPetitionerComponent } from '../../admin/petitioners/components/new-petitioner/new-petitioner.component';
import { SearchStoreService } from '../../components/services/search/search-store.service';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-table',
    styleUrls: ['./table.component.css'],
    templateUrl: './table.component.html',
})
export class TableComponent implements AfterViewInit, OnInit {
    @Input() displayedColumns: Traduction[] = [];
    @Input() dataToDisplay: any[] = [];
    @Input() errorMsg?: string = 'No hay items';

    @ViewChild('dynamicAmount') public dynamicAmount!: ElementRef;

    @Input() optionsTemplateRef!: TemplateRef<any>;
    @Input() isAdmin: boolean = false;


    isLoadingResults = true;
    traductions = this.t.traductions;
    confirmMessageSubs: Subscription | null = null;

    tableContext!: 'departure-ticket' | 'inventory' | 'user' | 'article' | 'area' | 'petitioner';

    @Output() deleted: EventEmitter<void> = new EventEmitter<void>();

    constructor(
        private t: TranslateService,
        private loadingService: LoadingService,
        private tableStoreService: TableStoreService,
        private dialogService: DialogService,
        private dialogMessageService: DialogMessageService,
        private departureTicketService: DepartureTicketService,
        private inventoryService: InventoryService,
        private usersService: UsersService,
        private areasService: AreasService,
        private petitionersService: PetitionersService,
        private searchStoreService: SearchStoreService
    ) { }

    ngOnInit(): void {
        this.loadingService.isLoading$.subscribe((isLoading: boolean) => {
            this.isLoadingResults = isLoading;
        });
        this.tableStoreService.tableContext$.subscribe((tableContext) => {
            this.tableContext = tableContext;
        });
    }

    ngAfterViewInit() {
    }

    add(item: DepartureTicketToTable | Article) {
        const options = {
            'departure-ticket': () => {
            },
            inventory: () => { },
            user: () => { },
            article: () => {
                this.tableStoreService.setSelectedRow(item);
            },
            area: () => { },
            petitioner: () => { },
            default: () => { }
        }
        return options[this.tableContext] ? options[this.tableContext]() : options.default();
    }

    delete(item: DepartureTicketToTable | Article) {
        if (this.tableContext === 'inventory') {
            if (this.confirmMessageSubs) {
                this.confirmMessageSubs.unsubscribe();
                this.confirmMessageSubs = null;
            }
            // PRIMERA CONFIRMACIÓN
            this.confirmMessageSubs = this.dialogMessageService.confirmMessage$
                .pipe(take(1))
                .subscribe((confirmed: boolean) => {
                    this.confirmMessageSubs?.unsubscribe();
                    this.confirmMessageSubs = null;
                    if (!confirmed) return;
                    // SEGUNDA CONFIRMACIÓN
                    this.confirmMessageSubs = this.dialogMessageService.confirmMessage$
                        .pipe(take(1))
                        .subscribe((confirmed2: boolean) => {
                            this.confirmMessageSubs?.unsubscribe();
                            this.confirmMessageSubs = null;
                            if (!confirmed2) return;
                            console.log('Llamando a inventoryService.delete con id:', item.id);
                            this.inventoryService.delete(item.id).subscribe({
                                next: (res) => {
                                    console.log('Artículo borrado correctamente:', res);
                                    this.deleted.emit();
                                },
                                error: (err) => {
                                    console.error('Error al borrar artículo:', err);
                                    this.deleted.emit();
                                }
                            });
                        });
                    this.dialogMessageService.setMessageContext('confirmDeleteArticle');
                    this.dialogMessageService.setMessage('Este cambio será irreversible. ¿Está seguro de eliminar este artículo?');
                    this.dialogService.openDialog({
                        component: DialogMessageComponent,
                        data: { isConfirmMessage: true, article: item },
                    });
                });
            this.dialogMessageService.setMessageContext('confirmDeleteArticle');
            this.dialogMessageService.setMessage('¿Estás seguro de eliminar este artículo?');
            this.dialogService.openDialog({
                component: DialogMessageComponent,
                data: { isConfirmMessage: true, article: item },
            });
        }
    }

    edit(item: DepartureTicketToTable | Article | Area | Petitioner) {
        const options = {
            'departure-ticket': () => {
                this.tableStoreService.toggleListenRowToRemove(false);
                this.searchStoreService.toggleSearchListener('departure-ticket', false);
                this.tableStoreService.setSelectedRow(item);
                this.tableStoreService.setTableContext('article');
                this.departureTicketService.findById(item.id).subscribe((departureTicket) => {
                    this.dialogService.openDialog<{
                        isDepartureTicket: boolean,
                        area: Area,
                        petitioner: Petitioner,
                        departureTicketId: number,
                        selectedArticles: Article[]
                        title: string,
                    }>({
                        component: NewDepartureTicketComponent,
                        data: {
                            isDepartureTicket: true,
                            area: departureTicket.area,
                            petitioner: departureTicket.petitioner,
                            departureTicketId: departureTicket.id,
                            selectedArticles: departureTicket.articleExitDetail.map((articleExitDetail) => {
                                articleExitDetail.article.amount = +articleExitDetail.amount;
                                return articleExitDetail.article
                            }),
                            title: 'Actualizar vale de salida',
                        },
                        callback: () => {
                            this.tableStoreService.setTableContext('departure-ticket');
                            this.tableStoreService.toggleListenRowToRemove(true);
                            this.searchStoreService.toggleSearchListener('departure-ticket', true);
                        }
                    });
                });
            },
            inventory: () => {
                this.inventoryService.findByIdOrDescription({ term: item.id }).subscribe((article) => {
                    this.dialogService.openDialog<{
                        article: {
                            id: number,
                            description: string,
                            stock: number,
                            size: string,
                            status: boolean
                        },
                        title: string
                    }>({
                        component: NewArticleComponent,
                        data: {
                            article: <Article>article,
                            title: 'Editar artículo',
                        },
                        callback: () => this.tableStoreService.setTableContext('inventory')
                    });
                });
            },
            user: () => {
                this.usersService.findById(item.id).subscribe((user) => {
                    this.dialogService.openDialog<{
                        user: User,
                        title: string
                    }>({
                        component: NewUserComponent,
                        data: {
                            user,
                            title: 'Editar Usuario',
                        },
                        callback: () => this.tableStoreService.setTableContext('user')
                    });
                });
            },
            article: () => {
                this.tableStoreService.removeSelectedRow(item);
            },
            area: () => {
                this.dialogService.openDialog<{
                    area: Area,
                    title: string
                }>({
                    component: NewAreaComponent,
                    data: {
                        area: (item as Area),
                        title: 'Editar Área',
                    },
                    callback: () => this.tableStoreService.setTableContext('area')
                });
            },
            petitioner: () => {
                this.petitionersService.getPetitionerById(item.id).subscribe((petitioner) => {
                    this.dialogService.openDialog<{
                        petitioner: Petitioner,
                        title: string
                    }>({
                        component: NewPetitionerComponent,
                        data: {
                            petitioner: petitioner,
                            title: 'Editar Solicitante',
                        },
                        callback: () => this.tableStoreService.setTableContext('petitioner')
                    });
                });
            },
            default: () => { }
        }
        return options[this.tableContext] ? options[this.tableContext]() : options.default();
    }

    report(item: DepartureTicketToTable | Article) {
        this.inventoryService.getReport('exit', item.id).subscribe(res => {
            const fileUrl = URL.createObjectURL(res);
            window.open(fileUrl, '_blank');
        });
    }

    handleOptions(item: DepartureTicketToTable | Article, option: 'add' | 'delete' | 'edit' | 'picture_as_pdf') {
        const options = {
            add: () => this.add(item),
            edit: () => this.edit(item),
            'picture_as_pdf': () => this.report(item),
            delete: () => this.delete(item),
            default: () => { },
        }
        return options[option] ? options[option]() : options.default();
    }

    // Agrega esta función para manejar el botón de eliminar
    deleteRow(element: any) {
        this.delete(element);
    }

    getDisplayedColumnsWithoutStatus(): Traduction[] {
        return this.displayedColumns.filter(c => c !== 'status');
    }
}
