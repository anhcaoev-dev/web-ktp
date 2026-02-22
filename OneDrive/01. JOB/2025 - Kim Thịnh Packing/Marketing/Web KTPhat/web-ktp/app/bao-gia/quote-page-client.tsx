'use client'

import Image from 'next/image'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { QuoteCalculator } from '@/components/quote-calculator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { QuotePageContent } from '@/lib/quote-page-content'

export default function QuotePageClient({ content }: { content: QuotePageContent }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    productType: '',
    quantity: '',
    specifications: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert('Yêu cầu báo giá của bạn đã được gửi thành công. Chúng tôi sẽ liên hệ với bạn sớm!')
        setFormData({ name: '', email: '', phone: '', company: '', productType: '', quantity: '', specifications: '' })
      } else {
        alert('Có lỗi xảy ra. Vui lòng thử lại.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative w-full h-96 md:h-[500px] overflow-hidden">
        <Image src={content.hero_image_url} alt={content.hero_image_alt} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-balance">{content.hero_title}</h1>
              <p className="text-lg text-white/90 text-balance">{content.hero_description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="w-full py-12 md:py-20 bg-background flex-1">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <QuoteCalculator />
            </div>
            <div className="lg:col-span-2">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>{content.form_title}</CardTitle>
                  <CardDescription>{content.form_description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Form fields remain the same */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Họ Tên *</Label>
                        <Input id="name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Nguyễn Văn A" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Số Điện Thoại *</Label>
                        <Input id="phone" required type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="0912345678" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input id="email" required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="email@example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Tên Công Ty</Label>
                        <Input id="company" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} placeholder="Công ty của bạn" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="product-type">Loại Sản Phẩm *</Label>
                        <Select value={formData.productType} onValueChange={(value) => setFormData({ ...formData, productType: value })}>
                          <SelectTrigger id="product-type"><SelectValue placeholder="Chọn loại sản phẩm" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tiêu_chuẩn">Thùng Carton Tiêu Chuẩn</SelectItem>
                            <SelectItem value="có_lót">Thùng Carton Có Lót</SelectItem>
                            <SelectItem value="chuyên_dụng">Thùng Carton Chuyên Dụng</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Số Lượng (cái) *</Label>
                        <Input id="quantity" required type="number" min="1" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} placeholder="1000" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specifications">Thông Số Kỹ Thuật & Yêu Cầu Đặc Biệt</Label>
                      <Textarea id="specifications" value={formData.specifications} onChange={(e) => setFormData({ ...formData, specifications: e.target.value })} placeholder="Mô tả chi tiết kích thước, màu sắc, chất liệu, in ấn, và các yêu cầu đặc biệt khác..." rows={6} />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90">
                      {loading ? 'Đang Gửi...' : 'Gửi Yêu Cầu Báo Giá'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Info Section */}
      <section className="w-full py-12 md:py-20 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            {content.pricing_section_title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.pricing_cards.map((card, index) => (
              <Card key={index} className="border-border bg-background">
                <CardHeader><CardTitle className="text-lg">{card.title}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{card.price_description}</p>
                    <p className="text-2xl font-bold text-primary">{card.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{card.features.length > 0 && (card.title.includes('Tiêu Chuẩn') ? 'Chiết khấu số lượng' : 'Đặc điểm')}</p>
                    <ul className="text-sm space-y-1 mt-2">
                      {card.features.map((feature, fIndex) => <li key={fIndex}>{feature}</li>)}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-12 p-8 bg-background border border-border rounded-lg">
            <h3 className="text-2xl font-bold mb-4 text-foreground">{content.printing_section_title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {content.printing_services.map((service, index) => (
                <div key={index}>
                  <h4 className="font-semibold mb-2 text-foreground">{service.title}</h4>
                  <p className="text-muted-foreground text-sm">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
