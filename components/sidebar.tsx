"use client"

import { useState } from "react"
import { LayoutGrid, Plus } from "lucide-react"
import Link from "next/link"
import { SidebarFooter } from "./sidebar-footer"
import { CreateBoardModal } from "./create-board-modal"

interface Board {
  id: string
  name: string
}

interface SidebarProps {
  boards: Board[]
  activeBoard: string
  onToggleSidebar: () => void
  isSidebarHidden: boolean
  onCreateBoard: (name: string, columns: any[]) => void
  onBoardSelect?: (boardId: string) => void
}

export function Sidebar({
  boards,
  activeBoard,
  onToggleSidebar,
  isSidebarHidden,
  onCreateBoard,
  onBoardSelect,
}: SidebarProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  return (
    <div
      className={`absolute top-0 left-0 w-64 border-r border-light-2 dark:border-medium-1 flex flex-col h-full bg-white dark:bg-dark-2 transition-transform duration-300 ease-in-out ${
        isSidebarHidden ? "-translate-x-full" : "translate-x-0"
      }`}
    >
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="flex space-x-0.5">
            <div className="h-6 w-1.5 bg-primary-light rounded-sm"></div>
            <div className="h-6 w-1.5 bg-primary rounded-sm"></div>
            <div className="h-6 w-1.5 bg-primary-light rounded-sm"></div>
          </div>
          <h1 className="heading-l text-dark-1 dark:text-white">kanban</h1>
        </div>
      </div>

      <div className="px-6 py-4">
        <h2 className="heading-s text-light-1 tracking-wider mb-4">ALL BOARDS ({boards.length})</h2>

        <nav className="space-y-1">
          {boards.map((board) => (
            <Link
              key={board.id}
              href={`#${board.id}`}
              onClick={() => activeBoard !== board.id && onBoardSelect?.(board.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-r-full ${
                activeBoard === board.id ? "bg-primary text-white" : "text-light-1 hover:text-primary"
              }`}
            >
              <LayoutGrid size={18} />
              <span className="heading-m">{board.name}</span>
            </Link>
          ))}

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-3 px-4 py-3 text-primary hover:text-primary-light w-full text-left"
          >
            <Plus size={18} />
            <span className="heading-m">Create New Board</span>
          </button>
        </nav>
      </div>

      <SidebarFooter onToggleSidebar={onToggleSidebar} isSidebarHidden={isSidebarHidden} />

      <CreateBoardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateBoard={onCreateBoard}
      />
    </div>
  )
}

