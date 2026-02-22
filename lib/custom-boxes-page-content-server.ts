import 'server-only'

import { createClient } from '@/lib/supabase/server'
import {
  DEFAULT_CUSTOM_BOXES_PAGE_CONTENT,
  type ContentStatus,
  type CustomBoxesPageContent,
  normalizeCustomBoxesPageContent,
} from '@/lib/custom-boxes-page-content'

const PAGE_KEY = 'custom-boxes'

export async function getCustomBoxesPageContent(status: ContentStatus = 'published'): Promise<CustomBoxesPageContent> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('page_contents')
      .select('content')
      .eq('page_key', PAGE_KEY)
      .eq('status', status)
      .maybeSingle()

    if (error) {
      console.error('Error fetching custom boxes page content:', error.message)
      return DEFAULT_CUSTOM_BOXES_PAGE_CONTENT
    }

    return normalizeCustomBoxesPageContent(data?.content ?? DEFAULT_CUSTOM_BOXES_PAGE_CONTENT)
  } catch (error) {
    console.error('Error in getCustomBoxesPageContent:', error)
    return DEFAULT_CUSTOM_BOXES_PAGE_CONTENT
  }
}
