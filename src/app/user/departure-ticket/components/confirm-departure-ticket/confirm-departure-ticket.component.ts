import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Traduction } from '../../../../shared/interfaces/translate.type';
import { Article } from '../../../../shared/interfaces/article.interface';
import { Petitioner } from '../../../../shared/interfaces/petitioner.interface';
import { PetitionerService } from '../../../../shared/services/petitioner.service';
import { Subscription } from 'rxjs';
import { DialogMessageService } from '../../../../shared/services/dialog-message.service';
import { DialogService } from '../../../../components/services/dialog/dialog.service';

@Component({
    selector: 'app-confirm-departure-ticket',
    templateUrl: './confirm-departure-ticket.component.html',
    styleUrls: ['./confirm-departure-ticket.component.css']
})
export class ConfirmDepartureTicketComponent implements OnInit, OnDestroy {

    articlesToConfirm!: Article[];
    petitioner!: Petitioner;

    petitionerSubs!: Subscription;

    articlesToConfirmColumns: Traduction[] = [
        'id',
        'description',
        'stock',
        'size',
        'amount',
    ];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private petitionerService: PetitionerService,
        private dialogMessageService: DialogMessageService,
        private dialogService: DialogService
    ) { }

    ngOnInit(): void {
        this.petitionerSubs = this.petitionerService.getPetitionerById(this.data.departureTicket.petitionerId).subscribe((petitioner: Petitioner) => {
            this.petitioner = petitioner;
        })
        this.articlesToConfirm = this.data.departureTicket.articles.map((article: Article) => {
            const { options, ...rest } = article;
            return rest;
        });
    }

    ngOnDestroy(): void {
        this.petitionerSubs.unsubscribe();
    }

    closeDialog(isConfirmed: boolean) {
        this.dialogMessageService.toggleConfirmMessage(isConfirmed);
        this.dialogService.closeDialog();
    }
}
