import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from '../../../shared/interfaces/departure-ticket.interface';
import { CreateUserDto, UpdateUserDto } from '../../../shared/dto/admin.dto';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private readonly baseUrl = environment.baseUrl

    constructor(
        private http: HttpClient
    ) { }

    getUsers({ limit, offset }: { limit: number, offset: number }) {
        return this.http.get<User[]>(`${this.baseUrl}/user?limit=${limit}&offset=${offset}`);
    }

    findByArticleName(term: string, { limit, offset }: { limit: number, offset: number }) {
        return this.http.get<User[]>(`${this.baseUrl}/user/${term}?limit=${limit}&offset=${offset}`);
    }

    findById(id: number) {
        return this.http.get<User>(`${this.baseUrl}/user/byid/${id}`);
    }

    getCount() {
        return this.http.get<number>(`${this.baseUrl}/user/count`);
    }

    createUser(createUserDto: CreateUserDto) {
        return this.http.post<User>(`${this.baseUrl}/auth/register`, { ...createUserDto });
    }

    updateUser(id: number, updateUserDto: UpdateUserDto) {
        return this.http.patch<{ message: string }>(`${this.baseUrl}/user/${id}`, { ...updateUserDto });
    }

    deleteUser(id: number) {
        return this.http.delete<{ message: string }>(`${this.baseUrl}/user/${id}`);
    }
}
