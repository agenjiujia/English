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
  Tag,
  Typography,
} from "antd";
import { BookOpen, GraduationCap, MapPinned } from "lucide-react";
import { LazyMount } from "@/components/LazyMount";
import { HotTopicsPanel } from "@/components/HotTopicsPanel";
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
import { scrollToElementById } from "@/components/hotTopicsUtils";
import { useStableAnchorScroll } from "@/hooks/useStableAnchorScroll";
import { encouragementQuotes } from "@/data/encouragementQuotes";
import { phonicsDocs, type PhonicsDoc } from "@/data/phonicsDocs";
import "./index.less";

const { Sider, Content } = Layout;
const { Title, Paragraph, Text } = Typography;

type GetAnnotations = ReturnType<typeof useStudyAnnotations>["getAnnotations"];

function tocTitle(text: string, mastered: boolean) {
  return (
    <span className={mastered ? "tocTitle tocTitleMastered" : "tocTitle"}>
      {text}
    </span>
  );
}

type MarkdownBlock =
  | { type: "heading"; level: number; text: string; id: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "quote"; text: string }
  | { type: "divider" };

type PhonicsSection = {
  id: string;
  title: string;
  tag: string;
  tagColor: string;
  description: string;
  docId: string;
  docTitle: string;
  docIndex: number;
  sectionIndex: number;
  blocks: MarkdownBlock[];
};

type PhonicsStage = {
  id: string;
  title: string;
  description: string;
  sections: PhonicsSection[];
};

const phonicsStageConfigs = [
  {
    id: "phonics-stage-foundation",
    title: "第一阶段：拼读入口、总规则和音素",
    description:
      "先分清字母名、字母音、音素、元音和辅音，建立“先音节和重音、再判断元音、最后处理组合和例外”的总流程。",
    match: (section: PhonicsSection) =>
      section.docId === "english-main" &&
      (section.sectionIndex === 0 ||
        section.title.includes("核心原则") ||
        section.title.includes("字母、音素") ||
        section.title.includes("音素和元音辅音") ||
        section.title.includes("终极铁律")),
  },
  {
    id: "phonics-stage-syllable-stress",
    title: "第二阶段：音节拆分和重音",
    description:
      "学习 VCCV、VCV、固定组合、前后缀和复合词的拆分原则；先会拆音节、找重音，后面才能判断长短元音和弱读。",
    match: (section: PhonicsSection) =>
      section.docId === "english-main" &&
      (section.title.includes("音节拆分") || section.title.includes("找重音")),
  },
  {
    id: "phonics-stage-vowels",
    title: "第三阶段：音节类型、元音和弱读",
    description:
      "掌握闭音节、开音节、魔法 e、元音组合、r 控制元音、辅音 + le 和非重读弱读，解决单词读音最核心的问题。",
    match: (section: PhonicsSection) =>
      section.docId === "english-main" &&
      (section.title.includes("音节类型") ||
        section.title.includes("长短元音") ||
        section.title.includes("非重读元音") ||
        section.title.includes("弱读央元音") ||
        section.title.includes("元音组合") ||
        section.title.includes("r控制")),
  },
  {
    id: "phonics-stage-consonants-combinations",
    title: "第四阶段：辅音、字母组合和特殊拼读",
    description:
      "学习清浊辅音、固定辅音组合、辅音连缀、C/G 软硬音、Y/W 的特殊作用、静音字母和词尾后缀。",
    match: (section: PhonicsSection) =>
      section.docId === "english-main" &&
      (section.title.includes("清浊辅音") ||
        section.title.includes("兼职变身") ||
        section.title.includes("固定辅音组合") ||
        section.title.includes("软硬音") ||
        section.title.includes("辅音连缀") ||
        section.title.includes("静音字母") ||
        section.title.includes("词尾") ||
        section.title.includes("后缀")),
  },
  {
    id: "phonics-stage-review",
    title: "第五阶段：例外词、易错点和总复盘",
    description:
      "集中处理高频例外、易错风险、必考单词、极简总结和总口诀，把前面规则压缩成可背、可查、可复盘的体系。",
    match: (section: PhonicsSection) =>
      section.docId === "english-main" &&
      (section.title.includes("高频例外") ||
        section.title.includes("风险点") ||
        section.title.includes("配套必考单词") ||
        section.title.includes("背诵总结") ||
        section.title.includes("总口诀")),
  },
  {
    id: "phonics-stage-deep-logic",
    title: "第六阶段：发音底层逻辑",
    description:
      "理解音节拆分背后的发音逻辑。自然拼读是从拼写推测读音的高概率系统，不是百分百无例外的硬规则；遇到不确定读音，要结合音节、重音、元音、组合、词尾、例外词和音标一起判断。",
    match: (section: PhonicsSection) =>
      section.docId === "english-syllable" || section.docId === "english-logic",
  },
  {
    id: "phonics-stage-training",
    title: "第七阶段：90 天训练计划",
    description:
      "每天 10 到 15 分钟，按阶段复盘、练习和周测，目标是把自然拼读从“知道规则”训练到“看到常见词能主动分析、读音不确定时会主动查证”。",
    match: (section: PhonicsSection) => section.docId === "english-plan",
  },
];

