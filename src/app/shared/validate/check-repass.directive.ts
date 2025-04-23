import { Directive } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function rePassValidator(nameRe: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden =
      control.value?.length > 0 && nameRe !== control.value ? true : false;
    return forbidden === true
      ? { rePassCheck: { value: control.value } }
      : null;
  };
}
@Directive({
  selector: '[appCheckRepass]',
  standalone: true,
})
export class CheckRepassDirective {
  constructor() {}
}
