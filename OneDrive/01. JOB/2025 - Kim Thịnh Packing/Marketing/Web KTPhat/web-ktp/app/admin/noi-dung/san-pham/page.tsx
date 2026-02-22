'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  DEFAULT_PRODUCTS_PAGE_CONTENT,
  type ProductsPageContent,
  normalizeProductsPageContent,
} from '@/lib/products-page-content'

const PAGE_KEY = 'products'
const PAGE_TITLE = 'Sản Phẩm'

export default function GenericContentAdminPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState<ProductsPageContent>(DEFAULT_PRODUCTS_PAGE_CONTENT)

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
      setFormData(normalizeProductsPageContent(data?.content ?? DEFAULT_PRODUCTS_PAGE_CONTENT))
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

  function updateField<K extends keyof ProductsPageContent>(field: K, value: ProductsPageContent[K]) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSave() {
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
          content: normalizeProductsPageContent(formData),
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
          <CardHeader>
            <CardTitle>Hero section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>URL hình hero</Label>
              <Input
                value={formData.hero_image_url}
                onChange={(event) => updateField('hero_image_url', event.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label>Alt text</Label>
              <Input
                value={formData.hero_image_alt}
                onChange={(event) => updateField('hero_image_alt', event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Tiêu đề</Label>
              <Textarea
                rows={3}
                value={formData.hero_title}
                onChange={(event) => updateField('hero_title', event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Mô tả</Label>
              <Textarea
                rows={4}
                value={formData.hero_description}
                onChange={(event) => updateField('hero_description', event.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Section Kêu gọi hành động (CTA)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tiêu đề CTA</Label>
              <Textarea rows={2} value={formData.cta_title} onChange={(event) => updateField('cta_title', event.target.value)} />
            </div>
            <div className="mt-3 space-y-2">
              <Label>Mô tả CTA</Label>
              <Textarea
                rows={3}
                value={formData.cta_description}
                onChange={(event) => updateField('cta_description', event.target.value)}
              />
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Nút CTA - Label</Label>
                <Input
                  value={formData.cta_button_label}
                  onChange={(event) => updateField('cta_button_label', event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Nút CTA - Link</Label>
                <Input
                  value={formData.cta_button_href}
                  onChange={(event) => updateField('cta_button_href', event.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
