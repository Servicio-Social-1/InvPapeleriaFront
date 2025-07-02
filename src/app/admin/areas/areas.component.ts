import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DialogService } from 'src/app/components/services/dialog/dialog.service';
import { SearchStoreService } from 'src/app/components/services/search/search-store.service';
import { TableStoreService } from 'src/app/components/services/table/table-store.service';
import { Area } from 'src/app/shared/interfaces/departure-ticket.interface';
import { ErrorResponse } from 'src/app/shared/interfaces/error-response.interface';
import { Traduction } from 'src/app/shared/interfaces/translate.type';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { NewAreaComponent } from './components/new-area/new-area.component';
import { AreasStore } from './services/areas-store';
import { AreasService } from './services/areas.service';

@Component({
    selector: 'app-areas',
    templateUrl: './areas.component.html',
    styleUrls: ['./areas.component.css']
})
export class AreasComponent implements OnInit {
    areaCount = 1;
    limitAndOffsetAndSize = {
        limit: 25,
        offset: 0
    }
    isSearching: boolean = false;

    areas!: Area[];
    errorMsg!: string;
    columns: Traduction[] = [];

    isLoading!: boolean;
    loadingSubs!: Subscription;
    areasSubs!: Subscription;
    newAreaSubs!: Subscription;
    updatedAreaSubs!: Subscription;

    itemsFromSearchSubs!: Subscription;
    valueSearchSubs!: Subscription;
    areasFromSearch!: Area[]
    newAreaFormIsOpenSubs!: Subscription;

    deleteAreaSubs!: Subscription;

    areaStatusSubs!: Subscription;

    constructor(
        private dialogService: DialogService,
        private areasService: AreasService,
        private areasStore: AreasStore,
        private loadingService: LoadingService,
        private searchStoreService: SearchStoreService,
        private tableStoreService: TableStoreService,
    ) { }

    ngOnInit(): void {
        this.loadingService.toggleLoading(true);
        this.tableStoreService.setTableContext('area');

        this.deleteAreaSubs = this.tableStoreService.rowToRemove$.subscribe((area) => {
            if (!this.areas.length) {
                return;
            }
            const removeIndex = this.areas.findIndex((item) => {
                return item.id === area?.id
            });
            this.areas.splice(removeIndex, 1);
            this.areas = [...this.areas];
        });

        this.newAreaSubs = this.areasStore.newArea$.subscribe((area: Area) => {
            area.options = ['edit'];
            this.areas.push(area);
            this.areas = [...this.areas];
        });
        this.updatedAreaSubs = this.areasStore.updatedArea$.subscribe((area: Area) => {
            const updatedAreaIndex = this.areas.findIndex((usr: Area) => usr.id === area.id);
            this.areas[updatedAreaIndex] = area;
            this.areas = [...this.areas];
        });
        this.loadingSubs = this.loadingService.isLoading$.subscribe((isLoading: boolean) => {
            this.isLoading = isLoading;
        });
        this.areasSubs = this.areasService.getAreas().subscribe({
            next: (areas) => this.setTableData(areas),
            error: (err) => this.setTableErrorData(err)
        });
        this.valueSearchSubs = this.searchStoreService.value$.subscribe(v => this.handleValueSearchSubs(v));
        this.itemsFromSearchSubs = this.searchStoreService.itemsFromSearch$.subscribe(items => this.handleItemsFromSearch(items));
    }

    handleItemsFromSearch(areas: any) {
        this.areasFromSearch = (areas as Area[]).map((area) => {
            area.options = ['edit'];
            return area;
        })
    }

    handleValueSearchSubs(value: string) {
        if (!value) {
            return this.isSearching = false
        }
        return this.isSearching = true;
    }

    getAreas() {
        return this.areasService.getAreas().subscribe({
            error: (err: ErrorResponse) => this.setTableErrorData(err),
            next: (areas: Area[]) => this.setTableData(areas)
        });
    }

    // Cuando no encuentra resultados en la api define mensaje de error en la tabla y establece columnas por defecto
    setTableErrorData(err: ErrorResponse) {
        this.columns = ['id', 'name', 'options'];
        this.areas = []
        this.errorMsg = err.error.message;
        this.loadingService.toggleLoading(false);
    }

    setTableData(areas: Area[]) {
        this.columns = ['id', 'name', 'options'];
        const formattedAreas: Area[] = areas.map((area) => {
            return {
                options: ['edit', 'delete'],
                ...area
            }
        });
        this.areas = [...formattedAreas];
        this.areasStore.updateDisplayedAreas(this.areas);
        this.loadingService.toggleLoading(false);
    }

    openDialog() {
        this.searchStoreService.updateItems([]);
        this.itemsFromSearchSubs?.unsubscribe();
        this.valueSearchSubs?.unsubscribe();
        this.dialogService.openDialog({
            component: NewAreaComponent, callback: () => {
                this.tableStoreService.setTableContext('area');
                this.itemsFromSearchSubs = this.searchStoreService.itemsFromSearch$.subscribe(this.handleItemsFromSearch);
                this.valueSearchSubs = this.searchStoreService.value$.subscribe(this.handleValueSearchSubs);
            },
            data: { title: 'Nueva área' }
        });
    }

    ngOnDestroy(): void {
        this.newAreaFormIsOpenSubs?.unsubscribe();
        this.areasSubs?.unsubscribe();
        this.valueSearchSubs?.unsubscribe();
        this.loadingSubs?.unsubscribe();
        this.updatedAreaSubs?.unsubscribe();
        this.newAreaSubs?.unsubscribe();
        this.areaStatusSubs?.unsubscribe();
        this.deleteAreaSubs?.unsubscribe();
    }

}
