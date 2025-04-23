import { Directive } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passWordValidator(): ValidatorFn {
  const regexpassWord = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  return (control: AbstractControl): ValidationErrors | null => {
    let forbidden = true;

    if (control.value?.length) {
      if (!regexpassWord.test(control.value)) {
        forbidden = false;
      }
    }
    return forbidden ? null : { passWordCheck: { value: control.value } };
  };
}
@Directive({
  selector: '[appCheckpassWord]',
  standalone: true,
})
export class CheckpassWordDirective {
  constructor() {}
}
