import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { User } from '../../../shared/interfaces/departure-ticket.interface';
import { UserToTable } from '../../../shared/interfaces/admin-to-table';

@Injectable({
    providedIn: 'root'
})
export class UsersStore {
    private displayedUsers = new BehaviorSubject<UserToTable[]>([]);
    displayedUsers$ = this.displayedUsers.asObservable();

    private newUser = new Subject<UserToTable>();
    newUser$ = this.newUser.asObservable();

    private updatedUser = new Subject<UserToTable>();
    updatedUser$ = this.updatedUser.asObservable();

    updateDisplayedUsers(users: UserToTable[]) {
        this.displayedUsers.next(users);
    }

    emitNewUser(users: UserToTable) {
        this.newUser.next(users);
    }

    updateUser(users: UserToTable) {
        this.updatedUser.next(users);
    }
}
