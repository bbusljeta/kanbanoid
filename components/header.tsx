"use client";

import { useState } from "react";
import { Plus, MoreVertical, ChevronDown } from "lucide-react";
import { useAtom } from "jotai";
import { boardsAtom, activeBoardIdAtom, activeBoardAtom } from "@/lib/atoms";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { EditBoardModal } from "@/components/edit-board-modal";
import { DeleteBoardModal } from "@/components/delete-board-modal";

interface HeaderProps {
  onAddTask: () => void;
}

export function Header({ onAddTask }: HeaderProps) {
  const [boards] = useAtom(boardsAtom);
  const [activeBoardId, setActiveBoardId] = useAtom(activeBoardIdAtom);
  const [activeBoard] = useAtom(activeBoardAtom);
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <header className="flex items-center justify-between px-4 py-3 border-b border-light-2 dark:border-medium-1 bg-white dark:bg-medium-1 w-full z-20 shrink-0">
        {/* Left side - Logo with board dropdown */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 hover:bg-light-3 dark:hover:bg-medium-2 p-2 rounded-md transition-colors">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-0.5">
                    <div className="h-5 w-1 bg-primary/80 rounded-sm"></div>
                    <div className="h-5 w-1 bg-primary rounded-sm"></div>
                    <div className="h-5 w-1 bg-primary/80 rounded-sm"></div>
                  </div>
                  <span className="text-lg font-bold text-sidebar-foreground">
                    kanban
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-light-1" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="bg-sidebar dark:bg-sidebar text-sidebar-foreground border-sidebar-border rounded-lg shadow-lg py-2 min-w-[200px] w-[calc(100vw-32px)]"
            >
              <DropdownMenuLabel className="px-4 py-2 body-m text-light-1 font-bold text-[12px] tracking-[2.4px] uppercase">
                All Boards ({boards.length})
              </DropdownMenuLabel>

              <DropdownMenuGroup>
                {boards.map(board => (
                  <DropdownMenuItem
                    key={board.id}
                    onClick={() => setActiveBoardId(board.id)}
                    className={`hover:bg-sidebar-accent focus:bg-sidebar-accent body-l py-2 px-4 rounded cursor-pointer ${
                      board.id === activeBoardId
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : ""
                    }`}
                  >
                    {board.name}
                  </DropdownMenuItem>
                ))}
                <div className="px-2 py-1">
                  <ThemeSwitcher />
                </div>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right side - Action buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="primary-l"
            size="icon"
            onClick={onAddTask}
            disabled={!activeBoard}
            className="h-8 w-8"
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add New Task</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-light-1 hover:text-dark-1 dark:hover:text-white h-8 w-8"
                disabled={!activeBoard}
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-medium-1 dark:bg-medium-1 text-white border-none rounded-lg shadow-lg py-4 px-4 min-w-[180px]"
            >
              <EditBoardModal>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="hover:bg-medium-2 focus:bg-medium-2 body-l py-2 rounded cursor-pointer"
                >
                  Edit Board
                </DropdownMenuItem>
              </EditBoardModal>
              <DeleteBoardModal>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="hover:bg-medium-2 focus:bg-medium-2 body-l py-2 rounded cursor-pointer text-destructive"
                >
                  Delete Board
                </DropdownMenuItem>
              </DeleteBoardModal>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    );
  }

  // Desktop layout
  return (
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
          onClick={onAddTask}
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
            <EditBoardModal>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="hover:bg-medium-2 focus:bg-medium-2 body-l py-2 rounded cursor-pointer"
              >
                Edit Board
              </DropdownMenuItem>
            </EditBoardModal>
            <DeleteBoardModal>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="hover:bg-medium-2 focus:bg-medium-2 body-l py-2 rounded cursor-pointer text-destructive"
              >
                Delete Board
              </DropdownMenuItem>
            </DeleteBoardModal>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
