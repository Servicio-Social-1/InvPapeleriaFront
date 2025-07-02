import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../components/services/dialog/dialog.service';
import { NewEntryTicketComponent } from './components/new-entry-ticket/new-entry-ticket.component';

@Component({
    selector: 'app-entry-ticket',
    templateUrl: './entry-ticket.component.html',
    styleUrls: ['./entry-ticket.component.css']
})
export class EntryTicketComponent implements OnInit {

    constructor(
        private dialogService: DialogService
    ) { }

    ngOnInit(): void {
    }

    openDialog() {
        this.dialogService.openDialog({ component: NewEntryTicketComponent });
    }
}
