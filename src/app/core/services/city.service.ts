import {inject, Injectable} from '@angular/core';
import {CityRequest} from "../request/city.request";
import {catchError, map, Observable, throwError} from "rxjs";
import {CityGlobalResponse, CityResponse} from "../response/city.response";
import {environment} from "../../../environments/environment.development";
import {LocationResponse} from "../response/location.response";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CityService {

  private http: HttpClient = inject(HttpClient);

  findAllCities(request: CityRequest): Observable<CityResponse[]> {
    return this.http.post<CityGlobalResponse>(`${environment.countryApiUrl}`, request).pipe(
      map(response => response.data),
      catchError(this.handleError)
    )
  }

  findLatLng(city: string): Observable<LocationResponse[]>  {
    const param: HttpParams = new HttpParams().append('name', city);
    const header: HttpHeaders = new HttpHeaders().append('X-Api-Key', `${environment.secret}`);
    return this.http.get<LocationResponse[]>(`${environment.locationApiUrl}`, {params: param, headers: header}).pipe(
      map(response => response),
      catchError(this.handleError)
    )
  }

  handleError(error: HttpErrorResponse) {
    return throwError(() => error).pipe(
      catchError((err: HttpErrorResponse) => {
        throw err;
      })
    )
  }
}
