import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  _http = inject(HttpClient);

  constructor() { }
  getListCity(): Observable<any> {
    return this._http.get<any>(
      `https://api-agency-dev.trueconnect.vn/gateway/address/cities`
    );
  }
  getDistricts(body:string): Observable<any> {
    return this._http.get<any>(
        `https://api-agency-dev.trueconnect.vn/gateway/address/districts?city=${body}`
      );
  }
  getWards(body:any): Observable<any> {
    return this._http.get<any>(
      `https://api-agency-dev.trueconnect.vn/gateway/address/wards?district=${body}`
    );
  }
}
