export type ContentStatus = 'draft' | 'published'

export interface PrintingType {
  title: string
  description: string
  price: string
  features: string[]
}

export interface PrintingFeature {
  icon: 'Award' | 'Palette' | 'Zap' | 'CheckCircle'
  title: string
  description: string
}

export interface PrintingService {
  title: string
  description: string
  details: string[]
}

export interface PrintingFinish {
    name: string
    desc: string
    benefit: string
}

export interface PrintingProcessStep {
    step: string
    title: string
    desc: string
}

export interface PrintingRequirementList {
    title: string
    items: string[]
}

export interface PrintingPageContent {
  hero_image_url: string
  hero_image_alt: string
  hero_title: string
  hero_description: string
  features_title: string
  features: PrintingFeature[]
  types_title: string
  printing_types: PrintingType[]
  services_title: string
  services: PrintingService[]
  finishes_title: string
  finishes: PrintingFinish[]
  process_title: string
  process_steps: PrintingProcessStep[]
  requirements_title: string
  requirements: PrintingRequirementList[]
  cta_title: string
  cta_description: string
  cta_primary_label: string
  cta_primary_href: string
  cta_secondary_label: string
  cta_secondary_href: string
}

export const DEFAULT_PRINTING_PAGE_CONTENT: PrintingPageContent = {
  hero_image_url: '/images/hero-printing.jpg',
  hero_image_alt: 'Dịch vụ in ấn thùng carton',
  hero_title: 'Dịch Vụ In Ấn',
  hero_description: 'Dịch vụ in ấn chuyên nghiệp trên thùng carton với công nghệ in hiện đại',
  features_title: 'Ưu Điểm Dịch Vụ In Ấn',
  features: [
    { icon: 'Award', title: 'Công Nghệ In Hiện Đại', description: 'Sử dụng máy in hiện đại, cho chất lượng in ấn tuyệt vời và độ chính xác cao.' },
    { icon: 'Palette', title: 'Thiết Kế Chuyên Nghiệp', description: 'Đội ngũ thiết kế chuyên nghiệp hỗ trợ tạo ra những thiết kế đẹp mắt và hiệu quả.' },
    { icon: 'Zap', title: 'Xử Lý Nhanh Chóng', description: 'Quy trình in ấn nhanh chóng, đáp ứng yêu cầu gấp của khách hàng.' },
    { icon: 'CheckCircle', title: 'Kiểm Soát Chất Lượng', description: 'Kiểm soát chất lượng chặt chẽ ở mỗi bước để đảm bảo sản phẩm hoàn hảo.' },
  ],
  types_title: 'Loại In Ấn & Giá Cả',
  printing_types: [
    { title: 'In 1 Màu', description: 'In một màu đơn giản, tiết kiệm chi phí', price: '500-800 ₫/cái', features: ['Thích hợp cho thiết kế đơn giản', 'Giá rẻ nhất', 'Thời gian nhanh'] },
    { title: 'In 2-3 Màu', description: 'In 2-3 màu với độ chi tiết tốt', price: '1.000-1.500 ₫/cái', features: ['Logo rõ ràng', 'Nhiều màu sắc', 'Chi phí hợp lý'] },
    { title: 'In 4 Màu (Full Màu)', description: 'In đầy đủ màu CMYK với độ chi tiết cao', price: '1.500-2.500 ₫/cái', features: ['Chất lượng cao', 'Màu sắc sống động', 'Thiết kế chuyên nghiệp'] },
    { title: 'In Cao Cấp & Đặc Biệt', description: 'In với xử lý đặc biệt, bóng, mờ, lụa', price: '2.000-3.500 ₫/cái', features: ['Hiệu ứng bề mặt', 'Trông sang trọng', 'Ấn tượng mạnh'] },
  ],
  services_title: 'Dịch Vụ In Ấn Chi Tiết',
  services: [
      { title: 'In Logo & Thông Tin Công Ty', description: 'In thông tin công ty, logo, số điện thoại, website lên thùng carton.', details: ['✓ Logo đơn giản hoặc phức tạp', '✓ Thông tin liên hệ', '✓ Địa chỉ công ty', '✓ Mã QR code'] },
      { title: 'In Thiết Kế Custom', description: 'In thiết kế hoàn toàn tùy chỉnh theo yêu cầu của khách hàng.', details: ['✓ Thiết kế graphic độc đáo', '✓ Màu sắc đa dạng', '✓ Hình ảnh sắc nét', '✓ Bố cục linh hoạt'] },
      { title: 'In Mã Vạch & Tem', description: 'In mã vạch, QR code, tem, nhãn dán cho hàng hoá.', details: ['✓ Mã vạch tiêu chuẩn', '✓ QR code động', '✓ Tem bảo hành', '✓ Nhãn dán an toàn'] },
      { title: 'In Hộp Quà Tặng', description: 'In ấn cao cấp cho các hộp quà tặng, nâng cao giá trị sản phẩm.', details: ['✓ Thiết kế sang trọng', '✓ Finish cao cấp', '✓ Bao bì quà tặng', '✓ In nhiều màu'] },
      { title: 'In Các Ký Hiệu & Chứng Chỉ', description: 'In các ký hiệu bảo hành, sertifikat, chứng chỉ chất lượng.', details: ['✓ Logo chứng chỉ', '✓ Ký hiệu an toàn', '✓ Hạn sử dụng', '✓ Thông tin dinh dưỡng'] },
      { title: 'In Theo Mùa & Sự Kiện', description: 'In ấn đặc biệt cho các dịp mùa lễ, sự kiện, hoạt động tiếp thị.', details: ['✓ Thiết kế lễ hội', '✓ Công nghệ in đặc biệt', '✓ Hạn chế số lượng', '✓ Thiết kế độc đáo'] },
  ],
  finishes_title: 'Tùy Chọn Xử Lý Bề Mặt',
  finishes: [
    { name: 'Bóng (Glossy)', desc: 'Bề mặt bóng, sáng bóng', benefit: 'Màu sắc sống động, giá tốt' },
    { name: 'Mờ (Matte)', desc: 'Bề mặt mờ, tinh tế', benefit: 'Trông chuyên nghiệp, sang trọng' },
    { name: 'Lụa (Silk)', desc: 'Bề mặt lụa mịn', benefit: 'Cảm giác cao cấp, hiệu ứng đẹp' },
    { name: 'Nổi (Emboss)', desc: 'Nổi lên 3D', benefit: 'Ấn tượng mạnh, độc đáo' },
  ],
  process_title: 'Quy Trình In Ấn',
  process_steps: [
    { step: '1', title: 'Tiếp Nhận File', desc: 'Gửi file thiết kế' }, { step: '2', title: 'Kiểm Tra', desc: 'Kiểm duyệt file' }, { step: '3', title: 'In Mẫu', desc: 'In mẫu để xem' }, { step: '4', title: 'Sản Xuất', desc: 'In toàn bộ đơn hàng' }, { step: '5', title: 'Giao Hàng', desc: 'Vận chuyển' },
  ],
  requirements_title: 'Yêu Cầu File In Ấn',
  requirements: [
      { title: 'Định Dạng File', items: ['✓ PDF (khuyên dùng)', '✓ AI (Adobe Illustrator)', '✓ PSD (Photoshop)', '✓ PNG/JPG (độ phân giải cao ≥300 DPI)'] },
      { title: 'Yêu Cầu Kỹ Thuật', items: ['✓ Độ phân giải tối thiểu 300 DPI', '✓ Kích thước phù hợp với thùng', '✓ Màu sắc CMYK (không RGB)', '✓ Font chữ nhúng hoặc convert shape'] },
      { title: 'Lời Khuyên Thiết Kế', items: ['✓ Tránh sử dụng màu quá nhạt', '✓ Đảm bảo chữ đủ lớn để đọc', '✓ Để lề 5mm từ cạnh', '✓ Hình ảnh nên có độ tương phản cao'] },
  ],
  cta_title: 'Sẵn Sàng In Ấn Sản Phẩm Của Bạn?',
  cta_description: 'Liên hệ với chúng tôi để trao đổi về yêu cầu in ấn của bạn. Chúng tôi sẵn sàng hỗ trợ thiết kế nếu bạn chưa có file.',
  cta_primary_label: 'Liên Hệ Ngay',
  cta_primary_href: '/lien-he',
  cta_secondary_label: 'Yêu Cầu Báo Giá',
  cta_secondary_href: '/bao-gia',
};

// For simplicity, we are not creating a full normalizer for this complex object.
export function normalizePrintingPageContent(input: unknown): PrintingPageContent {
  if (typeof input === 'object' && input !== null && 'hero_title' in input) {
    return input as PrintingPageContent;
  }
  return DEFAULT_PRINTING_PAGE_CONTENT;
}
