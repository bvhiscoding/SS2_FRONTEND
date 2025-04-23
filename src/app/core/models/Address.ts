export interface City {
  value: string;
  label: string;
}

export interface District {
  value: string;
  label: string;
  parent: string;
}

export interface Ward {
  value: string;
  label: string;
  parent: string;
}
