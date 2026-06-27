import { useCallback, useEffect, useMemo, useState } from "react";

const DB_NAME = "english-study-progress";
const DB_VERSION = 2;
const MASTERED_STORE_NAME = "mastered";
const STUDY_COUNTS_STORE_NAME = "studyCounts";

function normalizeStudyCount(count: number) {
  if (!Number.isFinite(count)) return 0;
  return Math.max(0, Math.floor(count));
}

function openProgressDB() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(MASTERED_STORE_NAME)) {
        db.createObjectStore(MASTERED_STORE_NAME);
      }
      if (!db.objectStoreNames.contains(STUDY_COUNTS_STORE_NAME)) {
        db.createObjectStore(STUDY_COUNTS_STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getMasteredIds(pageKey: string) {
  const db = await openProgressDB();
  return new Promise<string[]>((resolve, reject) => {
    const transaction = db.transaction(MASTERED_STORE_NAME, "readonly");
    const request = transaction.objectStore(MASTERED_STORE_NAME).get(pageKey);
    request.onsuccess = () => resolve((request.result as string[]) || []);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => db.close();
  });
}

async function setMasteredIds(pageKey: string, ids: string[]) {
  const db = await openProgressDB();
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(MASTERED_STORE_NAME, "readwrite");
    const request = transaction.objectStore(MASTERED_STORE_NAME).put(ids, pageKey);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => db.close();
  });
}

async function getStudyCounts(pageKey: string) {
  const db = await openProgressDB();
  return new Promise<Record<string, number>>((resolve, reject) => {
    const transaction = db.transaction(STUDY_COUNTS_STORE_NAME, "readonly");
    const request = transaction.objectStore(STUDY_COUNTS_STORE_NAME).get(pageKey);
    request.onsuccess = () =>
      resolve((request.result as Record<string, number>) || {});
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => db.close();
  });
}

async function setStudyCounts(pageKey: string, counts: Record<string, number>) {
  const db = await openProgressDB();
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STUDY_COUNTS_STORE_NAME, "readwrite");
    const request = transaction
      .objectStore(STUDY_COUNTS_STORE_NAME)
      .put(counts, pageKey);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => db.close();
  });
}

export function useStudyProgress(pageKey: string) {
  const [masteredIds, setMasteredIdsState] = useState<string[]>([]);
  const [studyCounts, setStudyCountsState] = useState<Record<string, number>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [ids, counts] = await Promise.all([
          getMasteredIds(pageKey),
          getStudyCounts(pageKey),
        ]);
        if (!cancelled) {
          setMasteredIdsState(ids);
          setStudyCountsState(counts);
        }
      } catch {
        if (!cancelled) {
          setMasteredIdsState([]);
          setStudyCountsState({});
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

  useEffect(() => {
    if (!hydrated) return;
    void setStudyCounts(pageKey, studyCounts).catch(() => undefined);
  }, [hydrated, pageKey, studyCounts]);

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

  const getStudyCount = useCallback(
    (id: string) => studyCounts[id] || 0,
    [studyCounts],
  );

  const incrementStudyCount = useCallback((id: string) => {
    setStudyCountsState((current) => ({
      ...current,
      [id]: (current[id] || 0) + 1,
    }));
  }, []);

  const decrementStudyCount = useCallback((id: string) => {
    setStudyCountsState((current) => {
      const nextCount = normalizeStudyCount((current[id] || 0) - 1);
      if (nextCount === 0) {
        const { [id]: _removed, ...rest } = current;
        return rest;
      }
      return {
        ...current,
        [id]: nextCount,
      };
    });
  }, []);

  const setStudyCount = useCallback((id: string, count: number) => {
    setStudyCountsState((current) => {
      const nextCount = normalizeStudyCount(count);
      if (nextCount === 0) {
        const { [id]: _removed, ...rest } = current;
        return rest;
      }
      return {
        ...current,
        [id]: nextCount,
      };
    });
  }, []);

  return {
    masteredIds,
    studyCounts,
    isMastered,
    toggleMastered,
    setMastered,
    getStudyCount,
    incrementStudyCount,
    decrementStudyCount,
    setStudyCount,
  };
}
