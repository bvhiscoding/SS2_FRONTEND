import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockVoteService {
  // Mock data for development
  private mockVotes = [
    {
      id: '1',
      voteName: 'Mock Election 2025',
      startDate: '2025-01-01T00:00:00',
      expiredDate: '2025-12-31T23:59:59',
      status: '1', // 0=Not started, 1=Active, 2=Completed
      tenure: 'Term 2025-2029',
      startDateTenure: '2025-01-01T00:00:00',
      endDateTenure: '2029-12-31T23:59:59',
      positionName: 'President',
      maxCandidateVote: 1,
      totalCandidate: 5,
      totalVoter: 100
    },
    // Add more mock data as needed
  ];

  private mockCandidates = [
    {
      id: '101',
      fullName: 'John Doe',
      fullname: 'John Doe',
      userName: 'johndoe',
      email: 'john@example.com',
      newEmail: null,
      cellPhone: '1234567890',
      birthday: '1980-05-15T00:00:00',
      address: '123 Main St, City, Country',
      imageUrl: null,
      totalBallot: 42
    },
    // Add more candidates as needed
  ];

  viewListVote(): Observable<any> {
    return of({
      data: this.mockVotes,
      totalItems: this.mockVotes.length
    });
  }

  viewListVoteForUser(): Observable<any> {
    return of({
      data: this.mockVotes,
      totalItems: this.mockVotes.length
    });
  }

  viewListVoteHistory(page: any, pageSize: any): Observable<any> {
    return of({
      data: {
        data: this.mockVotes,
        totalItems: this.mockVotes.length
      }
    });
  }

  listViewCandidate(id: any): Observable<any> {
    return of({
      data: this.mockCandidates
    });
  }

  // Add more mock methods as needed
}