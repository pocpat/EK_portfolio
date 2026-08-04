/**
 * Seed script — inserts PDF metadata into MongoDB Atlas (db: "portfolio", collection: "pdfs").
 *
 * The PDF files themselves are served as static assets from public/ (e.g. /AZ-FABRIC.pdf).
 * MongoDB only stores metadata: { title, file_url, category }.
 *
 * Usage:
 *   MONGODB_URI="mongodb+srv://..." node scripts/seed-pdfs.js
 *
 * The script is idempotent: it upserts by (title + category), so re-running won't
 * create duplicates. Existing records with the same title+category are updated.
 */

const { MongoClient } = require("mongodb");

// ── New Azure PDFs ──────────────────────────────────────────────────────────
const azurePdfs = [
  {
    title: "Cloud Network Security",
    file_url: "/AZ-Cloud_Network_Security.pdf",
    category: "Azure",
  },
  {
    title: "Create ML Pipeline",
    file_url: "/AZ-Create_ML_Pipeline.pdf",
    category: "Azure",
  },
  {
    title: "MS Fabric",
    file_url: "/AZ-FABRIC.pdf",
    category: "Azure",
  },
  {
    title: "Generative AI",
    file_url: "/AZ-Generative_AI.pdf",
    category: "Azure",
  },
  {
    title: "Hybrid Cloud Security",
    file_url: "/AZ-Hybrid_Cloud_Deployment_and_Security.pdf",
    category: "Azure",
  },
  {
    title: "ML & Cloud Resources",
    file_url: "/AZ-ML_Applications_Cloud_Resource_Allocation.pdf",
    category: "Azure",
  },
  {
    title: "MS Entra ID",
    file_url: "/AZ-MS_EntraID.pdf",
    category: "Azure",
  },
];

// ── Resume (CV) ────────────────────────────────────────────────────────────
// The button label is DB-driven — update the title here to change the live
// label instantly without redeploying. file_url points to the static PDF in public/.
const resumePdfs = [
  {
    title: "My Resume",
    file_url: "/ElenaKroupkin_CV_09-2026.pdf",
    category: "Resume",
  },
];

// ── New AWS PDFs ────────────────────────────────────────────────────────────
const awsPdfs = [
  {
    title: "S3 Multi-Part Upload",
    file_url: "/AWS-multi-part-upload.pdf",
    category: "AWS",
  },
  {
    title: "Network Security & Analysis",
    file_url: "/AWS-network_security_and_analysis.pdf",
    category: "AWS",
  },
  {
    title: "S3 MFA Delete",
    file_url: "/AWS-multi-part-upload-S3-MFA-Delete.pdf",
    category: "AWS",
  },
];

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("ERROR: Set MONGODB_URI env var first.");
    console.error("  MONGODB_URI=\"mongodb+srv://...\" node scripts/seed-pdfs.js");
    process.exit(1);
  }

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
  });

  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    const db = client.db("portfolio");
    const collection = db.collection("pdfs");

    // Ensure a unique index so upserts are reliable
    await collection.createIndex(
      { title: 1, category: 1 },
      { unique: true }
    );

    const allPdfs = [...azurePdfs, ...resumePdfs, ...awsPdfs];

    let inserted = 0;
    let updated = 0;

    for (const pdf of allPdfs) {
      const result = await collection.updateOne(
        { title: pdf.title, category: pdf.category },
        { $set: pdf },
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        console.log(`  [+] INSERTED: ${pdf.category} | ${pdf.title} → ${pdf.file_url}`);
        inserted++;
      } else if (result.modifiedCount > 0) {
        console.log(`  [~] UPDATED:  ${pdf.category} | ${pdf.title} → ${pdf.file_url}`);
        updated++;
      } else {
        console.log(`  [=] UNCHANGED: ${pdf.category} | ${pdf.title}`);
      }
    }

    console.log(`\nDone! Inserted: ${inserted}, Updated: ${updated}, Unchanged: ${allPdfs.length - inserted - updated}`);

    // Show current state of the collection
    const count = await collection.countDocuments();
    console.log(`Total documents in 'pdfs' collection: ${count}`);

    const byCategory = await collection.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]).toArray();
    console.log("By category:", byCategory.map(c => `${c._id}: ${c.count}`).join(", "));
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();