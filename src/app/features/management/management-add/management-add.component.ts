import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  NzModalComponent,
  NzModalModule,
  NzModalRef,
  NzModalService,
} from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { ManagermentService } from '../../../core/api/managerment.service';
import { rePassValidator } from '../../../shared/validate/check-repass.directive';
import { phoneNumberValidator } from '../../../shared/validate/check-phone-number.directive';

@Component({
  selector: 'app-management-add',
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
  ],
  templateUrl: './management-add.component.html',
  styleUrl: './management-add.component.scss',
})
export class ManagementAddComponent implements OnInit, OnChanges {
  @Input() isVisiblePopUpAddManagement: boolean = true;
  @Input() idManagement: any = '';
  @Input() mode: 'create' | 'edit';
  @Output() visiblePopUpAddManagement = new EventEmitter<boolean>();
  public hideOldPass: boolean = true;
  public hidePass: boolean = true;
  public hideRePass: boolean = true;
  public edit: boolean = false;
  avatarUrl: string | null = null;
  identityCardUrl: string | null = null;

  listGender = [
    {
      label: 'Nam',
      value: true,
    },
    {
      label: 'Nữ',
      value: false,
    },
  ];
  listRoles = [
    {
      label: 'Người dùng thường',
      value: false,
    },
    {
      label: 'Quản trị viên',
      value: true,
    },
  ];

