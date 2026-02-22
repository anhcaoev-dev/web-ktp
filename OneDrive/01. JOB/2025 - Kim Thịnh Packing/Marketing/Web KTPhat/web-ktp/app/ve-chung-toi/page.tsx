import Image from 'next/image'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Award, Users, Zap, Target } from 'lucide-react'

export const metadata = {
  title: 'Về Chúng Tôi | Bao Bì Kim Thành Phát',
  description: 'Tìm hiểu về công ty Bao Bì Kim Thành Phát - nhà sản xuất thùng carton chuyên dụng hàng đầu.',
}

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative w-full h-96 md:h-[500px] overflow-hidden">
        <Image
          src="/images/hero-about.jpg"
          alt="Đội ngũ Bao Bì Kim Thành Phát"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-balance">
                Về Bao Bì Kim Thành Phát
              </h1>
              <p className="text-lg text-white/90 text-balance">
                Với hơn năm năm kinh nghiệm trong ngành, chúng tôi cam kết cung cấp các sản phẩm thùng carton chất lượng cao với dịch vụ khách hàng tuyệt vời.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="w-full py-12 md:py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
              Câu Chuyện Của Chúng Tôi
            </h2>
            <p className="text-lg text-muted-foreground mb-6 text-justify">
              Bao Bì Kim Thành Phát được thành lập với một sứ mệnh đơn giản: cung cấp các giải pháp bao bì carton chất lượng cao, đáng tin cậy và giá cạnh tranh cho các doanh nghiệp ở khắp nơi.
            </p>
            <p className="text-lg text-muted-foreground mb-6 text-justify">
              Từ khởi đầu khiêm tốn, chúng tôi đã phát triển thành một trong những nhà sản xuất thùng carton hàng đầu khu vực, nhờ sự tập trung vào chất lượng, đổi mới và sự hài lòng của khách hàng.
            </p>
            <p className="text-lg text-muted-foreground text-justify">
              Ngày nay, chúng tôi tự hào phục vụ hàng nghìn khách hàng trên toàn quốc, từ các doanh nghiệp nhỏ cho đến các tập đoàn lớn, với các sản phẩm được thiết kế riêng biệt để đáp ứng nhu cầu cụ thể của họ.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="w-full py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Sứ Mệnh & Giá Trị
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Mission */}
            <Card className="border-border bg-card hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Sứ Mệnh</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Cung cấp các giải pháp bao bì carton chất lượng cao, hiệu quả và bền vững, giúp các doanh nghiệp đạt được thành công của họ.
                </p>
              </CardContent>
            </Card>

            {/* Vision */}
            <Card className="border-border bg-card hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Tầm Nhìn</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Trở thành nhà cung cấp bao bì hàng đầu được khách hàng tin tưởng nhất, với sự tập trung vào đổi mới và bền vững.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Core Values */}
          <div className="mt-12 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Giá Trị Cốt Lõi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-border rounded-lg p-6 bg-background">
                <h4 className="font-bold text-lg mb-2 text-foreground">Chất Lượng</h4>
                <p className="text-muted-foreground">
                  Cam kết cung cấp các sản phẩm có chất lượng cao nhất với kiểm soát chất lượng nghiêm ngặt.
                </p>
              </div>
              <div className="border border-border rounded-lg p-6 bg-background">
                <h4 className="font-bold text-lg mb-2 text-foreground">Độ Tin Cậy</h4>
                <p className="text-muted-foreground">
                  Đáng tin cậy trong mọi mặt, từ giao hàng đúng hạn đến dịch vụ khách hàng tuyệt vời.
                </p>
              </div>
              <div className="border border-border rounded-lg p-6 bg-background">
                <h4 className="font-bold text-lg mb-2 text-foreground">Đổi Mới</h4>
                <p className="text-muted-foreground">
                  Liên tục tìm kiếm những cách mới để cải thiện sản phẩm và dịch vụ của chúng tôi.
                </p>
              </div>
              <div className="border border-border rounded-lg p-6 bg-background">
                <h4 className="font-bold text-lg mb-2 text-foreground">Bền Vững</h4>
                <p className="text-muted-foreground">
                  Cam kết sử dụng các vật liệu bền vững và giảm thiểu tác động môi trường.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="w-full py-12 md:py-20 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Tại Sao Khách Hàng Chọn Chúng Tôi
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-2">Chuyên Gia Ngành</h4>
                <p className="text-muted-foreground">
                  Với hơn năm năm kinh nghiệm, chúng tôi hiểu nhu cầu của ngành carton.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-2">Dịch Vụ Khách Hàng Tuyệt Vời</h4>
                <p className="text-muted-foreground">
                  Đội ngũ tận tâm của chúng tôi luôn sẵn sàng giúp đỡ bạn.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-2">Giá Cạnh Tranh</h4>
                <p className="text-muted-foreground">
                  Cung cấp giá tốt nhất mà không hy sinh chất lượng.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-2">Giải Pháp Tùy Chỉnh</h4>
                <p className="text-muted-foreground">
                  Thiết kế sản phẩm riêng biệt để đáp ứng nhu cầu cụ thể của bạn.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-20 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
              Muốn Tìm Hiểu Thêm?
            </h2>
            <p className="text-lg opacity-90 mb-8 text-balance">
              Liên hệ với chúng tôi ngay hôm nay để thảo luận về nhu cầu của bạn.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/lien-he">Liên Hệ Ngay</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
