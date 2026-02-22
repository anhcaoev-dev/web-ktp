export type ContentStatus = 'draft' | 'published'

export interface HomeAdvantageItem {
  title: string
  description: string
  icon: 'package' | 'trending_up' | 'zap' | 'check_circle' | 'factory' | 'truck' | 'award' | 'users'
}

export interface HomeFeaturedProductItem {
  title: string
  description: string
  detail: string
  cta_label: string
  cta_href: string
}

export interface HomeServiceItem {
  title: string
  description: string
  cta_label: string
  cta_href: string
}

export interface HomeStatItem {
  value: string
  label: string
  suffix?: string
}

export interface HomeProcessStep {
  step_number: number
  title: string
  description: string
  icon: 'file-text' | 'scissors' | 'print' | 'package' | 'truck' | 'check-circle'
}

export interface HomeCustomerItem {
  name: string
  logo_url: string
  logo_alt: string
}

export interface HomePageContent {
  hero_image_url: string
  hero_image_alt: string
  hero_title: string
  hero_description: string
  hero_primary_label: string
  hero_primary_href: string
  hero_secondary_label: string
  hero_secondary_href: string
  factory_title: string
  factory_images: string[]
  factory_description: string
  stats_title: string
  stats: HomeStatItem[]
  advantages_title: string
  advantages: HomeAdvantageItem[]
  featured_title: string
  featured_view_all_label: string
  featured_view_all_href: string
  featured_products: HomeFeaturedProductItem[]
  process_title: string
  process_description: string
  process_steps: HomeProcessStep[]
  services_title: string
  services: HomeServiceItem[]
  customers_title: string
  customers: HomeCustomerItem[]
  cta_title: string
  cta_description: string
  cta_button_label: string
  cta_button_href: string
}

const DEFAULT_STATS: HomeStatItem[] = [
  {
    value: '15',
    label: 'Năm kinh nghiệm',
    suffix: '+',
  },
  {
    value: '500',
    label: 'Khách hàng',
    suffix: '+',
  },
  {
    value: '1000',
    label: 'Đơn hàng',
    suffix: '+',
  },
  {
    value: '50',
    label: 'Nhân viên',
    suffix: '+',
  },
]

const DEFAULT_PROCESS_STEPS: HomeProcessStep[] = [
  {
    step_number: 1,
    title: 'Tiếp nhận yêu cầu',
    description: 'Tư vấn và hiểu nhu cầu đóng gói của khách hàng',
    icon: 'file-text',
  },
  {
    step_number: 2,
    title: 'Thiết kế mẫu',
    description: 'Thiết kế và sản xuất mẫu theo yêu cầu',
    icon: 'scissors',
  },
  {
    step_number: 3,
    title: 'Sản xuất',
    description: 'Sản xuất hàng loạt với kiểm soát chất lượng',
    icon: 'print',
  },
  {
    step_number: 4,
    title: 'Giao hàng',
    description: 'Giao hàng tận nơi đúng hẹn',
    icon: 'truck',
  },
]

const DEFAULT_ADVANTAGES: HomeAdvantageItem[] = [
  {
    title: 'Nhà sản xuất trực tiếp',
    description: 'Sản xuất theo yêu cầu của khách hàng với kiểm soát chất lượng toàn diện.',
    icon: 'factory',
  },
  {
    title: 'Năng lực sản xuất lớn',
    description: 'Đáp ứng đơn hàng số lượng lớn với thời gian giao hàng nhanh chóng.',
    icon: 'trending_up',
  },
  {
    title: 'Giá sỉ tận gốc',
    description: 'Giá cạnh tranh với chất lượng ổn định cho doanh nghiệp.',
    icon: 'zap',
  },
  {
    title: 'Giao hàng linh hoạt',
    description: 'Tối ưu vận chuyển, giao đúng hẹn theo nhu cầu thực tế.',
    icon: 'truck',
  },
]

const DEFAULT_FEATURED_PRODUCTS: HomeFeaturedProductItem[] = [
  {
    title: 'Thùng carton tiêu chuẩn',
    description: 'Kích thước và thiết kế linh hoạt.',
    detail: 'Phù hợp cho đóng gói sản phẩm thông thường.',
    cta_label: 'Tìm hiểu thêm',
    cta_href: '/san-pham',
  },
  {
    title: 'Thùng carton có lót',
    description: 'Tăng độ bền và khả năng bảo vệ.',
    detail: 'Phù hợp cho sản phẩm dễ vỡ, cần bọc lót chống sốc.',
    cta_label: 'Tìm hiểu thêm',
    cta_href: '/san-pham',
  },
  {
    title: 'Thùng carton chuyên dụng',
    description: 'Tối ưu theo ngành hàng đặc thù.',
    detail: 'Phù hợp cho sản phẩm đặc biệt và đơn hàng tùy biến.',
    cta_label: 'Tìm hiểu thêm',
    cta_href: '/san-pham',
  },
]

