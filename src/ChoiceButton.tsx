import { motion, type Variants } from "framer-motion";
import type { ComponentPropsWithoutRef } from "react";

type Status = "idle" | "correct" | "wrong";
type Props = ComponentPropsWithoutRef<typeof motion.button> & { status?: Status };

const shake = [0, -8, 8, -6, 6, -4, 4, -2, 2, 0];

const variants: Variants = {
  idle: { scale: 1, x: 0 },
  // v12 : on évite "type: 'spring'" (plus typé). Durées linéaires = safe.
  hover: { scale: 1.02, transition: { duration: 0.15 } },
  tap:   { scale: 0.98, transition: { duration: 0.10 } },
  correct: { scale: 1 },
  // v12 : 'ease' prend un bezier/fn, pas "easeInOut" en string.
  wrong: { x: shake, transition: { duration: 0.32, ease: [0.36, 0.66, 0.04, 1] } },
};

export default function ChoiceButton({ className = "", status = "idle", ...props }: Props) {
  const ring =
    status === "wrong"
      ? "ring-2 ring-rose-500"
      : status === "correct"
      ? "ring-2 ring-emerald-400"
      : "focus:ring-2 focus:ring-indigo-400";

  return (
    <motion.button
      type="button"
      variants={variants}
      initial="idle"
      animate={status}
      whileHover={status === "idle" ? "hover" : undefined}
      whileTap={status === "idle" ? "tap" : undefined}
      className={
        "w-full rounded-2xl bg-white dark:bg-slate-800 shadow p-4 text-left hover:shadow-md " +
        "text-slate-900 dark:text-slate-100 " +
        ring + " " + className
      }
      {...props}
    />
  );
}
