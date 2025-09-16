import { motion } from "framer-motion";
import type { ComponentPropsWithoutRef } from "react";

type Status = "idle" | "correct" | "wrong";
type Props = ComponentPropsWithoutRef<typeof motion.button> & { status?: Status };

const shake = [0, -8, 8, -6, 6, -4, 4, -2, 2, 0];

const variants = {
  idle: { scale: 1, x: 0 },
  hover: { scale: 1.02, transition: { type: "spring", stiffness: 500, damping: 30 } },
  tap: { scale: 0.98, transition: { type: "spring", stiffness: 500, damping: 30 } },
  correct: { scale: 1 },
  wrong: { x: shake, transition: { duration: 0.32, ease: "easeInOut" } },
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
