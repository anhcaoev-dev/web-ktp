'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const BASE_PRICES = {
  tiêu_chuẩn: 2500,
  có_lót: 3500,
  chuyên_dụng: 5000,
}

const QUANTITY_DISCOUNTS = [
  { min: 0, max: 100, discount: 0 },
  { min: 101, max: 500, discount: 0.05 },
  { min: 501, max: 1000, discount: 0.1 },
  { min: 1001, max: 5000, discount: 0.15 },
  { min: 5001, max: Infinity, discount: 0.2 },
]

export function QuoteCalculator() {
  const [productType, setProductType] = useState<keyof typeof BASE_PRICES>('tiêu_chuẩn')
  const [quantity, setQuantity] = useState(100)
  const [estimatedPrice, setEstimatedPrice] = useState(0)

  const calculatePrice = (type: keyof typeof BASE_PRICES, qty: number) => {
    const basePrice = BASE_PRICES[type]
    const discount = QUANTITY_DISCOUNTS.find((d) => qty >= d.min && qty <= d.max)?.discount || 0
    const totalPrice = basePrice * qty * (1 - discount)
    return {
      basePrice: basePrice * qty,
      discount: basePrice * qty * discount,
      totalPrice: Math.round(totalPrice),
      discountPercentage: (discount * 100).toFixed(0),
    }
  }

  const handleCalculate = () => {
    const price = calculatePrice(productType, quantity)
    setEstimatedPrice(price.totalPrice)
  }

  const pricing = calculatePrice(productType, quantity)

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Máy Tính Báo Giá Nhanh</CardTitle>
        <CardDescription>Ước tính giá cấp hàng của bạn ngay lập tức</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="product-type">Loại Thùng Carton</Label>
          <Select value={productType} onValueChange={(v: any) => setProductType(v)}>
            <SelectTrigger id="product-type">
              <SelectValue placeholder="Chọn loại sản phẩm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tiêu_chuẩn">Thùng Carton Tiêu Chuẩn</SelectItem>
              <SelectItem value="có_lót">Thùng Carton Có Lót</SelectItem>
              <SelectItem value="chuyên_dụng">Thùng Carton Chuyên Dụng</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Số Lượng (cái)</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            max="100000"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            placeholder="Nhập số lượng"
          />
          <p className="text-xs text-muted-foreground">
            {quantity <= 100 && 'Khách hàng mới: Không có chiết khấu'}
            {quantity > 100 && quantity <= 500 && 'Chiết khấu: 5%'}
            {quantity > 500 && quantity <= 1000 && 'Chiết khấu: 10%'}
            {quantity > 1000 && quantity <= 5000 && 'Chiết khấu: 15%'}
            {quantity > 5000 && 'Chiết khấu: 20% - Liên hệ để thương lượng thêm'}
          </p>
        </div>

        <Button onClick={handleCalculate} className="w-full bg-primary hover:bg-primary/90">
          Tính Giá
        </Button>

        {estimatedPrice > 0 && (
          <div className="space-y-3 border-t border-border pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Giá gốc (CÓ HÀNG):</span>
              <span className="font-medium">
                {pricing.basePrice.toLocaleString('vi-VN')} ₫
              </span>
            </div>
            {parseFloat(pricing.discountPercentage) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Chiết khấu ({pricing.discountPercentage}%):
                </span>
                <span className="font-medium text-green-600">
                  -{pricing.discount.toLocaleString('vi-VN')} ₫
                </span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold border-t border-border pt-3">
              <span>Tổng ước tính:</span>
              <span className="text-primary">{pricing.totalPrice.toLocaleString('vi-VN')} ₫</span>
            </div>
            <p className="text-xs text-muted-foreground">
              *Giá này chỉ mang tính chất ước tính. Giá chính thức sẽ được cập nhật sau khi trao đổi chi tiết yêu cầu.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
