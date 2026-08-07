/**
 * Static PDF metadata — replaces MongoDB Atlas.
 * To add/remove/relabel a document, edit this file and push.
 * PDF files themselves live in public/ as static assets.
 */

const pdfs = [
  // ── AWS ──────────────────────────────────────────────────────────────────
  { title: "S3 Multi-Part Upload",        file_url: "/AWS-multi-part-upload.pdf",              category: "AWS" },
  { title: "Network Security & Analysis", file_url: "/AWS-network_security_and_analysis.pdf", category: "AWS" },
  { title: "S3 MFA Delete",               file_url: "/AWS-multi-part-upload-S3-MFA-Delete.pdf", category: "AWS" },
  { title: "Migration",                    file_url: "/ekawstechdoc.pdf",                        category: "AWS" },
  { title: "QuickSight",                   file_url: "/AmazonQuickSightProject.pdf",             category: "AWS" },
  { title: "ChatBot Part 1",               file_url: "/AmazonLexChatbotPart1.pdf",               category: "AWS" },
  { title: "ChatBot Part 2",               file_url: "/AmazonLexChatbotPart2.pdf",               category: "AWS" },
  { title: "Amazon IAM",                    file_url: "/awsIam.pdf",                             category: "AWS" },

  // ── Azure ───────────────────────────────────────────────────────────────
  { title: "Cloud Network Security",      file_url: "/AZ-Cloud_Network_Security.pdf",           category: "Azure" },
  { title: "Create ML Pipeline",           file_url: "/AZ-Create_ML_Pipeline.pdf",               category: "Azure" },
  { title: "MS Fabric",                    file_url: "/AZ-FABRIC.pdf",                           category: "Azure" },
  { title: "Generative AI",                file_url: "/AZ-Generative_AI.pdf",                    category: "Azure" },
  { title: "Hybrid Cloud Security",        file_url: "/AZ-Hybrid_Cloud_Deployment_and_Security.pdf", category: "Azure" },
  { title: "ML & Cloud Resources",         file_url: "/AZ-ML_Applications_Cloud_Resource_Allocation.pdf", category: "Azure" },
  { title: "MS Entra ID",                  file_url: "/AZ-MS_EntraID.pdf",                       category: "Azure" },

  // ── Resume ───────────────────────────────────────────────────────────────
  { title: "My Resume",                    file_url: "/ElenaKroupkin_CV_09-2026.pdf",           category: "Resume" },

  // ── Projects (cards) ────────────────────────────────────────────────────
  { title: "metroge_vert.pdf",             file_url: "/metroge_vert.pdf",                       category: "Project" },
  { title: "SimilarCarsFinder.pdf",        file_url: "/SimilarCarsFinder.pdf",                  category: "Project" },
];

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