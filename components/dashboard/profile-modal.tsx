import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { User, MapPin, Building, GraduationCap, BookOpen, Phone } from "lucide-react"

interface ProfileModalProps {
  user: {
    fio: string
    viloyat: string
    tuman: string
    maktab: string
    sinf: string
    telefon: string
    subjectName: string | null
  }
  isOpen: boolean
  onClose: () => void
}

export function ProfileModal({ user, isOpen, onClose }: ProfileModalProps) {
  const profileItems = [
    { icon: User, label: "F.I.O", value: user.fio },
    { icon: MapPin, label: "Viloyat", value: user.viloyat },
    { icon: MapPin, label: "Tuman/Shahar", value: user.tuman },
    { icon: Building, label: "Maktab", value: user.maktab },
    { icon: GraduationCap, label: "Sinf", value: user.sinf },
    { icon: Phone, label: "Telefon", value: user.telefon },
    { icon: BookOpen, label: "Fan", value: user.subjectName || "Tanlanmagan" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-4 sm:mx-auto max-w-[calc(100%-2rem)] rounded-lg p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">Profil ma'lumotlari</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 sm:space-y-3 mt-3 sm:mt-4">
          {profileItems.map((item) => (
            <div key={item.label} className="flex items-center gap-3 p-2.5 sm:p-3 rounded-lg bg-muted/50">
              <item.icon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm sm:text-base font-medium truncate">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
