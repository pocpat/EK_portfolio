// MongoDB data access layer for the portfolio app.
// Replaces supabaseClient.js — calls the Vercel serverless function at /api/pdfs
// which talks to MongoDB Atlas. No DB credentials in the browser.

const API_BASE = process.env.REACT_APP_API_BASE || "";

/**
 * Fetch PDFs by category from the /api/pdfs endpoint.
 * @param {string} category - e.g. "AWS", "Azure", "Resume", "Project"
 * @returns {Promise<Array>} array of { title, file_url, category }
 */
export async function fetchPdfsByCategory(category) {
  try {
    const response = await fetch(
      `${API_BASE}/api/pdfs?category=${encodeURIComponent(category)}`
    );
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching PDFs for category "${category}":`, error);
    throw error;
  }
}

/**
 * Fetch PDFs by a list of titles.
 * @param {string[]} titles - e.g. ["metroge_vert.pdf", "SimilarCarsFinder.pdf"]
 * @returns {Promise<Array>} array of { title, file_url, category }
 */
export async function fetchPdfsByTitles(titles) {
  try {
    const titlesParam = titles.join(",");
    const response = await fetch(
      `${API_BASE}/api/pdfs?titles=${encodeURIComponent(titlesParam)}`
    );
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching PDFs by titles:", error);
    throw error;
  }
}

/**
 * Fetch the latest resume PDF (category = "Resume").
 * @returns {Promise<Object|null>} the first matching PDF or null
 */
export async function fetchLatestResume() {
  try {
    const data = await fetchPdfsByCategory("Resume");
    // The /api/pdfs endpoint sorts by title ascending, so take the last one
    // (matching the old Supabase .order('title', { ascending: false }).limit(1) behavior)
    if (data && data.length > 0) {
      // Sort descending by title and take the first
      const sorted = [...data].sort((a, b) =>
        b.title.localeCompare(a.title)
      );
      return sorted[0];
    }
    return null;
  } catch (error) {
    console.error("Error fetching resume:", error);
    throw error;
  }
}