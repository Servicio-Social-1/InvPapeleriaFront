import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search/search.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { TableComponent } from './table/table.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MaterialModule } from '../shared/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PaginatorComponent } from './paginator/paginator.component';



@NgModule({
    declarations: [
        SearchComponent,
        SidenavComponent,
        TableComponent,
        ToolbarComponent,
        PaginatorComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule
    ],
    exports: [
        SearchComponent,
        SidenavComponent,
        TableComponent,
        ToolbarComponent,
        PaginatorComponent
    ]
})
export class ComponentsModule { }
