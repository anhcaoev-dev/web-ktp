'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Eye, Trash2, CheckCircle } from 'lucide-react'

interface Quote {
  id: string
  name: string
  email: string
  phone: string
  company?: string
  product_type: string
  quantity: number
  specifications?: string
  status: string
  created_at: string
}

export default function QuotesAdminPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)

  useEffect(() => {
    fetchQuotes()
  }, [])

  const fetchQuotes = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/bao-gia', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setQuotes(data)
      }
    } catch (error) {
      console.error('Error fetching quotes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsProcessed = async (id: string) => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/bao-gia/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'processed' }),
      })

      if (response.ok) {
        fetchQuotes()
        setSelectedQuote(null)
      }
    } catch (error) {
      console.error('Error updating quote:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa yêu cầu này?')) return

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/bao-gia/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        fetchQuotes()
        setSelectedQuote(null)
      }
    } catch (error) {
      console.error('Error deleting quote:', error)
    }
  }

  const pendingQuotes = quotes.filter((q) => q.status === 'pending')
  const processedQuotes = quotes.filter((q) => q.status === 'processed')

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Quản Lý Báo Giá</h1>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Chờ Xử Lý
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{pendingQuotes.length}</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Đã Xử Lý
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{processedQuotes.length}</p>
          </CardContent>
        </Card>
      </div>

      {selectedQuote && (
        <Card className="border-border bg-muted/50">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{selectedQuote.name}</CardTitle>
                <CardDescription>{selectedQuote.email}</CardDescription>
              </div>
              <button
                onClick={() => setSelectedQuote(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Số Điện Thoại</p>
                <p className="font-medium">{selectedQuote.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Công Ty</p>
                <p className="font-medium">{selectedQuote.company || 'Không có'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sản Phẩm</p>
                <p className="font-medium">{selectedQuote.product_type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Số Lượng</p>
                <p className="font-medium">{selectedQuote.quantity} cái</p>
              </div>
            </div>

            {selectedQuote.specifications && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Yêu Cầu Chi Tiết</p>
                <p className="p-3 bg-background rounded border border-border text-sm">
                  {selectedQuote.specifications}
                </p>
              </div>
            )}

            <div className="flex gap-2">
              {selectedQuote.status === 'pending' && (
                <Button
                  onClick={() => handleMarkAsProcessed(selectedQuote.id)}
                  className="bg-primary hover:bg-primary/90"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Đánh Dấu Đã Xử Lý
                </Button>
              )}
              <Button
                variant="destructive"
                onClick={() => handleDelete(selectedQuote.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Xóa
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <p className="text-center py-8">Đang tải...</p>
      ) : (
        <>
          {/* Pending Quotes */}
          {pendingQuotes.length > 0 && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Báo Giá Chờ Xử Lý</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-border">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold">Tên</th>
                        <th className="text-left py-3 px-4 font-semibold">Email</th>
                        <th className="text-left py-3 px-4 font-semibold">Sản Phẩm</th>
                        <th className="text-left py-3 px-4 font-semibold">Số Lượng</th>
                        <th className="text-left py-3 px-4 font-semibold">Ngày</th>
                        <th className="text-left py-3 px-4 font-semibold">Hành Động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingQuotes.map((quote) => (
                        <tr key={quote.id} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 px-4">{quote.name}</td>
                          <td className="py-3 px-4">{quote.email}</td>
                          <td className="py-3 px-4">{quote.product_type}</td>
                          <td className="py-3 px-4">{quote.quantity}</td>
                          <td className="py-3 px-4">
                            {new Date(quote.created_at).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => setSelectedQuote(quote)}
                              className="p-2 hover:bg-muted rounded transition-colors"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Processed Quotes */}
          {processedQuotes.length > 0 && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Báo Giá Đã Xử Lý</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-border">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold">Tên</th>
                        <th className="text-left py-3 px-4 font-semibold">Email</th>
                        <th className="text-left py-3 px-4 font-semibold">Sản Phẩm</th>
                        <th className="text-left py-3 px-4 font-semibold">Ngày</th>
                      </tr>
                    </thead>
                    <tbody>
                      {processedQuotes.map((quote) => (
                        <tr key={quote.id} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 px-4">{quote.name}</td>
                          <td className="py-3 px-4">{quote.email}</td>
                          <td className="py-3 px-4">{quote.product_type}</td>
                          <td className="py-3 px-4">
                            {new Date(quote.created_at).toLocaleDateString('vi-VN')}
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
