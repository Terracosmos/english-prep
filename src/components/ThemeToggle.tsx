import { useEffect, useState } from "react";
import { getTheme, setTheme, type Theme } from "../theme";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [t, setT] = useState<Theme>("light");
  useEffect(() => setT(getTheme()), []);

  function toggle() {
    const next: Theme = t === "dark" ? "light" : "dark";
    setTheme(next);
    setT(next);
  }

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center gap-1.5 text-sm px-2.5 py-1.5 rounded-xl
                 bg-white/70 dark:bg-slate-800/70 backdrop-blur
                 ring-1 ring-slate-200/70 dark:ring-white/10
                 text-slate-700 dark:text-slate-100 hover:shadow-sm"
      aria-label={t === "dark" ? "Passer en clair" : "Passer en sombre"}
    >
      {t === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      <span className="hidden sm:inline">{t === "dark" ? "Clair" : "Sombre"}</span>
    </button>
  );
}
