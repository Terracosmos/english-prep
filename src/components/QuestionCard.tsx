import { useEffect, useState } from "react";
import ChoiceButton from "../ChoiceButton";

type Status = "idle" | "correct" | "wrong";
type Props = {
  prompt: string;
  choices: [string, string, string, string];
  correctIndex: number;
  glossary?: Record<string, string>;
  exam?: boolean;
  onNext: (ok: boolean, selectedIndex: number) => void; // mode révision déjà en place
};

export default function QuestionCard({
  prompt,
  choices,
  correctIndex,
  glossary = {},
  exam = false,
  onNext,
}: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [states, setStates] = useState<Status[]>(["idle", "idle", "idle", "idle"]);
  const locked = selected !== null;

  function choose(i: number) {
    if (locked) return;
    setSelected(i);
    if (exam) setStates(["idle", "idle", "idle", "idle"]);
    else setStates(states.map((_, idx) => (idx === i ? (i === correctIndex ? "correct" : "wrong") : "idle")));
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!locked) {
        const map: Record<string, number> = { "1": 0, "2": 1, "3": 2, "4": 3 };
        if (e.key in map) { e.preventDefault(); choose(map[e.key]); }
      } else if (e.key === "Enter") {
        e.preventDefault();
        onNext(selected! === correctIndex, selected!);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [locked, selected, correctIndex, onNext]);

  useEffect(() => {
    setSelected(null);
    setStates(["idle", "idle", "idle", "idle"]);
  }, [prompt]);

  const wrong = !exam && locked && selected !== null && selected !== correctIndex;
  const chosen = selected ?? -1;

  const chosenEN = chosen >= 0 ? choices[chosen] : "";
  const chosenFR = glossary?.[chosenEN];
  const correctEN = choices[correctIndex];
  const correctFR = glossary?.[correctEN];

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800 shadow p-6 space-y-4 text-slate-900 dark:text-slate-100">
      <div className="text-sm text-slate-500 dark:text-slate-400">{exam ? "Examen" : "Question"}</div>
      <div className="text-2xl font-semibold whitespace-pre-line">{prompt}</div>

      <div className="grid gap-3">
        {choices.map((c, i) => (
          <ChoiceButton
            key={i}
            status={states[i]}
            onClick={() => choose(i)}
            className={locked && i !== selected ? "opacity-80" : ""}
            aria-pressed={selected === i}
          >
            <span className="font-medium mr-2">{i + 1}.</span>{c}
          </ChoiceButton>
        ))}
      </div>

      {!exam && wrong && (
        <div role="status" aria-live="polite"
             className="rounded-xl border border-rose-300 dark:border-rose-400/40
                        bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 p-3">
          <div className="font-medium mb-1">Explication</div>
          <div className="text-sm">
            Vous avez choisi <strong>{chosenEN}</strong>
            {chosenFR ? <> — en français : <em>« {chosenFR} »</em></> : null}.
            <br />
            La bonne réponse est <strong>{correctEN}</strong>
            {correctFR ? <> — <em>« {correctFR} »</em></> : null}.
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-slate-500 dark:text-slate-400">Astuce : 1–4 pour répondre, Entrée pour « Suivant »</p>
        <button
          disabled={!locked}
          onClick={() => onNext((selected ?? -1) === correctIndex, selected!)}
          className={
            "px-4 py-2 rounded-lg text-sm font-medium " +
            (locked
              ? "group bg-indigo-600 text-white hover:bg-indigo-500"
              : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300 cursor-not-allowed")
          }
        >
          <span className="inline-flex items-center gap-2">
            Suivant <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
          </span>
        </button>
      </div>
    </div>
  );
}
