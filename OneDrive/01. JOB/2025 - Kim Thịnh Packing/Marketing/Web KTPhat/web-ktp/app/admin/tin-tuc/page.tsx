'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RichTextEditor } from '@/components/rich-text-editor'
import { Trash2, Edit2, Plus } from 'lucide-react'

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  author: string
  featured: boolean
  status: string
  image_url?: string
  created_at: string
}

export default function NewsAdminPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'tin_tuc',
    author: '',
    featured: false,
    status: 'draft',
    image_url: '',
  })

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/tin-tuc', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setArticles(data)
      }
    } catch (error) {
      console.error('Error fetching articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const slug = generateSlug(formData.title)
      const url = editingId ? `/api/admin/tin-tuc/${editingId}` : '/api/admin/tin-tuc'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          slug,
        }),
      })

      if (response.ok) {
        setFormData({
          title: '',
          excerpt: '',
          content: '',
          category: 'tin_tuc',
          author: '',
          featured: false,
          status: 'draft',
          image_url: '',
        })
        setEditingId(null)
        setShowForm(false)
        fetchArticles()
      }
    } catch (error) {
      console.error('Error saving article:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/tin-tuc/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        fetchArticles()
      }
    } catch (error) {
      console.error('Error deleting article:', error)
    }
  }

  const handleEdit = (article: Article) => {
    setFormData({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      author: article.author,
      featured: article.featured,
      status: article.status,
      image_url: article.image_url || '',
    })
    setEditingId(article.id)
    setShowForm(true)
  }

  const publishedArticles = articles.filter((a) => a.status === 'published')
  const draftArticles = articles.filter((a) => a.status === 'draft')

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quản Lý Tin Tức</h1>
        <Button
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
            setFormData({
              title: '',
              excerpt: '',
              content: '',
              category: 'tin_tuc',
              author: '',
              featured: false,
              status: 'draft',
              image_url: '',
            })
          }}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Viết Bài Mới
        </Button>
      </div>

      {showForm && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle>{editingId ? 'Chỉnh Sửa Bài Viết' : 'Viết Bài Viết Mới'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tiêu Đề</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Tiêu đề bài viết"
              />
            </div>

            <div className="space-y-2">
              <Label>Tóm Tắt</Label>
              <Textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Tóm tắt ngắn gọn cho trang danh sách"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Nội Dung</Label>
              <RichTextEditor
                value={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Danh Mục</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tin_tuc">Tin Tức</SelectItem>
                    <SelectItem value="kien_thuc">Kiến Thức</SelectItem>
                    <SelectItem value="huong_dan">Hướng Dẫn</SelectItem>
                    <SelectItem value="truong_hop">Trường Hợp</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tác Giả</Label>
                <Input
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Tên tác giả"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Trạng Thái</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Bản Nháp</SelectItem>
                    <SelectItem value="published">Xuất Bản</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>URL Hình Ảnh</Label>
                <Input
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.featured}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, featured: checked as boolean })
                }
                id="featured"
              />
              <Label htmlFor="featured" className="font-normal cursor-pointer">
                Đánh dấu là bài viết nổi bật
              </Label>
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
                  setFormData({
                    title: '',
                    excerpt: '',
                    content: '',
                    category: 'tin_tuc',
                    author: '',
                    featured: false,
                    status: 'draft',
                    image_url: '',
                  })
                }}
              >
                Hủy
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <p className="text-center py-8">Đang tải...</p>
      ) : (
        <>
          {/* Published Articles */}
          {publishedArticles.length > 0 && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Bài Viết Đã Xuất Bản</CardTitle>
                <CardDescription>Tổng cộng: {publishedArticles.length} bài</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-border">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold">Tiêu Đề</th>
                        <th className="text-left py-3 px-4 font-semibold">Danh Mục</th>
                        <th className="text-left py-3 px-4 font-semibold">Tác Giả</th>
                        <th className="text-left py-3 px-4 font-semibold">Hành Động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {publishedArticles.map((article) => (
                        <tr key={article.id} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium">{article.title}</p>
                              {article.featured && (
                                <p className="text-xs text-primary">⭐ Nổi bật</p>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">{article.category}</td>
                          <td className="py-3 px-4">{article.author}</td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(article)}
                                className="p-2 hover:bg-muted rounded transition-colors"
                                title="Chỉnh sửa"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(article.id)}
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

          {/* Draft Articles */}
          {draftArticles.length > 0 && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Bản Nháp</CardTitle>
                <CardDescription>Tổng cộng: {draftArticles.length} bài</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-border">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold">Tiêu Đề</th>
                        <th className="text-left py-3 px-4 font-semibold">Danh Mục</th>
                        <th className="text-left py-3 px-4 font-semibold">Tác Giả</th>
                        <th className="text-left py-3 px-4 font-semibold">Hành Động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {draftArticles.map((article) => (
                        <tr key={article.id} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 px-4 text-muted-foreground">{article.title}</td>
                          <td className="py-3 px-4">{article.category}</td>
                          <td className="py-3 px-4">{article.author}</td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(article)}
                                className="p-2 hover:bg-muted rounded transition-colors"
                                title="Chỉnh sửa"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(article.id)}
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
        </>
      )}
    </div>
  )
}

