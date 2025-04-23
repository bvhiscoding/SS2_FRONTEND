import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-share-confirm',
  templateUrl: './share-confirm.component.html',
  styleUrls: ['./share-confirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShareConfirmComponent {
  @Input() title: string;
  @Input() content: string;
  @Output() confirm = new EventEmitter<boolean>();
}
