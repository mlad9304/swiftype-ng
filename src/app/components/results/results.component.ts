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

  isFacetFilter = false;
  selectedFacets: string[] = [];

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

      this.isFacetFilter = isFacetFilter;
      this.selectedFacets = [selectedFacetValue];
      this.from = 0;

      if(this.isFacetFilter) {
        this.searchService.searchWithFacets(this.query, this.from, this.size, this.categorySize, [selectedFacetValue]).subscribe(data => {
          this.searchHandler2(data);
        });
      } else {
        this.search(false);
      }
    });

    this.sharedService.selectMultiFacets.subscribe(facets => {
      const { selectedMultiFacets } = facets;

      this.selectedFacets = selectedMultiFacets;
      this.from = 0;

      if(selectedMultiFacets.length === 0) {
        this.isFacetFilter = false;
        this.search(false);
      } else {
        this.isFacetFilter = true;
        this.searchService.searchWithFacets(this.query, this.from, this.size, this.categorySize, selectedMultiFacets).subscribe(data => {
          this.searchHandler2(data);
        });
      }
    });
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

  searchHandler2(searchResult) {
    const { hits, total } = searchResult.hits;

    this.hits = hits;
    this.total = total;
    this.isNotEmptyRecords = this.total > 0;
    this.page_row_count_summary = `${this.from + 1}-${this.from + this.hits.length}`;
    this.isInvalidPrevPage = this.from <= 0;
    this.isInvalidNextPage = (this.from + this.hits.length) >= this.total;
  }

  prevPage() {
    this.from -= this.size;
    this.search(false);
  }

  nextPage() {
    this.from += this.size;
    this.search(false);
  }

}
