import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  isMySaves: boolean = false;
  isMySavedSearches: boolean = false;
  isLogged: boolean = false;

  from: number = 0;
  size: number = 12;
  categorySize: number = 5;

  query: string = "";

  hits: any[] = [];
  total: number = 0;
  isNotEmptyRecords: boolean = false;
  page_row_count_summary: string = "";
  isInvalidPrevPage: boolean = false;
  isInvalidNextPage: boolean = false;

  constructor(
    private sharedService: SharedService,
    private searchService: SearchService,
  ) { }

  ngOnInit() {
    this.sharedService.changedQuery.subscribe(query => {
      this.query = query;
      this.search();
    });

    this.sharedService.selectSingleFacet.subscribe(facet => {
      const { isFacetFilter, selectedFacetValue } = facet;
      if(isFacetFilter) {
        this.searchService.searchWithFacets(this.query, this.from, this.size, this.categorySize, [selectedFacetValue]).subscribe(data => {
          console.log(data);
          this.searchHandler(data, false, null);
        });
      }
    })
  }

  search(isReplaceReturnedFacets=true, callback=null) {

    console.log(this.query);
    if(this.query === '')
      return;

    this.searchService.search(this.query, this.from, this.size, this.categorySize).subscribe(data => {
      this.searchHandler(data, isReplaceReturnedFacets, callback);
    });
  }

  searchHandler(data, isReplaceReturnedFacets, callback) {
    const { category: categoryData, index } = data.aggregations;
    const { buckets: categories } = categoryData;
    const { hits, total } = data.hits;

    if(isReplaceReturnedFacets) {
      this.sharedService.setCategories(categories);
    }

    this.hits = hits;
    this.total = total;
    this.isNotEmptyRecords = this.total > 0;
    this.page_row_count_summary = `${this.from + 1}-${this.from + this.hits.length}`;
    this.isInvalidPrevPage = this.from <= 0;
    this.isInvalidNextPage = (this.from + this.hits.length) >= this.total;

    if(callback)
      callback();
  }

  prevPage() {
    this.from -= this.size;
    this.search(false);
  }

  nextPage() {
    this.from += this.size;
    this.search(false);
  }

  searchAndReplaceFacets() {

  }

}
