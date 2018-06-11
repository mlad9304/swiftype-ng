import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  isMySavedSearches: boolean = false;

  constructor(
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.sharedService.goto.subscribe(index => {
      if(index === 2) { // Saved Searches
        this.isMySavedSearches = true;
      } else {
        this.isMySavedSearches = false;
      }
    });
    this.sharedService.changedQuery.subscribe(query => {
      this.isMySavedSearches = false;
    });
    this.sharedService.setNavIndex.subscribe(index => {
      this.isMySavedSearches = false;
    })
  }

}
