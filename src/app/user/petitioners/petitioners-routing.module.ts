import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserPetitionersComponent } from './petitioners.component';

const routes: Routes = [
  { path: '', component: UserPetitionersComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserPetitionersRoutingModule {}
