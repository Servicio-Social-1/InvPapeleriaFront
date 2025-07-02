import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { DepartureTicket, User } from '../../../shared/interfaces/departure-ticket.interface';
import { Article } from '../../../shared/interfaces/article.interface';
import { catchError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DialogMessageService } from '../../../shared/services/dialog-message.service';
import { DialogMessageComponent } from '../../../shared/components/dialog-message/dialog-message.component';
import { DialogService } from '../dialog/dialog.service';
import { Petitioner } from 'src/app/shared/interfaces/petitioner.interface';
import { Area } from 'src/app/shared/interfaces/article-exit-details.interface';

@Injectable({
    providedIn: 'root'
})
export class SearchService {

    private readonly baseUrl = environment.baseUrl

    constructor(
        private http: HttpClient,
        private dialogMessageService: DialogMessageService,
        private dialogService: DialogService
    ) { }

    searchDepartureTickets(term: string, { limit, offset }: { limit: number, offset: number }) {
        return this.http.get<DepartureTicket[]>(`${this.baseUrl}/article-exit/${term}?limit=${limit}&offset=${offset}`)
        .pipe(tap((departureTickets) => {
            if(!departureTickets.length) {
                this.dialogMessageService.setMessage('No se encontraron resultados');
                this.dialogService.openDialog({
                    component: DialogMessageComponent, data: {
                        isConfirmMessage: false,
                    }
                });
            }
            return []
        }));
    }

    searchArticles(term: string, { limit, offset }: { limit: number, offset: number }) {
        return this.http.get<Article[]>(`${this.baseUrl}/articles/${term}?limit=${limit}&offset=${offset}`).pipe(
            tap((departureTickets) => {
            if(!departureTickets.length) {
                this.dialogMessageService.setMessage('No se encontraron resultados');
                this.dialogService.openDialog({
                    component: DialogMessageComponent, data: {
                        isConfirmMessage: false,
                    }
                });
            }
            return []
        }),
            catchError((err) => {
                this.dialogMessageService.setMessage(err.error.message);
                this.dialogService.openDialog({
                    component: DialogMessageComponent, data: {
                        isConfirmMessage: false,
                    }
                });
                return []
            })
        );
    }

  searchPetitioners(term: string, { limit, offset }: { limit: number, offset: number }) {
    return this.http.get<Petitioner[]>(`${this.baseUrl}/petitioner/search/${term}?limit=${limit}&offset=${offset}`)
    .pipe(tap((petitioners) => {
        if(!petitioners.length) {
            this.dialogMessageService.setMessage('No se encontraron resultados');
            this.dialogService.openDialog({
                component: DialogMessageComponent, data: {
                    isConfirmMessage: false,
                }
            });
        }
        return []
    }));
  }

  searchAreas(term: string, { limit, offset }: { limit: number, offset: number }) {
    return this.http.get<Area[]>(`${this.baseUrl}/area/search/${term}?limit=${limit}&offset=${offset}`)
    .pipe(tap((areas) => {
        if(!areas.length) {
            this.dialogMessageService.setMessage('No se encontraron resultados');
            this.dialogService.openDialog({
                component: DialogMessageComponent, data: {
                    isConfirmMessage: false,
                }
            });
        }
        return []
    }));
  }

  searchUsers(term: string, { limit, offset }: { limit: number, offset: number }) {
    return this.http.get<User[]>(`${this.baseUrl}/user/search/${term}?limit=${limit}&offset=${offset}`)
    .pipe(tap((users) => {
        if(!users.length) {
            this.dialogMessageService.setMessage('No se encontraron resultados');
            this.dialogService.openDialog({
                component: DialogMessageComponent, data: {
                    isConfirmMessage: false,
                }
            });
        }
        return []
    }));
  }
}
