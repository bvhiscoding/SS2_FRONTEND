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
import { SaleService } from '@apis/sale.service';
@Injectable({ providedIn: 'root' })
export class CheckPhone implements AsyncValidator {
    constructor(      private saleService: SaleService,
        ) {}
    validate(control: AbstractControl): Observable<ValidationErrors | null> {
        let data :any = {
            page : 1,
            pageSize: 30,
            username:null,
            fullname:null,
            mobile:control.value,
            groupsaleId:null ,
            collaborators: null ,
            typeId:null ,
            manager:null ,
            agency: localStorage.getItem('agency'),
              };
      return timer(400).pipe(
        switchMap(() =>
        this.saleService.getAllSale(data).pipe(
            map((result) =>
              result.totalCount == 0 ? null : { phonechek: control.value }
            ),
            catchError(() => of({ phonechek: control.value }))
          )
        )
      );
    }
  }
  