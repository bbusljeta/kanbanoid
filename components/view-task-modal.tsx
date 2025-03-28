"use client"

import type React from "react"

import { useState } from "react"
import { MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Subtask {
  id: string
  title: string
  completed: boolean
}

interface Column {
  id: string
  title: string
}

interface Task {
  id: string
  title: string
  description?: string
  subtasks: Subtask[]
  columnId: string
}

interface ViewTaskModalProps {
  isOpen: boolean
  onClose: () => void
  task: Task | null
  columns: Column[]
  onUpdateTask: (taskId: string, updatedTask: Partial<Task>) => void
  onUpdateSubtask: (taskId: string, subtaskId: string, completed: boolean) => void
  onDeleteTask: (taskId: string) => void
  onEditTask: (task: Task) => void
}

export function ViewTaskModal({
  isOpen,
  onClose,
  task,
  columns,
  onUpdateTask,
  onUpdateSubtask,
  onDeleteTask,
  onEditTask,
}: ViewTaskModalProps) {
  const [status, setStatus] = useState(task?.columnId || "")

  // Update status when task changes
  if (task && task.columnId !== status) {
    setStatus(task.columnId)
  }

  if (!task) return null

  const completedSubtasks = task.subtasks.filter((subtask) => subtask.completed).length

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
    onUpdateTask(task.id, { columnId: newStatus })
  }

  const handleSubtaskToggle = (subtaskId: string, checked: boolean) => {
    onUpdateSubtask(task.id, subtaskId, checked)
  }

  const handleContentClick = (e: React.MouseEvent) => {
    // Prevent clicks inside the content from closing the modal
    e.stopPropagation()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] p-6 bg-white dark:bg-dark-2 border-none" onClick={handleContentClick}>
        <DialogHeader className="p-0 flex flex-row justify-between items-start">
          <DialogTitle className="heading-l text-dark-1 dark:text-white pr-8">{task.title}</DialogTitle>
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-light-1 hover:text-dark-1 dark:hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                >
                  <MoreVertical className="h-5 w-5" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={5}
                className="bg-medium-1 dark:bg-medium-1 text-white border-none rounded-lg shadow-lg py-4 px-4 min-w-[180px] z-[200]"
              >
                <DropdownMenuItem
                  className="hover:bg-medium-2 focus:bg-medium-2 body-l py-2 rounded cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    onClose()
                    onEditTask(task)
                  }}
                >
                  Edit Task
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-medium-2 focus:bg-medium-2 body-l py-2 rounded cursor-pointer text-destructive"
                  onClick={(e) => {
                    e.stopPropagation()
                    onClose()
                    onDeleteTask(task.id)
                  }}
                >
                  Delete Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </DialogHeader>

        {task.description && <p className="body-l text-light-1 mt-6">{task.description}</p>}

        <div className="mt-6 space-y-4">
          <div className="space-y-3">
            <h3 className="body-l text-medium-2 dark:text-white">
              Subtasks ({completedSubtasks} of {task.subtasks.length})
            </h3>
            <div className="space-y-2">
              {task.subtasks.map((subtask) => (
                <div
                  key={subtask.id}
                  className="flex items-center gap-4 p-3 bg-off-white dark:bg-dark-1 rounded-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    id={subtask.id}
                    checked={subtask.completed}
                    onCheckedChange={(checked) => handleSubtaskToggle(subtask.id, checked === true)}
                    className="h-4 w-4"
                  />
                  <label
                    htmlFor={subtask.id}
                    className={`body-m flex-1 ${
                      subtask.completed ? "text-light-1 line-through" : "text-dark-1 dark:text-white"
                    }`}
                  >
                    {subtask.title}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
            <label htmlFor="task-status" className="body-l text-medium-2 dark:text-white">
              Current Status
            </label>
            <Select value={status} onValueChange={handleStatusChange}>
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
        </div>
      </DialogContent>
    </Dialog>
  )
}

