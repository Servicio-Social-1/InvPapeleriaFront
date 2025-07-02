import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntryTicketRoutingModule } from './entry-ticket-routing.module';
import { NewEntryTicketComponent } from './components/new-entry-ticket/new-entry-ticket.component';
import { MaterialModule } from '../../shared/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { EntryTicketComponent } from './entry-ticket.component';
import { ComponentsModule } from '../../components/components.module';


@NgModule({
    declarations: [
        NewEntryTicketComponent,
        EntryTicketComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
        ComponentsModule,
        EntryTicketRoutingModule
    ]
})
export class EntryTicketModule { }
