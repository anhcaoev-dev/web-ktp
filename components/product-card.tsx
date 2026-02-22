'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import Link from 'next/link'
import { Package } from 'lucide-react'

interface ProductCardProps {
  id: string
  name: string
  category: string
  description: string
  specifications?: string
  image?: string
  onSelect?: (id: string) => void
  isSelected?: boolean
}

export function ProductCard({
  id,
  name,
  category,
  description,
  specifications,
  image,
  onSelect,
  isSelected = false,
}: ProductCardProps) {
  return (
    <Card className="border-border overflow-hidden hover:shadow-lg transition-all">
      <div className="relative h-48 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="text-center">
            <Package className="w-16 h-16 text-primary/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Hình ảnh sản phẩm</p>
          </div>
        )}

        {onSelect && (
          <div className="absolute top-3 right-3">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onSelect(id)}
              className="h-5 w-5"
            />
          </div>
        )}
      </div>

      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg">{name}</CardTitle>
            <CardDescription className="text-xs">{category}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{description}</p>

        {specifications && (
          <div>
            <p className="text-xs font-semibold text-foreground mb-1">Thông Số Kỹ Thuật:</p>
            <p className="text-xs text-muted-foreground">{specifications}</p>
          </div>
        )}

        <Button variant="outline" className="w-full" asChild>
          <Link href={`/san-pham/${id}`}>Chi Tiết</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
