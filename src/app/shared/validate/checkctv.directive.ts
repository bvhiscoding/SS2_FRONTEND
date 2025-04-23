import { Directive, forwardRef, Injectable } from '@angular/core';
import {
  AsyncValidator,
  AbstractControl,
  NG_ASYNC_VALIDATORS,
  ValidationErrors,
} from '@angular/forms';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Observable, of, delay, timer } from 'rxjs';
import { UserManagerService } from '@apis/user-manager.service';
import { CollabService } from '@apis/collab.service';
@Injectable({ providedIn: 'root' })
export class AccoutnCTV implements AsyncValidator {
    constructor(private collabService: CollabService) {}
    validate(control: AbstractControl): Observable<ValidationErrors | null> {
      let data = {
        search: {
          username: control.value,
          referralCode: null,
          fullname: null,
          type: null,
          status: 'APPROVED',
          startDate: null,
          endDate: null,
        },
        page: 1,
        pagesize: 30,
        agency: localStorage.getItem('agency'),
      };
      return timer(400).pipe(
        switchMap(() =>
          this.collabService.SearchList(data).pipe(
            map((result) =>
              result.totalCount == 1 ? null : { userAccoutnCTV: control.value }
            ),
            catchError(() => of({ userAccoutnCTV: control.value }))
          )
        )
      );
    }
  }
  