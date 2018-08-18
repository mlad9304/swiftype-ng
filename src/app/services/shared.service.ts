import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  @Output() changedQuery: EventEmitter<string> = new EventEmitter();
  @Output() recallChangedQuery: EventEmitter<string> = new EventEmitter();
  @Output() setQuery: EventEmitter<string> = new EventEmitter();
  @Output() changedFacets: EventEmitter<any[]> = new EventEmitter();
  @Output() setGoogleFacets: EventEmitter<any[]> = new EventEmitter();
  @Output() selectSingleFacet: EventEmitter<any> = new EventEmitter();
  @Output() selectMultiFacets: EventEmitter<any> = new EventEmitter();
  @Output() selectGoogleFacet: EventEmitter<any> = new EventEmitter();
  @Output() setMultiFacetsData: EventEmitter<any> = new EventEmitter();
  @Output() goto: EventEmitter<number> = new EventEmitter();
  @Output() setNavIndex: EventEmitter<number> = new EventEmitter();

  constructor() { 
    
  }

  changedQueryEmitter(query) {
    this.changedQuery.emit(query);
  }

  recallChangedQueryEmitter() {
    this.recallChangedQuery.emit();
  }

  setQueryEmitter(query) {
    this.setQuery.emit(query);
  }

  setFacets(facets) {
    this.changedFacets.emit(facets);
  }
  
  setGoogleFacetsEmitter(facets) {
    this.setGoogleFacets.emit(facets);
  }

  selectSingleFacetsEmitter(facet) {
    this.selectSingleFacet.emit(facet);
  }

  selectMultiFacetsEmitter(facets) {
    this.selectMultiFacets.emit(facets);
  }

  selectGoogleFacetEmitter(facet) {
    this.selectGoogleFacet.emit(facet);
  }

  setMultiFacetsDataEmitter(facets) {
    this.setMultiFacetsData.emit(facets);
  }

  gotoEmitter(index) {
    this.goto.emit(index);
  }

  setNavIndexEmitter(index) {
    this.setNavIndex.emit(index);
  }
}
