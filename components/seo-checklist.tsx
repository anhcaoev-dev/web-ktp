'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface SeoChecklistProps {
    title: string
    description?: string
    content: string
    hasImage: boolean
    type: 'article' | 'product'
}

export function SeoChecklist({ title, description, content, hasImage, type }: SeoChecklistProps) {
    const [focusKeyword, setFocusKeyword] = useState('')
    const [secondaryKeywords, setSecondaryKeywords] = useState('')

    // Strip HTML tags for processing text
    const textContent = content.replace(/<[^>]*>?/gm, ' ')
    const words = textContent.toLowerCase().trim().split(/\s+/).filter(word => word.length > 0)
    const wordCount = words.length
    const titleLength = title.trim().length
    const descLength = description ? description.trim().length : 0

    const checks = []

    // Check 1: Focus Keyword presence
    const focusKwd = focusKeyword.trim().toLowerCase()
    if (!focusKwd) {
        checks.push({ status: 'warning', text: 'Chưa nhập từ khóa chính (Focus Keyword).' })
    } else {
        // 1.1 In Title
        if (title.toLowerCase().includes(focusKwd)) {
            checks.push({ status: 'success', text: 'Đã tìm thấy từ khóa chính trong Tiêu đề.' })
        } else {
            checks.push({ status: 'error', text: 'Không tìm thấy từ khóa chính trong Tiêu đề.' })
        }

        // 1.2 In Description (if article)
        if (type === 'article') {
            if ((description || '').toLowerCase().includes(focusKwd)) {
                checks.push({ status: 'success', text: 'Đã tìm thấy từ khóa chính trong Tóm tắt.' })
            } else {
                checks.push({ status: 'error', text: 'Không tìm thấy từ khóa chính trong Tóm tắt.' })
            }
        }

        // 1.3 In Content & Density
        if (wordCount > 0) {
            // Calculate density
            const regex = new RegExp(focusKwd.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
            const matches = textContent.match(regex)
            const count = matches ? matches.length : 0
            const keywordWordCount = focusKwd.split(/\s+/).length
            // total focus kwd words / total words
            const density = count > 0 ? ((count * keywordWordCount) / wordCount) * 100 : 0

            if (count === 0) {
                checks.push({ status: 'error', text: 'Từ khóa chính chưa xuất hiện trong nội dung.' })
            } else {
                if (density < 0.5) {
                    checks.push({ status: 'warning', text: `Mật độ từ khóa chính khá thấp (${density.toFixed(1)}%). Nên xuất hiện nhiều hơn.` })
                } else if (density > 2.5) {
                    checks.push({ status: 'warning', text: `Mật độ từ khóa chính quá cao (${density.toFixed(1)}%). Rủi ro bị đánh dấu spam (nhồi nhét từ khóa).` })
                } else {
                    checks.push({ status: 'success', text: `Mật độ từ khóa chính rất tốt (${density.toFixed(1)}%).` })
                }
            }
        }
    }

    // Check 2: Secondary Keywords
    const secKeywordsList = secondaryKeywords.split(',').map(k => k.trim().toLowerCase()).filter(k => k.length > 0)
    if (secKeywordsList.length > 0) {
        let foundCount = 0
        secKeywordsList.forEach(kwd => {
            if (textContent.toLowerCase().includes(kwd)) foundCount++
        })

        if (foundCount === secKeywordsList.length) {
            checks.push({ status: 'success', text: `Đã phủ đầy đủ ${foundCount}/${secKeywordsList.length} từ khóa phụ trong nội dung.` })
        } else if (foundCount > 0) {
            checks.push({ status: 'warning', text: `Mới chỉ phủ được ${foundCount}/${secKeywordsList.length} từ khóa phụ.` })
        } else {
            checks.push({ status: 'error', text: 'Chưa có từ khóa phụ nào xuất hiện trong nội dung.' })
        }
    }

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

    // Calculate score max 100
    const totalChecks = checks.length
    let points = 0
    checks.forEach(c => {
        if (c.status === 'success') points += 1
        else if (c.status === 'warning') points += 0.5
    })

    const score = totalChecks > 0 ? Math.round((points / totalChecks) * 100) : 0

    let scoreColor = 'text-red-500'
    if (score >= 80) scoreColor = 'text-green-500'
    else if (score >= 50) scoreColor = 'text-yellow-500'

    return (
        <Card className="border-border shadow-sm bg-muted/20">
            <CardHeader className="pb-3 border-b">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-base font-semibold text-primary">Phân tích chuẩn SEO</CardTitle>
                    <div className={`text-3xl font-bold ${scoreColor}`}>
                        {score}<span className="text-lg text-muted-foreground font-normal">/100</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
                {/* Keyword Inputs */}
                <div className="space-y-3 bg-card p-3 rounded-md border border-border/50">
                    <div className="space-y-1">
                        <Label className="text-xs font-semibold">Từ khóa chính</Label>
                        <Input
                            value={focusKeyword}
                            onChange={(e) => setFocusKeyword(e.target.value)}
                            placeholder="VD: thùng carton in offset"
                            className="h-8 text-sm"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-semibold">Từ khóa phụ (cách nhau dấu phẩy)</Label>
                        <Input
                            value={secondaryKeywords}
                            onChange={(e) => setSecondaryKeywords(e.target.value)}
                            placeholder="VD: in bao bì giá rẻ, thùng carton 5 lớp"
                            className="h-8 text-sm"
                        />
                    </div>
                </div>

                {/* Check Results */}
                <div className="space-y-3 pt-2">
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
                </div>
            </CardContent>
        </Card>
    )
}