function slugify(text: string) {
  return text
    .replace(/\*\*/g, "")
    .replace(/\[[^\]]+\]\(([^)]+)\)/g, "$1")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function cleanHeading(text: string) {
  return text
    .replace(/\u200b/g, "")
    .replace(/​/g, "")
    .replace(/&amp;/g, "&")
    .trim();
}

function cleanDisplayText(text: string) {
  return cleanHeading(text)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\\&/g, "&")
    .trim();
}

function cleanTocText(text: string) {
  return cleanHeading(text)
    .replace(/^【[^】]+】\s*/, "")
    .replace(
      /^第[一二三四五六七八九十百千万\d]+[章节部分课天阶段]*[：:、.\s-]*/u,
      "",
    )
    .replace(/^[一二三四五六七八九十百千万]+[、.．]\s*/u, "")
    .replace(/^\d+[.)、.．]\s*/, "")
    .trim();
}

function isTrainingIntroSection(section: PhonicsSection) {
  return (
    section.docId === "english-plan" &&
    (section.title.includes("自然拼读 90 天系统学习计划") ||
      section.title === "总目标")
  );
}

function isDeepLogicIntroSection(section: PhonicsSection) {
  return (
    (section.docId === "english-syllable" &&
      (section.title === "音节拆分的底层逻辑" || section.title === "结论")) ||
    (section.docId === "english-logic" &&
      (section.title === "英语发音底层逻辑" || section.title === "最终目标"))
  );
}

function parseMarkdown(markdown: string, docId: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = [];
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  let paragraph: string[] = [];
  let listItems: string[] = [];
  let listOrdered = false;
  const headingCounts = new Map<string, number>();

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      blocks.push({ type: "paragraph", text: paragraph.join("\n") });
      paragraph = [];
    }
  };

  const flushList = () => {
    if (listItems.length > 0) {
      blocks.push({ type: "list", ordered: listOrdered, items: listItems });
      listItems = [];
    }
  };

  const headingId = (text: string) => {
    const base = `${docId}-${slugify(text) || "section"}`;
    const count = headingCounts.get(base) || 0;
    headingCounts.set(base, count + 1);
    return count === 0 ? base : `${base}-${count + 1}`;
  };

  lines.forEach((line) => {
    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    const unordered = line.match(/^\s*[-*]\s+(.+)$/);
    const ordered = line.match(/^\s*\d+[.)]\s+(.+)$/);
    const quote = line.match(/^>\s*(.+)$/);

    if (heading) {
      flushParagraph();
      flushList();
      const text = cleanHeading(heading[2]);
      blocks.push({
        type: "heading",
        level: heading[1].length,
        text,
        id: headingId(text),
      });
      return;
    }

    if (/^\s*---+\s*$/.test(line)) {
      flushParagraph();
      flushList();
      blocks.push({ type: "divider" });
      return;
    }

    if (unordered || ordered) {
      flushParagraph();
      const nextOrdered = Boolean(ordered);
      if (listItems.length > 0 && listOrdered !== nextOrdered) flushList();
      listOrdered = nextOrdered;
      listItems.push((ordered?.[1] || unordered?.[1] || "").trim());
      return;
    }

    if (quote) {
      flushParagraph();
      flushList();
      blocks.push({ type: "quote", text: quote[1].trim() });
      return;
    }

    if (!line.trim()) {
      flushParagraph();
      flushList();
      return;
    }

    flushList();
    paragraph.push(line.trim());
  });

  flushParagraph();
  flushList();
  return blocks;
}

