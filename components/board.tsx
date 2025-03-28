"use client"

import { useState } from "react"
import { MoreVertical, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BoardColumn } from "./board-column"
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { TaskCard } from "./task-card"
import { AddTaskModal } from "./add-task-modal"
import { ViewTaskModal } from "./view-task-modal"
import { EditTaskModal } from "./edit-task-modal"

interface Task {
  id: string
  columnId: string
  title: string
  description?: string
  subtasks: {
    id: string
    title: string
    completed: boolean
  }[]
}

interface Column {
  id: string
  title: string
  color: string
}

interface BoardProps {
  name: string
  initialColumns?: Column[]
  initialTasks?: Task[]
}

export function Board({ name, initialColumns = [], initialTasks = [] }: BoardProps) {
  const [columns, setColumns] = useState<Column[]>(
    initialColumns.length > 0
      ? initialColumns
      : [
          { id: "todo", title: "Todo", color: "bg-blue-400" },
          { id: "doing", title: "Doing", color: "bg-purple-400" },
          { id: "done", title: "Done", color: "bg-green-400" },
        ],
  )

  const [tasks, setTasks] = useState<Task[]>(
    initialTasks.length > 0
      ? initialTasks
      : [
          {
            id: "task-1",
            columnId: "todo",
            title: "Build UI for onboarding flow",
            subtasks: [
              { id: "subtask-1", title: "Design onboarding screens", completed: false },
              { id: "subtask-2", title: "Implement UI components", completed: false },
              { id: "subtask-3", title: "Add animations", completed: false },
            ],
          },
          {
            id: "task-2",
            columnId: "todo",
            title: "Build UI for search",
            subtasks: [{ id: "subtask-4", title: "Design search input", completed: false }],
          },
          {
            id: "task-3",
            columnId: "todo",
            title: "Build settings UI",
            subtasks: [
              { id: "subtask-5", title: "Design settings page", completed: false },
              { id: "subtask-6", title: "Implement settings functionality", completed: false },
            ],
          },
          {
            id: "task-4",
            columnId: "todo",
            title: "QA and test all major user journeys",
            subtasks: [
              { id: "subtask-7", title: "Test onboarding flow", completed: false },
              { id: "subtask-8", title: "Test search functionality", completed: false },
            ],
          },
          {
            id: "task-5",
            columnId: "doing",
            title: "Design settings and search pages",
            subtasks: [
              { id: "subtask-9", title: "Create wireframes", completed: true },
              { id: "subtask-10", title: "Get feedback", completed: false },
              { id: "subtask-11", title: "Iterate on designs", completed: false },
            ],
          },
          {
            id: "task-6",
            columnId: "doing",
            title: "Add account management endpoints",
            subtasks: [
              { id: "subtask-12", title: "Define API endpoints", completed: true },
              { id: "subtask-13", title: "Implement authentication", completed: false },
              { id: "subtask-14", title: "Implement authorization", completed: false },
            ],
          },
          {
            id: "task-7",
            columnId: "doing",
            title: "Design onboarding flow",
            subtasks: [
              { id: "subtask-15", title: "Create wireframes", completed: true },
              { id: "subtask-16", title: "Get feedback", completed: false },
              { id: "subtask-17", title: "Iterate on designs", completed: false },
            ],
          },
          {
            id: "task-8",
            columnId: "doing",
            title: "Add search endpoints",
            subtasks: [
              { id: "subtask-18", title: "Define API endpoints", completed: true },
              { id: "subtask-19", title: "Implement search functionality", completed: false },
            ],
          },
          {
            id: "task-9",
            columnId: "doing",
            title: "Add authentication endpoints",
            subtasks: [
              { id: "subtask-20", title: "Define API endpoints", completed: true },
              { id: "subtask-21", title: "Implement authentication", completed: false },
            ],
          },
          {
            id: "task-10",
            columnId: "doing",
            title: "Research pricing points of various competitors and trial different business models",
            description:
              "We know what we're planning to build for version one. Now we need to finalise the first pricing model we'll use. Keep iterating the subtasks until we have a coherent proposition.",
            subtasks: [
              { id: "subtask-22", title: "Research competitor pricing and business models", completed: true },
              { id: "subtask-23", title: "Outline a business model that works for our solution", completed: true },
              {
                id: "subtask-24",
                title: "Talk to potential customers about our proposed solution and ask for fair price expectancy",
                completed: false,
              },
            ],
          },
          {
            id: "task-11",
            columnId: "done",
            title: "Conduct 5 wireframe tests",
            subtasks: [{ id: "subtask-25", title: "Prepare test scenarios", completed: true }],
          },
          {
            id: "task-12",
            columnId: "done",
            title: "Create wireframe prototype",
            subtasks: [{ id: "subtask-26", title: "Create wireframes", completed: true }],
          },
          {
            id: "task-13",
            columnId: "done",
            title: "Review results of usability tests and iterate",
            subtasks: [
              { id: "subtask-27", title: "Analyze test results", completed: true },
              { id: "subtask-28", title: "Identify improvement areas", completed: true },
              { id: "subtask-29", title: "Implement changes", completed: true },
            ],
          },
          {
            id: "task-14",
            columnId: "done",
            title: "Create paper prototypes and conduct 10 usability tests with potential customers",
            subtasks: [
              { id: "subtask-30", title: "Create paper prototypes", completed: true },
              { id: "subtask-31", title: "Conduct usability tests", completed: true },
            ],
          },
          {
            id: "task-15",
            columnId: "done",
            title: "Market discovery",
            subtasks: [{ id: "subtask-32", title: "Research market trends", completed: true }],
          },
          {
            id: "task-16",
            columnId: "done",
            title: "Competitor analysis",
            subtasks: [
              { id: "subtask-33", title: "Identify competitors", completed: true },
              { id: "subtask-34", title: "Analyze strengths and weaknesses", completed: true },
            ],
          },
          {
            id: "task-17",
            columnId: "done",
            title: "Research the market",
            subtasks: [
              { id: "subtask-35", title: "Identify target audience", completed: true },
              { id: "subtask-36", title: "Analyze market needs", completed: true },
            ],
          },
        ],
  )

  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)
  const [viewTask, setViewTask] = useState<Task | null>(null)
  const [isViewTaskModalOpen, setIsViewTaskModalOpen] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const activeTaskId = active.id as string
    const task = tasks.find((t) => t.id === activeTaskId)
    if (task) {
      setActiveTask(task)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Find the active task
    const activeTask = tasks.find((task) => task.id === activeId)
    if (!activeTask) return

    // Check if over a column
    const isOverColumn = columns.some((column) => column.id === overId)
    if (isOverColumn) {
      // If dragging over a column, change the task's column
      setTasks((tasks) =>
        tasks.map((task) => {
          if (task.id === activeId) {
            return { ...task, columnId: overId }
          }
          return task
        }),
      )
      return
    }

    // Check if over another task
    const overTask = tasks.find((task) => task.id === overId)
    if (!overTask || activeTask.columnId !== overTask.columnId) return

    // Reorder tasks within the same column
    setTasks((tasks) => {
      const activeIndex = tasks.findIndex((t) => t.id === activeId)
      const overIndex = tasks.findIndex((t) => t.id === overId)

      // If in the same column, reorder
      if (tasks[activeIndex].columnId === tasks[overIndex].columnId) {
        return arrayMove(tasks, activeIndex, overIndex)
      }

      return tasks
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null)
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Check if over a column
    const isOverColumn = columns.some((column) => column.id === overId)
    if (isOverColumn) {
      // If dragging over a column, change the task's column
      setTasks((tasks) =>
        tasks.map((task) => {
          if (task.id === activeId) {
            return { ...task, columnId: overId }
          }
          return task
        }),
      )
      return
    }

    // Check if over another task
    const overTask = tasks.find((task) => task.id === overId)
    if (!overTask) return

    // Reorder tasks within the same column
    setTasks((tasks) => {
      const activeIndex = tasks.findIndex((t) => t.id === activeId)
      const overIndex = tasks.findIndex((t) => t.id === overId)

      // If in the same column, reorder
      if (tasks[activeIndex].columnId === tasks[overIndex].columnId) {
        return arrayMove(tasks, activeIndex, overIndex)
      }

      // If in different columns, move to the new column
      const updatedTasks = [...tasks]
      updatedTasks[activeIndex] = { ...updatedTasks[activeIndex], columnId: overTask.columnId }

      return arrayMove(updatedTasks, activeIndex, overIndex)
    })
  }

  const handleAddTask = (newTask: {
    title: string
    description: string
    subtasks: { title: string; completed: boolean }[]
    status: string
  }) => {
    const newTaskId = `task-${tasks.length + 1}`
    const newSubtasks = newTask.subtasks.map((subtask, index) => ({
      id: `subtask-${tasks.length + 1}-${index + 1}`,
      title: subtask.title,
      completed: subtask.completed,
    }))

    const taskToAdd = {
      id: newTaskId,
      columnId: newTask.status,
      title: newTask.title,
      description: newTask.description,
      subtasks: newSubtasks,
    }

    setTasks([...tasks, taskToAdd])
  }

  const handleViewTask = (task: Task) => {
    setViewTask(task)
    setIsViewTaskModalOpen(true)
  }

  const handleUpdateTask = (taskId: string, updatedTask: Partial<Task>) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, ...updatedTask } : task)))
  }

  const handleUpdateSubtask = (taskId: string, subtaskId: string, completed: boolean) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map((subtask) =>
                subtask.id === subtaskId ? { ...subtask, completed } : subtask,
              ),
            }
          : task,
      ),
    )
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  const handleEditTask = (task: Task) => {
    setEditTask(task)
    setIsEditTaskModalOpen(true)
  }

  const isEmptyBoard = columns.length === 0

  return (
    <div className="flex-1 flex flex-col h-full w-full">
      <header className="flex items-center justify-between p-6 border-b border-light-2 dark:border-medium-1 bg-white dark:bg-dark-2 w-full">
        <h1 className="heading-xl text-dark-1 dark:text-white">{name}</h1>
        <div className="flex items-center gap-4">
          <Button variant="primary-l" className="flex items-center" onClick={() => setIsAddTaskModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add New Task
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-light-1 hover:text-dark-1 dark:hover:text-white">
                <MoreVertical className="h-5 w-5" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-medium-1 dark:bg-medium-1 text-white border-none rounded-lg shadow-lg py-4 px-4 min-w-[180px]"
            >
              <DropdownMenuItem className="hover:bg-medium-2 focus:bg-medium-2 body-l py-2 rounded cursor-pointer">
                Edit Board
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-medium-2 focus:bg-medium-2 body-l py-2 rounded cursor-pointer text-destructive">
                Delete Board
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-1 p-6 bg-off-white dark:bg-dark-1 w-full overflow-x-auto">
        {isEmptyBoard ? (
          <div className="h-full flex flex-col items-center justify-center w-full">
            <p className="body-l text-light-1 mb-6">This board is empty. Create a new column to get started.</p>
            <Button variant="primary-l" className="flex items-center">
              <Plus className="mr-2 h-4 w-4" /> Add New Column
            </Button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-6 h-full min-h-[calc(100vh-12rem)]">
              {columns.map((column) => (
                <BoardColumn
                  key={column.id}
                  id={column.id}
                  title={column.title}
                  color={column.color}
                  tasks={tasks.filter((task) => task.columnId === column.id)}
                  onTaskClick={handleViewTask}
                />
              ))}
              <div className="min-w-[280px] flex-1 mt-[38px]">
                <div className="flex items-center justify-center h-full bg-gradient-to-b from-[#E9EFFA] to-[#E9EFFA80] dark:from-[#828FA340] dark:to-[#828FA320] rounded-md cursor-pointer hover:text-primary transition-colors">
                  <span className="text-[24px] text-light-1 font-bold">+ New Column</span>
                </div>
              </div>
            </div>
            <DragOverlay>
              {activeTask && <TaskCard id={activeTask.id} title={activeTask.title} subtasks={activeTask.subtasks} />}
            </DragOverlay>
          </DndContext>
        )}
      </main>

      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onAddTask={handleAddTask}
        columns={columns}
      />

      <ViewTaskModal
        isOpen={isViewTaskModalOpen}
        onClose={() => setIsViewTaskModalOpen(false)}
        task={viewTask}
        columns={columns}
        onUpdateTask={handleUpdateTask}
        onUpdateSubtask={handleUpdateSubtask}
        onDeleteTask={handleDeleteTask}
        onEditTask={handleEditTask}
      />

      <EditTaskModal
        isOpen={isEditTaskModalOpen}
        onClose={() => setIsEditTaskModalOpen(false)}
        task={editTask}
        columns={columns}
        onUpdateTask={handleUpdateTask}
      />
    </div>
  )
}

