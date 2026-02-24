'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { LogOut, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { DEFAULT_COMPANY_INFO, type CompanyInfo } from '@/lib/company-info'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(DEFAULT_COMPANY_INFO)

  // Menu items
  const menuItems = [
    { label: 'Bảng điều khiển', href: '/admin/dashboard', icon: '📊' },
    { label: 'Sản phẩm', href: '/admin/san-pham', icon: '📦' },
    { label: 'Báo giá', href: '/admin/bao-gia', icon: '💰' },
    { label: 'Tin tức', href: '/admin/tin-tuc', icon: '📰' },
    { label: 'Liên hệ', href: '/admin/lien-he', icon: '📧' },
    {
      label: 'Nội dung trang',
      icon: '🧩',
      subItems: [
        { label: 'Trang chủ', href: '/admin/noi-dung/trang-chu' },
        { label: 'Sản phẩm', href: '/admin/noi-dung/san-pham' },
        { label: 'Báo giá', href: '/admin/noi-dung/bao-gia' },
        { label: 'Thùng chuyên dụng', href: '/admin/noi-dung/thung-carton-chuyen-dung' },
        { label: 'Dịch vụ in ấn', href: '/admin/noi-dung/dich-vu-in-an' },
      ],
    },
    { label: 'Thông tin công ty', href: '/admin/thong-tin', icon: '🏢' },
    { label: 'Quản lý admin', href: '/admin/quan-ly-admin', icon: '👥' },
  ]

  // Effect for authentication check
  useEffect(() => {
    setMounted(true)

    const adminUser = localStorage.getItem('admin_user')
    const adminToken = localStorage.getItem('admin_token')

    const publicPaths = ['/admin/dang-nhap']
    const isPublicPath = publicPaths.includes(pathname)

    if (!adminUser || !adminToken) {
      if (!isPublicPath) {
        router.push('/admin/dang-nhap')
      } else {
        setLoading(false)
      }
      return
    }

    try {
      setUser(JSON.parse(adminUser))
    } catch {
      localStorage.removeItem('admin_user')
      localStorage.removeItem('admin_token')
      router.push('/admin/dang-nhap')
    } finally {
      setLoading(false)
    }
  }, [pathname, router])

  // Effect for submenu
  useEffect(() => {
    const currentItem = menuItems.find(item => 'subItems' in item && item.subItems?.some(sub => pathname.startsWith(sub.href)))
    if (currentItem) {
      setOpenSubmenu(currentItem.label)
    }
  }, [pathname, menuItems])

  // Fetch company info for admin sidebar logo
  useEffect(() => {
    fetch('/api/company-info')
      .then(res => res.json())
      .then(data => setCompanyInfo(data))
      .catch(console.error)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('admin_user')
    localStorage.removeItem('admin_token')
    router.push('/admin/dang-nhap')
  }

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Dang tai...</p>
      </div>
    )
  }

  const publicPaths = ['/admin/dang-nhap']
  const isPublicPath = publicPaths.includes(pathname)
  if (isPublicPath) return children

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Dang tai...</p>
      </div>
    )
  }

  const renderMenuItem = (item: any) => {
    const isSubmenu = 'subItems' in item
    if (isSubmenu) {
      const isOpen = openSubmenu === item.label
      const isActive = item.subItems.some((sub: any) => pathname.startsWith(sub.href))

      return (
        <div key={item.label}>
          <button
            onClick={() => setOpenSubmenu(isOpen ? null : item.label)}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left transition-colors ${isActive ? 'bg-muted text-primary' : 'text-foreground hover:bg-muted'
              }`}
          >
            <span className="text-xl">{item.icon}</span>
            {sidebarOpen && <span className="flex-1 text-sm font-medium">{item.label}</span>}
            {sidebarOpen && (
              <svg
                className={`h-4 w-4 transform transition-transform ${isOpen ? 'rotate-90' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
          {isOpen && sidebarOpen && (
            <div className="mt-1 space-y-1 pl-10">
              {item.subItems.map((subItem: any) => (
                <Link
                  key={subItem.href}
                  href={subItem.href}
                  className={`block rounded-lg px-4 py-2 text-sm transition-colors ${pathname === subItem.href
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
                    }`}
                >
                  {subItem.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      )
    }

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`flex items-center gap-3 rounded-lg px-4 py-2 transition-colors ${pathname === item.href ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'
          }`}
        title={!sidebarOpen ? item.label : ''}
      >
        <span className="text-xl">{item.icon}</span>
        {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
      </Link>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <div
        className={`${sidebarOpen ? 'w-64' : 'w-20'
          } flex flex-col border-r border-border bg-card transition-all duration-300`}
      >
        <div className="border-b border-border p-4">
          <div className="flex items-center gap-3">
            {companyInfo.logo_url ? (
              <img
                src={companyInfo.logo_url}
                alt={companyInfo.company_name}
                className="h-10 w-10 shrink-0 rounded-lg object-contain bg-white p-0.5 border border-border"
              />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary text-xs">
                {companyInfo.logo_text || companyInfo.short_name}
              </div>
            )}
            {sidebarOpen && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-foreground truncate" title={companyInfo.company_name}>
                  {companyInfo.company_name}
                </p>
                <p className="text-xs text-muted-foreground">Trang quản trị</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          {menuItems.map(renderMenuItem)}
        </nav>

        <div className="space-y-2 border-t border-border p-4">
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-foreground transition-colors hover:bg-muted"
            title={sidebarOpen ? 'Thu gon' : 'Mo rong'}
          >
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            {sidebarOpen && <span className="text-sm">Thu gon</span>}
          </button>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-destructive transition-colors hover:bg-destructive/10"
            title="Dang xuat"
          >
            <LogOut className="h-4 w-4" />
            {sidebarOpen && <span className="text-sm">Dang xuat</span>}
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
          <h1 className="text-lg font-semibold text-foreground">
            {menuItems.find((item) => item.href === pathname)?.label || 'Quản trị'}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.name || user.email}</span>
            <button
              onClick={handleLogout}
              className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
            >
              Dang xuat
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </div>
    </div>
  )
}
