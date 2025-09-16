export default function ProgressBar({ value }: { value: number }) {
    const v = Math.max(0, Math.min(1, value));
    return (
      <div className="fixed top-0 left-0 right-0 z-50 h-1.5 bg-slate-200/60 dark:bg-slate-800/60">
        <div
          className="h-full rounded-r bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-indigo-500"
          style={{ width: `${v * 100}%`, transition: "width 300ms ease" }}
        />
      </div>
    );
  }
  