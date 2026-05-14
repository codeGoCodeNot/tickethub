"use client";

import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Switch
      id="theme-switcher"
      checked={theme === "dark"}
      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
    />
  );
};

export default ThemeSwitcher;
