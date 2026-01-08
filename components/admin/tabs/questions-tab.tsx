"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Trash2, Edit, Loader2, FileQuestion } from "lucide-react"
import { toast } from "sonner"

interface Subject {
  id: number
  name: string
}

interface Question {
  id: number
  subject_id: number
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_option: string
  score: number
}

const emptyForm = {
  subject_id: "",
  question_text: "",
  option_a: "",
  option_b: "",
  option_c: "",
  option_d: "",
  correct_option: "A",
  score: "1",
}

export function QuestionsTab() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    fetchSubjects()
  }, [])

  useEffect(() => {
    fetchQuestions()
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

  const fetchQuestions = async () => {
    setIsLoading(true)
    try {
      const url = selectedSubject === "all" ? "/api/questions" : `/api/questions?subjectId=${selectedSubject}`

      const res = await fetch(url)
      const data = await res.json()
      setQuestions(data.questions || [])
    } catch (error) {
      toast.error("Savollarni yuklashda xatolik")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenDialog = (question?: Question) => {
    if (question) {
      setEditingQuestion(question)
      setForm({
        subject_id: String(question.subject_id),
        question_text: question.question_text,
        option_a: question.option_a,
        option_b: question.option_b,
        option_c: question.option_c,
        option_d: question.option_d,
        correct_option: question.correct_option,
        score: String(question.score),
      })
    } else {
      setEditingQuestion(null)
      setForm(emptyForm)
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !form.subject_id ||
      !form.question_text ||
      !form.option_a ||
      !form.option_b ||
      !form.option_c ||
      !form.option_d
    ) {
      toast.error("Barcha maydonlarni to'ldiring")
      return
    }

    setIsSaving(true)
    try {
      const body = {
        ...(editingQuestion && { id: editingQuestion.id }),
        subject_id: Number.parseInt(form.subject_id),
        question_text: form.question_text,
        option_a: form.option_a,
        option_b: form.option_b,
        option_c: form.option_c,
        option_d: form.option_d,
        correct_option: form.correct_option,
        score: Number.parseInt(form.score) || 1,
      }

      const res = await fetch("/api/questions", {
        method: editingQuestion ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Xatolik yuz berdi")
        return
      }

      toast.success(editingQuestion ? "Savol yangilandi" : "Savol qo'shildi")
      setIsDialogOpen(false)
      fetchQuestions()
    } catch (error) {
      toast.error("Xatolik yuz berdi")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      const res = await fetch(`/api/questions?id=${deleteId}`, { method: "DELETE" })

      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || "Xatolik yuz berdi")
        return
      }

      setQuestions((prev) => prev.filter((q) => q.id !== deleteId))
      toast.success("Savol o'chirildi")
    } catch (error) {
      toast.error("Xatolik yuz berdi")
    } finally {
      setDeleteId(null)
    }
  }

  const getSubjectName = (subjectId: number) => {
    return subjects.find((s) => s.id === subjectId)?.name || "-"
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Savollar</h1>
          <p className="text-muted-foreground">Test savollarini boshqaring</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Yangi savol
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingQuestion ? "Savolni tahrirlash" : "Yangi savol qo'shish"}</DialogTitle>
              <DialogDescription>Savol ma'lumotlarini kiriting</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Fan</Label>
                <Select value={form.subject_id} onValueChange={(v) => setForm({ ...form, subject_id: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Fan tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={String(subject.id)}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Savol matni</Label>
                <Textarea
                  placeholder="Savolni kiriting..."
                  value={form.question_text}
                  onChange={(e) => setForm({ ...form, question_text: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>A variant</Label>
                  <Input
                    placeholder="A varianti"
                    value={form.option_a}
                    onChange={(e) => setForm({ ...form, option_a: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>B variant</Label>
                  <Input
                    placeholder="B varianti"
                    value={form.option_b}
                    onChange={(e) => setForm({ ...form, option_b: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>C variant</Label>
                  <Input
                    placeholder="C varianti"
                    value={form.option_c}
                    onChange={(e) => setForm({ ...form, option_c: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>D variant</Label>
                  <Input
                    placeholder="D varianti"
                    value={form.option_d}
                    onChange={(e) => setForm({ ...form, option_d: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>To'g'ri javob</Label>
                  <RadioGroup
                    value={form.correct_option}
                    onValueChange={(v) => setForm({ ...form, correct_option: v })}
                    className="flex gap-4"
                  >
                    {["A", "B", "C", "D"].map((opt) => (
                      <div key={opt} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt} id={`opt-${opt}`} />
                        <Label htmlFor={`opt-${opt}`}>{opt}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Ball</Label>
                  <Input
                    type="number"
                    min="1"
                    value={form.score}
                    onChange={(e) => setForm({ ...form, score: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Bekor qilish
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  {editingQuestion ? "Saqlash" : "Qo'shish"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Label>Fan bo'yicha filtr:</Label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barchasi</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={String(subject.id)}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Savollar ro'yxati</CardTitle>
          <CardDescription>{questions.length} ta savol</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileQuestion className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Hozircha savollar yo'q</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">ID</TableHead>
                    <TableHead>Fan</TableHead>
                    <TableHead className="min-w-[300px]">Savol</TableHead>
                    <TableHead className="w-20">Javob</TableHead>
                    <TableHead className="w-16">Ball</TableHead>
                    <TableHead className="w-24">Amallar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions.map((question) => (
                    <TableRow key={question.id}>
                      <TableCell className="font-mono">{question.id}</TableCell>
                      <TableCell>{getSubjectName(question.subject_id)}</TableCell>
                      <TableCell className="max-w-md truncate">{question.question_text}</TableCell>
                      <TableCell className="font-bold text-primary">{question.correct_option}</TableCell>
                      <TableCell>{question.score}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(question)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setDeleteId(question.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Savolni o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              Bu savolni o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              O'chirish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
