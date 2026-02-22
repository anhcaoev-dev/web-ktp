'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertCircle, Plus, Edit2, Trash2, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface AdminUser {
  id: string
  email: string
  name: string
  role: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function AdminManagementPage() {
  const router = useRouter()
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({ email: '', name: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const checkAuth = () => {
      const adminUser = localStorage.getItem('admin_user')
      const adminToken = localStorage.getItem('admin_token')
      if (!adminUser || !adminToken) {
        router.push('/admin/dang-nhap')
        return
      }
      fetchAdmins()
    }
    checkAuth()
  }, [router])

  const fetchAdmins = async () => {
    try {
      const response = await fetch('/api/admin/san-pham', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`
        }
      })
      
      if (!response.ok) throw new Error('Failed to fetch')
      
      // For now, show message that this is a placeholder
      setLoading(false)
    } catch (err) {
      setError('Lỗi khi tải dữ liệu')
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_user')
    localStorage.removeItem('admin_token')
    router.push('/admin/dang-nhap')
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Đang tải...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Quản Lý Admin</h1>
          <p className="text-muted-foreground">Quản lý các tài khoản admin của website</p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="gap-2">
          <LogOut className="w-4 h-4" />
          Đăng Xuất
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Danh Sách Admin</CardTitle>
                <CardDescription>Quản lý các tài khoản quản trị viên</CardDescription>
              </div>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4" />
                    Thêm Admin Mới
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tạo Tài Khoản Admin Mới</DialogTitle>
                    <DialogDescription>
                      Để tạo admin user an toàn, vui lòng chạy script SQL 003_create_admin_user.sql trên Supabase. 
                      Không nên tạo admin user từ web interface vì lý do bảo mật.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Hướng dẫn:</p>
                      <ol className="text-sm space-y-2 text-muted-foreground list-decimal list-inside">
                        <li>Mở file ADMIN_SETUP.md trong dự án</li>
                        <li>Tạo SHA256 hash bằng lệnh Node.js</li>
                        <li>Chạy script SQL trên Supabase</li>
                      </ol>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground">Tính năng quản lý admin đang được phát triển</p>
              <p className="text-sm text-muted-foreground mt-2">
                Hiện tại, để tạo hoặc quản lý admin user, vui lòng tham khảo file <code className="bg-muted px-2 py-1 rounded">ADMIN_SETUP.md</code>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
