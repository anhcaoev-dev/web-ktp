'use client'

import Image from 'next/image'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, User, Clock } from 'lucide-react'

interface NewsArticle {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  author: string
  created_at: string
  image_url?: string
  featured: boolean
}

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchArticles()
  }, [])

  useEffect(() => {
    let filtered = articles

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((article) => article.category === selectedCategory)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredArticles(filtered)
  }, [articles, selectedCategory, searchQuery])

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/news')
      if (response.ok) {
        const data = await response.json()
        setArticles(data || [])
      }
    } catch (error) {
      console.error('Error fetching articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['Tất Cả', 'Tin Tức', 'Kiến Thức', 'Hướng Dẫn', 'Trường Hợp']
  const categoryValues = ['all', 'tin_tuc', 'kien_thuc', 'huong_dan', 'truong_hop']

  const featuredArticles = articles.filter((a) => a.featured).slice(0, 3)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative w-full h-96 md:h-[500px] overflow-hidden">
        <Image
          src="/images/hero-news.jpg"
          alt="Tin tức và kiến thức ngành bao bì"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Tin Tức & Kiến Thức
              </h1>
              <p className="text-lg text-white/90">
                Cập nhật những bài viết mới nhất về ngành bao bì, xu hướng thị trường và kiến thức hữu ích.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section className="w-full py-12 md:py-20 bg-card">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-foreground">Bài Viết Nổi Bật</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredArticles.map((article) => (
                <Card
                  key={article.id}
                  className="border-border overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {article.image_url && (
                    <div className="h-48 bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                        {article.category}
                      </span>
                    </div>
                    <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{article.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {article.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(article.created_at).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/tin-tuc-va-kien-thuc/${article.slug}`}>Đọc Thêm</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Search and Filter */}
      <section className="w-full py-8 md:py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="space-y-6">
            <Input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />

            <div className="flex flex-wrap gap-2">
              {categories.map((cat, idx) => (
                <Button
                  key={cat}
                  variant={selectedCategory === categoryValues[idx] ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(categoryValues[idx])}
                  size="sm"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Articles List */}
      <section className="w-full py-12 md:py-20 bg-card flex-1">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Đang tải bài viết...</p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Không có bài viết nào.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredArticles.map((article) => (
                <Card
                  key={article.id}
                  className="border-border hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {article.image_url && (
                      <div className="h-48 md:h-auto bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
                        <img
                          src={article.image_url}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className={article.image_url ? 'md:col-span-3' : 'md:col-span-4'}>
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                            {article.category}
                          </span>
                        </div>
                        <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{article.excerpt}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {article.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(article.created_at).toLocaleDateString('vi-VN')}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {article.content.split(' ').length < 300 ? '2-3 phút' : '5+ phút'} đọc
                          </div>
                        </div>
                        <Button variant="outline" asChild>
                          <Link href={`/tin-tuc-va-kien-thuc/${article.slug}`}>Đọc Thêm</Link>
                        </Button>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
