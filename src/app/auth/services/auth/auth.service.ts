import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Session } from 'src/app/shared/interfaces/session.interface';
import { ErrorResponse } from 'src/app/shared/interfaces/error-response.interface';
import { catchError, map, of } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private baseUrl = environment.baseUrl;

    constructor(
        private http: HttpClient,
    ) { }

    login(form: FormData) {
        return this.http.post<Session | ErrorResponse>(`${this.baseUrl}/auth/login`, form);
    }

    register(form: FormData) {
        return this.http.post<Session | ErrorResponse>(`${this.baseUrl}/auth/register`, form);
    }

    userStatus() {
        return this.http.get<Session | ErrorResponse>(`${this.baseUrl}/auth/check-user-status`).pipe(
            catchError((err) => of(false)),
            map(session => {
                if(!session){
                    return false
                }
                return true;
            }),
        );
    }

    adminStatus() {
        return this.http.get<Session | ErrorResponse>(`${this.baseUrl}/auth/check-admin-status`).pipe(
            catchError((err) => of(false)),
            map(session => {
                if(!session){
                    return false
                }
                return true;
            }),
        );
    }

    loggedIn(token: string) {
        return this.http.post<{
            id: number,
            iat: number,
            exp: number
        }>(`${this.baseUrl}/auth/logged-in`, {token});
    }

}
