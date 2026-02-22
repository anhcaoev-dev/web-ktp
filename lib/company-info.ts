export interface CompanyInfo {
  company_name: string
  short_name: string
  tagline: string
  description: string
  phone: string
  email: string
  address: string
  working_hours: string
  logo_url: string
  logo_text: string
}

export const DEFAULT_COMPANY_INFO: CompanyInfo = {
  company_name: 'Bao Bì Kim Thành Phát',
  short_name: 'KTP',
  tagline: 'Sản xuất thùng carton chuyên dụng',
  description:
    'Nhà sản xuất trực tiếp thùng carton theo yêu cầu với năng lực sản xuất lớn, giá sỉ tận xưởng.',
  phone: 'Cập nhật số điện thoại',
  email: 'Cập nhật email',
  address: 'Cập nhật địa chỉ xưởng/văn phòng',
  working_hours: 'Thứ 2 - Thứ 6: 08:00 - 17:00\nThứ 7: 08:00 - 12:00\nChủ Nhật: Đóng cửa',
  logo_url: '',
  logo_text: 'KTP',
}

export function normalizeCompanyInfo(data?: Partial<CompanyInfo> | null): CompanyInfo {
  return {
    company_name: data?.company_name?.trim() || DEFAULT_COMPANY_INFO.company_name,
    short_name: data?.short_name?.trim() || DEFAULT_COMPANY_INFO.short_name,
    tagline: data?.tagline?.trim() || DEFAULT_COMPANY_INFO.tagline,
    description: data?.description?.trim() || DEFAULT_COMPANY_INFO.description,
    phone: data?.phone?.trim() || DEFAULT_COMPANY_INFO.phone,
    email: data?.email?.trim() || DEFAULT_COMPANY_INFO.email,
    address: data?.address?.trim() || DEFAULT_COMPANY_INFO.address,
    working_hours: data?.working_hours?.trim() || DEFAULT_COMPANY_INFO.working_hours,
    logo_url: data?.logo_url?.trim() || '',
    logo_text: data?.logo_text?.trim() || DEFAULT_COMPANY_INFO.logo_text,
  }
}
