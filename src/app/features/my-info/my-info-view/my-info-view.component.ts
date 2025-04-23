import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { phoneNumberValidator } from '../../../shared/validate/check-phone-number.directive';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AddressService } from '../../../core/api/address.service';
import { AccountService } from '../../../core/api/account.service';
import { ManagermentService } from '../../../core/api/managerment.service';


@Component({
  selector: 'app-my-info-view',
  standalone: true,
  imports: [
    NzModalModule,
    NzIconModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    NzSelectModule,
    TranslateModule,
    NzButtonModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
  ],
  templateUrl: './my-info-view.component.html',
  styleUrl: './my-info-view.component.scss'
})
export class MyInfoViewComponent implements OnInit {
  requiredMsg: string = '';
  fullName: string = '';
  isLoadingSaveEdit: boolean = false;
  isEdit: boolean = false;
  idOwner: any;
  nameOwner: any;
  cityData: any = [];
  districtData: any = [];
  wardsData: any = [];
  identityCardUrl: string | null = null;
  avatarPreview:string = "../../../assets/img/Logo-Hoc-Vien-Ky-Thuat-Mat-Ma-ACTVN.webp"
  public listGender: any = [
    {
      value: true,
      label: 'Nam',
    },
    {
      value: false,
      label: 'Nữ',
    },
  ];
  constructor(
      private fb: FormBuilder,
      private translate: TranslateService,
      private message: NzMessageService,
      private modal: NzModalService,
      private cdr: ChangeDetectorRef,
      private accountService: AccountService,
      private addressService: AddressService,
      private managermentService: ManagermentService,
  ) {
      this.translate
          .get('settings.securityTab.noEmty')
          .subscribe((value) => (this.requiredMsg = value));
      this.translate.onLangChange.subscribe((e) => {
          this.translate
              .get('settings.securityTab.noEmty')
              .subscribe((value) => (this.requiredMsg = value));
      });
     
  }
  ngOnInit(): void {
      this.form.disable();
      this.idOwner = JSON.parse(
        localStorage.getItem('id_token_claims_obj') || '{}',
      )?.sub;
      this.nameOwner = JSON.parse(
        localStorage.getItem('id_token_claims_obj') || '{}',
      )?.name;
      this.getCity();
      this.getViewInfo();
  }
  
  handleEdit(): void {
      this.isEdit = !this.isEdit
      if( this.isEdit ){
          this.form.enable()
          this.form.get('email')?.disable();
          this.form.get('userName')?.disable();
      } else {
          this.form.disable();
      }
  }
  public form: FormGroup = this.fb.group({
      fullName: [null, Validators.required],
      userName: [null, Validators.required],
      dob: [null, Validators.required],
      phoneNumber: [null, [Validators.required, phoneNumberValidator()]],
      email: [null, [Validators.required, Validators.email]],
      address: [null, Validators.required],
      gender: [true, Validators.required],
      idNumber: [null, Validators.required],
      dateOfIssue: [null, Validators.required],
      placeOfIssue: [null, Validators.required],
      identityCardUrl: ['']
  });

    // avatar change
  public avatarChangeForm: FormGroup = this.fb.group({
      image: [null]
  }) 

  getViewInfo(): void {
    this.accountService.getViewInfo().subscribe({
      next: (res) => {
        this.fullName = res.fullname;
        this.form.patchValue({
          fullName: res.fullname,
          userName: res.userName,
          dob: res.birthday,
          gender: res.gender,
          phoneNumber: res.cellPhone,
          email: res.newEmail === null ? res.email : res.newEmail,
          provice: res.provice,
          district: res.district,
          ward: res.ward,
          idNumber: res.identityCardNumber,
          dateOfIssue: res.identityCardDate,
          placeOfIssue: res.identityCardPlace,
          address: res.address,
          personalNote: res.personalNote,
          identityCardUrl: res.identityCardImage,
        });
        this.avatarPreview = res.imageUrl;
        this.identityCardUrl = res.identityCardImage;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.message.error('Lỗi không hiển thị thông tin');
      },
    })
  }

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
          this.avatarPreview = response.filename;
          this.avatarChangeForm.get('image')?.setValue(this.avatarPreview);
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

  handleSubmit(): void {
      // if (this.form.invalid) {
      //     this.form.markAsDirty()
      // } else {}
      const body = {
        fullName: this.form.get('fullName')?.value,
        gender: this.form.get('gender')?.value,
        address: this.form.get('address')?.value,
        birthday: this.form.get('dob')?.value,
        cellPhone: this.form.get('phoneNumber')?.value,
        imageUrl: this.avatarPreview,
        identityCardImage: this.identityCardUrl,
        identityCardNumber: this.form.get('idNumber')?.value,
        identityCardDate: this.form.get('dateOfIssue')?.value,
        identityCardPlace: this.form.get('placeOfIssue')?.value,
    }
    this.accountService.updateInfo(body).subscribe({
      next: (res) => {
        this.message.success('Cập nhật thông tin thành công');
        this.getViewInfo();
        this.isEdit = false;
        this.form.disable();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.message.error('Cập nhật thông tin thất bại');
      },
    });
  }
  handleCancel(): void {
      
  }

  
  changeCity(data: any) {
    this.getDistricts(data);
  }
  getCity() {
    this.addressService.getListCity().subscribe({
      next: (data: any) => {
        this.cityData = data;
        this.cdr.detectChanges();
      }
    }
    );
  }
  getDistricts(data: string) {
    this.addressService.getDistricts(data).subscribe({
      next:(value: any) => {
        this.districtData = value;
        this.cdr.detectChanges();
      }
    });
  }
  getWards(data: string) {
    this.addressService.getWards(data).subscribe( {
      next: (value) => {
        this.wardsData = value;
      },
    });
  }
  changeDistrict(data: any) {
    this.getWards(data);
  }


}
