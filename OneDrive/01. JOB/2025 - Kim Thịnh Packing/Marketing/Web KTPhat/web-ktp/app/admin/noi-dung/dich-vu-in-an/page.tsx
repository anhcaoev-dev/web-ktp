'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  DEFAULT_PRINTING_PAGE_CONTENT,
  type PrintingPageContent,
  normalizePrintingPageContent,
} from '@/lib/printing-page-content'

const PAGE_KEY = 'printing'
const PAGE_TITLE = 'Dịch Vụ In Ấn'

export default function GenericContentAdminPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState<PrintingPageContent>(DEFAULT_PRINTING_PAGE_CONTENT)

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
      setFormData(normalizePrintingPageContent(data?.content ?? DEFAULT_PRINTING_PAGE_CONTENT))
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

  function updateField<K extends keyof PrintingPageContent>(field: K, value: PrintingPageContent[K]) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  function handleJsonChange<K extends keyof PrintingPageContent>(field: K, value: string) {
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
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: normalizePrintingPageContent(formData) }),
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

  if (loading) return <p className="py-8 text-center">Đang tải...</p>

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Nội dung Trang {PAGE_TITLE}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Chỉnh sửa nội dung cho trang.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData}>Tải lại</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu Nội Dung'}</Button>
        </div>
      </div>

      {error && <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
      {success && <div className="rounded-lg border border-green-500/40 bg-green-500/10 p-3 text-sm text-green-700">{success}</div>}

      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Tiêu đề</Label><Textarea rows={2} value={formData.hero_title} onChange={(e) => updateField('hero_title', e.target.value)} /></div>
            <div className="space-y-2"><Label>Mô tả</Label><Textarea rows={3} value={formData.hero_description} onChange={(e) => updateField('hero_description', e.target.value)} /></div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>Các Section Nội dung (JSON)</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2"><Label>Tiêu đề section Ưu điểm</Label><Input value={formData.features_title} onChange={(e) => updateField('features_title', e.target.value)} /></div>
                <div className="space-y-2"><Label>Các ưu điểm (JSON)</Label><Textarea rows={12} value={JSON.stringify(formData.features, null, 2)} onChange={(e) => handleJsonChange('features', e.target.value)} className="font-mono text-xs" /></div>
                
                <div className="space-y-2"><Label>Tiêu đề section Loại in</Label><Input value={formData.types_title} onChange={(e) => updateField('types_title', e.target.value)} /></div>
                <div className="space-y-2"><Label>Các loại in (JSON)</Label><Textarea rows={15} value={JSON.stringify(formData.printing_types, null, 2)} onChange={(e) => handleJsonChange('printing_types', e.target.value)} className="font-mono text-xs" /></div>

                <div className="space-y-2"><Label>Tiêu đề section Dịch vụ</Label><Input value={formData.services_title} onChange={(e) => updateField('services_title', e.target.value)} /></div>
                <div className="space-y-2"><Label>Các dịch vụ (JSON)</Label><Textarea rows={15} value={JSON.stringify(formData.services, null, 2)} onChange={(e) => handleJsonChange('services', e.target.value)} className="font-mono text-xs" /></div>

                <div className="space-y-2"><Label>Tiêu đề section Bề mặt</Label><Input value={formData.finishes_title} onChange={(e) => updateField('finishes_title', e.target.value)} /></div>
                <div className="space-y-2"><Label>Các loại bề mặt (JSON)</Label><Textarea rows={10} value={JSON.stringify(formData.finishes, null, 2)} onChange={(e) => handleJsonChange('finishes', e.target.value)} className="font-mono text-xs" /></div>

                <div className="space-y-2"><Label>Tiêu đề section Quy trình</Label><Input value={formData.process_title} onChange={(e) => updateField('process_title', e.target.value)} /></div>
                <div className="space-y-2"><Label>Các bước quy trình (JSON)</Label><Textarea rows={10} value={JSON.stringify(formData.process_steps, null, 2)} onChange={(e) => handleJsonChange('process_steps', e.target.value)} className="font-mono text-xs" /></div>

                <div className="space-y-2"><Label>Tiêu đề section Yêu cầu file</Label><Input value={formData.requirements_title} onChange={(e) => updateField('requirements_title', e.target.value)} /></div>
                <div className="space-y-2"><Label>Các yêu cầu (JSON)</Label><Textarea rows={15} value={JSON.stringify(formData.requirements, null, 2)} onChange={(e) => handleJsonChange('requirements', e.target.value)} className="font-mono text-xs" /></div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>CTA Section</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-2"><Label>Tiêu đề CTA</Label><Textarea rows={2} value={formData.cta_title} onChange={(e) => updateField('cta_title', e.target.value)} /></div>
                <div className="mt-3 space-y-2"><Label>Mô tả CTA</Label><Textarea rows={3} value={formData.cta_description} onChange={(e) => updateField('cta_description', e.target.value)} /></div>
                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="space-y-2"><Label>Nút chính - Label</Label><Input value={formData.cta_primary_label} onChange={(e) => updateField('cta_primary_label', e.target.value)} /></div>
                  <div className="space-y-2"><Label>Nút chính - Link</Label><Input value={formData.cta_primary_href} onChange={(e) => updateField('cta_primary_href', e.target.value)} /></div>
                  <div className="space-y-2"><Label>Nút phụ - Label</Label><Input value={formData.cta_secondary_label} onChange={(e) => updateField('cta_secondary_label', e.target.value)} /></div>
                  <div className="space-y-2"><Label>Nút phụ - Link</Label><Input value={formData.cta_secondary_href} onChange={(e) => updateField('cta_secondary_href', e.target.value)} /></div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
