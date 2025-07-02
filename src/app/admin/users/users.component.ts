import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth/auth.service';
import { LimitAndOffset } from 'src/app/components/interfaces/limit-offset.interface';
import { Paginator } from 'src/app/components/interfaces/paginator.interface';
import { DialogService } from 'src/app/components/services/dialog/dialog.service';
import { PaginatorService } from 'src/app/components/services/paginator/paginator.service';
import { SearchStoreService } from 'src/app/components/services/search/search-store.service';
import { TableStoreService } from 'src/app/components/services/table/table-store.service';
import { ErrorResponse } from 'src/app/shared/interfaces/error-response.interface';
import { Traduction } from 'src/app/shared/interfaces/translate.type';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { paginatorInitialState } from 'src/app/shared/states/paginator.state';
import { User } from '../../shared/interfaces/departure-ticket.interface';
import { UsersStore } from './services/users-store';
import { UsersService } from './services/users.service';
import { NewUserComponent } from './components/new-user/new-user.component';
import { UserToTable } from '../../shared/interfaces/admin-to-table';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

    userCount = 1;
    limitAndOffsetAndSize = {
        limit: 25,
        offset: 0
    }
    isSearching: boolean = false;

    users!: UserToTable[];
    errorMsg!: string;
    columns: Traduction[] = [];

    isLoading!: boolean;
    userCountSubs!: Subscription;
    loadingSubs!: Subscription;
    usersSubs!: Subscription;
    newUserSubs!: Subscription;
    paginatorSubs!: Subscription;
    updatedUserSubs!: Subscription;

    itemsFromSearchSubs!: Subscription;
    valueSearchSubs!: Subscription;
    usersFromSearch!: UserToTable[]
    newUserFormIsOpenSubs!: Subscription;

    paginatorStatepaginator!: Paginator;
    deleteUserSubs!: Subscription;

    userStatusSubs!: Subscription;

    paginatorState: PageEvent = paginatorInitialState;

    constructor(
        private dialogService: DialogService,
        private usersService: UsersService,
        private usersStore: UsersStore,
        private loadingService: LoadingService,
        private readonly paginatorService: PaginatorService,
        private searchStoreService: SearchStoreService,
        private tableStoreService: TableStoreService,
    ) { }

    ngOnInit(): void {
        this.loadingService.toggleLoading(true);
        this.tableStoreService.setTableContext('user');
        this.paginatorService.reset();

        this.deleteUserSubs = this.tableStoreService.rowToRemove$.subscribe((user) => {
            if (!this.users.length) {
                return;
            }
            const removeIndex = this.users.findIndex((item) => {
                return item.id === user?.id
            });
            this.users.splice(removeIndex, 1);
            this.users = [...this.users];
        });

        this.newUserSubs = this.usersStore.newUser$.subscribe((user: UserToTable) => {
            if (this.users.length < 25) {
                user.options = ['edit'];
                this.users.push(user);
                this.users = [...this.users];
            }
        });
        this.updatedUserSubs = this.usersStore.updatedUser$.subscribe((user: UserToTable) => {
            const updatedUserIndex = this.users.findIndex((usr: UserToTable) => usr.id === user.id);
            this.users[updatedUserIndex] = user;
            this.users = [...this.users];
        });
        this.loadingSubs = this.loadingService.isLoading$.subscribe((isLoading: boolean) => {
            this.isLoading = isLoading;
        });
        this.userCountSubs = this.usersService.getCount().subscribe((count: number) => {
            this.userCount = count;
        });
        this.paginatorSubs = this.paginatorService.paginator$.subscribe((paginator: PageEvent) => {
            this.paginatorState = paginator;
            this.pageChanged(this.paginatorState);
        });
        this.valueSearchSubs = this.searchStoreService.value$.subscribe(v => this.handleValueSearchSubs(v));
        this.itemsFromSearchSubs = this.searchStoreService.itemsFromSearch$.subscribe(items => this.handleItemsFromSearch(items));
    }

    handleItemsFromSearch(users: any) {
        this.usersFromSearch = (users).map((user: User) => {
            return {
              ...user,
              options: ['edit', 'delete'],
              role: user.role.name
            };
        })
    }

    handleValueSearchSubs(value: string) {
        if (!value) {
            return this.isSearching = false
        }
        return this.isSearching = true;
    }

    getUsers({ limit, offset }: LimitAndOffset) {
        return this.usersService.getUsers(
            { limit, offset }
        ).subscribe({
            error: (err: ErrorResponse) => this.setTableErrorData(err),
            next: (users: User[]) => this.setTableData(users)
        });
    }

    // Cuando no encuentra resultados en la api define mensaje de error en la tabla y establece columnas por defecto
    setTableErrorData(err: ErrorResponse) {
        this.columns = ['id', 'email', 'role', 'name', 'options'];
        this.users = []
        this.errorMsg = err.error.message;
        this.loadingService.toggleLoading(false);
    }

    setTableData(users: User[]) {
        this.columns = ['id', 'email', 'role', 'name', 'options'];
        const formattedUsers: UserToTable[] = users.map((user) => {
            return {
                role: user.role.name,
                email: user.email,
                id: user.id,
                status: user.status,
                name: user.name,
                options: ['edit', 'delete'],
            }
        });
        this.users = [...formattedUsers];
        this.usersStore.updateDisplayedUsers(this.users);
        this.loadingService.toggleLoading(false);
    }

    pageChanged(event: PageEvent) {
        this.paginatorState = { ...event };
        this.loadingService.toggleLoading(true);
        this.usersSubs = this.getUsers({
            limit: 25,
            offset: event.pageIndex * 25
        });
    }

    openDialog() {
        this.searchStoreService.updateItems([]);
        this.itemsFromSearchSubs?.unsubscribe();
        this.valueSearchSubs?.unsubscribe();
        this.dialogService.openDialog({
            component: NewUserComponent, callback: () => {
                this.tableStoreService.setTableContext('user');
                this.itemsFromSearchSubs = this.searchStoreService.itemsFromSearch$.subscribe(this.handleItemsFromSearch);
                this.valueSearchSubs = this.searchStoreService.value$.subscribe(this.handleValueSearchSubs);
                this.userCountSubs = this.usersService.getCount().subscribe((count: number) => {
                    this.userCount = count;
                });
            },
            data: { title: 'Nuevo Usuario' }
        });
    }

    ngOnDestroy(): void {
        this.newUserFormIsOpenSubs?.unsubscribe();
        this.userCountSubs?.unsubscribe();
        this.usersSubs?.unsubscribe();
        this.valueSearchSubs?.unsubscribe();
        this.loadingSubs?.unsubscribe();
        this.paginatorSubs?.unsubscribe();
        this.updatedUserSubs?.unsubscribe();
        this.newUserSubs?.unsubscribe();
        this.userStatusSubs?.unsubscribe();
        this.deleteUserSubs?.unsubscribe();
    }

}

