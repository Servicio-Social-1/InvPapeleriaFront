import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { DepartureTicket } from '../../../shared/interfaces/departure-ticket.interface';
import { CreateArticleExitDto } from "src/app/shared/dto/create-departure-ticket.dto";
import { UpdateDepartureTicketDto } from "src/app/shared/dto/update-departure-ticket.dto";
import { map, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DepartureTicketService {

    private readonly baseUrl = environment.baseUrl

    constructor(
        private http: HttpClient
    ) { }

    getDepartureTickets({ limit, offset }: { limit: number, offset: number }) {
        return this.http.get<DepartureTicket[]>(`${this.baseUrl}/article-exit?limit=${limit}&offset=${offset}`).pipe(
            tap((d) => console.log(d)),
            map((dp) => dp.map(item => ({
                ...item,  
                date: this.getDate( new Date(item.date)), 
                time: this.getHour( new Date(item.time))
            }))),
        );
    }

    findByArticleName(term: string, { limit, offset }: { limit: number, offset: number }) {
        return this.http.get<DepartureTicket[]>(`${this.baseUrl}/article-exit/${term}?limit=${limit}&offset=${offset}`).pipe(
            map((dp) => dp.map(item => ({...item,  date: this.getDate( new Date(item.date)), time: this.getHour( new Date(item.time))})))
        );
    }

    findById(id: number) {
        return this.http.get<DepartureTicket>(`${this.baseUrl}/article-exit/byid/${id}`).pipe(
            map((item => ({...item,  date: this.getDate( new Date(item.date)), time: this.getHour( new Date(item.time))})))
        );
    }

    getCount() {
        return this.http.get<number>(`${this.baseUrl}/article-exit/count`);
    }

    createDepartureTicket(createArticleExitDto: CreateArticleExitDto) {
        return this.http.post<DepartureTicket>(`${this.baseUrl}/article-exit`, { ...createArticleExitDto }).pipe(
            map((item => ({...item,  date: this.getDate( new Date(item.date)), time: this.getHour( new Date(item.time))})))
        );
    }

    updateDepartureTicket(id: number, updateDepartureTicketDto: UpdateDepartureTicketDto) {
        return this.http.patch<DepartureTicket>(`${this.baseUrl}/article-exit/${id}`, { ...updateDepartureTicketDto }).pipe(
            map((item => ({...item,  date: this.getDate( new Date(item.date)), time: this.getHour( new Date(item.time))})))
        );
    }

    deleteDepartureTicket(id: number) {
        return this.http.delete<string>(`${this.baseUrl}/article-exit/${id}`);
    }

    getHour(date: Date) {
        const data = date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1")
        return data;
    }

    getDate(date: Date) {
        let ye = new Intl.DateTimeFormat('es', { year: 'numeric' }).format(date);
        let mo = new Intl.DateTimeFormat('es', { month: 'short' }).format(date);
        let da = new Intl.DateTimeFormat('es', { day: '2-digit' }).format(date);
        return `${da}-${mo}-${ye}`;
    }
}
