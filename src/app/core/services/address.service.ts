import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { City, District, Ward } from '../models/Address';
import { injectConfigs } from '../config/utils';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  readonly addressUrl = "assets/address";

  private readonly citiesEndpoint = this.addressUrl + '/cities.json';
  private readonly districtEndpoint = this.addressUrl + '/districts.json';
  private readonly wardEndpoint = this.addressUrl + '/wards.json';
  constructor(private http: HttpClient) {}

  getCities(): Observable<City[]> {
    return this.http.get<City[]>(this.citiesEndpoint);
  }
  getDistricts(cityName: string): Observable<District[]> {
    return this.http.get<District[]>(this.districtEndpoint).pipe(
      map((districts) => {
        return districts.filter((district) => district.parent === cityName);
      })
    );
  }

  getWards(districtName: string): Observable<Ward[]> {
    return this.http.get<Ward[]>(this.wardEndpoint).pipe(
      map((wards) => {
        return wards.filter((ward) => ward.parent === districtName);
      })
    );
  }
}
