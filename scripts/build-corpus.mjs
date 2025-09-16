// scripts/build-corpus.mjs
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { parse } from "csv-parse/sync";

const root = process.cwd();
const csvPath = path.join(root, "data", "corpus.csv");
const outDir = path.join(root, "src", "data");

const header = (title) =>
  `// ⚠️ Fichier généré — ${title}\n` +
  `// Éditez data/corpus.csv puis relancez: pnpm build:corpus\n\n`;

function jsonToTs(obj) {
  return JSON.stringify(obj, null, 2).replace(/\\"/g, '"');
}
function toArray(x) {
  if (!x) return [];
  return String(x).split(";").map(s => s.trim()).filter(Boolean);
}
function dedupeBy(arr, keyFn) {
  const seen = new Set(); const out = [];
  for (const it of arr) { const k = keyFn(it); if (!seen.has(k)) { seen.add(k); out.push(it); } }
  return out;
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const raw = await readFile(csvPath, "utf8");
  const rows = parse(raw, { columns: true, skip_empty_lines: true });

  const vocab = [], expressions = [], definitions = [];
  for (const r of rows) {
    const type = String(r.type || "").trim().toLowerCase();
    if (!type) continue;

    if (type.startsWith("mot")) {
      const fr = String(r.fr || "").trim();
      const en = toArray(r.en);
      if (fr && en.length) vocab.push({ fr, en });
    } else if (type.startsWith("expr")) {
      const fr = String(r.fr || "").trim();
      const en = String(r.en || "").trim();
      if (fr && en) expressions.push({ fr, en });
    } else if (type.startsWith("def")) {
      const def = String(r.def || "").trim();
      const term = String(r.en || r.term || "").trim();
      const synonyms = toArray(r.synonyms);
      if (def && term) definitions.push(synonyms.length ? { def, term, synonyms } : { def, term });
    }
  }

  const v2 = dedupeBy(vocab, x => x.fr.toLowerCase());
  const e2 = dedupeBy(expressions, x => (x.fr + "|" + x.en).toLowerCase());
  const d2 = dedupeBy(definitions, x => x.term.toLowerCase());

  const vocabTs =
    header("src/data/vocab.ts") +
    `export type VocabItem = { fr: string; en: string[] };\n` +
    `export const vocab: VocabItem[] = ${jsonToTs(v2)};\n\n` +
    `export const glossary: Record<string, string> = Object.fromEntries(\n` +
    `  vocab.flatMap((it) => it.en.map((e) => [e, it.fr]))\n` +
    `);\n`;

  const exprTs =
    header("src/data/expressions.ts") +
    `export type ExpressionItem = { fr: string; en: string };\n` +
    `export const expressions: ExpressionItem[] = ${jsonToTs(e2)};\n\n` +
    `export const exprGlossary: Record<string, string> = Object.fromEntries(\n` +
    `  expressions.map((e) => [e.en, e.fr])\n` +
    `);\n`;

  const defsTs =
    header("src/data/definitions.ts") +
    `export type DefinitionItem = { def: string; term: string; synonyms?: string[] };\n` +
    `export const definitions: DefinitionItem[] = ${jsonToTs(d2)};\n`;

  await writeFile(path.join(outDir, "vocab.ts"), vocabTs, "utf8");
  await writeFile(path.join(outDir, "expressions.ts"), exprTs, "utf8");
  await writeFile(path.join(outDir, "definitions.ts"), defsTs, "utf8");

  console.log(`✔ Corpus généré (${v2.length} mots, ${e2.length} expressions, ${d2.length} définitions).`);
}
main().catch((err) => { console.error("✖ Erreur build-corpus:", err); process.exit(1); });
