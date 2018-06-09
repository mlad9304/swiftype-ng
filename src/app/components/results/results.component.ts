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
    })
  }

  search() {
    this.searchService.search(this.query, this.from, this.size, this.categorySize).subscribe(data => {
      
      const { category: categoryData, index } = data.aggregations;
      const { buckets: categories } = categoryData;
      const { hits, total } = data.hits;

      this.hits = hits;
      this.total = total;
      this.isNotEmptyRecords = this.total > 0;
      this.page_row_count_summary = `${this.from + 1}-${this.from + this.hits.length}`;
      this.isInvalidPrevPage = this.from <= 0;
      this.isInvalidNextPage = (this.from + this.hits.length) >= this.total;
    });
  }

  prevPage() {
    this.from -= this.size;

    ////////
    this.search();
  }

  nextPage() {
    this.from += this.size;

    ////////
    this.search();
  }

}
