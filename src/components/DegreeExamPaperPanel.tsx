import React from "react";
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  Modal,
  Space,
  Tag,
  Typography,
  message,
} from "antd";
import type {
  DegreeExamPaper,
  DegreeExamQuestion,
  DegreeExamSection,
} from "@/data/degreeExamFullPapers";
import {
  scoreEssayWithOpenAICompatible,
  type EssayScoringConfig,
  type EssayScoringResult,
} from "@/utils/essayScoring";

const { Paragraph, Text, Title } = Typography;
const { TextArea } = Input;

const PAPER_STORAGE_KEY = "english-degree-formal-paper-state";
const ESSAY_SCORING_CONFIG_KEY = "english-degree-essay-scoring-config";
const DEFAULT_ESSAY_SCORING_CONFIG: EssayScoringConfig = {
  endpoint: "https://openrouter.ai/api/v1/chat/completions",
  model: "openrouter/free",
  apiKey: "",
};

type QuestionInputMode = "choice" | "text" | "essay";

type EssayResultState = {
  status: "idle" | "loading" | "success" | "error";
  score?: number;
  summary?: string;
  strengths?: string[];
  improvements?: string[];
  rubric?: Record<string, number>;
  errorMessage?: string;
  updatedAt?: string;
};

type DegreeExamRuntimeState = {
  answers: Record<string, Record<string, string>>;
  submitted: Record<string, boolean>;
  essayResults: Record<string, EssayResultState>;
};

type SectionScoreReport = {
  sectionId: string;
  title: string;
  earned: number;
  total: number;
  answered: number;
  totalQuestions: number;
};

const EMPTY_STATE: DegreeExamRuntimeState = {
  answers: {},
  submitted: {},
  essayResults: {},
};

function normalizeState(raw: unknown): DegreeExamRuntimeState {
  if (!raw || typeof raw !== "object") return EMPTY_STATE;
  const data = raw as Partial<DegreeExamRuntimeState>;
  return {
    answers:
      data.answers && typeof data.answers === "object" ? data.answers : {},
    submitted:
      data.submitted && typeof data.submitted === "object"
        ? data.submitted
        : {},
    essayResults:
      data.essayResults && typeof data.essayResults === "object"
        ? data.essayResults
        : {},
  };
}

function normalizeScoringConfig(raw: unknown): EssayScoringConfig {
  if (!raw || typeof raw !== "object") return DEFAULT_ESSAY_SCORING_CONFIG;
  const data = raw as Partial<EssayScoringConfig>;
  return {
    endpoint:
      typeof data.endpoint === "string" && data.endpoint.trim()
        ? data.endpoint
        : DEFAULT_ESSAY_SCORING_CONFIG.endpoint,
    model:
      typeof data.model === "string" && data.model.trim()
        ? data.model
        : DEFAULT_ESSAY_SCORING_CONFIG.model,
    apiKey: typeof data.apiKey === "string" ? data.apiKey : "",
  };
}

function normalizeText(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function formatScore(value: number) {
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}

function roundScore(value: number) {
  return Math.round(value * 10) / 10;
}

function isWritingSection(section: DegreeExamSection) {
  return section.title.includes("短文写作");
}

function extractChoiceAnswer(answer: string) {
  const normalized = answer.trim();
  if (/^[A-F]$/i.test(normalized)) return normalized.toUpperCase();
  const match = normalized.match(/^([A-F])(?:\s*[\).].*|\s+\(.*\))$/i);
  return match?.[1]?.toUpperCase() || null;
}

function getQuestionInputMode(
  section: DegreeExamSection,
  question: DegreeExamQuestion,
): QuestionInputMode {
  if (isWritingSection(section)) return "essay";
  if (question.options?.length) return "choice";
  if (extractChoiceAnswer(question.analysis.answer)) return "choice";
  return "text";
}

