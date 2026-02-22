export type ContentStatus = 'draft' | 'published'

export interface ProductsPageContent {
  hero_image_url: string
  hero_image_alt: string
  hero_title: string
  hero_description: string
  cta_title: string
  cta_description: string
  cta_button_label: string
  cta_button_href: string
}

export const DEFAULT_PRODUCTS_PAGE_CONTENT: ProductsPageContent = {
  hero_image_url: '/images/hero-products.jpg',
  hero_image_alt: 'Sản phẩm thùng carton Bao Bì Kim Thành Phát',
  hero_title: 'Sản Phẩm Của Chúng Tôi',
  hero_description: 'Khám phá các sản phẩm thùng carton chất lượng cao với nhiều lựa chọn và kích thước khác nhau.',
  cta_title: 'Không Tìm Thấy Sản Phẩm Bạn Cần?',
  cta_description: 'Liên hệ với chúng tôi để tìm hiểu về các giải pháp tùy chỉnh của chúng tôi.',
  cta_button_label: 'Yêu Cầu Báo Giá',
  cta_button_href: '/bao-gia',
}

function ensureString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : fallback
}

function ensureHref(value: unknown, fallback: string): string {
  if (typeof value !== 'string') return fallback
  const trimmed = value.trim()
  return trimmed.startsWith('/') || trimmed.startsWith('http') ? trimmed : fallback
}

export function normalizeProductsPageContent(input: unknown): ProductsPageContent {
  const source = typeof input === 'object' && input ? (input as Partial<ProductsPageContent>) : {}

  return {
    hero_image_url: ensureString(source.hero_image_url, DEFAULT_PRODUCTS_PAGE_CONTENT.hero_image_url),
    hero_image_alt: ensureString(source.hero_image_alt, DEFAULT_PRODUCTS_PAGE_CONTENT.hero_image_alt),
    hero_title: ensureString(source.hero_title, DEFAULT_PRODUCTS_PAGE_CONTENT.hero_title),
    hero_description: ensureString(source.hero_description, DEFAULT_PRODUCTS_PAGE_CONTENT.hero_description),
    cta_title: ensureString(source.cta_title, DEFAULT_PRODUCTS_PAGE_CONTENT.cta_title),
    cta_description: ensureString(source.cta_description, DEFAULT_PRODUCTS_PAGE_CONTENT.cta_description),
    cta_button_label: ensureString(source.cta_button_label, DEFAULT_PRODUCTS_PAGE_CONTENT.cta_button_label),
    cta_button_href: ensureHref(source.cta_button_href, DEFAULT_PRODUCTS_PAGE_CONTENT.cta_button_href),
  }
}
