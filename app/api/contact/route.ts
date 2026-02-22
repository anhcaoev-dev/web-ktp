import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, company, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Các trường bắt buộc không được điền' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('contacts')
      .insert([
        {
          name,
          email,
          phone: phone || null,
          company: company || null,
          message,
          status: 'new',
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Không thể lưu liên hệ của bạn' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Liên hệ đã được gửi thành công', data },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing contact:', error)
    return NextResponse.json(
      { error: 'Lỗi xử lý yêu cầu' },
      { status: 500 }
    )
  }
}
