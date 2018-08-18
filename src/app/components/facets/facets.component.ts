import { Component, OnInit, Input } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { environment } from '../../../environments/environment';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-facets',
  templateUrl: './facets.component.html',
  styleUrls: ['./facets.component.css']
})
export class FacetsComponent implements OnInit {

  isNotEmptyFacets = false;

  @Input() isMap: boolean = false;

  facets: any[] = [];
  multiFacetsData: any = {};

  isFacetFilter: boolean = false;
  selectedFacetValue: string = '';
  isMultiFacetSelect: boolean = false;
  selectedMultiFacets: string[] = [];

  changedFacetsSubscriber;
  setGoogleFacetsSubscriber;
  changedQuerySubscriber;
  setMultiFacetsDataSubscriber;


  constructor(
    private sharedService: SharedService
  ) { }

  ngOnInit() {

    this.changedFacetsSubscriber = this.sharedService.changedFacets.subscribe(facets => {

      this.facets = facets;

      if(this.facets.length > 0)
        this.isNotEmptyFacets = true;
      else
        this.isNotEmptyFacets = false;

      for(let i=0; i<this.facets.length; i++) {
        this.multiFacetsData[this.facets[i].key] = false;
      }

      $("div.facet-container").find(".facet-option[data-facet-value='all']").addClass('selected');
    });

    this.setGoogleFacetsSubscriber = this.sharedService.setGoogleFacets.subscribe(facets => {

      this.facets = facets;

      if(this.facets.length > 0)
        this.isNotEmptyFacets = true;
      else
        this.isNotEmptyFacets = false;

      setTimeout(() => {
        $("div.facet-container").find(".facet-option").first().addClass('selected');
      }, 100);
      

    })

    this.changedQuerySubscriber = this.sharedService.changedQuery.subscribe(query => {
      this.initFacets();
    });

    this.setMultiFacetsDataSubscriber = this.sharedService.setMultiFacetsData.subscribe(facets => {
      this.isMultiFacetSelect = true;
      this.selectedMultiFacets = facets;
      this.multiFacetsData = {};
      for(let val in facets)
        this.multiFacetsData[facets[val]] = true;
    });

    
  }

  ngOnDestroy() {
    this.changedFacetsSubscriber.unsubscribe();
    this.setGoogleFacetsSubscriber.unsubscribe();
    this.changedQuerySubscriber.unsubscribe();
    this.setMultiFacetsDataSubscriber.unsubscribe();
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

  handleClickGoogleFacet(e, facet) {
    this.sharedService.selectGoogleFacetEmitter({
      lat: Number(facet.latitude),
      lng: Number(facet.longitude)
    });

    $(e.target).parents(".facets").find('.facet-option').removeClass('selected');
    $(e.target.parentElement).addClass('selected');
  }

}
