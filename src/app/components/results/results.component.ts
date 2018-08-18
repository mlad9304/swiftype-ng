import { Component, OnInit, Input } from '@angular/core';
import {MediaChange, ObservableMedia, MediaService} from '@angular/flex-layout';
import { SharedService } from '../../services/shared.service';
import { SearchService } from '../../services/search.service';
import { AuthService } from '../../services/auth.service';

import { environment } from '../../../environments/environment';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  @Input() isLogged: boolean = false;
  @Input() user: string = "";

  @Input() isMySaves: boolean = false;
  @Input() isMySavedSearches: boolean = false;
  isSaved: boolean = false;
  isSavedSearches: boolean = false;

  @Input() isSecure: boolean = false;

  query: string = "";

  from: number = 0;
  size: number = 12;
  categorySize: number = 5;

  isNotEmptyRecords: boolean = false;
  page_row_count_summary: string = "";
  isInvalidPrevPage: boolean = false;
  isInvalidNextPage: boolean = false;

  page = 1;
  per_page = 12;
  records = [];
  record_count = 0;
  num_pages = 0;
  total_result_count = 0;

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

  gridCols = 3;
  gridRowHeight = "360px"; 

  layout = environment.layout;

  m_names = ["January", "February", "March", 
    "April", "May", "June", "July", "August", "September", 
    "October", "November", "December"]; 

  changedQuerySubscriber;
  selectSingleFacetSubscriber;
  selectMultiFacetsSubscriber;


  constructor(
    private sharedService: SharedService,
    private searchService: SearchService,
    private authService: AuthService,
    private _media$: ObservableMedia,
    private mediaService: MediaService
  ) {
    this._media$.subscribe((e: MediaChange) => {
      this.responsive();
    });
  }

  ngOnInit() {

    this.changedQuerySubscriber = this.sharedService.changedQuery.subscribe(query => {
      this.query = query;

      this.page = 0;
      this.from = 0;
      this.isFacetFilter = false;
      this.selectedFacets = [];
      this.isSavedSearches = false;
      this.isMySaves = false;
      this.isMySavedSearches = false;

      if(this.isSecure)
        this.searchSecure();
      else
        this.searchSwiftype();
    });

    this.selectSingleFacetSubscriber = this.sharedService.selectSingleFacet.subscribe(facet => {
      const { isFacetFilter, selectedFacetValue } = facet;

      this.isFacetFilter = isFacetFilter;
      this.selectedFacets = [selectedFacetValue];
      this.page = 0;
      this.from = 0;

      this.isMultiFacetSelect = false;

      this.searchSwiftype(false);
    });

    this.selectMultiFacetsSubscriber = this.sharedService.selectMultiFacets.subscribe(facets => {
      const { selectedMultiFacets } = facets;

      this.selectedFacets = selectedMultiFacets;
      this.page = 0;
      this.from = 0;
      
      if(selectedMultiFacets.length === 0)
        this.isFacetFilter = false;
      else
        this.isFacetFilter = true;

      this.isMultiFacetSelect = true;

      this.searchSwiftype(false);
    });

  }

  ngOnDestroy() {
    
    this.changedQuerySubscriber.unsubscribe();
    this.selectSingleFacetSubscriber.unsubscribe();
    this.selectMultiFacetsSubscriber.unsubscribe();
  }

  private responsive() {

    const isLarge = this.mediaService.isActive('gt-md');
    if(isLarge) {
      this.gridCols = 3;
      this.gridRowHeight = "360px";
    } else {
      const isSmall = this.mediaService.isActive('lt-sm');
      if(isSmall) {
        this.gridCols = 1;
        this.gridRowHeight = "4:4.3";
      } else {
        this.gridCols = 2;
        this.gridRowHeight = "4:4.8";
      }
      
    }
  }

  searchSwiftype(isReplaceReturnedFacets=true, callback=null) {
  
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
        this.searchService.searchSwiftypeWithFacets(this.query, this.page, this.per_page, this.selectedFacets).subscribe(data => {
          this.searchHandler(data, isReplaceReturnedFacets, callback);
        });
      } else {
        this.searchService.searchSwiftype(this.query, this.page, this.per_page).subscribe(data => {
          this.searchHandler(data, isReplaceReturnedFacets, callback);
        });
      }
    }
  
  }

  searchHandler(data, isReplaceReturnedFacets, callback) {

    if(this.isMySaves) {
      const { category: categoryData, index } = data.aggregations;
      const { buckets: facets } = categoryData;
      const { hits, total } = data.hits;

      if(isReplaceReturnedFacets) {
        this.sharedService.setFacets(facets);
      }

      this.records = hits.map(record => {
        return {
          title: record._source.title,
          body: record._source.text,
          user: record._source.user,
          url: record._source.url,
          published_at: record._source.published_at,
          _id: record._id
        }
      });
      this.total_result_count = total;
      this.isNotEmptyRecords = this.total_result_count > 0 ? true : false;
      this.page_row_count_summary = `${this.from + 1}-${this.from + this.records.length}`;
      this.isInvalidPrevPage = this.from <= 0;
      this.isInvalidNextPage = (this.from + this.records.length) >= this.total_result_count;

    } else {
      const { info, records, record_count } = data;
      const { current_page: page, num_pages, per_page, total_result_count, query, facets } = info.page;
      
      this.records = records.page.map(record => {
        return {
          body: record.highlight.body,
          title: record.title,
          url: record.url,
          sections: record.sections,
          published_at: record.published_at,
        }
      });
      this.record_count = record_count;
      this.page = page;
      this.num_pages = num_pages;
      this.per_page = per_page;
      this.total_result_count = total_result_count;

      if(isReplaceReturnedFacets) {

        let shortedFacets = [];
        let i=0;
        for(let key in facets.sections) {
          if(i > environment.FACETS_SIZE)
            break;
          let newObj = {};
          newObj["key"] = key;
          newObj["doc_count"] = facets.sections[key];
          shortedFacets.push(newObj);
          i++;
        }

        this.sharedService.setFacets(shortedFacets);
      }

      this.isNotEmptyRecords = this.record_count > 0 ? true : false;
      this.page_row_count_summary = ((this.page - 1) * this.per_page + 1) + '-' + ((this.page - 1) * this.per_page + this.record_count);
      this.isInvalidPrevPage = this.page === 1 ? true : false;
      this.isInvalidNextPage = this.page === this.num_pages ? true : false;

    }

    if(callback)
      callback();
  }

  searchHandler2(searchResult) {
    const { hits, total } = searchResult.hits;

    this.records = hits.map(record => {
      return {
        title: record._source.title,
        body: record._source.text,
        user: record._source.user,
        url: record._source.url,
        published_at: record._source.published_at,
        _id: record._id
      }
    });
    this.total_result_count = total;
    this.isNotEmptyRecords = this.total_result_count > 0 ? true : false;
    this.page_row_count_summary = `${this.from + 1}-${this.from + this.records.length}`;
    this.isInvalidPrevPage = this.from <= 0;
    this.isInvalidNextPage = (this.from + this.records.length) >= this.total_result_count;
  }

  searchSavedSearches() {
    this.searchService.searchSavedSearches(this.user, this.from_savedsearches, this.size_savedsearches).subscribe(data => {
      const { hits, total } = data.hits;

      this.hits_savedsearches = hits;
      this.total_savedsearches = total;

      this.isNotEmptyRecords_savedsearches = this.total_savedsearches > 0 ? true : false;
      this.page_row_count_summary_savedsearches = (this.from_savedsearches + 1) + '-' + (this.from_savedsearches + this.hits_savedsearches.length);
      this.isInvalidPrevPage_savedsearches = this.from_savedsearches <= 0;
      this.isInvalidNextPage_savedsearches = (this.from_savedsearches + this.hits_savedsearches.length) >= this.total_savedsearches;
    });
  }

  searchSecure(isReplaceReturnedFacets = true) {

    if(this.query === '') 
      return;

    this.searchService.searchSecure(this.query, this.from, this.size, this.categorySize).subscribe(data => {

      const { hits, total } = data.hits;


      if(isReplaceReturnedFacets) {
        this.sharedService.setFacets({});
      }

      this.records = hits.map(record => {
        return {
          title: record._source.title,
          body: record._source.content,
          url: record._source.url,
          _id: record._id,
          metatages: record._source.metatages
        }
      });
      this.total_result_count = total;
      this.isNotEmptyRecords = this.total_result_count > 0 ? true : false;
      this.page_row_count_summary = `${this.from + 1}-${this.from + this.records.length}`;
      this.isInvalidPrevPage = this.from <= 0;
      this.isInvalidNextPage = (this.from + this.records.length) >= this.total_result_count;

    })
  }

  prevPage() {
    if(this.isMySaves || this.isSecure)
      this.from -= this.size;
    else
      this.page -= 1;
    
    if(this.isSecure)
      this.searchSecure(false);
    else
      this.searchSwiftype(false);
  }

  nextPage() {
    if(this.isMySaves || this.isSecure)
      this.from += this.size;
    else
      this.page += 1;
    
    if(this.isSecure)
      this.searchSecure(false);
    else
      this.searchSwiftype(false);
  }

  prevPageSavedsearches() {
    this.from_savedsearches -= this.size_savedsearches;
    this.searchSavedSearches();
  }
  nextPageSavedsearches() {
    this.from_savedsearches += this.size_savedsearches;
    this.searchSavedSearches();
  }

  viewSearches(item) {
    this.query = item._source.query;
    this.sharedService.setQueryEmitter(this.query);
    this.isMultiFacetSelect = item._source.is_multi_facet_select;

    this.from = 0;
    this.page = 1;
    this.isFacetFilter = item._source.categories.length === 0 ? false : true;
    this.isSavedSearches = false;
    this.selectedFacets = item._source.categories;

    this.sharedService.setNavIndexEmitter(0); // Web

    this.isMySaves = false;
    this.isMySavedSearches = false;

    this.searchService.searchSwiftype(this.query, this.page, this.per_page).subscribe(data => {
      this.searchHandler(data, true, () => {
        if(this.isMultiFacetSelect) {
          setTimeout(() => {
            $("div.facet-container").find(".facet-option").removeClass('selected');
          }, 100);
          
          this.sharedService.setMultiFacetsDataEmitter(this.selectedFacets);
          this.searchService.searchSwiftypeWithFacets(this.query, this.page, this.per_page, this.selectedFacets).subscribe(data => {
            this.searchHandler(data, false, null);
          })
        } else {
          if(this.isFacetFilter) {
            const categories = data.info.page.facets.sections;
            let selectedFacetValue = item._source.categories[0];

            let i = 0;
            for(let key in categories) {
              if(key === selectedFacetValue)
                break;
              i++;
            }
            
            setTimeout(() => {
                $("div.facet-container").find(".facet-option").removeClass('selected');
                $('div.facet-container:first .facet-option').eq(i+1).addClass('selected');
            }, 100);

            this.searchService.searchSwiftypeWithFacets(this.query, this.page, this.per_page, this.selectedFacets).subscribe(data => {
              this.searchHandler(data, false, null);
            })
          }
        }
      })
    })

  }

  onSaveSearches() {
    this.searchService.saveSearches(
      this.user, 
      new Date().toJSON(), 
      this.query, 
      this.selectedFacets, 
      this.isMultiFacetSelect
    ).subscribe(data => {
      this.isSavedSearches = true;
    });
  }

  removeSearches = (record) => {

    this.searchService.removeSearches(record._id).subscribe(data => {
      for(let i=0; i<this.hits_savedsearches.length; i++) {
        if(data._id === this.hits_savedsearches[i]._id) {
            this.hits_savedsearches.splice(i, 1);
            break;
        }
      }
    })

  }

  saveResult(record) {
    this.searchService.saveResult(
      this.user,
      new Date().toJSON(),
      [...record.sections],
      record.title,
      record.body,
      record.url,
      record.published_at
    ).subscribe(data => {
      record.isSaved = true;
    })
  }

  removeResult(record) {
    this.searchService.removeResult(record._id).subscribe(data => {
      for(let i=0; i<this.records.length; i++) {
        if(data._id === this.records[i]._id) {
            this.records.splice(i, 1);
            break;
        }
      }
    })
  }

  getResultType(url) {
    const regexpPDF = new RegExp(/((http(s)?(\:\/\/))+(www\.)?([\w\-\.\/])*(\.[a-zA-Z]{2,3}\/?))[^\s\b\n|]*[^.,;:\?\!\@\^\$ -](\.([pP][dD][fF]))/);
    const regexpDOC = new RegExp(/((http(s)?(\:\/\/))+(www\.)?([\w\-\.\/])*(\.[a-zA-Z]{2,3}\/?))[^\s\b\n|]*[^.,;:\?\!\@\^\$ -](\.(([dD][oO][cC][xX]?)|([xX][lL][sS][xX]?)))/);    

    if(url.match(regexpPDF))
      return 'pdf';
    if(url.match(regexpDOC))
      return 'doc';

    return 'html';
  }

  dateToString(date) {
    const d = new Date(date);

    var curr_date = d.getDate(); 
    var curr_month = d.getMonth(); 
    var curr_year = d.getFullYear(); 

    return `${curr_date} ${this.m_names[curr_month]}, ${curr_year}`;
  }

}
