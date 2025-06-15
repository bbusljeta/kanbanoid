import { Plus, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import clsx from "clsx";
import { useAtomValue } from "jotai";
import { sidebarOpenAtom } from "@/lib/atoms";

type Props = {
  activeBoard?: { name: string };
  setIsAddTaskModalOpen: (open: boolean) => void;
};
export function Header({ activeBoard, setIsAddTaskModalOpen }: Props) {
  const open = useAtomValue(sidebarOpenAtom);

  return (
    <header className="flex items-center bg-white dark:bg-medium-1 w-full z-20 shrink-0">
      <div
        className={clsx(
          "w-full h-full max-w-[256px] border-r border-light-2 dark:border-medium-2",
          !open && "border-b border-light-2 dark:border-medium-2"
        )}
      >
        <div className="flex items-center gap-2 w-full px-4 py-4">
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

      <div className="flex justify-between items-center w-full px-6 py-4 border-b border-light-2 dark:border-medium-2">
        <h1 className="heading-xl text-dark-1 dark:text-white">
          {activeBoard?.name || "Select a Board"}
        </h1>

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
      </div>
    </header>
  );
}
