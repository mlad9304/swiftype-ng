import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { SearchService } from '../../services/search.service';
import { AuthService } from '../../services/auth.service';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  isLogged: boolean = false;
  user: string = "";

  isMySaves: boolean = false;
  isMySavedSearches: boolean = false;
  isSaved: boolean = false;
  isSavedSearches: boolean = false;

  query: string = "";

  from: number = 0;
  size: number = 12;
  categorySize: number = 5;

  hits: any[] = [];
  total: number = 0;
  isNotEmptyRecords: boolean = false;
  page_row_count_summary: string = "";
  isInvalidPrevPage: boolean = false;
  isInvalidNextPage: boolean = false;

  isFacetFilter = false;
  selectedFacets: string[] = [];
  isMultiFacetSelect = false;

  from_savedsearches: number = 0;
  size_savedsearches: number = 12;

  hits_savedsearches: any[] = [];
  total_savedsearches: number = 0;
  isNotEmptyRecords_savedsearches: boolean = false;
  page_row_count_summary_savedsearches: string = "";
  isInvalidPrevPage_savedsearches: boolean = false;
  isInvalidNextPage_savedsearches: boolean = false;


  constructor(
    private sharedService: SharedService,
    private searchService: SearchService,
    private authService: AuthService,
  ) { }

  ngOnInit() {

    this.authService.getProfile((err, profile) => {
      if(profile) {
        this.isLogged = true;
        this.user = profile.sub.substr(6);
      }
    });

    this.authService.logout.subscribe(data => {
      this.isLogged = false;
    });

    this.sharedService.changedQuery.subscribe(query => {
      this.query = query;

      this.from = 0;
      this.isFacetFilter = false;
      this.selectedFacets = [];
      this.isSavedSearches = false;
      this.isMySaves = false;
      this.isMySavedSearches = false;

      this.search();
    });

    this.sharedService.selectSingleFacet.subscribe(facet => {
      const { isFacetFilter, selectedFacetValue } = facet;

      this.isFacetFilter = isFacetFilter;
      this.selectedFacets = [selectedFacetValue];
      this.from = 0;

      this.isMultiFacetSelect = false;

      this.search(false);
    });

    this.sharedService.selectMultiFacets.subscribe(facets => {
      const { selectedMultiFacets } = facets;

      this.selectedFacets = selectedMultiFacets;
      this.from = 0;

      if(selectedMultiFacets.length === 0)
        this.isFacetFilter = false;
      else
        this.isFacetFilter = true;

      this.isMultiFacetSelect = true;

      this.search(false);
    });

    this.sharedService.goto.subscribe(index => {
      this.from = 0;
      this.isFacetFilter = false;
      this.selectedFacets = [];
      this.isSavedSearches = false;

      this.from_savedsearches = 0;

      if(index === 2) { // Saved Searches
        this.isMySavedSearches = true;
        this.searchSavedSearches();
        return;
      } else {
        this.isMySavedSearches = false;
      }

      if(index === 3) { // Saved Results
        this.isMySaves = true;
      } else {
        this.isMySaves = false;
      }

      this.search();

    });
  }

  search(isReplaceReturnedFacets=true, callback=null) {

    if(this.isMySaves) {
      if(this.isFacetFilter) {
        this.searchService.searchMySavesWithFacets(this.user, this.from, this.size, this.selectedFacets).subscribe(data => {
          this.searchHandler2(data);
        });
      } else {
        this.searchService.searchMySaves(this.user, this.from, this.size, this.categorySize).subscribe(data => {
          this.searchHandler(data, isReplaceReturnedFacets, callback);
        });
      }
      
    } else {

      console.log(this.query);
      if(this.query === '')
        return;

      if(this.isFacetFilter) {
        this.searchService.searchWithFacets(this.query, this.from, this.size, this.selectedFacets).subscribe(data => {
          this.searchHandler2(data);            
        });
      } else {
        this.searchService.search(this.query, this.from, this.size, this.categorySize).subscribe(data => {
          this.searchHandler(data, isReplaceReturnedFacets, callback);
        });
      }
      
    }
    
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
    this.searchService.searchSavedSearches(this.user, this.from_savedsearches, this.size_savedsearches).subscribe(data => {
      const { hits, total } = data.hits;

      this.hits_savedsearches = hits;
      this.total_savedsearches = total;

      this.isNotEmptyRecords_savedsearches = this.total_savedsearches > 0;
      this.page_row_count_summary_savedsearches = (this.from_savedsearches + 1) + '-' + (this.from_savedsearches + this.hits_savedsearches.length);
      this.isInvalidPrevPage_savedsearches = this.from_savedsearches <= 0;
      this.isInvalidNextPage_savedsearches = (this.from_savedsearches + this.hits_savedsearches.length) >= this.total_savedsearches;
    });
  }

  prevPage() {
    this.from -= this.size;
    this.search(false);
  }

  nextPage() {
    this.from += this.size;
    this.search(false);
  }

  prevPageSavedsearches() {
    this.from_savedsearches -= this.size_savedsearches;
    this.searchSavedSearches();
  }
  nextPageSavedsearches() {
    this.from_savedsearches += this.size_savedsearches;
    this.searchSavedSearches();
  }

  onSaveSearches() {
    this.searchService.saveSearches(this.user, new Date().toJSON(), this.query, this.selectedFacets, this.isMultiFacetSelect).subscribe(data => {
      this.isSavedSearches = true;
    });
  }

  viewSearches(item) {

    this.query = item._source.query;
    this.sharedService.setQueryEmitter(this.query);
    this.isMultiFacetSelect = item._source.is_multi_facet_select;

    this.from = 0;
    this.isFacetFilter = item._source.categories.length === 0 ? false : true;
    this.isSavedSearches = false;
    this.selectedFacets = item._source.categories;

    this.sharedService.setNavIndexEmitter(0); // Web

    this.isMySaves = false;
    this.isMySavedSearches = false;

    this.searchService.searchWithAggsAndFacets(this.query, this.from, this.size, this.categorySize, this.selectedFacets).subscribe(data => {
      this.searchHandler(data, true, () => {
        if(this.isMultiFacetSelect) {
          setTimeout(() => {
            $("div.facet-container").find(".facet-option").removeClass('selected');
          }, 100);
          
          this.sharedService.setMultiFacetsDataEmitter(this.selectedFacets);
        }
        else {
          if(this.isFacetFilter) {

            const { category: categoryData } = data.aggregations;
            const { buckets: categories } = categoryData;
            let selectedFacetValue = item._source.categories[0];

            let i;
            for(i=0; i<categories.length; i++) {
                if(categories[i].key == selectedFacetValue)
                    break;
            }
            
            setTimeout(() => {
                $("div.facet-container").find(".facet-option").removeClass('selected');
                $('div.facet-container:first .facet-option').eq(i+1).addClass('selected');
            }, 100);
          }
        }
      });
    })
  }

  removeSearches = (item) => {

    this.searchService.removeSearches(item._id).subscribe(data => {
      for(let i=0; i<this.hits_savedsearches.length; i++) {
        if(data._id === this.hits_savedsearches[i]._id) {
            this.hits_savedsearches.splice(i, 1);
            break;
        }
      }
    })

  }

}
