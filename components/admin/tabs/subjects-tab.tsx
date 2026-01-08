"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Plus,
  Trash2,
  Loader2,
  BookOpen,
  FileText,
  LinkIcon,
  ExternalLink,
  CheckCircle2,
  XCircle,
  FolderOpen,
} from "lucide-react"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

interface Subject {
  id: number
  name: string
  sample_file_url: string | null
  created_at: string
}

export function SubjectsTab() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newSubject, setNewSubject] = useState("")
  const [newSampleUrl, setNewSampleUrl] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const [editSubject, setEditSubject] = useState<Subject | null>(null)
  const [editUrl, setEditUrl] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchSubjects()
  }, [])

  const fetchSubjects = async () => {
    try {
      const res = await fetch("/api/subjects")
      const data = await res.json()
      setSubjects(data.subjects || [])
    } catch (error) {
      toast.error("Fanlarni yuklashda xatolik")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSubject.trim()) return

    setIsAdding(true)
    try {
      const res = await fetch("/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newSubject.trim(),
          sample_file_url: newSampleUrl.trim() || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Xatolik yuz berdi")
        return
      }

      setSubjects((prev) => [...prev, data.subject])
      setNewSubject("")
      setNewSampleUrl("")
      toast.success("Fan qo'shildi")
    } catch (error) {
      toast.error("Xatolik yuz berdi")
    } finally {
      setIsAdding(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      const res = await fetch(`/api/subjects?id=${deleteId}`, { method: "DELETE" })

      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || "Xatolik yuz berdi")
        return
      }

      setSubjects((prev) => prev.filter((s) => s.id !== deleteId))
      toast.success("Fan o'chirildi")
    } catch (error) {
      toast.error("Xatolik yuz berdi")
    } finally {
      setDeleteId(null)
    }
  }

  const handleUpdateUrl = async () => {
    if (!editSubject) return

    setIsSaving(true)
    try {
      const res = await fetch("/api/subjects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editSubject.id,
          sample_file_url: editUrl.trim() || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Xatolik yuz berdi")
        return
      }

      setSubjects((prev) => prev.map((s) => (s.id === editSubject.id ? data.subject : s)))
      setEditSubject(null)
      setEditUrl("")
      toast.success("Fayl URL yangilandi")
    } catch (error) {
      toast.error("Xatolik yuz berdi")
    } finally {
      setIsSaving(false)
    }
  }

  const openEditModal = (subject: Subject) => {
    setEditSubject(subject)
    setEditUrl(subject.sample_file_url || "")
  }

  const getDownloadUrl = (url: string) => {
    if (!url) return null
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/)
    if (match) {
      return `https://drive.google.com/uc?export=download&id=${match[1]}`
    }
    return url
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Fanlar</h1>
        <p className="text-sm text-muted-foreground">Olimpiada fanlarini va namunaviy fayllarni boshqaring</p>
      </div>

      {/* Add Subject Form */}
      <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary text-primary-foreground">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Yangi fan qo'shish</CardTitle>
              <CardDescription>Fan nomi va namunaviy fayl URLini kiriting</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Fan nomi
                </Label>
                <Input
                  id="name"
                  placeholder="Masalan: Dasturlash"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  disabled={isAdding}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url" className="text-sm font-medium">
                  Namunaviy fayl URL <span className="text-muted-foreground font-normal">(ixtiyoriy)</span>
                </Label>
                <Input
                  id="url"
                  placeholder="https://drive.google.com/file/d/..."
                  value={newSampleUrl}
                  onChange={(e) => setNewSampleUrl(e.target.value)}
                  disabled={isAdding}
                  className="h-11"
                />
              </div>
            </div>
            <Button type="submit" disabled={isAdding || !newSubject.trim()} size="lg" className="w-full sm:w-auto">
              {isAdding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              Fan qo'shish
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Subjects List */}
      <Card>
        <CardHeader className="border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Mavjud fanlar</CardTitle>
                <CardDescription>{subjects.length} ta fan ro'yxatda</CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="text-sm">
              {subjects.filter((s) => s.sample_file_url).length} / {subjects.length} fayl
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : subjects.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FolderOpen className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">Hozircha fanlar yo'q</p>
              <p className="text-sm">Yuqoridagi formadan yangi fan qo'shing</p>
            </div>
          ) : (
            <div className="divide-y">
              {subjects.map((subject, index) => (
                <div
                  key={subject.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-muted/50 transition-colors gap-3"
                >
                  {/* Fan ma'lumotlari */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground">{subject.name}</h3>
                      {/* Fayl holati - mobil va desktop uchun */}
                      <div className="flex items-center gap-2 mt-1">
                        {subject.sample_file_url ? (
                          <a
                            href={getDownloadUrl(subject.sample_file_url) || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm text-green-600 hover:text-green-700 hover:underline"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Fayl biriktirilgan</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                            <XCircle className="h-4 w-4" />
                            <span>Fayl biriktirilmagan</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Amallar */}
                  <div className="flex items-center gap-2 sm:gap-1 ml-14 sm:ml-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(subject)}
                      className="flex-1 sm:flex-none gap-2"
                    >
                      <LinkIcon className="h-4 w-4" />
                      <span className="sm:hidden">Fayl biriktirish</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(subject.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editSubject} onOpenChange={() => setEditSubject(null)}>
        <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
          {/* Modal Header - Gradient */}
          <DialogHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-white/20 backdrop-blur">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-xl text-white">Namunaviy fayl biriktirish</DialogTitle>
                <p className="text-sm text-primary-foreground/80 mt-1">{editSubject?.name} fani uchun</p>
              </div>
            </div>
          </DialogHeader>

          {/* Modal Body */}
          <div className="p-6 space-y-5">
            <div className="space-y-3">
              <Label htmlFor="edit-url" className="text-sm font-semibold flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-primary" />
                Google Drive URL
              </Label>
              <Input
                id="edit-url"
                placeholder="https://drive.google.com/file/d/..."
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
                disabled={isSaving}
                className="h-12 text-base"
              />
            </div>

            {/* Qo'llanma */}
            <div className="bg-muted/50 rounded-xl p-4 space-y-3">
              <p className="text-sm font-medium text-foreground">Qanday ishlaydi?</p>
              <ol className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0 mt-0.5">
                    1
                  </span>
                  <span>Google Drive da faylni oching</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0 mt-0.5">
                    2
                  </span>
                  <span>{'"Ulashish" → "Havola nusxalash" tugmasini bosing'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0 mt-0.5">
                    3
                  </span>
                  <span>Nusxalangan havolani yuqoridagi maydonga joylashtiring</span>
                </li>
              </ol>
            </div>

            {/* URL ko'rinishi */}
            {editUrl && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-sm font-medium">URL kiritildi</span>
                </div>
                <p className="text-xs text-green-600 mt-2 break-all font-mono">
                  {editUrl.length > 60 ? editUrl.substring(0, 60) + "..." : editUrl}
                </p>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <DialogFooter className="bg-muted/30 px-6 py-4 border-t gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setEditSubject(null)}
              disabled={isSaving}
              className="w-full sm:w-auto"
            >
              Bekor qilish
            </Button>
            <Button onClick={handleUpdateUrl} disabled={isSaving} className="w-full sm:w-auto gap-2" size="lg">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              Saqlash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Fanni o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              Bu fanni o'chirmoqchimisiz? Bu bilan bog'liq barcha savollar ham o'chiriladi.
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
