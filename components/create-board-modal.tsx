"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Column {
  id: string
  name: string
}

interface CreateBoardModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateBoard: (name: string, columns: Column[]) => void
}

export function CreateBoardModal({ isOpen, onClose, onCreateBoard }: CreateBoardModalProps) {
  const [boardName, setBoardName] = useState("")
  const [columns, setColumns] = useState<Column[]>([
    { id: "1", name: "Todo" },
    { id: "2", name: "Doing" },
  ])

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setBoardName("")
      setColumns([
        { id: "1", name: "Todo" },
        { id: "2", name: "Doing" },
      ])
    }
  }, [isOpen])

  const handleAddColumn = () => {
    const newId = (columns.length + 1).toString()
    setColumns([...columns, { id: newId, name: "" }])
  }

  const handleRemoveColumn = (id: string) => {
    setColumns(columns.filter((column) => column.id !== id))
  }

  const handleColumnNameChange = (id: string, name: string) => {
    setColumns(columns.map((column) => (column.id === id ? { ...column, name } : column)))
  }

  const handleSubmit = () => {
    if (boardName.trim() === "") return

    // Filter out empty columns
    const validColumns = columns.filter((column) => column.name.trim() !== "")

    onCreateBoard(boardName, validColumns)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] p-6 bg-white dark:bg-dark-2 border-none">
        <DialogHeader className="p-0">
          <DialogTitle className="heading-l text-dark-1 dark:text-white">Add New Board</DialogTitle>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="board-name" className="body-l text-medium-2 dark:text-light-1">
              Board Name
            </label>
            <Input
              id="board-name"
              placeholder="e.g. Web Design"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <label className="body-l text-medium-2 dark:text-light-1">Board Columns</label>
            {columns.map((column) => (
              <div key={column.id} className="flex items-center gap-2">
                <Input
                  value={column.name}
                  onChange={(e) => handleColumnNameChange(column.id, e.target.value)}
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveColumn(column.id)}
                  className="text-light-1 hover:text-dark-1 dark:hover:text-white"
                >
                  <X size={24} />
                  <span className="sr-only">Remove column</span>
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddColumn}
              className="w-full py-3 rounded-full bg-white dark:bg-medium-1 text-primary hover:bg-[#E9EFFA] dark:hover:bg-medium-2 transition-colors flex items-center justify-center gap-2"
            >
              <span className="text-primary">+</span> Add New Column
            </button>
          </div>

          <Button onClick={handleSubmit} className="w-full">
            Create New Board
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

