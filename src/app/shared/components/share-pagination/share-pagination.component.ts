import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { WithConfig } from 'ng-zorro-antd/core/config';
import { TableStorage } from '../../../core/enums/storage.enum';
import { NzI18nService, vi_VN } from 'ng-zorro-antd/i18n';
@Component({
  selector: 'app-share-pagination',
  templateUrl: './share-pagination.component.html',
  styleUrls: ['./share-pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharePaginationComponent implements OnInit {
  @Input() pageIndex: number;
  @Input() pageSize: number;
  @Input() total: number;
  @Output() pageIndexChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  constructor(private i18n: NzI18nService) {}

  ngOnInit() {
    this.i18n.setLocale(vi_VN);
  }
  setPageSize($event: any) {
    localStorage.setItem(TableStorage.currentPageSize, $event);
    this.pageSizeChange.emit($event);
  }
}
