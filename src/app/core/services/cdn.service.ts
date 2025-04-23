import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { injectConfigs } from '../config/utils';

@Injectable({
  providedIn: 'root',
})
export class CdnService {
  _http = inject(HttpClient);
  URL_CDN_UPLOAD = injectConfigs().endPoints.BASE_URL_UPLOAD;
  uploadFile(file: any, type: string): Observable<any> {
    const formData: FormData = new FormData();
    let fileName = new Date().getTime() + file.name;
    formData.append('file', file, fileName);
    formData.append('type', type);
    return this._http.put(this.URL_CDN_UPLOAD, formData);
  }
}
