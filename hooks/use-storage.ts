"use client";

import { useSyncExternalStore, useCallback, useRef } from "react";
import { subscribe } from "@/lib/storage";

export function useStorage<T>(getter: () => T): T {
  const cacheRef = useRef<{ json: string; value: T } | null>(null);

  const getSnapshot = useCallback(() => {
    const value = getter();
    const json = JSON.stringify(value);

    if (cacheRef.current && cacheRef.current.json === json) {
      return cacheRef.current.value;
    }

    cacheRef.current = { json, value };
    return value;
  }, [getter]);

  const getServerSnapshot = useCallback((): T => {
    // Resolve to storage getter fallback values during server render
    // (e.g. empty arrays/default profile), preventing undefined snapshots.
    return getter();
  }, [getter]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
