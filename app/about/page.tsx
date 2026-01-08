import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Target, Users, Award } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-10 sm:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-3 sm:space-y-4">
              <h1 className="text-2xl sm:text-4xl font-bold">Biz haqimizda</h1>
              <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed">
                Al-Xorazmiy Universiteti - O'zbekistondagi yangi tashkil etilgan oliy ta'lim muassasalaridan
                biri.
              </p>
            </div>
          </div>
        </section>

        <section className="py-8 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-8 max-w-5xl mx-auto">
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <GraduationCap className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-2" />
                  <CardTitle className="text-base sm:text-lg">Universitet haqida</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 text-muted-foreground leading-relaxed text-sm sm:text-base">
Al-Xorazmiy universiteti O'zbekiston Repbulikasi Prezidentning 2025-yil 30-apreldagi PQ-160-sonli farmoni bilan O'zbekistonning texnologiya, muhandislik va sun'iy intellekt sohasidagi ta'limni modernizatsiya qilish va xalqarolashtirish bo'yicha milliy strategiyasining asosiy ustuni sifatida tashkil etilgan.
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <Target className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-2" />
                  <CardTitle className="text-base sm:text-lg">Olimpiada maqsadi</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 text-muted-foreground leading-relaxed text-sm sm:text-base">
                  Al-Xorazmiy olimpiadasi o'tkazishdan asosiy maqsad shuki, iste'dodli yoshlarni aniqlash va qo'llab-quvvatlash, yurtimizda ilm-fanga yoshlarni qiziqtirish va ularga
yanada keng imkoniyatlarni yaratish, yoshlarning ijodiy qobiliyatlarning roʻyobga chiqishiga koʻmaklashish va
qoʻllab-quvvatlashdan iborat!
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <Users className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-2" />
                  <CardTitle className="text-base sm:text-lg">Ishtirokchilar</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 text-muted-foreground leading-relaxed text-sm sm:text-base">
                  Olimpiadada O'zbekiston bo'ylab 10-11 sinf o'quvchilari qatnashishi mumkin.
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <Award className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-2" />
                  <CardTitle className="text-base sm:text-lg">Mukofotlar</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 text-muted-foreground leading-relaxed text-sm sm:text-base">
                  G'oliblar diplomlar, sertifikatlar va qimmatbaho sovg'alar bilan taqdirlanadi.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-8 sm:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-xl sm:text-3xl font-bold text-center mb-6 sm:mb-10">Olimpiada fanlari</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 max-w-4xl mx-auto">
              {[
                { name: "Dasturlash", icon: "💻", desc: "Python, C++, algoritimlar" },
                { name: "Fizika", icon: "⚛️", desc: "Mexanika, elektr, optika" },
                { name: "Sun'iy intellekt", icon: "🤖", desc: "AI asoslari, ML" },
                { name: "Matematika", icon: "📐", desc: "Algebra, geometriya" },
              ].map((subject) => (
                <Card key={subject.name} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-3 sm:pt-6 sm:p-6">
                    <div className="text-2xl sm:text-4xl mb-2 sm:mb-3">{subject.icon}</div>
                    <h3 className="font-semibold text-sm sm:text-base mb-0.5 sm:mb-1">{subject.name}</h3>
                    <p className="text-[10px] sm:text-sm text-muted-foreground hidden sm:block">{subject.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
