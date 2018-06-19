import { Component, OnInit, ViewChild } from '@angular/core';
import { } from '@types/googlemaps';
import { SharedService } from '../../services/shared.service';
import { GooglemapService } from '../../services/googlemap.service';
import { QUERY_READ_CONTAINER_REF } from '@angular/core/src/render3';

@Component({
  selector: 'app-googlemap',
  templateUrl: './googlemap.component.html',
  styleUrls: ['./googlemap.component.css']
})
export class GooglemapComponent implements OnInit {

  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;

  isGoogleMap: boolean = true;
  query: string = "";

  constructor(
    private sharedService: SharedService,
    private googlemapService: GooglemapService
  ) { }

  ngOnInit() {

    this.sharedService.changedQuery.subscribe(query => {
      this.query = query;
      if(this.isGoogleMap)
        this.searchOfficePos();
    });

    this.sharedService.goto.subscribe(index => {
      if(index === 1) {
        this.isGoogleMap = true;
      } else {
        this.isGoogleMap = false;
      }
      this.searchOfficePos();
    })
  }

  searchOfficePos() {
    if(this.query === '')
      return;

    this.googlemapService.searchOfficePos(this.query).subscribe(data => {

      const { record_count, records } = data;
      if(record_count === 0)
        return;
      const onerecord = records.location[0];
      const { latitude, longitude } = onerecord;

      this.drawRoute({lat: Number(latitude), lng: Number(longitude)});
    })
  }

  handleNotifications(msg) {
    var infoWindow = new google.maps.InfoWindow();
    infoWindow.setPosition(this.map.getCenter());
    infoWindow.setContent(msg);
    infoWindow.open(this.map);
  }

  humanizeGeolocationErrorMsg(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            return "User denied the request for Geolocation.";
        case error.POSITION_UNAVAILABLE:
            return "Location information is unavailable.";
        case error.TIMEOUT:
            return "The request to get user location timed out.";
        case error.UNKNOWN_ERROR:
            return "An unknown error occurred."
    }
}

  drawRoute(officePos) {

    this.map = new google.maps.Map(this.gmapElement.nativeElement, {
      zoom: 15,
      center: officePos
    });


    var directionsService = new google.maps.DirectionsService;
    var directionsRenderer = new google.maps.DirectionsRenderer({map: this.map});

    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {

        var currentPos = {lat: position.coords.latitude, lng: position.coords.longitude};

        console.log("currentPos: ", currentPos, "officePos: ", officePos);

        directionsService.route({
          origin: currentPos.lat + ', ' + currentPos.lng,
          destination: officePos.lat + ', ' + officePos.lng,
          travelMode: google.maps.TravelMode.DRIVING
        }, (response, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsRenderer.setDirections(response);
            } else {
                this.handleNotifications('Directions request failed!');
            }
        });
        
      }, (error) => {
        this.handleNotifications(this.humanizeGeolocationErrorMsg(error));
      })
    } else {
      this.handleNotifications("Your browser doesn't support html5 geolocation");
    }
  }

}