'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react'

interface SeoChecklistProps {
    title: string
    description?: string
    content: string
    hasImage: boolean
    type: 'article' | 'product'
}

export function SeoChecklist({ title, description, content, hasImage, type }: SeoChecklistProps) {
    // Strip HTML tags for word count
    const textContent = content.replace(/<[^>]*>?/gm, '')
    const wordCount = textContent.trim().split(/\s+/).filter(word => word.length > 0).length
    const titleLength = title.trim().length
    const descLength = description ? description.trim().length : 0

    const checks = []

    // Title check
    if (titleLength === 0) {
        checks.push({ status: 'error', text: 'Chưa có tiêu đề bài viết/sản phẩm.' })
    } else if (titleLength >= 40 && titleLength <= 70) {
        checks.push({ status: 'success', text: 'Tiêu đề có độ dài tốt (40-70 ký tự).' })
    } else {
        checks.push({ status: 'warning', text: `Tiêu đề hiện tại (${titleLength} ký tự) lý tưởng nhất là từ 40-70 ký tự.` })
    }

    // Description / Excerpt check
    if (type === 'article') {
        if (descLength === 0) {
            checks.push({ status: 'error', text: 'Chưa có tóm tắt (được dùng làm thẻ Meta Description).' })
        } else if (descLength >= 120 && descLength <= 160) {
            checks.push({ status: 'success', text: 'Đoạn tóm tắt có độ dài chuẩn SEO (120-160 ký tự).' })
        } else {
            checks.push({ status: 'warning', text: `Tóm tắt (${descLength} ký tự) lý tưởng nhất là dài từ 120-160 ký tự.` })
        }
    }

    // Content length check
    const minWords = type === 'article' ? 300 : 100
    if (wordCount === 0) {
        checks.push({ status: 'error', text: 'Chưa có nội dung mô tả.' })
    } else if (wordCount >= minWords) {
        checks.push({ status: 'success', text: `Nội dung đủ dài (${wordCount} từ).` })
    } else {
        checks.push({ status: 'warning', text: `Nội dung khá ngắn (${wordCount} từ). Khuyến nghị tối thiểu ${minWords} từ.` })
    }

    // Image check
    if (hasImage) {
        checks.push({ status: 'success', text: 'Đã có hình ảnh đại diện.' })
    } else {
        checks.push({ status: 'warning', text: 'Nên có hình ảnh đại diện để thu hút người xem tốt hơn.' })
    }

    // H2, H3 tags in content check
    const hasHeadings = /<h[2-3][^>]*>/i.test(content)
    if (hasHeadings) {
        checks.push({ status: 'success', text: 'Nội dung có chứa thẻ tiêu đề phụ (H2, H3) giúp chia bố cục tốt.' })
    } else {
        if (wordCount > 0) {
            checks.push({ status: 'warning', text: 'Nên chia mục nội dung bằng các thẻ tiêu đề (H2, H3) để dễ đọc hơn.' })
        }
    }

    // Keyword check (Optional basic check in content)
    const hasStrongOrB = /<(strong|b)[^>]*>/i.test(content)
    if (hasStrongOrB) {
        checks.push({ status: 'success', text: 'Bạn đã có bôi đậm các từ khoá trong nội dung.' })
    } else {
        if (wordCount > 50) {
            checks.push({ status: 'warning', text: 'Nên bôi đậm (in đậm) các từ khóa quan trọng trong bài.' })
        }
    }

    // Calculate score max 100
    const totalChecks = checks.length
    let points = 0
    checks.forEach(c => {
        if (c.status === 'success') points += 1
        else if (c.status === 'warning') points += 0.5
    })

    const score = Math.round((points / totalChecks) * 100) || 0

    let scoreColor = 'text-red-500'
    if (score >= 80) scoreColor = 'text-green-500'
    else if (score >= 50) scoreColor = 'text-yellow-500'

    return (
        <Card className="border-border shadow-sm bg-muted/20">
            <CardHeader className="pb-3 border-b">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-base font-semibold text-primary">Chỉ số SEO (RankMath style)</CardTitle>
                    <div className={`text-3xl font-bold ${scoreColor}`}>
                        {score}<span className="text-lg text-muted-foreground font-normal">/100</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
                {checks.map((check, index) => (
                    <div key={index} className="flex items-start gap-3 text-sm">
                        {check.status === 'success' && <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />}
                        {check.status === 'warning' && <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />}
                        {check.status === 'error' && <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />}
                        <span className={check.status === 'success' ? 'text-muted-foreground' : 'text-foreground font-medium'}>
                            {check.text}
                        </span>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
