import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../shared/material/material.module';
import { ComponentsModule } from '../components/components.module';
import { UserComponent } from './user.component';
import { UserRoutingModule } from './user-routing.module';
import { UserPetitionersModule } from './petitioners/petitioners.module';


@NgModule({
    declarations: [
        UserComponent,
    ],
    imports: [
        CommonModule,
        UserRoutingModule,
        MaterialModule,
        ComponentsModule,
        UserPetitionersModule,
    ],
    exports: [
        UserComponent,
    ],
})
export class UserModule { }
