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
  sidebarOpenAtom,
} from "@/lib/atoms";
import {
  SidebarProvider,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar";
import { Eye } from "lucide-react";
import { Header } from "@/components/header";

function CustomSidebarTrigger() {
  const { open, toggleSidebar, isMobile, state } = useSidebar();
  const [_, setIsOpen] = useAtom(sidebarOpenAtom);

  // Don't show the trigger when sidebar is open
  if (open && !isMobile) {
    return null;
  }

  return (
    <button
      onClick={() => {
        toggleSidebar();
        setIsOpen(true);
      }}
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
      columns: columns.map((col) => ({
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
      <Header
        activeBoard={activeBoard}
        setIsAddTaskModalOpen={setIsAddTaskModalOpen}
      />

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
