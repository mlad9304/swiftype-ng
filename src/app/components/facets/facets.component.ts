import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-facets',
  templateUrl: './facets.component.html',
  styleUrls: ['./facets.component.css']
})
export class FacetsComponent implements OnInit {

  categories: any[] = [];

  constructor() { }

  ngOnInit() {
  }

}
