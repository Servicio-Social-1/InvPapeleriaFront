import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartureTicketComponent } from './departure-ticket.component';

const routes: Routes = [
    {
        path: '',
        component: DepartureTicketComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DepartureTicketRoutingModule { }
