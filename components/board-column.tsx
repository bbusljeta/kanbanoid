"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { TaskCard } from "./task-card"

interface Task {
  id: string
  title: string
  description?: string
  subtasks: {
    id: string
    title: string
    completed: boolean
  }[]
  columnId: string
}

interface BoardColumnProps {
  id: string
  title: string
  tasks: Task[]
  color: string
  onTaskClick?: (task: Task) => void
}

export function BoardColumn({ id, title, tasks, color, onTaskClick }: BoardColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
  })

  return (
    <div className="min-w-[280px] flex-1">
      <div className="flex items-center gap-2 mb-6">
        <div className={`w-3 h-3 rounded-full ${color}`}></div>
        <h2 className="heading-s text-light-1 uppercase tracking-widest">
          {title} ({tasks.length})
        </h2>
      </div>

      <div
        ref={setNodeRef}
        className="space-y-5 min-h-[150px] rounded-md transition-colors"
        style={{
          backgroundColor: tasks.length === 0 ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
          padding: tasks.length === 0 ? '8px' : '0px'
        }}
      >
        <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              subtasks={task.subtasks}
              onClick={() => onTaskClick?.(task)}
            />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="h-[100px] w-full flex items-center justify-center text-light-1 text-sm">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  )
}

