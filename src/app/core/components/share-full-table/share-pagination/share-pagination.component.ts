import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-share-pagination',
  templateUrl: './share-pagination.component.html',
  standalone: true,
  styleUrls: ['./share-pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharePaginationComponent {
  @Input() pageIndex!: number;
  @Input() pageSize!: number;
  @Input() total!: number;
  @Output() pageIndexChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
}
