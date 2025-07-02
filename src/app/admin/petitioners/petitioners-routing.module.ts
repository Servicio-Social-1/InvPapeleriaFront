import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PetitionersComponent } from './petitioners.component';

const routes: Routes = [
    {
        path: '',
        component: PetitionersComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PetitionersRoutingModule { }
