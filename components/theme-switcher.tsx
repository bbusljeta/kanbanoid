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
      <div className="flex items-center justify-center gap-4 p-4 mx-6 my-4 bg-off-white dark:bg-dark-2 rounded-md">
        <div className="w-5 h-5"></div>
        <div className="w-11 h-6 bg-light-2 rounded-full"></div>
        <div className="w-5 h-5"></div>
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
    <div className="flex items-center justify-center gap-4 p-4 mx-6 my-4 bg-off-white dark:bg-dark-2 rounded-md">
      <Sun size={20} className="text-light-1" />
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={isChecked}
          onChange={toggleTheme}
        />
        <div className="w-11 h-6 bg-primary peer-focus:outline-none rounded-full peer dark:bg-primary peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
      </label>
      <Moon size={20} className="text-light-1" />
    </div>
  );
}
