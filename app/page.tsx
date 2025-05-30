"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Board } from "@/components/board";
import { CreateBoardModal } from "@/components/create-board-modal";
import { AddTaskModal } from "@/components/add-task-modal";
import { useAtom, useSetAtom } from "jotai";
import {
  boardsAtom,
  activeBoardIdAtom,
  activeBoardAtom,
  addBoardAtom,
  activeBoardColumnsAtom,
  tasksAtom,
} from "@/lib/atoms";
import {
  SidebarProvider,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar";
import { Eye, Plus, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function CustomSidebarTrigger() {
  const { open, toggleSidebar, isMobile } = useSidebar();

  // Don't show the trigger when sidebar is open
  if (open && !isMobile) {
    return null;
  }

  return (
    <button
      onClick={toggleSidebar}
      className="fixed bottom-8 left-0 flex items-center justify-center w-14 h-12 bg-primary hover:bg-primary/90 rounded-r-full text-white transition-colors z-10 shadow-lg"
      aria-label="Show Sidebar"
    >
      <Eye size={18} />
    </button>
  );
}

export default function Home() {
  const [boards] = useAtom(boardsAtom);
  const [activeBoardId, setActiveBoardId] = useAtom(activeBoardIdAtom);
  const [activeBoard] = useAtom(activeBoardAtom);
  const [columns] = useAtom(activeBoardColumnsAtom);
  const [tasks, setTasks] = useAtom(tasksAtom);
  const addBoard = useSetAtom(addBoardAtom);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  const handleCreateBoard = (name: string, columns: any[]) => {
    // Add the new board with columns
    const newBoard = {
      name,
      columns: columns.map(col => ({
        id: col.name.toLowerCase().replace(/\s+/g, "-"),
        title: col.name,
        color: "bg-blue-400", // Default color, could be randomized
      })),
    };

    addBoard(newBoard);
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
    setIsAddTaskModalOpen(false);
  };

  return (
    <div className="flex h-screen w-full flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-light-2 dark:border-medium-1 bg-white dark:bg-medium-1 w-full z-20 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-[240px] flex items-center">
            <div className="flex items-center gap-2 px-4">
              <div className="flex space-x-0.5">
                <div className="h-6 w-1.5 bg-primary/80 rounded-sm"></div>
                <div className="h-6 w-1.5 bg-primary rounded-sm"></div>
                <div className="h-6 w-1.5 bg-primary/80 rounded-sm"></div>
              </div>
              <span className="text-xl font-bold text-sidebar-foreground">
                kanban
              </span>
            </div>
          </div>
          <h1 className="heading-xl text-dark-1 dark:text-white">
            {activeBoard?.name || "Select a Board"}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="primary-l"
            className="flex items-center"
            onClick={() => setIsAddTaskModalOpen(true)}
            disabled={!activeBoard}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Task
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-light-1 hover:text-dark-1 dark:hover:text-white"
                disabled={!activeBoard}
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

      {/* Main Layout with Sidebar and Content */}
      <div className="flex flex-1 overflow-hidden">
        <div className="relative flex w-full h-full">
          <SidebarProvider defaultOpen={true}>
            <AppSidebar
              boards={boards}
              activeBoard={activeBoardId}
              onCreateBoard={handleCreateBoard}
              onBoardSelect={setActiveBoardId}
            />
            <SidebarInset className="flex-1 overflow-hidden">
              <div className="flex flex-1 flex-col h-full">
                {activeBoard && <Board name={activeBoard.name} />}
              </div>
              <CustomSidebarTrigger />
            </SidebarInset>
          </SidebarProvider>
        </div>
      </div>

      <CreateBoardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateBoard={handleCreateBoard}
      />

      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onAddTask={handleAddTask}
        columns={columns}
      />
    </div>
  );
}
