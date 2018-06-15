import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-facets',
  templateUrl: './facets.component.html',
  styleUrls: ['./facets.component.css']
})
export class FacetsComponent implements OnInit {

  isNotEmptyFacets = false;

  categories: any[] = [];
  multiFacetsData: any = {};

  isFacetFilter: boolean = false;
  selectedFacetValue: string = '';
  isMultiFacetSelect: boolean = false;
  selectedMultiFacets: string[] = [];

  constructor(
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.sharedService.changedCategories.subscribe(categories => {
      this.categories = categories;

      if(this.categories.length > 0)
        this.isNotEmptyFacets = true;
      else
        this.isNotEmptyFacets = false;

      for(let i=0; i<categories.length; i++) {
        this.multiFacetsData[categories[i].key] = false;
      }

      $("div.facet-container").find(".facet-option[data-facet-value='all']").addClass('selected');
    });

    this.sharedService.goto.subscribe(index => {
      if(index === 1)
        return;
      this.initFacets();
    });

    this.sharedService.changedQuery.subscribe(query => {
      this.initFacets();
    });

    this.sharedService.setMultiFacetsData.subscribe(facets => {
      this.isMultiFacetSelect = true;
      this.selectedMultiFacets = facets;
      this.multiFacetsData = {};
      for(let val in facets)
        this.multiFacetsData[facets[val]] = true;
    });

    $('body').on('click', function(e) {
        
      if ($(".btn_menu_vis").is(e.target)) {
          $(".btn_menu_vis").toggleClass('active');
      } else {
          $(".btn_menu_vis").removeClass('active');
      }

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

  initFacets() {
    this.isFacetFilter = false;
    this.isMultiFacetSelect = false;

    for(let val in this.multiFacetsData)
      this.multiFacetsData[val] = false;
    this.selectedMultiFacets = [];
    
  }

  handleClickFacet(e, facetValue) {
    this.isMultiFacetSelect = false;
    for(let val in this.multiFacetsData) {
      this.multiFacetsData[val] = false;
    }
    this.selectedMultiFacets = [];

    $(e.target).parents(".facets").find('.facet-option').removeClass('selected');
    $(e.target.parentElement).addClass('selected');

    if(facetValue === '_all') {
      this.isFacetFilter = false;
      this.selectedFacetValue = '';
    } else {
      this.isFacetFilter = true;
      this.selectedFacetValue = facetValue;
    }

    this.sharedService.selectSingleFacetsEmitter({
      isFacetFilter: this.isFacetFilter,
      selectedFacetValue: this.selectedFacetValue
    });

  }

  handleClickMultiFacet() {
    this.isMultiFacetSelect = true;
    $("div.facet-container").find(".facet-option").removeClass('selected');

    this.selectedMultiFacets = [];
    for(let val in this.multiFacetsData) {
      if(this.multiFacetsData[val])
        this.selectedMultiFacets.push(val);
    }

    this.sharedService.selectMultiFacetsEmitter({
      selectedMultiFacets: this.selectedMultiFacets
    })
  }

}
