// Emits json/views.json: a snapshot of the Firestore view counts, taken once
// per build.
//
// The popularity ordering has to come from somewhere, and reading it per
// request would cost one Firestore read per item per visitor - a bill that
// grows with traffic. Reading the whole collection once per build costs a
// couple of hundred reads no matter how busy the site gets, and a ranking that
// refreshes on deploy is plenty for "most viewed".
//
// A missing or unreachable Firestore is not a build failure: the site falls
// back to an empty snapshot and the popular listings simply order by date.
const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");

const root = path.join(__dirname, "..");
const outputPath = path.join(root, "json/views.json");

// Runs outside Next, which is what normally loads .env, so pull the same files
// in by hand. On CI the variables are already in the environment and this is a
// no-op.
require("@next/env").loadEnvConfig(root, /* dev */ false, {
  info: () => {},
  error: console.error,
});

function credentialsPresent() {
  return !!(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  );
}

function write(counts, note) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(
    outputPath,
    `${JSON.stringify({ version: 1, generatedAt: new Date().toISOString(), counts }, null, 2)}\n`
  );
  console.log(
    `Wrote ${Object.keys(counts).length} view counts to json/views.json${note ? ` (${note})` : ""}`
  );
}

// Blanking a good snapshot because this one build could not reach Firestore
// would silently drop every listing back to date order. Keeping the committed
// copy degrades to "slightly stale" instead of "gone".
function keepExistingOrWriteEmpty(reason) {
  if (fs.existsSync(outputPath)) {
    console.warn(`Keeping the existing json/views.json (${reason})`);
    return;
  }
  write({}, `${reason}, popularity falls back to date order`);
}

async function main() {
  if (!credentialsPresent()) {
    keepExistingOrWriteEmpty("no Firebase credentials");
    return;
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    });
  }

  const snapshot = await admin.firestore().collection("views").get();
  const counts = {};

  snapshot.forEach((doc) => {
    const data = doc.data() || {};
    const count = typeof data.count === "number" ? data.count : 0;
    // Doc ids are `${type}_${slug}`; the stored fields are more reliable than
    // splitting the id, since slugs themselves contain underscores rarely but
    // legally.
    const type = data.type;
    const slug = data.slug;
    if (!type || !slug) return;
    counts[`${type}/${slug}`] = count;
  });

  write(counts);
}

main().catch((error) => {
  console.warn(`Could not read view counts: ${error.message}`);
  keepExistingOrWriteEmpty("Firestore unavailable");
});
