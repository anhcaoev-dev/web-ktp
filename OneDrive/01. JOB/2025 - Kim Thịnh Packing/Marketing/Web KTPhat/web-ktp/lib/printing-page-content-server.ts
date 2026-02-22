import 'server-only'

import { createClient } from '@/lib/supabase/server'
import {
  DEFAULT_PRINTING_PAGE_CONTENT,
  type ContentStatus,
  type PrintingPageContent,
  normalizePrintingPageContent,
} from '@/lib/printing-page-content'

const PAGE_KEY = 'printing'

export async function getPrintingPageContent(status: ContentStatus = 'published'): Promise<PrintingPageContent> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('page_contents')
      .select('content')
      .eq('page_key', PAGE_KEY)
      .eq('status', status)
      .maybeSingle()

    if (error) {
      console.error('Error fetching printing page content:', error.message)
      return DEFAULT_PRINTING_PAGE_CONTENT
    }

    return normalizePrintingPageContent(data?.content ?? DEFAULT_PRINTING_PAGE_CONTENT)
  } catch (error) {
    console.error('Error in getPrintingPageContent:', error)
    return DEFAULT_PRINTING_PAGE_CONTENT
  }
}
