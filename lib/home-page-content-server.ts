import 'server-only'

import { createClient } from '@/lib/supabase/server'
import {
  DEFAULT_HOME_PAGE_CONTENT,
  type ContentStatus,
  type HomePageContent,
  type HomeFeaturedProductItem,
  normalizeHomePageContent,
} from '@/lib/home-page-content'

const HOME_PAGE_KEY = 'home'

export async function getHomePageContent(status: ContentStatus = 'published'): Promise<HomePageContent> {
  try {
    const supabase = await createClient()

    // Fetch page content from CMS
    const { data: pageContentData, error: pageContentError } = await supabase
      .from('page_contents')
      .select('content')
      .eq('page_key', HOME_PAGE_KEY)
      .eq('status', status)
      .maybeSingle()

    if (pageContentError) {
      console.error('Error fetching page content:', pageContentError.message)
      // Fallback to default, but still try to fetch dynamic products
    }

    const baseContent = pageContentData?.content ?? DEFAULT_HOME_PAGE_CONTENT

    // Fetch featured products dynamically
    const { data: featuredProductsData, error: featuredProductsError } = await supabase
      .from('products')
      .select('id, name, description')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(3)

    if (featuredProductsError) {
      console.error('Error fetching featured products:', featuredProductsError.message)
    }

    const featuredProducts: HomeFeaturedProductItem[] =
      featuredProductsData?.map((p) => ({
        title: p.name,
        description: p.description?.split('.')[0] || '', // Use first sentence as description
        detail: p.description || '',
        cta_label: 'Tìm hiểu thêm',
        cta_href: `/san-pham/${p.id}`,
      })) || []

    // Dynamic products are the source of truth, replacing anything from CMS
    baseContent.featured_products = featuredProducts

    return normalizeHomePageContent(baseContent)
  } catch (error) {
    console.error('Error in getHomePageContent:', error)
    return DEFAULT_HOME_PAGE_CONTENT
  }
}
