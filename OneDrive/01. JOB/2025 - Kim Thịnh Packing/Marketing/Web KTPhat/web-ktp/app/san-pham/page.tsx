import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/product-card'
import { getProductsPageContent } from '@/lib/products-page-content-server'
import { getProducts, getProductCategories } from '@/lib/products-server'

// Re-exporting this for the card, can be defined in a shared types file
export interface Product {
  id: string
  name: string
  category: string
  description: string
  price: number
  is_featured: boolean
  image_url?: string
}

function CategorySidebar({
  categories,
  selectedCategory,
}: {
  categories: { id: string; name: string }[]
  selectedCategory: string
}) {
  const allCategories = [{ id: 'tat-ca', name: 'Tất Cả' }, ...categories]

  return (
    <div className="lg:col-span-1">
      <div className="bg-background border border-border rounded-lg p-6 sticky top-20">
        <h3 className="font-bold text-lg text-foreground mb-4">Lọc Theo Danh Mục</h3>
        <div className="space-y-3">
          {allCategories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.name === 'Tất Cả' ? '/san-pham' : `/san-pham?category=${encodeURIComponent(cat.name)}`}
              className={`flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors ${
                selectedCategory === cat.name ? 'font-bold text-primary' : ''
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const selectedCategory = (searchParams?.category as string) || 'Tất Cả'
  
  // Fetch all data in parallel
  const [content, products, categories] = await Promise.all([
    getProductsPageContent(),
    getProducts(selectedCategory),
    getProductCategories(),
  ])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative w-full h-96 md:h-[500px] overflow-hidden">
        <Image
          src={content.hero_image_url}
          alt={content.hero_image_alt}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-balance">
                {content.hero_title}
              </h1>
              <p className="text-lg text-white/90 text-balance">
                {content.hero_description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="flex-1 w-full py-12 md:py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <CategorySidebar categories={categories.map(c => ({ id: c.id, name: c.name }))} selectedCategory={selectedCategory} />

            {/* Product Grid */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    category={product.category}
                    description={product.description}
                    // The simple ProductCard doesn't need all these props, but we pass them for consistency.
                    // Modify ProductCard if it needs to display more info.
                  />
                ))}
              </div>

              {products.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Không có sản phẩm trong danh mục này.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-20 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
              {content.cta_title}
            </h2>
            <p className="text-lg opacity-90 mb-8 text-balance">
              {content.cta_description}
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href={content.cta_button_href}>{content.cta_button_label}</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
