import { Card, CardContent } from "@/components/ui/card"
import { Trophy, CheckCircle } from "lucide-react"

interface ResultCardProps {
  totalScore: number
}

export function ResultCard({ totalScore }: ResultCardProps) {
  return (
    <Card className="border-primary bg-primary/5 overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-center gap-2 p-3 sm:p-4 border-b border-primary/20 bg-primary/10">
          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          <span className="font-semibold text-sm sm:text-base text-primary">Test yakunlandi</span>
        </div>

        {/* Score display */}
        <div className="flex flex-col items-center justify-center py-8 sm:py-12">
          <Trophy className="h-12 w-12 sm:h-16 sm:w-16 text-yellow-500 mb-3 sm:mb-4" />
          <p className="text-xs sm:text-sm text-muted-foreground mb-1">Sizning natijangiz</p>
          <p className="text-4xl sm:text-5xl font-bold text-primary">{totalScore}</p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">ball</p>
        </div>

        {/* Footer note */}
        <div className="px-4 pb-4 sm:px-6 sm:pb-6">
          <p className="text-xs sm:text-sm text-center text-muted-foreground bg-muted/50 rounded-lg py-2 px-3">
            Olimpiada yakunlangach to'liq natijalar e'lon qilinadi
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
