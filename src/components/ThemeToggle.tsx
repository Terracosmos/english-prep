import { useEffect, useState } from 'react';
import { getTheme, setTheme, type Theme } from '../theme';

export default function ThemeToggle() {
  const [t, setT] = useState<Theme>('light');
  useEffect(() => setT(getTheme()), []);
  function toggle() {
    const next: Theme = t === 'dark' ? 'light' : 'dark';
    setTheme(next);
    setT(next);
  }
  return (
    <button
      onClick={toggle}
      className="inline-flex items-center gap-1.5 text-sm px-2 py-1 rounded-lg
                 bg-slate-200 hover:bg-slate-300 text-slate-800
                 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-100"
      title={t === 'dark' ? 'Passer en clair' : 'Passer en sombre'}
      aria-label="Basculer le thème"
    >
      <span aria-hidden>{t === 'dark' ? '☀️' : '🌙'}</span>
      <span className="hidden sm:inline">{t === 'dark' ? 'Clair' : 'Sombre'}</span>
    </button>
  );
}
