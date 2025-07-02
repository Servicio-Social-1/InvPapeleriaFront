import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from '../shared/error-page/error-page.component';
import { AdminGuard } from '../shared/guards/admin/admin.guard';
import { LoggedInGuard } from '../shared/guards/logged-in/logged-in.guard';
import { AdminOrUserGuard } from '../shared/guards/admin-or-user/admin-or-user.guard';
import { AdminComponent } from './admin.component';

const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        children: [
            {
                path: 'inventory',
                loadChildren: () => import('../user/inventory/inventory.module').then(m => m.InventoryModule),
                canLoad: [LoggedInGuard],
                canActivate: [LoggedInGuard]
            },
            {
                path: 'users',
                loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
                canLoad: [LoggedInGuard, AdminGuard],
                canActivate: [LoggedInGuard, AdminGuard]
            },
            {
                path: 'areas',
                loadChildren: () => import('./areas/areas.module').then(m => m.AreasModule)
                // canLoad: [LoggedInGuard, AdminOrUserGuard],
                // canActivate: [LoggedInGuard, AdminOrUserGuard]
            },
            {
                path: 'petitioners',
                loadChildren: () => import('./petitioners/petitioners.module').then(m => m.PetitionersModule)
                // canLoad: [LoggedInGuard, AdminOrUserGuard],
                // canActivate: [LoggedInGuard, AdminOrUserGuard]
            },
            { path: '404', component: ErrorPageComponent },
            { path: '**', redirectTo: 'inventory' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
