import { Directive, forwardRef, Injectable } from '@angular/core';
import {
  AsyncValidator,
  AbstractControl,
  NG_ASYNC_VALIDATORS,
  ValidationErrors,
} from '@angular/forms';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Observable, of, delay, timer } from 'rxjs';

import { StoreService } from '@apis/store.service';
@Injectable({ providedIn: 'root' })
export class AccoutnStore implements AsyncValidator {
    constructor(    private StoreService: StoreService,
        ) {}
    validate(control: AbstractControl): Observable<ValidationErrors | null> {
      let data :any = {
        page : 1,
        pageSize: 30,
        type:null,
        name:null,
        warehouseCode:null,
        warehouseKeeper: control.value,
        collaborators: null ,
        isActive:null 
          };
      return timer(400).pipe(
        switchMap(() =>
          this.StoreService.getAllStore(data).pipe(
            map((result) =>
              result.totalCount == 0 ? null : { userStore: control.value }
            ),
            catchError(() => of({ userStore: control.value }))
          )
        )
      );
    }
  }
  