import { Directive } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function phoneNumberValidator(): ValidatorFn {
  const regexPhoneNumber = /^(0[3|5|7|8|9])+([0-9]{8})\b/;

  return (control: AbstractControl): ValidationErrors | null => {
    let forbidden = true;

    if (control.value?.length) {
      if (
        control.value?.length !== 10 ||
        !regexPhoneNumber.test(control.value)
      ) {
        forbidden = false;
      }
    }
    return forbidden ? null : { phoneNumberCheck: { value: control.value } };
  };
}
@Directive({
  selector: '[appCheckPhoneNumber]',
  standalone: true,
})
export class CheckPhoneNumberDirective {
  constructor() {}
}