  public form: FormGroup = this.fb.group({
    fullName: [null, Validators.required],
    identityCardNumber: [null, Validators.required],
    identityCardDate: [null, Validators.required],
    identityCardPlace: [null, Validators.required],
    username: [null, Validators.required],
    email: [null, Validators.email],
    birthday: [null, Validators.required],
    address: [null, Validators.required],
    gender: [true, Validators.required],
    cellPhone: [null, [phoneNumberValidator()]],
    isAdmin: [false],
    avatarUrl: [''], // Control for avatar
    identityCardUrl: [''],
  });

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private modal: NzModalService,
    private message: NzMessageService,
    private managermentService: ManagermentService,
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idManagement']) {
      if (this.idManagement && this.mode === 'edit') {
        this.edit = true;
        this.viewInfoUser();
      } else {
        this.edit = false;
        // this.form.reset();
      }
    }
  }
  ngOnInit(): void {
    this.form.controls['isAdmin'].disable();
    if (this.idManagement && this.mode === 'edit') {
      this.edit = true;
      this.viewInfoUser();
    } else {
      this.edit = false;
      // this.form.reset();
    }
  }
  // Temporarily disabled image upload functionality
  /*
  handleFileChange(event: Event, type: 'avatar' | 'identityCard'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.uploadFile(file, type);
    }
  }
  
  uploadFile(file: File, type: 'avatar' | 'identityCard'): void {
    const formData = new FormData();
    formData.append('file', file);
  
    this.managermentService.uploadImage(formData).subscribe(
      (response) => {
        if (type === 'avatar') {
          this.avatarUrl = response.filename;
          this.form.get('avatarUrl')?.setValue(this.avatarUrl);
        } else {
          this.identityCardUrl = response.filename;
          this.form.get('identityCardUrl')?.setValue(this.identityCardUrl);
        }
        this.message.success('Upload thành công!');
      },
      (error) => {
        this.message.error('Upload thất bại. Vui lòng thử lại!');
      }
    );
  }
  */

  handleOk(): void {
    const body = {
      userName: this.form.get('username')?.value,
      fullName: this.form.get('fullName')?.value,
      cellPhone: this.form.get('cellPhone')?.value,
      identityCardNumber: this.form.get('identityCardNumber')?.value,
      identityCardDate: this.form.get('identityCardDate')?.value,
      identityCardPlace: this.form.get('identityCardPlace')?.value,
      email: this.form.get('email')?.value,
      address: this.form.get('address')?.value,
      birthday: this.form.get('birthday')?.value,
      gender: this.form.get('gender')?.value,
      imageUrl: this.avatarUrl,
      urlIdentityCardImage: this.identityCardUrl,
      isAdmin: this.form.get('isAdmin')?.value,
    };    if (this.form.invalid) {
      console.log('Form is invalid. Form status:', this.form.status);
      console.log('Form errors:', this.getFormValidationErrors());
      
      // Debug each field
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control?.invalid) {
          console.log(`Field ${key} is invalid:`, control.errors, 'Value:', control.value);
        }
      });
      
      this.form.get('username')?.markAsTouched();
      this.form.get('fullName')?.markAsTouched();
      this.form.get('identityCardNumber')?.markAsTouched();
      this.form.get('identityCardDate')?.markAsTouched();
      this.form.get('identityCardPlace')?.markAsTouched();
      this.form.get('cellPhone')?.markAsTouched();
      this.form.get('address')?.markAsTouched();
      this.form.get('birthday')?.markAsTouched();
      this.form.get('gender')?.markAsTouched();
      this.form.get('email')?.markAsTouched();
      this.message.warning('Vui lòng điền đầy đủ các trường bắt buộc!');
      return;
    }
    this.managermentService.addAccountManagementOwner(body).subscribe({
      next: (res) => {
        console.log('API Response:', res); // Debug log
        console.log('Response type:', typeof res); // Debug log
        console.log('Response keys:', res ? Object.keys(res) : 'No keys'); // Debug log

        // Handle successful response - if we reach here without error, it's likely successful
        // Common success patterns: object with data, string response, boolean true, or even null/empty for some APIs
        const isSuccess = res !== false && res !== 'false'; // Only treat explicit false as failure

        if (isSuccess) {
          console.log('Success detected:', res);
          this.message.success('Tạo tài khoản thành công');
          this.visiblePopUpAddManagement.emit(false);
        } else {
          console.log('Response indicates failure:', res);
          this.message.error('Tạo tài khoản thất bại');
        }
      },
      error: (err) => {
        console.error('API Error:', err); // Debug log
        let errorMessage = 'Có lỗi xảy ra khi tạo tài khoản';

        if (err.error) {
          if (typeof err.error === 'string') {
            errorMessage = err.error.includes('|')
              ? err.error.split('|')[1]
              : err.error;
          } else if (err.error.message) {
            errorMessage = err.error.message;
          }
        } else if (err.message) {
          errorMessage = err.message;
        }

        this.message.error(errorMessage);
      },
    });
  }

  viewInfoUser(): void {
    this.managermentService.getUserById(this.idManagement).subscribe({
      next: (res) => {
        this.form.patchValue({
          username: res.userName,
          fullName: res.fullname,
          cellPhone: res.cellPhone,
          birthday: res.birthday,
          address: res.address,
          identityCardNumber: res.identityCardNumber,
          identityCardDate: res.identityCardDate,
          identityCardPlace: res.identityCardPlace,
          gender: res.gender,
          email: res.email,
          avatarUrl: res?.imageUrl,
          identityCardUrl: res?.urlIdentityCardImage,
        });
        this.avatarUrl = res.imageUrl;
        this.identityCardUrl = res.identityCardImage;
      },
      error: (err) => {
        this.message.error('Lấy dữ liệu người dùng thất bại!');
      },
    });
  }

  handleCancel(): void {
    this.visiblePopUpAddManagement.emit(false);
  }

  updateValidateRepass(e: any) {
    this.form.get('rePass')?.clearValidators();
    this.form.get('rePass')?.addValidators(rePassValidator(e.target.value));
  }
  showOldPass(e: any) {
    const inputPass = document.querySelector(
      '#inputPassChangeOldPassword',
    ) as HTMLInputElement;
    if (inputPass?.type === 'password') {
      inputPass.type = 'text';
      this.hideOldPass = false;
    } else {
      inputPass.type = 'password';
      this.hideOldPass = true;
    }
  }
  showPass(e: any) {
    const inputPass = document.querySelector(
      '#inputPassChangePassword',
    ) as HTMLInputElement;
    if (inputPass?.type === 'password') {
      inputPass.type = 'text';
      this.hidePass = false;
    } else {
      inputPass.type = 'password';
      this.hidePass = true;
    }
  }
  showRePass(e: any) {
    const inputPass = document.querySelector(
      '#inputRePassChangePassword',
    ) as HTMLInputElement;
    if (inputPass?.type === 'password') {
      inputPass.type = 'text';

      this.hideRePass = false;
    } else {
      inputPass.type = 'password';
      this.hideRePass = true;
    }
  }
  confirmModal?: NzModalRef;
  showAlerPhoneNumber(): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Thông báo',
      nzContent:
        'Bạn không thể xác minh tài khoản thông qua số điện thoại nếu bỏ trống',
      nzOnOk: () => {},
    });
  }
  showAlerEmail(): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Thông báo',
      nzContent:
        'Bạn không thể xác minh tài khoản thông qua email nếu bỏ trống',
      nzOnOk: () => {},
    });
  }
  handleConfirmEmail() {
    console.log('confirm email');
  }
  // Image upload functionality for ID Card
  handleFileChange(event: Event, type: 'avatar' | 'identityCard'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        this.message.error('Kích thước file không được vượt quá 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.message.error('Chỉ được chọn file ảnh (PNG, JPG, JPEG)');
        return;
      }

      this.uploadFile(file, type);
    }
  }

  uploadFile(file: File, type: 'avatar' | 'identityCard'): void {
    const formData = new FormData();
    formData.append('file', file);

    this.managermentService.uploadImage(formData).subscribe({
      next: (response) => {
        if (type === 'avatar') {
          this.avatarUrl = response.filename;
          this.form.get('avatarUrl')?.setValue(this.avatarUrl);
        } else {
          this.identityCardUrl = response.filename;
          this.form.get('identityCardUrl')?.setValue(this.identityCardUrl);
        }
        this.message.success('Upload thành công!');
      },
      error: (error) => {
        console.error('Upload error:', error);
        this.message.error('Upload thất bại. Vui lòng thử lại!');
      },
    });
  }

  removeIdentityCardImage(): void {
    this.identityCardUrl = null;
    this.form.get('identityCardUrl')?.setValue('');
    this.message.success('Đã xóa ảnh CCCD/CMND');
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById(
      'identityCardUpload',
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  getFormValidationErrors(): any {
    const formErrors: any = {};
    
    Object.keys(this.form.controls).forEach(key => {
      const controlErrors = this.form.get(key)?.errors;
      if (controlErrors) {
        formErrors[key] = controlErrors;
      }
    });
    
    return formErrors;
  }

  // Remove progress tracking as requested
  // getFormCompletionPercentage(): number {
  //   const requiredFields = ['fullName', 'gender', 'birthday', 'address', 'username', 'identityCardNumber', 'identityCardDate', 'identityCardPlace'];
  //   const completedFields = requiredFields.filter(field => {
  //     const control = this.form.get(field);
  //     return control && control.value && control.valid;
  //   });
  //   return Math.round((completedFields.length / requiredFields.length) * 100);
  // }
  handleEdit(): void {
    if (this.form.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.form.controls).forEach((key) => {
        this.form.get(key)?.markAsTouched();
      });
      return;
    }

    const body = {
      id: this.idManagement,
      userName: this.form.get('username')?.value,
      fullName: this.form.get('fullName')?.value,
      cellPhone: this.form.get('cellPhone')?.value,
      identityCardNumber: this.form.get('identityCardNumber')?.value,
      identityCardDate: this.form.get('identityCardDate')?.value,
      identityCardPlace: this.form.get('identityCardPlace')?.value,
      email: this.form.get('email')?.value,
      address: this.form.get('address')?.value,
      birthday: this.form.get('birthday')?.value,
      gender: this.form.get('gender')?.value,
      imageUrl: this.avatarUrl,
      urlIdentityCardImage: this.identityCardUrl,
      isAdmin: this.form.get('isAdmin')?.value,
    }; // Using existing service method for update
    this.managermentService.updateAccountManagement(body).subscribe({
      next: (res: any) => {
        console.log('Edit API Response:', res); // Debug log
        console.log('Edit Response type:', typeof res); // Debug log
        console.log('Edit Response keys:', res ? Object.keys(res) : 'No keys'); // Debug log

        // Handle successful response - if we reach here without error, it's likely successful
        const isSuccess = res !== false && res !== 'false'; // Only treat explicit false as failure

        if (isSuccess) {
          console.log('Edit success detected:', res);
          this.message.success('Cập nhật thông tin thành công');
          this.visiblePopUpAddManagement.emit(false);
        } else {
          console.log('Edit response indicates failure:', res);
          this.message.error('Cập nhật thông tin thất bại');
        }
      },
      error: (err: any) => {
        console.error('Edit API Error:', err); // Debug log
        let errorMessage = 'Cập nhật thông tin thất bại';

        if (err.error) {
          if (typeof err.error === 'string') {
            errorMessage = err.error.includes('|')
              ? err.error.split('|')[1]
              : err.error;
          } else if (err.error.message) {
            errorMessage = err.error.message;
          }
        } else if (err.message) {
          errorMessage = err.message;
        }

        this.message.error(errorMessage);
      },
    });
  }
}
