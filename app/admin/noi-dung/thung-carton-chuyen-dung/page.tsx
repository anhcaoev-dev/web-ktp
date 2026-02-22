'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  DEFAULT_CUSTOM_BOXES_PAGE_CONTENT,
  type CustomBoxesPageContent,
  normalizeCustomBoxesPageContent,
} from '@/lib/custom-boxes-page-content'

const PAGE_KEY = 'custom-boxes'
const PAGE_TITLE = 'Thùng Carton Chuyên Dụng'

export default function GenericContentAdminPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState<CustomBoxesPageContent>(DEFAULT_CUSTOM_BOXES_PAGE_CONTENT)

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
      setFormData(normalizeCustomBoxesPageContent(data?.content ?? DEFAULT_CUSTOM_BOXES_PAGE_CONTENT))
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

  function updateField<K extends keyof CustomBoxesPageContent>(field: K, value: CustomBoxesPageContent[K]) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  function handleJsonChange<K extends keyof CustomBoxesPageContent>(field: K, value: string) {
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
          content: normalizeCustomBoxesPageContent(formData),
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
          <p className="mt-1 text-sm text-muted-foreground">Chỉnh sửa nội dung cho trang.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData}>Tải lại</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Đang lưu...' : 'Lưu Nội Dung'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
      )}
      {success && (
        <div className="rounded-lg border border-green-500/40 bg-green-500/10 p-3 text-sm text-green-700">{success}</div>
      )}

      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
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
          <CardHeader><CardTitle>Ưu Điểm & Ứng Dụng</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tiêu đề section Ưu điểm</Label>
              <Input value={formData.features_title} onChange={(e) => updateField('features_title', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Các ưu điểm (JSON)</Label>
              <Textarea rows={12} value={JSON.stringify(formData.features, null, 2)} onChange={(e) => handleJsonChange('features', e.target.value)} className="font-mono text-xs" />
            </div>
            <div className="space-y-2">
              <Label>Tiêu đề section Ứng dụng</Label>
              <Input value={formData.applications_title} onChange={(e) => updateField('applications_title', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Các ứng dụng (JSON)</Label>
              <Textarea rows={15} value={JSON.stringify(formData.applications, null, 2)} onChange={(e) => handleJsonChange('applications', e.target.value)} className="font-mono text-xs" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Tùy chọn & Quy trình</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tiêu đề section Tùy chọn</Label>
              <Input value={formData.options_title} onChange={(e) => updateField('options_title', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Các tùy chọn (JSON)</Label>
              <Textarea rows={15} value={JSON.stringify(formData.options, null, 2)} onChange={(e) => handleJsonChange('options', e.target.value)} className="font-mono text-xs" />
            </div>
            <div className="space-y-2">
              <Label>Tiêu đề section Quy trình</Label>
              <Input value={formData.process_title} onChange={(e) => updateField('process_title', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Các bước trong quy trình (JSON)</Label>
              <Textarea rows={10} value={JSON.stringify(formData.process_steps, null, 2)} onChange={(e) => handleJsonChange('process_steps', e.target.value)} className="font-mono text-xs" />
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>CTA Section</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Label>Tiêu đề CTA</Label>
                    <Textarea rows={2} value={formData.cta_title} onChange={(e) => updateField('cta_title', e.target.value)} />
                </div>
                <div className="mt-3 space-y-2">
                    <Label>Mô tả CTA</Label>
                    <Textarea rows={3} value={formData.cta_description} onChange={(e) => updateField('cta_description', e.target.value)} />
                </div>
                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Nút chính - Label</Label>
                    <Input value={formData.cta_primary_label} onChange={(e) => updateField('cta_primary_label', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Nút chính - Link</Label>
                    <Input value={formData.cta_primary_href} onChange={(e) => updateField('cta_primary_href', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Nút phụ - Label</Label>
                    <Input value={formData.cta_secondary_label} onChange={(e) => updateField('cta_secondary_label', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Nút phụ - Link</Label>
                    <Input value={formData.cta_secondary_href} onChange={(e) => updateField('cta_secondary_href', e.target.value)} />
                  </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