const DEFAULT_SERVICES: HomeServiceItem[] = [
  {
    title: 'Thùng carton chuyên dụng',
    description:
      'Cung cấp các loại thùng carton thiết kế riêng cho nhu cầu đặc thù của nhiều ngành hàng.',
    cta_label: 'Tìm hiểu thêm',
    cta_href: '/thung-carton-chuyen-dung',
  },
  {
    title: 'Dịch vụ in ấn',
    description:
      'Giải pháp in ấn trên bao bì carton với chất lượng in ổn định và màu sắc rõ nét.',
    cta_label: 'Tìm hiểu thêm',
    cta_href: '/dich-vu-in-an',
  },
]

const DEFAULT_CUSTOMERS: HomeCustomerItem[] = [
  {
    name: 'Khách hàng 1',
    logo_url: '',
    logo_alt: 'Logo khách hàng',
  },
  {
    name: 'Khách hàng 2',
    logo_url: '',
    logo_alt: 'Logo khách hàng',
  },
  {
    name: 'Khách hàng 3',
    logo_url: '',
    logo_alt: 'Logo khách hàng',
  },
  {
    name: 'Khách hàng 4',
    logo_url: '',
    logo_alt: 'Logo khách hàng',
  },
  {
    name: 'Khách hàng 5',
    logo_url: '',
    logo_alt: 'Logo khách hàng',
  },
  {
    name: 'Khách hàng 6',
    logo_url: '',
    logo_alt: 'Logo khách hàng',
  },
]

export const DEFAULT_HOME_PAGE_CONTENT: HomePageContent = {
  hero_image_url: '/images/hero-home.jpg',
  hero_image_alt: 'Nhà sản xuất thùng carton chuyên nghiệp',
  hero_title: 'Thùng Carton Chất Lượng Cao Từ Nhà Sản Xuất Trực Tiếp',
  hero_description:
    'Cung cấp và sản xuất các loại thùng carton theo yêu cầu với năng lực lớn, giá tận gốc và giao hàng nhanh.',
  hero_primary_label: 'Yêu cầu báo giá',
  hero_primary_href: '/bao-gia',
  hero_secondary_label: 'Xem sản phẩm',
  hero_secondary_href: '/san-pham',
  factory_title: 'Xưởng Sản Xuất',
  factory_images: ['/images/factory-1.jpg', '/images/factory-2.jpg', '/images/factory-3.jpg', '/images/factory-4.jpg'],
  factory_description: 'Xưởng sản xuất hiện đại với đầy đủ máy móc và thiết bị tiên tiến, đảm bảo chất lượng sản phẩm và tiến độ giao hàng.',
  stats_title: 'Đồng hành cùng doanh nghiệp Việt',
  stats: DEFAULT_STATS,
  advantages_title: 'Tại sao chọn chúng tôi?',
  advantages: DEFAULT_ADVANTAGES,
  featured_title: 'Sản phẩm nổi bật',
  featured_view_all_label: 'Xem tất cả',
  featured_view_all_href: '/san-pham',
  featured_products: DEFAULT_FEATURED_PRODUCTS,
  process_title: 'Quy Trình Sản Xuất',
  process_description: 'Quy trình sản xuất chuyên nghiệp, đảm bảo chất lượng và tiến độ',
  process_steps: DEFAULT_PROCESS_STEPS,
  services_title: 'Dịch vụ của chúng tôi',
  services: DEFAULT_SERVICES,
  customers_title: 'Khách Hàng Của Kim Thành Phát',
  customers: DEFAULT_CUSTOMERS,
  cta_title: 'Sẵn sàng bắt đầu với chúng tôi?',
  cta_description:
    'Liên hệ ngay để nhận tư vấn và báo giá chi tiết cho nhu cầu đóng gói của doanh nghiệp bạn.',
  cta_button_label: 'Liên hệ ngay',
  cta_button_href: '/lien-he',
}

function ensureString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : fallback
}

