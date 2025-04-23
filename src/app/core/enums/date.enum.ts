export const Months = [
  {
    title: 'Tháng 1',
    value: 1,
  },
  {
    title: 'Tháng 2',
    value: 2,
  },
  {
    title: 'Tháng 3',
    value: 3,
  },
  {
    title: 'Tháng 4',
    value: 4,
  },
  {
    title: 'Tháng 5',
    value: 5,
  },
  {
    title: 'Tháng 6',
    value: 6,
  },
  {
    title: 'Tháng 7',
    value: 7,
  },
  {
    title: 'Tháng 8',
    value: 8,
  },
  {
    title: 'Tháng 9',
    value: 9,
  },
  {
    title: 'Tháng 10',
    value: 10,
  },
  {
    title: 'Tháng 11',
    value: 11,
  },
  {
    title: 'Tháng 12',
    value: 12,
  },
];

export const Years: any[] = [];
for (let year = 1950; year <= 2100; year++) {
  Years.push({
    title: 'Năm ' + year,
    value: year,
  });
}

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export const initialDate = {
  startDate: new Date(2023, 6, 2),
  endDate: new Date(2023, 9, 2),
};


