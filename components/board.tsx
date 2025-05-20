"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { MoreVertical, Plus } from "lucide-react";
import { useState } from "react";
import { AddTaskModal } from "./add-task-modal";
import { BoardColumn } from "./board-column";
import { EditTaskModal } from "./edit-task-modal";
import { TaskCard } from "./task-card";
import { ViewTaskModal } from "./view-task-modal";
import { AddColumnModal } from "./add-column-modal";
import { Task, Column } from "@/data/mock-data";
import { useAtom } from "jotai";
import {
  activeBoardAtom,
  activeBoardColumnsAtom,
  tasksAtom,
  boardsAtom,
  activeBoardIdAtom,
  addColumnAtom
} from "@/lib/atoms";

interface BoardProps {
  name: string;
  initialColumns?: Column[];
  initialTasks?: Task[];
}

export function Board({
  name,
  initialColumns = [],
  initialTasks = [],
}: BoardProps) {
  const [activeBoard] = useAtom(activeBoardAtom);
  const [columns, setColumns] = useAtom(activeBoardColumnsAtom);
  const [tasks, setTasks] = useAtom(tasksAtom);
  const [boards, setBoards] = useAtom(boardsAtom);
  const [activeBoardId] = useAtom(activeBoardIdAtom);
  const addColumn = useAtom(addColumnAtom)[1]; // Use the setter function

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [viewTask, setViewTask] = useState<Task | null>(null);
  const [isViewTaskModalOpen, setIsViewTaskModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeTaskId = active.id as string;
    const task = tasks.find((t) => t.id === activeTaskId);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the active task
    const activeTask = tasks.find((task) => task.id === activeId);
    if (!activeTask) return;

    // Check if over a column
    const isOverColumn = columns.some((column) => column.id === overId);
    if (isOverColumn) {
      // If dragging over a column, change the task's column
      setTasks((tasks) =>
        tasks.map((task) => {
          if (task.id === activeId) {
            return { ...task, columnId: overId };
          }
          return task;
        }),
      );
      return;
    }

    // Check if over another task
    const overTask = tasks.find((task) => task.id === overId);
    if (!overTask || activeTask.columnId !== overTask.columnId) return;

    // Reorder tasks within the same column
    setTasks((tasks) => {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      const overIndex = tasks.findIndex((t) => t.id === overId);

      // If in the same column, reorder
      if (tasks[activeIndex].columnId === tasks[overIndex].columnId) {
        return arrayMove(tasks, activeIndex, overIndex);
      }

      return tasks;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if over a column
    const isOverColumn = columns.some((column) => column.id === overId);
    if (isOverColumn) {
      // If dragging over a column, change the task's column
      setTasks((tasks) =>
        tasks.map((task) => {
          if (task.id === activeId) {
            return { ...task, columnId: overId };
          }
          return task;
        }),
      );
      return;
    }

    // Check if over another task
    const overTask = tasks.find((task) => task.id === overId);
    if (!overTask) return;

    // Reorder tasks within the same column
    setTasks((tasks) => {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      const overIndex = tasks.findIndex((t) => t.id === overId);

      // If in the same column, reorder
      if (tasks[activeIndex].columnId === tasks[overIndex].columnId) {
        return arrayMove(tasks, activeIndex, overIndex);
      }

      // If in different columns, move to the new column
      const updatedTasks = [...tasks];
      updatedTasks[activeIndex] = {
        ...updatedTasks[activeIndex],
        columnId: overTask.columnId,
      };

      return arrayMove(updatedTasks, activeIndex, overIndex);
    });
  };

  const handleAddTask = (newTask: {
    title: string;
    description: string;
    subtasks: { title: string; completed: boolean }[];
    status: string;
  }) => {
    const newTaskId = `task-${tasks.length + 1}`;
    const newSubtasks = newTask.subtasks.map((subtask, index) => ({
      id: `subtask-${tasks.length + 1}-${index + 1}`,
      title: subtask.title,
      completed: subtask.completed,
    }));

    const taskToAdd = {
      id: newTaskId,
      columnId: newTask.status,
      title: newTask.title,
      description: newTask.description,
      subtasks: newSubtasks,
    };

    setTasks([...tasks, taskToAdd]);
  };

  const handleViewTask = (task: Task) => {
    setViewTask(task);
    setIsViewTaskModalOpen(true);
  };

  const handleUpdateTask = (taskId: string, updatedTask: Partial<Task>) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, ...updatedTask } : task,
      ),
    );
  };

  const handleUpdateSubtask = (
    taskId: string,
    subtaskId: string,
    completed: boolean,
  ) => {
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
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleEditTask = (task: Task) => {
    setEditTask(task);
    setIsEditTaskModalOpen(true);
  };

  const handleAddColumn = (name: string) => {
    addColumn(name);
  };

  const getRandomColor = () => {
    const colors = [
      "bg-blue-400",
      "bg-purple-400",
      "bg-green-400",
      "bg-yellow-400",
      "bg-red-400",
      "bg-indigo-400",
      "bg-pink-400",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const isEmptyBoard = columns.length === 0;

  return (
    <div className="flex-1 flex flex-col h-full w-full">
      <header className="flex items-center justify-between p-6 border-b border-light-2 dark:border-medium-1 bg-white dark:bg-dark-2 w-full">
        <h1 className="heading-xl text-dark-1 dark:text-white">{name}</h1>
        <div className="flex items-center gap-4">
          <Button
            variant="primary-l"
            className="flex items-center"
            onClick={() => setIsAddTaskModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Task
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-light-1 hover:text-dark-1 dark:hover:text-white"
              >
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
            <p className="body-l text-light-1 mb-6">
              This board is empty. Create a new column to get started.
            </p>
            <Button
              variant="primary-l"
              className="flex items-center"
              onClick={() => setIsAddColumnModalOpen(true)}
            >
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
                <button
                  onClick={() => setIsAddColumnModalOpen(true)}
                  className="flex items-center justify-center h-full w-full bg-gradient-to-b from-[#E9EFFA] to-[#E9EFFA80] dark:from-[#828FA340] dark:to-[#828FA320] rounded-md cursor-pointer hover:text-primary transition-colors">
                  <span className="text-[24px] text-light-1 font-bold">
                    + New Column
                  </span>
                </button>
              </div>
            </div>
            <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
              {activeTask && (
                <TaskCard
                  id={activeTask.id}
                  title={activeTask.title}
                  subtasks={activeTask.subtasks}
                />
              )}
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

      <AddColumnModal
        isOpen={isAddColumnModalOpen}
        onClose={() => setIsAddColumnModalOpen(false)}
        onAddColumn={handleAddColumn}
      />
    </div>
  );
}
