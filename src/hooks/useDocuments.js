import { useState, useEffect } from "react";
import { pdfs as STATIC_PDFS } from "../data/pdfs";

// Module-level cache so multiple components share one fetch
let cache = null;

/**
 * Fetch PDF document metadata from the serverless API (/api/pdfs).
 * Falls back to static data from src/data/pdfs.js if the API is unreachable
 * or returns an empty array.
 *
 * Returns { documents, loading } where documents is an array of
 * { title, category, fileName, pdfUrl }.
 */
export function useDocuments() {
  const [documents, setDocuments] = useState(cache || STATIC_PDFS);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    let cancelled = false;

    if (cache) {
      setDocuments(cache);
      setLoading(false);
      return;
    }

    fetch("/api/pdfs")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data) && data.length > 0) {
          cache = data;
          setDocuments(data);
        }
        // If data is empty or invalid, keep static fallback
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        // Network error / API not available — keep static fallback
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { documents, loading };
}