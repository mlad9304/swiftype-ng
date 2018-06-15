import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class GooglemapService {

  constructor(
    private http: Http
  ) { }

  searchOfficePos(query) {
    
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.get(`https://api.swiftype.com/api/v1/public/engines/search?q=${query}&engine_key=L_puDxsK72oVS2X_-s9E`).map(res => res.json());
  }
}
