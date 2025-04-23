import {
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-share-table',
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
  @Input() loaded: boolean | null | undefined;
  @Input() countSelected?: number;
  @Output() pageIndexChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @ContentChild('headers') headers!: TemplateRef<any>;
  @ContentChild('rows') rows!: TemplateRef<any>;
  @ContentChild('sums') sums!: TemplateRef<any>;
  @ContentChild('create') create!: TemplateRef<any>;
  @Input() listproduct: boolean = false;
  @ViewChild('outerWrapper') tableWrapper!: ElementRef;
  @Input() sum: boolean = false;
  @Input() width: string | undefined;

  constructor(private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(() => {
      this.renderer.setStyle(
        this.tableWrapper.nativeElement,
        'height',
        this.maxHeight,
      );
      if (this.width) {
        const table = document.querySelector('table') as HTMLElement;
        if (table) {
          table.style.width = this.width;
        }
      }
    }, 0);
  }
}
