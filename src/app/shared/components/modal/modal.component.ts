import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StoreMagerDto } from 'src/app/features/store-page/states/user-manager';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnChanges{

  @Input() index: number ;
  @Input() title: string;
  @Input() listProduct: StoreMagerDto[];
  @Input() isLoading:boolean;
  @Input() total!: number;
  @Input() pageIndex!: number;
  @Input() pageSize!: number;
  @Input() addnew!: boolean;
  @Input() consiment!:boolean
  @Output() productselect = new EventEmitter<any>();
  @Output() closeModal = new EventEmitter<any>();
  @Output() pageIndexChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() searchProduct = new EventEmitter<string>();

  public  product={}
  public load:boolean ;


  public form: FormGroup = this.fb.group({
    search: [null],})

constructor(    private fb: FormBuilder){}

  ngOnChanges(changes: SimpleChanges): void {
    this.load = this.isLoading
  }
 

  changePage(e:any){
    this.pageIndexChange.emit(e)
  }
  changePageSize(e:any){
    this.pageSizeChange.emit(e)
  }

  slectProduct(id: string){
    const productchosse = this.listProduct.find(p => p.id === id);
    this.product={... productchosse, "index": this.index}
    this.productselect.emit( this.product);
  }
  close(){
    this.closeModal.emit("");
  }
  search(){
      this.searchProduct.emit(this.form.get("search")?.value)
      this.form.setValue({search : null})

  }
}
