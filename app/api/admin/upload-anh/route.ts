import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

const BUCKET_NAME = 'website-assets'
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024

function getFileExtension(fileName: string): string {
  const parts = fileName.split('.')
  if (parts.length <= 1) return 'jpg'
  return parts.pop()?.toLowerCase() || 'jpg'
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split('Bearer ')[1]
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file')
    const folderRaw = formData.get('folder')
    const folder = typeof folderRaw === 'string' && folderRaw.trim() ? folderRaw.trim() : 'home'

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'File is required.' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are supported.' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit.' }, { status: 400 })
    }

    const adminSupabase = createAdminClient()
    const fileExtension = getFileExtension(file.name)
    const filePath = `${folder}/${Date.now()}-${crypto.randomUUID()}.${fileExtension}`
    const bytes = Buffer.from(await file.arrayBuffer())

    const { error: uploadError } = await adminSupabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, bytes, {
        cacheControl: '3600',
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    const { data: publicUrlData } = adminSupabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)
    return NextResponse.json(
      {
        url: publicUrlData.publicUrl,
        path: filePath,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
