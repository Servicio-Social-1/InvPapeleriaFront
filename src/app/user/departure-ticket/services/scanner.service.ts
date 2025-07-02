import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';
import { bufferTime, filter, map, switchMap } from 'rxjs/operators';
import { Article } from 'src/app/shared/interfaces/article.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScannerService {

  private readonly baseUrl = environment.baseUrl

  constructor(
    private readonly http: HttpClient
  ) { }

  get scanner$() {
    return fromEvent<KeyboardEvent>(document, 'keydown').pipe(
      map((event: KeyboardEvent) => event.key),
      bufferTime(100),
      filter(keys => keys.some(key => key === 'Enter')),
      map((keys: string[]) => keys.filter(key => key !== 'Enter')),
      map((keys: string[]) => keys.join('')),
      filter((text: string) => this.validateBarcode(text)),
      switchMap(barcode => this.findByBarcode(barcode))
    );
  }

  findByBarcode(barcode: string) {
    return this.http.get<Article>(`${this.baseUrl}/articles/bybarcode/?barcode=${barcode}`)
  }

  validateBarcode(barcode: string) {
    // Regular expressions for different barcode standards
    const regexEAN = /^(?:\d{8}|\d{12}|\d{13})$/;
    const regexUPC = /^(?:\d{12}|\d{6})$/;
    const regexITF = /^(?:\d{14}|\d{16})$/;
    const regexCODE39 = /^[0-9A-Za-z\-\.\\$\/\+\%\s\*]+$/;
    const regexNW7 = /^[A-D][0-9\*\$\%\/\+\-\. :]$/;
    const regexCODE128 = /^[!-~]+$/;

    // Test the input string against the regular expressions
    if (regexEAN.test(barcode)) {
      return true;
    } else if (regexUPC.test(barcode)) {
      return true;
    } else if (regexITF.test(barcode)) {
      return true;
    } else if (regexCODE39.test(barcode)) {
      return true;
    } else if (regexNW7.test(barcode)) {
      return true;
    } else if (regexCODE128.test(barcode)) {
      return true;
    } else {
      return false;
    }
  }

}
