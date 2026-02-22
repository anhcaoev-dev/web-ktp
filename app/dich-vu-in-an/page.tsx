import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Palette, Zap, CheckCircle, Award } from 'lucide-react'
import { getPrintingPageContent } from '@/lib/printing-page-content-server'

const iconMap: { [key: string]: React.ElementType } = {
  Award,
  Palette,
  Zap,
  CheckCircle,
}

export default async function PrintingServicesPage() {
  const content = await getPrintingPageContent()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative w-full h-96 md:h-[500px] overflow-hidden">
        <Image src={content.hero_image_url} alt={content.hero_image_alt} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-balance">{content.hero_title}</h1>
              <p className="text-lg text-white/90 text-balance">{content.hero_description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-20 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">{content.features_title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.features.map((feature, index) => {
              const Icon = iconMap[feature.icon] || Award
              return (
                <Card key={index} className="border-border bg-background hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent><p className="text-sm text-muted-foreground">{feature.description}</p></CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Printing Types Section */}
      <section className="w-full py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">{content.types_title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {content.printing_types.map((type, index) => (
              <Card key={index} className="border-border hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{type.title}</CardTitle>
                  <CardDescription>{type.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Giá:</p>
                    <p className="text-2xl font-bold text-primary">{type.price}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-2">Đặc điểm:</p>
                    <ul className="space-y-1">
                      {type.features.map((feature, i) => (
                        <li key={i} className="text-sm text-muted-foreground">✓ {feature}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="w-full py-12 md:py-20 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">{content.services_title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.services.map((service, index) => (
              <Card key={index} className="border-border hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2"><Palette className="w-5 h-5 text-primary" />{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{service.description}</p>
                  <ul className="space-y-1 text-sm">
                    {service.details.map((detail, i) => (
                      <li key={i} className="text-muted-foreground">{detail}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Finishes Section */}
      <section className="w-full py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">{content.finishes_title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.finishes.map((finish, index) => (
              <Card key={index} className="border-border text-center">
                <CardHeader><CardTitle className="text-lg">{finish.name}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{finish.desc}</p>
                  <div className="p-4 rounded-lg bg-muted/50"><p className="text-sm font-semibold text-foreground">{finish.benefit}</p></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="w-full py-12 md:py-20 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">{content.process_title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {content.process_steps.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold mx-auto mb-3">{item.step}</div>
                <h3 className="font-bold text-foreground mb-1 text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="w-full py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">{content.requirements_title}</h2>
          <div className="max-w-2xl mx-auto bg-card border border-border rounded-lg p-8">
            <div className="space-y-6">
              {content.requirements.map((req, index) => (
                <div key={index}>
                  <h3 className="text-lg font-bold mb-3 text-foreground">{req.title}</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    {req.items.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-20 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">{content.cta_title}</h2>
            <p className="text-lg opacity-90 mb-8 text-balance">{content.cta_description}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild><Link href={content.cta_primary_href}>{content.cta_primary_label}</Link></Button>
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-white/10" asChild><Link href={content.cta_secondary_href}>{content.cta_secondary_label}</Link></Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
