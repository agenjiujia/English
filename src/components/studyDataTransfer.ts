const LOCAL_STORAGE_PREFIX = "english-";

export const BACKUP_TYPE = "english-study-backup";
export const BACKUP_VERSION = 1;

type IdbStoreDump = Record<string, unknown>;
type IdbDbDump = Record<string, IdbStoreDump>;

export type BackupData = {
  __type: typeof BACKUP_TYPE;
  version: number;
  exportedAt: number;
  localStorage: Record<string, string>;
  indexedDB: Record<string, IdbDbDump>;
};

export type ImportStrategy = "merge" | "overwrite";

// Mirror of the schemas declared in StudyProgress.ts / StudyAnnotations.tsx so a
// restore can recreate object stores even on a browser with no prior data.
const KNOWN_DB_SCHEMAS: Record<string, { version: number; stores: string[] }> =
  {
    "english-study-storage": {
      version: 1,
      stores: ["annotations", "dictionary"],
    },
    "english-study-progress": {
      version: 2,
      stores: ["mastered", "studyCounts"],
    },
  };

export type CategoryUsage = {
  key: string;
  label: string;
  description: string;
  bytes: number;
  itemCount: number;
};

export type StorageEstimateResult = {
  usage: number;
  quota: number;
  percent: number;
  supported: boolean;
};

function byteLength(value: string) {
  if (typeof Blob !== "undefined") {
    return new Blob([value]).size;
  }
  return new TextEncoder().encode(value).length;
}

function serializedBytes(value: unknown) {
  try {
    return byteLength(JSON.stringify(value) ?? "");
  } catch {
    return 0;
  }
}

function openDb(
  name: string,
  version: number | undefined,
  ensureStores?: string[],
) {
  return new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof window === "undefined" || !("indexedDB" in window)) {
      reject(new Error("当前浏览器不支持 IndexedDB"));
      return;
    }
    const request =
      version === undefined
        ? window.indexedDB.open(name)
        : window.indexedDB.open(name, version);
    request.onupgradeneeded = () => {
      const db = request.result;
      ensureStores?.forEach((store) => {
        if (!db.objectStoreNames.contains(store)) {
          db.createObjectStore(store);
        }
      });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error(`数据库 ${name} 被占用`));
  });
}

async function listBackupDatabaseNames() {
  const known = Object.keys(KNOWN_DB_SCHEMAS);
  const idb = window.indexedDB as IDBFactory & {
    databases?: () => Promise<{ name?: string }[]>;
  };
  if (typeof idb.databases !== "function") {
    return known;
  }
  try {
    const infos = await idb.databases();
    const discovered = infos
      .map((info) => info.name)
      .filter(
        (name): name is string =>
          typeof name === "string" && name.startsWith(LOCAL_STORAGE_PREFIX),
      );
    return Array.from(new Set([...known, ...discovered]));
  } catch {
    return known;
  }
}

async function dumpDatabase(name: string): Promise<IdbDbDump> {
  const schema = KNOWN_DB_SCHEMAS[name];
  const db = await openDb(name, schema?.version, schema?.stores);
  const storeNames = Array.from(db.objectStoreNames);
  const dump: IdbDbDump = {};

  await Promise.all(
    storeNames.map(
      (storeName) =>
        new Promise<void>((resolve) => {
          const tx = db.transaction(storeName, "readonly");
          const store = tx.objectStore(storeName);
          const keysReq = store.getAllKeys();
          const valuesReq = store.getAll();
          tx.oncomplete = () => {
            const keys = keysReq.result || [];
            const values = valuesReq.result || [];
            const entries: IdbStoreDump = {};
            keys.forEach((rawKey, index) => {
              entries[String(rawKey)] = values[index];
            });
            dump[storeName] = entries;
            resolve();
          };
          tx.onerror = () => resolve();
        }),
    ),
  );

  db.close();
  return dump;
}

