import { Injectable } from '@angular/core';
import { Http } from '../../../node_modules/@angular/http';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AutosuggestService {

  constructor(
    private http: Http
  ) { }

  getAutoSuggest(query: string) {
    let headers = new Headers();

    headers.append('Ocp-Apim-Subscription-Key', environment.BING_AUTOSUGGEST_API_KEY);
    return this.http.get(`${environment.BING_AUTOSUGGEST_API_URL}?q=${query}`).map(res => res.json())
  }
}