function getChoiceOptions(
  section: DegreeExamSection,
  question: DegreeExamQuestion,
): Array<{ label: string; text: string }> {
  if (question.options?.length) {
    return question.options.map((option, index) => {
      const match = option.match(/^\s*([A-F])[\.\)]\s*(.*)$/);
      return {
        label: match?.[1] || String.fromCharCode(65 + index),
        text: match?.[2] || option,
      };
    });
  }

  if (section.title.includes("阅读判断")) {
    return [
      { label: "A", text: "True" },
      { label: "B", text: "False" },
      { label: "C", text: "Not Given" },
    ];
  }

  if (section.assistantItems?.length) {
    return section.assistantItems.map((item, index) => {
      const match = item.match(/^\s*([A-F])[\.\)]\s*(.*)$/);
      return {
        label: match?.[1] || String.fromCharCode(65 + index),
        text: match?.[2] || item,
      };
    });
  }

  const inferredAnswer = extractChoiceAnswer(question.analysis.answer) || "A";
  return [{ label: inferredAnswer, text: question.analysis.answer }];
}

function getCanonicalAnswer(question: DegreeExamQuestion) {
  return (
    extractChoiceAnswer(question.analysis.answer) ||
    normalizeText(question.analysis.answer)
  );
}

function isAnswerCorrect(question: DegreeExamQuestion, userAnswer?: string) {
  if (!userAnswer) return false;
  const choiceAnswer = extractChoiceAnswer(question.analysis.answer);
  if (choiceAnswer)
    return normalizeText(userAnswer).toUpperCase() === choiceAnswer;
  return normalizeText(userAnswer) === normalizeText(question.analysis.answer);
}

function calculatePaperReport(
  paper: DegreeExamPaper,
  answers: Record<string, string>,
  essayResult?: EssayResultState,
) {
  const sectionReports: SectionScoreReport[] = [];
  let objectiveScore = 0;
  let objectiveTotal = 0;
  let objectiveAnswered = 0;
  let objectiveQuestionCount = 0;
  let totalAnswered = 0;
  let totalQuestionCount = 0;

  paper.sections.forEach((section) => {
    const isWriting = isWritingSection(section);
    const perQuestionScore = isWriting
      ? section.score
      : section.score / section.questions.length;
    let sectionEarned = 0;
    let sectionAnswered = 0;

    section.questions.forEach((question) => {
      const answer = answers[question.id]?.trim();
      totalQuestionCount += 1;
      if (answer) totalAnswered += 1;

      if (isWriting) return;

      objectiveQuestionCount += 1;
      objectiveTotal += perQuestionScore;
      if (!answer) return;
      sectionAnswered += 1;
      objectiveAnswered += 1;
      if (isAnswerCorrect(question, answer)) {
        sectionEarned += perQuestionScore;
        objectiveScore += perQuestionScore;
      }
    });

    sectionReports.push({
      sectionId: section.id,
      title: section.title,
      earned: roundScore(sectionEarned),
      total: section.score,
      answered: isWriting
        ? answers[section.questions[0]?.id]?.trim()
          ? 1
          : 0
        : sectionAnswered,
      totalQuestions: section.questions.length,
    });
  });

  const essayScore =
    essayResult?.status === "success" ? essayResult.score || 0 : null;

  return {
    sectionReports,
    objectiveScore: roundScore(objectiveScore),
    objectiveTotal: roundScore(objectiveTotal),
    objectiveAnswered,
    objectiveQuestionCount,
    totalAnswered,
    totalQuestionCount,
    essayScore,
    totalScore:
      essayScore === null
        ? null
        : roundScore(roundScore(objectiveScore) + essayScore),
  };
}

