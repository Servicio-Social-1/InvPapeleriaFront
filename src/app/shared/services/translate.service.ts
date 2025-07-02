import { Injectable } from '@angular/core';
import * as traductions from '../utils/traductions/es.json';

@Injectable({
    providedIn: 'root'
})
export class TranslateService {

    constructor() { }

    traductions = { ...traductions };

}