function getDocSections(doc: PhonicsDoc, docIndex: number): PhonicsSection[] {
  const blocks = parseMarkdown(doc.markdown, doc.id);
  const sections: PhonicsSection[] = [];
  let current: PhonicsSection | null = null;

  const startSection = (
    id: string,
    title: string,
    description: string,
    sectionIndex: number,
  ) => {
    const section = {
      id,
      title,
      tag: doc.tag,
      tagColor: doc.tagColor,
      description,
      docId: doc.id,
      docTitle: doc.title,
      docIndex,
      sectionIndex,
      blocks: [],
    };
    current = section;
    sections.push(current);
    return section;
  };

  blocks.forEach((block) => {
    if (block.type === "heading" && block.level <= 2) {
      startSection(block.id, block.text, doc.description, sections.length);
      return;
    }

    if (!current) {
      current = startSection(
        doc.id,
        doc.title,
        doc.description,
        sections.length,
      );
    }
    current.blocks.push(block);
  });

  return sections;
}

function buildPhonicsStages(sections: PhonicsSection[]): PhonicsStage[] {
  const usedSectionIds = new Set<string>();
  const stages = phonicsStageConfigs.map((stageConfig) => {
    const stageSections = sections.filter((section) => {
      if (usedSectionIds.has(section.id)) return false;
      if (!stageConfig.match(section)) return false;
      const isStageIntro =
        (stageConfig.id === "phonics-stage-deep-logic" &&
          isDeepLogicIntroSection(section)) ||
        (stageConfig.id === "phonics-stage-training" &&
          isTrainingIntroSection(section));
      usedSectionIds.add(section.id);
      if (isStageIntro) return false;
      return true;
    });

    return {
      id: stageConfig.id,
      title: stageConfig.title,
      description: stageConfig.description,
      sections: stageSections,
    };
  });

  const restSections = sections.filter(
    (section) => !usedSectionIds.has(section.id),
  );
  if (restSections.length > 0) {
    stages.push({
      id: "phonics-stage-extra",
      title: "补充阶段：原文补充内容",
      description: "保留未归入主线的原文内容，避免任何知识点遗漏。",
      sections: restSections,
    });
  }

  return stages.filter((stage) => stage.sections.length > 0);
}

function renderBlock(
  block: MarkdownBlock,
  markablePrefix: string,
  index: number,
  getAnnotations: GetAnnotations,
) {
  const markableId = `${markablePrefix}-block-${index}`;

  if (block.type === "heading") {
    const level = Math.min(Math.max(block.level + 1, 3), 5) as 3 | 4 | 5;
    return (
      <div key={markableId} id={block.id} className="phonicsHeading">
        <Title level={level}>
          <MarkableText
            id={`${markableId}-heading`}
            text={cleanDisplayText(block.text)}
            annotations={getAnnotations(`${markableId}-heading`)}
          />
        </Title>
      </div>
    );
  }

  if (block.type === "paragraph") {
    return (
      <Paragraph key={markableId} className="phonicsParagraph">
        <MarkableText
          id={markableId}
          text={cleanDisplayText(block.text)}
          annotations={getAnnotations(markableId)}
        />
      </Paragraph>
    );
  }

  if (block.type === "list") {
    const ListTag = block.ordered ? "ol" : "ul";
    return (
      <ListTag key={markableId} className="phonicsList">
        {block.items.map((item, itemIndex) => (
          <li key={`${markableId}-${itemIndex}`}>
            <MarkableText
              id={`${markableId}-item-${itemIndex}`}
              text={cleanDisplayText(item)}
              annotations={getAnnotations(`${markableId}-item-${itemIndex}`)}
            />
          </li>
        ))}
      </ListTag>
    );
  }

  if (block.type === "quote") {
    return (
      <Alert
        key={markableId}
        className="phonicsQuote"
        type="info"
        showIcon
        message={
          <MarkableText
            id={markableId}
            text={cleanDisplayText(block.text)}
            annotations={getAnnotations(markableId)}
          />
        }
      />
    );
  }

  return <div key={markableId} className="phonicsDivider" />;
}

