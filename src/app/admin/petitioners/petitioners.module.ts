import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PetitionersComponent } from './petitioners.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { PetitionersRoutingModule } from './petitioners-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NewPetitionerComponent } from './components/new-petitioner/new-petitioner.component';



@NgModule({
  declarations: [
    NewPetitionerComponent,
    PetitionersComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    HttpClientModule,
    MaterialModule,
    PetitionersRoutingModule,
    ReactiveFormsModule
  ]
})
export class PetitionersModule { }
