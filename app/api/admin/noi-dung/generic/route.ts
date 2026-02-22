import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

async function verifyToken(request: NextRequest) {
  const token = request.headers.get('authorization')?.split('Bearer ')[1]
  if (!token) {
    return { error: 'Unauthorized', status: 401 }
  }
  // In a real app, you'd verify the token against your admin session table
  return { error: null, status: 200 }
}

export async function GET(request: NextRequest) {
  try {
    const authCheck = await verifyToken(request)
    if (authCheck.error) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status })
    }

    const { searchParams } = new URL(request.url)
    const pageKey = searchParams.get('pageKey')

    if (!pageKey) {
      return NextResponse.json({ error: 'Missing pageKey parameter' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('page_contents')
      .select('content')
      .eq('page_key', pageKey)
      .eq('status', 'published') // Always fetch the latest published for simplicity
      .maybeSingle()

    if (error) {
      console.error(`Error fetching content for ${pageKey}:`, error.message)
      return NextResponse.json({ error: 'Server error while fetching content.' }, { status: 500 })
    }

    return NextResponse.json(data ?? { content: {} }, { status: 200 })
  } catch (e) {
    console.error('Generic content GET error:', e)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authCheck = await verifyToken(request)
    if (authCheck.error) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status })
    }

    const { searchParams } = new URL(request.url)
    const pageKey = searchParams.get('pageKey')

    if (!pageKey) {
      return NextResponse.json({ error: 'Missing pageKey parameter' }, { status: 400 })
    }

    const body = await request.json()
    const { content } = body

    if (!content) {
      return NextResponse.json({ error: 'Missing content in request body' }, { status: 400 })
    }

    const supabase = await createClient()

    // Simplified "upsert": update if exists, insert if not.
    // 1. Check if a record for this pageKey exists
    const { data: existing, error: readError } = await supabase
      .from('page_contents')
      .select('id')
      .eq('page_key', pageKey)
      .eq('status', 'published')
      .maybeSingle()

    if (readError) {
      console.error(`Error checking content for ${pageKey}:`, readError.message)
      return NextResponse.json({ error: 'Server error while checking for content.' }, { status: 500 })
    }

    let data, error
    if (existing) {
      // Update existing record
      const result = await supabase
        .from('page_contents')
        .update({ content: content, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single()
      data = result.data
      error = result.error
    } else {
      // Insert new record
      const result = await supabase
        .from('page_contents')
        .insert({
          page_key: pageKey,
          status: 'published', // Keep it simple, just save as published
          content: content,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          version_number: 1, // Start at version 1
        })
        .select()
        .single()
      data = result.data
      error = result.error
    }

    if (error) {
      console.error(`Error saving content for ${pageKey}:`, error.message)
      return NextResponse.json({ error: 'Server error while saving content.' }, { status: 500 })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (e) {
    console.error('Generic content PUT error:', e)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
