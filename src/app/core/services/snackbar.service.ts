import { inject, Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzMessageModule } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  _messageService = inject(NzMessageService);

  public basic(message: string) {
    this._messageService.info(message);
  }

  public success(message: string) {
    this._messageService.success(message);
  }

  public error(message: string) {
    this._messageService.error(message);
  }

  public warning(message: string) {
    this._messageService.warning(message);
  }

  public loading(message: string) {
    this._messageService.loading(message);
  }

  create(type: string, message: string) {
    this._messageService.create(type, message);
  }
}
