"use client"

import { useState } from "react"
import { AdminHeader } from "./admin-header"
import { AdminSidebar } from "./admin-sidebar"
import { SubjectsTab } from "./tabs/subjects-tab"
import { QuestionsTab } from "./tabs/questions-tab"
import { SettingsTab } from "./tabs/settings-tab"
import { ResultsTab } from "./tabs/results-tab"
import { UsersTab } from "./tabs/users-tab"

type TabType = "subjects" | "questions" | "settings" | "results" | "users"

interface AdminDashboardProps {
  userName: string
}

export function AdminDashboard({ userName }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("subjects")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    setIsSidebarOpen(false) // Close sidebar on mobile after selection
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminHeader userName={userName} onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex">
        <AdminSidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 p-3 sm:p-6 lg:ml-64">
          <div className="max-w-6xl mx-auto">
            {activeTab === "subjects" && <SubjectsTab />}
            {activeTab === "questions" && <QuestionsTab />}
            {activeTab === "settings" && <SettingsTab />}
            {activeTab === "results" && <ResultsTab />}
            {activeTab === "users" && <UsersTab />}
          </div>
        </main>
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}
    </div>
  )
}