export function DegreeExamPaperPanel({
  papers,
}: {
  papers: DegreeExamPaper[];
}) {
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();
  const [configForm] = Form.useForm<EssayScoringConfig>();
  const [activePaperId, setActivePaperId] = React.useState<string>(
    papers[0]?.id || "",
  );
  const [state, setState] = React.useState<DegreeExamRuntimeState>(EMPTY_STATE);
  const [essayScoringConfig, setEssayScoringConfig] =
    React.useState<EssayScoringConfig>(DEFAULT_ESSAY_SCORING_CONFIG);
  const [scoringModalOpen, setScoringModalOpen] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(PAPER_STORAGE_KEY);
      setState(raw ? normalizeState(JSON.parse(raw)) : EMPTY_STATE);
    } catch {
      setState(EMPTY_STATE);
    }

    try {
      const raw = window.localStorage.getItem(ESSAY_SCORING_CONFIG_KEY);
      const parsed = raw
        ? normalizeScoringConfig(JSON.parse(raw))
        : DEFAULT_ESSAY_SCORING_CONFIG;
      setEssayScoringConfig(parsed);
      configForm.setFieldsValue(parsed);
    } catch {
      setEssayScoringConfig(DEFAULT_ESSAY_SCORING_CONFIG);
      configForm.setFieldsValue(DEFAULT_ESSAY_SCORING_CONFIG);
    }
  }, [configForm]);

  React.useEffect(() => {
    try {
      window.localStorage.setItem(PAPER_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota errors
    }
  }, [state]);

  const activePaper = React.useMemo(
    () => papers.find((paper) => paper.id === activePaperId) || papers[0],
    [activePaperId, papers],
  );

  const activeAnswers = React.useMemo(
    () => (activePaper ? (state.answers[activePaper.id] ?? {}) : {}),
    [activePaper, state.answers],
  );

  const activeSubmitted = activePaper
    ? !!state.submitted[activePaper.id]
    : false;
  const activeEssayResult = activePaper
    ? state.essayResults[activePaper.id]
    : undefined;
  const activeWritingSection = React.useMemo(
    () => activePaper?.sections.find((section) => isWritingSection(section)),
    [activePaper],
  );
  const activeEssayQuestionId = activeWritingSection?.questions[0]?.id || "";
  const canRescoreEssay = Boolean(
    activeSubmitted &&
    activeEssayResult?.status !== "loading" &&
    activeEssayQuestionId &&
    activeAnswers[activeEssayQuestionId],
  );

  const activeReport = React.useMemo(() => {
    if (!activePaper) {
      return {
        sectionReports: [],
        objectiveScore: 0,
        objectiveTotal: 0,
        objectiveAnswered: 0,
        objectiveQuestionCount: 0,
        totalAnswered: 0,
        totalQuestionCount: 0,
        essayScore: null,
        totalScore: null,
      };
    }
    return calculatePaperReport(activePaper, activeAnswers, activeEssayResult);
  }, [activeAnswers, activeEssayResult, activePaper]);

  const essayConfigReady = Boolean(
    essayScoringConfig.endpoint.trim() && essayScoringConfig.model.trim(),
  );

  const updatePaperAnswer = React.useCallback(
    (paperId: string, questionId: string, value: string) => {
      setState((current) => {
        if (current.submitted[paperId]) return current;
        return {
          ...current,
          answers: {
            ...current.answers,
            [paperId]: {
              ...(current.answers[paperId] ?? {}),
              [questionId]: value,
            },
          },
        };
      });
    },
    [],
  );

  const saveEssayScoringConfig = React.useCallback(async () => {
    const values = await configForm.validateFields();
    const normalized: EssayScoringConfig = {
      endpoint: values.endpoint.trim(),
      model: values.model.trim(),
      apiKey: values.apiKey.trim(),
    };
    setEssayScoringConfig(normalized);
    try {
      window.localStorage.setItem(
        ESSAY_SCORING_CONFIG_KEY,
        JSON.stringify(normalized),
      );
    } catch {
      // ignore quota errors
    }
    setScoringModalOpen(false);
    messageApi.success("作文评分配置已保存");
  }, [configForm, messageApi]);

  const runEssayScoring = React.useCallback(
    async (paper: DegreeExamPaper, essayText: string) => {
      if (!essayText.trim()) {
        setState((current) => ({
          ...current,
          essayResults: {
            ...current.essayResults,
            [paper.id]: {
              status: "error",
              errorMessage: "你还没有写作文内容，暂时无法评分。",
            },
          },
        }));
        return;
      }

      if (
        typeof navigator !== "undefined" &&
        Object.prototype.hasOwnProperty.call(navigator, "onLine") &&
        !navigator.onLine
      ) {
        setState((current) => ({
          ...current,
          essayResults: {
            ...current.essayResults,
            [paper.id]: {
              status: "error",
              errorMessage: "当前离线，作文评分需要联网。",
            },
          },
        }));
        return;
      }

      if (!essayConfigReady) {
        setState((current) => ({
          ...current,
          essayResults: {
            ...current.essayResults,
            [paper.id]: {
              status: "error",
              errorMessage: "未配置作文评分接口，当前仅能完成客观题判分。",
            },
          },
        }));
        return;
      }

      const writingSection = paper.sections.find((section) =>
        isWritingSection(section),
      );
      const writingQuestion = writingSection?.questions[0];
      if (!writingSection || !writingQuestion) return;

      setState((current) => ({
        ...current,
        essayResults: {
          ...current.essayResults,
          [paper.id]: {
            status: "loading",
          },
        },
      }));

      try {
        const result: EssayScoringResult = await scoreEssayWithOpenAICompatible(
          {
            config: essayScoringConfig,
            paperTitle: paper.title,
            writingPrompt: writingQuestion.prompt,
            writingGuidance: writingSection.assistantItems || [],
            essayText,
          },
        );

        setState((current) => ({
          ...current,
          essayResults: {
            ...current.essayResults,
            [paper.id]: {
              status: "success",
              score: result.score,
              summary: result.summary,
              strengths: result.strengths,
              improvements: result.improvements,
              rubric: result.rubric,
              updatedAt: new Date().toISOString(),
            },
          },
        }));
        messageApi.success("作文评分已完成");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "作文评分失败，请稍后重试。";
        setState((current) => ({
          ...current,
          essayResults: {
            ...current.essayResults,
            [paper.id]: {
              status: "error",
              errorMessage,
            },
          },
        }));
        messageApi.warning(errorMessage);
      }
    },
    [essayConfigReady, essayScoringConfig, messageApi],
  );

  const handleSubmitPaper = React.useCallback(() => {
    if (!activePaper) return;
    const writingSection = activePaper.sections.find((section) =>
      isWritingSection(section),
    );
    const essayQuestionId = writingSection?.questions[0]?.id;
    const essayText = essayQuestionId
      ? activeAnswers[essayQuestionId] || ""
      : "";
    const unansweredObjective =
      activeReport.objectiveQuestionCount - activeReport.objectiveAnswered;

    modal.confirm({
      title: `确认交卷：${activePaper.title}`,
      content: (
        <div className="degreeSubmitSnapshot">
          <p>
            客观题已答 <strong>{activeReport.objectiveAnswered}</strong> /{" "}
            <strong>{activeReport.objectiveQuestionCount}</strong>
          </p>
          <p>
            仍有 <strong>{unansweredObjective}</strong>{" "}
            题客观题未作答，未作答会按错题处理。
          </p>
          <p>
            作文字数约{" "}
            <strong>
              {essayText.trim() ? essayText.trim().split(/\s+/).length : 0}
            </strong>{" "}
            词。
          </p>
          <p>
            作文评分接口：
            <strong>
              {essayConfigReady
                ? "已配置，交卷后自动评分"
                : "未配置，仅判客观题"}
            </strong>
          </p>
        </div>
      ),
      okText: "确认交卷",
      cancelText: "再检查一下",
      onOk: async () => {
        setState((current) => ({
          ...current,
          submitted: {
            ...current.submitted,
            [activePaper.id]: true,
          },
        }));

        if (essayText.trim()) {
          await runEssayScoring(activePaper, essayText);
        } else {
          setState((current) => ({
            ...current,
            essayResults: {
              ...current.essayResults,
              [activePaper.id]: {
                status: "error",
                errorMessage: "作文未作答，因此本次没有作文分。",
              },
            },
          }));
        }
      },
    });
  }, [
    activeAnswers,
    activePaper,
    activeReport.objectiveAnswered,
    activeReport.objectiveQuestionCount,
    essayConfigReady,
    modal,
    runEssayScoring,
  ]);

  const handleResetPaper = React.useCallback(() => {
    if (!activePaper) return;
    modal.confirm({
      title: `重做本卷：${activePaper.title}`,
      content: (
        <div className="degreeSubmitSnapshot">
          <p>
            当前客观题得分：
            <strong>{formatScore(activeReport.objectiveScore)}</strong> /{" "}
            <strong>{formatScore(activeReport.objectiveTotal)}</strong>
          </p>
          <p>
            当前已作答：<strong>{activeReport.totalAnswered}</strong> /{" "}
            <strong>{activeReport.totalQuestionCount}</strong>
          </p>
          <p>确认后会清空这套卷子的作答记录和作文评分结果。</p>
        </div>
      ),
      okText: "确认清空并重做",
      cancelText: "取消",
      okButtonProps: { danger: true },
      onOk: () => {
        setState((current) => ({
          answers: {
            ...current.answers,
            [activePaper.id]: {},
          },
          submitted: {
            ...current.submitted,
            [activePaper.id]: false,
          },
          essayResults: {
            ...current.essayResults,
            [activePaper.id]: {
              status: "idle",
            },
          },
        }));
        messageApi.success("本卷已清空，可以重新作答了");
      },
    });
  }, [
    activePaper,
    activeReport.objectiveScore,
    activeReport.objectiveTotal,
    activeReport.totalAnswered,
    activeReport.totalQuestionCount,
    messageApi,
    modal,
  ]);

  if (!activePaper) return null;

  return (
    <div className="degreePaperSection">
      {messageContextHolder}
      {modalContextHolder}

      <div className="degreePaperSelector">
        {papers.map((paper) => {
          const active = paper.id === activePaper.id;
          const paperAnswers = state.answers[paper.id] ?? {};
          const paperEssayResult = state.essayResults[paper.id];
          const report = calculatePaperReport(
            paper,
            paperAnswers,
            paperEssayResult,
          );
          const submitted = !!state.submitted[paper.id];
          return (
            <button
              key={paper.id}
              type="button"
              className={
                active
                  ? "degreePaperTab degreePaperTabActive"
                  : "degreePaperTab"
              }
              onClick={() => setActivePaperId(paper.id)}
            >
              <div className="degreePaperTabTop">
                <span>{paper.title}</span>
                <Tag color={active ? "green" : "blue"}>{paper.badge}</Tag>
              </div>
              <p>{paper.description}</p>
              <div className="degreePaperTabMeta">
                {submitted ? (
                  <span className="degreePaperTabScore">
                    客观题 {formatScore(report.objectiveScore)}/
                    {formatScore(report.objectiveTotal)}
                  </span>
                ) : (
                  <span className="degreePaperTabScore">
                    已答 {report.totalAnswered}/{report.totalQuestionCount}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <Card className="degreePaperShell">
        <div className="degreePaperHead">
          <div>
            <Title level={2} className="degreePaperTitle">
              {activePaper.title}
            </Title>
            <Paragraph className="degreePaperDesc">
              {activePaper.description}
            </Paragraph>
          </div>
          <Space wrap size={[8, 8]}>
            <Tag color="green">{activePaper.badge}</Tag>
            <Tag>{activePaper.durationMinutes} 分钟</Tag>
            <Tag>满分 {activePaper.totalScore}</Tag>
            <Tag color={activeSubmitted ? "gold" : "default"}>
              {activeSubmitted ? "已交卷" : "作答中"}
            </Tag>
          </Space>
        </div>

        <div className="degreePaperBasis">
          <div className="degreePaperBasisItem">
            <Text strong>教材依据</Text>
            <Paragraph>{activePaper.textbookBasis}</Paragraph>
          </div>
          <div className="degreePaperBasisItem">
            <Text strong>命题依据</Text>
            <Paragraph>{activePaper.examBasis}</Paragraph>
          </div>
        </div>

        <div className="degreePaperWorkbench">
          <div className="degreePaperWorkbenchMeta">
            <div className="degreePaperWorkbenchStat">
              <span>已作答</span>
              <strong>
                {activeReport.totalAnswered}/{activeReport.totalQuestionCount}
              </strong>
            </div>
            <div className="degreePaperWorkbenchStat">
              <span>客观题</span>
              <strong>
                {activeSubmitted
                  ? `${formatScore(activeReport.objectiveScore)}/${formatScore(
                      activeReport.objectiveTotal,
                    )}`
                  : "待交卷"}
              </strong>
            </div>
            <div className="degreePaperWorkbenchStat">
              <span>作文</span>
              <strong>
                {activeSubmitted
                  ? activeEssayResult?.status === "success"
                    ? `${formatScore(activeEssayResult.score || 0)}/30`
                    : "待评分"
                  : "待交卷"}
              </strong>
            </div>
            <div className="degreePaperWorkbenchStat">
              <span>总分</span>
              <strong>
                {activeSubmitted
                  ? activeReport.totalScore === null
                    ? "待评分"
                    : `${formatScore(activeReport.totalScore)}/100`
                  : "待交卷"}
              </strong>
            </div>
          </div>

          <Space wrap size={[10, 10]}>
            <Button onClick={() => setScoringModalOpen(true)}>
              作文评分设置
            </Button>
            {canRescoreEssay ? (
              <Button
                onClick={() => {
                  if (!activeEssayQuestionId) return;
                  void runEssayScoring(
                    activePaper,
                    activeAnswers[activeEssayQuestionId] || "",
                  );
                }}
              >
                重新作文评分
              </Button>
            ) : null}
            {activeSubmitted ? (
              <Button danger onClick={handleResetPaper}>
                重做本卷
              </Button>
            ) : (
              <Button type="primary" onClick={handleSubmitPaper}>
                交卷
              </Button>
            )}
          </Space>
        </div>

        {activeSubmitted ? (
          <Alert
            className="degreePaperSummaryAlert"
            type={activeReport.totalScore === null ? "warning" : "success"}
            showIcon
            message={
              activeReport.totalScore === null
                ? `客观题已判分：${formatScore(activeReport.objectiveScore)}/${formatScore(
                    activeReport.objectiveTotal,
                  )}。作文仍待评分，总分暂未最终确定。`
                : `已完成判分，总分 ${formatScore(activeReport.totalScore)}/100。`
            }
            description={
              <div className="degreePaperSectionScoreGrid">
                {activeReport.sectionReports.map((item) => (
                  <div
                    key={item.sectionId}
                    className="degreePaperSectionScoreCard"
                  >
                    <span>{item.title}</span>
                    <strong>
                      {formatScore(item.earned)}/{formatScore(item.total)}
                    </strong>
                  </div>
                ))}
              </div>
            }
          />
        ) : (
          <Alert
            className="degreePaperSummaryAlert"
            type="info"
            showIcon
            message="现在这套卷子已经可以直接作答了"
            description="交卷前默认不展示标准答案、考点讲解和易错提醒；交卷后会自动判客观题，并在已配置接口时自动进行作文评分。"
          />
        )}

        <div className="degreePaperContent">
          {activePaper.sections.map((section) => (
            <Card
              key={section.id}
              className="degreePaperCard"
              title={
                <Space wrap size={[8, 8]}>
                  <span>{section.title}</span>
                  <Tag color="blue">{section.questionRange}</Tag>
                  <Tag>{section.score} 分</Tag>
                </Space>
              }
            >
              <Paragraph className="degreePaperInstruction">
                {section.instructions}
              </Paragraph>

              <Space wrap size={[8, 8]} className="degreePaperTags">
                {section.sourceBasis.map((item) => (
                  <Tag key={item}>{item}</Tag>
                ))}
              </Space>

              {section.material?.length ? (
                <div className="degreePaperMaterial">
                  {section.material.map((paragraph) => (
                    <Paragraph
                      key={paragraph}
                      className="degreePaperMaterialText"
                    >
                      {paragraph}
                    </Paragraph>
                  ))}
                </div>
              ) : null}

              {section.materialTranslation?.length ? (
                <div className="degreePaperMaterialTranslation">
                  <Text strong>全文翻译</Text>
                  {section.materialTranslation.map((paragraph, index) => (
                    <Paragraph
                      key={`${section.id}-translation-${index}`}
                      className="degreePaperMaterialTranslationText"
                    >
                      {paragraph}
                    </Paragraph>
                  ))}
                </div>
              ) : null}

              {section.assistantItems?.length ? (
                <div className="degreePaperAssistant">
                  <Text strong>{section.assistantTitle || "提示"}</Text>
                  <ul className="degreePaperAssistantList">
                    {section.assistantItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="degreePaperQuestionList">
                {section.questions.map((question) => {
                  const inputMode = getQuestionInputMode(section, question);
                  const userAnswer = activeAnswers[question.id] || "";
                  const submitted = activeSubmitted;
                  const correct =
                    submitted && isAnswerCorrect(question, userAnswer);
                  const showDetails = submitted;
                  const choiceOptions =
                    inputMode === "choice"
                      ? getChoiceOptions(section, question)
                      : [];

                  return (
                    <div
                      key={question.id}
                      className={
                        submitted && !correct
                          ? "degreePaperQuestion degreePaperQuestionWrong"
                          : submitted && correct
                            ? "degreePaperQuestion degreePaperQuestionCorrect"
                            : "degreePaperQuestion"
                      }
                    >
                      <div className="degreePaperQuestionHead">
                        <span className="degreePaperQuestionNo">
                          {question.number}
                        </span>
                        <div className="degreePaperQuestionMain">
                          <Paragraph className="degreePaperQuestionPrompt">
                            {question.prompt}
                          </Paragraph>
                          <div className="degreePaperQuestionTranslation">
                            <Text strong>题干翻译：</Text>
                            <Paragraph className="degreePaperQuestionTranslationText">
                              {question.analysis.translation}
                            </Paragraph>
                          </div>

                          {inputMode === "choice" ? (
                            <div className="degreePaperAnswerOptions">
                              {choiceOptions.map((option) => {
                                const selected =
                                  normalizeText(userAnswer).toUpperCase() ===
                                  option.label;
                                const isCorrectOption =
                                  extractChoiceAnswer(
                                    question.analysis.answer,
                                  ) === option.label;
                                return (
                                  <button
                                    key={`${question.id}-${option.label}`}
                                    type="button"
                                    className={[
                                      "degreePaperAnswerOption",
                                      selected
                                        ? "degreePaperAnswerOptionSelected"
                                        : "",
                                      submitted && isCorrectOption
                                        ? "degreePaperAnswerOptionCorrect"
                                        : "",
                                      submitted && selected && !isCorrectOption
                                        ? "degreePaperAnswerOptionWrong"
                                        : "",
                                    ]
                                      .filter(Boolean)
                                      .join(" ")}
                                    disabled={submitted}
                                    onClick={() =>
                                      updatePaperAnswer(
                                        activePaper.id,
                                        question.id,
                                        option.label,
                                      )
                                    }
                                  >
                                    <span className="degreePaperAnswerOptionLabel">
                                      {option.label}
                                    </span>
                                    <span>{option.text}</span>
                                  </button>
                                );
                              })}
                            </div>
                          ) : inputMode === "essay" ? (
                            <div className="degreePaperEssayBox">
                              <TextArea
                                value={userAnswer}
                                rows={10}
                                placeholder="请在这里写作文，交卷后会先完成客观题判分；若已配置作文评分接口，将自动请求三方评分。"
                                disabled={submitted}
                                onChange={(event) =>
                                  updatePaperAnswer(
                                    activePaper.id,
                                    question.id,
                                    event.target.value,
                                  )
                                }
                              />
                              <div className="degreePaperEssayMeta">
                                <span>
                                  当前约{" "}
                                  {userAnswer.trim()
                                    ? userAnswer.trim().split(/\s+/).length
                                    : 0}{" "}
                                  词
                                </span>
                                <span>建议围绕题目要求写到 100 词左右</span>
                              </div>

                              {submitted ? (
                                <div className="degreePaperEssayResult">
                                  {activeEssayResult?.status === "loading" ? (
                                    <Alert
                                      type="info"
                                      showIcon
                                      message="作文评分中"
                                      description="正在请求三方评分接口，请稍等。"
                                    />
                                  ) : activeEssayResult?.status ===
                                    "success" ? (
                                    <Alert
                                      type="success"
                                      showIcon
                                      message={`作文得分 ${formatScore(
                                        activeEssayResult.score || 0,
                                      )}/30`}
                                      description={
                                        <div className="degreePaperEssayFeedback">
                                          {activeEssayResult.summary ? (
                                            <Paragraph>
                                              <Text strong>总评：</Text>
                                              {activeEssayResult.summary}
                                            </Paragraph>
                                          ) : null}
                                          {activeEssayResult.rubric ? (
                                            <div className="degreePaperEssayRubric">
                                              {Object.entries(
                                                activeEssayResult.rubric,
                                              ).map(([key, value]) => (
                                                <Tag key={key}>
                                                  {key} {formatScore(value)}
                                                </Tag>
                                              ))}
                                            </div>
                                          ) : null}
                                          {activeEssayResult.strengths
                                            ?.length ? (
                                            <div>
                                              <Text strong>亮点</Text>
                                              <ul className="degreePaperFeedbackList">
                                                {activeEssayResult.strengths.map(
                                                  (item) => (
                                                    <li key={item}>{item}</li>
                                                  ),
                                                )}
                                              </ul>
                                            </div>
                                          ) : null}
                                          {activeEssayResult.improvements
                                            ?.length ? (
                                            <div>
                                              <Text strong>改进建议</Text>
                                              <ul className="degreePaperFeedbackList">
                                                {activeEssayResult.improvements.map(
                                                  (item) => (
                                                    <li key={item}>{item}</li>
                                                  ),
                                                )}
                                              </ul>
                                            </div>
                                          ) : null}
                                        </div>
                                      }
                                    />
                                  ) : (
                                    <Alert
                                      type="warning"
                                      showIcon
                                      message="作文暂未完成自动评分"
                                      description={
                                        activeEssayResult?.errorMessage ||
                                        "当前只完成了客观题判分。"
                                      }
                                    />
                                  )}
                                </div>
                              ) : null}
                            </div>
                          ) : (
                            <div className="degreePaperBlankInputWrap">
                              <Input
                                value={userAnswer}
                                disabled={submitted}
                                placeholder="请输入你的答案"
                                onChange={(event) =>
                                  updatePaperAnswer(
                                    activePaper.id,
                                    question.id,
                                    event.target.value,
                                  )
                                }
                              />
                            </div>
                          )}

                          {submitted && inputMode !== "essay" ? (
                            <div
                              className={
                                correct
                                  ? "degreePaperJudgeResult degreePaperJudgeResultCorrect"
                                  : "degreePaperJudgeResult degreePaperJudgeResultWrong"
                              }
                            >
                              <Text strong>
                                {correct ? "回答正确" : "回答错误"}
                              </Text>
                              <Paragraph className="degreePaperJudgeText">
                                你的答案：{userAnswer || "未作答"}；标准答案：
                                {getCanonicalAnswer(question)}
                              </Paragraph>
                            </div>
                          ) : null}
                        </div>
                      </div>

                      {showDetails ? (
                        <div className="degreePaperDetailBox">
                          <div className="degreePaperDetailGroup">
                            <Text strong>标准答案</Text>
                            <Paragraph className="degreePaperDetailText">
                              {question.analysis.answer}
                            </Paragraph>
                          </div>
                          <div className="degreePaperDetailGroup">
                            <Text strong>考点讲解</Text>
                            <Paragraph className="degreePaperDetailText">
                              {question.analysis.point}
                            </Paragraph>
                          </div>
                          <div className="degreePaperDetailGroup">
                            <Text strong>易错答案</Text>
                            <Paragraph className="degreePaperDetailText">
                              {question.analysis.pitfalls}
                            </Paragraph>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>

        <div className="degreePaperBottomBar">
          <Space wrap size={[10, 10]}>
            <Button onClick={() => setScoringModalOpen(true)}>
              作文评分设置
            </Button>
            {canRescoreEssay ? (
              <Button
                onClick={() => {
                  if (!activeEssayQuestionId) return;
                  void runEssayScoring(
                    activePaper,
                    activeAnswers[activeEssayQuestionId] || "",
                  );
                }}
              >
                重新作文评分
              </Button>
            ) : null}
            {activeSubmitted ? (
              <Button danger onClick={handleResetPaper}>
                重做本卷
              </Button>
            ) : (
              <Button type="primary" onClick={handleSubmitPaper}>
                交卷
              </Button>
            )}
          </Space>
        </div>
      </Card>

      <Modal
        title="作文评分接口设置"
        open={scoringModalOpen}
        onCancel={() => setScoringModalOpen(false)}
        onOk={() => {
          void saveEssayScoringConfig();
        }}
        okText="保存设置"
        cancelText="取消"
      >
        <Alert
          type="info"
          showIcon
          className="degreeScoringAlert"
          message="当前接的是 OpenAI 兼容接口"
          description="我已经默认帮你填好了 OpenRouter 免费模型配置。通常你现在只需要补一个 API Key 就能开始用。静态前端直连会暴露密钥，长期使用更建议后续再加一层后端代理。"
        />
        <Form
          form={configForm}
          layout="vertical"
          initialValues={essayScoringConfig}
          className="degreeScoringForm"
        >
          <Form.Item
            label="接口地址 Endpoint"
            name="endpoint"
            rules={[{ required: true, message: "请输入 OpenAI 兼容接口地址" }]}
          >
            <Input placeholder="例如：https://api.deepseek.com/v1/chat/completions" />
          </Form.Item>
          <Form.Item
            label="模型 Model"
            name="model"
            rules={[{ required: true, message: "请输入模型名称" }]}
          >
            <Input placeholder="例如：deepseek-chat / gpt-4o-mini / openai/gpt-4o-mini" />
          </Form.Item>
          <Form.Item label="API Key" name="apiKey">
            <Input.Password placeholder="如果你走自建代理，这里也可以留空" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
