"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Subtask {
  id: string
  title: string
}

interface Column {
  id: string
  title: string
}

interface AddTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onAddTask: (task: {
    title: string
    description: string
    subtasks: { title: string; completed: boolean }[]
    status: string
  }) => void
  columns: Column[]
}

export function AddTaskModal({ isOpen, onClose, onAddTask, columns }: AddTaskModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [subtasks, setSubtasks] = useState<Subtask[]>([
    { id: "1", title: "" },
    { id: "2", title: "" },
  ])
  const [status, setStatus] = useState(columns[0]?.id || "")

  const handleAddSubtask = () => {
    const newId = (subtasks.length + 1).toString()
    setSubtasks([...subtasks, { id: newId, title: "" }])
  }

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter((subtask) => subtask.id !== id))
  }

  const handleSubtaskChange = (id: string, title: string) => {
    setSubtasks(subtasks.map((subtask) => (subtask.id === id ? { ...subtask, title } : subtask)))
  }

  const handleSubmit = () => {
    if (title.trim() === "") return

    // Filter out empty subtasks
    const validSubtasks = subtasks
      .filter((subtask) => subtask.title.trim() !== "")
      .map((subtask) => ({
        title: subtask.title,
        completed: false,
      }))

    onAddTask({
      title,
      description,
      subtasks: validSubtasks,
      status,
    })

    // Reset form
    setTitle("")
    setDescription("")
    setSubtasks([
      { id: "1", title: "" },
      { id: "2", title: "" },
    ])
    setStatus(columns[0]?.id || "")

    // Close modal
    onClose()
  }

  const handleContentClick = (e: React.MouseEvent) => {
    // Prevent clicks inside the content from closing the modal
    e.stopPropagation()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] p-6 bg-white dark:bg-dark-2 border-none" onClick={handleContentClick}>
        <DialogHeader className="p-0">
          <DialogTitle className="heading-l text-dark-1 dark:text-white">Add New Task</DialogTitle>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
            <label htmlFor="task-title" className="body-l text-medium-2 dark:text-white">
              Title
            </label>
            <Input
              id="task-title"
              placeholder="e.g. Take coffee break"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent dark:bg-dark-2 border-light-2 dark:border-medium-2"
            />
          </div>

          <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
            <label htmlFor="task-description" className="body-l text-medium-2 dark:text-white">
              Description
            </label>
            <textarea
              id="task-description"
              placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-24 p-2 rounded-md bg-transparent dark:bg-dark-2 border border-light-2 dark:border-medium-2 text-dark-1 dark:text-white body-l resize-none focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-3">
            <label className="body-l text-medium-2 dark:text-white">Subtasks</label>
            {subtasks.map((subtask) => (
              <div key={subtask.id} className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <Input
                  value={subtask.title}
                  onChange={(e) => handleSubtaskChange(subtask.id, e.target.value)}
                  placeholder="e.g. Make coffee"
                  className="flex-1 bg-transparent dark:bg-dark-2 border-light-2 dark:border-medium-2"
                  wrapperClassName="w-full"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveSubtask(subtask.id)
                  }}
                  className="text-light-1 hover:text-dark-1 dark:hover:text-white"
                >
                  <X size={24} />
                  <span className="sr-only">Remove subtask</span>
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleAddSubtask()
              }}
              className="w-full py-3 rounded-full bg-white dark:bg-medium-1 text-primary hover:bg-[#E9EFFA] dark:hover:bg-medium-2 transition-colors flex items-center justify-center gap-2"
            >
              + Add New Subtask
            </button>
          </div>

          <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
            <label htmlFor="task-status" className="body-l text-medium-2 dark:text-white">
              Status
            </label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger
                id="task-status"
                className="w-full bg-transparent dark:bg-dark-2 border-light-2 dark:border-medium-2"
              >
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-dark-2 border-light-2 dark:border-medium-1">
                {columns.map((column) => (
                  <SelectItem key={column.id} value={column.id} className="text-dark-1 dark:text-white">
                    {column.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={(e) => {
              e.stopPropagation()
              handleSubmit()
            }}
            className="w-full"
          >
            Create Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

