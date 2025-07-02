import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Petitioner } from '../../../shared/interfaces/petitioner.interface';
import { PetitionerDto } from '../../../shared/interfaces/admin.dtos';

@Injectable({
    providedIn: 'root'
})
export class PetitionersService {
    private readonly baseUrl = environment.baseUrl

    constructor(
        private http: HttpClient
    ) { }

    getPetitioners() {
        return this.http.get<Petitioner[]>(`${this.baseUrl}/petitioner`);
    }

    getPetitionerById(id: number) {
        return this.http.get<Petitioner>(`${this.baseUrl}/petitioner/byid/${id}`);
    }

    createPetitioner(createPetitionerDto: PetitionerDto) {
        return this.http.post<Petitioner>(`${this.baseUrl}/petitioner`, { ...createPetitionerDto });
    }

    updatePetitioner(id: number, updatePetitioner: PetitionerDto) {
        return this.http.patch<{ message: string }>(`${this.baseUrl}/petitioner/${id}`, { ...updatePetitioner });
    }

    deletePetitioner(id: number) {
        return this.http.delete<{ message: string }>(`${this.baseUrl}/petitioner/${id}`);
    }
}