function PhonicsSectionCard({
  section,
  number,
  getAnnotations,
  mastered,
  studyCount,
  onToggleMastered,
  onIncrementStudyCount,
  onDecrementStudyCount,
  onSetStudyCount,
}: {
  section: PhonicsSection;
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
    <section id={section.id} className="topicSection">
      <LazyMount placeholderHeight={520}>
        <Card
          className={
            mastered
              ? "topicCard topicCardMastered phonicsCard"
              : "topicCard phonicsCard"
          }
          title={
            <Space align="center" wrap>
              <span className="topicIndex">{number}</span>
              <span>{cleanTocText(section.title)}</span>
              <Tag color={section.tagColor}>{section.tag}</Tag>
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
              id={`${section.id}-description`}
              text={section.description}
              annotations={getAnnotations(`${section.id}-description`)}
            />
          </Paragraph>
          <div className="phonicsMarkdown">
            {section.blocks.map((block, blockIndex) =>
              renderBlock(block, section.id, blockIndex, getAnnotations),
            )}
          </div>
        </Card>
      </LazyMount>
    </section>
  );
}

function PhonicsCombinedStageCard({
  stage,
  number,
  getAnnotations,
  mastered,
  studyCount,
  onToggleMastered,
  onIncrementStudyCount,
  onDecrementStudyCount,
  onSetStudyCount,
}: {
  stage: PhonicsStage;
  number: string;
  getAnnotations: GetAnnotations;
  mastered: boolean;
  studyCount: number;
  onToggleMastered: () => void;
  onIncrementStudyCount: () => void;
  onDecrementStudyCount: () => void;
  onSetStudyCount: (count: number) => void;
}) {
  const firstSection = stage.sections[0];

  return (
    <section id={`${stage.id}-content`} className="topicSection">
      <LazyMount placeholderHeight={680}>
        <Card
          className={
            mastered
              ? "topicCard topicCardMastered phonicsCard"
              : "topicCard phonicsCard"
          }
          title={
            <Space align="center" wrap>
              <span className="topicIndex">{number}</span>
              <span>{stage.title.replace(/^第.+?阶段：/, "")}</span>
              {firstSection ? (
                <Tag color={firstSection.tagColor}>{firstSection.tag}</Tag>
              ) : null}
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
              id={`${stage.id}-combined-description`}
              text={stage.description}
              annotations={getAnnotations(`${stage.id}-combined-description`)}
            />
          </Paragraph>
          <div className="phonicsMarkdown">
            {stage.sections.map((section, sectionIndex) => (
              <React.Fragment key={section.id}>
                {stage.sections.length > 1 ? (
                  <div className="phonicsHeading">
                    <Title level={3}>
                      {`${number}.${sectionIndex + 1} ${cleanTocText(
                        section.title,
                      )}`}
                    </Title>
                  </div>
                ) : null}
                {section.blocks.map((block, blockIndex) =>
                  renderBlock(
                    block,
                    `${section.id}-combined`,
                    blockIndex,
                    getAnnotations,
                  ),
                )}
              </React.Fragment>
            ))}
          </div>
        </Card>
      </LazyMount>
    </section>
  );
}

export default function PhonicsPage() {
  const goToRoute = React.useCallback((path: string) => {
    window.location.hash = path;
  }, []);
  const annotations = useStudyAnnotations("phonics");
  const progress = useStudyProgress("phonics");
  const celebration = useStudyCelebration();
  const handleAnchorClick = useStableAnchorScroll();
  const encouragement = React.useMemo(
    () =>
      encouragementQuotes[
        Math.floor(Math.random() * encouragementQuotes.length)
      ],
    [],
  );
  const sectionGroups = React.useMemo(
    () =>
      phonicsDocs.map((doc, docIndex) => ({
        doc,
        sections: getDocSections(doc, docIndex),
      })),
    [],
  );
  const phonicsSections = React.useMemo(
    () => sectionGroups.flatMap((group) => group.sections),
    [sectionGroups],
  );
  const phonicsStages = React.useMemo(
    () => buildPhonicsStages(phonicsSections),
    [phonicsSections],
  );
  const trackablePhonicsSections = React.useMemo(
    () => phonicsStages.flatMap((stage) => stage.sections),
    [phonicsStages],
  );
  const masteredCount = trackablePhonicsSections.filter((section) =>
    progress.isMastered(section.id),
  ).length;
  const hotTopicItems = React.useMemo(
    () =>
      phonicsStages.flatMap((stage, stageIndex) => {
        if (stageIndex === 0) {
          const combinedNoteCount = annotations.annotations.filter((item) => {
            if (!item.note?.trim()) return false;
            if (item.targetId.startsWith(`${stage.id}-`)) return true;
            return stage.sections.some((section) =>
              item.targetId.startsWith(`${section.id}-combined`),
            );
          }).length;

          return [
            {
              id: stage.id,
              title: stage.title.replace(/^第.+?阶段：/, ""),
              category: "阶段总览",
              studyCount: progress.getStudyCount(stage.id),
              noteCount: combinedNoteCount,
              mastered: stage.sections.every((section) =>
                progress.isMastered(section.id),
              ),
              order: stageIndex,
              onOpen: () => scrollToElementById(`${stage.id}-content`),
            },
          ];
        }

        return stage.sections.map((section, sectionIndex) => ({
          id: section.id,
          title: cleanTocText(section.title),
          category: section.tag,
          studyCount: progress.getStudyCount(section.id),
          noteCount: annotations.annotations.filter(
            (item) =>
              Boolean(item.note?.trim()) &&
              (item.targetId === section.id ||
                item.targetId.startsWith(`${section.id}-`)),
          ).length,
          mastered: progress.isMastered(section.id),
          order: stageIndex * 100 + sectionIndex,
          onOpen: () => scrollToElementById(section.id),
        }));
      }),
    [
      annotations.annotations,
      phonicsStages,
      progress,
      progress.masteredIds,
      progress.studyCounts,
    ],
  );
  const masteryPercent =
    trackablePhonicsSections.length > 0
      ? Math.round((masteredCount / trackablePhonicsSections.length) * 100)
      : 0;
  const handleToggleSectionMastered = (section: PhonicsSection) => {
    const alreadyMastered = progress.isMastered(section.id);
    progress.toggleMastered(section.id);
    if (!alreadyMastered) {
      celebration.celebrate(
        cleanTocText(section.title),
        masteredCount + 1,
        trackablePhonicsSections.length,
      );
    }
  };
  const handleToggleStageMastered = (stage: PhonicsStage) => {
    const sectionIds = stage.sections.map((section) => section.id);
    const allMastered = sectionIds.every((id) => progress.isMastered(id));
    progress.setMastered(sectionIds, !allMastered);

    if (!allMastered) {
      const newlyMasteredCount = sectionIds.filter(
        (id) => !progress.isMastered(id),
      ).length;
      celebration.celebrate(
        stage.title.replace(/^第.+?阶段：/, ""),
        Math.min(
          masteredCount + newlyMasteredCount,
          trackablePhonicsSections.length,
        ),
        trackablePhonicsSections.length,
        newlyMasteredCount,
      );
    }
  };
  const anchorItems = phonicsStages.map((stage, stageIndex) => {
    const allMastered =
      stage.sections.length > 0 &&
      stage.sections.every((section) => progress.isMastered(section.id));
    const isCombinedStage = stageIndex === 0;

    return {
      key: stage.id,
      href: `#${stage.id}`,
      title: tocTitle(
        `${stageIndex + 1}. ${stage.title.replace(/^第.+?阶段：/, "")}`,
        allMastered,
      ),
      children: isCombinedStage
        ? undefined
        : stage.sections.map((section, sectionIndex) => ({
            key: section.id,
            href: `#${section.id}`,
            title: tocTitle(
              `${stageIndex + 1}.${sectionIndex + 1} ${cleanTocText(
                section.title,
              )}`,
              progress.isMastered(section.id),
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
          },
        }}
      >
        <Layout className="pageShell">
          <Sider width={292} className="leftRail">
            <div className="tocPanel">
              <div className="tocHead">
                <MapPinned size={18} />
                <Text strong>自然拼读目录</Text>
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
                  已掌握 {masteredCount} / {trackablePhonicsSections.length}
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
                <span>自然拼读体系 · 课程化编排</span>
              </div>
              <Title className="heroTitle">自然拼读系统知识库</Title>
              <Paragraph className="heroText">
                <MarkableText
                  id="phonics-hero-text"
                  text="本课程按初学者可理解的顺序系统学习自然拼读：字母和音素、音节拆分、重音判断、六大音节类型、长短元音、弱读、清浊辅音、Y/W 的特殊作用、辅音组合、C/G 软硬音、元音组合、r 控制、静音字母、词尾规则和高频例外。每个规则都配例词与纠错提醒，并强调自然拼读是高概率系统，遇到例外要用音标和真实发音校正。这是三大系统的起点页。"
                  annotations={annotations.getAnnotations("phonics-hero-text")}
                />
              </Paragraph>
              <div className="heroStats">
                <div>
                  <strong>{phonicsStages.length}</strong>
                  <span>学习阶段</span>
                </div>
                <div>
                  <strong>{masteryPercent}%</strong>
                  <span>掌握进度</span>
                </div>
                <div>
                  <strong>90</strong>
                  <span>天训练</span>
                </div>
              </div>
            </header>

            <div className="routeCard">
              <BookOpen size={20} />
              <span>
                <MarkableText
                  id="phonics-route"
                  text="学习路线：先分清字母、音素、元音和辅音，建立拼读总流程；再学习音节拆分、重音、开闭音节、魔法 e 和弱读；接着掌握辅音组合、元音组合、r 控制、静音字母和词尾变化；最后用高频例外、必考单词、底层逻辑和 90 天训练反复巩固。完成本页后，建议进入《英语语法知识库》，最后学习《英语剩余知识点系统》。"
                  annotations={annotations.getAnnotations("phonics-route")}
                />
              </span>
            </div>

            {phonicsStages.map((stage, stageIndex) => (
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
                {stageIndex === 0 ? (
                  <PhonicsCombinedStageCard
                    stage={stage}
                    number={`${stageIndex + 1}.1`}
                    getAnnotations={annotations.getAnnotations}
                    mastered={stage.sections.every((section) =>
                      progress.isMastered(section.id),
                    )}
                    studyCount={progress.getStudyCount(stage.id)}
                    onToggleMastered={() => handleToggleStageMastered(stage)}
                    onIncrementStudyCount={() =>
                      progress.incrementStudyCount(stage.id)
                    }
                    onDecrementStudyCount={() =>
                      progress.decrementStudyCount(stage.id)
                    }
                    onSetStudyCount={(count) =>
                      progress.setStudyCount(stage.id, count)
                    }
                  />
                ) : (
                  stage.sections.map((section, sectionIndex) => (
                    <PhonicsSectionCard
                      key={section.id}
                      section={section}
                      number={`${stageIndex + 1}.${sectionIndex + 1}`}
                      getAnnotations={annotations.getAnnotations}
                      mastered={progress.isMastered(section.id)}
                      studyCount={progress.getStudyCount(section.id)}
                      onToggleMastered={() =>
                        handleToggleSectionMastered(section)
                      }
                      onIncrementStudyCount={() =>
                        progress.incrementStudyCount(section.id)
                      }
                      onDecrementStudyCount={() =>
                        progress.decrementStudyCount(section.id)
                      }
                      onSetStudyCount={(count) =>
                        progress.setStudyCount(section.id, count)
                      }
                    />
                  ))
                )}
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
          <HotTopicsPanel pageKey="phonics" items={hotTopicItems} />
          <DataBackupWidget variant="noQuiz" />
          <DoubaoChatWidget />
          <FloatButton.BackTop />
        </Layout>
      </ConfigProvider>
    </StudyAnnotationsProvider>
  );
}
