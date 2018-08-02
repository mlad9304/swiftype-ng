import { Component, OnInit, HostListener } from '@angular/core';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-searchinput',
  templateUrl: './searchinput.component.html',
  styleUrls: ['./searchinput.component.css']
})
export class SearchinputComponent implements OnInit {

  query: string = "";

  constructor(
    private sharedService: SharedService
  ) { }

  ngOnInit() {

    this.sharedService.setQuery.subscribe(query => {
      this.query = query;
    });
    
  }

  @HostListener('input', ['$event'])
  input(e) {
    this.query = e.target.value;
    this.sharedService.changedQueryEmitter(this.query);
  }

}
