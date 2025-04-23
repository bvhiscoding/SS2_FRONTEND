import {  Injectable, inject } from '@angular/core';
import {
  AsyncValidator,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Observable, of, delay, timer } from 'rxjs';
import { UserManagerService } from '@apis/user-manager.service';
import { injectConfigs } from 'src/app/core/config/utils';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AccoutnUsername implements AsyncValidator {
  constructor(private userService: UserManagerService) {}
  validate(control: AbstractControl): Observable<ValidationErrors | null> {

    return timer(400).pipe(
      switchMap(() =>
        this.userService.checkUser({userName: control.value,agency: localStorage.getItem('agency')
        }).pipe(
          map((a) => ( a==1 ? null : { useraccoutn: control.value })),
          catchError(() => of({ useraccoutn: control.value }))
        )
      )
    );
  }
}
