import { Component, OnInit, ViewChild } from '@angular/core';
import { ResultsComponent } from '../../results/results.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-savedsearch',
  templateUrl: './savedsearch.component.html',
  styleUrls: ['./savedsearch.component.css']
})
export class SavedsearchComponent implements OnInit {

  @ViewChild(ResultsComponent) result:ResultsComponent;

  logoutSubscriber;

  constructor(
    private authService:AuthService
  ) { }

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    this.authService.getProfile((err, profile) => {
      
      if(profile) {
        let user = profile.sub.substr(6);
        this.result.searchSavedSearches(user);
      }
    });


    
  }

  ngOnDestroy() {
    
  }

}
