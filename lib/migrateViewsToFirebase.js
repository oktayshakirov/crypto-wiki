const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

const viewsFilePath = path.join(process.cwd(), "data", "views.json");

async function migrateViews() {
  if (!fs.existsSync(viewsFilePath)) {
    console.log("No views.json file found. Nothing to migrate.");
    return;
  }

  const viewsData = JSON.parse(fs.readFileSync(viewsFilePath, "utf8"));
  const viewsRef = admin.firestore().collection("views");

  console.log(`Migrating ${Object.keys(viewsData).length} view counts to Firebase...`);

  let migrated = 0;
  let errors = 0;

  for (const [key, count] of Object.entries(viewsData)) {
    try {
      const [type, slug] = key.split("/");
      const viewKey = `${type}_${slug}`;

      await viewsRef.doc(viewKey).set(
        {
          count: count,
          type: type,
          slug: slug,
          migratedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      migrated++;
      console.log(`✓ Migrated: ${key} -> ${count} views`);
    } catch (error) {
      errors++;
      console.error(`✗ Error migrating ${key}:`, error.message);
    }
  }

  console.log(`\nMigration complete!`);
  console.log(`Migrated: ${migrated}`);
  console.log(`Errors: ${errors}`);
}

if (require.main === module) {
  migrateViews()
    .then(() => {
      console.log("Done!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Migration failed:", error);
      process.exit(1);
    });
}

module.exports = migrateViews;
