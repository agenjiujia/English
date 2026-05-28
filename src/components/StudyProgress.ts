import { useCallback, useEffect, useMemo, useState } from "react";

const DB_NAME = "english-study-progress";
const DB_VERSION = 1;
const STORE_NAME = "mastered";

function openProgressDB() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getMasteredIds(pageKey: string) {
  const db = await openProgressDB();
  return new Promise<string[]>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const request = transaction.objectStore(STORE_NAME).get(pageKey);
    request.onsuccess = () => resolve((request.result as string[]) || []);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => db.close();
  });
}

async function setMasteredIds(pageKey: string, ids: string[]) {
  const db = await openProgressDB();
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const request = transaction.objectStore(STORE_NAME).put(ids, pageKey);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => db.close();
  });
}

export function useStudyProgress(pageKey: string) {
  const [masteredIds, setMasteredIdsState] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const ids = await getMasteredIds(pageKey);
        if (!cancelled) {
          setMasteredIdsState(ids);
        }
      } catch {
        if (!cancelled) {
          setMasteredIdsState([]);
        }
      } finally {
        if (!cancelled) {
          setHydrated(true);
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [pageKey]);

  useEffect(() => {
    if (!hydrated) return;
    void setMasteredIds(pageKey, masteredIds).catch(() => undefined);
  }, [hydrated, masteredIds, pageKey]);

  const masteredSet = useMemo(() => new Set(masteredIds), [masteredIds]);

  const isMastered = useCallback(
    (id: string) => masteredSet.has(id),
    [masteredSet],
  );

  const toggleMastered = useCallback((id: string) => {
    setMasteredIdsState((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return [...next];
    });
  }, []);

  const setMastered = useCallback((ids: string[], mastered: boolean) => {
    setMasteredIdsState((current) => {
      const next = new Set(current);
      ids.forEach((id) => {
        if (mastered) {
          next.add(id);
        } else {
          next.delete(id);
        }
      });
      return [...next];
    });
  }, []);

  return {
    masteredIds,
    isMastered,
    toggleMastered,
    setMastered,
  };
}
