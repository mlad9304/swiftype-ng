import { Component, OnInit, HostListener } from '@angular/core';
import { SharedService } from '../../services/shared.service';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-searchinput',
  templateUrl: './searchinput.component.html',
  styleUrls: ['./searchinput.component.css']
})
export class SearchinputComponent implements OnInit {

  query: string = "";
  activeItemIndex: number = -1;
  items: string[] = [
    'ebay',
    'espn',
    'expedia',
    'etsy',
    'ebates',
    'enterprise'
  ];
  showDropDown: boolean = false;
  queries: string[] = [];

  constructor(
    private sharedService: SharedService
  ) { }

  ngOnInit() {

    this.readQueries();

    this.sharedService.setQuery.subscribe(query => {
      this.query = query;
    });
    
  }

  readQueries() {
    let queriesStr = localStorage.getItem('queries');
    if(!queriesStr)
      this.queries = [];
    else {
      this.queries = JSON.parse(queriesStr);
    }
  }

  setQueries() {
    localStorage.setItem('queries', JSON.stringify(this.queries));
  }

  @HostListener('input', ['$event'])
  input(e) {
    this.query = e.target.value;
    this.showDropDown = true;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(e: KeyboardEvent) {
    switch(e.key) {
      case 'ArrowUp':
        this.selectPreviousItem();
        break;
      case 'ArrowDown':
        this.selectNextItem();
        break;
      case 'Enter':
        this.showDropDown = false;
        this.startSearch();
        break;
    }
  }

  selectPreviousItem() {
    let prevIndex = this.activeItemIndex - 1;
    if(prevIndex >= -1) {
      this.setActive(prevIndex);
    } else {
      this.setActive(this.items.length - 1);
    }
  }

  selectNextItem() {
    let nextIndex = this.activeItemIndex + 1;
    if(nextIndex < this.items.length) {
      this.setActive(nextIndex);
    } else {
      this.setActive(0);
    }
  }

  setActive(index) {

    this.activeItemIndex = index;
    $('.dropdown-box .dropdown-item').removeClass('active');

    if(index > -1) {      
      $($('.dropdown-box .dropdown-item')[this.activeItemIndex]).addClass('active');
      this.query = this.items[index];
    }
    
  }

  render(text) {
    let element = document.createElement("span");
    if(this.query == '' || text.indexOf(this.query) == -1) {
      element.innerHTML = text;
      return element.outerHTML;
    }

    element.innerHTML = this.query;
    let boldElement = document.createElement('b');
    boldElement.innerHTML = text.substring(text.indexOf(this.query) + this.query.length);
    element.appendChild(boldElement);

    if(this.queries.indexOf(text) > -1) {
      let element2 = document.createElement('span');
      element2.className = "remove";
      element2.innerHTML = "remove";
      element2.addEventListener('click', function() {
        console.log('aaaaaaa');
      })
      element.appendChild(element2);
    }

    return element.outerHTML;
      
  }

  inputClick() {
    if(this.query == '')
      return;

    this.showDropDown = true;
  }

  itemClick(e) {
    let index = $('.dropdown-box li').index($(e.target).parent());
    if(index > -1 && index < this.items.length) {
      this.setActive(index);
      this.showDropDown = false;
      this.startSearch();
    }
  }

  startSearch() {
    this.sharedService.changedQueryEmitter(this.query);

    if(this.queries.indexOf(this.query) == -1) {
      this.queries.push(this.query);
      this.setQueries();
    }
      
  }

}
