export type ContentStatus = 'draft' | 'published'

export interface CustomBoxFeature {
  icon: 'Palette' | 'Wrench' | 'Zap' | 'CheckCircle'
  title: string
  description: string
}

export interface CustomBoxApplication {
  title: string
  description: string
}

export interface CustomBoxOption {
    title: string
    items: string[]
}

export interface CustomBoxProcessStep {
    step: string
    title: string
    desc: string
}

export interface CustomBoxesPageContent {
  hero_image_url: string
  hero_image_alt: string
  hero_title: string
  hero_description: string
  features_title: string
  features: CustomBoxFeature[]
  applications_title: string
  applications: CustomBoxApplication[]
  options_title: string
  options: CustomBoxOption[]
  process_title: string
  process_steps: CustomBoxProcessStep[]
  cta_title: string
  cta_description: string
  cta_primary_label: string
  cta_primary_href: string
  cta_secondary_label: string
  cta_secondary_href: string
}

export const DEFAULT_CUSTOM_BOXES_PAGE_CONTENT: CustomBoxesPageContent = {
  hero_image_url: '/images/hero-custom.jpg',
  hero_image_alt: 'Thùng carton chuyên dụng',
  hero_title: 'Thùng Carton Chuyên Dụng',
  hero_description: 'Giải pháp bao bì chuyên dụng cho các ngành công nghiệp khác nhau',
  features_title: 'Ưu Điểm Nổi Bật',
  features: [
    { icon: 'Palette', title: 'Thiết Kế Tùy Chỉnh', description: 'Thiết kế hoàn toàn tùy chỉnh theo yêu cầu của khách hàng, không giới hạn kích thước và màu sắc.' },
    { icon: 'Wrench', title: 'Xử Lý Chuyên Nghiệp', description: 'Sử dụng công nghệ hiện đại và quy trình sản xuất chuyên nghiệp đảm bảo chất lượng cao.' },
    { icon: 'Zap', title: 'Giao Hàng Nhanh', description: 'Thời gian giao hàng nhanh chóng, hỗ trợ đặt hàng nhanh khi khách hàng cần gấp.' },
    { icon: 'CheckCircle', title: 'Chất Lượng Đảm Bảo', description: 'Kiểm soát chất lượng chặt chẽ ở mỗi bước, đảm bảo sản phẩm đạt tiêu chuẩn cao nhất.' },
  ],
  applications_title: 'Ứng Dụng Theo Ngành Công Nghiệp',
  applications: [
    { title: 'Thực Phẩm & Đồ Uống', description: 'Thùng carton chuyên dụng cho các sản phẩm thực phẩm, bánh kẹo, nước uống với khả năng bảo quản tốt.' },
    { title: 'Điện Tử & Công Nghệ', description: 'Thùng bảo vệ cao cấp cho các thiết bị điện tử, điện thoại, máy tính với lót chắc chắn.' },
    { title: 'Mỹ Phẩm & Dược Phẩm', description: 'Thùng carton sang trọng, an toàn cho các sản phẩm mỹ phẩm, dược phẩm với thiết kế chuyên dụng.' },
    { title: 'Thời Trang & Dệt May', description: 'Thùng carton linh hoạt với các kích thước đa dạng phù hợp cho quần áo, giày dép.' },
    { title: 'Quà Tặng & Hàng Lưu Niệm', description: 'Thùng carton cao cấp với thiết kế đẹp mắt, in ấn sắc nét cho các sản phẩm quà tặng.' },
    { title: 'Logistics & Vận Chuyển', description: 'Thùng carton chuyên dụng cho vận chuyển hàng hoá, bảo vệ tối đa trong quá trình di chuyển.' },
  ],
  options_title: 'Tùy Chọn Tùy Chỉnh',
  options: [
      { title: 'Kích Thước & Hình Dạng', items: ['Kích thước tùy chỉnh theo yêu cầu', 'Hình dạng đặc biệt (hình chữ nhật, vuông, trụ)', 'Lỗ cắt đặc biệt', 'Khe đóng và khóa tùy chỉnh', 'Cánh gập linh hoạt'] },
      { title: 'Chất Liệu & Xử Lý', items: ['Carton từ 2-5 lớp', 'Giấy kraft tự nhiên hoặc trắng', 'Lót chắc chắn để bảo vệ hàng', 'Xử lý chống ẩm, chống dầu', 'Vật liệu thân thiện với môi trường'] },
      { title: 'In Ấn & Thiết Kế', items: ['In lên đến 4 màu', 'In full màu (CMYK)', 'Thiết kế logo chuyên nghiệp', 'Cắt đặc biệt (chữ nổi, bế)', 'Mã vạch và QR code'] },
      { title: 'Các Tùy Chọn Khác', items: ['Tem dán chuyên dụng', 'Xử lý bề mặt (bóng, mờ, lụa)', 'Hộp quà tặng cao cấp', 'Thiết kế bao bì sáng tạo', 'Hỗ trợ thiết kế miễn phí'] }
  ],
  process_title: 'Quy Trình Sản Xuất',
  process_steps: [
      { step: '1', title: 'Tư Vấn', desc: 'Trao đổi yêu cầu và ý tưởng' },
      { step: '2', title: 'Thiết Kế', desc: 'Thiết kế mẫu theo nhu cầu' },
      { step: '3', title: 'Sản Xuất', desc: 'Sản xuất số lượng lớn' },
      { step: '4', title: 'Giao Hàng', desc: 'Vận chuyển an toàn đến bạn' },
  ],
  cta_title: 'Cần Thùng Carton Chuyên Dụng?',
  cta_description: 'Liên hệ với chúng tôi ngay để nhận tư vấn miễn phí và báo giá tùy chỉnh cho sản phẩm của bạn.',
  cta_primary_label: 'Liên Hệ Ngay',
  cta_primary_href: '/lien-he',
  cta_secondary_label: 'Yêu Cầu Báo Giá',
  cta_secondary_href: '/bao-gia',
};

// For simplicity, we are not creating a full normalizer for this complex object.
export function normalizeCustomBoxesPageContent(input: unknown): CustomBoxesPageContent {
  if (typeof input === 'object' && input !== null && 'hero_title' in input) {
    return input as CustomBoxesPageContent;
  }
  return DEFAULT_CUSTOM_BOXES_PAGE_CONTENT;
}
