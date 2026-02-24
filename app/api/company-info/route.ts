import { createClient } from '@/lib/supabase/server'
import { DEFAULT_COMPANY_INFO, normalizeCompanyInfo } from '@/lib/company-info'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('company_settings')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      // Table may not exist yet in some environments; return safe defaults.
      return NextResponse.json(normalizeCompanyInfo(DEFAULT_COMPANY_INFO), { status: 200 })
    }

    return NextResponse.json(normalizeCompanyInfo(data), { status: 200 })
  } catch (error) {
    console.error('Error fetching company info:', error)
    return NextResponse.json(normalizeCompanyInfo(DEFAULT_COMPANY_INFO), { status: 200 })
  }
}
