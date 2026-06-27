import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Divider,
  Drawer,
  Input,
  Popover,
  Popconfirm,
  Space,
  Spin,
  Tag,
} from "antd";
import {
  CommentOutlined,
  SearchOutlined,
  SoundOutlined,
} from "@ant-design/icons";

type AnnotationStyle = {
  bold?: boolean;
  background?: string;
  color?: string;
  fontSize?: string;
  circle?: boolean;
  note?: string;
};

type Annotation = AnnotationStyle & {
  id: string;
  targetId: string;
  start: number;
  end: number;
};

type NoteAnnotation = Annotation & {
  note: string;
};

const paletteOptions = [
  {
    label: "黄底",
    color: "#f7c948",
    style: { background: "#fff0a8" },
  },
  {
    label: "绿底",
    color: "#3bb273",
    style: { background: "#d9f7e8" },
  },
  {
    label: "红字",
    color: "#e5484d",
    style: {
      color: "#d92d20",
      bold: true,
      fontSize: "calc(1em + 2px)",
    },
  },
  {
    label: "蓝字",
    color: "#2f80ed",
    style: { color: "#1677ff", bold: true },
  },
] satisfies Array<{
  label: string;
  color: string;
  style: AnnotationStyle;
}>;

type SelectionState = {
  targetId: string;
  start: number;
  end: number;
  top: number;
  left: number;
  text: string;
};

type DictionaryPhonetic = {
  text?: string;
  audio?: string;
};

type DictionaryDefinition = {
  definition: string;
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
};

type DictionaryMeaning = {
  partOfSpeech: string;
  definitions: DictionaryDefinition[];
};

type DictionaryEntry = {
  word: string;
  phonetic?: string;
  phonetics?: DictionaryPhonetic[];
  meanings?: DictionaryMeaning[];
};

const DB_NAME = "english-study-storage";
const DB_VERSION = 1;
const TOOLBAR_ESTIMATED_HEIGHT = 104;
const TOOLBAR_SELECTION_GAP = 14;

type StoreName = "annotations" | "dictionary";

function openStudyDB() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("当前浏览器不支持 IndexedDB"));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("annotations")) {
        db.createObjectStore("annotations");
      }
      if (!db.objectStoreNames.contains("dictionary")) {
        db.createObjectStore("dictionary");
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function idbGet<T>(storeName: StoreName, key: string) {
  const db = await openStudyDB();
  return new Promise<T | undefined>((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly");
    const request = transaction.objectStore(storeName).get(key);
    request.onsuccess = () => resolve(request.result as T | undefined);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => db.close();
  });
}

async function idbSet<T>(storeName: StoreName, key: string, value: T) {
  const db = await openStudyDB();
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const request = transaction.objectStore(storeName).put(value, key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => db.close();
  });
}

