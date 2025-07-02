import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { map, Observable, of, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth/auth.service';
import { Session } from '../../interfaces/session.interface';
import { LocalStorageService } from '../../services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate, CanLoad {
  constructor(
    private auth: AuthService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return this.auth.userStatus().pipe(
        map(resp => {
          if((resp as any).error) {
            return of(false);
          }
          return of(true);
        }),
        tap((isLoggedin: any) => {
          if (!isLoggedin) {
            this.router.navigateByUrl('/auth');
          }
          return isLoggedin
        }),
      );
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
      return this.auth.userStatus().pipe(
        map(resp => {
          if((resp as any).error) {
            return of(false);
          }
          this.localStorageService.setItem({key: 'user', value: {email: (<Session>resp).email, id: (<Session>resp).id, role: (<Session>resp).role}});
          this.localStorageService.setItem({key: 'token', value: (<Session>resp).token});
          return of(true);
        }),
        tap((isLoggedin: any) => {
          if (!isLoggedin) {
            this.router.navigateByUrl('/auth');
          }
          return isLoggedin
        }),
      );
    }
}
