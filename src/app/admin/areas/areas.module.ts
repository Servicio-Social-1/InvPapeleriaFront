import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AreasComponent } from './areas.component';
import { NewAreaComponent } from './components/new-area/new-area.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { AreasRoutingModule } from './areas-routing.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AreasComponent,
    NewAreaComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    HttpClientModule,
    MaterialModule,
    AreasRoutingModule,
    ReactiveFormsModule
  ]
})
export class AreasModule { }
