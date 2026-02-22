'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  DEFAULT_QUOTE_PAGE_CONTENT,
  type QuotePageContent,
  normalizeQuotePageContent,
} from '@/lib/quote-page-content'

const PAGE_KEY = 'quote'
const PAGE_TITLE = 'Báo Giá'

export default function GenericContentAdminPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState<QuotePageContent>(DEFAULT_QUOTE_PAGE_CONTENT)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)
      setError('')

      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/noi-dung/generic?pageKey=${PAGE_KEY}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || `Không thể tải nội dung trang ${PAGE_TITLE}`)
      }

      const data = await response.json()
      setFormData(normalizeQuotePageContent(data?.content ?? DEFAULT_QUOTE_PAGE_CONTENT))
    } catch (fetchError) {
      console.error(fetchError)
      setError(fetchError instanceof Error ? fetchError.message : 'Không thể tải nội dung')
    } finally {
      setLoading(false)
    }
  }

  function setTimedSuccess(message: string) {
    setSuccess(message)
    window.setTimeout(() => setSuccess(''), 3000)
  }

  function updateField<K extends keyof QuotePageContent>(field: K, value: QuotePageContent[K]) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }
  
  function handleJsonChange<K extends keyof QuotePageContent>(field: K, value: string) {
    try {
      const parsed = JSON.parse(value)
      updateField(field, parsed)
      setError('')
    } catch (e) {
      setError(`JSON không hợp lệ cho trường ${String(field)}`)
    }
  }

  async function handleSave() {
    if (error) {
      alert('Vui lòng sửa lỗi JSON trước khi lưu.')
      return
    }
    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/noi-dung/generic?pageKey=${PAGE_KEY}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: normalizeQuotePageContent(formData),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Không thể lưu nội dung')
      }

      setTimedSuccess(`Đã lưu nội dung trang ${PAGE_TITLE}`)
      await fetchData()
    } catch (saveError) {
      console.error(saveError)
      setError(saveError instanceof Error ? saveError.message : 'Không thể lưu')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="py-8 text-center">Đang tải...</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Nội dung Trang {PAGE_TITLE}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Chỉnh sửa nội dung cho trang {PAGE_TITLE}.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData}>Tải lại</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Đang lưu...' : 'Lưu Nội Dung'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg border border-green-500/40 bg-green-500/10 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Hero section</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tiêu đề</Label>
              <Textarea rows={2} value={formData.hero_title} onChange={(e) => updateField('hero_title', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Mô tả</Label>
              <Textarea rows={3} value={formData.hero_description} onChange={(e) => updateField('hero_description', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Form báo giá</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tiêu đề form</Label>
              <Input value={formData.form_title} onChange={(e) => updateField('form_title', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Mô tả form</Label>
              <Input value={formData.form_description} onChange={(e) => updateField('form_description', e.target.value)} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader><CardTitle>Thông tin giá cả</CardTitle></CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
              <Label>Tiêu đề section</Label>
              <Input value={formData.pricing_section_title} onChange={(e) => updateField('pricing_section_title', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Các thẻ giá (JSON)</Label>
              <Textarea
                rows={15}
                value={JSON.stringify(formData.pricing_cards, null, 2)}
                onChange={(e) => handleJsonChange('pricing_cards', e.target.value)}
                className="font-mono text-xs"
              />
            </div>
            <div className="space-y-2">
              <Label>Tiêu đề mục in ấn</Label>
              <Input value={formData.printing_section_title} onChange={(e) => updateField('printing_section_title', e.target.value)} />
            </div>
             <div className="space-y-2">
              <Label>Các dịch vụ in ấn (JSON)</Label>
              <Textarea
                rows={8}
                value={JSON.stringify(formData.printing_services, null, 2)}
                onChange={(e) => handleJsonChange('printing_services', e.target.value)}
                className="font-mono text-xs"
              />
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
