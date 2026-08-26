import React from "react";
import { Drawer } from "antd";
import {
  Check,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  RotateCcw,
  X,
  XCircle,
} from "lucide-react";
import { quizPapers, type QuizPaper } from "@/data/quizPapers";
import { MarkableText, type Annotation } from "@/components/StudyAnnotations";

const STORAGE_PREFIX = "english-quiz";

type QuizState = {
  answers: Record<string, Record<string, number>>;
  graded: Record<string, boolean>;
};

const EMPTY_STATE: QuizState = {
  answers: {},
  graded: {},
};

function getStorageKey(pageKey: string) {
  return `${STORAGE_PREFIX}:${pageKey}`;
}

function normalizeState(raw: unknown): QuizState {
  if (!raw || typeof raw !== "object") return EMPTY_STATE;
  const data = raw as Partial<QuizState>;
  return {
    answers:
      data.answers && typeof data.answers === "object" ? data.answers : {},
    graded: data.graded && typeof data.graded === "object" ? data.graded : {},
  };
}

export function QuizPanel({
  pageKey = "grammar",
  papers = quizPapers,
  triggerLabel = "试卷",
  cardTitle = "巩固测验",
  cardSubtitle = "覆盖知识点 1-36，选一份开始",
  getAnnotations,
}: {
  pageKey?: string;
  papers?: QuizPaper[];
  triggerLabel?: string;
  cardTitle?: string;
  cardSubtitle?: string;
  getAnnotations?: (targetId: string) => Annotation[];
}) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);
  const [activePaperId, setActivePaperId] = React.useState<string | null>(null);
  const [state, setState] = React.useState<QuizState>(EMPTY_STATE);
  const [isMobile, setIsMobile] = React.useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= 960 : false,
  );

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 960);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(getStorageKey(pageKey));
      setState(raw ? normalizeState(JSON.parse(raw)) : EMPTY_STATE);
    } catch {
      setState(EMPTY_STATE);
    }
  }, [pageKey]);

  React.useEffect(() => {
    try {
      localStorage.setItem(getStorageKey(pageKey), JSON.stringify(state));
    } catch {
      /* ignore quota errors */
    }
  }, [pageKey, state]);

  React.useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const activePaper = React.useMemo(
    () => papers.find((paper) => paper.id === activePaperId) ?? null,
    [activePaperId, papers],
  );

  const getPaperAnswers = React.useCallback(
    (paperId: string) => state.answers[paperId] ?? {},
    [state.answers],
  );

  const getPaperProgress = React.useCallback(
    (paperId: string) => {
      const paper = papers.find((item) => item.id === paperId);
      if (!paper) return { done: 0, total: 0 };
      const answers = state.answers[paperId] ?? {};
      const done = paper.questions.filter(
        (question) => answers[question.id] !== undefined,
      ).length;
      return { done, total: paper.questions.length };
    },
    [state.answers],
  );

  const getPaperScore = React.useCallback(
    (paperId: string) => {
      const paper = papers.find((item) => item.id === paperId);
      if (!paper) return { correct: 0, total: 0 };
      const answers = state.answers[paperId] ?? {};
      const correct = paper.questions.filter(
        (question) => answers[question.id] === question.answer,
      ).length;
      return { correct, total: paper.questions.length };
    },
    [state.answers],
  );

  const handleSelectOption = React.useCallback(
    (paperId: string, questionId: string, optionIndex: number) => {
      const selectedText =
        typeof window !== "undefined"
          ? window.getSelection?.()?.toString().trim() || ""
          : "";
      if (selectedText) return;
      setState((current) => {
        if (current.graded[paperId]) return current;
        return {
          ...current,
          answers: {
            ...current.answers,
            [paperId]: {
              ...(current.answers[paperId] ?? {}),
              [questionId]: optionIndex,
            },
          },
        };
      });
    },
    [],
  );

  const handleGrade = React.useCallback((paperId: string) => {
    setState((current) => ({
      ...current,
      graded: { ...current.graded, [paperId]: true },
    }));
  }, []);

  const handleReset = React.useCallback((paperId: string) => {
    setState((current) => ({
      answers: { ...current.answers, [paperId]: {} },
      graded: { ...current.graded, [paperId]: false },
    }));
  }, []);

  const activeGraded = activePaper ? !!state.graded[activePaper.id] : false;
  const activeAnswers = activePaper ? getPaperAnswers(activePaper.id) : {};
  const activeAnsweredCount = activePaper
    ? getPaperProgress(activePaper.id).done
    : 0;
  const activeAllAnswered = activePaper
    ? activeAnsweredCount === activePaper.questions.length
    : false;
  const activeScore = activePaper
    ? getPaperScore(activePaper.id)
    : { correct: 0, total: 0 };
  const wrongCount = activeScore.total - activeScore.correct;

  const renderMarkableText = React.useCallback(
    (targetId: string, text: string, className?: string) => {
      if (!getAnnotations) {
        return className ? <span className={className}>{text}</span> : text;
      }

      const content = (
        <MarkableText
          id={targetId}
          text={text}
          annotations={getAnnotations(targetId)}
        />
      );

      return className ? <span className={className}>{content}</span> : content;
    },
    [getAnnotations],
  );

  return (
    <div
      ref={rootRef}
      className={open ? "quizWidget quizWidgetOpen" : "quizWidget"}
    >
      <button
        type="button"
        className="quizTrigger"
        onClick={() => setOpen((current) => !current)}
      >
        <span className="quizTriggerIcon">
          <FileText size={16} />
        </span>
        <span className="quizTriggerLabel">{triggerLabel}</span>
        <span className="quizTriggerCount">{papers.length}</span>
      </button>

      {open ? (
        <div className="quizCard" role="dialog" aria-label="选择试卷">
          <div className="quizCardHeader">
            <div className="quizCardHeaderMain">
              <span className="quizCardTitle">{cardTitle}</span>
              <span className="quizCardSubtitle">{cardSubtitle}</span>
            </div>
            <button
              type="button"
              className="quizIconButton"
              onClick={() => setOpen(false)}
              aria-label="关闭"
            >
              <X size={16} />
            </button>
          </div>

          <div className="quizPaperList">
            {papers.map((paper) => {
              const progress = getPaperProgress(paper.id);
              const graded = !!state.graded[paper.id];
              const score = getPaperScore(paper.id);
              return (
                <button
                  key={paper.id}
                  type="button"
                  className="quizPaperItem"
                  onClick={() => {
                    setActivePaperId(paper.id);
                    setOpen(false);
                  }}
                >
                  <div className="quizPaperItemTop">
                    <span className="quizPaperItemTitle">{paper.title}</span>
                    <span className="quizPaperItemScope">{paper.scope}</span>
                  </div>
                  <p className="quizPaperItemDesc">{paper.description}</p>
                  <div className="quizPaperItemMeta">
                    <span className="quizPaperItemCount">
                      {paper.questions.length} 题
                    </span>
                    {graded ? (
                      <span className="quizPaperItemBadge quizPaperItemBadgeDone">
                        已批阅 {score.correct}/{score.total}
                      </span>
                    ) : progress.done > 0 ? (
                      <span className="quizPaperItemBadge">
                        已答 {progress.done}/{progress.total}
                      </span>
                    ) : (
                      <span className="quizPaperItemBadge quizPaperItemBadgeNew">
                        未开始
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <Drawer
        title={null}
        closable={false}
        placement="right"
        width={isMobile ? "96vw" : 560}
        styles={{
          wrapper: {
            width: isMobile ? "96vw" : 560,
            maxWidth: isMobile ? "96vw" : 560,
          },
          body: { padding: 0 },
        }}
        open={!!activePaper}
        onClose={() => setActivePaperId(null)}
      >
        {activePaper ? (
          <div className="quizDrawer">
            <div className="quizDrawerHeader">
              <div className="quizDrawerHeaderMain">
                <span className="quizDrawerScope">{activePaper.scope}</span>
                <h3 className="quizDrawerTitle">{activePaper.title}</h3>
                <p className="quizDrawerDesc">{activePaper.description}</p>
              </div>
              <button
                type="button"
                className="quizIconButton"
                onClick={() => setActivePaperId(null)}
                aria-label="关闭"
              >
                <X size={18} />
              </button>
            </div>

            {activeGraded ? (
              <div
                className={
                  wrongCount === 0
                    ? "quizResultBar quizResultBarPerfect"
                    : "quizResultBar"
                }
              >
                <div className="quizResultScore">
                  <span className="quizResultScoreNum">
                    {activeScore.correct}
                  </span>
                  <span className="quizResultScoreTotal">
                    / {activeScore.total}
                  </span>
                </div>
                <div className="quizResultText">
                  {wrongCount === 0
                    ? "全部答对，太棒了！"
                    : `答错 ${wrongCount} 题，红色为你的错误选项，绿色为正确答案。`}
                </div>
              </div>
            ) : (
              <div className="quizProgressBar">
                <div className="quizProgressText">
                  已作答 {activeAnsweredCount} / {activePaper.questions.length}
                </div>
                <div className="quizProgressTrack">
                  <div
                    className="quizProgressFill"
                    style={{
                      width: `${
                        (activeAnsweredCount / activePaper.questions.length) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            )}

            <div className="quizQuestionList">
              {activePaper.questions.map((question, index) => {
                const selected = activeAnswers[question.id];
                const isWrong =
                  activeGraded &&
                  selected !== undefined &&
                  selected !== question.answer;
                const isUnanswered = activeGraded && selected === undefined;
                return (
                  <div
                    key={question.id}
                    className={
                      isWrong || isUnanswered
                        ? "quizQuestion quizQuestionWrong"
                        : "quizQuestion"
                    }
                  >
                    <div className="quizQuestionStem">
                      <span className="quizQuestionIndex">{index + 1}</span>
                      {renderMarkableText(
                        `${pageKey}-${activePaper.id}-${question.id}-stem`,
                        question.stem,
                        "quizQuestionText",
                      )}
                    </div>
                    <div className="quizOptionList">
                      {question.options.map((option, optionIndex) => {
                        const isSelected = selected === optionIndex;
                        const isAnswer = optionIndex === question.answer;
                        let stateClass = "";
                        if (activeGraded) {
                          if (isAnswer) stateClass = " quizOptionCorrect";
                          else if (isSelected) stateClass = " quizOptionWrong";
                        } else if (isSelected) {
                          stateClass = " quizOptionSelected";
                        }
                        return (
                          <button
                            key={optionIndex}
                            type="button"
                            className={`quizOption${stateClass}`}
                            disabled={activeGraded}
                            onClick={() =>
                              handleSelectOption(
                                activePaper.id,
                                question.id,
                                optionIndex,
                              )
                            }
                          >
                            <span className="quizOptionMark">
                              {String.fromCharCode(65 + optionIndex)}
                            </span>
                            {renderMarkableText(
                              `${pageKey}-${activePaper.id}-${question.id}-option-${optionIndex}`,
                              option,
                              "quizOptionText",
                            )}
                            {activeGraded && isAnswer ? (
                              <CheckCircle2
                                size={16}
                                className="quizOptionStatusIcon quizOptionStatusCorrect"
                              />
                            ) : null}
                            {activeGraded && isSelected && !isAnswer ? (
                              <XCircle
                                size={16}
                                className="quizOptionStatusIcon quizOptionStatusWrong"
                              />
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                    {activeGraded ? (
                      <div className="quizExplanation">
                        <span className="quizExplanationLabel">解析</span>
                        {renderMarkableText(
                          `${pageKey}-${activePaper.id}-${question.id}-explanation`,
                          question.explanation,
                        )}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>

            <div className="quizDrawerFooter">
              {activeGraded ? (
                <button
                  type="button"
                  className="quizFooterButton quizFooterButtonGhost"
                  onClick={() => handleReset(activePaper.id)}
                >
                  <RotateCcw size={15} />
                  重做本卷
                </button>
              ) : (
                <span className="quizFooterHint">
                  {activeAllAnswered
                    ? "已全部作答，可以批阅了"
                    : `还有 ${
                        activePaper.questions.length - activeAnsweredCount
                      } 题未作答`}
                </span>
              )}
              {!activeGraded ? (
                <button
                  type="button"
                  className="quizFooterButton quizFooterButtonPrimary"
                  disabled={activeAnsweredCount === 0}
                  onClick={() => handleGrade(activePaper.id)}
                >
                  <ClipboardCheck size={15} />
                  批阅试卷
                </button>
              ) : (
                <button
                  type="button"
                  className="quizFooterButton quizFooterButtonPrimary"
                  onClick={() => setActivePaperId(null)}
                >
                  <Check size={15} />
                  完成
                </button>
              )}
            </div>
          </div>
        ) : null}
      </Drawer>
    </div>
  );
}
