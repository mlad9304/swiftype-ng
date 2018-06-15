import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  isGoogleMap: boolean = false;
  isMySavedSearches: boolean = false;

  constructor(
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.sharedService.goto.subscribe(index => {

      if(index === 1) {
        this.isGoogleMap = true;
      } else {
        this.isGoogleMap = false;
      }

      if(index === 2) { // Saved Searches
        this.isMySavedSearches = true;
      } else {
        this.isMySavedSearches = false;
      }
    });
    this.sharedService.changedQuery.subscribe(query => {
      if(this.isGoogleMap)
        return;
      this.isMySavedSearches = false;
      this.isGoogleMap = false;
    });
    this.sharedService.setNavIndex.subscribe(index => {
      this.isMySavedSearches = false;
      this.isGoogleMap = false;
    })
  }

}
