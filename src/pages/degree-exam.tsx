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
import { QuizPanel } from "@/components/QuizPanel";
import { degreeExamQuizPapers } from "@/data/degreeExamQuizPapers";
import { StudyCountTag } from "@/components/StudyCountTag";
import {
  StudyCelebration,
  useStudyCelebration,
} from "@/components/StudyCelebration";
import { DoubaoChatWidget } from "@/components/DoubaoChatWidget";
import { DataBackupWidget } from "@/components/DataBackupWidget";
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
import type { GrammarTopic } from "@/data/grammarTopics";
import {
  degreeExamPracticeTopics,
  degreeExamVocabTopics,
} from "@/data/degreeExamTopics";
import { degreeExamVocabWordTopics } from "@/data/degreeExamVocabWordTopics";
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

const degreeExamStages = [
  {
    id: "degree-stage-vocab",
    title: "第二块：高频词与固定搭配",
    description:
      "每天 20–30 个 3500 高频词滚动复习；重点攻克动词短语、介词 to 陷阱、make/do/take 搭配和近义辨析——完形和单选 70% 的词汇分在这里。",
    topics: degreeExamVocabTopics,
  },
  {
    id: "degree-stage-wordlist",
    title: "第二块续：3500 高频词分组词表",
    description:
      "按 Unit 1 起每天 30 词背诵，117 个 Unit 覆盖 3500+ 高频词。每词含释义和例句/搭配，背完一组在目录标「掌握」。",
    topics: degreeExamVocabWordTopics,
  },
  {
    id: "degree-stage-practice",
    title: "第三块：真题专项与写作模板",
    description:
      "语法刷非谓语、定语从句、时态；阅读每天 2 篇练定位；作文背书信和议论文模板，把定语从句、分词定语写进卷面。",
    topics: degreeExamPracticeTopics,
  },
];

