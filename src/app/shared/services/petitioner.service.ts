import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PetitionerForm } from '../interfaces/petitioners-form-list.interface';
import { Petitioner } from '../interfaces/petitioner.interface';

@Injectable({
    providedIn: 'root'
})
export class PetitionerService {

    private readonly baseUrl = environment.baseUrl


    constructor(
        private http: HttpClient
    ) { }

    getPetitionersByAreaId(areaID: number) {
        return this.http.get<PetitionerForm[]>(`${this.baseUrl}/petitioner/${areaID}`);
    }

    getPetitionerById(id: number) {
        return this.http.get<Petitioner>(`${this.baseUrl}/petitioner/byid/${id}`);
    }
}