function ensureHref(value: unknown, fallback: string): string {
  if (typeof value !== 'string') return fallback
  const trimmed = value.trim()
  return trimmed.startsWith('/') || trimmed.startsWith('http') ? trimmed : fallback
}

function normalizeAdvantageItem(item: unknown, index: number): HomeAdvantageItem {
  const fallback = DEFAULT_ADVANTAGES[index] ?? DEFAULT_ADVANTAGES[0]
  const source = typeof item === 'object' && item ? (item as Partial<HomeAdvantageItem>) : {}
  const icon = source.icon
  const validIcons: HomeAdvantageItem['icon'][] = ['package', 'trending_up', 'zap', 'check_circle', 'factory', 'truck', 'award', 'users']
  const normalizedIcon: HomeAdvantageItem['icon'] = validIcons.includes(icon as HomeAdvantageItem['icon']) 
    ? (icon as HomeAdvantageItem['icon']) 
    : fallback.icon

  return {
    title: ensureString(source.title, fallback.title),
    description: ensureString(source.description, fallback.description),
    icon: normalizedIcon,
  }
}

function normalizeStatItem(item: unknown, index: number): HomeStatItem {
  const fallback = DEFAULT_STATS[index] ?? DEFAULT_STATS[0]
  const source = typeof item === 'object' && item ? (item as Partial<HomeStatItem>) : {}

  return {
    value: ensureString(source.value, fallback.value),
    label: ensureString(source.label, fallback.label),
    suffix: ensureString(source.suffix, fallback.suffix || ''),
  }
}

function normalizeProcessStep(item: unknown, index: number): HomeProcessStep {
  const fallback = DEFAULT_PROCESS_STEPS[index] ?? DEFAULT_PROCESS_STEPS[0]
  const source = typeof item === 'object' && item ? (item as Partial<HomeProcessStep>) : {}
  const icon = source.icon
  const validIcons: HomeProcessStep['icon'][] = ['file-text', 'scissors', 'print', 'package', 'truck', 'check-circle']
  const normalizedIcon: HomeProcessStep['icon'] = validIcons.includes(icon as HomeProcessStep['icon'])
    ? (icon as HomeProcessStep['icon'])
    : fallback.icon

  return {
    step_number: source.step_number || fallback.step_number,
    title: ensureString(source.title, fallback.title),
    description: ensureString(source.description, fallback.description),
    icon: normalizedIcon,
  }
}

function normalizeCustomerItem(item: unknown, index: number): HomeCustomerItem {
  const fallback = DEFAULT_CUSTOMERS[index] ?? DEFAULT_CUSTOMERS[0]
  const source = typeof item === 'object' && item ? (item as Partial<HomeCustomerItem>) : {}

  return {
    name: ensureString(source.name, fallback.name),
    logo_url: ensureString(source.logo_url, fallback.logo_url),
    logo_alt: ensureString(source.logo_alt, fallback.logo_alt),
  }
}

function normalizeFeaturedProductItem(item: unknown, index: number): HomeFeaturedProductItem {
  const fallback = DEFAULT_FEATURED_PRODUCTS[index] ?? DEFAULT_FEATURED_PRODUCTS[0]
  const source =
    typeof item === 'object' && item ? (item as Partial<HomeFeaturedProductItem>) : {}

  return {
    title: ensureString(source.title, fallback.title),
    description: ensureString(source.description, fallback.description),
    detail: ensureString(source.detail, fallback.detail),
    cta_label: ensureString(source.cta_label, fallback.cta_label),
    cta_href: ensureHref(source.cta_href, fallback.cta_href),
  }
}

function normalizeServiceItem(item: unknown, index: number): HomeServiceItem {
  const fallback = DEFAULT_SERVICES[index] ?? DEFAULT_SERVICES[0]
  const source = typeof item === 'object' && item ? (item as Partial<HomeServiceItem>) : {}

  return {
    title: ensureString(source.title, fallback.title),
    description: ensureString(source.description, fallback.description),
    cta_label: ensureString(source.cta_label, fallback.cta_label),
    cta_href: ensureHref(source.cta_href, fallback.cta_href),
  }
}

