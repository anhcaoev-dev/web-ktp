import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    const supabase = await createClient()

    // Fetch admin user
    const { data: adminUser, error: queryError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single()

    if (queryError) {
      console.log('[DEBUG] Query error:', queryError)
      return NextResponse.json({
        status: 'error',
        message: 'User not found',
        error: queryError,
      })
    }

    if (!adminUser) {
      return NextResponse.json({
        status: 'error',
        message: 'User not found in database',
      })
    }

    // Compute password hash
    const computedHash = crypto
      .createHash('sha256')
      .update(password + 'admin_salt_key')
      .digest('hex')

    console.log('[DEBUG] Email input:', email)
    console.log('[DEBUG] Password input:', password)
    console.log('[DEBUG] Computed hash:', computedHash)
    console.log('[DEBUG] Stored hash:', adminUser.password_hash)
    console.log('[DEBUG] Hash match:', computedHash === adminUser.password_hash)

    return NextResponse.json({
      status: 'debug',
      email: adminUser.email,
      name: adminUser.name,
      is_active: adminUser.is_active,
      stored_hash: adminUser.password_hash?.substring(0, 20) + '...',
      computed_hash: computedHash.substring(0, 20) + '...',
      hash_match: computedHash === adminUser.password_hash,
      password_input_length: password.length,
      stored_hash_length: adminUser.password_hash?.length || 0,
      computed_hash_length: computedHash.length,
    })
  } catch (error) {
    console.error('[DEBUG] Error:', error)
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
