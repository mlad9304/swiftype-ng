import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { SearchService } from '../../services/search.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  isLogged: boolean = false;
  isMySaves: boolean = false;
  isMySavedSearches: boolean = false;
  isSaved: boolean = false;
  isSavedSearches: boolean = false;

  query: string = "";

  from: number = 0;
  size: number = 12;
  categorySize: number = 5;

  from_savedsearches: number = 0;
  size_savedsearches: number = 12;

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
    private authService: AuthService,
  ) { }

  ngOnInit() {

    this.authService.getProfile((err, profile) => {
      if(profile)
        this.isLogged = true;
    });

    this.authService.logout.subscribe(data => {
      this.isLogged = false;
    });

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

    this.sharedService.goto.subscribe(index => {
      this.from = 0;
      this.isFacetFilter = false;
      this.selectedFacets = [];
      this.isSavedSearches = false;

      this.from_savedsearches = 0;

      if(index === 2) { // Saved Results
        this.isMySaves = true;
      } else {
        this.isMySaves = false;
      }

      if(index === 3) { // Saved Searches
        this.isMySavedSearches = true;
        this.searchSavedSearches();
        return;
      } else {
        this.isMySavedSearches = false;
      }

      this.search();

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

  searchSavedSearches() {

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
