import { Component, OnInit, ViewChild } from '@angular/core';
import { ResultsComponent } from '../../results/results.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-savedresult',
  templateUrl: './savedresult.component.html',
  styleUrls: ['./savedresult.component.css']
})
export class SavedresultComponent implements OnInit {

  @ViewChild(ResultsComponent) result:ResultsComponent;

  constructor(
    private authService:AuthService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.authService.getProfile((err, profile) => {
      
      if(profile) {
        let user = profile.sub.substr(6);
        this.result.searchMySaves(user);
      }
    });
  }

}
