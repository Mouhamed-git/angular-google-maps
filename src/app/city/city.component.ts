import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MapsComponent} from "../maps/maps.component";
import { FormsModule} from '@angular/forms';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {CityResponse} from "../core/response/city.response";
import {CityRequest} from "../core/request/city.request";
import {CityService} from "../core/services/city.service";
import {LocationResponse} from "../core/response/location.response";

@Component({
  selector: 'app-city',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MapsComponent,
    MatFormFieldModule,
    MatSelectModule,
  ],
  styles: [
    `
    `
  ],
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
    this.getAllCities();
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
    });
  }

  getLatLngCityTo(citySelected: string) {
    this.service.findLatLng(citySelected).subscribe({
      next: (data) => {
        this.locationTo = data[0];
      },
      error: (err) => console.error(err)
    });
  }

}
