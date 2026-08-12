/**
 * Sync PDF metadata to MongoDB Atlas.
 *
 * Reads src/data/pdfs-metadata.json (single source of truth) and upserts
 * each entry into MongoDB with a constructed S3 URL.
 *
 * S3 bucket folder structure:
 *   aws/   — AWS PDFs
 *   azure/ — Azure PDFs
 *   cv/    — Resume PDFs
 *   apps/  — Project PDFs
 *
 * Usage: npm run sync:pdfs
 * Requires: MONGODB_URI in .env
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Configuration ───────────────────────────────────────────────────────────
const BUCKET_NAME = "ek-my-portfolio-pdf-docs-sydney";
const REGION = "ap-southeast-2";
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = "portfolio";
const COLLECTION_NAME = "documents";

// Map app categories to S3 folder names
const CATEGORY_TO_S3_FOLDER = {
  AWS: "aws",
  Azure: "azure",
  Resume: "cv",
  Project: "apps",
};

async function syncPdfsToMongoDB() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not set. Add it to .env");
    process.exit(1);
  }

  // Read metadata from JSON (single source of truth — same file the React app uses)
  const metadataPath = path.join(__dirname, "..", "src", "data", "pdfs-metadata.json");
  const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));

  console.log(`Found ${metadata.length} PDF entries in metadata.`);

  // Build documents with S3 URLs
  const documentsToInsert = metadata.map((p) => {
    const s3Folder = CATEGORY_TO_S3_FOLDER[p.category] || p.category.toLowerCase();
    const s3Url = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${s3Folder}/${encodeURIComponent(p.fileName)}`;
    return {
      title: p.title,
      category: p.category,
      fileName: p.fileName,
      pdfUrl: s3Url,
      createdAt: new Date(),
    };
  });

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas.");

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Bulk upsert by pdfUrl (avoids duplicates)
    const operations = documentsToInsert.map((doc) => ({
      updateOne: {
        filter: { pdfUrl: doc.pdfUrl },
        update: { $set: doc },
        upsert: true,
      },
    }));

    const result = await collection.bulkWrite(operations);
    console.log(
      `Sync complete! Matched: ${result.matchedCount}, Inserted: ${result.upsertedCount}, Modified: ${result.modifiedCount}`
    );

    // Show what was synced
    console.log("\nSynced documents:");
    documentsToInsert.forEach((doc) => {
      console.log(`  [${doc.category}] ${doc.title} → ${doc.pdfUrl}`);
    });
  } catch (error) {
    console.error("Error syncing to MongoDB:", error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

syncPdfsToMongoDB();