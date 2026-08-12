/**
 * Static PDF metadata — fallback when MongoDB is unreachable.
 * Source of truth: src/data/pdfs-metadata.json
 * To add/remove/relabel a document, edit the JSON then run `npm run sync:pdfs`.
 * PDF files live in public/ (local fallback) and in S3 (production).
 */
import metadata from "./pdfs-metadata.json";

// S3 folder mapping (must match scripts/sync-pdfs.mjs)
const CATEGORY_TO_S3_FOLDER = {
  AWS: "aws",
  Azure: "az",
  Resume: "CV",
  Project: "apps",
};

const BUCKET_NAME = "ek-my-portfolio-pdf-docs-sydney";
const REGION = "ap-southeast-2";

export const pdfs = metadata.map((p) => {
  const s3Folder = CATEGORY_TO_S3_FOLDER[p.category] || p.category.toLowerCase();
  const s3Url = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${s3Folder}/${encodeURIComponent(p.fileName)}`;
  return {
    title: p.title,
    category: p.category,
    fileName: p.fileName,
    file_url: s3Url,
  };
});

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