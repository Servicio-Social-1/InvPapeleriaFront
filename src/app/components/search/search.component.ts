import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { SearchService } from '../services/search/search.service';
import { SearchStoreService } from '../services/search/search-store.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { LoadingService } from '../../shared/services/loading.service';
import { DialogMessageService } from '../../shared/services/dialog-message.service';
import { DialogService } from '../services/dialog/dialog.service';
import { DialogMessageComponent } from '../../shared/components/dialog-message/dialog-message.component';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {

    destroy$ = new Subject<boolean>();

    @Input() context!: 'departure-ticket' | 'inventory' | 'article' | 'users' | 'areas' | 'petitioners';

    @Input() findBy!: string;
    valueSubs!: Subscription;
    value!: string;

    constructor(
        private searchService: SearchService,
        private searchStoreService: SearchStoreService,
        private loadingService: LoadingService,
        private dialogMessageService: DialogMessageService,
        private dialogService: DialogService
    ) { }

    ngOnInit(): void {
        this.searchStoreService.value$.pipe(
          takeUntil(this.destroy$)
        ).subscribe((value: string) => {
            this.value = value;
            this.termControl.setValue(this.value)
        });
    }

    ngOnDestroy(): void {
      this.destroy$.next(true);
    }

    termControl = new FormControl('', [Validators.maxLength(100)]);

    handleInput() {
        if (!this.termControl.value?.length) {
            this.searchStoreService.updateValue(this.termControl.value);
        }
        this.resetSearchTable();
    }

    resetSearchTable() {
        if (!this.termControl.value!.length) {
            this.searchStoreService.updateItems([]);
        }
    }

    reset() {
        this.searchStoreService.updateValue('');
        this.termControl.setValue('')
    }

    search() {
        if (!this.termControl.value?.trim().length) {
            this.termControl.markAllAsTouched();
                this.dialogMessageService.setMessage('El texto de búsqueda está vacío');
                this.dialogService.openDialog({
                    component: DialogMessageComponent, data: {
                        isConfirmMessage: false,
                    }, callback: () => this.searchStoreService.updateValue('')
                });
            return;
        }
        this.searchStoreService.updateValue(this.termControl.value.trim());
        const term = this.termControl.value!;
        const options = {
            'departure-ticket': () => {
                this.loadingService.toggleLoading(true);
                this.searchService.searchDepartureTickets(
                    term, { limit: 20, offset: 0 })
                    .subscribe((items) => {
                        this.loadingService.toggleLoading(false);
                        this.searchStoreService.updateItems(items)
                    });
            },
            inventory: () => {
                this.loadingService.toggleLoading(true);
                this.searchService.searchArticles(
                    term, { limit: 20, offset: 0 })
                    .subscribe((items) => {
                        this.loadingService.toggleLoading(false);
                        this.searchStoreService.updateItems(items)
                    });
            },
            article: () => {
                this.searchService.searchArticles(
                    term, { limit: 20, offset: 0 })
                    .subscribe((items) => this.searchStoreService.updateItems(items))
            },
            users: () => {
                this.loadingService.toggleLoading(true);
                this.searchService.searchUsers(
                  term, { limit: 20, offset: 0 })
                  .subscribe((items) => {
                    this.searchStoreService.updateItems(items)
                    this.loadingService.toggleLoading(false);
                  })
            },
            areas: () => {
                this.loadingService.toggleLoading(true);
                this.searchService.searchAreas(
                  term, { limit: 20, offset: 0 })
                  .subscribe((items) => {
                    this.searchStoreService.updateItems(items)
                    this.loadingService.toggleLoading(false);
                  })
            },
            petitioners: () => {
                this.loadingService.toggleLoading(true);
                this.searchService.searchPetitioners(
                  term, { limit: 20, offset: 0 })
                  .subscribe((items) => {

                    this.searchStoreService.updateItems(items)
                    this.loadingService.toggleLoading(false);
                  })
            },
            default: () => ''
        }

        options[this.context] ? options[this.context]() : options.default();

    }
}

