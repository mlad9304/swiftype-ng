import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  query: string;

  constructor(
    private sharedService: SharedService
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
    
  }

}
