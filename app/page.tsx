"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Board } from "@/components/board"
import { Eye } from "lucide-react"
import { CreateBoardModal } from "@/components/create-board-modal"

// Initial mock data
const initialBoards = [
  { id: "platform-launch", name: "Platform Launch" },
  { id: "marketing-plan", name: "Marketing Plan" },
  { id: "roadmap", name: "Roadmap" },
]

export default function Home() {
  const [isSidebarHidden, setIsSidebarHidden] = useState(false)
  const [boards, setBoards] = useState(initialBoards)
  const [activeBoard, setActiveBoard] = useState("platform-launch")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarHidden(!isSidebarHidden)
  }

  const handleCreateBoard = (name: string, columns: any[]) => {
    // Create a URL-friendly ID from the name
    const id = name.toLowerCase().replace(/\s+/g, "-")

    // Add the new board
    const newBoard = { id, name }
    setBoards([...boards, newBoard])

    // Set it as the active board
    setActiveBoard(id)
  }

  // Find the active board
  const currentBoard = boards.find((board) => board.id === activeBoard) || boards[0]

  return (
    <div className="flex h-full relative overflow-hidden w-full">
      <Sidebar
        boards={boards}
        activeBoard={activeBoard}
        onToggleSidebar={toggleSidebar}
        isSidebarHidden={isSidebarHidden}
        onCreateBoard={handleCreateBoard}
        onBoardSelect={setActiveBoard}
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out w-full ${isSidebarHidden ? "ml-0" : "ml-64"}`}
      >
        {isSidebarHidden && (
          <button
            onClick={toggleSidebar}
            className="fixed bottom-8 left-0 flex items-center justify-center w-14 h-12 bg-primary hover:bg-primary-light rounded-r-full text-white transition-colors z-10"
            aria-label="Show Sidebar"
          >
            <Eye size={20} />
          </button>
        )}
        <Board name={currentBoard.name} />
      </div>

      <CreateBoardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateBoard={handleCreateBoard}
      />
    </div>
  )
}

