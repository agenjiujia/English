import React from "react";
import "antd/dist/reset.css";
import {
  Alert,
  Anchor,
  Button,
  Card,
  ConfigProvider,
  FloatButton,
  Layout,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { BookOpen, GraduationCap, MapPinned } from "lucide-react";
import { LazyMount } from "@/components/LazyMount";
import { HotTopicsPanel } from "@/components/HotTopicsPanel";
import { StudyCountTag } from "@/components/StudyCountTag";
import {
  StudyCelebration,
  useStudyCelebration,
} from "@/components/StudyCelebration";
import { DoubaoChatWidget } from "@/components/DoubaoChatWidget";
import { useStudyProgress } from "@/components/StudyProgress";
import {
  AnnotationToolbar,
  MarkableText,
  StudyAnnotationsProvider,
  useStudyAnnotations,
} from "@/components/StudyAnnotations";
import {
  buildAnnotationNoteCountMap,
  scrollToElementById,
} from "@/components/hotTopicsUtils";
import { useStableAnchorScroll } from "@/hooks/useStableAnchorScroll";
import { encouragementQuotes } from "@/data/encouragementQuotes";
import { basicWordTopics } from "@/data/basicWordTopics";
import { grammarTopics, type GrammarTopic } from "@/data/grammarTopics";
import "./index.less";

const { Sider, Content } = Layout;
const { Title, Paragraph, Text } = Typography;

interface TopicRow {
  key: string;
  [key: string]: string;
}

const levelColor: Record<GrammarTopic["level"], string> = {
  基础: "green",
  进阶: "blue",
  易错: "volcano",
};

const learningStages = [
  {
    id: "stage-basic-words",
    title: "第一阶段：入门词汇和语法符号",
    description:
      "先看懂 do/doing/done/to do 等语法符号，再掌握造句最常用的小词、功能词和生活主题词。",
    topicIds: [
      "parts-of-speech-overview",
      "grammar-symbols",
      "basic-pronouns",
      "basic-be-do-have",
      "basic-common-verbs",
      "basic-adjectives",
      "basic-adverbs",
      "basic-articles-determiners",
      "basic-question-words",
      "basic-prepositions",
      "basic-conjunctions",
      "basic-modal-words",
      "basic-numbers",
      "basic-time-words",
      "basic-week-months",
      "basic-family-words",
      "basic-body-words",
      "basic-food-words",
      "basic-animal-words",
      "basic-school-words",
      "basic-clothes-words",
      "basic-color-words",
      "basic-place-words",
      "basic-weather-words",
      "basic-transport-words",
    ],
  },
  {
    id: "stage-sentence-frame",
    title: "第二阶段：句子骨架",
    description:
      "从主语、谓语、宾语、表语到五大基本句型，先学会拆句子，再学会造句子。",
    topicIds: [
      "sentence-elements",
      "phrase-types",
      "basic-patterns",
      "word-order",
      "sentence-types",
      "short-answers",
      "question-transform",
    ],
  },
  {
    id: "stage-basic-verbs",
    title: "第三阶段：基础动词和助动词",
    description:
      "学会 be、do、have、第三人称单数、主谓一致和情态表达，解决最常见造句错误。",
    topicIds: [
      "am-is-are",
      "was-were",
      "do-does",
      "did-didnt",
      "go-goes",
      "like-likes",
      "have-has",
      "third-person-singular",
      "subject-verb-agreement",
      "can-cant",
      "must-should",
      "may-might",
      "could-would",
      "modal-have-to-need",
    ],
  },
  {
    id: "stage-tenses",
    title: "第四阶段：时态主线",
    description:
      "按现在、过去、将来、进行、完成的顺序建立时间表达系统，先会说清动作发生在什么时候。",
    topicIds: [
      "present-simple",
      "present-continuous",
      "past-simple",
      "future-simple",
      "past-continuous",
      "present-perfect",
      "past-perfect",
      "perfect-continuous-tenses",
      "present-perfect-vs-past-simple",
      "future-continuous-perfect",
      "tense-sequence",
    ],
  },
  {
    id: "stage-parts-of-speech",
    title: "第五阶段：词类系统",
    description:
      "系统掌握名词、冠词、限定词、代词、形容词、副词、介词和连词，让每个词在句子里各就各位。",
    topicIds: [
      "nouns-plural",
      "countable-uncountable",
      "noun-possessive",
      "articles",
      "articles-special",
      "some-any",
      "many-much-few-little",
      "each-every-all-both",
      "other-another",
      "more-quantifiers",
      "pronouns-subject-object",
      "possessives",
      "reflexive-pronouns",
      "this-that",
      "adjective-position",
      "adjective-order",
      "adverbs",
      "frequency-adverbs",
      "comparative-superlative",
      "irregular-comparisons",
      "as-as-too-enough",
      "prepositions-time",
      "prepositions-place",
      "prepositions-direction",
      "prepositions-purpose",
      "conjunctions",
    ],
  },
  {
    id: "stage-basic-sentences",
    title: "第六阶段：基础表达句型",
    description:
      "学习存在句、疑问词、祈使句、感叹句和常用功能句，能问、能答、能提出请求和建议。",
    topicIds: [
      "there-be",
      "what-who-which",
      "whose",
      "where-when-why-how",
      "how-many-much",
      "more-how-questions",
      "imperative",
      "exclamations",
      "common-functions",
    ],
  },
  {
    id: "stage-sentence-expansion",
    title: "第七阶段：句子扩展成分",
    description:
      "学会用短语、定语、状语、补语和同位语把简单句扩展成信息更完整的句子。",
    topicIds: ["attributes", "adverbials", "complements", "appositives"],
  },
  {
    id: "stage-clauses",
    title: "第八阶段：从句系统",
    description:
      "先理解从句在大句中充当什么成分，再学习状语从句、定语从句和名词性从句。",
    topicIds: [
      "clause-overview",
      "time-clauses",
      "reason-purpose-result",
      "conditionals",
      "conditionals-advanced",
      "relative-clause",
      "relative-adverbs",
      "relative-clause-advanced",
      "noun-clause-overview",
      "object-clause",
      "subject-clause",
      "predicative-clause",
      "appositive-clause",
    ],
  },
  {
    id: "stage-verb-advanced",
    title: "第九阶段：动词进阶",
    description:
      "学习不规则动词、动词短语、非谓语、分词、使役动词和感官动词，解决复杂动词结构。",
    topicIds: [
      "regular-irregular-verbs",
      "nonfinite-overview",
      "infinitive-gerund",
      "participles",
      "causative-sensory-verbs",
      "phrasal-verbs",
    ],
  },
  {
    id: "stage-advanced-grammar",
    title: "第十阶段：高级结构和写作规范",
    description:
      "学习被动、引语、反意疑问、虚拟语气、倒装、强调、省略、标点和常见句子错误，进入专业表达。",
    topicIds: [
      "active-vs-passive",
      "passive-voice",
      "passive-voice-advanced",
      "reported-speech",
      "tag-questions",
      "modal-perfect",
      "subjunctive-mood",
      "inversion",
      "emphasis",
      "ellipsis",
      "punctuation-capitalization",
      "common-sentence-errors",
    ],
  },
];

const learningOrder = learningStages.flatMap((stage) => stage.topicIds);

function orderTopics(topics: GrammarTopic[]) {
  const topicMap = new Map(topics.map((topic) => [topic.id, topic]));
  const ordered = learningOrder
    .map((id) => topicMap.get(id))
    .filter((topic): topic is GrammarTopic => Boolean(topic));
  const orderedIds = new Set(ordered.map((topic) => topic.id));
  return [...ordered, ...topics.filter((topic) => !orderedIds.has(topic.id))];
}

type GetAnnotations = ReturnType<typeof useStudyAnnotations>["getAnnotations"];

function tocTitle(text: string, mastered: boolean) {
  return (
    <span className={mastered ? "tocTitle tocTitleMastered" : "tocTitle"}>
      {text}
    </span>
  );
}

function buildColumns(
  topic: GrammarTopic,
  getAnnotations: GetAnnotations,
): ColumnsType<TopicRow> {
  return topic.columns.map((column, index) => ({
    title: column,
    dataIndex: `col${index}`,
    key: `col${index}`,
    width: index === 0 ? 160 : undefined,
    render: (value: string, record) => (
      <span className="cellText">
        <MarkableText
          id={`${record.key}-col${index}`}
          text={value}
          annotations={getAnnotations(`${record.key}-col${index}`)}
        />
      </span>
    ),
  }));
}

function buildRows(topic: GrammarTopic): TopicRow[] {
  return topic.rows.map((row, rowIndex) => {
    const record: TopicRow = { key: `${topic.id}-${rowIndex}` };
    topic.columns.forEach((_, columnIndex) => {
      record[`col${columnIndex}`] = row[columnIndex] || "";
    });
    return record;
  });
}

function TopicCard({
  topic,
  index,
  getAnnotations,
  mastered,
  studyCount,
  onToggleMastered,
  onIncrementStudyCount,
  onDecrementStudyCount,
  onSetStudyCount,
}: {
  topic: GrammarTopic;
  index: number;
  getAnnotations: GetAnnotations;
  mastered: boolean;
  studyCount: number;
  onToggleMastered: () => void;
  onIncrementStudyCount: () => void;
  onDecrementStudyCount: () => void;
  onSetStudyCount: (count: number) => void;
}) {
  return (
    <section id={topic.id} className="topicSection">
      <LazyMount
        placeholderHeight={Math.min(620, 220 + topic.rows.length * 54)}
      >
        <Card
          className={mastered ? "topicCard topicCardMastered" : "topicCard"}
          title={
            <Space align="center" wrap>
              <span className="topicIndex">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{topic.title}</span>
              <Tag color={levelColor[topic.level]}>{topic.level}</Tag>
              <Tag className="categoryTag">{topic.category}</Tag>
            </Space>
          }
          extra={
            <Space size={8} wrap>
              <StudyCountTag
                count={studyCount}
                onIncrement={onIncrementStudyCount}
                onDecrement={onDecrementStudyCount}
                onChange={onSetStudyCount}
              />
              <Button
                size="small"
                type={mastered ? "primary" : "default"}
                onClick={onToggleMastered}
              >
                {mastered ? "已掌握" : "掌握"}
              </Button>
            </Space>
          }
        >
          <Paragraph className="summary">
            <MarkableText
              id={`${topic.id}-summary`}
              text={topic.summary}
              annotations={getAnnotations(`${topic.id}-summary`)}
            />
          </Paragraph>
          <Table<TopicRow>
            className="knowledgeTable"
            columns={buildColumns(topic, getAnnotations)}
            dataSource={buildRows(topic)}
            pagination={false}
            size="middle"
            bordered
            scroll={{ x: "max-content" }}
          />
          <Alert
            className="tips"
            type={topic.level === "易错" ? "warning" : "info"}
            showIcon
            message="学习提醒"
            description={
              <ul>
                {topic.tips.map((tip, tipIndex) => (
                  <li key={tip}>
                    <MarkableText
                      id={`${topic.id}-tip-${tipIndex}`}
                      text={tip}
                      annotations={getAnnotations(
                        `${topic.id}-tip-${tipIndex}`,
                      )}
                    />
                  </li>
                ))}
              </ul>
            }
          />
        </Card>
      </LazyMount>
    </section>
  );
}

export default function GrammarHome() {
  const goToRoute = React.useCallback((path: string) => {
    window.location.hash = path;
  }, []);
  const annotations = useStudyAnnotations("grammar");
  const progress = useStudyProgress("grammar");
  const celebration = useStudyCelebration();
  const handleAnchorClick = useStableAnchorScroll();
  const allTopics = orderTopics([...grammarTopics, ...basicWordTopics]);
  const encouragement = React.useMemo(
    () =>
      encouragementQuotes[
        Math.floor(Math.random() * encouragementQuotes.length)
      ],
    [],
  );
  const topicById = new Map(allTopics.map((topic) => [topic.id, topic]));
  const topicIndexById = new Map(
    allTopics.map((topic, index) => [topic.id, index]),
  );
  const noteCountByTopicId = React.useMemo(
    () =>
      buildAnnotationNoteCountMap(
        allTopics.map((topic) => topic.id),
        annotations.annotations,
      ),
    [allTopics, annotations.annotations],
  );
  const hotTopicItems = React.useMemo(
    () =>
      allTopics.map((topic, index) => ({
        id: topic.id,
        title: topic.title,
        category: topic.category,
        studyCount: progress.getStudyCount(topic.id),
        noteCount: noteCountByTopicId[topic.id] || 0,
        mastered: progress.isMastered(topic.id),
        order: index,
        onOpen: () => scrollToElementById(topic.id),
      })),
    [allTopics, noteCountByTopicId, progress, progress.masteredIds, progress.studyCounts],
  );
  const masteredCount = allTopics.filter((topic) =>
    progress.isMastered(topic.id),
  ).length;
  const masteryPercent =
    allTopics.length > 0
      ? Math.round((masteredCount / allTopics.length) * 100)
      : 0;
  const handleToggleTopicMastered = (topic: GrammarTopic) => {
    const alreadyMastered = progress.isMastered(topic.id);
    progress.toggleMastered(topic.id);
    if (!alreadyMastered) {
      celebration.celebrate(topic.title, masteredCount + 1, allTopics.length);
    }
  };
  const anchorItems = learningStages.map((stage, stageIndex) => {
    const children = stage.topicIds
      .map(
        (
          topicId,
        ): { key: string; href: string; title: React.ReactNode } | null => {
          const topic = topicById.get(topicId);
          const topicIndex = topicIndexById.get(topicId);
          if (!topic || topicIndex === undefined) return null;
          return {
            key: topic.id,
            href: `#${topic.id}`,
            title: tocTitle(
              `${String(topicIndex + 1).padStart(2, "0")} · ${topic.title}`,
              progress.isMastered(topic.id),
            ),
          };
        },
      )
      .filter(
        (item): item is { key: string; href: string; title: React.ReactNode } =>
          Boolean(item),
      );

    return {
      key: stage.id,
      href: `#${stage.id}`,
      title: `${stageIndex + 1}. ${stage.title.replace(/^第.+?阶段：/, "")}`,
      children,
    };
  });

  return (
    <StudyAnnotationsProvider
      updateNote={annotations.updateNote}
      deleteNote={annotations.deleteNote}
    >
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#2f8f83",
            borderRadius: 14,
            fontFamily:
              '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", system-ui, sans-serif',
          },
          components: {
            Card: {
              headerBg: "#fffaf0",
            },
            Table: {
              headerBg: "#f6efe0",
              rowHoverBg: "#fff9eb",
            },
          },
        }}
      >
        <Layout className="pageShell">
          <Sider width={292} className="leftRail">
            <div className="tocPanel">
              <div className="tocHead">
                <MapPinned size={18} />
                <Text strong>知识点目录</Text>
              </div>
              <div className="tocProgress">
                <div className="tocProgressMeta">
                  <span>掌握进度</span>
                  <strong>{masteryPercent}%</strong>
                </div>
                <div className="tocProgressTrack">
                  <div
                    className="tocProgressBar"
                    style={{ width: `${masteryPercent}%` }}
                  />
                </div>
                <div className="tocProgressCount">
                  已掌握 {masteredCount} / {allTopics.length}
                </div>
              </div>
              <div className="tocScroll">
                <Anchor
                  affix={false}
                  offsetTop={24}
                  items={anchorItems}
                  className="tocAnchor"
                  onClick={handleAnchorClick}
                />
              </div>
            </div>
          </Sider>

          <Content className="content">
            <header className="hero">
              <div className="heroBadge">
                <GraduationCap size={18} />
                <span>系统学习路线 · 自然拼读之后</span>
              </div>
              <Title className="heroTitle">英语语法知识库</Title>
              <Paragraph className="heroText">
                <MarkableText
                  id="grammar-hero-text"
                  text="本课程按可持续自学顺序组织语法：先看懂语法符号和基础词汇，再建立句子成分、五大基本句型、be/do/have、助动词、情态动词和时态主线；随后系统学习名词、冠词、代词、形容词、副词、介词、连词、从句、非谓语、被动语态、虚拟语气、倒装强调和写作规范。每个知识点都配规则、例句与易错提醒，目标是让你能拆句、造句、改错并稳定输出。"
                  annotations={annotations.getAnnotations("grammar-hero-text")}
                />
              </Paragraph>
              <div className="heroStats">
                <div>
                  <strong>{allTopics.length}</strong>
                  <span>知识点</span>
                </div>
                <div>
                  <strong>{masteryPercent}%</strong>
                  <span>掌握进度</span>
                </div>
                <div>
                  <strong>系统</strong>
                  <span>循序渐进</span>
                </div>
              </div>
            </header>

            <div className="routeCard">
              <BookOpen size={20} />
              <span>
                <MarkableText
                  id="grammar-route"
                  text="学习路线：建议先完成《自然拼读系统知识库》，再进入本页。第一步看懂 do/doing/done/to do 等符号和高频小词；第二步建立主谓宾表、短语和五大基本句型；第三步掌握 be/do/have、主谓一致、情态动词和时态主线；第四步系统补齐名词、冠词、代词、形容词、副词、介词、连词等词类；第五步用定语、状语、补语、同位语、从句和非谓语扩展句子；最后进入被动、引语、虚拟语气、倒装强调和写作规范。学完后再进入《英语剩余知识点系统》做综合能力提升。"
                  annotations={annotations.getAnnotations("grammar-route")}
                />
              </span>
            </div>

            {learningStages.map((stage, stageIndex) => (
              <section key={stage.id} id={stage.id} className="stageSection">
                <Card className="stageCard">
                  <div className="stageNumber">
                    阶段 {String(stageIndex + 1).padStart(2, "0")}
                  </div>
                  <Title level={2} className="stageTitle">
                    {stage.title}
                  </Title>
                  <Paragraph className="stageDescription">
                    {stage.description}
                  </Paragraph>
                </Card>
                {stage.topicIds
                  .map((topicId) => topicById.get(topicId))
                  .filter((topic): topic is GrammarTopic => Boolean(topic))
                  .map((topic) => (
                    <TopicCard
                      key={topic.id}
                      topic={topic}
                      index={topicIndexById.get(topic.id) ?? 0}
                      getAnnotations={annotations.getAnnotations}
                      mastered={progress.isMastered(topic.id)}
                      studyCount={progress.getStudyCount(topic.id)}
                      onToggleMastered={() => handleToggleTopicMastered(topic)}
                      onIncrementStudyCount={() =>
                        progress.incrementStudyCount(topic.id)
                      }
                      onDecrementStudyCount={() =>
                        progress.decrementStudyCount(topic.id)
                      }
                      onSetStudyCount={(count) =>
                        progress.setStudyCount(topic.id, count)
                      }
                    />
                  ))}
              </section>
            ))}
          </Content>

          <aside className="encouragementRail" aria-label="学习鼓励语">
            <div className="encouragementCard">
              <div className="encouragementText">
                {[...encouragement].map((char, index) => (
                  <span
                    key={`${char}-${index}`}
                    className="encouragementChar"
                    style={
                      {
                        "--char-index": index,
                      } as React.CSSProperties
                    }
                  >
                    {char}
                  </span>
                ))}
              </div>
            </div>
          </aside>

          <aside className="sideActionRail" aria-label="扩展学习入口">
            <Button
              type="primary"
              className="sideActionButton"
              onClick={() => {
                goToRoute("/remaining");
              }}
            >
              查看剩余英语能力知识点
            </Button>
            <Button
              type="primary"
              className="sideActionButton"
              onClick={() => {
                goToRoute("/phonics");
              }}
            >
              查看自然拼读系统知识库
            </Button>
          </aside>

          <AnnotationToolbar
            selection={annotations.selection}
            applyAnnotation={annotations.applyAnnotation}
            applyAnnotationAtSelection={annotations.applyAnnotationAtSelection}
            clearSelection={annotations.clearSelection}
            clearAll={annotations.clearAll}
          />
          <StudyCelebration celebration={celebration.celebration} />
          <HotTopicsPanel pageKey="grammar" items={hotTopicItems} />
          <DoubaoChatWidget />
          <FloatButton.BackTop />
        </Layout>
      </ConfigProvider>
    </StudyAnnotationsProvider>
  );
}
