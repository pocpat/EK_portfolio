const { MongoClient } = require("mongodb");

// Cache the connection to avoid cold start reconnections
let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return cachedDb;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not set");
  }

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  });

  await client.connect();
  cachedClient = client;
  cachedDb = client.db("portfolio");

  return cachedDb;
}

export default async function handler(req, res) {
  // Set CORS headers (same-origin in production, but allows local dev)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const db = await connectToDatabase();
    const collection = db.collection("pdfs");

    const { category, title, titles } = req.query;

    // Build the filter based on query params
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (title) {
      filter.title = title;
    }

    if (titles) {
      // titles is a comma-separated list
      const titleArray = titles.split(",").map((t) => t.trim());
      filter.title = { $in: titleArray };
    }

    const pdfs = await collection
      .find(filter)
      .sort({ title: 1 })
      .toArray();

    // Strip MongoDB _id before sending
    const cleanPdfs = pdfs.map(({ _id, ...rest }) => rest);

    return res.status(200).json(cleanPdfs);
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: "Failed to fetch PDFs" });
  }
}