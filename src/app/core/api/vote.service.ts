import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VoteService {
  public apiUrl = environment.API_URL;
  // Quản lý cuộc bầu cử
  constructor(private http: HttpClient) { }

  createVote(body?: any): Observable<any> {
    return this.http.post(this.apiUrl + `/api/vote/create`, body);
  }

  sendEmail(body?: any): Observable<any> {
    return this.http.post(this.apiUrl + `/api/vote/send-mail-candidate`, body);
  }

  viewListVote(): Observable<any> {
    return this.http.get(this.apiUrl + `/api/vote/View-list`);
  }

  viewListVoteForUser(): Observable<any> {
    return this.http.get(this.apiUrl + `/api/vote/View-list-for-user`);
  }

  viewListVoteHistory(page: any, pageSize: any): Observable<any> {
    return this.http.get(this.apiUrl + `/api/vote/History-vote/?page=${page}&pageSize=${pageSize}`);
  }

  viewListVoteForCandidates(): Observable<any> {
    return this.http.get(this.apiUrl + `/api/vote/View-list-for-candidate`);
  }

  listViewVoter(id: any): Observable<any> {
    return this.http.get(this.apiUrl + `/api/vote/View-voters/${id}`);
  }

  listViewCandidate(id: any): Observable<any> {
    return this.http.get(this.apiUrl + `/api/vote/View-candidates/${id}`);
  }

  deleteVote(id: any): Observable<any> {
    return this.http.delete(this.apiUrl + `/api/vote/delete/${id}`);
  }

  detailVote(id: any): Observable<any> {
    return this.http.get(this.apiUrl + `/api/vote/View-detail/${id}`);
  }

  updateVote(body?: any): Observable<any> {
    return this.http.put(this.apiUrl + `/api/vote/update`, body);
  }

  submitVote(body?: any): Observable<any> {
    return this.http.post(this.apiUrl + `/api/vote/submit-vote`, body);
  }
}
