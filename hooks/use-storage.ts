"use client";

import { useSyncExternalStore, useCallback } from "react";
import { subscribe } from "@/lib/storage";

export function useStorage<T>(getter: () => T): T {
  const getSnapshot = useCallback(() => {
    try {
      return getter();
    } catch {
      return getter();
    }
  }, [getter]);

  const getServerSnapshot = useCallback((): T => {
    // Return a stable default for SSR — the actual value hydrates on client
    return undefined as unknown as T;
  }, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
