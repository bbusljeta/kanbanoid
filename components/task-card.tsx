"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface TaskCardProps {
  id: string
  title: string
  subtasks: {
    id: string
    title: string
    completed: boolean
  }[]
  onClick?: () => void
}

export function TaskCard({ id, title, subtasks, onClick }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
  })

  const completedSubtasks = subtasks.filter((subtask) => subtask.completed).length
  const totalSubtasks = subtasks.length

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white dark:bg-dark-2 p-6 rounded-lg shadow-sm cursor-grab active:cursor-grabbing"
      onClick={onClick}
    >
      <h3 className="heading-m text-dark-1 dark:text-white mb-2">{title}</h3>
      <p className="body-m text-light-1">
        {completedSubtasks} of {totalSubtasks} subtasks
      </p>
    </div>
  )
}

