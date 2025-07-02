import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { DialogMessageService } from '../../services/dialog-message.service';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogService } from '../../../components/services/dialog/dialog.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';
import { TableStoreService } from '../../../components/services/table/table-store.service';

@Component({
    selector: 'app-dialog-message',
    templateUrl: './dialog-message.component.html',
    styleUrls: ['./dialog-message.component.css']
})
export class DialogMessageComponent implements OnInit, OnDestroy {

    message = '';
    messageContext!: 'confirmDeleteDepartureTicket' | 'confirmDeleteArticle' | 'confirmDeleteUser' | 'confirmDeleteArea' | 'confirmDeletePetitioner' | 'logout';

    messageSubs!: Subscription;
    messageContextSubs!: Subscription;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogMessageService: DialogMessageService,
        private dialogService: DialogService,
        private router: Router,
        private localStorageService: LocalStorageService,
        private tableStoreService: TableStoreService
    ) { }

    ngOnInit(): void {
        this.messageSubs = this.dialogMessageService.message$.subscribe((message) => {
            this.message = message;
        });
        this.messageContextSubs = this.dialogMessageService.messageContext$.subscribe((context) => {
            this.messageContext = context;
        });
        // Cerrar automáticamente si no es confirmación
        if (!this.data?.isConfirmMessage) {
            setTimeout(() => {
                this.dialogService.closeDialog();
            }, 300);
        }
    }

    ngOnDestroy(): void {
        this.messageSubs?.unsubscribe();
        this.messageContextSubs.unsubscribe();
    }

    confirm(value: boolean) {
        console.log('[DialogMessageComponent] Confirmación recibida:', value, 'Contexto:', this.messageContext, 'Mensaje:', this.message);
        if (!value) {
            return this.dialogService.closeDialog();
        }
        // Doble validación: si es la primera confirmación de borrado, solo emitir y NO cerrar el modal
        if (
            this.messageContext === 'confirmDeleteArticle' &&
            this.message === '¿Estás seguro de eliminar este artículo?'
        ) {
            this.dialogMessageService.toggleConfirmMessage(value);
            // No cerrar el modal, el flujo de la tabla abrirá el segundo
            return;
        }
        // Logout: limpiar storage y redirigir
        if (this.messageContext === 'logout') {
            localStorage.clear();
            this.router.navigate(['/auth']);
            this.dialogService.closeDialog();
            return;
        }
        // Confirmaciones normales (segunda de borrado, etc)
        this.dialogMessageService.toggleConfirmMessage(value);
        this.dialogService.closeDialog();
    }

}
