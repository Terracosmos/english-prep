import { useEffect, useMemo, useState } from "react";
import QuestionCard from "./components/QuestionCard";
import ThemeToggle from "./components/ThemeToggle";
import Footer from "./components/Footer";
import { vocab, glossary, type VocabItem } from "./data/vocab";
import { expressions, exprGlossary, type ExpressionItem } from "./data/expressions";
import { definitions, type DefinitionItem } from "./data/definitions";
import { BookOpen, ArrowLeft, Trophy, Repeat2, Home, NotebookPen, PlayCircle } from "lucide-react";

type ContentMode = "mots" | "expressions" | "definitions";
type SessionMode = "entrainement" | "examen";
type Screen = "home" | "quiz" | "result" | "review";
type Q = { prompt: string; choices: [string, string, string, string]; correctIndex: number };
type Answer = { q: Q; selectedIndex: number };

const COUNTS = [15, 30, 50] as const;
const SECONDS_PER_QUESTION = 20;

// ---------- utils ----------
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
  const [answers, setAnswers] = useState<Answer[]>([]);

  const max = corpusSize(content);

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
    setMode("entrainement");
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6 pb-16">
        <div className="w-full max-w-2xl space-y-6 text-slate-900 dark:text-slate-100">
          <header className="flex items-center justify-between">
            <h1 className="inline-flex items-center gap-2 text-3xl font-semibold text-indigo-600">
              <BookOpen size={24} aria-hidden /> English Prep
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 dark:text-slate-400">Corpus {content} : {max}</span>
              <ThemeToggle />
            </div>
          </header>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-2xl ring-1 ring-slate-200/70 dark:ring-white/10 shadow p-6 space-y-6">
            <p className="text-slate-600 dark:text-slate-300">Choisis ta session puis démarre quand tu es prêt.</p>

            {/* Contenu */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Contenu</div>
              <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-700 p-1">
                {(["mots","expressions","definitions"] as ContentMode[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => setContent(c)}
                    className={
                      "px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition " +
                      (content === c ? "bg-white dark:bg-slate-900 shadow text-slate-900 dark:text-slate-100"
                                     : "text-slate-600 dark:text-slate-200 hover:text-slate-800 dark:hover:text-white")
                    }
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Mode */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Mode</div>
              <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-700 p-1">
                {(["entrainement","examen"] as SessionMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={
                      "px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition " +
                      (mode === m ? "bg-white dark:bg-slate-900 shadow text-slate-900 dark:text-slate-100"
                                  : "text-slate-600 dark:text-slate-200 hover:text-slate-800 dark:hover:text-white")
                    }
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Nombre */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Nombre de questions</div>
              <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-700 p-1">
                {COUNTS.map((n) => {
                  const disabled = n > max; const active = n === count && !disabled;
                  return (
                    <button
                      key={n}
                      onClick={() => !disabled && setCount(n)}
                      disabled={disabled}
                      className={
                        "px-3 py-1.5 rounded-lg text-sm font-medium transition " +
                        (disabled
                          ? "text-slate-400 dark:text-slate-500 cursor-not-allowed"
                          : active
                          ? "bg-white dark:bg-slate-900 shadow text-slate-900 dark:text-slate-100"
                          : "text-slate-600 dark:text-slate-200 hover:text-slate-800 dark:hover:text-white")
                      }
                      title={disabled ? `Seulement ${max} dispo dans ${content}` : `Utiliser ${n} questions`}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Résumé + start */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600 dark:text-slate-300">
                {mode === "examen"
                  ? <>Durée estimée : <span className="font-mono">{mm}:{ss}</span> (⏱ {SECONDS_PER_QUESTION}s/question)</>
                  : <>Feedback immédiat + explications en français.</>}
              </div>
              <button
                onClick={start}
                disabled={notEnough}
                className={
                  "group inline-flex items-center gap-2 px-5 py-2 rounded-xl text-white text-sm font-medium transition " +
                  (notEnough ? "bg-slate-300 dark:bg-slate-600 cursor-not-allowed"
                             : "bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98]")
                }
              >
                <PlayCircle size={18} aria-hidden />
                Démarrer
              </button>
            </div>

            {notEnough && (
              <div className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded p-2">
                Il faut au moins 4 éléments dans « {content} ».
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ---------- RESULT ----------
  if (screen === "result") {
    const pct = session.length ? score / session.length : 0;
    const letter = gradeFromPct(pct);
    const wrongs = answers.filter(a => a.selectedIndex !== a.q.correctIndex);

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6 pb-16">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-2xl ring-1 ring-slate-200/70 dark:ring-white/10 shadow p-6 space-y-6 w-full max-w-xl text-center text-slate-900 dark:text-slate-100">
          <header className="flex items-center justify-between">
            <h1 className="inline-flex items-center gap-2 text-2xl font-semibold text-indigo-600">
              <Trophy size={22} aria-hidden /> Résultat
            </h1>
            <ThemeToggle />
          </header>

          <div className="text-slate-700 dark:text-slate-300">
            Score : <strong>{score}</strong> / {session.length} — Note : <strong>{letter}</strong>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button onClick={() => setScreen("home")} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-600">
              <Home size={16} /> Accueil
            </button>
            <button onClick={() => setScreen("review")} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-500">
              <NotebookPen size={16} /> Révision ({wrongs.length})
            </button>
            <button onClick={() => start()} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500">
              <Repeat2 size={16} /> Rejouer
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ---------- REVIEW ----------
  if (screen === "review") {
    const wrongs = answers.filter(a => a.selectedIndex !== a.q.correctIndex);
    const g = content === "mots" ? glossary : content === "expressions" ? exprGlossary : undefined;

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6 pb-16">
        <div className="w-full max-w-3xl space-y-4 text-slate-900 dark:text-slate-100">
          <header className="flex items-center justify-between">
            <h1 className="inline-flex items-center gap-2 text-2xl font-semibold text-indigo-600">
              <NotebookPen size={22} aria-hidden /> Révision
            </h1>
            <ThemeToggle />
          </header>

          {wrongs.length === 0 ? (
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-2xl ring-1 ring-slate-200/70 dark:ring-white/10 shadow p-6 text-center text-slate-600 dark:text-slate-300">
              Rien à réviser. Solide. 👌
            </div>
          ) : (
            <>
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-2xl ring-1 ring-slate-200/70 dark:ring-white/10 shadow p-4">
                <div className="grid gap-4">
                  {wrongs.map((a, idx) => (
                    <div key={idx} className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                      <div className="text-slate-500 dark:text-slate-400 text-sm mb-1">Question</div>
                      <div className="text-lg font-semibold whitespace-pre-line mb-3">{a.q.prompt}</div>

                      <ul className="grid gap-2">
                        {a.q.choices.map((c, j) => {
                          const isCorrect = j === a.q.correctIndex;
                          const isChosen = j === a.selectedIndex;
                          const base = "rounded-lg px-3 py-2 border";
                          const cls = isCorrect
                            ? "border-emerald-300 dark:border-emerald-400/40 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300"
                            : isChosen
                            ? "border-rose-300 dark:border-rose-400/40 bg-rose-50/70 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300"
                            : "border-slate-200 dark:border-slate-700";
                          return (
                            <li key={j} className={`${base} ${cls}`}>
                              <span className="font-medium mr-2">{j + 1}.</span>
                              {c}
                              {g?.[c] ? <span className="ml-2 text-slate-500 dark:text-slate-400">— « {g[c]} »</span> : null}
                              {isCorrect ? <span className="ml-2 text-emerald-700 dark:text-emerald-300 font-medium">(bonne)</span> : null}
                              {isChosen && !isCorrect ? <span className="ml-2 text-rose-700 dark:text-rose-300">(votre choix)</span> : null}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button onClick={() => setScreen("home")} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-600">
                  <Home size={16} /> Accueil
                </button>
                <button
                  onClick={() => startFromQuestions(wrongs.map(w => w.q))}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500"
                >
                  <Repeat2 size={16} /> Refaire ces erreurs
                </button>
              </div>
            </>
          )}
        </div>
        <Footer />
      </div>
    );
  }

  // ---------- QUIZ ----------
  const q = session[i];
  const g =
    content === "mots" ? glossary :
    content === "expressions" ? exprGlossary :
    undefined;

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");
  const low = mode === "examen" && totalSecondsQuiz > 0 && timeLeft <= Math.max(10, Math.floor(totalSecondsQuiz * 0.1));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex items-center justify-center p-6 pb-16">
      <div className="w-full max-w-2xl space-y-4">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => setScreen("home")} className="inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
              <ArrowLeft size={16} /> Accueil
            </button>
            <h1 className="inline-flex items-center gap-2 text-2xl font-semibold text-indigo-600">
              <BookOpen size={22} aria-hidden /> English Prep
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200 capitalize">{content} · {mode}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
            {mode === "examen" && (
              <span
                className={"font-mono tabular-nums px-2 py-1 rounded ring-1 ring-slate-200/70 dark:ring-white/10 " + (low ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200" : "bg-white/70 dark:bg-slate-800/70")}
                title={`${SECONDS_PER_QUESTION}s par question`}
              >
                ⏱ {mm}:{ss}
              </span>
            )}
            <span>Question {i + 1} / {session.length} · Score {score}</span>
            <ThemeToggle />
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
      <Footer />
    </div>
  );
}
