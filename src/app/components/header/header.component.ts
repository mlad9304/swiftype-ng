import { Component, OnInit, HostListener } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  routeLinks: any[];
  activeLinkIndex;

  constructor(
    private sharedService: SharedService,
    private authService: AuthService
  ) {

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

    this.activeLinkIndex = 0;

  }

  @HostListener('input', ['$event'])
  input(e) {
    this.sharedService.setQuery(e.target.value);
  }

  ngOnInit() {
  }

}
