const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
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

const cachePath = path.join(__dirname, "cache.json");
let cache = {
  posts: [],
  exchanges: [],
  cryptoOgs: [],
};

if (fs.existsSync(cachePath)) {
  try {
    const raw = fs.readFileSync(cachePath, "utf8");
    cache = JSON.parse(raw);
  } catch (error) {
    console.error("Error reading cache file:", error);
  }
}

async function sendPushNotification(title, type, content) {
  try {
    const notificationRef = admin.firestore().collection("notifications");
    await notificationRef.add({
      title,
      type,
      content: content.substring(0, 200) + "...",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      read: false,
    });
    console.log(`Notification created for ${type}: ${title}`);
  } catch (error) {
    console.error(`Error creating notification for ${title}:`, error);
  }
}

async function processFiles(directory, type) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    if (!file.endsWith(".mdx")) continue;

    const filePath = path.join(directory, file);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContent);

    if (data && data.title) {
      if (cache[type].includes(data.title)) {
        console.log(`Skipping already processed "${data.title}"`);
        continue;
      }

      try {
        await admin.firestore().collection(type).doc(data.title).set({
          title: data.title,
          content: content,
          metadata: data,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        await sendPushNotification(data.title, type, content);

        console.log(`Successfully added "${data.title}"`);
        cache[type].push(data.title);
      } catch (error) {
        console.error(`Error adding "${data.title}":`, error.message);
      }
    } else {
      console.warn(`No title found in ${file}`);
    }
  }
}

async function run() {
  try {
    await processFiles(path.join(__dirname, "../../content/posts"), "posts");
    await processFiles(
      path.join(__dirname, "../../content/exchanges"),
      "exchanges"
    );
    await processFiles(
      path.join(__dirname, "../../content/crypto-ogs"),
      "cryptoOgs"
    );

    fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2), "utf8");
    console.log("Content sync completed successfully");
  } catch (error) {
    console.error("Error processing content:", error);
  }
}

module.exports = run;
