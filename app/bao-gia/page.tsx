import { getQuotePageContent } from '@/lib/quote-page-content-server'
import QuotePageClient from './quote-page-client'

export default async function QuotePage() {
  const content = await getQuotePageContent()

  return <QuotePageClient content={content} />
}
