import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth/auth.service';
import { Article } from 'src/app/shared/interfaces/article.interface';
import { ErrorResponse } from 'src/app/shared/interfaces/error-response.interface';
import { Traduction } from 'src/app/shared/interfaces/translate.type';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { paginatorInitialState } from 'src/app/shared/states/paginator.state';
import { LimitAndOffset } from '../../components/interfaces/limit-offset.interface';
import { Paginator } from '../../components/interfaces/paginator.interface';
import { DialogService } from '../../components/services/dialog/dialog.service';
import { PaginatorService } from '../../components/services/paginator/paginator.service';
import { SearchStoreService } from '../../components/services/search/search-store.service';
import { TableStoreService } from '../../components/services/table/table-store.service';
import { NewArticleComponent } from './components/new-article/new-article.component';
import { InventoryService } from './services/inventory/inventory.service';
import { InventoryStore } from './services/store/inventory-store';
import { DialogMessageService } from 'src/app/shared/services/dialog-message.service';
import { DialogMessageComponent } from 'src/app/shared/components/dialog-message/dialog-message.component';

@Component({
    selector: 'app-inventory',
    templateUrl: './inventory.component.html',
    styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

    articleCount = 1;
    limitAndOffsetAndSize = {
        limit: 25,
        offset: 0
    }
    isSearching: boolean = false;

    articles!: Article[];
    errorMsg!: string;
    columns: Traduction[] = [];

    isLoading!: boolean;
    articleCountSubs!: Subscription;
    loadingSubs!: Subscription;
    articlesSubs!: Subscription;
    newArticleSubs!: Subscription;
    paginatorSubs!: Subscription;
    updatedArticleSubs!: Subscription;

    itemsFromSearchSubs!: Subscription;
    valueSearchSubs!: Subscription;
    articlesFromSearch!: Article[]
    newArticleFormIsOpenSubs!: Subscription;

    paginatorStatepaginator!: Paginator;
    deleteArticleSubs!: Subscription;

    userStatusSubs!: Subscription;
    isAdmin!: boolean;

    paginatorState: PageEvent = paginatorInitialState;

    constructor(
        private dialogService: DialogService,
        private inventoryService: InventoryService,
        private loadingService: LoadingService,
        private readonly paginatorService: PaginatorService,
        private searchStoreService: SearchStoreService,
        private inventoryStore: InventoryStore,
        private tableStoreService: TableStoreService,
        private authService: AuthService,
        private dialogMessageService: DialogMessageService
    ) { }

    ngOnInit(): void {
        this.loadingService.toggleLoading(true);
        this.tableStoreService.setTableContext('inventory');
        this.paginatorService.reset();

        this.userStatusSubs = this.authService.adminStatus().subscribe((isAdmin: boolean) => {
            this.isAdmin = isAdmin;

            this.newArticleSubs = this.inventoryStore.newArticle$.subscribe((article: Article) => {
                if (this.articles.length < 25) {
                    article.options = ['edit'];
                    this.articles.push(article);
                    this.articles = [...this.articles];
                }
            });
            this.updatedArticleSubs = this.inventoryStore.updatedArticle$.subscribe((article: Article) => {
                const updatedArticleIndex = this.articles.findIndex((art: Article) => art.id === article.id);
                this.articles[updatedArticleIndex] = article;
                this.articles = [...this.articles];
            });
            this.loadingSubs = this.loadingService.isLoading$.subscribe((isLoading: boolean) => {
                this.isLoading = isLoading;
            });
            this.articleCountSubs = this.inventoryService.getCount().subscribe((count: number) => {
                this.articleCount = count;
            });
            this.paginatorSubs = this.paginatorService.paginator$.subscribe((paginator: PageEvent) => {
                this.paginatorState = paginator;
                this.pageChanged(this.paginatorState);
            });
            this.valueSearchSubs = this.searchStoreService.value$.subscribe((value) => this.handleValueSearchSubs(value));
            this.itemsFromSearchSubs = this.searchStoreService.itemsFromSearch$.subscribe((items) => this.handleItemsFromSearch(items));
        });
    }

    handleItemsFromSearch(articles: any) {
        this.articlesFromSearch = (articles as Article[]).map((article) => {
            article.options = ['edit'];
            return article;
        })
    }

    handleValueSearchSubs(value: string) {
        this.isSearching = !!value;
    }

    async handleDeleteArticle(article: Article) {
        // Eliminar cualquier validación, confirmación o diálogo
        // Solo ejecutar el borrado directo
        this.inventoryService.delete(article.id).subscribe(() => {
            this.pageChanged(this.paginatorState);
        });
    }

    getArticles({ limit, offset }: LimitAndOffset) {
        return this.inventoryService.getArticles(
            { limit, offset }
        ).subscribe({
            error: (err: ErrorResponse) => this.setTableErrorData(err),
            next: (articles: Article[]) => this.setTableData(articles)
        });
    }

    // Cuando no encuentra resultados en la api define mensaje de error en la tabla y establece columnas por defecto
    setTableErrorData(err: ErrorResponse) {
        this.columns = ['id', 'description', 'stock', 'size'];
        if (this.isAdmin) {
            this.columns.push('options');
        }
        this.articles = []
        this.errorMsg = err.error.message;
        this.loadingService.toggleLoading(false);
    }

    setTableData(articles: Article[]) {
        this.columns = ['id', 'description', 'stock', 'size'];
        if (this.isAdmin) {
            this.columns.push('options');
        }
        articles.forEach((article: Article) => {
            if (this.isAdmin) {
                article.options = ['edit', 'delete'];
            } else {
                article.options = [];
            }
        })
        this.articles = articles;
        this.inventoryStore.updateDislayedArticles(articles);
        this.loadingService.toggleLoading(false);
    }

    pageChanged(event: PageEvent) {
        this.paginatorState = { ...event };
        this.loadingService.toggleLoading(true);
        this.articlesSubs = this.getArticles({
            limit: 25,
            offset: event.pageIndex * 25
        });
    }

    openDialog() {
        this.unsubscribeWhenOpenDialog();
        this.dialogService.openDialog({
            component: NewArticleComponent, callback: () => {
                this.tableStoreService.setTableContext('inventory')
                this.itemsFromSearchSubs = this.searchStoreService.itemsFromSearch$.subscribe((items) => this.handleItemsFromSearch(items));
                this.valueSearchSubs = this.searchStoreService.value$.subscribe((value) => this.handleValueSearchSubs(value));
                this.articleCountSubs = this.inventoryService.getCount().subscribe((count: number) => {
                    this.articleCount = count;
                });
                this.searchStoreService.updateValue('');
                this.deleteArticleSubs = this.tableStoreService.rowToRemove$.subscribe((article) => this.handleDeleteArticle(article as Article));
            },
            data: { title: 'Nuevo Artículo' }
        });
    }


    unsubscribeWhenOpenDialog() {
        this.itemsFromSearchSubs?.unsubscribe();
        this.valueSearchSubs?.unsubscribe();
        this.searchStoreService.updateItems([]);
        this.deleteArticleSubs?.unsubscribe();
    }

    openReport() {
        this.inventoryService.getReport('inventory').subscribe(res => {
            const fileUrl = URL.createObjectURL(res);
            window.open(fileUrl, '_blank');
        });
    }

    ngOnDestroy(): void {
        this.newArticleFormIsOpenSubs?.unsubscribe();
        this.articleCountSubs?.unsubscribe();
        this.articlesSubs?.unsubscribe();
        this.valueSearchSubs?.unsubscribe();
        this.loadingSubs?.unsubscribe();
        this.paginatorSubs?.unsubscribe();
        this.updatedArticleSubs?.unsubscribe();
        this.newArticleSubs?.unsubscribe();
        this.userStatusSubs?.unsubscribe();
        this.deleteArticleSubs?.unsubscribe();
    }

    onArticleDeleted() {
        this.pageChanged(this.paginatorState);
    }

}
