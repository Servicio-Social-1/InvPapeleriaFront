import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepartureTicketRoutingModule } from './departure-ticket-routing.module';
import { DepartureTicketComponent } from './departure-ticket.component';
import { MaterialModule } from '../../shared/material/material.module';
import { ComponentsModule } from '../../components/components.module';
import { NewDepartureTicketComponent } from './components/new-departure-ticket/new-departure-ticket.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmDepartureTicketComponent } from './components/confirm-departure-ticket/confirm-departure-ticket.component';


@NgModule({
    declarations: [
        DepartureTicketComponent,
        NewDepartureTicketComponent,
        ConfirmDepartureTicketComponent
    ],
    imports: [
        CommonModule,
        DepartureTicketRoutingModule,
        MaterialModule,
        ComponentsModule,
        ReactiveFormsModule,
        // COmo el servicio que lo usa tiene provide in root esta en el app.module
        // HttpClientModule
    ]
})
export class DepartureTicketModule { }
