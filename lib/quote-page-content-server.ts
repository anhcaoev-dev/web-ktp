import 'server-only'

import { createClient } from '@/lib/supabase/server'
import {
  DEFAULT_QUOTE_PAGE_CONTENT,
  type ContentStatus,
  type QuotePageContent,
  normalizeQuotePageContent,
} from '@/lib/quote-page-content'

const PAGE_KEY = 'quote'

export async function getQuotePageContent(status: ContentStatus = 'published'): Promise<QuotePageContent> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('page_contents')
      .select('content')
      .eq('page_key', PAGE_KEY)
      .eq('status', status)
      .maybeSingle()

    if (error) {
      console.error('Error fetching quote page content:', error.message)
      return DEFAULT_QUOTE_PAGE_CONTENT
    }

    return normalizeQuotePageContent(data?.content ?? DEFAULT_QUOTE_PAGE_CONTENT)
  } catch (error) {
    console.error('Error in getQuotePageContent:', error)
    return DEFAULT_QUOTE_PAGE_CONTENT
  }
}
