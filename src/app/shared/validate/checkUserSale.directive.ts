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
export class AccoutnSale implements AsyncValidator {
    constructor(       private saleService: SaleService,
        
        ) {}
    validate(control: AbstractControl): Observable<ValidationErrors | null> {
      let data :any = {
        username: control.value,
        agency: localStorage.getItem('agency'),
          };
      return timer(400).pipe(
        switchMap(() =>
          this.saleService.getUser(data.username, data.agency).pipe(
            map((result) =>
              result ?   { userSale: control.value } :null
            ),
            catchError(() => of(null))
          )
        )
      );
    }
  }
  