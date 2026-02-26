'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DEFAULT_COMPANY_INFO, type CompanyInfo } from '@/lib/company-info'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(DEFAULT_COMPANY_INFO)

  const navLinks = [
    { label: 'Trang Chủ', href: '/' },
    { label: 'Sản Phẩm', href: '/san-pham' },
    { label: 'Thùng Carton Chuyên Dụng', href: '/thung-carton' },
    { label: 'Dịch Vụ In Ấn', href: '/dich-vu-in-an' },
    { label: 'Về Chúng Tôi', href: '/ve-chung-toi' },
    { label: 'Tin Tức', href: '/tin-tuc-va-kien-thuc' },
    { label: 'Liên Hệ', href: '/lien-he' },
  ]

  useEffect(() => {
    const controller = new AbortController()

    const fetchCompanyInfo = async () => {
      try {
        const response = await fetch('/api/company-info', { signal: controller.signal })
        if (!response.ok) return
        const data = await response.json()
        setCompanyInfo(data)
      } catch (error) {
        console.error('Error fetching company info:', error)
      }
    }

    fetchCompanyInfo()

    return () => controller.abort()
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            {companyInfo.logo_url ? (
              <img
                src={companyInfo.logo_url}
                alt={companyInfo.company_name}
                className="h-10 w-auto max-w-[150px] rounded-lg object-contain p-0.5 bg-white"
              />
            ) : (
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-lg font-bold text-primary-foreground">
                  {companyInfo.logo_text || companyInfo.short_name}
                </span>
              </div>
            )}

            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-foreground">{companyInfo.company_name}</h1>
              <p className="text-xs text-muted-foreground">{companyInfo.tagline}</p>
            </div>
          </Link>

          <nav className="hidden lg:flex gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-accent/10 rounded-md transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex gap-2">
            <Button variant="default" asChild>
              <Link href="/bao-gia">Yêu Cầu Báo Giá</Link>
            </Button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 hover:bg-accent/10 rounded-md transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t border-border pt-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-accent/10 rounded-md transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-border">
              <Button variant="default" className="w-full" asChild>
                <Link href="/bao-gia">Yêu Cầu Báo Giá</Link>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
