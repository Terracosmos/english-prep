import { useEffect, useMemo, useState } from "react";
import QuestionCard from "./components/QuestionCard";
import { vocab, glossary, type VocabItem } from "./data/vocab";
import { expressions, exprGlossary, type ExpressionItem } from "./data/expressions";
import { definitions, type DefinitionItem } from "./data/definitions";

type ContentMode = "mots" | "expressions" | "definitions";
type SessionMode = "entrainement" | "examen";
type Screen = "home" | "quiz" | "result" | "review";
type Q = { prompt: string; choices: [string, string, string, string]; correctIndex: number };
type Answer = { q: Q; selectedIndex: number };

const COUNTS = [15, 30, 50] as const;
const SECONDS_PER_QUESTION = 20;

// ---------- util ----------
function randInt(n: number) { return Math.floor(Math.random() * n); }
function shuffle<T>(arr: T[]): T[] { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = randInt(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function pickN<T>(arr: T[], n: number): T[] { const pool = [...arr]; const out: T[] = []; while (out.length < n && pool.length) out.push(pool.splice(randInt(pool.length), 1)[0]); return out; }
const primaryEN = (it: VocabItem) => it.en[0];

function makeQuestionFromVocab(item: VocabItem, pool: VocabItem[]): Q {
  const correct = primaryEN(item);
  const others = pool.filter((x) => x !== item).map(primaryEN).filter((x) => x !== correct);
  const mixed = shuffle([correct, ...pickN(others, 3)]);
  return { prompt: `« ${item.fr} » → anglais`, choices: mixed as [string, string, string, string], correctIndex: mixed.indexOf(correct) };
}
function makeQuestionFromExpr(item: ExpressionItem, pool: ExpressionItem[]): Q {
  const correct = item.en;
  const others = pool.filter((x) => x !== item).map((x) => x.en).filter((x) => x !== correct);
  const mixed = shuffle([correct, ...pickN(others, 3)]);
  return { prompt: `« ${item.fr} » → anglais`, choices: mixed as [string, string, string, string], correctIndex: mixed.indexOf(correct) };
}
function makeQuestionFromDef(item: DefinitionItem, pool: DefinitionItem[]): Q {
  const correct = item.term;
  const others = pool.filter((x) => x !== item).map((x) => x.term).filter((x) => x !== correct);
  const mixed = shuffle([correct, ...pickN(others, 3)]);
  return { prompt: `Definition → choose the correct term:\n“${item.def}”`, choices: mixed as [string, string, string, string], correctIndex: mixed.indexOf(correct) };
}
function gradeFromPct(p: number): "A" | "B" | "C" | "D" { if (p >= 0.8) return "A"; if (p >= 0.6) return "B"; if (p >= 0.4) return "C"; return "D"; }
function corpusSize(content: ContentMode) { if (content === "mots") return vocab.length; if (content === "expressions") return expressions.length; return definitions.length; }
function createSession(content: ContentMode, size: number): Q[] {
  const max = corpusSize(content); const target = Math.min(size, max);
  if (content === "mots") return pickN(vocab, target).map((it) => makeQuestionFromVocab(it, vocab));
  if (content === "expressions") return pickN(expressions, target).map((it) => makeQuestionFromExpr(it, expressions));
  return pickN(definitions, target).map((it) => makeQuestionFromDef(it, definitions));
}

// ---------- App ----------
export default function App() {
  const [content, setContent] = useState<ContentMode>("mots");
  const [mode, setMode] = useState<SessionMode>("entrainement");
  const [count, setCount] = useState<number>(15);
  const [screen, setScreen] = useState<Screen>("home");

  const [session, setSession] = useState<Q[]>([]);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]); // <-- historique

  const max = corpusSize(content);

  // Timer (examen)
  const totalSecondsQuiz = useMemo(() => {
    if (screen !== "quiz" || mode !== "examen") return 0;
    return session.length * SECONDS_PER_QUESTION;
  }, [screen, mode, session.length]);
  const [timeLeft, setTimeLeft] = useState<number>(totalSecondsQuiz);

  useEffect(() => { setTimeLeft(totalSecondsQuiz); }, [totalSecondsQuiz]);
  useEffect(() => {
    if (screen !== "quiz" || mode !== "examen") return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(id); setScreen("result"); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [screen, mode]);

  function start() {
    const size = Math.min(count, max);
    if (max < 4) return;
    setSession(createSession(content, size));
    setI(0); setScore(0); setAnswers([]);
    setScreen("quiz");
  }
  function startFromQuestions(qs: Q[]) {
    if (qs.length < 1) return;
    setSession(qs);
    setI(0); setScore(0); setAnswers([]);
    setMode("entrainement"); // refaire en mode entraînement
    setScreen("quiz");
  }

  function next(ok: boolean, selectedIndex: number) {
    const q = session[i];
    setAnswers((arr) => [...arr, { q, selectedIndex }]);
    setScore((s) => s + (ok ? 1 : 0));
    if (i + 1 >= session.length) setScreen("result");
    else setI((j) => j + 1);
  }

  // ---------- HOME ----------
  if (screen === "home") {
    const estimated = mode === "examen" ? Math.min(count, max) * SECONDS_PER_QUESTION : 0;
    const mm = String(Math.floor(estimated / 60)).padStart(2, "0");
    const ss = String(estimated % 60).padStart(2, "0");
    const notEnough = max < 4;

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl space-y-6">
          <header className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold text-indigo-600">English Prep</h1>
            <span className="text-sm text-slate-500">Corpus {content} : {max}</span>
          </header>

          <div className="bg-white rounded-2xl shadow p-6 space-y-6">
            <p className="text-slate-600">Choisis ta session puis démarre quand tu es prêt.</p>

            {/* Contenu */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-slate-700">Contenu</div>
              <div className="inline-flex rounded-lg bg-slate-100 p-1">
                {(["mots","expressions","definitions"] as ContentMode[]).map((c) => (
                  <button key={c} onClick={() => setContent(c)}
                          className={"px-3 py-1.5 rounded-md text-sm font-medium capitalize " +
                            (content === c ? "bg-white shadow text-slate-900" : "text-slate-600 hover:text-slate-800")}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Mode */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-slate-700">Mode</div>
              <div className="inline-flex rounded-lg bg-slate-100 p-1">
                {(["entrainement","examen"] as SessionMode[]).map((m) => (
                  <button key={m} onClick={() => setMode(m)}
                          className={"px-3 py-1.5 rounded-md text-sm font-medium capitalize " +
                            (mode === m ? "bg-white shadow text-slate-900" : "text-slate-600 hover:text-slate-800")}>
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Nombre */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-slate-700">Nombre de questions</div>
              <div className="inline-flex rounded-lg bg-slate-100 p-1">
                {COUNTS.map((n) => {
                  const disabled = n > max; const active = n === count && !disabled;
                  return (
                    <button key={n} onClick={() => !disabled && setCount(n)} disabled={disabled}
                            className={"px-3 py-1.5 rounded-md text-sm font-medium " +
                              (disabled ? "text-slate-400 cursor-not-allowed"
                                        : active ? "bg-white shadow text-slate-900"
                                                 : "text-slate-600 hover:text-slate-800")}>
                      {n}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Résumé + start */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                {mode === "examen"
                  ? <>Durée estimée : <span className="font-mono">{mm}:{ss}</span> (⏱ {SECONDS_PER_QUESTION}s/question)</>
                  : <>Feedback immédiat + explications en français.</>}
              </div>
              <button onClick={start} disabled={notEnough}
                      className={"px-5 py-2 rounded-lg text-white text-sm font-medium transition " +
                        (notEnough ? "bg-slate-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98]")}>
                Démarrer →
              </button>
            </div>

            {notEnough && (
              <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
                Il faut au moins 4 éléments dans « {content} ».
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ---------- RESULT ----------
  if (screen === "result") {
    const pct = session.length ? score / session.length : 0;
    const letter = gradeFromPct(pct);
    const wrongs = answers.filter(a => a.selectedIndex !== a.q.correctIndex);

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow p-6 space-y-6 w-full max-w-xl text-center">
          <h1 className="text-2xl font-semibold text-indigo-600">English Prep</h1>
          <div className="text-slate-700">
            Score : <strong>{score}</strong> / {session.length} — Note : <strong>{letter}</strong>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button onClick={() => setScreen("home")} className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300">Accueil</button>
            <button onClick={() => setScreen("review")} className="px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-500">Révision ({wrongs.length})</button>
            <button onClick={() => start()} className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500">Rejouer</button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- REVIEW ----------
  if (screen === "review") {
    const wrongs = answers.filter(a => a.selectedIndex !== a.q.correctIndex);
    const g = content === "mots" ? glossary : content === "expressions" ? exprGlossary : undefined;

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-3xl space-y-4">
          <header className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-indigo-600">Révision</h1>
            <div className="text-sm text-slate-500">{wrongs.length} erreur{wrongs.length > 1 ? "s" : ""}</div>
          </header>

          {wrongs.length === 0 ? (
            <div className="bg-white rounded-2xl shadow p-6 text-center text-slate-600">
              Rien à réviser. Solide. 👌
            </div>
          ) : (
            <>
              <div className="bg-white rounded-2xl shadow p-4">
                <div className="grid gap-4">
                  {wrongs.map((a, idx) => (
                    <div key={idx} className="rounded-xl border border-slate-200 p-4">
                      <div className="text-slate-500 text-sm mb-1">Question</div>
                      <div className="text-lg font-semibold whitespace-pre-line mb-3">{a.q.prompt}</div>

                      <ul className="grid gap-2">
                        {a.q.choices.map((c, j) => {
                          const isCorrect = j === a.q.correctIndex;
                          const isChosen = j === a.selectedIndex;
                          const base = "rounded-lg px-3 py-2 border";
                          const cls = isCorrect
                            ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                            : isChosen
                            ? "border-rose-300 bg-rose-50 text-rose-700"
                            : "border-slate-200";
                          return (
                            <li key={j} className={`${base} ${cls}`}>
                              <span className="font-medium mr-2">{j + 1}.</span>
                              {c}
                              {g?.[c] ? <span className="ml-2 text-slate-500">— « {g[c]} »</span> : null}
                              {isCorrect ? <span className="ml-2 text-emerald-700 font-medium">(bonne)</span> : null}
                              {isChosen && !isCorrect ? <span className="ml-2 text-rose-700">(votre choix)</span> : null}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button onClick={() => setScreen("home")} className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300">Accueil</button>
                <button
                  onClick={() => startFromQuestions(wrongs.map(w => w.q))}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500"
                >
                  Refaire ces erreurs
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // ---------- QUIZ ----------
  const q = session[i];
  const g = content === "mots" ? glossary : content === "expressions" ? exprGlossary : undefined;
  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");
  const low = mode === "examen" && totalSecondsQuiz > 0 && timeLeft <= Math.max(10, Math.floor(totalSecondsQuiz * 0.1));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-4">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => setScreen("home")} className="text-sm text-slate-500 hover:text-slate-700">← Accueil</button>
            <h1 className="text-2xl font-semibold text-indigo-600">English Prep</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 capitalize">{content} · {mode}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            {mode === "examen" && (
              <span className={"font-mono tabular-nums px-2 py-1 rounded " + (low ? "bg-amber-100 text-amber-800" : "bg-slate-100")}
                    title={`${SECONDS_PER_QUESTION}s par question`}>
                ⏱ {mm}:{ss}
              </span>
            )}
            <span>Question {i + 1} / {session.length} · Score {score}</span>
          </div>
        </header>

        <QuestionCard
          key={`${content}-${mode}-${count}-${i}`}
          prompt={q.prompt}
          choices={q.choices}
          correctIndex={q.correctIndex}
          glossary={g}
          exam={mode === "examen"}
          onNext={next}
        />
      </div>
    </div>
  );
}
