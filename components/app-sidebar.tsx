"use client";

import { useState } from "react";
import { Eye, EyeOff, LayoutGrid, Plus } from "lucide-react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { ThemeSwitcher } from "./theme-switcher";
import { CreateBoardModal } from "./create-board-modal";

interface Board {
  id: string;
  name: string;
}

interface AppSidebarProps {
  boards: Board[];
  activeBoard: string;
  onCreateBoard: (name: string, columns: any[]) => void;
  onBoardSelect?: (boardId: string) => void;
}

export function AppSidebar({
  boards,
  activeBoard,
  onCreateBoard,
  onBoardSelect,
}: AppSidebarProps) {
  const { open, toggleSidebar, isMobile } = useSidebar();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <>
      <Sidebar variant="sidebar">
        {/* <SidebarHeader></SidebarHeader> */}

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-sidebar-foreground/70 tracking-wider uppercase">
              ALL BOARDS ({boards.length})
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {boards.map((board) => (
                  <SidebarMenuItem key={board.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={activeBoard === board.id}
                      className="w-full data-[active=true]:bg-primary data-[active=true]:text-white"
                    >
                      <Link
                        href={`#${board.id}`}
                        onClick={() =>
                          activeBoard !== board.id && onBoardSelect?.(board.id)
                        }
                        className="flex items-center gap-3"
                      >
                        <LayoutGrid size={18} />
                        <span className="font-medium">{board.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}

                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setIsCreateModalOpen(true)}
                    className="w-full text-primary hover:text-primary/80"
                  >
                    <Plus size={18} />
                    <span className="font-medium">Create New Board</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <div className="p-2 flex-col gap-4">
            <ThemeSwitcher />
            <button
              onClick={toggleSidebar}
              className="flex items-center gap-2 text-light-1 hover:text-primary px-6 py-4 w-full body-l"
            >
              {open ? <EyeOff size={18} /> : <Eye size={18} />}
              <span>{open ? "Hide Sidebar" : "Show Sidebar"}</span>
            </button>
          </div>
        </SidebarFooter>
        {/*  <SidebarRail /> */}
      </Sidebar>

      <CreateBoardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateBoard={onCreateBoard}
      />
    </>
  );
}
