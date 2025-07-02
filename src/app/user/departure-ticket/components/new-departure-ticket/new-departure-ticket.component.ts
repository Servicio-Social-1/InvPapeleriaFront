import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { DialogService } from '../../../../components/services/dialog/dialog.service';
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms';
import { DepartureTicketService } from '../../services/departure-ticket.service';
import { AreaService } from '../../../../shared/services/area.service';
import { Area } from '../../../../shared/interfaces/area.interface';
import { PetitionerService } from '../../../../shared/services/petitioner.service';
import { SearchStoreService } from '../../../../components/services/search/search-store.service';
import { Subject, Subscription, catchError, of, skip, takeUntil } from 'rxjs';
import { Article } from '../../../../shared/interfaces/article.interface';
import { Traduction } from '../../../../shared/interfaces/translate.type';
import { TableStoreService } from '../../../../components/services/table/table-store.service';
import { DialogMessageComponent } from '../../../../shared/components/dialog-message/dialog-message.component';
import { DialogMessageService } from '../../../../shared/services/dialog-message.service';
import { PetitionerForm } from 'src/app/shared/interfaces/petitioners-form-list.interface';
import { DepartureTicketStore } from '../../services/departure-ticket.store';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DepartureTicket } from '../../../../shared/interfaces/departure-ticket.interface';
import { MyErrorStateMatcher } from 'src/app/shared/helpers/forms/error-state-matcher';
import { DepartureTicketDetail } from 'src/app/shared/interfaces/article-exit-details.interface';
import { ConfirmDepartureTicketComponent } from '../confirm-departure-ticket/confirm-departure-ticket.component';
import { AuthService } from 'src/app/auth/services/auth/auth.service';
import { ScannerService } from '../../services/scanner.service';



@Component({
    selector: 'app-new-departure-ticket',
    templateUrl: './new-departure-ticket.component.html',
    styleUrls: ['./new-departure-ticket.component.css']
})
export class NewDepartureTicketComponent implements OnInit, OnDestroy {

    destroy$ = new Subject<boolean>();

    matcher = new MyErrorStateMatcher();
    dateValue!: string;

    newItemForm: FormGroup = this.fb.group({
        area: [, [Validators.required, Validators.min(0)]],
        petitioner: [, [Validators.required]],
        amountSelectedItemsForm: new FormArray([])
    });

    get amountSelectedItemsForm() {
      return this.newItemForm.get('amountSelectedItemsForm') as FormArray;
    }

    getAmountControl(i: number) {
      return this.amountSelectedItemsForm.controls[i].get('amount') as FormControl;
    }

    isConfirmed!: boolean;
    isConfirmedSubs!: Subscription;
    isAdmin!: boolean;
    userStatusSubs!: Subscription;

    areas: Area[] = [];
    petitioners: PetitionerForm[] = [];
    itemsFromSearchSubs!: Subscription;
    selectedRowSubs!: Subscription;
    rowToRemoveSubs!: Subscription;
    articlesFromSearch!: Article[];
    articlesFromSearchColumns: Traduction[] = [
        'id',
        'description',
        'stock',
        'size',
        'options'
    ];
    articlesToUpdateColumns: Traduction[] = [
        'id',
        'description',
        'stock',
        'size',
        'amount',
        'options'
    ];

    selectedArticle!: Article;
    selectedArticles: Article[] = [];

