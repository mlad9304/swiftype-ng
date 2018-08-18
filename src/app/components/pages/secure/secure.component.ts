import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-secure',
  templateUrl: './secure.component.html',
  styleUrls: ['./secure.component.css']
})
export class SecureComponent implements OnInit {

  constructor(
    private sharedService:SharedService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.sharedService.recallChangedQueryEmitter();
  }

}
