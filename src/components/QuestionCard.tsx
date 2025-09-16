import { useEffect, useState } from "react";
import ChoiceButton from "../ChoiceButton";

type Status = "idle" | "correct" | "wrong";
type Props = {
  prompt: string;
  choices: [string, string, string, string];
  correctIndex: number;       // 0..3
  glossary?: Record<string, string>;
  exam?: boolean;
  onNext: (res: { ok: boolean; selected: number }) => void; // <- renvoie aussi l'index choisi
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

    if (exam) {
      setStates(["idle", "idle", "idle", "idle"]);
    } else {
      const ok = i === correctIndex;
      setStates(states.map((_, idx) => (idx === i ? (ok ? "correct" : "wrong") : "idle")));
    }
  }

  // Raccourcis 1–4 puis Entrée
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!locked) {
        const map: Record<string, number> = { "1": 0, "2": 1, "3": 2, "4": 3 };
        if (e.key in map) { e.preventDefault(); choose(map[e.key]); }
      } else if (e.key === "Enter") {
        e.preventDefault();
        onNext({ ok: (selected ?? -1) === correctIndex, selected: selected ?? -1 });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [locked, selected, correctIndex, onNext]);

  // Reset à chaque nouvelle question
  useEffect(() => {
    setSelected(null);
    setStates(["idle", "idle", "idle", "idle"]);
  }, [prompt]);

  const wrong = !exam && selected !== null && selected !== correctIndex;
  const chosen = selected ?? -1;

  const chosenEN = chosen >= 0 ? choices[chosen] : "";
  const chosenFR = glossary?.[chosenEN];
  const correctEN = choices[correctIndex];
  const correctFR = glossary?.[correctEN];

  return (
    <div className="rounded-2xl bg-white shadow p-6 space-y-4">
      <div className="text-sm text-slate-500">{exam ? "Examen" : "Question"}</div>
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
        <div role="status" aria-live="polite" className="rounded-xl border border-rose-300 bg-rose-50 text-rose-700 p-3">
          <div className="font-medium mb-1">Explication</div>
          <div className="text-sm">
            Vous avez choisi <strong>{chosenEN}</strong>
            {chosenFR ? <> — <em>« {chosenFR} »</em></> : null}.<br />
            La bonne réponse est <strong>{correctEN}</strong>
            {correctFR ? <> — <em>« {correctFR} »</em></> : null}.
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-slate-500">Astuce : 1–4 pour répondre, Entrée pour « Suivant »</p>
        <button
          disabled={selected === null}
          onClick={() => onNext({ ok: (selected ?? -1) === correctIndex, selected: selected ?? -1 })}
          className={
            "px-4 py-2 rounded-lg text-sm font-medium " +
            (selected !== null
              ? "group bg-indigo-600 text-white hover:bg-indigo-500"
              : "bg-slate-200 text-slate-500 cursor-not-allowed")
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