export function normalizeHomePageContent(input: unknown): HomePageContent {
  const source = typeof input === 'object' && input ? (input as Partial<HomePageContent>) : {}

  const advantagesSource = Array.isArray(source.advantages) ? source.advantages : []
  const featuredSource = Array.isArray(source.featured_products) ? source.featured_products : []
  const servicesSource = Array.isArray(source.services) ? source.services : []
  const statsSource = Array.isArray(source.stats) ? source.stats : []
  const processSource = Array.isArray(source.process_steps) ? source.process_steps : []
  const customersSource = Array.isArray(source.customers) ? source.customers : []

  // Normalize factory images
  let factoryImages: string[] = []
  if (Array.isArray(source.factory_images)) {
    factoryImages = source.factory_images.filter((img): img is string => typeof img === 'string' && img.length > 0)
  }
  if (factoryImages.length === 0) {
    factoryImages = DEFAULT_HOME_PAGE_CONTENT.factory_images
  }

  return {
    hero_image_url: ensureString(source.hero_image_url, DEFAULT_HOME_PAGE_CONTENT.hero_image_url),
    hero_image_alt: ensureString(source.hero_image_alt, DEFAULT_HOME_PAGE_CONTENT.hero_image_alt),
    hero_title: ensureString(source.hero_title, DEFAULT_HOME_PAGE_CONTENT.hero_title),
    hero_description: ensureString(source.hero_description, DEFAULT_HOME_PAGE_CONTENT.hero_description),
    hero_primary_label: ensureString(
      source.hero_primary_label,
      DEFAULT_HOME_PAGE_CONTENT.hero_primary_label,
    ),
    hero_primary_href: ensureHref(source.hero_primary_href, DEFAULT_HOME_PAGE_CONTENT.hero_primary_href),
    hero_secondary_label: ensureString(
      source.hero_secondary_label,
      DEFAULT_HOME_PAGE_CONTENT.hero_secondary_label,
    ),
    hero_secondary_href: ensureHref(
      source.hero_secondary_href,
      DEFAULT_HOME_PAGE_CONTENT.hero_secondary_href,
    ),
    factory_title: ensureString(source.factory_title, DEFAULT_HOME_PAGE_CONTENT.factory_title),
    factory_images: factoryImages,
    factory_description: ensureString(source.factory_description, DEFAULT_HOME_PAGE_CONTENT.factory_description),
    stats_title: ensureString(source.stats_title, DEFAULT_HOME_PAGE_CONTENT.stats_title),
    stats: DEFAULT_STATS.map((_, index) => normalizeStatItem(statsSource[index], index)),
    advantages_title: ensureString(source.advantages_title, DEFAULT_HOME_PAGE_CONTENT.advantages_title),
    advantages: DEFAULT_ADVANTAGES.map((_, index) =>
      normalizeAdvantageItem(advantagesSource[index], index),
    ),
    featured_title: ensureString(source.featured_title, DEFAULT_HOME_PAGE_CONTENT.featured_title),
    featured_view_all_label: ensureString(
      source.featured_view_all_label,
      DEFAULT_HOME_PAGE_CONTENT.featured_view_all_label,
    ),
    featured_view_all_href: ensureHref(
      source.featured_view_all_href,
      DEFAULT_HOME_PAGE_CONTENT.featured_view_all_href,
    ),
    featured_products: featuredSource.map((item, index) =>
      normalizeFeaturedProductItem(item, index),
    ),
    process_title: ensureString(source.process_title, DEFAULT_HOME_PAGE_CONTENT.process_title),
    process_description: ensureString(source.process_description, DEFAULT_HOME_PAGE_CONTENT.process_description),
    process_steps: DEFAULT_PROCESS_STEPS.map((_, index) => normalizeProcessStep(processSource[index], index)),
    services_title: ensureString(source.services_title, DEFAULT_HOME_PAGE_CONTENT.services_title),
    services: DEFAULT_SERVICES.map((_, index) => normalizeServiceItem(servicesSource[index], index)),
    customers_title: ensureString(source.customers_title, DEFAULT_HOME_PAGE_CONTENT.customers_title),
    customers: DEFAULT_CUSTOMERS.map((_, index) => normalizeCustomerItem(customersSource[index], index)),
    cta_title: ensureString(source.cta_title, DEFAULT_HOME_PAGE_CONTENT.cta_title),
    cta_description: ensureString(source.cta_description, DEFAULT_HOME_PAGE_CONTENT.cta_description),
    cta_button_label: ensureString(source.cta_button_label, DEFAULT_HOME_PAGE_CONTENT.cta_button_label),
    cta_button_href: ensureHref(source.cta_button_href, DEFAULT_HOME_PAGE_CONTENT.cta_button_href),
  }
}
