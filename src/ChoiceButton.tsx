import { motion, type Variants } from "framer-motion";
import type { ComponentPropsWithoutRef } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

type Status = "idle" | "correct" | "wrong";
type Props = ComponentPropsWithoutRef<typeof motion.button> & { status?: Status };

const shake = [0, -8, 8, -6, 6, -4, 4, -2, 2, 0];

const variants: Variants = {
  idle: { scale: 1, x: 0 },
  hover: { scale: 1.02, transition: { duration: 0.15 } },
  tap:   { scale: 0.98, transition: { duration: 0.10 } },
  correct: { scale: 1 },
  wrong: { x: shake, transition: { duration: 0.32, ease: [0.36, 0.66, 0.04, 1] } },
};

export default function ChoiceButton({ className = "", status = "idle", children, ...props }: Props) {
  const ring =
    status === "wrong"
      ? "ring-2 ring-rose-400/70"
      : status === "correct"
      ? "ring-2 ring-emerald-400/70"
      : "focus:ring-2 focus:ring-indigo-400/70";

  return (
    <motion.button
      type="button"
      variants={variants}
      initial="idle"
      animate={status}
      whileHover={status === "idle" ? "hover" : undefined}
      whileTap={status === "idle" ? "tap" : undefined}
      className={
        "w-full min-h-12 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur " +
        "ring-1 ring-slate-200/70 dark:ring-white/10 " +
        "shadow-sm p-4 text-left hover:shadow " +
        "text-slate-900 dark:text-slate-100 flex items-center justify-between " +
        ring + " " + className
      }
      {...props}
    >
      <span className="pr-3">{children}</span>
      {status === "correct" && <CheckCircle2 className="text-emerald-500" size={20} aria-hidden />}
      {status === "wrong" && <XCircle className="text-rose-500" size={20} aria-hidden />}
    </motion.button>
  );
}
