import { Component, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { bufferTime, filter, map } from 'rxjs/operators';

@Component({
    selector: 'app-admin',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

    constructor(
    ) { }

    ngOnInit(): void {
    }


}
