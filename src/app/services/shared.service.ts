import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  @Output() changedQuery: EventEmitter<string> = new EventEmitter();
  @Output() changedCategories: EventEmitter<any[]> = new EventEmitter();

  constructor() { 
    
  }

  setQuery(query) {
    this.changedQuery.emit(query);
  }

  setCategories(categories) {
    this.changedCategories.emit(categories);
  }
}
