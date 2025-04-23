import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GetListUnitBodyService {
  constructor() {}
  body: any = {
    id: 'bd30b50a-6e02-4e34-a417-05770859cbee'
  };
  body2: any = {
    id: localStorage.getItem('IDTenant')
  }
  setBodyGetListUnit(body: any) {
    console.log("Body: ", body)
    this.body = {...this.body, ...body};
  }
}
