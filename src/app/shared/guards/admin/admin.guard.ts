import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth/auth.service';
import { Session } from '../../interfaces/session.interface';
import { LocalStorageService } from '../../services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate, CanLoad {


  constructor(
    private auth: AuthService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return this.auth.adminStatus().pipe(
        catchError((err) => of(false)),
        map(session => {
          if(!session){
              this.router.navigateByUrl('/auth');
              return false
          }
          return true;
      }),
    )
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
      return this.auth.adminStatus().pipe(
      catchError((err) => of(false)),
      map(session => {
          if(!session){
              this.router.navigateByUrl('/auth');
              return false
          }
          return true;
      }),
    )
  }
}
