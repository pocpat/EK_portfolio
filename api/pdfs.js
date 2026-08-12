/**
 * Vercel serverless function — returns PDF document metadata from MongoDB.
 * Route: GET /api/pdfs
 *
 * Returns an array of { title, category, fileName, pdfUrl, createdAt }.
 * If MongoDB is unreachable, returns 500 (the React app falls back to static data).
 */
let cachedClient = null;

async function getClient(uri) {
  if (cachedClient) return cachedClient;
  const { MongoClient } = await import("mongodb");
  cachedClient = new MongoClient(uri);
  await cachedClient.connect();
  return cachedClient;
}

module.exports = async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    return res.status(500).json({ error: "MONGODB_URI is not configured" });
  }

  try {
    const client = await getClient(MONGODB_URI);
    const db = client.db("portfolio");
    const documents = await db
      .collection("documents")
      .find({}, { projection: { _id: 0 } })
      .toArray();

    return res.status(200).json(documents);
  } catch (error) {
    console.error("API /api/pdfs error:", error.message);
    return res.status(500).json({ error: "Failed to fetch documents" });
  }
};