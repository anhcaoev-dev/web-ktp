import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email và mật khẩu là bắt buộc' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Query admin user
    const { data: adminUser, error: queryError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single()

    if (queryError || !adminUser) {
      console.log('[v0] Admin user not found:', email, 'Error:', queryError?.message)
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không chính xác' },
        { status: 401 }
      )
    }

    console.log('[v0] Admin user found:', adminUser.email)

    // Verify password using SHA256 hash
    const passwordHash = crypto
      .createHash('sha256')
      .update(password + 'admin_salt_key')
      .digest('hex')

    console.log('[v0] Comparing passwords...')
    console.log('[v0] Stored hash:', adminUser.password_hash?.substring(0, 20) + '...')
    console.log('[v0] Computed hash:', passwordHash.substring(0, 20) + '...')

    const isPasswordValid = passwordHash === adminUser.password_hash

    if (!isPasswordValid) {
      console.log('[v0] Password mismatch for user:', email)
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không chính xác' },
        { status: 401 }
      )
    }

    // Generate token
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

    // Store token in session
    const { error: insertError } = await supabase.from('admin_sessions').insert({
      admin_id: adminUser.id,
      token,
      expires_at: expiresAt,
    })

    if (insertError) {
      console.error('[v0] Error creating session:', insertError)
      return NextResponse.json(
        { error: 'Lỗi tạo phiên đăng nhập' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: 'Đăng nhập thành công',
        token,
        user: {
          id: adminUser.id,
          email: adminUser.email,
          name: adminUser.name,
          role: adminUser.role,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Error during login:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('[v0] Error details:', errorMessage)
    return NextResponse.json(
      { 
        error: 'Lỗi máy chủ nội bộ',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}
