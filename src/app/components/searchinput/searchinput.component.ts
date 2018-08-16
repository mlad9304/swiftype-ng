import { Component, OnInit, HostListener } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { AutosuggestService } from '../../services/autosuggest.service';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-searchinput',
  templateUrl: './searchinput.component.html',
  styleUrls: ['./searchinput.component.css']
})
export class SearchinputComponent implements OnInit {

  query: string = "";
  inputedQuery: string = "";
  activeItemIndex: number = -1;
  items: string[] = [];
  showDropDown: boolean = false;
  queries: string[] = [];

  constructor(
    private sharedService: SharedService,
    private autoSuggestService: AutosuggestService
  ) { }

  ngOnInit() {

    this.readQueries();

    this.sharedService.setQuery.subscribe(query => {
      this.query = query;
    });

    let mythis = this;

    $('body').on('click', function(e) {
      let container = $('.dropdown-box')[0];

      if($.contains(container, e.target) === false 
        && $(e.target).is('.b_searchbox') === false 
        && $(e.target).is('.remove') === false) {
        mythis.showDropDown = false;
      }
        
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
    this.inputedQuery = this.query;
    this.showDropDown = true;
    this.getAutoSuggestData();
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
        this.inputedQuery = this.query;
        this.startSearch();
        this.getAutoSuggestData();
        break;
    }
  }

  clickSearchIcon() {

    if(this.query === '')
      return;

    this.showDropDown = false;
    this.inputedQuery = this.query;
    this.startSearch();
    this.getAutoSuggestData();
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

  renderItem(text) {
    let element = document.createElement("span");
    if(this.inputedQuery == '' || text.indexOf(this.inputedQuery) == -1) {
      element.innerHTML = text;
      return element.outerHTML;
    }

    element.innerHTML = this.inputedQuery;
    let boldElement = document.createElement('b');
    boldElement.innerHTML = text.substring(text.indexOf(this.inputedQuery) + this.inputedQuery.length);
    element.appendChild(boldElement);

    return element.outerHTML;
  }

  isIncludeInCookie(item) {
    return this.queries.indexOf(item) > -1;
  }

  inputClick() {
    if(this.query == '')
      return;

    this.showDropDown = true;
    this.inputedQuery = this.query;
    
  }

  itemClick(e) {
    let index = $('.dropdown-box li').index($(e.target).parents("li.dropdown-item"));

    if(index > -1 && index < this.items.length) {
      this.setActive(index);
      this.showDropDown = false;
      this.inputedQuery = this.query;
      this.startSearch();
      this.getAutoSuggestData();
    }
  }

  startSearch() {
    this.sharedService.changedQueryEmitter(this.query);

    if(this.queries.indexOf(this.query) == -1) {
      this.queries.push(this.query);
      this.setQueries();
    }
      
  }

  removeQueryInCookie(item, index) {
    console.log(item, index);

    this.queries.splice(this.queries.indexOf(item), 1);
    this.setQueries();

    this.items.splice(this.items.indexOf(item), 1);
    
  }

  getAutoSuggestData() {
    this.autoSuggestService.getData(this.query).subscribe(data => {
      const { suggestionGroups } = data;
      if(suggestionGroups.length > 0) {
        const { searchSuggestions } = suggestionGroups[0];
        this.items = [];
        this.activeItemIndex = -1;
        for(let i=0; i<searchSuggestions.length; i++) {
          let q = searchSuggestions[i].query;
          this.items.push(q);
        }
      }

    })
  }

  


}
