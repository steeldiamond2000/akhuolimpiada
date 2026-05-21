import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-gray-50">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image 
                src="/logo.png" 
                alt="EcoFaol Talabalar" 
                width={44} 
                height={44} 
                className="rounded-lg" 
              />
              <div>
                <p className="font-semibold text-foreground text-sm sm:text-base">EcoFaol Talabalar</p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Al-Xorazmiy universiteti tomonidan tashkil etilgan ekologik faoliyat platformasi.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm sm:text-base">Foydali havolalar</h3>
            <nav className="flex flex-col gap-2">
              <a
                href="https://akhu.uz/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-[#0077C8] transition-colors"
              >
                Universitet sayti
              </a>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm sm:text-base">Bog&apos;lanish</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Xorazm viloyati, Urganch shahri, Abulg&apos;ozi Baxodirxon ko&apos;chasi, 195</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a href="tel:+998622277171" className="hover:text-[#0077C8] transition-colors">
                  +998 (62) 227-71-71
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a href="mailto:info@akhu.uz" className="hover:text-[#0077C8] transition-colors">
                  info@akhu.uz
                </a>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <h3 className="font-semibold text-sm sm:text-base">Bizning manzil</h3>
            <div className="w-full h-48 sm:h-56 rounded-lg overflow-hidden border border-border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1527.8!2d60.6280694520137!3d41.560387468360716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDMzJzM3LjQiTiA2MMKwMzcnNDEuMSJF!5e0!3m2!1suz!2s!4v1704000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Al-Xorazmiy universiteti joylashuvi"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 sm:pt-8 border-t border-border text-center space-y-2">
          <p className="text-xs sm:text-sm text-muted-foreground">
            &copy; 2026 EcoFaol Talabalar. Barcha huquqlar himoyalangan.
          </p>
          <p className="text-xs text-muted-foreground">
            Ushbu platforma Al-Xorazmiy universiteti IT departmenti tomonidan ishlab chiqilgan.
          </p>
          <p className="text-xs text-muted-foreground">
            <a 
              href="https://mansurbek.info" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-[#0077C8] transition-colors"
            >
              Mansurbek
            </a>{" "}
            Qazaqov
          </p>
        </div>
      </div>
    </footer>
  )
}
