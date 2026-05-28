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
import {
  StudyCelebration,
  useStudyCelebration,
} from "@/components/StudyCelebration";
import { useStudyProgress } from "@/components/StudyProgress";
import {
  AnnotationToolbar,
  MarkableText,
  useStudyAnnotations,
} from "@/components/StudyAnnotations";
import { useStableAnchorScroll } from "@/hooks/useStableAnchorScroll";
import { encouragementQuotes } from "@/data/encouragementQuotes";
import type { GrammarTopic } from "@/data/grammarTopics";
import { remainingKnowledgeTopics } from "@/data/remainingKnowledgeTopics";
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

const remainingLearningStages = [
  {
    id: "remaining-stage-sound-spelling",
    title: "第一阶段：语音听辨和拼写底层",
    description:
      "先听出音素，再把声音和拼写、大小写、标点连起来，最后进入整句重音、节奏和连读。",
    topicIds: [
      "phonemic-awareness",
      "spelling-system",
      "punctuation-mechanics",
      "pronunciation-prosody",
    ],
  },
  {
    id: "remaining-stage-vocabulary-word-formation",
    title: "第二阶段：词汇网络和词法",
    description:
      "先建立高频词、主题词和工具书习惯，再学习词根词缀、搭配、语域和习语。",
    topicIds: [
      "vocabulary-system",
      "reference-tools",
      "morphology",
      "vocabulary-depth",
    ],
  },
  {
    id: "remaining-stage-reading",
    title: "第三阶段：阅读策略和文本理解",
    description:
      "先保证读得准、读得顺，再学习略读、扫读、精读、主旨细节、文章结构和非虚构阅读。",
    topicIds: [
      "reading-foundations",
      "reading-strategies",
      "reading-comprehension",
      "text-structures",
      "nonfiction-reading",
    ],
  },
  {
    id: "remaining-stage-writing",
    title: "第四阶段：写作表达系统",
    description:
      "先写正确句子和清楚段落，再学构思修改、不同体裁、篇章组织、语篇衔接和论证说服。",
    topicIds: [
      "writing-sentences",
      "paragraph-writing",
      "writing-process",
      "writing-genres",
      "discourse-cohesion",
      "essay-writing",
      "argument-rhetoric",
    ],
  },
  {
    id: "remaining-stage-speaking-listening",
    title: "第五阶段：听说交流和展示",
    description: "听懂不同材料，能对话、接话、自我修正，并完成有组织的展示。",
    topicIds: [
      "listening-text-types",
      "speaking-listening",
      "oral-fluency",
      "presentation-skills",
    ],
  },
  {
    id: "remaining-stage-real-communication",
    title: "第六阶段：真实语境和跨文化表达",
    description:
      "先理解词义、句义和上下文，再学习不同场景怎么说、怎么保持礼貌并避免文化误解。",
    topicIds: ["semantics", "pragmatics", "cross-cultural-communication"],
  },
  {
    id: "remaining-stage-literature",
    title: "第七阶段：文学、修辞、诗歌和戏剧",
    description: "在通用读写听说稳定后，进一步理解故事、主题、修辞和体裁表达。",
    topicIds: ["literature", "figurative-language", "poetry-drama-genre"],
  },
  {
    id: "remaining-stage-academic-digital",
    title: "第八阶段：学术研究和数字素养",
    description: "进入正式表达、学科英语、资料研究、信息判断和多模态阅读。",
    topicIds: [
      "academic-english",
      "academic-data-language",
      "research-literacy",
      "media-digital-literacy",
    ],
  },
  {
    id: "remaining-stage-study-strategies",
    title: "第九阶段：考试策略和复盘能力",
    description: "用审题、定位、排除、错题归因和复盘计划稳定发挥语言能力。",
    topicIds: ["test-study-strategies"],
  },
];

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
    width: index === 0 ? 180 : undefined,
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
  number,
  getAnnotations,
  mastered,
  onToggleMastered,
}: {
  topic: GrammarTopic;
  number: string;
  getAnnotations: GetAnnotations;
  mastered: boolean;
  onToggleMastered: () => void;
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
              <span className="topicIndex">{number}</span>
              <span>{topic.title}</span>
              <Tag color={levelColor[topic.level]}>{topic.level}</Tag>
              <Tag className="categoryTag">{topic.category}</Tag>
            </Space>
          }
          extra={
            <Button
              size="small"
              type={mastered ? "primary" : "default"}
              onClick={onToggleMastered}
            >
              {mastered ? "已掌握" : "掌握"}
            </Button>
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

export default function RemainingKnowledgePage() {
  const annotations = useStudyAnnotations("remaining");
  const progress = useStudyProgress("remaining");
  const celebration = useStudyCelebration();
  const handleAnchorClick = useStableAnchorScroll();
  const encouragement = React.useMemo(
    () =>
      encouragementQuotes[
        Math.floor(Math.random() * encouragementQuotes.length)
      ],
    [],
  );
  const stagedTopics = React.useMemo(() => {
    const topicMap = new Map(
      remainingKnowledgeTopics.map((topic) => [topic.id, topic]),
    );
    const usedTopicIds = new Set<string>();
    const stages = remainingLearningStages
      .map((stage) => {
        const topics = stage.topicIds
          .map((id) => topicMap.get(id))
          .filter((topic): topic is GrammarTopic => Boolean(topic));
        topics.forEach((topic) => usedTopicIds.add(topic.id));
        return { ...stage, topics };
      })
      .filter((stage) => stage.topics.length > 0);

    const extraTopics = remainingKnowledgeTopics.filter(
      (topic) => !usedTopicIds.has(topic.id),
    );
    if (extraTopics.length > 0) {
      stages.push({
        id: "remaining-stage-extra",
        title: "补充阶段：综合能力补充",
        description: "保留未归入主线的补充能力，确保知识点不遗漏。",
        topicIds: extraTopics.map((topic) => topic.id),
        topics: extraTopics,
      });
    }

    return stages;
  }, []);
  const orderedTopics = React.useMemo(
    () => stagedTopics.flatMap((stage) => stage.topics),
    [stagedTopics],
  );
  const masteredCount = orderedTopics.filter((topic) =>
    progress.isMastered(topic.id),
  ).length;
  const masteryPercent =
    orderedTopics.length > 0
      ? Math.round((masteredCount / orderedTopics.length) * 100)
      : 0;
  const handleToggleTopicMastered = (topic: GrammarTopic) => {
    const alreadyMastered = progress.isMastered(topic.id);
    progress.toggleMastered(topic.id);
    if (!alreadyMastered) {
      celebration.celebrate(
        topic.title,
        masteredCount + 1,
        orderedTopics.length,
      );
    }
  };
  const anchorItems = stagedTopics.map((stage, stageIndex) => {
    const allMastered = stage.topics.every((topic) =>
      progress.isMastered(topic.id),
    );
    return {
      key: stage.id,
      href: `#${stage.id}`,
      title: tocTitle(
        `${stageIndex + 1}. ${stage.title.replace(/^第.+?阶段：/, "")}`,
        allMastered,
      ),
      children: stage.topics.map((topic, topicIndex) => ({
        key: topic.id,
        href: `#${topic.id}`,
        title: tocTitle(
          `${stageIndex + 1}.${topicIndex + 1} ${topic.title}`,
          progress.isMastered(topic.id),
        ),
      })),
    };
  });

  return (
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
              <Text strong>剩余知识点目录</Text>
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
                已掌握 {masteredCount} / {orderedTopics.length}
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
              <span>完整英语能力 · Grammar 之外</span>
            </div>
            <Title className="heroTitle">英语剩余知识点系统</Title>
            <Paragraph className="heroText">
              <MarkableText
                id="remaining-hero-text"
                text="本课程系统补齐语法之外的完整英语能力：语音听辨、拼写书写、发音韵律、词汇网络、词法构词、阅读策略、写作表达、听说交流、语义语用、跨文化交际、文学修辞、学术英语、研究能力、考试策略和数字素养。它不是重复语法，而是把英语从“会做题”提升到“会阅读、会表达、会交流、会研究”的综合能力系统。"
                annotations={annotations.getAnnotations("remaining-hero-text")}
              />
            </Paragraph>
            <div className="heroStats">
              <div>
                <strong>{orderedTopics.length}</strong>
                <span>知识点</span>
              </div>
              <div>
                <strong>{masteryPercent}%</strong>
                <span>掌握进度</span>
              </div>
              <div>
                <strong>系统</strong>
                <span>综合能力</span>
              </div>
            </div>
          </header>

          <div className="routeCard">
            <BookOpen size={20} />
            <span>
              <MarkableText
                id="remaining-route"
                text="学习路线：建议先完成《自然拼读系统知识库》和《英语语法知识库》再学习本页。先用音素听辨、拼写和书写规范打底，再建立词汇网络、工具书习惯和词法构词能力；接着进入阅读策略、写作表达、听说展示和真实语境沟通；在通用能力稳定后再做文学修辞体裁；最后提升到学术研究、数字素养、考试策略和复盘能力。全部掌握后，你会不只是“懂语法”，而是能更自信地读英文材料、写清楚观点、听懂真实表达、开口沟通，并逐步具备用英语学习新知识的能力。"
                annotations={annotations.getAnnotations("remaining-route")}
              />
            </span>
          </div>

          {stagedTopics.map((stage, stageIndex) => (
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
              {stage.topics.map((topic, topicIndex) => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  number={`${stageIndex + 1}.${topicIndex + 1}`}
                  getAnnotations={annotations.getAnnotations}
                  mastered={progress.isMastered(topic.id)}
                  onToggleMastered={() => handleToggleTopicMastered(topic)}
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

        <aside className="sideActionRail" aria-label="返回语法入口">
          <Button
            className="sideActionButton"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            返回语法知识库
          </Button>
          <Button
            className="sideActionButton"
            onClick={() => {
              window.location.href = "/phonics";
            }}
          >
            查看自然拼读系统知识库
          </Button>
        </aside>

        <AnnotationToolbar
          selection={annotations.selection}
          applyAnnotation={annotations.applyAnnotation}
          clearSelection={annotations.clearSelection}
          clearAll={annotations.clearAll}
        />
        <StudyCelebration celebration={celebration.celebration} />
        <FloatButton.BackTop />
      </Layout>
    </ConfigProvider>
  );
}
