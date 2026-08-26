export interface EssayScoringConfig {
  endpoint: string;
  model: string;
  apiKey: string;
}

export interface EssayScoringResult {
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  rubric?: Record<string, number>;
}

function clampScore(value: number) {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(30, Math.round(value)));
}

function extractJsonCandidate(text: string) {
  const fenced = text.match(/```json\s*([\s\S]*?)```/i);
  if (fenced?.[1]) return fenced[1].trim();

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start >= 0 && end > start) return text.slice(start, end + 1);

  return text.trim();
}

function normalizeStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

export async function scoreEssayWithOpenAICompatible({
  config,
  paperTitle,
  writingPrompt,
  writingGuidance,
  essayText,
}: {
  config: EssayScoringConfig;
  paperTitle: string;
  writingPrompt: string;
  writingGuidance: string[];
  essayText: string;
}): Promise<EssayScoringResult> {
  const response = await fetch(config.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(config.apiKey
        ? {
            Authorization: `Bearer ${config.apiKey}`,
          }
        : {}),
    },
    body: JSON.stringify({
      model: config.model,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "你是成人学位英语阅卷老师。请严格按 30 分作文评分，只返回 JSON，不要返回 markdown。JSON 结构必须包含：score(number, 0-30)、summary(string)、strengths(string[])、improvements(string[])、rubric(object)。反馈语言使用简体中文。",
        },
        {
          role: "user",
          content: [
            `试卷：${paperTitle}`,
            `作文题目：${writingPrompt}`,
            writingGuidance.length
              ? `命题提示：${writingGuidance.join("；")}`
              : "",
            "评分参考：",
            "1. 内容完成度 0-10",
            "2. 语言准确性 0-10",
            "3. 结构与连贯性 0-10",
            "请综合给出一个 0-30 的整数分。",
            "学生作文如下：",
            essayText,
          ]
            .filter(Boolean)
            .join("\n"),
        },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "作文评分接口请求失败");
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    error?: { message?: string };
  };

  if (data.error?.message) {
    throw new Error(data.error.message);
  }

  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("作文评分接口没有返回有效内容");
  }

  let parsed: {
    score?: number;
    summary?: string;
    strengths?: string[];
    improvements?: string[];
    rubric?: Record<string, number>;
  };

  try {
    parsed = JSON.parse(extractJsonCandidate(content)) as typeof parsed;
  } catch {
    throw new Error("作文评分结果解析失败，请检查模型是否按 JSON 返回");
  }

  const rubric =
    parsed.rubric && typeof parsed.rubric === "object" ? parsed.rubric : undefined;

  return {
    score: clampScore(Number(parsed.score ?? 0)),
    summary:
      typeof parsed.summary === "string" && parsed.summary.trim()
        ? parsed.summary.trim()
        : "已完成作文评分。",
    strengths: normalizeStringArray(parsed.strengths),
    improvements: normalizeStringArray(parsed.improvements),
    rubric,
  };
}
