// Applique le thème au chargement (localStorage > système)
export type Theme = 'light' | 'dark';

export function applyInitialTheme() {
  const stored = localStorage.getItem('theme') as Theme | null;
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  const theme: Theme = stored ?? (prefersDark ? 'dark' : 'light');
  setTheme(theme, false);
}

export function setTheme(theme: Theme, persist = true) {
  const root = document.documentElement; // <html>
  if (theme === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
  if (persist) localStorage.setItem('theme', theme);
}

export function getTheme(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}
