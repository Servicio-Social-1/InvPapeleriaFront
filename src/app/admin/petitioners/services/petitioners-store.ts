import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Petitioner } from '../../../shared/interfaces/petitioner.interface';
import { PetitionerToTable } from '../../../shared/interfaces/admin-to-table';

@Injectable({
    providedIn: 'root'
})
export class PetitionersStore {
    private displayedPetitioners = new BehaviorSubject<PetitionerToTable[]>([]);
    displayedPetitioners$ = this.displayedPetitioners.asObservable();

    private newPetitioner = new Subject<PetitionerToTable>();
    newPetitioner$ = this.newPetitioner.asObservable();

    private updatedPetitioner = new Subject<PetitionerToTable>();
    updatedPetitioner$ = this.updatedPetitioner.asObservable();

    updateDisplayedPetitioners(petitioners: PetitionerToTable[]) {
        this.displayedPetitioners.next(petitioners);
    }

    emitNewPetitioner(petitioners: PetitionerToTable) {
        this.newPetitioner.next(petitioners);
    }

    updatePetitioner(petitioners: PetitionerToTable) {
        this.updatedPetitioner.next(petitioners);
    }
}
