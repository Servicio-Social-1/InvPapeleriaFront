import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EmailValidatorService implements AsyncValidator {

    emailPattern: RegExp = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;


    constructor(
        private http: HttpClient
    ) { }

    validate(control: AbstractControl): Observable<ValidationErrors | null> {
        const email = control.value;
        // return this.http.get<any[]>(`http://localhost:3000/usuarios?q=${email}`).pipe(
        //   delay(2500),
        //   map(resp => {
        //     return (resp.length === 0) ? null : { takenEmail: true }
        //   })
        // )
        return of(null)
    }
}
