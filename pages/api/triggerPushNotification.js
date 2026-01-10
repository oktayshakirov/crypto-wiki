import admin from "@lib/firebaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { type, title, content } = req.body;

  if (!type || !title) {
    return res.status(400).json({ error: "Missing type or title" });
  }

  if (!["posts", "exchanges", "cryptoOgs"].includes(type)) {
    return res.status(400).json({
      error: "Invalid type. Must be 'posts', 'exchanges', or 'cryptoOgs'.",
    });
  }

  try {
    await admin
      .firestore()
      .collection(type)
      .doc(title)
      .set({
        title,
        content: content || "",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    const notificationRef = admin.firestore().collection("notifications");
    await notificationRef.add({
      title,
      type,
      content: content ? content.substring(0, 200) + "..." : "",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      read: false,
    });

    return res
      .status(200)
      .json({ message: "Content and notification added successfully" });
  } catch (error) {
    console.error("Error adding content:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
