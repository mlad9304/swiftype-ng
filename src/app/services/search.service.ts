import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';

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

    return this.http.post('https://19d7d779f8a502497d7eed2a5d035771.ap-southeast-2.aws.found.io:9243/wiki/_search', {
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
}
