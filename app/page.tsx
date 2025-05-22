"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Board } from "@/components/board";
import { Eye } from "lucide-react";
import { CreateBoardModal } from "@/components/create-board-modal";
import { useAtom, useSetAtom } from "jotai";
import {
  boardsAtom,
  activeBoardIdAtom,
  activeBoardAtom,
  addBoardAtom,
} from "@/lib/atoms";

export default function Home() {
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const [boards] = useAtom(boardsAtom);
  const [activeBoardId, setActiveBoardId] = useAtom(activeBoardIdAtom);
  const [activeBoard] = useAtom(activeBoardAtom);
  const addBoard = useSetAtom(addBoardAtom);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarHidden(!isSidebarHidden);
  };

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

  return (
    <div className="flex h-full relative overflow-hidden w-full">
      <Sidebar
        boards={boards}
        activeBoard={activeBoardId}
        onToggleSidebar={toggleSidebar}
        isSidebarHidden={isSidebarHidden}
        onCreateBoard={handleCreateBoard}
        onBoardSelect={setActiveBoardId}
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out w-full ${
          isSidebarHidden ? "ml-0" : "ml-64"
        }`}
      >
        {isSidebarHidden && (
          <button
            onClick={toggleSidebar}
            className="fixed bottom-8 left-0 flex items-center justify-center w-14 h-12 bg-primary hover:bg-primary-light rounded-r-full text-white transition-colors z-10"
            aria-label="Show Sidebar"
          >
            <Eye size={20} />
          </button>
        )}
        {activeBoard && <Board name={activeBoard.name} />}
      </div>

      <CreateBoardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateBoard={handleCreateBoard}
      />
    </div>
  );
}