const allDegreeExamTopics = [
  ...degreeExamVocabTopics,
  ...degreeExamVocabWordTopics,
  ...degreeExamPracticeTopics,
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
  number,
  getAnnotations,
  mastered,
  studyCount,
  onToggleMastered,
  onIncrementStudyCount,
  onDecrementStudyCount,
  onSetStudyCount,
}: {
  topic: GrammarTopic;
  number: string;
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
              <span className="topicIndex">{number}</span>
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
            message="考试提醒"
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

export default function DegreeExamPage() {
  const goToRoute = React.useCallback((path: string) => {
    window.location.hash = path;
  }, []);
  const annotations = useStudyAnnotations("degree-exam");
  const progress = useStudyProgress("degree-exam");
  const celebration = useStudyCelebration();
  const handleAnchorClick = useStableAnchorScroll();
  const encouragement = React.useMemo(
    () =>
      encouragementQuotes[
        Math.floor(Math.random() * encouragementQuotes.length)
      ],
    [],
  );
  const noteCountByTopicId = React.useMemo(
    () =>
      buildAnnotationNoteCountMap(
        allDegreeExamTopics.map((topic) => topic.id),
        annotations.annotations,
      ),
    [annotations.annotations],
  );
  const hotTopicItems = React.useMemo(
    () =>
      allDegreeExamTopics.map((topic, index) => ({
        id: topic.id,
        title: topic.title,
        category: topic.category,
        studyCount: progress.getStudyCount(topic.id),
        noteCount: noteCountByTopicId[topic.id] || 0,
        mastered: progress.isMastered(topic.id),
        order: index,
        onOpen: () => scrollToElementById(topic.id),
      })),
    [
      noteCountByTopicId,
      progress,
      progress.masteredIds,
      progress.studyCounts,
    ],
  );
  const masteredCount = allDegreeExamTopics.filter((topic) =>
    progress.isMastered(topic.id),
  ).length;
  const masteryPercent =
    allDegreeExamTopics.length > 0
      ? Math.round((masteredCount / allDegreeExamTopics.length) * 100)
      : 0;
  const handleToggleTopicMastered = (topic: GrammarTopic) => {
    const alreadyMastered = progress.isMastered(topic.id);
    progress.toggleMastered(topic.id);
    if (!alreadyMastered) {
      celebration.celebrate(
        topic.title,
        masteredCount + 1,
        allDegreeExamTopics.length,
      );
    }
  };
  const anchorItems = degreeExamStages.map((stage, stageIndex) => {
    const topicOffset = degreeExamStages
      .slice(0, stageIndex)
      .reduce((sum, item) => sum + item.topics.length, 0);
    const blockNumber = stageIndex <= 1 ? 2 : 3;
    return {
      key: stage.id,
      href: `#${stage.id}`,
      title: stage.title.replace(/^第.+?块(续)?：/, ""),
      children: stage.topics.map((topic, topicIndex) => ({
        key: topic.id,
        href: `#${topic.id}`,
        title: tocTitle(
          topic.id.startsWith("degree-vocab-unit-")
            ? topic.title
            : `${blockNumber}.${topicOffset + topicIndex + 1} ${topic.title}`,
          progress.isMastered(topic.id),
        ),
      })),
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
                <Text strong>学位英语考点目录</Text>
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
                  已掌握 {masteredCount} / {allDegreeExamTopics.length}
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
                <span>成人本科学位英语 · 备考专项</span>
              </div>
              <Title className="heroTitle">学位英语备考知识库</Title>
              <Paragraph className="heroText">
                <MarkableText
                  id="degree-exam-hero-text"
                  text="本页专攻学位英语卷面得分点：第二块系统整理 3500 高频词背诵法、动词短语、介词陷阱、名词搭配和近义辨析；第三块覆盖非谓语、定语从句、时态等语法真题考点，阅读理解定位四步法，完形解题流程，以及书信和议论文写作模板。建议配合《英语语法知识库》系统学习后，用本页内容刷真题、对错题、背模板。"
                  annotations={annotations.getAnnotations(
                    "degree-exam-hero-text",
                  )}
                />
              </Paragraph>
              <div className="heroStats">
                <div>
                  <strong>{allDegreeExamTopics.length}</strong>
                  <span>考点模块</span>
                </div>
                <div>
                  <strong>{masteryPercent}%</strong>
                  <span>掌握进度</span>
                </div>
                <div>
                  <strong>真题</strong>
                  <span>导向备考</span>
                </div>
              </div>
            </header>

            <div className="routeCard">
              <BookOpen size={20} />
              <span>
                <MarkableText
                  id="degree-exam-route"
                  text="备考路线：第一块在《英语语法知识库》系统学语法；第二块在本页背高频词和固定搭配，每天 20–30 词 + 滚动复习；第三块按非谓语→定语从句→时态→阅读定位→完形→写作模板顺序刷真题，错题回到对应考点标掌握。写作至少背熟 4 种书信 + 3 种议论文骨架，考场上直接套定语从句和分词句提分。"
                  annotations={annotations.getAnnotations("degree-exam-route")}
                />
              </span>
            </div>

            {degreeExamStages.map((stage, stageIndex) => {
              const topicOffset = degreeExamStages
                .slice(0, stageIndex)
                .reduce((sum, item) => sum + item.topics.length, 0);
              const blockNumber = stageIndex <= 1 ? 2 : 3;
              return (
              <section key={stage.id} id={stage.id} className="stageSection">
                <Card className="stageCard">
                  <div className="stageNumber">
                    第 {blockNumber} 块{stageIndex === 1 ? " · 词表" : ""}
                  </div>
                  <Title level={2} className="stageTitle">
                    {stage.title.replace(/^第.+?块(续)?：/, "")}
                  </Title>
                  <Paragraph className="stageDescription">
                    {stage.description}
                  </Paragraph>
                </Card>
                {stage.topics.map((topic, topicIndex) => (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    number={
                      topic.id.startsWith("degree-vocab-unit-")
                        ? topic.title.match(/^Unit \d+/)?.[0] || ""
                        : `${blockNumber}.${topicOffset + topicIndex + 1}`
                    }
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
              );
            })}
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

          <aside className="sideActionRail" aria-label="返回其他知识库">
            <Button
              type="primary"
              className="sideActionButton"
              onClick={() => {
                goToRoute("/");
              }}
            >
              返回语法知识库
            </Button>
            <Button
              className="sideActionButton"
              onClick={() => {
                goToRoute("/remaining");
              }}
            >
              查看剩余英语能力知识点
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
          <HotTopicsPanel pageKey="degree-exam" items={hotTopicItems} />
          <QuizPanel
            pageKey="degree-exam"
            papers={degreeExamQuizPapers}
            triggerLabel="真题练习"
            cardTitle="学位英语真题练习"
            cardSubtitle="动词短语、搭配、语法、完形、阅读，共 8 套卷"
          />
          <DataBackupWidget />
          <DoubaoChatWidget />
          <FloatButton.BackTop />
        </Layout>
      </ConfigProvider>
    </StudyAnnotationsProvider>
  );
}
