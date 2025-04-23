export const typeCars = [
  {
    label: 'Xe con, xe du lịch',
    value: 'PCR',
  },
  {
    label: 'Xe mỏ',
    value: 'OTR',
  },
  {
    label: 'Xe tải',
    value: 'TBR',
  },
  {
    label: 'Các loại khác',
    value: 'OTHER',
  },
];

export const listStatusCars = [
  {
    value: 0,
    title: 'Chưa xử lý',
    color: 'text-[#000]',
  },
  {
    value: 1,
    title: 'Đã xử lý xong (tự động)',
    color: 'text-[#18AA7E]',
  },
  {
    value: 2,
    title: 'Đã xử lý xong (thủ công)',
    color: 'text-[#18AA7E]',
  },
  {
    value: 10,
    title: 'Xử lý tự động có size không có brand',
    color: 'text-[#E6AD2F]',
  },
  {
    value: 11,
    title: 'Xử lý tự động không có size và có brand',
    color: 'text-[#E6AD2F]',
  },
  {
    value: -1,
    title: 'Xử lý nhưng không nhận diện được',
    color: 'text-[#CF002A]',
  },
  {
    value: -99,
    title: 'Bỏ qua',
    color: 'text-[#C4C4C4]',
  },
];

export const additionalData = [
  {
    value: 'year',
    title: 'Năm',
  },
  {
    value: 'month',
    title: 'Tháng',
  },
  {
    value: 'cearanceDate',
    title: 'Ngày thông quan',
  },
  {
    value: 'taxCode',
    title: 'MST',
  },
  {
    value: 'companyImport',
    title: 'Cty nhập khẩu',
  },
  {
    value: 'companyAddressImport',
    title: 'Địa chỉ cty nhập khẩu',
  },
  {
    value: 'companyExport',
    title: 'Cty xuất khẩu',
  },
  {
    value: 'companyAddressExport',
    title: 'Địa chỉ cty xuất khẩu',
  },
  {
    value: 'importTax',
    title: 'Thuế nhập khẩu',
  },
  {
    value: 'original',
    title: 'Xuất xứ',
  },
  {
    value: 'unit',
    title: 'Mã đơn vị tính giá',
  },
  {
    value: 'quantity',
    title: 'Số lượng',
  },
  {
    value: 'originalCurrencyUnit',
    title: 'Đơn giá nguyên tệ',
  },
  {
    value: 'priceUSD',
    title: 'Đơn giá USD',
  },
  {
    value: 'usdValue',
    title: 'Trị giá USD',
  },
  {
    value: 'usdRate',
    title: 'Tỷ giá USD',
  },
  {
    value: 'coinCode',
    title: 'Mã đồng tiền',
  },
  {
    value: 'priceConditions',
    title: 'Điều kiện giá',
  },
  {
    value: 'paymentMethods',
    title: 'Phương thức thanh toán',
  },
  {
    value: 'customsBranch',
    title: 'Chi cục Hải quan',
  },
  {
    value: 'typeName',
    title: 'Tên loại hình',
  },
  {
    value: 'countryExport',
    title: 'Tên nước xuất khẩu',
  },
  {
    value: 'countryImport',
    title: 'Tên nước nhập khẩu',
  },
  {
    value: 'queueLocation',
    title: 'Địa điểm xếp hàng',
  },
  {
    value: 'unloadingLocation',
    title: 'Địa điểm dỡ hàng',
  },
  {
    value: 'numberDeclarations',
    title: 'Số tờ khai',
  },
];

//type Droplist
//1: HsCode, 2: CompanyImport, 3: Original, 4: CountryExport, 5: TaxCode, 6: Size, 7: Label, 8:Type

