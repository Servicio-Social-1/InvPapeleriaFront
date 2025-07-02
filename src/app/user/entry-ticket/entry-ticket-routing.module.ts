import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntryTicketComponent } from './entry-ticket.component';

const routes: Routes = [
    {
        path: '',
        component: EntryTicketComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EntryTicketRoutingModule { }
