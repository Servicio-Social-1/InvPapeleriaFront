import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryComponent } from './inventory.component';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { ComponentsModule } from '../../components/components.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NewArticleComponent } from './components/new-article/new-article.component';


@NgModule({
    declarations: [
        InventoryComponent,
        NewArticleComponent,
    ],
    imports: [
        CommonModule,
        InventoryRoutingModule,
        MaterialModule,
        ComponentsModule,
        ReactiveFormsModule,
        HttpClientModule
    ],
    exports: []
})
export class InventoryModule { }
