/**
 * 合并 batch 文件生成 degree-vocab-3500.tsv
 * 运行: node scripts/seed-vocab.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const vocabDir = join(__dirname, "vocab");

const batchFiles = readdirSync(vocabDir)
  .filter((f) => f.startsWith("batch-") && f.endsWith(".txt"))
  .sort();

const seen = new Set();
const lines = [];

for (const file of batchFiles) {
  const content = readFileSync(join(vocabDir, file), "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const word = trimmed.split("\t")[0]?.toLowerCase();
    if (!word || seen.has(word)) continue;
    seen.add(word);
    lines.push(trimmed);
  }
}

const outPath = join(vocabDir, "degree-vocab-3500.tsv");
writeFileSync(outPath, lines.join("\n") + "\n", "utf8");
console.log(`Merged ${batchFiles.length} batches -> ${lines.length} unique words`);
