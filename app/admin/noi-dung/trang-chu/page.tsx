'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  DEFAULT_HOME_PAGE_CONTENT,
  type HomePageContent,
  type HomeAdvantageItem,
  type HomeFeaturedProductItem,
  type HomeServiceItem,
  type HomeStatItem,
  type HomeProcessStep,
  type HomeCustomerItem,
  normalizeHomePageContent,
} from '@/lib/home-page-content'

interface VersionHistoryItem {
  id: string
  version_number: number
  action: 'save_draft' | 'publish' | 'restore'
  change_note: string | null
  source_status: 'draft' | 'published'
  created_at: string
}

interface CmsResponse {
  draft: {
    id: string | null
    version: number
    updated_at: string | null
    content: HomePageContent
  }
  published: {
    id: string | null
    version: number
    updated_at: string | null
    published_at: string | null
    content: HomePageContent
  }
  history: VersionHistoryItem[]
}

function formatDateTime(value: string | null): string {
  if (!value) return '-'
  try {
    return new Date(value).toLocaleString('vi-VN')
  } catch {
    return value
  }
}

export default function HomeContentAdminPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingField, setUploadingField] = useState<string | null>(null)
  const [restoringVersionId, setRestoringVersionId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [changeNote, setChangeNote] = useState('')
  const [draftVersion, setDraftVersion] = useState(0)
  const [publishedVersion, setPublishedVersion] = useState(0)
  const [draftUpdatedAt, setDraftUpdatedAt] = useState<string | null>(null)
  const [publishedAt, setPublishedAt] = useState<string | null>(null)
  const [history, setHistory] = useState<VersionHistoryItem[]>([])
  const [formData, setFormData] = useState<HomePageContent>(DEFAULT_HOME_PAGE_CONTENT)

  useEffect(() => {
    fetchData()
  }, [])

  const previewData = useMemo(() => normalizeHomePageContent(formData), [formData])

  async function fetchData() {
    try {
      setLoading(true)
      setError('')

      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/noi-dung/trang-chu', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Không thể tải nội dung trang chủ')
      }

      const data = (await response.json()) as CmsResponse
      setFormData(normalizeHomePageContent(data.draft?.content ?? DEFAULT_HOME_PAGE_CONTENT))
      setDraftVersion(data.draft?.version ?? 0)
      setPublishedVersion(data.published?.version ?? 0)
      setDraftUpdatedAt(data.draft?.updated_at ?? null)
      setPublishedAt(data.published?.published_at ?? null)
      setHistory(data.history ?? [])
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

  function updateField<K extends keyof HomePageContent>(field: K, value: HomePageContent[K]) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  function updateAdvantage(index: number, patch: Partial<HomeAdvantageItem>) {
    setFormData((prev) => ({
      ...prev,
      advantages: prev.advantages.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    }))
  }

  function updateStat(index: number, patch: Partial<HomeStatItem>) {
    setFormData((prev) => ({
      ...prev,
      stats: prev.stats.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    }))
  }

  function updateProcessStep(index: number, patch: Partial<HomeProcessStep>) {
    setFormData((prev) => ({
      ...prev,
      process_steps: prev.process_steps.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    }))
  }

  function updateCustomer(index: number, patch: Partial<HomeCustomerItem>) {
    setFormData((prev) => ({
      ...prev,
      customers: prev.customers.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    }))
  }

  function updateService(index: number, patch: Partial<HomeServiceItem>) {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    }))
  }

  async function handleSaveDraft() {
    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/noi-dung/trang-chu', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: normalizeHomePageContent(formData),
          note: changeNote,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Không thể lưu bản nháp')
      }

      setChangeNote('')
      setTimedSuccess('Đã lưu bản nháp trang chủ')
      await fetchData()
    } catch (saveError) {
      console.error(saveError)
      setError(saveError instanceof Error ? saveError.message : 'Không thể lưu bản nháp')
    } finally {
      setSaving(false)
    }
  }

  async function handlePublish() {
    try {
      setPublishing(true)
      setError('')
      setSuccess('')

      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/noi-dung/trang-chu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: 'publish' }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Không thể xuất bản')
      }

      setTimedSuccess('Đã xuất bản nội dung trang chủ')
      await fetchData()
    } catch (publishError) {
      console.error(publishError)
      setError(publishError instanceof Error ? publishError.message : 'Không thể xuất bản')
    } finally {
      setPublishing(false)
    }
  }

  async function handleRestore(versionId: string) {
    try {
      setRestoringVersionId(versionId)
      setError('')
      setSuccess('')

      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/noi-dung/trang-chu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: 'restore', versionId }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Không thể khôi phục phiên bản')
      }

      setTimedSuccess('Đã khôi phục vào bản nháp')
      await fetchData()
    } catch (restoreError) {
      console.error(restoreError)
      setError(restoreError instanceof Error ? restoreError.message : 'Không thể khôi phục')
    } finally {
      setRestoringVersionId(null)
    }
  }

  async function uploadImage(file: File, fieldName: string, arrayIndex?: number) {
    try {
      setUploadingImage(true)
      setUploadingField(fieldName)
      setError('')
      setSuccess('')

      const token = localStorage.getItem('admin_token')
      const body = new FormData()
      body.set('file', file)
      body.set('folder', 'home')

      const response = await fetch('/api/admin/upload-anh', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Không thể tải ảnh lên')
      }

      const data = (await response.json()) as { url: string }

      if (arrayIndex !== undefined) {
        // Update array field
        if (fieldName.startsWith('customer_')) {
          setFormData((prev) => ({
            ...prev,
            customers: prev.customers.map((item, idx) =>
              idx === arrayIndex ? { ...item, logo_url: data.url } : item
            ),
          }))
        } else if (fieldName === 'factory_images') {
          const currentImages = [...formData.factory_images]
          currentImages[arrayIndex] = data.url
          updateField('factory_images', currentImages)
        }
      } else {
        updateField(fieldName as keyof HomePageContent, data.url as HomePageContent[keyof HomePageContent])
      }

      setTimedSuccess('Tải ảnh thành công, hãy lưu bản nháp để ghi vào DB')
    } catch (uploadError) {
      console.error(uploadError)
      setError(uploadError instanceof Error ? uploadError.message : 'Không thể tải ảnh lên')
    } finally {
      setUploadingImage(false)
      setUploadingField(null)
    }
  }

  if (loading) {
    return <p className="py-8 text-center">Đang tải...</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Nội dung Trang chủ</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Chỉnh sửa nội dung theo bản nháp, xuất bản realtime và lưu lịch sử phiên bản.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Bản nháp v{draftVersion} (cập nhật: {formatDateTime(draftUpdatedAt)}) | Xuất bản v{publishedVersion}{' '}
            (xuất bản: {formatDateTime(publishedAt)})
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData}>
            Tải lại
          </Button>
          <Button onClick={handleSaveDraft} disabled={saving}>
            {saving ? 'Đang lưu...' : 'Lưu bản nháp'}
          </Button>
          <Button onClick={handlePublish} disabled={publishing}>
            {publishing ? 'Đang xuất bản...' : 'Xuất bản'}
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

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Ghi chú phiên bản</CardTitle>
              <CardDescription>Thêm ghi chú ngắn gọn trước khi lưu bản nháp.</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                value={changeNote}
                onChange={(event) => setChangeNote(event.target.value)}
                placeholder="Ví dụ: Cập nhật hero cho chiến dịch tháng này"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hero section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Hình ảnh hero (Upload từ máy tính)</Label>
                {formData.hero_image_url && (
                  <div className="relative h-48 w-full overflow-hidden rounded-md border">
                    <Image src={formData.hero_image_url} alt="Hero preview" fill className="object-cover" />
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (file) uploadImage(file, 'hero_image_url')
                  }}
                  disabled={uploadingImage}
                />
                <p className="text-xs text-muted-foreground">
                  {uploadingImage ? 'Đang upload...' : 'Tải lên ảnh từ thiết bị của bạn (Ảnh được lưu tự động trên hệ thống)'}
                </p>
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
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nút chính - Label</Label>
                  <Input
                    value={formData.hero_primary_label}
                    onChange={(event) => updateField('hero_primary_label', event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nút chính - Link</Label>
                  <Input
                    value={formData.hero_primary_href}
                    onChange={(event) => updateField('hero_primary_href', event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nút phụ - Label</Label>
                  <Input
                    value={formData.hero_secondary_label}
                    onChange={(event) => updateField('hero_secondary_label', event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nút phụ - Link</Label>
                  <Input
                    value={formData.hero_secondary_href}
                    onChange={(event) => updateField('hero_secondary_href', event.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Xưởng sản xuất</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tiêu đề section</Label>
                <Input
                  value={formData.factory_title}
                  onChange={(event) => updateField('factory_title', event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Mô tả</Label>
                <Textarea
                  rows={3}
                  value={formData.factory_description}
                  onChange={(event) => updateField('factory_description', event.target.value)}
                />
              </div>
              <div className="space-y-3">
                <Label>Hình ảnh xưởng (4 hình)</Label>
                <div className="grid grid-cols-2 gap-4">
                  {formData.factory_images.map((img, index) => (
                    <div key={`factory-${index}`} className="space-y-2">
                      <div className="relative h-32 w-full overflow-hidden rounded-md border">
                        {img ? (
                          <Image src={img} alt={`Xưởng ${index + 1}`} fill className="object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-muted">
                            <span className="text-sm text-muted-foreground">Chưa có ảnh</span>
                          </div>
                        )}
                      </div>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          const file = event.target.files?.[0]
                          if (file) uploadImage(file, 'factory_images', index)
                        }}
                        disabled={uploadingImage}
                        className="text-xs mt-2"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {uploadingImage ? 'Đang upload...' : 'Tải lên hình ảnh xưởng sản xuất để giới thiệu cơ sở vật chất'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Số liệu thống kê</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tiêu đề section</Label>
                <Input
                  value={formData.stats_title}
                  onChange={(event) => updateField('stats_title', event.target.value)}
                />
              </div>
              {formData.stats.map((item, index) => (
                <div key={`stat-${index}`} className="rounded-md border p-3">
                  <p className="mb-3 text-sm font-semibold">Thống kê {index + 1}</p>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Giá trị</Label>
                      <Input
                        value={item.value}
                        onChange={(event) => updateStat(index, { value: event.target.value })}
                        placeholder="VD: 15"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Nhãn</Label>
                      <Input
                        value={item.label}
                        onChange={(event) => updateStat(index, { label: event.target.value })}
                        placeholder="VD: Năm kinh nghiệm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Hậu tố</Label>
                      <Input
                        value={item.suffix || ''}
                        onChange={(event) => updateStat(index, { suffix: event.target.value })}
                        placeholder="VD: +"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quy trình sản xuất</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tiêu đề section</Label>
                <Input
                  value={formData.process_title}
                  onChange={(event) => updateField('process_title', event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Mô tả</Label>
                <Textarea
                  rows={2}
                  value={formData.process_description}
                  onChange={(event) => updateField('process_description', event.target.value)}
                />
              </div>
              {formData.process_steps.map((item, index) => (
                <div key={`process-${index}`} className="rounded-md border p-3">
                  <p className="mb-3 text-sm font-semibold">Bước {index + 1}</p>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Icon</Label>
                      <Select
                        value={item.icon}
                        onValueChange={(value) => updateProcessStep(index, { icon: value as HomeProcessStep['icon'] })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="file-text">file-text</SelectItem>
                          <SelectItem value="scissors">scissors</SelectItem>
                          <SelectItem value="print">print</SelectItem>
                          <SelectItem value="package">package</SelectItem>
                          <SelectItem value="truck">truck</SelectItem>
                          <SelectItem value="check-circle">check-circle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Tiêu đề</Label>
                      <Input
                        value={item.title}
                        onChange={(event) => updateProcessStep(index, { title: event.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <Label>Mô tả</Label>
                    <Textarea
                      rows={2}
                      value={item.description}
                      onChange={(event) => updateProcessStep(index, { description: event.target.value })}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Khách hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tiêu đề section</Label>
                <Input
                  value={formData.customers_title}
                  onChange={(event) => updateField('customers_title', event.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {formData.customers.map((customer, index) => (
                  <div key={`customer-${index}`} className="rounded-md border p-3">
                    <p className="mb-3 text-sm font-semibold">Khách hàng {index + 1}</p>
                    <div className="space-y-2">
                      <Label>Tên khách hàng</Label>
                      <Input
                        value={customer.name}
                        onChange={(event) => updateCustomer(index, { name: event.target.value })}
                        placeholder="VD: Công ty ABC"
                      />
                    </div>
                    <div className="mt-2 space-y-2">
                      <Label>Logo (Upload từ máy tính)</Label>
                      {customer.logo_url && (
                        <div className="relative h-16 w-32 overflow-hidden rounded-md border bg-white">
                          <Image src={customer.logo_url} alt="Logo preview" fill className="object-contain p-1" />
                        </div>
                      )}
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          const file = event.target.files?.[0]
                          if (file) uploadImage(file, `customer_${index}`, index)
                        }}
                        disabled={uploadingImage}
                        className="text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ưu điểm</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tiêu đề section</Label>
                <Input
                  value={formData.advantages_title}
                  onChange={(event) => updateField('advantages_title', event.target.value)}
                />
              </div>
              {formData.advantages.map((item, index) => (
                <div key={`adv-${index}`} className="rounded-md border p-3">
                  <p className="mb-3 text-sm font-semibold">Ưu điểm {index + 1}</p>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Icon</Label>
                      <Select value={item.icon} onValueChange={(value) => updateAdvantage(index, { icon: value as HomeAdvantageItem['icon'] })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="package">package</SelectItem>
                          <SelectItem value="trending_up">trending_up</SelectItem>
                          <SelectItem value="zap">zap</SelectItem>
                          <SelectItem value="check_circle">check_circle</SelectItem>
                          <SelectItem value="factory">factory</SelectItem>
                          <SelectItem value="truck">truck</SelectItem>
                          <SelectItem value="award">award</SelectItem>
                          <SelectItem value="users">users</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Tiêu đề</Label>
                      <Input value={item.title} onChange={(event) => updateAdvantage(index, { title: event.target.value })} />
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <Label>Mô tả</Label>
                    <Textarea
                      rows={2}
                      value={item.description}
                      onChange={(event) => updateAdvantage(index, { description: event.target.value })}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sản phẩm nổi bật</CardTitle>
              <CardDescription>
                Các sản phẩm nổi bật giờ được quản lý trực tiếp từ trang sản phẩm.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tiêu đề section</Label>
                <Input
                  value={formData.featured_title}
                  onChange={(event) => updateField('featured_title', event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Nút xem tất cả (label)</Label>
                <Input
                  value={formData.featured_view_all_label}
                  onChange={(event) => updateField('featured_view_all_label', event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Nút xem tất cả (link)</Label>
                <Input
                  value={formData.featured_view_all_href}
                  onChange={(event) => updateField('featured_view_all_href', event.target.value)}
                />
              </div>
              <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                <p>
                  Để chọn sản phẩm nào sẽ hiển thị ở đây, hãy đi tới trang{' '}
                  <Link href="/admin/san-pham" className="text-primary hover:underline">
                    Quản Lý Sản Phẩm
                  </Link>{' '}
                  và tích vào ô "Hiển thị trên trang chủ" cho sản phẩm bạn muốn.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dịch vụ và CTA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tiêu đề section dịch vụ</Label>
                <Input
                  value={formData.services_title}
                  onChange={(event) => updateField('services_title', event.target.value)}
                />
              </div>
              {formData.services.map((item, index) => (
                <div key={`service-${index}`} className="rounded-md border p-3">
                  <p className="mb-3 text-sm font-semibold">Dịch vụ {index + 1}</p>
                  <div className="space-y-2">
                    <Label>Tiêu đề</Label>
                    <Input value={item.title} onChange={(event) => updateService(index, { title: event.target.value })} />
                  </div>
                  <div className="mt-3 space-y-2">
                    <Label>Mô tả</Label>
                    <Textarea
                      rows={2}
                      value={item.description}
                      onChange={(event) => updateService(index, { description: event.target.value })}
                    />
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>CTA label</Label>
                      <Input
                        value={item.cta_label}
                        onChange={(event) => updateService(index, { cta_label: event.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>CTA link</Label>
                      <Input
                        value={item.cta_href}
                        onChange={(event) => updateService(index, { cta_href: event.target.value })}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="rounded-md border p-3">
                <p className="mb-3 text-sm font-semibold">Section CTA cuối trang</p>
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
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Xem trước nhanh</CardTitle>
              <CardDescription>Preview theo bản nháp hiện tại trước khi xuất bản.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative h-44 overflow-hidden rounded-md">
                <Image src={previewData.hero_image_url} alt={previewData.hero_image_alt} fill className="object-cover" />
              </div>
              <p className="text-sm font-semibold">{previewData.hero_title}</p>
              <p className="text-sm text-muted-foreground">{previewData.hero_description}</p>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" disabled>
                  {previewData.hero_secondary_label}
                </Button>
                <Button size="sm" disabled>
                  {previewData.hero_primary_label}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lịch sử phiên bản</CardTitle>
              <CardDescription>20 bản ghi gần nhất.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {history.length === 0 && <p className="text-sm text-muted-foreground">Chưa có lịch sử.</p>}
              {history.map((item) => (
                <div key={item.id} className="rounded-md border p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold">
                      #{item.version_number} - {item.action}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={restoringVersionId === item.id}
                      onClick={() => handleRestore(item.id)}
                    >
                      {restoringVersionId === item.id ? 'Đang khôi phục...' : 'Khôi phục'}
                    </Button>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.source_status} | {formatDateTime(item.created_at)}
                  </p>
                  {item.change_note && <p className="mt-1 text-xs">{item.change_note}</p>}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
