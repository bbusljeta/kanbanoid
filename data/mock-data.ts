export interface Task {
  id: string;
  columnId: string;
  title: string;
  description?: string;
  subtasks: {
    id: string;
    title: string;
    completed: boolean;
  }[];
}

export interface Column {
  id: string;
  title: string;
  color: string;
}

export const initialColumns: Column[] = [
  { id: "todo", title: "Todo", color: "bg-blue-400" },
  { id: "doing", title: "Doing", color: "bg-purple-400" },
  { id: "done", title: "Done", color: "bg-green-400" },
];

export const initialTasks: Task[] = [
  {
    id: "task-1",
    columnId: "todo",
    title: "Build UI for onboarding flow",
    subtasks: [
      {
        id: "subtask-1",
        title: "Design onboarding screens",
        completed: false,
      },
      {
        id: "subtask-2",
        title: "Implement UI components",
        completed: false,
      },
      { id: "subtask-3", title: "Add animations", completed: false },
    ],
  },
  {
    id: "task-2",
    columnId: "todo",
    title: "Build UI for search",
    subtasks: [
      {
        id: "subtask-4",
        title: "Design search input",
        completed: false,
      },
    ],
  },
  {
    id: "task-3",
    columnId: "todo",
    title: "Build settings UI",
    subtasks: [
      {
        id: "subtask-5",
        title: "Design settings page",
        completed: false,
      },
      {
        id: "subtask-6",
        title: "Implement settings functionality",
        completed: false,
      },
    ],
  },
  {
    id: "task-4",
    columnId: "todo",
    title: "QA and test all major user journeys",
    subtasks: [
      {
        id: "subtask-7",
        title: "Test onboarding flow",
        completed: false,
      },
      {
        id: "subtask-8",
        title: "Test search functionality",
        completed: false,
      },
    ],
  },
  {
    id: "task-5",
    columnId: "doing",
    title: "Design settings and search pages",
    subtasks: [
      { id: "subtask-9", title: "Create wireframes", completed: true },
      { id: "subtask-10", title: "Get feedback", completed: false },
      {
        id: "subtask-11",
        title: "Iterate on designs",
        completed: false,
      },
    ],
  },
  {
    id: "task-6",
    columnId: "doing",
    title: "Add account management endpoints",
    subtasks: [
      {
        id: "subtask-12",
        title: "Define API endpoints",
        completed: true,
      },
      {
        id: "subtask-13",
        title: "Implement authentication",
        completed: false,
      },
      {
        id: "subtask-14",
        title: "Implement authorization",
        completed: false,
      },
    ],
  },
  {
    id: "task-7",
    columnId: "doing",
    title: "Design onboarding flow",
    subtasks: [
      { id: "subtask-15", title: "Create wireframes", completed: true },
      { id: "subtask-16", title: "Get feedback", completed: false },
      {
        id: "subtask-17",
        title: "Iterate on designs",
        completed: false,
      },
    ],
  },
  {
    id: "task-8",
    columnId: "doing",
    title: "Add search endpoints",
    subtasks: [
      {
        id: "subtask-18",
        title: "Define API endpoints",
        completed: true,
      },
      {
        id: "subtask-19",
        title: "Implement search functionality",
        completed: false,
      },
    ],
  },
  {
    id: "task-9",
    columnId: "doing",
    title: "Add authentication endpoints",
    subtasks: [
      {
        id: "subtask-20",
        title: "Define API endpoints",
        completed: true,
      },
      {
        id: "subtask-21",
        title: "Implement authentication",
        completed: false,
      },
    ],
  },
  {
    id: "task-10",
    columnId: "doing",
    title:
      "Research pricing points of various competitors and trial different business models",
    description:
      "We know what we're planning to build for version one. Now we need to finalise the first pricing model we'll use. Keep iterating the subtasks until we have a coherent proposition.",
    subtasks: [
      {
        id: "subtask-22",
        title: "Research competitor pricing and business models",
        completed: true,
      },
      {
        id: "subtask-23",
        title: "Outline a business model that works for our solution",
        completed: true,
      },
      {
        id: "subtask-24",
        title:
          "Talk to potential customers about our proposed solution and ask for fair price expectancy",
        completed: false,
      },
    ],
  },
  {
    id: "task-11",
    columnId: "done",
    title: "Conduct 5 wireframe tests",
    subtasks: [
      {
        id: "subtask-25",
        title: "Prepare test scenarios",
        completed: true,
      },
    ],
  },
  {
    id: "task-12",
    columnId: "done",
    title: "Create wireframe prototype",
    subtasks: [
      { id: "subtask-26", title: "Create wireframes", completed: true },
    ],
  },
  {
    id: "task-13",
    columnId: "done",
    title: "Review results of usability tests and iterate",
    subtasks: [
      {
        id: "subtask-27",
        title: "Analyze test results",
        completed: true,
      },
      {
        id: "subtask-28",
        title: "Identify improvement areas",
        completed: true,
      },
      { id: "subtask-29", title: "Implement changes", completed: true },
    ],
  },
  {
    id: "task-14",
    columnId: "done",
    title:
      "Create paper prototypes and conduct 10 usability tests with potential customers",
    subtasks: [
      {
        id: "subtask-30",
        title: "Create paper prototypes",
        completed: true,
      },
      {
        id: "subtask-31",
        title: "Conduct usability tests",
        completed: true,
      },
    ],
  },
  {
    id: "task-15",
    columnId: "done",
    title: "Market discovery",
    subtasks: [
      {
        id: "subtask-32",
        title: "Research market trends",
        completed: true,
      },
    ],
  },
  {
    id: "task-16",
    columnId: "done",
    title: "Competitor analysis",
    subtasks: [
      {
        id: "subtask-33",
        title: "Identify competitors",
        completed: true,
      },
      {
        id: "subtask-34",
        title: "Analyze strengths and weaknesses",
        completed: true,
      },
    ],
  },
  {
    id: "task-17",
    columnId: "done",
    title: "Research the market",
    subtasks: [
      {
        id: "subtask-35",
        title: "Identify target audience",
        completed: true,
      },
      {
        id: "subtask-36",
        title: "Analyze market needs",
        completed: true,
      },
    ],
  },
];
