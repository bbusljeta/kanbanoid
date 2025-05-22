"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface AddColumnModalProps {
  isOpen: boolean
  onClose: () => void
  onAddColumn: (name: string) => void
}

export function AddColumnModal({ isOpen, onClose, onAddColumn }: AddColumnModalProps) {
  const [columnName, setColumnName] = useState("")

  const handleSubmit = () => {
    if (columnName.trim() === "") return

    onAddColumn(columnName)
    setColumnName("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] p-6 bg-white dark:bg-dark-2 border-none">
        <DialogHeader className="p-0">
          <DialogTitle className="heading-l text-dark-1 dark:text-white">Add New Column</DialogTitle>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="column-name" className="body-l text-medium-2 dark:text-light-1">
              Column Name
            </label>
            <Input
              id="column-name"
              placeholder="e.g. In Progress"
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              className="w-full"
            />
          </div>

          <Button onClick={handleSubmit} className="w-full">
            Create New Column
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
