export default function Footer() {
    const year = new Date().getFullYear();
    return (
      <footer
        className="
          fixed bottom-0 inset-x-0 z-50
          border-t border-slate-200 dark:border-slate-700
          bg-white/80 dark:bg-slate-900/80 backdrop-blur
          text-center text-xs text-slate-500 dark:text-slate-400
          py-2
        "
      >
        © {year} <strong className="font-medium text-slate-700 dark:text-slate-200">Norman Niati</strong> — Tous droits réservés
      </footer>
    );
  }
  