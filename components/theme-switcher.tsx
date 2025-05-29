"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme(); // Use resolvedTheme
  const [mounted, setMounted] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  // Set mounted to true once the component is mounted on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update isChecked based on the resolvedTheme once mounted
  useEffect(() => {
    if (mounted && resolvedTheme) {
      setIsChecked(resolvedTheme === "dark");
    }
  }, [mounted, resolvedTheme]);

  // Avoid hydration mismatch by returning a skeleton or null until mounted
  if (!mounted) {
    return (
      <div className="flex items-center justify-center gap-4 p-2 mx-2 my-2 bg-sidebar-accent/50 rounded-md">
        <div className="w-4 h-4"></div>
        <div className="w-9 h-5 bg-sidebar-border rounded-full"></div>
        <div className="w-4 h-4"></div>
      </div>
    );
  }

  const toggleTheme = () => {
    // Use resolvedTheme to determine the current actual theme for toggling
    const newTheme = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    // isChecked will be updated by the useEffect listening to resolvedTheme
  };

  return (
    <div className="flex items-center justify-center gap-4 p-2 mx-2 my-2 bg-sidebar-accent/50 rounded-md">
      <Sun size={16} className="text-sidebar-foreground/70" />
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={isChecked}
          onChange={toggleTheme}
        />
        <div className="w-9 h-5 bg-sidebar-border peer-focus:outline-none rounded-full peer dark:bg-sidebar-border peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
      </label>
      <Moon size={16} className="text-sidebar-foreground/70" />
    </div>
  );
}
