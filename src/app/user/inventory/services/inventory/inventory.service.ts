import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateArticleDto } from 'src/app/shared/dto/create-article.dto';
import { UpdateArticleDto } from 'src/app/shared/dto/update-article-dto';
import { Article } from 'src/app/shared/interfaces/article.interface';
import { environment } from '../../../../../environments/environment';
import { map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class InventoryService {

    private readonly baseUrl = environment.baseUrl

    constructor(
        private http: HttpClient
    ) { }

    getArticles({ limit, offset }: { limit: number, offset: number }) {
        return this.http.get<Article[]>(`${this.baseUrl}/articles?limit=${limit}&offset=${offset}`);
    }

    findByIdOrDescription({ term, limit = 20, offset = 0 }: { term: string | number, limit?: number, offset?: number }) {
        return this.http.get<Article[] | Article>(`${this.baseUrl}/articles/${term}?limit=${limit}&offset=${offset}`);
    }

    getCount() {
        return this.http.get<number>(`${this.baseUrl}/articles/count`);
    }

    update(id: number, updateArticleDto: UpdateArticleDto) {
        return this.http.patch<string>(`${this.baseUrl}/articles/${id}`, { ...updateArticleDto });
    }

    createArticle(createArticleDto: CreateArticleDto) {
        return this.http.post<Article>(`${this.baseUrl}/articles`, { ...createArticleDto });
    }

    delete(id: number) {
        return this.http.delete<string>(`${this.baseUrl}/articles/${id}`);
    }

    getReport(type: 'entry' | 'exit' | 'inventory', id?: number) {
        return this.http.get<any>(`${this.baseUrl}/pdf-generator?type=${type}${ id ? '&id='+ id : ''}`, {
            headers: {
                'Content-Type': 'application/pdf',
            },
            responseType: 'arraybuffer' as any
        }).pipe(
            map((res) => {
                return new Blob([res], { type: 'application/pdf' });
            }),
        );
    }
}
