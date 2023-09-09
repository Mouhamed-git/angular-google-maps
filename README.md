# Google Map with Angular App

## This repository how to integrate Google Maps, Marker and Polyline in Angular Project.
_You can see more at https://github.com/angular/components/tree/main/src/google-maps_

### User can select city form and city to, and we add and show marker info and draw polyline between two cities.

![Alt Text](/src/assets/app.gif)

Angular Project Architecture

```bash
├── README.md
├── angular.json
├── package-lock.json
├── package.json
├── src
│   ├── app
│   │   ├── app-routing.module.ts
│   │   ├── app.component.html
│   │   ├── app.component.scss
│   │   ├── app.component.ts
│   │   ├── app.module.ts
│   │   ├── city
│   │   │   └── city.component.ts
│   │   ├── core
│   │   │   ├── request
│   │   │   │   └── city.request.ts
│   │   │   ├── response
│   │   │   │   ├── city.response.ts
│   │   │   │   └── location.response.ts
│   │   │   └── services
│   │   │       └── city.service.ts
│   │   ├── footer
│   │   │   └── footer.component.ts
│   │   └── maps
│   │       └── maps.component.ts
│   ├── assets
│   ├── environments
│   │   ├── environment.development.ts
│   │   └── environment.ts
│   ├── favicon.ico
│   ├── index.html
│   ├── main.ts
│   └── styles.scss
├── tsconfig.app.json
├── tsconfig.json
└── tsconfig.spec.json
```

1. Create google map component
```npm
ng g c maps --standalone --inline-style --inline-template --skip-tests
```

2. Add dependencies
```npm
npm i @angular/google-maps
```

3. Import GoogleMapModule 
```typescript
selector: 'app-maps',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule],
  template: `
  `,
  styles: []
})
export class MapsComponent {}
```

