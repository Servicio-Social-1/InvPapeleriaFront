import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DialogMessageService {

    private message = new BehaviorSubject('');
    message$ = this.message.asObservable();

    private confirmMessage = new Subject<boolean>();
    confirmMessage$ = this.confirmMessage.asObservable();

    private messageContext = new BehaviorSubject<'confirmDeleteDepartureTicket' | 'confirmDeleteArticle' | 'confirmDeleteUser' | 'confirmDeleteArea' | 'confirmDeletePetitioner' | 'logout'>('confirmDeleteArticle');
    messageContext$ = this.messageContext.asObservable();

    constructor() { }

    setMessage(message: string) {
        this.message.next(message);
    }

    toggleConfirmMessage(value: boolean) {
        this.confirmMessage.next(value);
    }

    setMessageContext(context: 'confirmDeleteDepartureTicket' | 'confirmDeleteArticle' | 'confirmDeleteUser' | 'confirmDeleteArea' | 'confirmDeletePetitioner' | 'logout') {
        this.messageContext.next(context);
    }

}
