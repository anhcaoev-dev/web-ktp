'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Eye, Trash2, CheckCircle } from 'lucide-react'

interface Contact {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  status: string
  created_at: string
}

export default function ContactsAdminPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/lien-he', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setContacts(data)
      }
    } catch (error) {
      console.error('Error fetching contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/lien-he/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'read' }),
      })

      if (response.ok) {
        fetchContacts()
        setSelectedContact(null)
      }
    } catch (error) {
      console.error('Error updating contact:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa tin nhắn này?')) return

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/lien-he/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        fetchContacts()
        setSelectedContact(null)
      }
    } catch (error) {
      console.error('Error deleting contact:', error)
    }
  }

  const unreadContacts = contacts.filter((c) => c.status === 'unread')
  const readContacts = contacts.filter((c) => c.status === 'read')

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Quản Lý Liên Hệ</h1>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Chưa Đọc
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{unreadContacts.length}</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Đã Đọc
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{readContacts.length}</p>
          </CardContent>
        </Card>
      </div>

      {selectedContact && (
        <Card className="border-border bg-muted/50">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{selectedContact.name}</CardTitle>
                <CardDescription>{selectedContact.email}</CardDescription>
              </div>
              <button
                onClick={() => setSelectedContact(null)}
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
                <p className="font-medium">{selectedContact.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Chủ Đề</p>
                <p className="font-medium">{selectedContact.subject}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Nội Dung Tin Nhắn</p>
              <p className="p-3 bg-background rounded border border-border text-sm whitespace-pre-wrap">
                {selectedContact.message}
              </p>
            </div>

            <div className="flex gap-2">
              {selectedContact.status === 'unread' && (
                <Button
                  onClick={() => handleMarkAsRead(selectedContact.id)}
                  className="bg-primary hover:bg-primary/90"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Đánh Dấu Đã Đọc
                </Button>
              )}
              <Button
                variant="destructive"
                onClick={() => handleDelete(selectedContact.id)}
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
          {/* Unread Contacts */}
          {unreadContacts.length > 0 && (
            <Card className="border-border border-primary/50">
              <CardHeader>
                <CardTitle>Tin Nhắn Chưa Đọc</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-border">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold">Tên</th>
                        <th className="text-left py-3 px-4 font-semibold">Email</th>
                        <th className="text-left py-3 px-4 font-semibold">Chủ Đề</th>
                        <th className="text-left py-3 px-4 font-semibold">Ngày</th>
                        <th className="text-left py-3 px-4 font-semibold">Hành Động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {unreadContacts.map((contact) => (
                        <tr
                          key={contact.id}
                          className="border-b border-border hover:bg-muted/50 bg-primary/5"
                        >
                          <td className="py-3 px-4 font-semibold">{contact.name}</td>
                          <td className="py-3 px-4">{contact.email}</td>
                          <td className="py-3 px-4">{contact.subject}</td>
                          <td className="py-3 px-4">
                            {new Date(contact.created_at).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => setSelectedContact(contact)}
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

          {/* Read Contacts */}
          {readContacts.length > 0 && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Tin Nhắn Đã Đọc</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-border">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold">Tên</th>
                        <th className="text-left py-3 px-4 font-semibold">Email</th>
                        <th className="text-left py-3 px-4 font-semibold">Chủ Đề</th>
                        <th className="text-left py-3 px-4 font-semibold">Ngày</th>
                      </tr>
                    </thead>
                    <tbody>
                      {readContacts.map((contact) => (
                        <tr key={contact.id} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 px-4">{contact.name}</td>
                          <td className="py-3 px-4">{contact.email}</td>
                          <td className="py-3 px-4">{contact.subject}</td>
                          <td className="py-3 px-4">
                            {new Date(contact.created_at).toLocaleDateString('vi-VN')}
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