4. Import Google Map Api Key in **index.html** file. You can follow the [link](https://developers.google.com/maps/documentation/javascript/get-api-key?hl=fr) to create Api Key
```javascript 
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY"></script>
```
5. MapsComponent Code
```typescript
@Component({
  selector: 'app-maps',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule],
  template: `
      <google-map 
        [height]="height"
        [width]="width"
        [zoom]="mapOptions.zoom!"
        [options]="mapOptions"
        [center]="mapOptions.center!"
        (click)="moveMap($event)">

      <map-marker
        #mapMarker="mapMarker"
        *ngFor="let marker of markers"
        [position]="marker.getPosition()!"
        [title]="marker.getTitle()!"
        (mapClick)="openMapInfo(marker.getTitle()!, mapMarker)"
      >
      </map-marker>

      <map-info-window>{{ infoContent }}</map-info-window>

      <map-polyline [options]="polylineOptions" ></map-polyline>
    </google-map>

  `,
  styles: []
})
export class MapsComponent implements OnInit{

  @ViewChild(MapInfoWindow, { static: false }) infoWindow?: MapInfoWindow;

  @Input() locationFrom?: LocationResponse;
  @Input() locationTo?: LocationResponse;

  height: string = '600px';
  width: string = '600px';

  mapOptions: google.maps.MapOptions = {
    center: {
      lat: 0,
      lng: 0
    },
    mapId: 'customMap',
    scrollwheel: false,
    disableDoubleClickZoom: true,
    mapTypeId: 'hybrid',
    zoom: 6,
    maxZoom: 15,
    minZoom: 4,
  };

  markers: Set<google.maps.Marker> = new Set();

  infoContent: string = '';

  polylineOptions: google.maps.PolylineOptions = {
    path: [],
    strokeColor: '#F78F08',
    strokeOpacity: 1.0,
    strokeWeight: 5,
    draggable: false,
  }

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      this.mapOptions.center = {
        lat: position?.coords.latitude ?? 46.788,
        lng: position?.coords.longitude ?? -71.3893,
      }
    });
  }

  ngOnChanges(): void {
    if (this.locationFrom) {
      this.addMarker(this.locationFrom)
    }

    if (this.locationTo) {
      this.addMarker(this.locationTo)
    }

    if (this.hasLocation) {
      this.addPolyline();
    }
  }

  get hasLocation(): boolean {
    return !!this.locationFrom && !!this.locationTo;
  }

  loadMarker(location?: LocationResponse): google.maps.Marker {
    return new google.maps.Marker({
      position: {
        lat: location?.latitude ?? 0,
        lng: location?.longitude ?? 0
      },
      title: location?.name ?? '',
      animation: google.maps.Animation.DROP,
      draggable: false,
    });
  }

  addMarker(location: LocationResponse) {
    const marker = this.loadMarker(location);
    this.markers.add(marker)
    this.moveMapView();
  }

  moveMap(event: any) {
    if (event.latLng != null) {
      this.mapOptions.center = (event.latLng.toJSON());
    }
  }

  moveMapView() {
    this.mapOptions.center = {
      lat: this.locationFrom?.latitude ?? 0,
      lng: this.locationFrom?.longitude ?? 0
    }
  }

  openMapInfo(content: string, marker: MapMarker) {
    this.infoContent = content;
    this.infoWindow?.open(marker);
  }

  addPolyline() {
    const markers = Array.from(this.markers).slice(-2);
    const path: google.maps.LatLng[] = [];
    markers.forEach((marker, index) => {
      path.push(new google.maps.LatLng(marker.getPosition()!));
    });
    this.polylineOptions = { ...this.polylineOptions, path };
    this.markers = new Set(markers);
  }
}
```

6. Create component to call MapsComponent
```npm
ng g c city--standalone --inline-style --inline-template --skip-tests
```

7. Import MapsComponent
```typescript
   @Component({
   selector: 'app-city',
   standalone: true,
   styles: []
   imports: [
   CommonModule,
   MapsComponent,
   ],
   template: `
   `,

})
export class MapsComponent {}
```

8. CityComponent code
```typescript
@Component({
  selector: 'app-city',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MapsComponent,
    MatFormFieldModule,
    MatSelectModule
  ],
  styles: [],
  template: `
    <div class="d-flex justify-content-around align-items-start">
      <div>
        <form class="form" >
          <mat-form-field appearance="outline">
            <mat-label>Ville de départ</mat-label>
            <mat-select name="cityFrom" [(ngModel)]="cityFrom" (ngModelChange)="getLatLngCityFrom($event)">
              <mat-option *ngFor="let city of cities" [value]="city.city">{{city.city}}</mat-option>
            </mat-select>
          </mat-form-field><br>

          <mat-form-field appearance="fill">
            <mat-label>Ville de d'arrivé</mat-label>
            <mat-select name="cityTo" [(ngModel)]="cityTo" (ngModelChange)="getLatLngCityTo($event)">
              <mat-option *ngFor="let city of cities" [value]="city.city">{{city.city}}</mat-option>
            </mat-select>
          </mat-form-field>
        </form>
      </div>

      <div>
        <app-maps
            [locationFrom]="this.locationFrom"
            [locationTo]="this.locationTo"
        ></app-maps>
      </div>
    </div>
  `,

})
export default class CityComponent implements OnInit{
  private service: CityService = inject(CityService);

  cities: CityResponse[] = [];
  cityFrom: string | null = null;
  cityTo: string | null = null;

  locationFrom?: LocationResponse;
  locationTo?: LocationResponse;

  ngOnInit() {
    this.getAllCities()
  }

  getAllCities() {
    let request: CityRequest = new CityRequest();
    request.order = 'asc';
    request.orderBy = 'name';
    request.country = 'canada';

    this.service.findAllCities(request).subscribe({
      next: (data) => {
        this.cities = data;
      },
      error: err => console.log(err)
    });
  }

  getLatLngCityFrom(citySelected: string) {
    this.service.findLatLng(citySelected).subscribe({
      next: (data) => {
        this.locationFrom = data[0];
      },
      error: (err) => console.log(err)
    })
  }

  getLatLngCityTo(citySelected: string) {
    this.service.findLatLng(citySelected).subscribe({
      next: (data) => {
        this.locationTo = data[0];
      },
      error: (err) => console.error(err)
    })
  }

}
```


##### Thank you and Follow me! 🤗

* medium: https://medium.com/@rootsn221/angular-google-maps-22d316eaf605
* LinkedIn: https://www.linkedin.com/in/mouhamad-diack-b0b1541a3/
* Discord: https://discord.com/users/845331863018274836
* Portfolio: https://md-portfolio.carrd.co/
