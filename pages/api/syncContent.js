const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const admin = require("firebase-admin");

if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (
    !process.env.FIREBASE_PROJECT_ID ||
    !process.env.FIREBASE_CLIENT_EMAIL ||
    !privateKey
  ) {
    throw new Error(
      "Missing Firebase credentials. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY environment variables."
    );
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
}

// Only content published within this window is eligible for a push
// notification. Backdating a post past this window publishes it silently.
const NOTIFY_WINDOW_MS = 48 * 60 * 60 * 1000;

function parsePublishedAt(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

async function processFiles(directory, type) {
  if (!fs.existsSync(directory)) {
    console.warn(`Skipping missing directory ${directory}`);
    return;
  }

  const collection = admin.firestore().collection(type);

  // One read of the collection tells us which slugs already exist. Anything
  // already present is updated in place, which never fires onDocumentCreated
  // and therefore never notifies - that is what makes retitling safe.
  const existing = new Set();
  const snapshot = await collection.get();
  snapshot.forEach((doc) => existing.add(doc.id));

  const files = fs
    .readdirSync(directory)
    .filter((file) => /\.mdx?$/.test(file))
    // Section index files such as _index.mdx are not real content.
    .filter((file) => !file.startsWith("_"));

  for (const file of files) {
    const { data } = matter(fs.readFileSync(path.join(directory, file), "utf8"));

    if (!data || !data.title) {
      console.warn(`No title found in ${file}`);
      continue;
    }

    if (data.draft === true) {
      console.log(`Skipping draft "${file}"`);
      continue;
    }

    // contentParser lets frontmatter override the URL, so mirror that here.
    const slug = data.url
      ? data.url.replace(/^\//, "")
      : file.replace(/\.mdx?$/, "");
    const publishedAt = parsePublishedAt(data.date);
    const isNew = !existing.has(slug);
    const isRecent =
      publishedAt !== null &&
      Date.now() - publishedAt.getTime() <= NOTIFY_WINDOW_MS;

    const payload = {
      title: data.title,
      slug,
      syncedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (publishedAt) {
      payload.publishedAt = admin.firestore.Timestamp.fromDate(publishedAt);
    }

    // notify is only ever set on creation. Updating an existing document
    // leaves the flag untouched so a resync cannot re-notify.
    if (isNew) {
      payload.notify = isRecent;
    }

    try {
      await collection.doc(slug).set(payload, { merge: true });

      if (isNew) {
        console.log(
          isRecent
            ? `Added "${slug}" (will notify)`
            : `Added "${slug}" (silent - published ${data.date || "unknown"})`
        );
      } else {
        console.log(`Updated "${slug}"`);
      }
    } catch (error) {
      console.error(`Error syncing "${slug}":`, error.message);
    }
  }
}

async function run() {
  await processFiles(path.join(__dirname, "../../content/posts"), "posts");
  await processFiles(
    path.join(__dirname, "../../content/exchanges"),
    "exchanges"
  );
  await processFiles(
    path.join(__dirname, "../../content/crypto-ogs"),
    "crypto-ogs"
  );
}

if (require.main === module) {
  run().catch((error) => {
    console.error("Error processing content:", error);
    process.exitCode = 1;
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await run();
    return res.status(200).json({ message: "Content sync completed" });
  } catch (error) {
    console.error("Error processing content:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
};
