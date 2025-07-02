import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Article } from 'src/app/shared/interfaces/article.interface';

@Injectable({
  providedIn: 'root'
})
export class InventoryStore {

  private displayedArticles = new BehaviorSubject<Article[]>([]);
  displayedArticles$ = this.displayedArticles.asObservable();

  private newArticle = new Subject<Article>();
  newArticle$ = this.newArticle.asObservable();

  private updatedArticle = new Subject<Article>();
  updatedArticle$ = this.updatedArticle.asObservable();

  updateDislayedArticles(articles: Article[]) {
      this.displayedArticles.next(articles);
  }

  emitNewArticle(article: Article) {
      this.newArticle.next(article);
  }

  updateArticle(article: Article) {
    this.updatedArticle.next(article);
  }
}
