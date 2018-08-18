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

  isLogged: boolean = false;
  user: string = "";

  logoutSubscriber;

  constructor(
    private authService:AuthService
  ) { }

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    this.authService.getProfile((err, profile) => {
      
      if(profile) {
        this.isLogged = true;
        this.user = profile.sub.substr(6);
        console.log(this.user);
        this.result.searchSavedSearches();
      }
    });

    this.logoutSubscriber = this.authService.logout.subscribe(data => {
      this.isLogged = false;
    });

    
  }

  ngOnDestroy() {
    this.logoutSubscriber.unsubscribe();
  }

}
