import { motion } from "framer-motion";

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute -top-24 -left-24 h-[28rem] w-[28rem] rounded-full bg-indigo-400/15 blur-3xl"
        animate={{ x: [0, 14, 0], y: [0, -10, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-24 -right-24 h-[28rem] w-[28rem] rounded-full bg-fuchsia-400/15 blur-3xl"
        animate={{ x: [0, -12, 0], y: [0, 8, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
      />
    </div>
  );
}
