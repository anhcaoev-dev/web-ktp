import type { Metadata, Viewport } from 'next'
import { Roboto } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const roboto = Roboto({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-roboto',
})

export const metadata: Metadata = {
  title: 'Bao Bì Kim Thành Phát | Sản Xuất Thùng Carton Chuyên Dụng',
  description: 'Nhà sản xuất trực tiếp thùng carton theo yêu cầu. Năng lực sản xuất lớn, giá sỉ tận xưởng, giao hàng nhanh chóng và miễn phí.',
  keywords: ['thùng carton', 'bao bì', 'sản xuất carton', 'in ấn carton', 'bao bì kim thành phát'],
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#a07555' },
    { media: '(prefers-color-scheme: dark)', color: '#c99070' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.variable} font-sans antialiased`} suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  )
}