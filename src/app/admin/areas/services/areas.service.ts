import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AreaDto } from 'src/app/shared/dto/admin.dto';
import { Area } from 'src/app/shared/interfaces/departure-ticket.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AreasService {
  private readonly baseUrl = environment.baseUrl

  constructor(
      private http: HttpClient
  ) { }

  getAreas() {
      return this.http.get<Area[]>(`${this.baseUrl}/area`);
  }

  createArea(createAreaDto: AreaDto) {
      return this.http.post<Area>(`${this.baseUrl}/area`, { ...createAreaDto });
  }

  updateArea(id: number, updateAreaDto: AreaDto) {
      return this.http.patch<{ message: string }>(`${this.baseUrl}/area/${id}`, { ...updateAreaDto });
  }

  deleteArea(id: number) {
      return this.http.delete<{ message: string }>(`${this.baseUrl}/area/${id}`);
  }
}
