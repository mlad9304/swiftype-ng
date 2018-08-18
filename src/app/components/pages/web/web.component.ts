import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-web',
  templateUrl: './web.component.html',
  styleUrls: ['./web.component.css']
})
export class WebComponent implements OnInit {

  constructor(
    private sharedService:SharedService
  ) { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.sharedService.recallChangedQueryEmitter();
  }

}