async function writeDatabase(
  name: string,
  dbDump: IdbDbDump,
  strategy: ImportStrategy,
) {
  const schema = KNOWN_DB_SCHEMAS[name];
  const storeNames = Object.keys(dbDump);
  if (!storeNames.length) return;

  const db = await openDb(name, schema?.version, schema?.stores ?? storeNames);
  const writableStores = storeNames.filter((store) =>
    db.objectStoreNames.contains(store),
  );
  if (!writableStores.length) {
    db.close();
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(writableStores, "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);

    writableStores.forEach((storeName) => {
      const store = tx.objectStore(storeName);
      const incoming = dbDump[storeName] || {};

      if (strategy === "overwrite") {
        store.clear();
        Object.entries(incoming).forEach(([key, value]) => {
          store.put(value, key);
        });
        return;
      }

      Object.entries(incoming).forEach(([key, value]) => {
        const existingReq = store.get(key);
        existingReq.onsuccess = () => {
          const merged = mergeIdbValue(
            name,
            storeName,
            existingReq.result,
            value,
          );
          store.put(merged, key);
        };
      });
    });
  });

  db.close();
}

function uniqueStrings(...lists: unknown[]) {
  const set = new Set<string>();
  lists.forEach((list) => {
    if (Array.isArray(list)) {
      list.forEach((item) => {
        if (typeof item === "string") set.add(item);
      });
    }
  });
  return Array.from(set);
}

function mergeById(existing: unknown, incoming: unknown) {
  const base = Array.isArray(existing) ? existing : [];
  const extra = Array.isArray(incoming) ? incoming : [];
  const byId = new Map<string, unknown>();
  const order: string[] = [];
  const push = (item: unknown) => {
    const id =
      item && typeof item === "object" && "id" in item
        ? String((item as { id: unknown }).id)
        : null;
    if (!id) return;
    if (!byId.has(id)) order.push(id);
    byId.set(id, item);
  };
  base.forEach(push);
  extra.forEach(push);
  return order.map((id) => byId.get(id));
}

function mergeNumberMap(existing: unknown, incoming: unknown) {
  const result: Record<string, number> = {};
  const collect = (source: unknown) => {
    if (source && typeof source === "object") {
      Object.entries(source as Record<string, unknown>).forEach(
        ([key, value]) => {
          if (typeof value === "number") {
            result[key] = Math.max(result[key] ?? 0, value);
          }
        },
      );
    }
  };
  collect(existing);
  collect(incoming);
  return result;
}

function mergeIdbValue(
  dbName: string,
  storeName: string,
  existing: unknown,
  incoming: unknown,
) {
  if (dbName === "english-study-storage" && storeName === "annotations") {
    return mergeById(existing, incoming);
  }
  if (dbName === "english-study-progress" && storeName === "mastered") {
    return uniqueStrings(existing, incoming);
  }
  if (dbName === "english-study-progress" && storeName === "studyCounts") {
    return mergeNumberMap(existing, incoming);
  }
  // dictionary cache and any unknown store: imported wins.
  return incoming;
}

function mergeHotTopicsState(existing: unknown, incoming: unknown) {
  const base = (
    existing && typeof existing === "object" ? existing : {}
  ) as Record<string, unknown>;
  const extra = (
    incoming && typeof incoming === "object" ? incoming : {}
  ) as Record<string, unknown>;
  return {
    ...base,
    ...extra,
    notes: {
      ...(base.notes as object),
      ...(extra.notes as object),
    },
    pinnedIds: uniqueStrings(base.pinnedIds, extra.pinnedIds),
    viewedAt: mergeNumberMap(base.viewedAt, extra.viewedAt),
    personalNotes: mergeById(base.personalNotes, extra.personalNotes),
  };
}

function mergeQuizState(existing: unknown, incoming: unknown) {
  const base = (
    existing && typeof existing === "object" ? existing : {}
  ) as Record<string, unknown>;
  const extra = (
    incoming && typeof incoming === "object" ? incoming : {}
  ) as Record<string, unknown>;
  const baseAnswers = (base.answers as Record<string, unknown>) || {};
  const extraAnswers = (extra.answers as Record<string, unknown>) || {};
  const answers: Record<string, unknown> = { ...baseAnswers };
  Object.entries(extraAnswers).forEach(([paperId, value]) => {
    answers[paperId] = {
      ...((baseAnswers[paperId] as object) || {}),
      ...((value as object) || {}),
    };
  });
  return {
    ...base,
    ...extra,
    answers,
    graded: {
      ...((base.graded as object) || {}),
      ...((extra.graded as object) || {}),
    },
  };
}

