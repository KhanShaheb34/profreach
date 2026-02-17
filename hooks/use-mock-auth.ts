"use client";

import { useEffect, useState } from "react";
import { getIsAuthenticated, subscribe } from "@/lib/storage";

export function useMockAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === "undefined") return false;
    return getIsAuthenticated();
  });
  const [isReady, setIsReady] = useState(() => typeof window === "undefined");

  useEffect(() => {
    const sync = () => {
      setIsAuthenticated(getIsAuthenticated());
      setIsReady(true);
    };

    sync();
    const unsubscribe = subscribe(sync);
    return unsubscribe;
  }, []);

  return { isAuthenticated, isReady };
}
