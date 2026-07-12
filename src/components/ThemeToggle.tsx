import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider.js";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="flex items-center justify-center p-2 rounded-full transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none"
      title="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
      ) : (
        <Sun className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
      )}
    </button>
  );
}
