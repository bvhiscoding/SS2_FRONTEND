import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GetListTodoBodyService {
  userInfor: any = JSON.parse(
    localStorage.getItem('id_token_claims_obj') || '{}',
  );
  constructor() {}
  body: any = {
    pageNumber: 1,
    pageSize: 10,
    // ownerId: this.userInfor.sub,
  };
  setBodyGetListTodo(body: any) {
    this.body = body;
  }
}
