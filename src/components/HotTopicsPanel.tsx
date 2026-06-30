import React from "react";
import { Button, Input, Tag, Typography } from "antd";
import {
  BookText,
  Eye,
  Flame,
  PenLine,
  Pin,
  PinOff,
  Plus,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

const { Text } = Typography;

const STORAGE_PREFIX = "english-hot-topics";
const HOT_TOPIC_NOTE_MAX_LENGTH = 180;
const PERSONAL_NOTE_TITLE_MAX_LENGTH = 28;
const PERSONAL_NOTE_CONTENT_MAX_LENGTH = 600;
const DEFAULT_MAX_ITEMS = 6;

type PersonalNote = {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
};

type HotTopicsState = {
  notes: Record<string, string>;
  pinnedIds: string[];
  viewedAt: Record<string, number>;
  personalNotes: PersonalNote[];
};

export type HotTopicItem = {
  id: string;
  title: string;
  category?: string;
  studyCount: number;
  noteCount?: number;
  mastered?: boolean;
  order?: number;
  onOpen: () => void;
};

type RankedHotTopicItem = HotTopicItem & {
  manualNote: string;
  viewedAt: number;
  score: number;
};

const EMPTY_STATE: HotTopicsState = {
  notes: {},
  pinnedIds: [],
  viewedAt: {},
  personalNotes: [],
};

function normalizePersonalNote(input: unknown): PersonalNote | null {
  if (!input || typeof input !== "object") return null;
  const note = input as Partial<PersonalNote>;
  if (typeof note.id !== "string") return null;
  if (typeof note.title !== "string") return null;
  if (typeof note.content !== "string") return null;
  if (typeof note.updatedAt !== "number") return null;
  return {
    id: note.id,
    title: note.title.slice(0, PERSONAL_NOTE_TITLE_MAX_LENGTH),
    content: note.content.slice(0, PERSONAL_NOTE_CONTENT_MAX_LENGTH),
    updatedAt: note.updatedAt,
  };
}

function getStorageKey(pageKey: string) {
  return `${STORAGE_PREFIX}:${pageKey}`;
}

function normalizeState(value: unknown): HotTopicsState {
  if (!value || typeof value !== "object") {
    return EMPTY_STATE;
  }

  const input = value as Partial<HotTopicsState>;

  return {
    notes:
      input.notes && typeof input.notes === "object"
        ? Object.fromEntries(
            Object.entries(input.notes).filter(
              (entry): entry is [string, string] =>
                typeof entry[0] === "string" && typeof entry[1] === "string",
            ),
          )
        : {},
    pinnedIds: Array.isArray(input.pinnedIds)
      ? input.pinnedIds.filter(
          (item): item is string => typeof item === "string",
        )
      : [],
    viewedAt:
      input.viewedAt && typeof input.viewedAt === "object"
        ? Object.fromEntries(
            Object.entries(input.viewedAt).filter(
              (entry): entry is [string, number] =>
                typeof entry[0] === "string" && typeof entry[1] === "number",
            ),
          )
        : {},
    personalNotes: Array.isArray(input.personalNotes)
      ? input.personalNotes
          .map((item) => normalizePersonalNote(item))
          .filter((item): item is PersonalNote => Boolean(item))
      : [],
  };
}

function getRecentBoost(viewedAt: number) {
  if (!viewedAt) return 0;
  const age = Date.now() - viewedAt;
  const oneDay = 24 * 60 * 60 * 1000;
  if (age <= oneDay) return 10;
  if (age <= 3 * oneDay) return 6;
  if (age <= 7 * oneDay) return 3;
  return 0;
}

function formatDateTime(timestamp: number) {
  return new Date(timestamp).toLocaleString("zh-CN", {
    hour12: false,
  });
}

function isSelectAllShortcut(
  event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
) {
  return (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "a";
}

function rankItem(
  item: HotTopicItem,
  state: HotTopicsState,
  index: number,
): RankedHotTopicItem {
  const manualNote = (state.notes[item.id] || "").trim();
  const viewedAt = state.viewedAt[item.id] || 0;
  const pinned = state.pinnedIds.includes(item.id);
  const score =
    (pinned ? 1000 : 0) +
    Math.min(item.studyCount, 30) * 6 +
    Math.min(item.noteCount || 0, 8) * 8 +
    (manualNote ? 12 : 0) +
    (item.mastered ? 1 : 0) +
    getRecentBoost(viewedAt) -
    (item.order ?? index) * 0.001;

  return {
    ...item,
    manualNote,
    viewedAt,
    score,
  };
}

export function HotTopicsPanel({
  pageKey,
  title = "热门知识点",
  items,
  maxItems = DEFAULT_MAX_ITEMS,
}: {
  pageKey: string;
  title?: string;
  items: HotTopicItem[];
  maxItems?: number;
}) {
  const [open, setOpen] = React.useState(false);
  const [panel, setPanel] = React.useState<"topics" | "notes">("topics");
  const [draft, setDraft] = React.useState("");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [selectedPersonalNoteId, setSelectedPersonalNoteId] = React.useState<
    string | null
  >(null);
  const [personalNoteMode, setPersonalNoteMode] = React.useState<
    "preview" | "edit"
  >("preview");
  const [personalTitleDraft, setPersonalTitleDraft] = React.useState("");
  const [personalContentDraft, setPersonalContentDraft] = React.useState("");
  const [state, setState] = React.useState<HotTopicsState>(EMPTY_STATE);
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(getStorageKey(pageKey));
      setState(raw ? normalizeState(JSON.parse(raw)) : EMPTY_STATE);
    } catch {
      setState(EMPTY_STATE);
    }
  }, [pageKey]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(getStorageKey(pageKey), JSON.stringify(state));
  }, [pageKey, state]);

  const rankedItems = React.useMemo(
    () =>
      items
        .map((item, index) => rankItem(item, state, index))
        .sort((a, b) => b.score - a.score)
        .slice(0, maxItems),
    [items, maxItems, state],
  );

  const selectedItem =
    rankedItems.find((item) => item.id === selectedId) ||
    rankedItems[0] ||
    null;
  const personalNotes = state.personalNotes;
  const selectedPersonalNote =
    personalNotes.find((item) => item.id === selectedPersonalNoteId) ||
    personalNotes[0] ||
    null;

  React.useEffect(() => {
    if (!rankedItems.length) {
      setSelectedId(null);
      return;
    }

    if (!selectedId || !rankedItems.some((item) => item.id === selectedId)) {
      setSelectedId(rankedItems[0].id);
    }
  }, [rankedItems, selectedId]);

  React.useEffect(() => {
    setDraft(selectedItem?.manualNote || "");
  }, [selectedItem?.id, selectedItem?.manualNote]);

  React.useEffect(() => {
    if (!personalNotes.length) {
      setSelectedPersonalNoteId(null);
      setPersonalTitleDraft("");
      setPersonalContentDraft("");
      return;
    }

    if (
      !selectedPersonalNoteId ||
      !personalNotes.some((item) => item.id === selectedPersonalNoteId)
    ) {
      setSelectedPersonalNoteId(personalNotes[0].id);
      setPersonalNoteMode("preview");
    }
  }, [personalNotes, selectedPersonalNoteId]);

  React.useEffect(() => {
    setPersonalTitleDraft(selectedPersonalNote?.title || "");
    setPersonalContentDraft(selectedPersonalNote?.content || "");
  }, [
    selectedPersonalNote?.id,
    selectedPersonalNote?.title,
    selectedPersonalNote?.content,
  ]);

  React.useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleSelect = React.useCallback((item: RankedHotTopicItem) => {
    setSelectedId(item.id);
  }, []);

  const handleOpenTopic = React.useCallback((item: RankedHotTopicItem) => {
    setState((current) => ({
      ...current,
      viewedAt: {
        ...current.viewedAt,
        [item.id]: Date.now(),
      },
    }));
    setSelectedId(item.id);
    item.onOpen();
  }, []);

  const handleTogglePin = React.useCallback(() => {
    if (!selectedItem) return;
    setState((current) => {
      const pinned = new Set(current.pinnedIds);
      if (pinned.has(selectedItem.id)) {
        pinned.delete(selectedItem.id);
      } else {
        pinned.add(selectedItem.id);
      }
      return {
        ...current,
        pinnedIds: [...pinned],
      };
    });
  }, [selectedItem]);

  const handleSaveNote = React.useCallback(() => {
    if (!selectedItem) return;
    const nextNote = draft.trim().slice(0, HOT_TOPIC_NOTE_MAX_LENGTH);
    setState((current) => {
      const notes = { ...current.notes };
      if (nextNote) {
        notes[selectedItem.id] = nextNote;
      } else {
        delete notes[selectedItem.id];
      }
      return {
        ...current,
        notes,
      };
    });
    setDraft(nextNote);
  }, [draft, selectedItem]);

  const handleCreatePersonalNote = React.useCallback(() => {
    const newNote: PersonalNote = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title: "新笔记",
      content: "",
      updatedAt: Date.now(),
    };
    setState((current) => ({
      ...current,
      personalNotes: [...current.personalNotes, newNote],
    }));
    setPanel("notes");
    setSelectedPersonalNoteId(newNote.id);
    setPersonalNoteMode("edit");
    setPersonalTitleDraft(newNote.title);
    setPersonalContentDraft("");
  }, []);

  const handleSavePersonalNote = React.useCallback(() => {
    if (!selectedPersonalNote) return;
    const nextTitle =
      personalTitleDraft.trim().slice(0, PERSONAL_NOTE_TITLE_MAX_LENGTH) ||
      "未命名笔记";
    const nextContent = personalContentDraft
      .trim()
      .slice(0, PERSONAL_NOTE_CONTENT_MAX_LENGTH);
    setState((current) => ({
      ...current,
      personalNotes: current.personalNotes.map((item) =>
        item.id === selectedPersonalNote.id
          ? {
              ...item,
              title: nextTitle,
              content: nextContent,
              updatedAt: Date.now(),
            }
          : item,
      ),
    }));
    setPersonalNoteMode("preview");
  }, [personalContentDraft, personalTitleDraft, selectedPersonalNote]);

  const handleDeletePersonalNote = React.useCallback((noteId: string) => {
    const shouldDelete = window.confirm("删除这条笔记后将无法恢复，确认删除？");
    if (!shouldDelete) return;
    setState((current) => ({
      ...current,
      personalNotes: current.personalNotes.filter((item) => item.id !== noteId),
    }));
  }, []);

  const activeCount = rankedItems.filter(
    (item) => item.studyCount > 0 || item.noteCount || item.manualNote,
  ).length;
  const isPinned = selectedItem
    ? state.pinnedIds.includes(selectedItem.id)
    : false;
  const selectedPersonalNoteUpdatedAt = selectedPersonalNote
    ? formatDateTime(selectedPersonalNote.updatedAt)
    : "";
  const handleNativeSelectAll = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (!isSelectAllShortcut(event)) return;
      event.preventDefault();
      event.stopPropagation();
      event.currentTarget.select();
    },
    [],
  );

  return (
    <div
      ref={rootRef}
      className={
        open ? "hotTopicsWidget hotTopicsWidgetOpen" : "hotTopicsWidget"
      }
    >
      <button
        type="button"
        className="hotTopicsTrigger"
        onClick={() => {
          setPanel("topics");
          setOpen((current) => !current);
        }}
      >
        <span className="hotTopicsTriggerIcon">
          <Flame size={16} />
        </span>
        <span className="hotTopicsTriggerLabel">{title}</span>
        <span className="hotTopicsTriggerCount">
          {activeCount || rankedItems.length}
        </span>
      </button>

      {open ? (
        <div
          className={
            panel === "notes"
              ? "hotTopicsCard hotTopicsCardNotes"
              : "hotTopicsCard"
          }
          role="dialog"
          aria-label={title}
        >
          <div className="hotTopicsHeader">
            <div>
              <div className="hotTopicsTitleRow">
                {panel === "topics" ? (
                  <Flame size={16} />
                ) : (
                  <BookText size={16} />
                )}
                <strong>{panel === "topics" ? title : "我的笔记"}</strong>
              </div>
              <Text className="hotTopicsSubtitle">
                {panel === "topics"
                  ? "按学习次数、备注和最近查看排序"
                  : "在这里自由记录，不依附任何知识点"}
              </Text>
            </div>
            <div className="hotTopicsHeaderActions">
              <div
                className="hotTopicsTabs"
                role="tablist"
                aria-label="热点卡视图"
              >
                <button
                  type="button"
                  className={
                    panel === "topics"
                      ? "hotTopicsTab hotTopicsTabActive"
                      : "hotTopicsTab"
                  }
                  onClick={() => setPanel("topics")}
                >
                  热门
                </button>
                <button
                  type="button"
                  className={
                    panel === "notes"
                      ? "hotTopicsTab hotTopicsTabActive"
                      : "hotTopicsTab"
                  }
                  onClick={() => setPanel("notes")}
                >
                  笔记
                </button>
              </div>
              <div className="hotTopicsHeaderSecondaryActions">
                {panel === "notes" ? (
                  <button
                    type="button"
                    className="hotTopicsHeaderButton hotTopicsHeaderButtonWide"
                    onClick={handleCreatePersonalNote}
                    title="新建笔记"
                  >
                    <Plus size={14} />
                    <span>新建</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className={
                      isPinned
                        ? "hotTopicsHeaderButton active hotTopicsHeaderButtonWide"
                        : "hotTopicsHeaderButton hotTopicsHeaderButtonWide"
                    }
                    onClick={handleTogglePin}
                    disabled={!selectedItem}
                    title={isPinned ? "取消置顶" : "置顶当前热点"}
                  >
                    {isPinned ? <PinOff size={14} /> : <Pin size={14} />}
                    <span>{isPinned ? "取消置顶" : "置顶"}</span>
                  </button>
                )}
                <button
                  type="button"
                  className="hotTopicsHeaderButton"
                  onClick={() => setOpen(false)}
                  title="收起"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          </div>

          {panel === "topics" ? (
            <div className="hotTopicsBody">
              <div className="hotTopicsSide hotTopicsListSide">
                <div className="hotTopicsSectionHead">
                  <span className="hotTopicsSectionTitle">热点列表</span>
                  <span className="hotTopicsSectionMeta">
                    {rankedItems.length} 条
                  </span>
                </div>
                <div className="hotTopicsList" role="list">
                  {rankedItems.map((item, index) => {
                    const active = item.id === selectedItem?.id;
                    const pinned = state.pinnedIds.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={
                          active
                            ? "hotTopicsListItem hotTopicsListItemActive"
                            : "hotTopicsListItem"
                        }
                        onClick={() => handleSelect(item)}
                      >
                        <span className="hotTopicsRank">{index + 1}</span>
                        <span className="hotTopicsListMain">
                          <span className="hotTopicsListTitle">
                            {item.title}
                            {pinned ? (
                              <Pin size={12} className="hotTopicsPinMark" />
                            ) : null}
                          </span>
                          <span className="hotTopicsListMeta">
                            {item.category ? <Tag>{item.category}</Tag> : null}
                            <span className="hotTopicsMetaPill">
                              学习 {item.studyCount} 次
                            </span>
                            <span className="hotTopicsMetaPill">
                              备注 {item.noteCount || 0}
                            </span>
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedItem ? (
                <div className="hotTopicsSide hotTopicsDetail">
                  <div className="hotTopicsSectionHead hotTopicsSectionHeadDetail">
                    <span className="hotTopicsSectionTitle">重点记录</span>
                    <span className="hotTopicsSectionMeta">
                      {selectedItem.manualNote ? "已保存" : "待补充"}
                    </span>
                  </div>
                  <div className="hotTopicsDetailHead">
                    <div>
                      <div className="hotTopicsDetailTitle">
                        {selectedItem.title}
                      </div>
                      <div className="hotTopicsStats">
                        {selectedItem.category ? (
                          <Tag>{selectedItem.category}</Tag>
                        ) : null}
                        <span className="hotTopicsStatPill">
                          学习 {selectedItem.studyCount} 次
                        </span>
                        <span className="hotTopicsStatPill">
                          备注 {selectedItem.noteCount || 0} 条
                        </span>
                        {selectedItem.mastered ? (
                          <span className="hotTopicsStatPill hotTopicsStatPillMastered">
                            已掌握
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <Button
                      size="small"
                      className="hotTopicsOpenButton"
                      onClick={() => handleOpenTopic(selectedItem)}
                    >
                      打开
                    </Button>
                  </div>

                  {selectedItem.manualNote ? (
                    <div className="hotTopicsSavedNote">
                      <Sparkles size={14} />
                      <span>{selectedItem.manualNote}</span>
                    </div>
                  ) : (
                    <div className="hotTopicsHint">
                      还没有快捷记录，写一句你最容易忘的提醒。
                    </div>
                  )}

                  <div className="hotTopicsComposer">
                    <div className="hotTopicsFieldLabel">快捷备注</div>
                    <Input.TextArea
                      value={draft}
                      maxLength={HOT_TOPIC_NOTE_MAX_LENGTH}
                      autoSize={{ minRows: 3, maxRows: 5 }}
                      placeholder="例如：the 常用于双方都知道的人或物。"
                      onChange={(event) => setDraft(event.target.value)}
                    />
                    <div className="hotTopicsComposerFooter">
                      <span className="hotTopicsComposerCount">
                        {draft.length} / {HOT_TOPIC_NOTE_MAX_LENGTH}
                      </span>
                      <div className="hotTopicsComposerActions">
                        <Button
                          size="small"
                          onClick={() => setDraft(selectedItem.manualNote)}
                        >
                          还原
                        </Button>
                        <Button
                          size="small"
                          type="primary"
                          disabled={draft.trim() === selectedItem.manualNote}
                          onClick={handleSaveNote}
                        >
                          保存记录
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="hotTopicsBody hotTopicsBodyNotes">
              <div className="hotTopicsSide hotTopicsListSide">
                <div className="hotTopicsSectionHead">
                  <span className="hotTopicsSectionTitle">笔记列表</span>
                  <span className="hotTopicsSectionMeta">
                    {personalNotes.length} 条
                  </span>
                </div>
                <div className="hotTopicsList" role="list">
                  {personalNotes.length ? (
                    personalNotes.map((note, index) => {
                      const active = note.id === selectedPersonalNote?.id;
                      return (
                        <button
                          key={note.id}
                          type="button"
                          className={
                            active
                              ? "hotTopicsListItem hotTopicsListItemActive"
                              : "hotTopicsListItem"
                          }
                          onClick={() => {
                            setSelectedPersonalNoteId(note.id);
                            setPersonalNoteMode("preview");
                          }}
                        >
                          <span className="hotTopicsRank">{index + 1}</span>
                          <span className="hotTopicsListMain">
                            <span className="hotTopicsListTitle">
                              {note.title}
                            </span>
                            <span className="hotTopicsListSubline">
                              更新于 {formatDateTime(note.updatedAt)}
                            </span>
                            <span className="hotTopicsListPreview">
                              {note.content || "还没有内容"}
                            </span>
                          </span>
                        </button>
                      );
                    })
                  ) : (
                    <div className="hotTopicsEmptyState">
                      <BookText size={18} />
                      <span>还没有自建笔记</span>
                      <Button
                        size="small"
                        type="primary"
                        onClick={handleCreatePersonalNote}
                      >
                        新建一条
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="hotTopicsSide hotTopicsDetail">
                <div className="hotTopicsSectionHead hotTopicsSectionHeadDetail">
                  <span className="hotTopicsSectionTitle">笔记内容</span>
                  {selectedPersonalNote ? (
                    <span className="hotTopicsSectionMeta">
                      {personalNoteMode === "edit" ? "编辑中" : "预览"}
                    </span>
                  ) : null}
                </div>
                {selectedPersonalNote ? (
                  <>
                    <div className="hotTopicsDetailHead">
                      <div>
                        <div className="hotTopicsDetailTitle">
                          {personalNoteMode === "edit"
                            ? "笔记编辑"
                            : "笔记预览"}
                        </div>
                        <div className="hotTopicsDetailMetaRow">
                          <span className="hotTopicsDetailMetaBadge">
                            最近更新 {selectedPersonalNoteUpdatedAt}
                          </span>
                          <span className="hotTopicsDetailMetaBadge">
                            正文 {selectedPersonalNote.content.length} 字
                          </span>
                        </div>
                      </div>
                      <div className="hotTopicsComposerActions hotTopicsNoteModeActions">
                        <div
                          className="hotTopicsTabs"
                          role="tablist"
                          aria-label="笔记模式切换"
                        >
                          <button
                            type="button"
                            className={
                              personalNoteMode === "preview"
                                ? "hotTopicsTab hotTopicsTabActive"
                                : "hotTopicsTab"
                            }
                            onClick={() => setPersonalNoteMode("preview")}
                          >
                            预览
                          </button>
                          <button
                            type="button"
                            className={
                              personalNoteMode === "edit"
                                ? "hotTopicsTab hotTopicsTabActive"
                                : "hotTopicsTab"
                            }
                            onClick={() => setPersonalNoteMode("edit")}
                          >
                            编辑
                          </button>
                        </div>
                        <Button
                          size="small"
                          icon={<Trash2 size={14} />}
                          onClick={() =>
                            handleDeletePersonalNote(selectedPersonalNote.id)
                          }
                        >
                          删除
                        </Button>
                      </div>
                    </div>

                    {personalNoteMode === "edit" ? (
                      <div className="hotTopicsNoteEditor">
                        <div className="hotTopicsField">
                          <div className="hotTopicsFieldLabel">标题</div>
                          <Input
                            value={personalTitleDraft}
                            maxLength={PERSONAL_NOTE_TITLE_MAX_LENGTH}
                            placeholder="笔记标题"
                            onKeyDown={handleNativeSelectAll}
                            onChange={(event) =>
                              setPersonalTitleDraft(event.target.value)
                            }
                          />
                        </div>
                        <div className="hotTopicsField">
                          <div className="hotTopicsFieldLabel">正文</div>
                          <Input.TextArea
                            value={personalContentDraft}
                            maxLength={PERSONAL_NOTE_CONTENT_MAX_LENGTH}
                            autoSize={{ minRows: 9, maxRows: 14 }}
                            placeholder="记录你的易错点、口诀、复盘计划。"
                            onKeyDown={handleNativeSelectAll}
                            onChange={(event) =>
                              setPersonalContentDraft(event.target.value)
                            }
                          />
                        </div>
                        <div className="hotTopicsComposerFooter hotTopicsNoteEditorFooter">
                          <span className="hotTopicsComposerCount">
                            标题 {personalTitleDraft.length} /{" "}
                            {PERSONAL_NOTE_TITLE_MAX_LENGTH}，正文{" "}
                            {personalContentDraft.length} /{" "}
                            {PERSONAL_NOTE_CONTENT_MAX_LENGTH}
                          </span>
                          <div className="hotTopicsComposerActions">
                            <Button
                              size="small"
                              onClick={() => {
                                setPersonalTitleDraft(
                                  selectedPersonalNote.title,
                                );
                                setPersonalContentDraft(
                                  selectedPersonalNote.content,
                                );
                              }}
                            >
                              还原
                            </Button>
                            <Button
                              size="small"
                              type="primary"
                              icon={<PenLine size={14} />}
                              disabled={
                                personalTitleDraft.trim() ===
                                  selectedPersonalNote.title &&
                                personalContentDraft.trim() ===
                                  selectedPersonalNote.content
                              }
                              onClick={handleSavePersonalNote}
                            >
                              保存笔记
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="hotTopicsNotePreviewCard">
                        <div className="hotTopicsNotePreviewHead">
                          <div className="hotTopicsNotePreviewTitle">
                            {selectedPersonalNote.title || "未命名笔记"}
                          </div>
                          <button
                            type="button"
                            className="hotTopicsPreviewEditButton"
                            onClick={() => setPersonalNoteMode("edit")}
                          >
                            <PenLine size={14} />
                            <span>编辑</span>
                          </button>
                        </div>
                        {selectedPersonalNote.content.trim() ? (
                          <div className="hotTopicsNotePreviewContent">
                            {selectedPersonalNote.content}
                          </div>
                        ) : (
                          <div className="hotTopicsHint hotTopicsNotePreviewEmpty">
                            <Eye size={14} />
                            <span>
                              这条笔记还没有内容，切到编辑态开始记录。
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="hotTopicsHint">
                    先新建一条笔记，再开始整理你的重点内容。
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
