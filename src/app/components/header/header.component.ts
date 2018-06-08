import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  routeLinks: any[];
  activeLinkIndex = 0;

  constructor() {

    this.routeLinks = [
      {
        label: 'Web',
        link: './',
        index: 0
      },
      {
        label: 'Images',
        link: './',
        index: 1
      }
    ];

  }

  ngOnInit() {
  }

}
