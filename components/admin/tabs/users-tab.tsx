"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2, Users } from "lucide-react"
import { toast } from "sonner"

interface Subject {
  id: number
  name: string
}

interface User {
  id: number
  fio: string
  viloyat: string
  tuman: string
  maktab: string
  sinf: string
  telefon: string
  subject_name: string | null
  login: string
  total_score: number | null
  submitted_at: string | null
}

export function UsersTab() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchSubjects()
  }, [])

  useEffect(() => {
    fetchUsers()
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

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const url = selectedSubject === "all" ? "/api/admin/users" : `/api/admin/users?subjectId=${selectedSubject}`

      const res = await fetch(url)
      const data = await res.json()
      setUsers(data.users || [])
    } catch (error) {
      toast.error("Foydalanuvchilarni yuklashda xatolik")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Foydalanuvchilar</h1>
        <p className="text-muted-foreground">Ro'yxatdan o'tgan ishtirokchilar</p>
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

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Ishtirokchilar ro'yxati
          </CardTitle>
          <CardDescription>{users.length} ta ishtirokchi</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Hozircha ishtirokchilar yo'q</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Login</TableHead>
                    <TableHead>F.I.O</TableHead>
                    <TableHead>Fan</TableHead>
                    <TableHead>Viloyat</TableHead>
                    <TableHead>Tuman</TableHead>
                    <TableHead>Maktab</TableHead>
                    <TableHead>Sinf</TableHead>
                    <TableHead>Telefon</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ball</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-mono">{user.login}</TableCell>
                      <TableCell className="font-medium">{user.fio}</TableCell>
                      <TableCell>{user.subject_name || "-"}</TableCell>
                      <TableCell>{user.viloyat}</TableCell>
                      <TableCell>{user.tuman}</TableCell>
                      <TableCell>{user.maktab}</TableCell>
                      <TableCell>{user.sinf}</TableCell>
                      <TableCell>{user.telefon}</TableCell>
                      <TableCell>
                        {user.submitted_at ? (
                          <Badge variant="default">Topshirgan</Badge>
                        ) : (
                          <Badge variant="secondary">Kutilmoqda</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {user.total_score !== null ? user.total_score : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
