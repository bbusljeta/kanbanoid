import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { initialColumns, initialTasks, Column, Task } from '@/data/mock-data';

export interface Board {
  id: string;
  name: string;
  columns: Column[];
}

// Initial boards data
const initialBoards: Board[] = [
  {
    id: "platform-launch",
    name: "Platform Launch",
    columns: initialColumns
  },
  {
    id: "marketing-plan",
    name: "Marketing Plan",
    columns: []
  },
  {
    id: "roadmap",
    name: "Roadmap",
    columns: []
  },
];

// Create storage atoms with persistence
export const boardsAtom = atomWithStorage<Board[]>('kanbanoid-boards', initialBoards);
export const tasksAtom = atomWithStorage<Task[]>('kanbanoid-tasks', initialTasks);
export const activeBoardIdAtom = atomWithStorage<string>('kanbanoid-active-board', 'platform-launch');

// Derived atom for the active board
export const activeBoardAtom = atom(
  (get) => {
    const boards = get(boardsAtom);
    const activeBoardId = get(activeBoardIdAtom);
    return boards.find((board: Board) => board.id === activeBoardId) || boards[0];
  }
);

// Derived atom for the active board columns
export const activeBoardColumnsAtom = atom(
  (get) => {
    const activeBoard = get(activeBoardAtom);
    return activeBoard?.columns || [];
  },
  (get, set, newColumns: Column[]) => {
    const boards = get(boardsAtom);
    const activeBoardId = get(activeBoardIdAtom);

    // Update the columns for the active board
    const updatedBoards = boards.map((board: Board) =>
      board.id === activeBoardId
        ? { ...board, columns: newColumns }
        : board
    );

    // Update the boards atom
    set(boardsAtom, updatedBoards);
  }
);

// Atom for adding a new board
export const addBoardAtom = atom(
  null,
  (get, set, newBoard: { name: string, columns: Column[] }) => {
    const boards = get(boardsAtom);

    // Create a URL-friendly ID from the name
    const id = newBoard.name.toLowerCase().replace(/\s+/g, "-");

    // Add the new board
    const boardToAdd = {
      id,
      name: newBoard.name,
      columns: newBoard.columns
    };

    const updatedBoards = [...boards, boardToAdd];

    // Update the boards atom
    set(boardsAtom, updatedBoards);

    // Set as active board
    set(activeBoardIdAtom, id);

    return id;
  }
);

// Atom for adding a new column to the active board
export const addColumnAtom = atom(
  null,
  (get, set, columnName: string) => {
    const columns = get(activeBoardColumnsAtom);
    const columnId = columnName.toLowerCase().replace(/\s+/g, "-");

    // Generate a random color
    const colors = ["bg-blue-400", "bg-purple-400", "bg-green-400", "bg-red-400", "bg-yellow-400", "bg-pink-400"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newColumn = {
      id: columnId,
      title: columnName,
      color: randomColor
    };

    const updatedColumns = [...columns, newColumn];
    set(activeBoardColumnsAtom, updatedColumns);
  }
);

// Derived atom for tasks filtered by active board
export const activeBoardTasksAtom = atom(
  (get) => {
    const tasks = get(tasksAtom);
    const activeBoard = get(activeBoardAtom);
    const columnsIds = activeBoard.columns.map((column: Column) => column.id);

    return tasks.filter((task: Task) => columnsIds.includes(task.columnId));
  }
);
