import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AutosuggestService {

  constructor(
    private http: Http
  ) { }

  getData(query: string) {
    let headers = new Headers();

    headers.append('Ocp-Apim-Subscription-Key', environment.BING_AUTOSUGGEST_API_KEY);
    return this.http.get(`${environment.BING_AUTOSUGGEST_API_URL}?q=${query}`, { headers: headers}).map(res => res.json())
  }
}
