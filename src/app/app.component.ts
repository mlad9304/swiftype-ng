import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { SharedService } from './services/shared.service';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  showBtnFacets: boolean = false;

  gotoSubscriber;
  activateSavedSearchsFacetsSubscriber;

  constructor(
    public auth: AuthService,
    private sharedService:SharedService
  ) {
    auth.handleAuthentication();
  }

  ngOnInit() {

    this.gotoSubscriber = this.sharedService.goto.subscribe((index) => {
      if(index === 3) { // MySavedSearches
        this.showBtnFacets = false;
      } else {
        this.showBtnFacets = true;
      }
    });

    this.activateSavedSearchsFacetsSubscriber = this.sharedService.activateSavedSearchsFacets.subscribe(() => {
      this.showBtnFacets = true;
    })

    $('body').on('click', function(e) {

      if ($(".s-sidebar__trigger").is(e.target)) {
          $(".s-sidebar__trigger").toggleClass('active');
      } else {
          var element = document.getElementsByClassName("facets")[0];
          
          if(element !== undefined) {
              if(e.target !== element && !element.contains(e.target)){
                  $(".s-sidebar__trigger").removeClass('active');
              }
          }

          var element = document.getElementsByClassName("close-facets")[0];

          if(element !== undefined) {
              if(element.contains(e.target)){
                  $(".s-sidebar__trigger").removeClass('active');
              }
          }
          
      }
    });
  }

  ngOnDestroy() {
    this.gotoSubscriber.unsubscribe();
    this.activateSavedSearchsFacetsSubscriber.unsubscribe();
  }
}
