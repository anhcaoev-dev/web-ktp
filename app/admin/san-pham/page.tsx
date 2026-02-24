'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RichTextEditor } from '@/components/rich-text-editor'
import { Trash2, Edit2, Plus, Settings } from 'lucide-react'
import Link from 'next/link'
import { SeoChecklist } from '@/components/seo-checklist'

interface Product {
  id: string
  name: string
  category: string
  description: string
  price: number
  is_featured: boolean
  image_url?: string
}

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    category: 'tiêu_chuẩn',
    description: '',
    price: '',
    is_featured: false,
    image_url: '',
    image_alt: '',
  })
  const [uploadingImage, setUploadingImage] = useState(false)
  const [localPreview, setLocalPreview] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/san-pham', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const url = editingId ? `/api/admin/san-pham/${editingId}` : '/api/admin/san-pham'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      })

      if (response.ok) {
        setFormData({ name: '', category: 'tiêu_chuẩn', description: '', price: '', is_featured: false, image_url: '', image_alt: '' })
        setEditingId(null)
        setLocalPreview(null)
        setShowForm(false)
        fetchProducts()
      } else {
        const err = await response.json()
        if (err.message && err.message.includes('image_alt')) {
          alert('Lỗi: Cột "image_alt" chưa được thêm vào bảng "products" trên Supabase. Vui lòng vào Supabase SQL Editor và chạy: ALTER TABLE products ADD COLUMN image_alt text;')
        } else {
          alert('Lỗi lưu sản phẩm: ' + (err.error || err.message))
        }
      }
    } catch (error) {
      console.error('Error saving product:', error)
    }
  }

  const uploadCoverImage = async (file: File) => {
    try {
      const objectUrl = URL.createObjectURL(file)
      setLocalPreview(objectUrl)

      setUploadingImage(true)

      const token = localStorage.getItem('admin_token')
      const body = new FormData()
      body.set('file', file)
      body.set('folder', 'products')

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
      setFormData(prev => ({ ...prev, image_url: data.url }))
    } catch (err) {
      console.error(err)
      alert(err instanceof Error ? err.message : 'Lỗi upload ảnh')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/san-pham/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        fetchProducts()
      }
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price.toString(),
      is_featured: product.is_featured,
      image_url: product.image_url || '',
      image_alt: (product as any).image_alt || '',
    })
    setEditingId(product.id)
    setLocalPreview(null)
    setShowForm(true)
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quản Lý Sản Phẩm</h1>
        <div className="flex gap-2">
          <Link href="/admin/san-pham/danh-muc">
            <Button variant="outline" className="gap-2">
              <Settings className="w-4 h-4" />
              Quản Lý Danh Mục
            </Button>
          </Link>
          {!showForm && (
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Thêm Sản Phẩm
            </Button>
          )}
        </div>
      </div>

      {showForm && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle>{editingId ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="space-y-2">
                  <Label>Tên Sản Phẩm</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Thùng Carton Tiêu Chuẩn"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Danh Mục</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tiêu_chuẩn">Tiêu Chuẩn</SelectItem>
                      <SelectItem value="có_lót">Có Lót</SelectItem>
                      <SelectItem value="chuyên_dụng">Chuyên Dụng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Mô Tả</Label>
                  <RichTextEditor
                    value={formData.description}
                    onChange={(content) => setFormData({ ...formData, description: content })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Giá (đồng)</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="2500"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Hình Ảnh Đại Diện (Upload từ máy tính)</Label>
                  {(localPreview || formData.image_url) && (
                    <div className="relative h-32 w-32 overflow-hidden rounded-md border bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-2 mb-2">
                      <img src={localPreview || formData.image_url} alt="Cover preview" className="max-w-full max-h-full object-contain" />
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.target.files?.[0]
                      if (file) {
                        uploadCoverImage(file)
                      }
                    }}
                    disabled={uploadingImage}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Thẻ Alt Hình Ảnh (Mô tả ảnh cho SEO)</Label>
                  <Input
                    value={formData.image_alt}
                    onChange={(e) => setFormData({ ...formData, image_alt: e.target.value })}
                    placeholder="VD: Hình ảnh thùng carton 5 lớp in offset"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_featured: Boolean(checked) })
                    }
                  />
                  <label
                    htmlFor="is_featured"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Hiển thị trên trang chủ
                  </label>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
                    {editingId ? 'Cập Nhật' : 'Lưu'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowForm(false)
                      setEditingId(null)
                      setLocalPreview(null)
                      setFormData({ name: '', category: 'tiêu_chuẩn', description: '', price: '', is_featured: false, image_url: '', image_alt: '' })
                    }}
                  >
                    Hủy
                  </Button>
                </div>
              </div>

              {/* Cột hiển thị bảng xếp hạng SEO */}
              <div className="space-y-4">
                <SeoChecklist
                  title={formData.name}
                  content={formData.description}
                  hasImage={!!formData.image_url}
                  type="product"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <p className="text-center py-8">Đang tải...</p>
      ) : (
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Danh Sách Sản Phẩm</CardTitle>
            <CardDescription>Tổng cộng: {products.length} sản phẩm</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold">Tên</th>
                    <th className="text-left py-3 px-4 font-semibold">Danh Mục</th>
                    <th className="text-left py-3 px-4 font-semibold">Giá</th>
                    <th className="text-left py-3 px-4 font-semibold">Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4">
                        {product.name}
                        {product.is_featured && (
                          <span className="ml-2 text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                            Nổi bật
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">{product.category}</td>
                      <td className="py-3 px-4">{product.price.toLocaleString('vi-VN')} ₫</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 hover:bg-muted rounded transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 hover:bg-destructive/10 text-destructive rounded transition-colors"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
