import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, company, productType, quantity, specifications } = body

    // Validate required fields
    if (!name || !email || !phone || !productType || !quantity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Insert quote request into database
    const { data, error } = await supabase
      .from('quote_requests')
      .insert({
        name,
        email,
        phone,
        company: company || null,
        product_type: productType,
        quantity: parseInt(quantity),
        specifications: specifications || null,
        status: 'pending',
      })
      .select()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to save quote request' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Quote request submitted successfully', data },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error processing quote request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
