"use client";

import { useCallback, useEffect, useState } from "react";
import type { Document } from "@/lib/types";
import { getDocuments, subscribe } from "@/lib/storage";

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDocuments = useCallback(async () => {
    try {
      const next = await getDocuments();
      setDocuments(next);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
    const unsubscribe = subscribe(() => {
      void loadDocuments();
    });
    return unsubscribe;
  }, [loadDocuments]);

  return { documents, loading, refreshDocuments: loadDocuments };
}
