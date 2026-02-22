import { createClient } from '@/lib/supabase/server'
import { DEFAULT_COMPANY_INFO, normalizeCompanyInfo } from '@/lib/company-info'
import { NextRequest, NextResponse } from 'next/server'

type CompanySettingsPayload = {
  company_name?: string
  short_name?: string
  tagline?: string
  description?: string
  phone?: string
  email?: string
  address?: string
  working_hours?: string
  logo_url?: string
  logo_text?: string
}

function sanitizePayload(body: CompanySettingsPayload) {
  const normalized = normalizeCompanyInfo(body)
  return {
    company_name: normalized.company_name,
    short_name: normalized.short_name,
    tagline: normalized.tagline,
    description: normalized.description,
    phone: normalized.phone,
    email: normalized.email,
    address: normalized.address,
    working_hours: normalized.working_hours,
    logo_url: normalized.logo_url,
    logo_text: normalized.logo_text,
    updated_at: new Date().toISOString(),
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split('Bearer ')[1]
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('company_settings')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      return NextResponse.json(normalizeCompanyInfo(DEFAULT_COMPANY_INFO), { status: 200 })
    }

    return NextResponse.json(normalizeCompanyInfo(data), { status: 200 })
  } catch (error) {
    console.error('Error fetching company settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split('Bearer ')[1]
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await request.json()) as CompanySettingsPayload
    const payload = sanitizePayload(body)
    const supabase = await createClient()

    const { data: existing, error: readError } = await supabase
      .from('company_settings')
      .select('id')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (readError) {
      console.error('Supabase read error:', readError)
      return NextResponse.json(
        {
          error: 'Không thể đọc thông tin công ty hiện có. Lỗi: ' + readError.message,
        },
        { status: 500 },
      )
    }

    if (existing?.id) {
      const { data, error } = await supabase
        .from('company_settings')
        .update(payload)
        .eq('id', existing.id)
        .select()
        .maybeSingle()

      if (error) {
        console.error('Supabase update error:', error)
        return NextResponse.json({ error: 'Lỗi máy chủ: ' + error.message }, { status: 500 })
      }
      if (!data) {
        console.error('Supabase update error: No data returned after update')
        return NextResponse.json({ error: 'Không thể cập nhật thông tin công ty sau khi lưu.' }, { status: 500 })
      }

      return NextResponse.json(normalizeCompanyInfo(data), { status: 200 })
    }

    const { data, error } = await supabase
      .from('company_settings')
      .insert([{ ...payload, created_at: new Date().toISOString() }])
      .select()
      .maybeSingle()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: 'Lỗi máy chủ: ' + error.message }, { status: 500 })
    }
    if (!data) {
      console.error('Supabase insert error: No data returned after insert')
      return NextResponse.json({ error: 'Không thể tạo thông tin công ty.' }, { status: 500 })
    }

    return NextResponse.json(normalizeCompanyInfo(data), { status: 200 })
  } catch (error) {
    console.error('Error updating company settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
