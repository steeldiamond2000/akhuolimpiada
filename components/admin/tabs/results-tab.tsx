"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Trophy, Medal, Download, FileSpreadsheet, Filter } from "lucide-react"
import { toast } from "sonner"

interface Subject {
  id: number
  name: string
}

interface Result {
  id: number
  user_id: number
  fio: string
  viloyat: string
  tuman: string
  maktab: string
  sinf: string
  phone: string
  subject_name: string
  total_score: number
  submitted_at: string
}

export function ResultsTab() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [results, setResults] = useState<Result[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    fetchSubjects()
  }, [])

  useEffect(() => {
    fetchResults()
  }, [selectedSubject])

  const fetchSubjects = async () => {
    try {
      const res = await fetch("/api/subjects")
      const data = await res.json()
      setSubjects(data.subjects || [])
    } catch (error) {
      toast.error("Fanlarni yuklashda xatolik")
    }
  }

  const fetchResults = async () => {
    setIsLoading(true)
    try {
      const url = selectedSubject === "all" ? "/api/admin/results" : `/api/admin/results?subjectId=${selectedSubject}`

      const res = await fetch(url)
      const data = await res.json()
      setResults(data.results || [])
    } catch (error) {
      toast.error("Natijalarni yuklashda xatolik")
    } finally {
      setIsLoading(false)
    }
  }

  const exportToExcel = () => {
    if (results.length === 0) {
      toast.error("Yuklab olish uchun natijalar yo'q")
      return
    }

    setIsExporting(true)

    try {
      // Fayl nomini yaratish
      const subjectName =
        selectedSubject === "all"
          ? "Barcha_fanlar"
          : subjects.find((s) => String(s.id) === selectedSubject)?.name || "Natijalar"
      const date = new Date().toISOString().split("T")[0]
      const fileName = `Olimpiada_${subjectName}_${date}.xls`

      // HTML jadval yaratish - Excel to'g'ri ochadi
      let html = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="UTF-8">
          <!--[if gte mso 9]>
          <xml>
            <x:ExcelWorkbook>
              <x:ExcelWorksheets>
                <x:ExcelWorksheet>
                  <x:Name>Natijalar</x:Name>
                  <x:WorksheetOptions>
                    <x:DisplayGridlines/>
                  </x:WorksheetOptions>
                </x:ExcelWorksheet>
              </x:ExcelWorksheets>
            </x:ExcelWorkbook>
          </xml>
          <![endif]-->
          <style>
            table { border-collapse: collapse; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            th { background-color: #1e40af; color: white; font-weight: bold; }
            tr:nth-child(even) { background-color: #f3f4f6; }
          </style>
        </head>
        <body>
          <table>
            <thead>
              <tr>
                <th>O'rin</th>
                <th>F.I.O</th>
                <th>Fan</th>
                <th>Viloyat</th>
                <th>Tuman</th>
                <th>Maktab</th>
                <th>Sinf</th>
                <th>Telefon</th>
                <th>Ball</th>
                <th>Topshirilgan vaqt</th>
              </tr>
            </thead>
            <tbody>
      `

      results.forEach((result, index) => {
        html += `
          <tr>
            <td>${index + 1}</td>
            <td>${result.fio || ""}</td>
            <td>${result.subject_name || ""}</td>
            <td>${result.viloyat || ""}</td>
            <td>${result.tuman || ""}</td>
            <td>${result.maktab || ""}</td>
            <td>${result.sinf || ""}</td>
            <td>${result.phone || "-"}</td>
            <td>${result.total_score}</td>
            <td>${new Date(result.submitted_at).toLocaleString("uz-UZ")}</td>
          </tr>
        `
      })

      html += `
            </tbody>
          </table>
        </body>
        </html>
      `

      // Yuklab olish
      const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8" })
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)

      toast.success("Natijalar muvaffaqiyatli yuklandi")
    } catch (error) {
      toast.error("Yuklab olishda xatolik yuz berdi")
    } finally {
      setIsExporting(false)
    }
  }

  const getRankBadge = (index: number) => {
    if (index === 0) return <Badge className="bg-yellow-500 text-yellow-950">1-o'rin</Badge>
    if (index === 1) return <Badge className="bg-slate-400 text-slate-950">2-o'rin</Badge>
    if (index === 2) return <Badge className="bg-amber-600 text-amber-50">3-o'rin</Badge>
    return <span className="text-muted-foreground">{index + 1}</span>
  }

  const getSelectedSubjectName = () => {
    if (selectedSubject === "all") return "Barcha fanlar"
    return subjects.find((s) => String(s.id) === selectedSubject)?.name || ""
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Natijalar</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Olimpiada natijalarini ko'ring va yuklab oling</p>
      </div>

      <Card className="border-primary/20">
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex flex-col gap-4">
            {/* Filtr qismi */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Filter className="h-4 w-4" />
                <Label>Fan bo'yicha:</Label>
              </div>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-full sm:w-56">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Barcha fanlar</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={String(subject.id)}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Statistika va Export */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Jami natijalar</p>
                    <p className="text-lg sm:text-xl font-bold text-primary">{results.length}</p>
                  </div>
                </div>
                {selectedSubject !== "all" && (
                  <Badge variant="outline" className="hidden sm:flex">
                    {getSelectedSubjectName()}
                  </Badge>
                )}
              </div>

              {/* Export tugmasi */}
              <Button
                onClick={exportToExcel}
                disabled={isExporting || results.length === 0}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Yuklanmoqda...
                  </>
                ) : (
                  <>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    <span className="sm:hidden">Excel</span>
                    <span className="hidden sm:inline">Excel yuklab olish</span>
                    <Download className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results List */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Natijalar jadvali
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            {results.length} ta natija {selectedSubject !== "all" && `(${getSelectedSubjectName()})`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Medal className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Hozircha natijalar yo'q</p>
            </div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">O'rin</TableHead>
                      <TableHead>F.I.O</TableHead>
                      <TableHead>Fan</TableHead>
                      <TableHead>Viloyat</TableHead>
                      <TableHead>Maktab</TableHead>
                      <TableHead>Sinf</TableHead>
                      <TableHead className="text-right">Ball</TableHead>
                      <TableHead>Topshirilgan vaqt</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((result, index) => (
                      <TableRow key={result.id} className="hover:bg-muted/50">
                        <TableCell>{getRankBadge(index)}</TableCell>
                        <TableCell className="font-medium">{result.fio}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{result.subject_name}</Badge>
                        </TableCell>
                        <TableCell>{result.viloyat}</TableCell>
                        <TableCell>{result.maktab}</TableCell>
                        <TableCell>{result.sinf}</TableCell>
                        <TableCell className="text-right">
                          <span className="font-bold text-primary text-lg">{result.total_score}</span>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(result.submitted_at).toLocaleString("uz-UZ")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="md:hidden space-y-3">
                {results.map((result, index) => (
                  <div key={result.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getRankBadge(index)}
                        <span className="font-semibold text-sm">{result.fio}</span>
                      </div>
                      <span className="text-xl font-bold text-primary">{result.total_score}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Fan:</span>
                        <Badge variant="outline" className="text-xs px-1 py-0">
                          {result.subject_name}
                        </Badge>
                      </div>
                      <div>
                        <span className="font-medium">Sinf:</span> {result.sinf}
                      </div>
                      <div>
                        <span className="font-medium">Viloyat:</span> {result.viloyat}
                      </div>
                      <div>
                        <span className="font-medium">Maktab:</span> {result.maktab}
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
                      {new Date(result.submitted_at).toLocaleString("uz-UZ")}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