function mergeLocalStorageValue(
  key: string,
  existing: string,
  incoming: string,
) {
  let existingParsed: unknown;
  let incomingParsed: unknown;
  try {
    existingParsed = JSON.parse(existing);
    incomingParsed = JSON.parse(incoming);
  } catch {
    return incoming;
  }
  if (key.startsWith("english-hot-topics")) {
    return JSON.stringify(mergeHotTopicsState(existingParsed, incomingParsed));
  }
  if (key.startsWith("english-quiz")) {
    return JSON.stringify(mergeQuizState(existingParsed, incomingParsed));
  }
  return incoming;
}

function collectLocalStorage() {
  const result: Record<string, string> = {};
  if (typeof window === "undefined") return result;
  for (let i = 0; i < window.localStorage.length; i += 1) {
    const key = window.localStorage.key(i);
    if (!key || !key.startsWith(LOCAL_STORAGE_PREFIX)) continue;
    const value = window.localStorage.getItem(key);
    if (value !== null) result[key] = value;
  }
  return result;
}

export async function collectBackup(): Promise<BackupData> {
  const localData = collectLocalStorage();
  const indexedData: Record<string, IdbDbDump> = {};

  if (typeof window !== "undefined" && "indexedDB" in window) {
    const dbNames = await listBackupDatabaseNames();
    await Promise.all(
      dbNames.map(async (name) => {
        try {
          indexedData[name] = await dumpDatabase(name);
        } catch {
          // Skip databases that cannot be opened; the export still succeeds.
        }
      }),
    );
  }

  return {
    __type: BACKUP_TYPE,
    version: BACKUP_VERSION,
    exportedAt: Date.now(),
    localStorage: localData,
    indexedDB: indexedData,
  };
}

export function computeBreakdown(backup: BackupData): CategoryUsage[] {
  const local = backup.localStorage || {};
  const idb = backup.indexedDB || {};

  const hotTopicsKeys = Object.keys(local).filter((key) =>
    key.startsWith("english-hot-topics"),
  );
  const quizKeys = Object.keys(local).filter((key) =>
    key.startsWith("english-quiz"),
  );

  const hotTopicsBytes = hotTopicsKeys.reduce(
    (sum, key) => sum + byteLength(local[key]),
    0,
  );
  let personalNoteCount = 0;
  hotTopicsKeys.forEach((key) => {
    try {
      const parsed = JSON.parse(local[key]) as {
        personalNotes?: unknown[];
      };
      if (Array.isArray(parsed.personalNotes)) {
        personalNoteCount += parsed.personalNotes.length;
      }
    } catch {
      /* ignore malformed entries */
    }
  });

  const annotations =
    (idb["english-study-storage"]?.annotations as IdbStoreDump) || {};
  const dictionary =
    (idb["english-study-storage"]?.dictionary as IdbStoreDump) || {};
  const mastered =
    (idb["english-study-progress"]?.mastered as IdbStoreDump) || {};
  const studyCounts =
    (idb["english-study-progress"]?.studyCounts as IdbStoreDump) || {};

  const annotationCount = Object.values(annotations).reduce<number>(
    (sum, list) => sum + (Array.isArray(list) ? list.length : 0),
    0,
  );
  const masteredCount = Object.values(mastered).reduce<number>(
    (sum, list) => sum + (Array.isArray(list) ? list.length : 0),
    0,
  );

  return [
    {
      key: "notes",
      label: "个人笔记 & 知识点备注",
      description: "我的笔记面板中的自建笔记与逐条备注",
      bytes: hotTopicsBytes,
      itemCount: personalNoteCount,
    },
    {
      key: "annotations",
      label: "页面划线备注",
      description: "正文中高亮、圈注、批注的标记",
      bytes: serializedBytes(annotations),
      itemCount: annotationCount,
    },
    {
      key: "progress",
      label: "学习进度",
      description: "已掌握标记与学习次数",
      bytes: serializedBytes(mastered) + serializedBytes(studyCounts),
      itemCount: masteredCount,
    },
    {
      key: "quiz",
      label: "测验作答记录",
      description: "试卷答题与批阅结果",
      bytes: quizKeys.reduce((sum, key) => sum + byteLength(local[key]), 0),
      itemCount: quizKeys.length,
    },
    {
      key: "dictionary",
      label: "词典缓存",
      description: "查过的单词释义缓存（可随时重新下载）",
      bytes: serializedBytes(dictionary),
      itemCount: Object.keys(dictionary).length,
    },
  ];
}

