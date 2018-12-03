import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';

import { environment } from '../../environments/environment';

declare var jquery: any;
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(
    private http: Http
  ) { }

  searchSwiftype(query, page, per_page) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    
    return this.http.get(`${environment.SEARCH_SERVER_URL}?query=${query}&page=${page}&per_page=${per_page}`).map(res => res.json());
  }
  searchSwiftypeWithFacets(query, page, per_page, facets) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    var params = {
      query,    
      page,
      per_page,
      facets
    };
    return this.http.post(`${environment.SEARCH_SERVER_URL}/facets`, params).map(res => res.json());
  }

  searchMySaves(user, from, size, categorySize) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.post(`${environment.SEARCH_MY_SAVES}`, {
      from,
      size,
      categorySize,
      user
    }).map(res => res.json());
  }

  searchMySavesWithFacets(user, from, size, facets) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.post(`${environment.SEARCH_MY_SAVES}/facets`, {
      from,
      size,
      user,
      facets
    }).map(res => res.json());
  }

  searchSavedSearches(user, from, size) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.post(`${environment.SEARCH_MY_SEARCHES}`, {
      from,
      size,
      user
    }).map(res => res.json());
  }

  searchSecure(query, from, size, categorySize) {
    
    return this.http.post(`${environment.SEARCH_SECURE}`,{
      "from": from,
      "size": size,
      "aggs" : {
        "index" : {
          "terms" : { "field" : "_index" }
        },
        "category" : {
          "terms" : { 
              "field" : "categories.keyword", 
              "size" : categorySize
          },            
        },
      },
      "query": {
        "bool" : {
          "must" : {
            "query_string" : {
                "fields" : ["content"],
                "query" : query
            }
          },
        }
      }
    }).map(res => res.json());
  }

  saveSearches(user, date, query, categories, isMultiFacetSelect) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.post(`${environment.SAVE_MY_SEARCHES}`, {
      "user": user,
      "date_created": date,
      "query": query,
      "categories": categories,
      "is_multi_facet_select": isMultiFacetSelect
    }).map(res => res.json());
  }

  removeSearches(id) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.delete(`${environment.SERVER_URL_FOR_SAVING}/savedsearch/_doc/${id}`)
      .map(res => res.json());
  }

  saveResult(user, date, categories, title, text, url, published_at) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.post(`${environment.SERVER_URL_FOR_SAVING}/saveddoc/_doc`, {
      "user": user,
      "date_created": date,
      "categories": categories,
      "title": title,
      "text": text,
      "url": url,
      "published_at": published_at
    }).map(res => res.json());
  }

  removeResult(id) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.delete(`${environment.SERVER_URL_FOR_SAVING}/saveddoc/_doc/${id}`)
      .map(res => res.json());
  }
}
