import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from '../components/components.module';
import { AdminRoutingModule } from './admin-routing.module';



@NgModule({
    declarations: [
        AdminComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        ComponentsModule,
        AdminRoutingModule
    ]
})
export class AdminModule { }