export async function estimateStorage(): Promise<StorageEstimateResult> {
  if (
    typeof navigator !== "undefined" &&
    navigator.storage &&
    typeof navigator.storage.estimate === "function"
  ) {
    try {
      const { usage = 0, quota = 0 } = await navigator.storage.estimate();
      return {
        usage,
        quota,
        percent: quota > 0 ? Math.min(100, (usage / quota) * 100) : 0,
        supported: true,
      };
    } catch {
      /* fall through to unsupported */
    }
  }
  return { usage: 0, quota: 0, percent: 0, supported: false };
}

export function formatBytes(bytes: number) {
  if (!bytes || bytes < 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(value >= 100 ? 0 : 1)} ${units[unitIndex]}`;
}

export function parseBackup(text: string): BackupData {
  const parsed = JSON.parse(text) as Partial<BackupData>;
  if (
    !parsed ||
    typeof parsed !== "object" ||
    parsed.__type !== BACKUP_TYPE ||
    typeof parsed.localStorage !== "object" ||
    typeof parsed.indexedDB !== "object"
  ) {
    throw new Error("文件格式不正确，请选择本站导出的备份文件");
  }
  return {
    __type: BACKUP_TYPE,
    version:
      typeof parsed.version === "number" ? parsed.version : BACKUP_VERSION,
    exportedAt:
      typeof parsed.exportedAt === "number" ? parsed.exportedAt : Date.now(),
    localStorage: parsed.localStorage as Record<string, string>,
    indexedDB: parsed.indexedDB as Record<string, IdbDbDump>,
  };
}

export async function applyBackup(
  backup: BackupData,
  strategy: ImportStrategy,
) {
  if (typeof window !== "undefined") {
    if (strategy === "overwrite") {
      const staleKeys: string[] = [];
      for (let i = 0; i < window.localStorage.length; i += 1) {
        const key = window.localStorage.key(i);
        if (key && key.startsWith(LOCAL_STORAGE_PREFIX)) staleKeys.push(key);
      }
      staleKeys.forEach((key) => window.localStorage.removeItem(key));
    }

    Object.entries(backup.localStorage || {}).forEach(([key, value]) => {
      if (strategy === "overwrite") {
        window.localStorage.setItem(key, value);
        return;
      }
      const existing = window.localStorage.getItem(key);
      window.localStorage.setItem(
        key,
        existing === null
          ? value
          : mergeLocalStorageValue(key, existing, value),
      );
    });
  }

  const dbEntries = Object.entries(backup.indexedDB || {});
  for (const [name, dump] of dbEntries) {
    try {
      await writeDatabase(name, dump, strategy);
    } catch {
      // Continue restoring other databases even if one fails.
    }
  }
}

export function downloadBackupFile(backup: BackupData) {
  const stamp = new Date(backup.exportedAt);
  const pad = (value: number) => String(value).padStart(2, "0");
  const name = `english-study-backup-${stamp.getFullYear()}${pad(
    stamp.getMonth() + 1,
  )}${pad(stamp.getDate())}-${pad(stamp.getHours())}${pad(
    stamp.getMinutes(),
  )}.json`;
  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
