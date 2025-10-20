"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAtom } from "jotai";
import { activeBoardAtom, updateBoardAtom } from "@/lib/atoms";

interface Column {
  id: string;
  name: string;
}

interface EditBoardModalProps {
  children: React.ReactNode;
}

export function EditBoardModal({ children }: EditBoardModalProps) {
  const [activeBoard] = useAtom(activeBoardAtom);
  const [, updateBoard] = useAtom(updateBoardAtom);
  const [isOpen, setIsOpen] = useState(false);
  const [boardName, setBoardName] = useState("");
  const [columns, setColumns] = useState<Column[]>([]);

  // Reset form when modal opens with current board data
  useEffect(() => {
    if (isOpen && activeBoard) {
      setBoardName(activeBoard.name);
      setColumns(
        activeBoard.columns.map((col, index) => ({
          id: (index + 1).toString(),
          name: col.title,
        }))
      );
    }
  }, [isOpen, activeBoard]);

  const handleAddColumn = () => {
    const newId = (columns.length + 1).toString();
    setColumns([...columns, { id: newId, name: "" }]);
  };

  const handleRemoveColumn = (id: string) => {
    setColumns(columns.filter((column) => column.id !== id));
  };

  const handleColumnNameChange = (id: string, name: string) => {
    setColumns(
      columns.map((column) => (column.id === id ? { ...column, name } : column))
    );
  };

  const handleSubmit = () => {
    if (boardName.trim() === "" || !activeBoard) return;

    // Filter out empty columns
    const validColumns = columns.filter((column) => column.name.trim() !== "");

    // Generate a random color for new columns
    const colors = [
      "bg-blue-400",
      "bg-purple-400",
      "bg-green-400",
      "bg-red-400",
      "bg-yellow-400",
      "bg-pink-400",
    ];

    const updatedColumns = validColumns.map((col, index) => {
      // Try to find existing column by title
      const existingColumn = activeBoard.columns.find(
        (c) => c.title === col.name
      );

      return {
        id: col.name.toLowerCase().replace(/\s+/g, "-"),
        title: col.name,
        color:
          existingColumn?.color ||
          colors[index % colors.length],
      };
    });

    updateBoard({ name: boardName, columns: updatedColumns });
    setIsOpen(false);
  };

  if (!activeBoard) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px] p-6 bg-white dark:bg-dark-2 border-none">
        <DialogHeader className="p-0">
          <DialogTitle className="heading-l text-dark-1 dark:text-white">
            Edit Board
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="board-name"
              className="body-m text-medium-2 dark:text-light-1"
            >
              Board Name
            </label>
            <Input
              id="board-name"
              placeholder="e.g. Web Design"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <label className="body-m text-medium-2 dark:text-light-1">
              Board Columns
            </label>
            {columns.map((column) => (
              <div key={column.id} className="flex items-center gap-2">
                <Input
                  value={column.name}
                  onChange={(e) =>
                    handleColumnNameChange(column.id, e.target.value)
                  }
                  className="flex-1"
                  placeholder="e.g. Todo"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveColumn(column.id)}
                  className="text-light-1 hover:text-destructive transition-colors"
                >
                  <X size={24} />
                  <span className="sr-only">Remove column</span>
                </button>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddColumn}
              className="w-full"
            >
              + Add New Column
            </Button>
          </div>

          <Button onClick={handleSubmit} className="w-full" variant="primary-s">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
