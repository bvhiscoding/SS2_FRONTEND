import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { LoadingComponent } from '../components/loading/loading.component';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingModal: any;
  constructor(private modal: NzModalService) {}
  openLoadingModal() {
    this.loadingModal = this.modal.create({
      nzTitle: undefined,
      nzFooter: null,
      nzContent: LoadingComponent,
      nzClosable: false,
      nzMask: false,
      nzMaskClosable: false,
      nzCentered: true,
      nzWrapClassName: 'loading-modal',
      nzWidth: '200px',
    });
  }
  closeLoadingModal() {
    if (!this.loadingModal) return;
    this.loadingModal.close();
  }
}
