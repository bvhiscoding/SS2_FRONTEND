import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManagermentService {
  isUserLoggedIn!: boolean;
  public apiUrl = environment.API_URL;

  constructor(private http: HttpClient) { }

  getAllManagementOwner(page: number, pageSize: number): Observable<any> {
    return this.http.get(this.apiUrl + `/api/user/get-all-user?page=${page}&pageSize=${pageSize}`);
  }

  getAllManagement(page: number, pageSize: number): Observable<any> {
    return this.http.get(this.apiUrl + `/api/user/get-all-users?page=${page}&pageSize=${pageSize}`);
  }

  updateAccountManagement(body: any): Observable<any> {
    return this.http.patch(this.apiUrl + '/api/user/update-user-by-admin', body)
  }

  addAccountManagementOwner(body?: any): Observable<any> {
    return this.http.post(this.apiUrl + `/api/user/register`, body);
  }

  disableAccount(id?: any): Observable<any> {
    return this.http.post(this.apiUrl + `/api/user/disable-user/${id}`, {});
  }

  getUserById(id?: any): Observable<any> {
    return this.http.get(this.apiUrl + `/api/user/get-user/${id}`);
  }

  getAllCandidateVoter(page: number, pageSize: number): Observable<any> {
    return this.http.get(this.apiUrl + `/api/user/select-candidates?page=${page}&pageSize=${pageSize}`);
  }

  uploadImage(formData: FormData): Observable<{ filename: string }> {
    return this.http.post<{ filename: string }>('https://be.youth.com.vn/api/upload/UploadImage', formData);
  }
  
}
