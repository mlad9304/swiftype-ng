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

      for(let i=0; i<categories.length; i++) {
        this.multiFacetsData[categories[i].key] = false;
      }

      $("div.facet-container").find(".facet-option[data-facet-value='all']").addClass('selected');
    });
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

}
