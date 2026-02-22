import 'server-only'
import { createClient } from '@/lib/supabase/server'

export interface Product {
  id: string
  name: string
  category: string
  description: string
  price: number
  is_featured: boolean
  image_url?: string
}

export interface ProductCategory {
  id: string
  name: string
  description: string
}

export async function getProducts(category?: string): Promise<Product[]> {
  try {
    const supabase = await createClient()
    let query = supabase.from('products').select('*').order('name', { ascending: true })

    if (category && category !== 'Tất Cả') {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching products:', error)
      return []
    }

    return data as Product[]
  } catch (error) {
    console.error('Error in getProducts:', error)
    return []
  }
}

export async function getProductCategories(): Promise<ProductCategory[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('product_categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching product categories:', error)
      return []
    }
    return data as ProductCategory[]
  } catch (error) {
    console.error('Error in getProductCategories:', error)
    return []
  }
}
