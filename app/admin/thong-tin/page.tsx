'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Building2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DEFAULT_COMPANY_INFO, type CompanyInfo } from '@/lib/company-info'

export default function CompanyInfoAdminPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [localPreview, setLocalPreview] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<CompanyInfo>(DEFAULT_COMPANY_INFO)

  useEffect(() => {
    fetchCompanyInfo()
  }, [])

  const fetchCompanyInfo = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/thong-tin', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        throw new Error('Không thể tải thông tin công ty')
      }

      const data = await response.json()
      setFormData(data)
    } catch (fetchError) {
      console.error(fetchError)
      setError('Không thể tải thông tin công ty')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setSaved(false)
      setError('')

      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/thong-tin', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Không thể lưu thông tin công ty')
      }

      const data = await response.json()
      setFormData(data)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (saveError) {
      console.error(saveError)
      setError(saveError instanceof Error ? saveError.message : 'Không thể lưu thông tin công ty')
    } finally {
      setSaving(false)
    }
  }

  const updateField = (field: keyof CompanyInfo, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const uploadImage = async (file: File) => {
    try {
      const objectUrl = URL.createObjectURL(file)
      setLocalPreview(objectUrl)

      setUploadingImage(true)
      setError('')

      const token = localStorage.getItem('admin_token')
      const body = new FormData()
      body.set('file', file)
      body.set('folder', 'company')

      const response = await fetch('/api/admin/upload-anh', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Không thể tải ảnh lên')
      }

      const data = await response.json()
      updateField('logo_url', data.url)
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Lỗi upload ảnh: Vui lòng kiểm tra lại cấu hình Supabase Bucket')
    } finally {
      setUploadingImage(false)
    }
  }

  if (loading) {
    return <p className="text-center py-8">Đang tải...</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Thông Tin Công Ty</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Dữ liệu này được dùng cho Header, Footer, trang Liên hệ và các khu vực liên kết khác.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <Save className="w-4 h-4" />
          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </div>

      {error && (
        <div className="p-3 rounded-lg border border-destructive/40 bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      {saved && (
        <div className="p-3 rounded-lg border border-green-500/40 bg-green-500/10 text-green-700 text-sm">
          Đã cập nhật thông tin công ty.
        </div>
      )}

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Cấu hình thương hiệu và liên hệ
          </CardTitle>
          <CardDescription>
            Logo URL cho phép thay đổi logo website không cần sửa code.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tên công ty</Label>
              <Input
                value={formData.company_name}
                onChange={(e) => updateField('company_name', e.target.value)}
                placeholder="Bao Bì Kim Thành Phát"
              />
            </div>
            <div className="space-y-2">
              <Label>Tên ngắn / viết tắt</Label>
              <Input
                value={formData.short_name}
                onChange={(e) => updateField('short_name', e.target.value)}
                placeholder="KTP"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tagline</Label>
            <Input
              value={formData.tagline}
              onChange={(e) => updateField('tagline', e.target.value)}
              placeholder="Sản xuất thùng carton chuyên dụng"
            />
          </div>

          <div className="space-y-2">
            <Label>Mô tả ngắn (Footer)</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Số điện thoại</Label>
              <Input value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={formData.email} onChange={(e) => updateField('email', e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Địa chỉ</Label>
            <Input value={formData.address} onChange={(e) => updateField('address', e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Giờ làm việc (mỗi dòng 1 mục)</Label>
            <Textarea
              value={formData.working_hours}
              onChange={(e) => updateField('working_hours', e.target.value)}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Logo (Upload từ máy tính)</Label>
              {(localPreview || formData.logo_url) && (
                <div className="relative h-24 w-48 overflow-hidden rounded-md border bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-2 mb-2">
                  <img src={localPreview || formData.logo_url} alt="Logo preview" className="max-w-full max-h-full object-contain bg-transparent" />
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) {
                    uploadImage(file)
                  }
                }}
                disabled={uploadingImage}
              />
              <p className="text-xs text-muted-foreground">
                {uploadingImage ? 'Đang upload...' : 'Ảnh logo sẽ được lưu trực tiếp trên hệ thống'}
              </p>
            </div>
            <div className="space-y-2">
              <Label>Text logo dự phòng</Label>
              <Input
                value={formData.logo_text}
                onChange={(e) => updateField('logo_text', e.target.value)}
                placeholder="KTP"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
