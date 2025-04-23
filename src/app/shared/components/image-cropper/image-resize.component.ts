import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ImageTransform } from 'ngx-image-cropper';

export interface ImageResizeConfig {
  file: Event | null;
  aspectRatio: number;
  width?: number;
  height?: number;
  roundedCropper?: boolean;
  dynamicAspect?: boolean;
}

@Component({
  selector: 'app-image-resize',
  templateUrl: './image-resize.component.html',
  styleUrls: ['./image-resize.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageResizeComponent implements OnInit {
  @Input() data: ImageResizeConfig;
  @Output() save = new EventEmitter<File>();
  @Input() side?: 'front' | 'back';
  @Output() outputProps = new EventEmitter<{
    file: File;
    side: 'front' | 'back';
  }>();
  canvasRotation = 0;
  uploadImage: File;
  imageChangedEvent: any = '';
  transform: ImageTransform = {};
  showCropper: boolean;
  constructor(private element: ElementRef) {}
  saveAndCloseModal() {
    if (!this.side) {
      this.save.emit(this.uploadImage);
    } else {
      this.save.emit(this.uploadImage);
      this.outputProps.emit({
        file: this.uploadImage,
        side: this.side,
      });
    }
  }
  ngOnInit(): void {
    this.fileChangeEvent(this.data.file);
    this.element.nativeElement
      .closest('.cdk-global-overlay-wrapper')
      .classList.add('overflow-image-upload');
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: any) {
    this.uploadImage = this.base64ToFile(event.base64, 'upload.png');
  }
  base64ToFile(data: any, filename: string) {
    const arr = data.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
  imageLoaded() {
    // show cropper
    this.showCropper = true;
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }
}
