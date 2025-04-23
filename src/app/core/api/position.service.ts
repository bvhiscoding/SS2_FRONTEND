import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PositionService {
  public apiUrl = environment.API_URL;
  // Quản lý chức vụ
  constructor(private http: HttpClient) { }

  createPosition(body?: any): Observable<any> {
    return this.http.post(this.apiUrl + `/api/position/create`, body);
  }

  viewPosition(id?: any): Observable<any> {
    return this.http.get(this.apiUrl + `/api/position/view/` + id);
  }

  updatePosition(body?: any): Observable<any> {
    return this.http.put(this.apiUrl + `/api/position/update`, body);
  }

  deletePosition(id?: any): Observable<any> {
    return this.http.delete(this.apiUrl + `/api/position/delete/${id}`);
  }

  getAllPosition(page: number, pageSize: number): Observable<any> {
    return this.http.get(this.apiUrl + `/api/position/view-list?page=${page}&pageSize=${pageSize}`);
  }

  slectionPosition(page: number, pageSize: number): Observable<any> {
    return this.http.get(this.apiUrl + `/api/position/select-position?page=${page}&pageSize=${pageSize}`);
  }
}
