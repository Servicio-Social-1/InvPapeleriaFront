import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router, ActivatedRouteSnapshot, RouterStateSnapshot, Route, UrlSegment } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth/auth.service';
import { Session } from '../../interfaces/session.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminOrUserGuard implements CanActivate, CanLoad {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.auth.userStatus().pipe(
      catchError(() => of(false)),
      map((session: any) => {
        console.log('AdminOrUserGuard session:', session); // <-- Log para depuración
        if (!session || !session.role || (session.role.name !== 'user' && session.role.name !== 'admin')) {
          this.router.navigateByUrl('/auth');
          return false;
        }
        return true;
      })
    );
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
    return this.auth.userStatus().pipe(
      catchError(() => of(false)),
      map((session: any) => {
        console.log('AdminOrUserGuard session:', session); // <-- Log para depuración
        if (!session || !session.role || (session.role.name !== 'user' && session.role.name !== 'admin')) {
          this.router.navigateByUrl('/auth');
          return false;
        }
        return true;
      })
    );
  }
}
