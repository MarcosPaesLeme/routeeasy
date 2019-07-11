import { Component, OnInit, ViewChild, ElementRef, NgZone, ComponentFactoryResolver, Injector } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
declare let L;
import { tileLayer, latLng, marker, Marker } from 'leaflet';
import { DataService } from './data.service';
import '../../node_modules/leaflet/dist/images/marker-shadow.png';
import '../../node_modules/leaflet/dist/images/marker-icon.png';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  fullAddress: any;
  private geoCoder;

  name: string;
  weigth: number;
  map;

  clients: any;
  totalWeigth: number = 0;

  options = {
    layers: [
      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoom: 3,
    center: L.latLng(-2.1980669, -79.9070729)
  };

  @ViewChild('search')
  public searchElementRef: ElementRef;
 
 
  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private dataService: DataService,
    private resolver: ComponentFactoryResolver,
    private injector: Injector
  ) { }
 
 
  ngOnInit() {
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;
 
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
 
          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.fullAddress = place.address_components;
          this.zoom = 12;
        });
      });
    });
    this.getAllCLients();
  }
 
  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      console.log('navigator.geolocation', navigator.geolocation);
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }
 
  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
 
    });
  }

  onMapReady(map) {
    // get a local reference to the map as we need it later
    this.map = map;
  }

  getAllCLients() {
    this.dataService.getAllClients().subscribe(
      res => {
        this.clients = res;
        for (let index = 0; index < this.clients.length; index++) {

          this.totalWeigth+= this.clients[index].weigth;

          let m = marker([ this.clients[index].address.geolocation.lat, this.clients[index].address.geolocation.lgn]
          );

          // add popup functionality
          m.bindPopup(`${this.clients[index].clientName} <br> ${this.clients[index].weigth}`).openPopup();
    
          m.addTo(this.map);
          
        }
      }, err => {
        console.log(err);
      })
  }
  registerClient() {

    if(this.name || this.weigth || this.fullAddress || this.latitude || this.longitude) {
      alert('Por favor, preencha os campos')
      return ;
    }
    const params = {
      clientName: this.name,
      weigth: this.weigth,
      address: {
          publicPlace: this.fullAddress[1].long_name,
          number: this.fullAddress[0].long_name,
          neighborhood: this.fullAddress[2].long_name,
          complement: this.fullAddress[6].long_name,
          city: this.fullAddress[3].long_name,
          state: this.fullAddress[4].long_name,
          country: this.fullAddress[5].long_name ,
          geolocation: {
              lat: this.latitude,
              lgn: this.longitude,
          }
      }
    };
    this.dataService.registerClient(params).subscribe(
      res => {
        this.resetValues();
        this.getAllCLients();        
      }, err => {
        console.log('err', err);
      });
  }


  resetRegistrantion() {
    this.dataService.deleteAll().subscribe(
      res => {
        this.getAllCLients();
      }, err =>{
        console.log(err)
      })
  }

  resetValues() {
    this.name = undefined;
    this.weigth = undefined;
    this.clients = [];
    this.latitude = undefined;
    this.longitude = undefined;
  }
}