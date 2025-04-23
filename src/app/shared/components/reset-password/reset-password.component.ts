import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { BehaviorSubject } from 'rxjs';
import { UserManagerActions } from '../../../features/user/states/user-manager.action';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent {
  @Input() username: string;
  form = new FormGroup({});
  _store = inject(Store);
  @Output() close = new EventEmitter<void>();

  model: {
    password: string;
    confirmPassword: string;
  } = {
    password: '',
    confirmPassword: '',
  };
  confirmDialog$ = new BehaviorSubject<boolean>(false);

  fields: FormlyFieldConfig[] = [
    {
      validators: {
        validation: ['passwordMatch'],
      },
      fieldGroupClassName:
        'flex items-center justify-between flex-col space-y-4',
      fieldGroup: [
        {
          key: 'password',
          type: 'input',
          className: 'w-full text-xs',
          props: {
            required: true,
            type: 'password',
            label: 'Mật khẩu mới',
            appearance: 'outline',
            placeholder: 'Nhập mật khẩu mới',
          },
        },
        {
          key: 'confirmPassword',
          type: 'input',
          className: 'w-full text-xs',
          props: {
            required: true,
            type: 'password',
            label: 'Nhập lại mật khẩu mới',
            appearance: 'outline',
            placeholder: 'Nhập lại mật khẩu mới',
          },
        },
      ],
    },
  ];

  checkFormValid(): boolean {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  hanldeConfirm($event: boolean) {
    if ($event) {
      this._store.dispatch(
        UserManagerActions.changePassword({
          id: this.username,
          password: this.model.password,
        })
      );
      this.close.emit();
    }
    this.confirmDialog$.next(false);
  }

  submitBtnClicked() {
    if (this.checkFormValid()) {
      this.confirmDialog$.next(true);
    }
  }
}
