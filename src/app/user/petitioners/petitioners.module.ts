import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserPetitionersComponent } from './petitioners.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { UserPetitionersRoutingModule } from './petitioners-routing.module';

@NgModule({
  declarations: [UserPetitionersComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    MaterialModule,
    HttpClientModule,
    UserPetitionersRoutingModule
  ]
})
export class UserPetitionersModule {}
