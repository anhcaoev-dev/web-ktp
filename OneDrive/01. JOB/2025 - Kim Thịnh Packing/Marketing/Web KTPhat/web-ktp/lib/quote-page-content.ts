export type ContentStatus = 'draft' | 'published'

export interface QuotePricingCard {
  title: string
  price: string
  price_description: string
  features: string[]
}

export interface QuotePrintingService {
  title: string
  description: string
}

export interface QuotePageContent {
  hero_image_url: string
  hero_image_alt: string
  hero_title: string
  hero_description: string
  form_title: string
  form_description: string
  pricing_section_title: string
  pricing_cards: QuotePricingCard[]
  printing_section_title: string
  printing_services: QuotePrintingService[]
}

export const DEFAULT_QUOTE_PAGE_CONTENT: QuotePageContent = {
  hero_image_url: '/images/hero-quote.jpg',
  hero_image_alt: 'Báo giá thùng carton',
  hero_title: 'Báo Giá & Tính Giá',
  hero_description: 'Sử dụng công cụ tính giá của chúng tôi để có được báo giá nhanh và chính xác.',
  form_title: 'Yêu Cầu Báo Giá Chi Tiết',
  form_description: 'Điền đầy đủ thông tin để nhận báo giá tùy chỉnh',
  pricing_section_title: 'Thông Tin Giá Cả',
  pricing_cards: [
    {
      title: 'Thùng Carton Tiêu Chuẩn',
      price: '2.500 ₫/cái',
      price_description: 'Giá khởi điểm (1-100 cái)',
      features: ['101-500: 5% OFF', '501-1.000: 10% OFF', '1.001-5.000: 15% OFF', '5.001+: 20% OFF'],
    },
    {
      title: 'Thùng Carton Có Lót',
      price: '3.500 ₫/cái',
      price_description: 'Giá khởi điểm (1-100 cái)',
      features: ['✓ Bảo vệ sản phẩm tốt', '✓ Lót giấy chắc chắn', '✓ Thích hợp cho hàng dễ vỡ'],
    },
    {
      title: 'Thùng Carton Chuyên Dụng',
      price: '5.000 ₫/cái',
      price_description: 'Giá khởi điểm (1-100 cái)',
      features: ['✓ Thiết kế tùy chỉnh', '✓ Đáp ứng yêu cầu đặc biệt', '✓ Chất lượng cao cấp'],
    },
  ],
  printing_section_title: 'Dịch Vụ In Ấn Bổ Sung',
  printing_services: [
    {
      title: 'In Ấn Cơ Bản',
      description: 'In logo, thông tin công ty, hoặc thiết kế đơn giản trên thùng. Giá từ 500-1.000 ₫/cái.',
    },
    {
      title: 'In Ấn Cao Cấp',
      description: 'In đa màu, gradient, hoặc thiết kế phức tạp. Giá từ 1.500-3.000 ₫/cái.',
    },
  ],
}

// For simplicity, we are not creating a full normalizer for this complex object.
// The admin UI will be responsible for providing the correct shape.
// A real production app should have a robust normalizer here.
export function normalizeQuotePageContent(input: unknown): QuotePageContent {
  if (typeof input === 'object' && input !== null && 'hero_title' in input) {
    return input as QuotePageContent
  }
  return DEFAULT_QUOTE_PAGE_CONTENT
}
