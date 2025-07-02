import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToolbarService } from '../services/toolbar/toolbar.service';
import { DialogService } from '../services/dialog/dialog.service';
import { DialogMessageService } from '../../shared/services/dialog-message.service';
import { DialogMessageComponent } from '../../shared/components/dialog-message/dialog-message.component';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  logoGobiernoUrl = environment.logoGobiernoUrl

    constructor(
        private toolbarService: ToolbarService,
        private dialogService: DialogService,
        private dialogMessageService: DialogMessageService,
    ) { }

    ngOnInit(): void {
    }

    toggleDrawer() {
        this.toolbarService.toggleDrawer();
    }

    logout() {
        this.dialogMessageService.setMessageContext('logout');
        this.dialogMessageService.setMessage('¿Seguro que deseas cerrar sesión?');
        this.dialogService.openDialog({ component: DialogMessageComponent, data: { isConfirmMessage: true } });
    }

}
