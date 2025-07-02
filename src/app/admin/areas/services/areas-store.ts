import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Area } from 'src/app/shared/interfaces/departure-ticket.interface';

@Injectable({
  providedIn: 'root'
})
export class AreasStore {
  private displayedAreas = new BehaviorSubject<Area[]>([]);
  displayedAreas$ = this.displayedAreas.asObservable();

  private newArea = new Subject<Area>();
  newArea$ = this.newArea.asObservable();

  private updatedArea = new Subject<Area>();
  updatedArea$ = this.updatedArea.asObservable();

  updateDisplayedAreas(users: Area[]) {
      this.displayedAreas.next(users);
  }

  emitNewArea(users: Area) {
      this.newArea.next(users);
  }

  updateArea(users: Area) {
      this.updatedArea.next(users);
  }
}