    displayedDepartureTickets!: DepartureTicket[];
    displayedDepartureTicketsSubs!: Subscription;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogService: DialogService,
        private fb: FormBuilder,
        private departureTicketService: DepartureTicketService,
        private areaService: AreaService,
        private petitionerService: PetitionerService,
        private searchStoreService: SearchStoreService,
        private tableStoreService: TableStoreService,
        private dialogMessageService: DialogMessageService,
        private departureTicketStore: DepartureTicketStore,
        private localStorageService: LocalStorageService,
        private authService: AuthService,
        private scannerService: ScannerService
    ) {
        const currDate = new Date();
        this.dateValue = `${currDate.getMonth() +1}/${currDate.getDate()}/${currDate.getFullYear()}`;
    }

    ngOnInit() {
      this.amountSelectedItemsForm.valueChanges.subscribe(amountList => {
        amountList.forEach(({amount}: {amount: number}, index: number) => {
          this.selectedArticles[index].amount = amount;
        });
      });

        this.scannerService.scanner$.pipe(takeUntil(this.destroy$)).subscribe((article: Article) => {
          console.log(article)
          this.tableStoreService.setSelectedRow(article);
        });

        this.userStatusSubs = this.authService.adminStatus().subscribe((isAdmin: boolean) => {
            this.isAdmin = isAdmin;
        })
        this.tableStoreService.setTableContext('article');
        if (this.data.selectedArticles) {
            this.selectedArticles = this.data.selectedArticles;
            this.selectedArticles = this.data.selectedArticles.map((article: Article) => {
                article.options = [];
                return article;
            });
            this.selectedArticles.forEach(article => {
              this.amountSelectedItemsForm.push(
                new FormGroup({amount:(new FormControl(article.amount, [Validators.required, Validators.min(1)]))})
                );
            });
        }
        this.displayedDepartureTicketsSubs = this.departureTicketStore.displayedDepartureTickets$.subscribe((departureTickets: DepartureTicket[]) => {
            this.displayedDepartureTickets = [...departureTickets];
        });
        this.areaService.getAreas().subscribe((areas: Area[]) => {
            this.areas = areas;
            if (!this?.data?.area) {
                return this.disablePetittionerOptions();
            }
            this.newItemForm.get('area')?.setValue(this?.data?.area?.id);
            this.newItemForm.get('petitioner')?.setValue(this?.data?.petitioner?.id);
            this.getPetitioners(this.data.area.id)
        });
        this.itemsFromSearchSubs = this.searchStoreService.itemsFromSearch$.subscribe(((articles) => {
            // esta subscripcion inicializa la tabla de articulos a buscar con un elemento vacio, pero al ser subject no se ejecuta hasta que cambia el valor de los items obtenidos de la búsqueda
            // Cuando se busca por id de articulo insertar dentro de un arreglo
            this.articlesFromSearch = <Article[]><unknown>(articles.length ? articles : [articles]);
            this.articlesFromSearch = this.articlesFromSearch.map((article) => {
                article.options = ['add'];
                return article;
            })
        }));

        this.selectedRowSubs = this.tableStoreService.selectedRow$.pipe(skip(1), takeUntil(this.destroy$)).subscribe((article): any => {
            this.selectedArticle = article as Article;
            if (
                this.selectedArticles.some((item) =>
                    (article as Article)?.id === item.id)
            ) {
              return;
            }
            if (this.newItemForm.get('area')?.invalid || this.newItemForm.get('petitiones')?.invalid) {
                return;
            }
            if ((article as Article).stock < this.newItemForm.get('amount')?.value) {
              this.dialogMessageService.setMessage('La cantidad no puede ser mayor al stock del artículo');
              return this.dialogService.openDialog({ component: DialogMessageComponent });
          }
            let toSaveArticle = { ...article };
            (toSaveArticle as Article).options = ['delete'];
            this.selectedArticles.push(toSaveArticle as Article);
            this.amountSelectedItemsForm.push(
              new FormGroup({amount:(new FormControl(0, [Validators.required, Validators.min(1)]))})
              );
            if (!article) {
                return;
            }
            // Cuando se muta la data no se refresca la vista en la tabla, se nececita cambiar la referencia
            this.selectedArticles = [...this.selectedArticles];
            this.newItemForm.get('amount')?.reset();
        });

        this.rowToRemoveSubs = this.tableStoreService.rowToRemove$.subscribe((article) => {
            if (!this.selectedArticles.length) {
                return;
            }
            const removeIndex = this.selectedArticles.findIndex((item) => {
                return item.id === article?.id
            });
            this.amountSelectedItemsForm.removeAt(removeIndex);
            this.selectedArticles.splice(removeIndex, 1);
            // Cuando se muta la data no se refresca la vista en la tabla, se nececita cambiar la referencia
            this.selectedArticles = [...this.selectedArticles];
            this.newItemForm.get('amount')?.markAsTouched();
        });

        this.isConfirmedSubs = this.dialogMessageService.confirmMessage$.subscribe((value: boolean) => {
            this.isConfirmed = value;
        });
    }

    ngOnDestroy(): void {
      this.destroy$.next(true);
      this.tableStoreService.setSelectedRow(null);
      this.searchStoreService.updateItems([]);
      this.itemsFromSearchSubs?.unsubscribe();
      this.rowToRemoveSubs?.unsubscribe();
      this.selectedRowSubs?.unsubscribe();
      this.displayedDepartureTicketsSubs?.unsubscribe();
      this.userStatusSubs?.unsubscribe();
    }

    getPetitioners(id: number) {
        this.enablePetittionerOptions();
        this.petitionerService.getPetitionersByAreaId(id)
            .pipe(catchError((err) => of([])))
            .subscribe((petitioners: PetitionerForm[]) => {
              console.log({petitioners});

                if (!petitioners.length) {
                    return this.disablePetittionerOptions();
                }
                this.petitioners = petitioners;
            })
    }

    enablePetittionerOptions() {
        this.newItemForm.get('petitioner')?.enable();
    }

    disablePetittionerOptions() {
        this.newItemForm.get('petitioner')?.disable();
        this.newItemForm.get('petitioner')?.reset();
    }

    invalidator(formControlName: string, validator: string, index?: number) {
        if(index) {
          return this.getAmountControl(index)?.hasError(validator) && this.newItemForm.controls[formControlName].touched;
        }
        return this.newItemForm.controls[formControlName].hasError(validator) && this.newItemForm.controls[formControlName].touched;
    }

    requiredInputInvalidator(formControlName: string, index?: number) {
        return this.invalidator(formControlName, 'required', index);
    }

    intInputInvalidator(formControlName: string, index?: number) {
        return this.invalidator(formControlName, 'pattern', index);
    }

    minLengthInputInvalidator(formControlName: string, index?: number) {
        return this.invalidator(formControlName, 'minlength', index);
    }

    minCuantityInputInvalidator(formControlName: string, index?: number) {
        return this.invalidator(formControlName, 'min', index);
    }

    maxCuantityInputInvalidator(formControlName: string, index?: number) {
        return this.invalidator(formControlName, 'max', index);
    }

    submit() {
        if (
            this.newItemForm.get('area')?.invalid ||
            this.newItemForm.get('petitioner')?.invalid ||
            !this.selectedArticles.length) {
            this.newItemForm.markAllAsTouched();
            this.dialogMessageService.setMessage('No puedes crear o editar un vale de salida sin artículos seleccionados');
            this.dialogService.openDialog({ component: DialogMessageComponent });
            return;
        }
        if(this.amountSelectedItemsForm.invalid) {
          this.newItemForm.markAllAsTouched();
          this.dialogMessageService.setMessage('No puedes crear o editar un vale de salida con cantidades no válidas');
          this.dialogService.openDialog({ component: DialogMessageComponent });
          return;
        }
        const { amount, ...rest } = this.newItemForm.value;
        this.dialogService.openDialog({
            component: ConfirmDepartureTicketComponent, data: {
                departureTicket: {
                    areaId: rest.area,
                    petitionerId: rest.petitioner,
                    articles: this.selectedArticles
                }
            }, callback: () => {
                // Si envian data es porque es una edicion de vale de salida.
                if (!this.isConfirmed) {
                    return;
                }
                if (this?.data?.isDepartureTicket) {
                    return this.updateItem();
                }
                this.createItem();
            },
            sizes: {
                minWidth: '80%'
            }
        })

    }

    createItem() {
        this.departureTicketService.createDepartureTicket({
            idPetitioner: this.newItemForm.get('petitioner')?.value,
            idArea: this.newItemForm.get('area')?.value,
            idUser: this.localStorageService.getItem('user').id!,
            articleExitDetails: this.selectedArticles.map((article: Article) => {
                return {
                    idArticle: article.id || 0,
                    amount: article.amount || 0
                }
            })
        }).subscribe((departureTicket: DepartureTicket) => {
            this.closeDialog();
            // Si los elementos que se muestran son menores a 25(el limite por pagina) agregarlo a la pagina actual
            if (this.displayedDepartureTickets.length < 25) {
                this.departureTicketStore.emitNewDepartureTicket({
                    id: departureTicket.id,
                    date: departureTicket.date,
                    time: departureTicket.time,
                    petitioner: departureTicket.petitioner.name,
                    area: departureTicket.area.name,
                    user: departureTicket.user.email,
                    options: this.isAdmin ? ['edit', 'picture_as_pdf'] : ['edit', 'picture_as_pdf']
                });
            }
            this.dialogMessageService.setMessage('Vale de salida realizado exitosamente');
            this.dialogService.openDialog({ component: DialogMessageComponent });
        });
    }

    updateItem() {
        this.departureTicketService.updateDepartureTicket(this.data.departureTicketId, {
            idPetitioner: this.newItemForm.get('petitioner')?.value,
            idArea: this.newItemForm.get('area')?.value,
            idUser: this.localStorageService.getItem('user').id!,
            articleExitDetails: this.selectedArticles.map((article: Article) => {
                return {
                    idArticle: article.id || 0,
                    amount: article.amount || 0
                }
            })
        }).subscribe((departureTicket: DepartureTicket) => {
            this.closeDialog();
            this.departureTicketStore.updateDepartureTicket({
                id: this.data.departureTicketId,
                date: departureTicket.date,
                time: departureTicket.time,
                petitioner: departureTicket.petitioner?.name,
                area: departureTicket.petitioner?.area?.name,
                user: departureTicket.user?.email,
                options: ['edit', 'picture_as_pdf']
            });
            this.dialogMessageService.setMessage('Vale de salida actualizado exitosamente');
            this.dialogService.openDialog({ component: DialogMessageComponent });
        });
    }

    removeItem(article: Article) {
      this.selectedArticles = this.selectedArticles.filter(art => art.id !== article.id)
      const removeIndex = this.selectedArticles.findIndex((item) => {
        return item.id === article?.id
      });
      this.amountSelectedItemsForm.removeAt(removeIndex);
    }

    closeDialog() {
        this.dialogService.closeDialog();
    }
}
