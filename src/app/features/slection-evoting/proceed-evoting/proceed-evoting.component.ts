                                            import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalComponent, NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { ManagermentService } from '../../../core/api/managerment.service';
import { rePassValidator } from '../../../shared/validate/check-repass.directive';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { VoteService } from '../../../core/api/vote.service';
import * as forge from 'node-forge';

@Component({
  selector: 'app-proceed-evoting',
  standalone: true,
  imports: [
    FormsModule,
    MatInput,
    CommonModule,
    NzModalComponent,
    NzModalModule,
    NzIconModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    TranslateModule,
    NzButtonModule,
    NzPopconfirmModule,
    ReactiveFormsModule,
    MatCheckboxModule
  ],
  templateUrl: './proceed-evoting.component.html',
  styleUrl: './proceed-evoting.component.scss'
})
export class ProceedEvotingComponent implements OnInit, OnChanges{
  @Input() isVisibleEvoting: boolean = true;
  @Input() nameEvoting: any;
  @Input() numberVote: any;
  @Input() idEvoting: any;
  @Output() visiblePopUpEvoting = new EventEmitter<boolean>();
  public isLoading: boolean = false;

  candidates: any[] = [];

  selectedCandidates: any[] = [];

  public form: FormGroup = this.fb.group({
    privateKey: [null, Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private message: NzMessageService,
    private modal: NzModalService,
    private voteService: VoteService,
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idEvoting']) {
      if(this.idEvoting) {
        this.selectedCandidates = [];
        this.viewListVote();
      }
    }
  }

    // Khóa công khai RSA (cần cung cấp từ phía server)
    public publicKey: any = 
    `-----BEGIN PUBLIC KEY-----
    MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAsCubyCqM64n0V5lVrZkAdykimbk5Qii5y1Flgz1iPJG3RU7RbPKkw/Jggr6E1Krq1zp4YoQqYm6yVJxTHWiXcIgRV2kBSN4ZCj2N/i39uhjucOJccUnLmOcc8lmsAiQnIxX+1eKPOSEN4iLyAOFhSRIwx2iRJNMXUjUzcbeNY+quDN8OR0vIv1xpMMhDDAZZESvRQoZ4PZPxMOCd0X30ehSR3GwU3KCcxpqjxs38/9WU51gNEYoG93DgCj8yupfvyXkhv5qxEEWtcFdRBRgNTiiyAPlD+9rpL65FM8evKEG+r5lFcuJRYt/vMG2vGKdph+96WDcrnNNmq3suq2lOWiXqQpgTYtFRdw0uZGu434j/2UYfnOa6eAcqZhrCxMSKSfNw6OVU3cKk6kglLPnMtY4+3vJive2cF409uAogRJAz+mvmtiW5K/eoiK2qWq2KP5qB60AfSyBhgQpwgkCMLLwm1nZbcpSE1qK3FNUAzkNiack5v7E1Ew27mhcE7g0fQIARIFZO9eS/CtHB+P1XjVtENErndfLTdK3Dbxtz83ZIXe3IMYQ6JkK9g4hZeRubt6ZkiqG/nhj4510Kk1cI+WtIp8w4SQc8dfRAvEyvnjmO1VSPfIqUsH81lnWXZDK4MLo0ZhGgK3u5F+/LdZBcDGmzQbM18gL6y54F+lipvEcCAwEAAQ==
    -----END PUBLIC KEY-----`;

  ngOnInit(): void {
    if(this.idEvoting) {
      this.viewListVote();
    }
  }

  handleOk(): void {
    const payload = {
      VoteId: this.idEvoting,
      BitcoinAddress: '',
      VoterId: '',
      Candidates: this.selectedCandidates.map(candidate => candidate.id), 
      PrivateKey: this.form.get('privateKey')?.value, 
    };
    const payloadJson = JSON.stringify(payload);
    var rsa = forge.pki.publicKeyFromPem(this.publicKey);
    var encryptedPayload = window.btoa(rsa.encrypt(payloadJson));  
    console.log("Encrypted payload: ", encryptedPayload);
    this.voteService.submitVote({encruptData: encryptedPayload}).subscribe({
      next: res => {
        this.message.success("Bầu cử thành công.");
        this.visiblePopUpEvoting.emit(false);
      },
      error: err => {
        const errorMessage = err?.error || err || '';

        if (errorMessage.includes('This vote already exists')) {
          this.message.error('Bạn đã bầu cử, không thể bầu cử lần nữa');
        } else if (errorMessage.includes('The provided private key is not in a valid Base64 format')) {
          this.message.error('Khoá bí mật không chính xác!');
        } else {
          this.message.error('Đã xảy ra lỗi, vui lòng thử lại!');
        }
      }
    });
  }

  handleCancel(): void {
    this.visiblePopUpEvoting.emit(false);
  }

  viewListVote() {
    this.isLoading = true;
    this.voteService.listViewCandidate(this.idEvoting).subscribe({
      next: res => {
        this.isLoading = false;
        this.candidates = Array.isArray(res.data) ? res.data : [];
        console.log("Candidates: ", this.candidates);
      },
      error: err => {
        this.isLoading = false;
        this.candidates = [];
        console.error("Error fetching candidates: ", err);
      }
    });
}

  toggleCandidateSelection(candidate: any) {
    if (this.selectedCandidates.includes(candidate)) {
      this.removeCandidate(candidate);
    } else {
      if (this.selectedCandidates.length < this.numberVote) {
        this.selectedCandidates.push(candidate);
      } else {
        this.message.warning(`Bạn chỉ có thể bầu chọn tối đa ${this.numberVote} ứng viên.`);
      }
    }
  }

  removeCandidate(candidate: any) {
    this.selectedCandidates = this.selectedCandidates.filter((c: any) => c.id !== candidate.id);
  }

  handleMaxSelection(candidate: any) {
    if (this.selectedCandidates.length >= this.numberVote && !this.selectedCandidates.includes(candidate)) {
      this.message.warning(`Bạn chỉ có thể bầu chọn tối đa ${this.numberVote} ứng viên.`);
    }
  }
}
