import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { NewUserComponent } from './components/new-user/new-user.component';
import { HttpClientModule } from '@angular/common/http';
import { UsersRoutingModule } from './users-routing.module';
import { MaterialModule } from '../../shared/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
    declarations: [
        UsersComponent,
        NewUserComponent
    ],
    imports: [
        CommonModule,
        ComponentsModule,
        HttpClientModule,
        MaterialModule,
        UsersRoutingModule,
        ReactiveFormsModule
    ]
})
export class UsersModule { }
