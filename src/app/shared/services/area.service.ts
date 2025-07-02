import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Area } from '../interfaces/area.interface';

@Injectable({
    providedIn: 'root'
})
export class AreaService {

    private readonly baseUrl = environment.baseUrl


    constructor(
        private http: HttpClient
    ) { }

    getAreas() {
        return this.http.get<Area[]>(`${this.baseUrl}/area`);
    }

}
