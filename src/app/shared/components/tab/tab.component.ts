import { CommonModule } from '@angular/common';
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.scss',
})
export class TabComponent implements OnInit, AfterViewChecked {
  color: string;
  @Input() index: number;
  @Input() length: number;
  @Input() active: number;
  @Input() title: string;
  nextTab: number;
  @ViewChild('tab') private tabRef: ElementRef<HTMLElement>;

  constructor(private cdr: ChangeDetectorRef) {}
  ngOnInit(): void {}
  ngAfterViewChecked(): void {
    // if (this.active === this.index) {
    //   this.color = 'white';
    //   this.wrapRef.nativeElement.style.backgroundColor = this.color;
    //   if (this.svg1Ref) {
    //     this.svg1Ref.nativeElement.style.fill = this.color;
    //   }
    //   if (this.svg2Ref) {
    //     this.svg2Ref.nativeElement.style.fill = this.color;
    //   }
    //   this.cdr.detectChanges();
    // } else {
    //   this.color = '#D8D8D8';
    //   this.wrapRef.nativeElement.style.backgroundColor = this.color;
    //   if (this.svg1Ref) {
    //     this.svg1Ref.nativeElement.style.fill = this.color;
    //   }
    //   if (this.svg2Ref) {
    //     this.svg2Ref.nativeElement.style.fill = this.color;
    //   }
    this.nextTab = this.active + 1;
    if (
      this.index !== this.active &&
      this.index !== this.nextTab &&
      this.index !== this.active - 1
    ) {
      this.tabRef.nativeElement.style.borderRadius = '0 0 0 0';
      return;
    }
    if (this.index === 0 && this.index + 1 !== this.active) {
      this.tabRef.nativeElement.style.borderRadius = '0 12px 0 0';
      return;
    }
    if (this.index === this.active + 1 && this.index !== this.length - 1) {
      this.tabRef.nativeElement.style.borderRadius = '0 0 0 12px';
      return;
    } else if (
      this.index === this.active + 1 &&
      this.index === this.length - 1
    ) {
      this.tabRef.nativeElement.style.borderRadius = '0 0 0 12px';
    }
    if (this.active === this.index && this.index !== this.length - 1) {
      this.tabRef.nativeElement.style.borderRadius = '12px 12px 0 0';
      return;
    }
    if (this.active === this.index + 1) {
      this.tabRef.nativeElement.style.borderRadius = '0 0 12px 0px';
      return;
    }
    if (this.active === this.length - 1) {
      this.tabRef.nativeElement.style.borderRadius = '12px 12px 0 0px';
    }

    this.cdr.detectChanges();
  }
}
// @ViewChild('svg1') private svg1Ref: ElementRef<HTMLElement>;
// @ViewChild('svg2') private svg2Ref: ElementRef<HTMLElement>;
// ngAfterViewInit(): void {
//   this.wrapRef.nativeElement.style.backgroundColor = this.color;
//   if (this.svg1Ref) {
//     this.svg1Ref.nativeElement.style.fill = this.color;
//   }
//   if (this.svg2Ref) {
//     this.svg2Ref.nativeElement.style.fill = this.color;
//   }
// }
