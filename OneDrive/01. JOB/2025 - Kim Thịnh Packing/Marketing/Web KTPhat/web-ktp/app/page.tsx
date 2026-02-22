import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  CheckCircle, 
  Zap, 
  TrendingUp, 
  Package, 
  Factory, 
  Truck, 
  Award, 
  Users,
  FileText,
  Scissors,
  Printer,
  CheckCircle2,
  ArrowRight
} from 'lucide-react'
import { getHomePageContent } from '@/lib/home-page-content-server'

const advantageIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  package: Package,
  trending_up: TrendingUp,
  zap: Zap,
  check_circle: CheckCircle,
  factory: Factory,
  truck: Truck,
  award: Award,
  users: Users,
}

const processIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'file-text': FileText,
  scissors: Scissors,
  print: Printer,
  package: Package,
  truck: Truck,
  'check-circle': CheckCircle2,
}

export default async function Home() {
  const content = await getHomePageContent('published')

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative w-full h-[600px] overflow-hidden">
        <Image 
          src={content.hero_image_url} 
          alt={content.hero_image_alt} 
          fill 
          className="object-cover" 
          priority 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl leading-tight">
                {content.hero_title}
              </h1>
              <p className="mb-8 text-lg text-white/90 md:text-xl leading-relaxed">
                {content.hero_description}
              </p>
              <div className="flex flex-col justify-start gap-4 sm:flex-row">
                <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-base px-8">
                  <Link href={content.hero_primary_href}>
                    {content.hero_primary_label}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white hover:text-black bg-transparent">
                  <Link href={content.hero_secondary_href}>
                    {content.hero_secondary_label}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links - Giúp user dễ tìm thông tin */}
      <section className="w-full bg-primary py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-primary-foreground">
            <Link href="/san-pham" className="hover:underline flex items-center gap-2">
              <Package className="h-4 w-4" /> Sản phẩm
            </Link>
            <Link href="/bao-gia" className="hover:underline flex items-center gap-2">
              <FileText className="h-4 w-4" /> Báo giá
            </Link>
            <Link href="/thung-carton-chuyen-dung" className="hover:underline flex items-center gap-2">
              <Factory className="h-4 w-4" /> Thùng carton chuyên dụng
            </Link>
            <Link href="/dich-vu-in-an" className="hover:underline flex items-center gap-2">
              <Printer className="h-4 w-4" /> Dịch vụ in ấn
            </Link>
            <Link href="/lien-he" className="hover:underline flex items-center gap-2">
              <Truck className="h-4 w-4" /> Liên hệ
            </Link>
          </div>
        </div>
      </section>

      {/* Factory Section */}
      {content.factory_images && content.factory_images.length > 0 && (
        <section className="w-full py-12 md:py-16 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-foreground md:text-4xl mb-4">
                {content.factory_title}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {content.factory_description}
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {content.factory_images.slice(0, 4).map((img, index) => (
                <div 
                  key={`factory-${index}`} 
                  className="relative h-48 md:h-64 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                >
                  {img ? (
                    <Image 
                      src={img} 
                      alt={`Xưởng sản xuất ${index + 1}`} 
                      fill 
                      className="object-cover hover:scale-105 transition-transform duration-300" 
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-muted">
                      <Factory className="h-12 w-12 text-muted-foreground/50" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      {content.stats && content.stats.length > 0 && (
        <section className="w-full bg-primary py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground text-center mb-10">
              {content.stats_title}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {content.stats.map((stat, index) => (
                <div key={`stat-${index}`} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary-foreground mb-2">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-primary-foreground/80 text-sm md:text-base">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Advantages Section */}
      <section className="w-full py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground md:text-4xl mb-4">
            {content.advantages_title}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {content.advantages.map((item, index) => {
              const Icon = advantageIconMap[item.icon] || Package
              return (
                <Card 
                  key={`${item.title}-${index}`} 
                  className="border-border bg-card hover:shadow-lg hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
                >
                  <CardHeader className="text-center pb-2">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg font-bold">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground text-center">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="w-full py-12 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              {content.featured_title}
            </h2>
            <Button variant="outline" asChild className="shrink-0">
              <Link href={content.featured_view_all_href}>
                {content.featured_view_all_label}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.featured_products.map((product, index) => (
              <Card 
                key={`${product.title}-${index}`}
                className="overflow-hidden border-border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex h-56 items-center justify-center bg-gradient-to-br from-muted to-muted/50 relative">
                  <div className="absolute inset-0 bg-primary/5" />
                  <div className="text-center relative z-10">
                    <Package className="mx-auto mb-3 h-20 w-20 text-primary/30" />
                    <p className="text-sm text-muted-foreground font-medium">{product.title}</p>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-bold">{product.title}</CardTitle>
                  <CardDescription className="text-base">{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{product.detail}</p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={product.cta_href}>
                      {product.cta_label}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      {content.process_steps && content.process_steps.length > 0 && (
        <section className="w-full py-12 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground md:text-4xl mb-4">
                {content.process_title}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {content.process_description}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {content.process_steps.map((step, index) => {
                const Icon = processIconMap[step.icon] || FileText
                return (
                  <div 
                    key={`process-${index}`} 
                    className="relative text-center group"
                  >
                    <div className="relative z-10">
                      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-10 w-10" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                    {index < content.process_steps.length - 1 && (
                      <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary to-primary/30" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      <section className="w-full py-12 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground md:text-4xl mb-10">
            {content.services_title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {content.services.map((service, index) => {
              const isPrinting = service.cta_href.includes('in-an')
              const Icon = isPrinting ? Printer : Factory
              return (
                <Card 
                  key={`${service.title}-${index}`}
                  className="border-border bg-card hover:shadow-lg hover:border-primary/50 transition-all duration-300"
                >
                  <CardHeader className="flex flex-row items-start gap-4 pb-2">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                    <Button variant="outline" asChild>
                      <Link href={service.cta_href}>
                        {service.cta_label}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Customers Section */}
      {content.customers && content.customers.length > 0 && (
        <section className="w-full py-12 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-foreground md:text-4xl mb-10">
              {content.customers_title}
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {content.customers.map((customer, index) => (
                <div 
                  key={`customer-${index}`}
                  className="flex items-center justify-center h-24 rounded-lg bg-muted/50 border border-border hover:border-primary/30 hover:bg-muted transition-colors"
                >
                  {customer.logo_url ? (
                    <Image 
                      src={customer.logo_url} 
                      alt={customer.logo_alt || customer.name}
                      width={100}
                      height={50}
                      className="object-contain"
                    />
                  ) : (
                    <div className="text-center p-2">
                      <Users className="h-8 w-8 mx-auto text-muted-foreground/50 mb-1" />
                      <p className="text-xs text-muted-foreground">{customer.name}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="w-full bg-gradient-to-r from-primary to-secondary py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-primary-foreground md:text-4xl">
              {content.cta_title}
            </h2>
            <p className="mb-8 text-lg text-primary-foreground/90 leading-relaxed">
              {content.cta_description}
            </p>
            <Button size="lg" variant="secondary" asChild className="text-base px-8">
              <Link href={content.cta_button_href}>
                {content.cta_button_label}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
