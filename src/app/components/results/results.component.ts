import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  query: string;

  constructor(
    private sharedService: SharedService,
    private searchService: SearchService,
  ) { 
    this.query = "";
  }

  ngOnInit() {
    this.sharedService.changedQuery.subscribe(query => {
      this.query = query;
      this.search();
    })
  }

  search() {
    this.searchService.search(this.query).subscribe(data => {
      console.log(data);
    });
  }

}
