import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(
    private http: Http
  ) { }

  search(query, from, size, categorySize) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.post(`${environment.SERVER_URL}/wiki/_search`, {
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
                "fields" : ["text"],
                "query" : query
            }
          },
        }
      }
    }).map(res => res.json());
  }

  searchWithAggsAndFacets(query, from, size, categorySize, facets) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.post(`${environment.SERVER_URL}/wiki/_search`, {
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
                "fields" : ["text"],
                "query" : query
            }
          },
          "filter":{
            "terms":{
                "categories.keyword": facets
            }
          }
        }
      }
    }).map(res => res.json());
  }

  searchWithFacets(query, from, size, facets) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.post(`${environment.SERVER_URL}/wiki/_search`, {
      "from": from,
      "size": size,
      "query": {
        "bool" : {
          "must" : {
            "query_string" : {
                "fields" : ["text"],
                "query" : query
            }
          },
          "filter":{
            "terms":{
              "categories.keyword": facets
            }
          }
        }
      }
    }).map(res => res.json());
  }

  searchMySaves(user, from, size, categorySize) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.post(`${environment.SERVER_URL}/saveddoc/_search`, {
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
            "match": {
              "user": user
            }
          },
        }
      }
    }).map(res => res.json());
  }

  searchMySavesWithFacets(user, from, size, facets) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.post(`${environment.SERVER_URL}/saveddoc/_search`, {
      "from": from,
      "size": size,
      "query": {
        "bool" : {
          "must" : {
            "match": {
              "user": user
            }
          },
          "filter":{
            "terms":{
              "categories.keyword": facets
            }
          }
        }
      }
    }).map(res => res.json());
  }

  searchSavedSearches(user, from, size) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.post(`${environment.SERVER_URL}/savedsearch/_search`, {
      "from": from,
      "size": size,
      "query": {
        "bool":{
          "must": {
            "match": {
              "user": user
            }
          },
        }
      }
    }).map(res => res.json());
  }

  saveSearches(user, date, query, categories, isMultiFacetSelect) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.post(`${environment.SERVER_URL}/savedsearch/_doc`, {
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

    return this.http.delete(`${environment.SERVER_URL}/savedsearch/_doc/${id}`)
      .map(res => res.json());
  }

  saveResult(user, date, categories, title, text) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.post(`${environment.SERVER_URL}/saveddoc/_doc`, {
      "user": user,
      "date_created": date,
      "categories": categories,
      "title": title,
      "text": text
    }).map(res => res.json());
  }

  removeResult(id) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.delete(`${environment.SERVER_URL}/saveddoc/_doc/${id}`)
      .map(res => res.json());
  }
}
