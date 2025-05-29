"use client"

import { Eye, EyeOff } from "lucide-react"
import { ThemeSwitcher } from "./theme-switcher"

interface SidebarFooterProps {
  onToggleSidebar: () => void
  isSidebarHidden: boolean
}

export function SidebarFooter({ onToggleSidebar, isSidebarHidden }: SidebarFooterProps) {
  return (
    <div className="mt-auto">
      <ThemeSwitcher />
      <button
        onClick={onToggleSidebar}
        className="flex items-center gap-2 text-light-1 hover:text-primary px-6 py-4 w-full body-l"
      >
        {isSidebarHidden ? <Eye size={18} /> : <EyeOff size={18} />}
        <span>{isSidebarHidden ? "Show Sidebar" : "Hide Sidebar"}</span>
      </button>
    </div>
  )
}

