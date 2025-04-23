export class createUnitModel {
  name?: string;
  description?: string;
  managerId?: string;
  managerName?: string;
  priority?: number;
  createdDate?: string;
  dueDate?: string;
  parentUnitId?: string;
  members?: any;
  [key: string]: any;
}
export class updateUnitModel {
  id: string;
  name?: string;
  description?: string;
  managerId?: string;
  managerName?: string;
  priority?: number;
  createdDate?: string;
  dueDate?: string;
  [key: string]: any;
}
export class getListUnitModel {
  unitId?: string;
  pageNumber: number;
  pageSize: number;
}
