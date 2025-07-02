import { Component, OnInit } from '@angular/core';
import { PetitionerDto } from '../../shared/interfaces/admin.dtos';
import { Traduction } from '../../shared/interfaces/translate.type';
import { Subscription } from 'rxjs';
import { DialogService } from '../../components/services/dialog/dialog.service';
import { PetitionersService } from './services/petitioners.service';
import { PetitionersStore } from './services/petitioners-store';
import { LoadingService } from '../../shared/services/loading.service';
import { SearchStoreService } from '../../components/services/search/search-store.service';
import { TableStoreService } from '../../components/services/table/table-store.service';
import { Petitioner } from '../../shared/interfaces/petitioner.interface';
import { ErrorResponse } from '../../shared/interfaces/error-response.interface';
import { NewPetitionerComponent } from './components/new-petitioner/new-petitioner.component';
import { PetitionerToTable } from '../../shared/interfaces/admin-to-table';

@Component({
    selector: 'app-petitioners',
    templateUrl: './petitioners.component.html',
    styleUrls: ['./petitioners.component.css']
})
export class PetitionersComponent implements OnInit {

    petitionerCount = 1;
    limitAndOffsetAndSize = {
        limit: 25,
        offset: 0
    }
    isSearching: boolean = false;

    petitioners!: PetitionerToTable[];
    errorMsg!: string;
    columns: Traduction[] = [];

    isLoading!: boolean;
    loadingSubs!: Subscription;
    petitionersSubs!: Subscription;
    newPetitionerSubs!: Subscription;
    updatedPetitionerSubs!: Subscription;

    itemsFromSearchSubs!: Subscription;
    valueSearchSubs!: Subscription;
    petitionersFromSearch!: PetitionerToTable[]
    newpetitionerFormIsOpenSubs!: Subscription;

    deletePetitionerSubs!: Subscription;

    petitionerStatusSubs!: Subscription;

    constructor(
        private dialogService: DialogService,
        private petitionersService: PetitionersService,
        private petitionersStore: PetitionersStore,
        private loadingService: LoadingService,
        private searchStoreService: SearchStoreService,
        private tableStoreService: TableStoreService,
    ) { }

    ngOnInit(): void {
        this.loadingService.toggleLoading(true);
        this.tableStoreService.setTableContext('petitioner');

        this.deletePetitionerSubs = this.tableStoreService.rowToRemove$.subscribe((petitioner) => {
            if (!this.petitioners.length) {
                return;
            }
            const removeIndex = this.petitioners.findIndex((item) => {
                return item.id === petitioner?.id
            });
            this.petitioners.splice(removeIndex, 1);
            this.petitioners = [...this.petitioners];
        });

        this.newPetitionerSubs = this.petitionersStore.newPetitioner$.subscribe((petitioner: PetitionerToTable) => {
            petitioner.options = ['edit', 'delete'];
            this.petitioners.push({
                options: ['edit', 'delete'],
                ...petitioner,
            });
            this.petitioners = [...this.petitioners];
        });
        this.updatedPetitionerSubs = this.petitionersStore.updatedPetitioner$.subscribe((petitioner: PetitionerToTable) => {
            const updatedpetitionerIndex = this.petitioners.findIndex((ptt: PetitionerToTable) => ptt.id === petitioner.id);
            this.petitioners[updatedpetitionerIndex] = {
                options: ['edit', 'delete'],
                ...petitioner
            };
            this.petitioners = [...this.petitioners];
        });
        this.loadingSubs = this.loadingService.isLoading$.subscribe((isLoading: boolean) => {
            this.isLoading = isLoading;
        });
        this.petitionersSubs = this.petitionersService.getPetitioners().subscribe({
            next: (petitioners) => this.setTableData(petitioners),
            error: (err) => this.setTableErrorData(err)
        });
        this.valueSearchSubs = this.searchStoreService.value$.subscribe(value => this.handleValueSearchSubs(value));
        this.itemsFromSearchSubs = this.searchStoreService.itemsFromSearch$.subscribe(items => this.handleItemsFromSearch(items));
    }

    handleItemsFromSearch(petitioners: any) {
        this.petitionersFromSearch = (petitioners as Petitioner[]).map((petitioner) => {
            petitioner.options = ['edit', 'delete'];
            return {
              ...petitioner,
              area: petitioner.area.name,
            };
        })
    }

    handleValueSearchSubs(value: string) {
        if (!value) {
            return this.isSearching = false
        }
        return this.isSearching = true;
    }

    getpetitioners() {
        return this.petitionersService.getPetitioners().subscribe({
            error: (err: ErrorResponse) => this.setTableErrorData(err),
            next: (petitioners: Petitioner[]) => this.setTableData(petitioners)
        });
    }

    // Cuando no encuentra resultados en la api define mensaje de error en la tabla y establece columnas por defecto
    setTableErrorData(err: ErrorResponse) {
        this.columns = ['id', 'name', 'area', 'options'];
        this.petitioners = []
        this.errorMsg = err.error.message;
        this.loadingService.toggleLoading(false);
    }

    setTableData(petitioners: Petitioner[]) {
        this.columns = ['id', 'name', 'area', 'options'];
        const formattedPetitioners: PetitionerToTable[] = petitioners.map((petitioner) => {
            return {
                area: petitioner.area?.name,
                id: petitioner.id,
                name: petitioner.name,
                status: petitioner.status,
                options: ['edit', 'delete'],
            }
        });
        this.petitioners = [...formattedPetitioners];
        this.petitionersStore.updateDisplayedPetitioners(this.petitioners);
        this.loadingService.toggleLoading(false);
    }

    openDialog() {
        this.searchStoreService.updateItems([]);
        this.itemsFromSearchSubs?.unsubscribe();
        this.valueSearchSubs?.unsubscribe();
        this.dialogService.openDialog({
            component: NewPetitionerComponent, callback: () => {
                this.tableStoreService.setTableContext('petitioner');
                this.itemsFromSearchSubs = this.searchStoreService.itemsFromSearch$.subscribe(this.handleItemsFromSearch);
                this.valueSearchSubs = this.searchStoreService.value$.subscribe(this.handleValueSearchSubs);
            },
            data: { title: 'Nuevo Solicitante' }
        });
    }

    ngOnDestroy(): void {
        this.newpetitionerFormIsOpenSubs?.unsubscribe();
        this.petitionersSubs?.unsubscribe();
        this.valueSearchSubs?.unsubscribe();
        this.loadingSubs?.unsubscribe();
        this.updatedPetitionerSubs?.unsubscribe();
        this.newPetitionerSubs?.unsubscribe();
        this.petitionerStatusSubs?.unsubscribe();
        this.deletePetitionerSubs?.unsubscribe();
    }

}
