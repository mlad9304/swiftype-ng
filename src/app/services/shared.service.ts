import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  query: string;

  @Output() changedQuery: EventEmitter<string> = new EventEmitter();

  constructor() { 
    this.query = "";
  }

  setQuery(query) {
    this.query = query;
    this.changedQuery.emit(this.query);
  }
}
