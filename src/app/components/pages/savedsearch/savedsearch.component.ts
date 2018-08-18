import { Component, OnInit, ViewChild } from '@angular/core';
import { ResultsComponent } from '../../results/results.component';
import { AuthService } from '../../../services/auth.service';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-savedsearch',
  templateUrl: './savedsearch.component.html',
  styleUrls: ['./savedsearch.component.css']
})
export class SavedsearchComponent implements OnInit {

  @ViewChild(ResultsComponent) result:ResultsComponent;

  isActiveFacets: boolean = false;
  activateSavedSearchsFacetsSubscriber

  constructor(
    private authService:AuthService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.activateSavedSearchsFacetsSubscriber = this.sharedService.activateSavedSearchsFacets.subscribe(() => {
      this.isActiveFacets = true;
    })
  }

  ngOnDestroy() {
    this.activateSavedSearchsFacetsSubscriber.unsubscribe();
  }

  ngAfterViewInit() {
    this.authService.getProfile((err, profile) => {
      
      if(profile) {
        let user = profile.sub.substr(6);
        this.result.searchSavedSearches(user);
      }
    });
    
  }


}
