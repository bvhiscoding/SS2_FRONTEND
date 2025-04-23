import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageResizeComponent } from './image-resize.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ImageResizeComponent],
  imports: [CommonModule, ImageCropperModule, NzButtonModule, TranslateModule],
  exports: [ImageResizeComponent],
})
export class ImageResizeModule {}
