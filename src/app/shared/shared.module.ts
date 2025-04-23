import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UrlImagePipe } from './pipes/url-image.pipe';
import { NicknamePipe } from './pipes/nickname.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { MatDialogModule } from '@angular/material/dialog';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { registerLocaleData } from '@angular/common';
import { NZ_I18N, vi_VN } from 'ng-zorro-antd/i18n';
import vi from '@angular/common/locales/vi';
registerLocaleData(vi);
@NgModule({
  declarations: [UrlImagePipe, NicknamePipe],
  imports: [
    CommonModule,
    QuillModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule,
    MatDialogModule,
    NzButtonModule,
  ],
  exports: [ReactiveFormsModule, FormsModule, UrlImagePipe, NicknamePipe],
  providers: [{ provide: NZ_I18N, useValue: vi_VN }],
})
export class SharedModule {}
