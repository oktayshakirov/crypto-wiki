import admin from "@lib/firebaseAdmin";
import { clientKey, isPublished, isRateLimited } from "@lib/viewsGuard";

function getViewKey(type, slug) {
  return `${type}_${slug}`;
}

export default async function handler(req, res) {
  const { type, slug } = req.query;

  if (!type || !slug) {
    return res.status(400).json({ error: "Type and slug are required" });
  }

  // Checked for reads too: an unknown key can only ever answer 0, so there is
  // no reason to spend a Firestore read finding that out.
  if (!isPublished(type, slug)) {
    return res.status(404).json({ error: "Unknown content" });
  }

  if (req.method === "POST" && isRateLimited(clientKey(req))) {
    return res.status(429).json({ error: "Too many requests" });
  }

  const viewKey = getViewKey(type, slug);
  const viewsRef = admin.firestore().collection("views").doc(viewKey);

  try {
    if (req.method === "GET") {
      const doc = await viewsRef.get();
      const count = doc.exists ? doc.data().count || 0 : 0;
      // Served from Vercel's edge cache rather than Firestore for a minute at a
      // time. Read volume here scales with traffic, and a view count that is up
      // to a minute stale is indistinguishable from a fresh one. Only the GET is
      // cached - the POST below must reach Firestore every time to increment.
      res.setHeader(
        "Cache-Control",
        "public, s-maxage=60, stale-while-revalidate=300"
      );
      return res.status(200).json({ views: count });
    } else if (req.method === "POST") {
      await viewsRef.set(
        {
          count: admin.firestore.FieldValue.increment(1),
          type,
          slug,
          lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      const doc = await viewsRef.get();
      const count = doc.data()?.count || 0;
      return res.status(200).json({ views: count });
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error with views API:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
