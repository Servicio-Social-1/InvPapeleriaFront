import { Component, Input, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { PaginatorService } from '../services/paginator/paginator.service';
import { Paginator } from '../interfaces/paginator.interface';

@Component({
    selector: 'app-paginator',
    templateUrl: './paginator.component.html',
    styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit {

    paginator!: Paginator;
    @Input() count!: number;
    @Input() pageSize!: number;

    constructor(
        private readonly paginatorService: PaginatorService,
    ) { }

    ngOnInit(): void {
        this.paginatorService.paginator$.subscribe((paginator: Paginator) => {
            this.paginator = paginator;
        });
    }

    changePage(event: PageEvent) {
        this.paginatorService.updatePaginator(event);
    }

}
