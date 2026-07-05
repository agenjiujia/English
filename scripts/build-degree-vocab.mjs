/**
 * 生成学位英语 3500 高频词分组词表
 * 运行: node scripts/build-degree-vocab.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WORDS_PER_UNIT = 30;

const UNIT_THEMES = [
  "核心功能词与介词",
  "超高频动词 A",
  "超高频动词 B",
  "超高频动词 C",
  "核心名词·人物与社会",
  "核心名词·学习与工作",
  "核心名词·生活与健康",
  "核心形容词 A",
  "核心形容词 B",
  "核心副词与连接词",
  "动词短语·基础动词",
  "动词短语·常用搭配",
  "教育主题词汇",
  "科技与经济词汇",
  "环境与健康词汇",
  "文化与法律词汇",
  "学术与科研词汇",
  "社会与政治词汇",
  "情感与心理词汇",
  "时间与数量词汇",
];

function loadWords() {
  const dataPath = join(__dirname, "vocab", "degree-vocab-3500.tsv");
  const raw = readFileSync(dataPath, "utf8");
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const [word, pos, meaning, example] = line.split("\t");
      return { word, pos, meaning, example: example || "" };
    });
}

function chunk(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

function escape(str) {
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function buildTopic(unitIndex, words, globalOffset) {
  const unitNum = unitIndex + 1;
  const themeIndex = Math.floor(unitIndex / 6) % UNIT_THEMES.length;
  const theme = UNIT_THEMES[themeIndex];
  const start = globalOffset + 1;
  const end = globalOffset + words.length;
  const id = `degree-vocab-unit-${String(unitNum).padStart(3, "0")}`;
  const title = `Unit ${unitNum}：${theme}（${start}–${end}）`;
  const summary = `本组 ${words.length} 词，建议 1 天背完并做自测。背诵四件套：词义 + 词性 + 1 条例句 + 1 个搭配。`;

  const rows = words.map((item, i) => {
    const seq = String(globalOffset + i + 1);
    const example = item.example || `${item.word} — ${item.meaning}`;
    return `      ["${seq}", "${escape(item.word)}", "${escape(item.pos)} ${escape(item.meaning)}", "${escape(example)}"],`;
  });

  return `  t(
    "${id}",
    "${title}",
    "3500词表",
    "${unitNum <= 20 ? "基础" : unitNum <= 80 ? "进阶" : "易错"}",
    "${summary}",
    wordCols,
    [
${rows.join("\n")}
    ],
    [
      "背完本 Unit 后在目录标「掌握」，${unitNum % 7 === 0 ? "周末集中复盘本周所有 Unit。" : "明天复习本组 + 回顾前 1 组。"}",
      "完形重点：不只看中文意思，要记例句里的搭配和介词。",
    ],
  ),`;
}

const words = loadWords();
const units = chunk(words, WORDS_PER_UNIT);

const topicsCode = units
  .map((unitWords, index) => buildTopic(index, unitWords, index * WORDS_PER_UNIT))
  .join("\n");

const output = `import type { GrammarTopic } from "./grammarTopics";

const wordCols = ["序号", "单词", "释义", "例句/搭配"];

const t = (
  id: string,
  title: string,
  category: string,
  level: GrammarTopic["level"],
  summary: string,
  columns: string[],
  rows: string[][],
  tips: string[],
): GrammarTopic => ({
  id,
  title,
  category,
  level,
  summary,
  columns,
  rows,
  tips,
});

/** 3500 高频词 · 共 ${units.length} 个 Unit · 每 Unit ${WORDS_PER_UNIT} 词 · 共 ${words.length} 词 */
export const degreeExamVocabWordTopics: GrammarTopic[] = [
${topicsCode}
];
`;

const outPath = join(__dirname, "..", "src", "data", "degreeExamVocabWordTopics.ts");
writeFileSync(outPath, output, "utf8");
console.log(`Generated ${units.length} units, ${words.length} words -> ${outPath}`);
