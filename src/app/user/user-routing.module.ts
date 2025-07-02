import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedInGuard } from '../shared/guards/logged-in/logged-in.guard';
import { UserComponent } from './user.component';

const routes: Routes = [
    {
        path: '',
        component: UserComponent,
        children: [
            {
                path: 'inventory',
                loadChildren: () => import('./inventory/inventory.module').then(m => m.InventoryModule),
                canLoad: [LoggedInGuard],
                canActivate: [LoggedInGuard]
            },
            {
                path: 'departure-ticket',
                loadChildren: () => import('./departure-ticket/departure-ticket.module').then(m => m.DepartureTicketModule),
                canLoad: [LoggedInGuard],
                canActivate: [LoggedInGuard]
            },
            {
                path: 'entry-ticket',
                loadChildren: () => import('./entry-ticket/entry-ticket.module').then(m => m.EntryTicketModule),
                canLoad: [LoggedInGuard],
                canActivate: [LoggedInGuard]
            },
            {
                path: 'petitioners',
                loadChildren: () => import('./petitioners/petitioners.module').then(m => m.UserPetitionersModule),
                canLoad: [LoggedInGuard],
                canActivate: [LoggedInGuard]
            },
            { path: '**', redirectTo: 'inventory' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule { }
