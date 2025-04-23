import {
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  Renderer2,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { SharePaginationComponent } from '../share-pagination/share-pagination.component';
import { BrowserModule } from '@angular/platform-browser';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-share-table',
  standalone: true,
  imports: [SharePaginationComponent, BrowserModule, NzSpinModule],
  templateUrl: './share-table.component.html',
  styleUrls: ['./share-table.component.scss'],
})
export class ShareTableComponent implements OnChanges {
  @Input() data: any;
  @Input() maxHeight: string = '80vh';
  @Input() title!: string;
  @Input() total!: number;
  @Input() pageIndex!: number;
  @Input() pageSize!: number;
  @Input() loaded!: boolean | null;
  @Output() pageIndexChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @ContentChild('headers') headers!: TemplateRef<any>;
  @ContentChild('rows') rows!: TemplateRef<any>;
  @ViewChild('outerWrapper') tableWrapper!: ElementRef;
  constructor(private renderer: Renderer2) {}

  ngOnChanges() {
    setTimeout(() => {
      this.renderer.setStyle(
        this.tableWrapper.nativeElement,
        'height',
        this.maxHeight
      );
    }, 0);
  }
}
