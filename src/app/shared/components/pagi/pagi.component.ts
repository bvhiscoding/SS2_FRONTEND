import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-pagi',
  standalone: true,
  imports:[
    CommonModule,
    FormsModule,NzIconModule],
  templateUrl: './pagi.component.html',
  styleUrls: ['./pagi.component.scss']
})
export class PagiComponent implements OnInit, OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    this.letPage = false
    this.pageArr = Array.from({ length: Math.ceil(this.totalCount / this.pageSize) }, (_, i) => i + 1)
    this.letPage = true
    this.cdr.detectChanges()
  }

  @Input() page = 1
  @Input() pageSize: any = 10
  @Input() totalCount = 10
  cdr = inject(ChangeDetectorRef)
  pageArr: any = []
  offsetLeft = 0
  lastLeft = 0
  letPage = false

  @Output() PageEvent: EventEmitter<number> = new EventEmitter()
  @Output() PageSizeEvent: EventEmitter<number> = new EventEmitter()

  ngOnInit(): void {
    this.pageArr = Array.from({ length: Math.ceil(this.totalCount / this.pageSize) }, (_, i) => i + 1)
    this.letPage = true
    this.cdr.detectChanges()
  }

  ChangePage(page: any, dom: any) {
    if (this.pageArr.length >= 6) {
      if (page <= 3 || page >= this.pageArr[this.pageArr.length - 3]) {
        if (page <= 3) {
          this.offsetLeft = 0
          this.lastLeft = -this.offsetLeft
          dom?.classList.toggle('pageScroll')
          setTimeout(() => { dom?.classList.toggle('pageScroll') }, 300)
        }
        else {
          this.offsetLeft = this.pageArr[this.pageArr.length - 6] * 25
          this.lastLeft = -this.offsetLeft
          dom?.classList.toggle('pageScroll')
          setTimeout(() => { dom?.classList.toggle('pageScroll') }, 300)
        }
      }
      else {
        if (-this.lastLeft > (page - 3) * 25 || ((page + 2) * 25) > (-this.lastLeft + 125)) {
          this.offsetLeft = -this.lastLeft + (page - this.page) * 25
          this.lastLeft = -this.offsetLeft
          dom?.classList.toggle('pageScroll')
          setTimeout(() => { dom?.classList.toggle('pageScroll') }, 300)
        }
      }
    }

    this.page = (page > 0 && page <= Math.ceil(this.totalCount / this.pageSize)) ? page : this.page
    this.PageEvent.emit(this.page)
  }
  ChangePageSize(pageSize: any) {
    this.pageSize = pageSize
    this.PageSizeEvent.emit(this.pageSize)
  }

}
