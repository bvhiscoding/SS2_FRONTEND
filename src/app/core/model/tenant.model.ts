export class createTenantModel {
    name?: string;
    description?: string;
    managerId?: string;
    managerName?: string;
    priority?: number;
    createdDate?: string;
    dueDate?: string;
    memberIds?: any;
    [key: string]: any;
}

export class getListTenantModel {
    idUser?: string;
  }