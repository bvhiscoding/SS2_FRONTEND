import { Directive, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
  ValidatorFn,
} from '@angular/forms';
export function validate(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = nameRe.test(control.value);
      return forbidden ? null: { validatePhone: { value: control.value } }  ;
    };
  }
  export function identityRevealedValidator(): ValidatorFn {

      return (control: AbstractControl): ValidationErrors | null =>{
        const name = control.get('name');
        const alterEgo = control.get('alterEgo');
        return name && alterEgo && name.value === alterEgo.value
        ? { identityRevealed: true }
        : null;
      }
  }
  