function getLookupWord(text: string) {
  return (
    text
      .trim()
      .match(/[A-Za-z][A-Za-z'-]*/)?.[0]
      .toLowerCase() || ""
  );
}

function speakText(text: string) {
  if (!("speechSynthesis" in window)) return false;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.85;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
  return true;
}

function playDictionaryAudio(entries: DictionaryEntry[]) {
  const audioUrl = entries
    .flatMap((entry) => entry.phonetics || [])
    .map((phonetic) => phonetic.audio)
    .find(Boolean);

  if (!audioUrl) return false;
  const audio = new Audio(audioUrl);
  void audio.play();
  return true;
}

async function fetchDictionary(word: string) {
  try {
    const cached = await idbGet<DictionaryEntry[]>("dictionary", word);
    if (cached) return cached;
  } catch {
    // Query network below if IndexedDB is temporarily unavailable.
  }

  const response = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`,
  );
  if (!response.ok) {
    throw new Error("未查到这个单词");
  }

  const data = (await response.json()) as DictionaryEntry[];
  try {
    await idbSet("dictionary", word, data);
  } catch {
    // Dictionary lookup still succeeds even if cache write fails.
  }
  return data;
}

async function fetchFreeChineseTranslation(text: string) {
  const response = await fetch(
    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q=${encodeURIComponent(
      text,
    )}`,
  );
  if (!response.ok) {
    throw new Error("翻译服务暂时不可用");
  }
  const data = (await response.json()) as unknown;
  if (!Array.isArray(data) || !Array.isArray(data[0])) return "";
  const parts = data[0]
    .map((item) => (Array.isArray(item) ? item[0] : ""))
    .filter((item): item is string => typeof item === "string" && Boolean(item))
    .join("");
  return parts.trim();
}

function getTextOffset(container: HTMLElement, node: Node, offset: number) {
  const range = document.createRange();
  range.selectNodeContents(container);
  range.setEnd(node, offset);
  return range.toString().length;
}

function overlaps(a: Annotation, start: number, end: number) {
  return a.start < end && start < a.end;
}

function hasRenderableStyle(item: AnnotationStyle) {
  return Boolean(
    item.bold || item.background || item.color || item.fontSize || item.circle,
  );
}

function getTargetElement(node: Node | null) {
  const element =
    node instanceof HTMLElement ? node : node?.parentElement || null;
  return element?.closest<HTMLElement>("[data-markable-id]") || null;
}

type AnnotationNoteActionsContextValue = {
  updateNote: (annotationId: string, note: string) => void;
  deleteNote: (annotationId: string) => void;
};

const AnnotationNoteActionsContext =
  React.createContext<AnnotationNoteActionsContextValue | null>(null);

export function StudyAnnotationsProvider({
  children,
  updateNote,
  deleteNote,
}: {
  children: React.ReactNode;
  updateNote: (annotationId: string, note: string) => void;
  deleteNote: (annotationId: string) => void;
}) {
  const value = useMemo(
    () => ({
      updateNote,
      deleteNote,
    }),
    [deleteNote, updateNote],
  );

  return (
    <AnnotationNoteActionsContext.Provider value={value}>
      {children}
    </AnnotationNoteActionsContext.Provider>
  );
}

export function useStudyAnnotations(pageKey: string) {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [selection, setSelection] = useState<SelectionState | null>(null);

  const commitAnnotation = useCallback(
    (targetSelection: SelectionState, style: AnnotationStyle) => {
      setAnnotations((current) => [
        ...current,
        {
          ...style,
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          targetId: targetSelection.targetId,
          start: targetSelection.start,
          end: targetSelection.end,
        },
      ]);
    },
    [],
  );

  useEffect(() => {
    let cancelled = false;

    const loadAnnotations = async () => {
      try {
        const indexed = await idbGet<Annotation[]>("annotations", pageKey);
        if (cancelled) return;

        if (indexed) {
          setAnnotations(indexed);
          setHydrated(true);
          return;
        }
      } catch {
        if (!cancelled) {
          setAnnotations([]);
        }
      } finally {
        if (!cancelled) {
          setHydrated(true);
        }
      }
    };

    void loadAnnotations();
    return () => {
      cancelled = true;
    };
  }, [pageKey]);

  useEffect(() => {
    if (!hydrated) return;
    void idbSet("annotations", pageKey, annotations).catch(() => undefined);
  }, [annotations, hydrated, pageKey]);

  useEffect(() => {
    const updateSelection = () => {
      const selected = window.getSelection();
      if (!selected || selected.isCollapsed || selected.rangeCount === 0) {
        setSelection(null);
        return;
      }

      const range = selected.getRangeAt(0);
      const startElement = getTargetElement(range.startContainer);
      const endElement = getTargetElement(range.endContainer);
      if (!startElement || !endElement || startElement !== endElement) {
        setSelection(null);
        return;
      }

      const start = getTextOffset(
        startElement,
        range.startContainer,
        range.startOffset,
      );
      const end = getTextOffset(
        startElement,
        range.endContainer,
        range.endOffset,
      );
      const normalizedStart = Math.min(start, end);
      const normalizedEnd = Math.max(start, end);
      if (normalizedStart === normalizedEnd) {
        setSelection(null);
        return;
      }

      const rect = range.getBoundingClientRect();
      const toolbarTop =
        rect.top > TOOLBAR_ESTIMATED_HEIGHT + TOOLBAR_SELECTION_GAP
          ? rect.top +
            window.scrollY -
            TOOLBAR_ESTIMATED_HEIGHT -
            TOOLBAR_SELECTION_GAP
          : rect.bottom + window.scrollY + TOOLBAR_SELECTION_GAP;

      setSelection({
        targetId: startElement.dataset.markableId || "",
        start: normalizedStart,
        end: normalizedEnd,
        top: toolbarTop,
        left: rect.left + window.scrollX + rect.width / 2,
        text: range.toString().trim(),
      });
    };

    document.addEventListener("mouseup", updateSelection);
    document.addEventListener("keyup", updateSelection);
    return () => {
      document.removeEventListener("mouseup", updateSelection);
      document.removeEventListener("keyup", updateSelection);
    };
  }, []);

  const applyAnnotation = useCallback(
    (style: AnnotationStyle) => {
      if (!selection) return;
      commitAnnotation(selection, style);
      window.getSelection()?.removeAllRanges();
      setSelection(null);
    },
    [commitAnnotation, selection],
  );

  const applyAnnotationAtSelection = useCallback(
    (targetSelection: SelectionState, style: AnnotationStyle) => {
      commitAnnotation(targetSelection, style);
      window.getSelection()?.removeAllRanges();
      setSelection(null);
    },
    [commitAnnotation],
  );

  const clearSelection = useCallback(() => {
    if (!selection) return;
    setAnnotations((current) =>
      current.filter(
        (item) =>
          item.targetId !== selection.targetId ||
          !overlaps(item, selection.start, selection.end),
      ),
    );
    window.getSelection()?.removeAllRanges();
    setSelection(null);
  }, [selection]);

  const clearAll = useCallback(() => {
    setAnnotations([]);
    setSelection(null);
  }, []);

  const updateNote = useCallback((annotationId: string, note: string) => {
    const trimmed = note.trim();
    setAnnotations((current) =>
      current.flatMap((item) => {
        if (item.id !== annotationId) {
          return [item];
        }

        if (trimmed) {
          return [{ ...item, note: trimmed }];
        }

        if (hasRenderableStyle(item)) {
          return [{ ...item, note: undefined }];
        }

        return [];
      }),
    );
  }, []);

  const deleteNote = useCallback((annotationId: string) => {
    setAnnotations((current) =>
      current.flatMap((item) => {
        if (item.id !== annotationId) {
          return [item];
        }

        if (hasRenderableStyle(item)) {
          return [{ ...item, note: undefined }];
        }

        return [];
      }),
    );
  }, []);

  const getAnnotations = useCallback(
    (targetId: string) =>
      annotations.filter((item) => item.targetId === targetId),
    [annotations],
  );

  return {
    selection,
    annotations,
    applyAnnotation,
    applyAnnotationAtSelection,
    clearSelection,
    clearAll,
    updateNote,
    deleteNote,
    getAnnotations,
  };
}

function AnnotationNotePopover({
  children,
  notes,
}: {
  children: React.ReactNode;
  notes: NoteAnnotation[];
}) {
  const noteActions = React.useContext(AnnotationNoteActionsContext);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const handleStartEdit = (note: NoteAnnotation) => {
    setEditingId(note.id);
    setDraft(note.note);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setDraft("");
  };

  const handleSaveEdit = () => {
    if (!editingId || !noteActions) return;
    const trimmed = draft.trim();
    if (!trimmed) return;
    noteActions.updateNote(editingId, trimmed);
    setEditingId(null);
    setDraft("");
  };

  const handleDelete = (annotationId: string) => {
    if (!noteActions) return;
    noteActions.deleteNote(annotationId);
    if (editingId === annotationId) {
      setEditingId(null);
      setDraft("");
    }
  };

  return (
    <Popover
      trigger="hover"
      placement="top"
      overlayClassName="annotationNotePopover"
      content={
        <div className="annotationNoteCard">
          {notes.map((note) => (
            <div key={note.id} className="annotationNoteItem">
              {editingId === note.id ? (
                <>
                  <Input.TextArea
                    value={draft}
                    autoSize={{ minRows: 2, maxRows: 4 }}
                    maxLength={160}
                    showCount
                    onChange={(event) => setDraft(event.target.value)}
                  />
                  <div className="annotationNoteItemActions">
                    <Button size="small" onClick={handleCancelEdit}>
                      取消
                    </Button>
                    <Button
                      size="small"
                      type="primary"
                      disabled={!draft.trim()}
                      onClick={handleSaveEdit}
                    >
                      保存
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="annotationNoteText">{note.note}</div>
                  {noteActions ? (
                    <div className="annotationNoteItemActions">
                      <Button
                        size="small"
                        type="text"
                        onClick={() => handleStartEdit(note)}
                      >
                        编辑
                      </Button>
                      <Popconfirm
                        title="删除这条备注？"
                        description="删除后将无法恢复。"
                        okText="删除"
                        cancelText="取消"
                        okButtonProps={{ danger: true }}
                        onConfirm={() => handleDelete(note.id)}
                      >
                        <Button size="small" type="text" danger>
                          删除
                        </Button>
                      </Popconfirm>
                    </div>
                  ) : null}
                </>
              )}
            </div>
          ))}
        </div>
      }
    >
      <span className="annotationNoteInline">{children}</span>
    </Popover>
  );
}

export function MarkableText({
  id,
  text,
  annotations,
}: {
  id: string;
  text: string;
  annotations: Annotation[];
}) {
  const segments = useMemo(() => {
    const points = new Set([0, text.length]);
    annotations.forEach((item) => {
      points.add(Math.max(0, Math.min(text.length, item.start)));
      points.add(Math.max(0, Math.min(text.length, item.end)));
    });
    const sorted = [...points].sort((a, b) => a - b);
    return sorted.slice(0, -1).map((start, index) => {
      const end = sorted[index + 1];
      const active = annotations.filter(
        (item) => item.start < end && start < item.end,
      );
      return { start, end, active, text: text.slice(start, end) };
    });
  }, [annotations, text]);

  return (
    <span className="markableText" data-markable-id={id}>
      {segments.map((segment, segmentIndex) => {
        const noteAnnotations = segment.active
          .filter(
            (item): item is NoteAnnotation =>
              typeof item.note === "string" && Boolean(item.note.trim()),
          )
          .map((item) => ({
            ...item,
            note: item.note.trim(),
          }));
        const previousNoteIds = new Set(
          (segments[segmentIndex - 1]?.active || [])
            .filter(
              (item): item is NoteAnnotation =>
                typeof item.note === "string" && Boolean(item.note.trim()),
            )
            .map((item) => item.id),
        );
        const showNoteIcon =
          noteAnnotations.length > 0 &&
          noteAnnotations.some((item) => !previousNoteIds.has(item.id));
        const style = segment.active.reduce<React.CSSProperties>(
          (result, item) => ({
            ...result,
            backgroundColor: item.background || result.backgroundColor,
            color: item.color || result.color,
            fontSize: item.fontSize || result.fontSize,
          }),
          {},
        );
        const className = [
          "annotationMark",
          segment.active.some((item) => item.bold) ? "annotationBold" : "",
          segment.active.some((item) => item.circle) ? "annotationCircle" : "",
          noteAnnotations.length > 0 ? "annotationNote" : "",
        ]
          .filter(Boolean)
          .join(" ");

        const content = (
          <span
            key={`${segment.start}-${segment.end}`}
            className={className}
            style={style}
          >
            {showNoteIcon ? (
              <span className="annotationNoteLeadIcon" aria-hidden="true">
                注
              </span>
            ) : null}
            {segment.text}
          </span>
        );

        if (noteAnnotations.length === 0) {
          return content;
        }

        return (
          <AnnotationNotePopover
            key={`${segment.start}-${segment.end}`}
            notes={noteAnnotations}
          >
            {content}
          </AnnotationNotePopover>
        );
      })}
    </span>
  );
}

export function AnnotationToolbar({
  selection,
  applyAnnotation,
  applyAnnotationAtSelection,
  clearSelection,
  clearAll,
}: {
  selection: SelectionState | null;
  applyAnnotation: (style: AnnotationStyle) => void;
  applyAnnotationAtSelection: (
    targetSelection: SelectionState,
    style: AnnotationStyle,
  ) => void;
  clearSelection: () => void;
  clearAll: () => void;
}) {
  const [noteEditorOpen, setNoteEditorOpen] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");
  const [noteSelection, setNoteSelection] = useState<SelectionState | null>(
    null,
  );
  const [dictionaryOpen, setDictionaryOpen] = useState(false);
  const [lookupWord, setLookupWord] = useState("");
  const [lookupText, setLookupText] = useState("");
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lookupWarning, setLookupWarning] = useState("");
  const [zhTranslation, setZhTranslation] = useState("");
  const [zhError, setZhError] = useState("");
  const [definitionTranslations, setDefinitionTranslations] = useState<
    Record<string, string>
  >({});
  const lookupRequestRef = React.useRef(0);
  const toolbarSelection = selection || noteSelection;
  const selectedText = toolbarSelection?.text.trim() || "";
  const word = getLookupWord(selectedText);
  const isSingleWordSelection = /^[A-Za-z][A-Za-z'-]*$/.test(selectedText);

  React.useEffect(() => {
    if (!selection && !noteEditorOpen) {
      setNoteDraft("");
      setNoteSelection(null);
    }
  }, [noteEditorOpen, selection]);

  if (!toolbarSelection && !dictionaryOpen && !noteEditorOpen) return null;

  const handleSpeak = () => {
    if (!selectedText) return;
    speakText(selectedText);
  };

  const handleDictionary = async () => {
    const requestId = ++lookupRequestRef.current;
    if (!selectedText) {
      setError("请先选中英文内容后再查词。");
      setEntries([]);
      setLookupWord("");
      setLookupText("");
      setDictionaryOpen(true);
      return;
    }

    setDictionaryOpen(true);
    setLookupWord(word);
    setLookupText(selectedText);
    setLoading(true);
    setError("");
    setLookupWarning("");
    setZhTranslation("");
    setZhError("");
    setDefinitionTranslations({});
    try {
      const translationResultPromise =
        fetchFreeChineseTranslation(selectedText);
      const dictionaryResultPromise =
        isSingleWordSelection && word
          ? fetchDictionary(word)
          : Promise.resolve<DictionaryEntry[]>([]);

      const [dictionaryResult, translationResult] = await Promise.allSettled([
        dictionaryResultPromise,
        translationResultPromise,
      ]);

      const hasDictionaryResult =
        dictionaryResult.status === "fulfilled" &&
        dictionaryResult.value.length > 0;
      const hasTranslationResult =
        translationResult.status === "fulfilled" &&
        Boolean(translationResult.value);

      if (hasDictionaryResult) {
        setEntries(dictionaryResult.value);
      } else {
        setEntries([]);
        if (isSingleWordSelection) {
          setLookupWarning("词典释义暂不可用，已尝试展示中文翻译。");
        }
      }

      if (hasTranslationResult) {
        setZhTranslation(translationResult.value);
      } else if (hasDictionaryResult) {
        setZhError("中文翻译暂不可用，已展示英文释义。");
      }

      if (!hasDictionaryResult && !hasTranslationResult) {
        throw new Error("查词与翻译都失败了，请稍后再试。");
      }

      if (
        dictionaryResult.status === "fulfilled" &&
        dictionaryResult.value.length
      ) {
        const texts = dictionaryResult.value
          .flatMap((entry) => entry.meanings || [])
          .flatMap((meaning) => meaning.definitions.slice(0, 4))
          .flatMap((item) =>
            [item.definition, item.example || ""].filter(Boolean),
          );
        const uniqueTexts = [...new Set(texts)].slice(0, 12);
        if (uniqueTexts.length > 0) {
          void (async () => {
            const translated = await Promise.allSettled(
              uniqueTexts.map(async (itemText) => ({
                text: itemText,
                translated: await fetchFreeChineseTranslation(itemText),
              })),
            );
            if (requestId !== lookupRequestRef.current) return;
            const mapping = translated.reduce<Record<string, string>>(
              (result, item) => {
                if (item.status === "fulfilled" && item.value.translated) {
                  result[item.value.text] = item.value.translated;
                }
                return result;
              },
              {},
            );
            setDefinitionTranslations(mapping);
          })();
        }
      }
    } catch (err) {
      setEntries([]);
      setError(err instanceof Error ? err.message : "查词失败，请稍后再试。");
    } finally {
      setLoading(false);
    }
  };

  const handleAudio = () => {
    if (!playDictionaryAudio(entries) && lookupWord) {
      speakText(lookupWord);
    }
  };

  const handleOpenNoteEditor = () => {
    if (!selection) return;
    setNoteSelection(selection);
    setNoteDraft("");
    setNoteEditorOpen(true);
  };

  const handleSaveNote = () => {
    const trimmed = noteDraft.trim();
    const targetSelection = noteSelection || selection;
    if (!trimmed || !targetSelection) return;
    applyAnnotationAtSelection(targetSelection, { note: trimmed });
    setNoteDraft("");
    setNoteEditorOpen(false);
    setNoteSelection(null);
  };

  const handleCancelNote = () => {
    setNoteDraft("");
    setNoteEditorOpen(false);
    setNoteSelection(null);
  };

  return (
    <>
      {toolbarSelection ? (
        <div
          className="annotationToolbar"
          style={{ top: toolbarSelection.top, left: toolbarSelection.left }}
        >
          <div className="annotationToolbarInner">
            <div className="annotationMainPanel">
              <div className="annotationPalette" aria-label="标记颜色">
                {paletteOptions.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    className="annotationColorButton"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => applyAnnotation(item.style)}
                    title={item.label}
                  >
                    <span
                      className="annotationColorSwatch"
                      style={
                        { "--swatch-color": item.color } as React.CSSProperties
                      }
                    />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              <div className="annotationToolGroup">
                <button
                  type="button"
                  className="annotationToolButton"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={handleSpeak}
                >
                  <SoundOutlined />
                  <span>朗读</span>
                </button>
                <button
                  type="button"
                  className="annotationToolButton"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={handleDictionary}
                >
                  <SearchOutlined />
                  <span>查词</span>
                </button>
                <button
                  type="button"
                  className="annotationToolButton strong"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => applyAnnotation({ bold: true })}
                >
                  <span>B</span>
                  <span>加粗</span>
                </button>
                <button
                  type="button"
                  className="annotationToolButton"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => applyAnnotation({ circle: true })}
                >
                  <span className="circleIcon">○</span>
                  <span>画圈</span>
                </button>
                <button
                  type="button"
                  className="annotationToolButton"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={handleOpenNoteEditor}
                >
                  <CommentOutlined />
                  <span>备注</span>
                </button>
              </div>
            </div>

            <div className="annotationDangerGroup">
              <button
                type="button"
                className="annotationDangerButton"
                onMouseDown={(event) => event.preventDefault()}
                onClick={clearSelection}
              >
                清除所选
              </button>
              <Popconfirm
                title="清空本页所有标记？"
                okText="清空"
                cancelText="取消"
                onConfirm={clearAll}
              >
                <button
                  type="button"
                  className="annotationDangerButton"
                  onMouseDown={(event) => event.preventDefault()}
                >
                  清空本页
                </button>
              </Popconfirm>
            </div>
          </div>

          {noteEditorOpen ? (
            <div className="annotationNoteEditor">
              <div className="annotationNoteEditorHeader">添加备注</div>
              <Input.TextArea
                value={noteDraft}
                rows={3}
                maxLength={160}
                showCount
                placeholder="输入这段内容的学习备注，hover 时会显示。"
                onChange={(event) => setNoteDraft(event.target.value)}
              />
              <div className="annotationNoteEditorActions">
                <button
                  type="button"
                  className="annotationToolButton"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={handleCancelNote}
                >
                  取消
                </button>
                <button
                  type="button"
                  className="annotationToolButton strong"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={handleSaveNote}
                  disabled={!noteDraft.trim()}
                >
                  保存备注
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      <Drawer
        title={
          lookupText
            ? isSingleWordSelection && lookupWord
              ? `单词信息：${lookupWord}`
              : "句子翻译"
            : "单词信息"
        }
        open={dictionaryOpen}
        width={420}
        onClose={() => setDictionaryOpen(false)}
      >
        {loading ? (
          <div className="dictionaryLoading">
            <Spin />
          </div>
        ) : error ? (
          <Alert type="warning" showIcon message={error} />
        ) : entries.length > 0 || zhTranslation || zhError ? (
          <div className="dictionaryPanel">
            {lookupWarning ? (
              <Alert
                type="warning"
                showIcon
                style={{ marginBottom: 14 }}
                message={lookupWarning}
              />
            ) : null}
            {entries.length > 0 ? (
              <>
                <Space align="center" wrap>
                  <span className="dictionaryWord">{entries[0].word}</span>
                  {entries
                    .flatMap((entry) => [
                      entry.phonetic,
                      ...(entry.phonetics || []).map((item) => item.text),
                    ])
                    .filter(Boolean)
                    .slice(0, 3)
                    .map((phonetic) => (
                      <Tag key={phonetic}>{phonetic}</Tag>
                    ))}
                  <Button
                    size="small"
                    icon={<SoundOutlined />}
                    onClick={handleAudio}
                  >
                    播放
                  </Button>
                </Space>

                <Divider />
              </>
            ) : null}
            {zhTranslation ? (
              <Alert
                type="success"
                showIcon
                style={{ marginBottom: 14 }}
                message={`中文释义：${zhTranslation}`}
              />
            ) : zhError ? (
              <Alert
                type="info"
                showIcon
                style={{ marginBottom: 14 }}
                message={zhError}
              />
            ) : null}

            {entries
              .flatMap((entry) => entry.meanings || [])
              .map((meaning, meaningIndex) => (
                <div
                  key={`${meaning.partOfSpeech}-${meaningIndex}`}
                  className="dictionaryMeaning"
                >
                  <Tag color="blue">{meaning.partOfSpeech}</Tag>
                  {meaning.definitions.slice(0, 4).map((item, index) => (
                    <div
                      key={`${item.definition}-${index}`}
                      className="dictionaryDefinition"
                    >
                      <div>
                        {index + 1}. {item.definition}
                      </div>
                      {definitionTranslations[item.definition] ? (
                        <div className="dictionaryRelated">
                          释义：{definitionTranslations[item.definition]}
                        </div>
                      ) : null}
                      {item.example ? (
                        <div className="dictionaryExample">
                          例句：{item.example}
                        </div>
                      ) : null}
                      {item.example && definitionTranslations[item.example] ? (
                        <div className="dictionaryRelated">
                          例句译文：{definitionTranslations[item.example]}
                        </div>
                      ) : null}
                      {item.synonyms && item.synonyms.length > 0 ? (
                        <div className="dictionaryRelated">
                          同义词：{item.synonyms.slice(0, 6).join(", ")}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              ))}
          </div>
        ) : (
          <Alert
            type="info"
            showIcon
            message="选中英文单词或句子后点击查词。"
          />
        )}
      </Drawer>
    </>
  );
}
