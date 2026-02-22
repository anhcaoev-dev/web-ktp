import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split('Bearer ')[1]

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()

    // Fetch statistics
    const [productsRes, quotesRes, contactsRes, articlesRes, recentQuotesRes] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact' }),
      supabase.from('quote_requests').select('id', { count: 'exact' }).eq('status', 'pending'),
      supabase.from('contact_messages').select('id', { count: 'exact' }).eq('status', 'unread'),
      supabase.from('news_articles').select('id', { count: 'exact' }).eq('status', 'published'),
      supabase
        .from('quote_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5),
    ])

    const stats = {
      totalProducts: productsRes.count || 0,
      totalQuotes: quotesRes.count || 0,
      totalContacts: contactsRes.count || 0,
      totalArticles: articlesRes.count || 0,
    }

    const recentQuotes = recentQuotesRes.data || []

    return NextResponse.json({ stats, recentQuotes }, { status: 200 })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
