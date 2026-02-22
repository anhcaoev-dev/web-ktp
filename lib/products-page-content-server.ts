import 'server-only'

import { createClient } from '@/lib/supabase/server'
import {
  DEFAULT_PRODUCTS_PAGE_CONTENT,
  type ContentStatus,
  type ProductsPageContent,
  normalizeProductsPageContent,
} from '@/lib/products-page-content'

const PAGE_KEY = 'products'

export async function getProductsPageContent(status: ContentStatus = 'published'): Promise<ProductsPageContent> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('page_contents')
      .select('content')
      .eq('page_key', PAGE_KEY)
      .eq('status', status)
      .maybeSingle()

    if (error) {
      console.error('Error fetching products page content:', error.message)
      return DEFAULT_PRODUCTS_PAGE_CONTENT
    }

    return normalizeProductsPageContent(data?.content ?? DEFAULT_PRODUCTS_PAGE_CONTENT)
  } catch (error) {
    console.error('Error in getProductsPageContent:', error)
    return DEFAULT_PRODUCTS_PAGE_CONTENT
  }
}
