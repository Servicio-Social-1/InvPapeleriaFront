import { Component, OnInit } from '@angular/core';
import { PetitionerToTable } from '../../shared/interfaces/admin-to-table';
import { PetitionersService } from '../../admin/petitioners/services/petitioners.service';
import { Traduction } from '../../shared/interfaces/translate.type';
import { ErrorResponse } from '../../shared/interfaces/error-response.interface';

@Component({
  selector: 'app-user-petitioners',
  templateUrl: './petitioners.component.html',
  styleUrls: ['./petitioners.component.css']
})
export class UserPetitionersComponent implements OnInit {
  petitioners: PetitionerToTable[] = [];
  columns: Traduction[] = ['id', 'name', 'area'];
  errorMsg = '';
  isLoading = false;

  constructor(private petitionersService: PetitionersService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.petitionersService.getPetitioners().subscribe({
      next: (petitioners) => this.setTableData(petitioners),
      error: (err: ErrorResponse) => {
        this.setTableErrorData(err);
        // Mostrar el error en consola para depuración
        console.error('Error al obtener solicitantes:', err);
      }
    });
  }

  setTableData(petitioners: any[]): void {
    this.petitioners = petitioners.map((petitioner: any) => ({
      area: petitioner.area?.name,
      id: petitioner.id,
      name: petitioner.name,
      status: petitioner.status,
      options: []
    }));
    this.isLoading = false;
  }

  setTableErrorData(err: ErrorResponse): void {
    this.errorMsg = err.error.message;
    this.petitioners = [];
    this.isLoading = false;
  }
}
