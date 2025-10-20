"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useAtom } from "jotai";
import { activeBoardAtom, deleteBoardAtom } from "@/lib/atoms";

interface DeleteBoardModalProps {
  children: React.ReactNode;
}

export function DeleteBoardModal({ children }: DeleteBoardModalProps) {
  const [activeBoard] = useAtom(activeBoardAtom);
  const [, deleteBoard] = useAtom(deleteBoardAtom);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    if (activeBoard) {
      deleteBoard(activeBoard.id);
      setIsOpen(false);
    }
  };

  if (!activeBoard) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[480px] p-6 bg-white dark:bg-dark-2 border-none">
        <AlertDialogHeader>
          <AlertDialogTitle className="heading-l text-destructive">
            Delete this board?
          </AlertDialogTitle>
          <AlertDialogDescription className="body-l text-light-1 pt-6">
            Are you sure you want to delete the '{activeBoard.name}' board? This
            action will remove all columns and tasks and cannot be reversed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-2 flex-col sm:flex-row">
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="w-full sm:flex-1"
          >
            Delete
          </Button>
          <AlertDialogCancel asChild>
            <Button variant="secondary" className="w-full sm:flex-1 m-0">
              Cancel
            </Button>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
