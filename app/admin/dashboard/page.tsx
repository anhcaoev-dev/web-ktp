'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalQuotes: 0,
    totalContacts: 0,
    totalArticles: 0,
  })
  const [recentQuotes, setRecentQuotes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
        setRecentQuotes(data.recentQuotes || [])
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const chartData = [
    { name: 'T2', quotes: 12 },
    { name: 'T3', quotes: 19 },
    { name: 'T4', quotes: 15 },
    { name: 'T5', quotes: 25 },
    { name: 'T6', quotes: 22 },
    { name: 'T7', quotes: 28 },
    { name: 'CN', quotes: 18 },
  ]

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng Sản Phẩm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{stats.totalProducts}</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Báo Giá Chờ Xử Lý
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{stats.totalQuotes}</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tin Nhắn Liên Hệ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{stats.totalContacts}</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Bài Viết Tin Tức
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{stats.totalArticles}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Báo Giá Theo Tháng</CardTitle>
          <CardDescription>Số lượng yêu cầu báo giá trong 6 tháng gần đây</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="quotes" fill="var(--primary)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Quotes */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Báo Giá Gần Đây</CardTitle>
          <CardDescription>Danh sách 5 yêu cầu báo giá mới nhất</CardDescription>
        </CardHeader>
        <CardContent>
          {recentQuotes.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Chưa có yêu cầu nào</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold">Tên</th>
                    <th className="text-left py-3 px-4 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 font-semibold">Số Lượng</th>
                    <th className="text-left py-3 px-4 font-semibold">Trạng Thái</th>
                    <th className="text-left py-3 px-4 font-semibold">Ngày</th>
                  </tr>
                </thead>
                <tbody>
                  {recentQuotes.map((quote: any) => (
                    <tr key={quote.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4">{quote.name}</td>
                      <td className="py-3 px-4">{quote.email}</td>
                      <td className="py-3 px-4">{quote.quantity}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            quote.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {quote.status === 'pending' ? 'Chờ' : 'Đã Xử Lý'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {new Date(quote.created_at).toLocaleDateString('vi-VN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
