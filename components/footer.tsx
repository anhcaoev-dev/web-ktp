'use client'

import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import { DEFAULT_COMPANY_INFO, type CompanyInfo } from '@/lib/company-info'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(DEFAULT_COMPANY_INFO)

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
    <footer className="w-full bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4">{companyInfo.company_name}</h3>
            <p className="text-sm opacity-90 mb-4">{companyInfo.description}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Liên Kết Nhanh</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/san-pham" className="hover:underline opacity-90 hover:opacity-100">
                  Sản Phẩm
                </Link>
              </li>
              <li>
                <Link href="/bao-gia" className="hover:underline opacity-90 hover:opacity-100">
                  Báo Giá
                </Link>
              </li>
              <li>
                <Link href="/ve-chung-toi" className="hover:underline opacity-90 hover:opacity-100">
                  Về Chúng Tôi
                </Link>
              </li>
              <li>
                <Link href="/tin-tuc-va-kien-thuc" className="hover:underline opacity-90 hover:opacity-100">
                  Tin Tức
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Dịch Vụ</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/thung-carton-chuyen-dung" className="hover:underline opacity-90 hover:opacity-100">
                  Thùng Carton Chuyên Dụng
                </Link>
              </li>
              <li>
                <Link href="/dich-vu-in-an" className="hover:underline opacity-90 hover:opacity-100">
                  Dịch Vụ In Ấn
                </Link>
              </li>
              <li>
                <Link href="/lien-he" className="hover:underline opacity-90 hover:opacity-100">
                  Liên Hệ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Liên Hệ</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Phone size={16} className="mt-0.5 flex-shrink-0" />
                <span className="opacity-90">{companyInfo.phone}</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="mt-0.5 flex-shrink-0" />
                <span className="opacity-90">{companyInfo.email}</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span className="opacity-90">{companyInfo.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-75">
            <p>
              &copy; {currentYear} {companyInfo.company_name}. Bản quyền đã được bảo hộ.
            </p>
            <div className="flex gap-6">
              <Link href="/lien-he" className="hover:opacity-100">
                Chính sách bảo mật
              </Link>
              <Link href="/lien-he" className="hover:opacity-100">
                Điều khoản dịch vụ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
