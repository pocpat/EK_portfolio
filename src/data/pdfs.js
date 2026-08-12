/**
 * Static PDF metadata — fallback when MongoDB is unreachable.
 * Source of truth: src/data/pdfs-metadata.json
 * To add/remove/relabel a document, edit the JSON then run `npm run sync:pdfs`.
 * PDF files live in public/ (local fallback) and in S3 (production).
 */
import metadata from "./pdfs-metadata.json";

export const pdfs = metadata.map((p) => ({
  title: p.title,
  category: p.category,
  fileName: p.fileName,
  pdfUrl: `/${p.fileName}`, // local path for static fallback
}));

/** Return PDFs for a given category, sorted by title ascending. */
export function getPdfsByCategory(category) {
  return pdfs
    .filter((p) => p.category === category)
    .sort((a, b) => a.title.localeCompare(b.title));
}

/** Return PDFs matching a list of titles. */
export function getPdfsByTitles(titles) {
  return pdfs.filter((p) => titles.includes(p.title));
}

/** Return the latest resume PDF (category = "Resume"). */
export function getLatestResume() {
  const resumes = pdfs.filter((p) => p.category === "Resume");
  if (resumes.length === 0) return null;
  return [...resumes].sort((a, b) => b.title.localeCompare(a.title))[0];
}