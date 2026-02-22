import { createClient } from '@/lib/supabase/server'
import {
  type HomePageContent,
  normalizeHomePageContent,
  DEFAULT_HOME_PAGE_CONTENT,
} from '@/lib/home-page-content'
import { NextRequest, NextResponse } from 'next/server'

type ActionPayload =
  | { action: 'publish' }
  | { action: 'restore'; versionId: string }

const PAGE_KEY = 'home'

async function requireToken(request: NextRequest): Promise<string | null> {
  return request.headers.get('authorization')?.split('Bearer ')[1] ?? null
}

export async function GET(request: NextRequest) {
  try {
    const token = await requireToken(request)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const [contentRes, versionsRes] = await Promise.all([
      supabase.from('page_contents').select('*').eq('page_key', PAGE_KEY),
      supabase
        .from('page_content_versions')
        .select('*')
        .eq('page_key', PAGE_KEY)
        .order('created_at', { ascending: false })
        .limit(20),
    ])

    if (contentRes.error) {
      return NextResponse.json({ error: contentRes.error.message }, { status: 500 })
    }

    if (versionsRes.error) {
      return NextResponse.json({ error: versionsRes.error.message }, { status: 500 })
    }

    const draft = contentRes.data?.find((row) => row.status === 'draft') ?? null
    const published = contentRes.data?.find((row) => row.status === 'published') ?? null

    return NextResponse.json(
      {
        draft: draft
          ? { ...draft, content: normalizeHomePageContent(draft.content) }
          : {
              id: null,
              status: 'draft',
              page_key: PAGE_KEY,
              version: 0,
              content: DEFAULT_HOME_PAGE_CONTENT,
              updated_at: null,
            },
        published: published
          ? { ...published, content: normalizeHomePageContent(published.content) }
          : {
              id: null,
              status: 'published',
              page_key: PAGE_KEY,
              version: 0,
              content: DEFAULT_HOME_PAGE_CONTENT,
              updated_at: null,
              published_at: null,
            },
        history: versionsRes.data ?? [],
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error fetching home page CMS data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = await requireToken(request)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await request.json()) as { content?: HomePageContent; note?: string }
    const normalizedContent = normalizeHomePageContent(body.content)
    const note = typeof body.note === 'string' ? body.note.trim() : ''
    const now = new Date().toISOString()

    const supabase = await createClient()
    const { data: existingDraft, error: existingDraftError } = await supabase
      .from('page_contents')
      .select('id, version')
      .eq('page_key', PAGE_KEY)
      .eq('status', 'draft')
      .maybeSingle()

    if (existingDraftError) {
      return NextResponse.json({ error: existingDraftError.message }, { status: 500 })
    }

    const nextVersion = (existingDraft?.version ?? 0) + 1
    const payload = {
      page_key: PAGE_KEY,
      status: 'draft',
      content: normalizedContent,
      version: nextVersion,
      updated_at: now,
    }

    let savedDraft: { id: string; content: HomePageContent; version: number; updated_at: string } | null = null

    if (existingDraft?.id) {
      const { data, error } = await supabase
        .from('page_contents')
        .update(payload)
        .eq('id', existingDraft.id)
        .select('id, content, version, updated_at')
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      savedDraft = {
        ...data,
        content: normalizeHomePageContent(data.content),
      }
    } else {
      const { data, error } = await supabase
        .from('page_contents')
        .insert([{ ...payload, created_at: now }])
        .select('id, content, version, updated_at')
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      savedDraft = {
        ...data,
        content: normalizeHomePageContent(data.content),
      }
    }

    const { error: historyError } = await supabase.from('page_content_versions').insert([
      {
        page_key: PAGE_KEY,
        source_status: 'draft',
        version_number: nextVersion,
        action: 'save_draft',
        change_note: note || null,
        content: normalizedContent,
        created_at: now,
      },
    ])

    if (historyError) {
      return NextResponse.json({ error: historyError.message }, { status: 500 })
    }

    return NextResponse.json({ draft: savedDraft }, { status: 200 })
  } catch (error) {
    console.error('Error saving home page draft:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await requireToken(request)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await request.json()) as ActionPayload
    const supabase = await createClient()
    const now = new Date().toISOString()

    if (body.action === 'publish') {
      const { data: draft, error: draftError } = await supabase
        .from('page_contents')
        .select('id, content, version')
        .eq('page_key', PAGE_KEY)
        .eq('status', 'draft')
        .maybeSingle()

      if (draftError) {
        return NextResponse.json({ error: draftError.message }, { status: 500 })
      }

      if (!draft) {
        return NextResponse.json({ error: 'Khong co ban nhap de xuat ban.' }, { status: 400 })
      }

      const normalizedContent = normalizeHomePageContent(draft.content)
      const { data: existingPublished, error: existingPublishedError } = await supabase
        .from('page_contents')
        .select('id, version')
        .eq('page_key', PAGE_KEY)
        .eq('status', 'published')
        .maybeSingle()

      if (existingPublishedError) {
        return NextResponse.json({ error: existingPublishedError.message }, { status: 500 })
      }

      const nextPublishedVersion = (existingPublished?.version ?? 0) + 1
      const publishPayload = {
        page_key: PAGE_KEY,
        status: 'published',
        content: normalizedContent,
        version: nextPublishedVersion,
        updated_at: now,
        published_at: now,
      }

      const publishedMutation = existingPublished?.id
        ? await supabase
            .from('page_contents')
            .update(publishPayload)
            .eq('id', existingPublished.id)
            .select('id, content, version, updated_at, published_at')
            .single()
        : await supabase
            .from('page_contents')
            .insert([{ ...publishPayload, created_at: now }])
            .select('id, content, version, updated_at, published_at')
            .single()

      if (publishedMutation.error) {
        return NextResponse.json({ error: publishedMutation.error.message }, { status: 500 })
      }

      const { error: historyError } = await supabase.from('page_content_versions').insert([
        {
          page_key: PAGE_KEY,
          source_status: 'published',
          version_number: nextPublishedVersion,
          action: 'publish',
          content: normalizedContent,
          created_at: now,
        },
      ])

      if (historyError) {
        return NextResponse.json({ error: historyError.message }, { status: 500 })
      }

      return NextResponse.json(
        {
          published: {
            ...publishedMutation.data,
            content: normalizeHomePageContent(publishedMutation.data.content),
          },
        },
        { status: 200 },
      )
    }

    if (body.action === 'restore') {
      if (!body.versionId || typeof body.versionId !== 'string') {
        return NextResponse.json({ error: 'Version id is required.' }, { status: 400 })
      }

      const { data: versionRow, error: versionError } = await supabase
        .from('page_content_versions')
        .select('*')
        .eq('id', body.versionId)
        .eq('page_key', PAGE_KEY)
        .maybeSingle()

      if (versionError) {
        return NextResponse.json({ error: versionError.message }, { status: 500 })
      }

      if (!versionRow) {
        return NextResponse.json({ error: 'Version not found.' }, { status: 404 })
      }

      const normalizedContent = normalizeHomePageContent(versionRow.content)
      const { data: existingDraft, error: existingDraftError } = await supabase
        .from('page_contents')
        .select('id, version')
        .eq('page_key', PAGE_KEY)
        .eq('status', 'draft')
        .maybeSingle()

      if (existingDraftError) {
        return NextResponse.json({ error: existingDraftError.message }, { status: 500 })
      }

      const nextDraftVersion = (existingDraft?.version ?? 0) + 1
      const restorePayload = {
        page_key: PAGE_KEY,
        status: 'draft',
        content: normalizedContent,
        version: nextDraftVersion,
        updated_at: now,
      }

      const draftMutation = existingDraft?.id
        ? await supabase
            .from('page_contents')
            .update(restorePayload)
            .eq('id', existingDraft.id)
            .select('id, content, version, updated_at')
            .single()
        : await supabase
            .from('page_contents')
            .insert([{ ...restorePayload, created_at: now }])
            .select('id, content, version, updated_at')
            .single()

      if (draftMutation.error) {
        return NextResponse.json({ error: draftMutation.error.message }, { status: 500 })
      }

      const { error: historyError } = await supabase.from('page_content_versions').insert([
        {
          page_key: PAGE_KEY,
          source_status: 'draft',
          version_number: nextDraftVersion,
          action: 'restore',
          change_note: `Restored from ${versionRow.action} #${versionRow.version_number}`,
          content: normalizedContent,
          created_at: now,
        },
      ])

      if (historyError) {
        return NextResponse.json({ error: historyError.message }, { status: 500 })
      }

      return NextResponse.json(
        {
          draft: {
            ...draftMutation.data,
            content: normalizeHomePageContent(draftMutation.data.content),
          },
        },
        { status: 200 },
      )
    }

    return NextResponse.json({ error: 'Unsupported action.' }, { status: 400 })
  } catch (error) {
    console.error('Error processing home page CMS action:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
