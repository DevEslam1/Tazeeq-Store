import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { GoogleGenerativeAI } from "@google/generative-ai";

admin.initializeApp();

/**
 * Gemini Proxy Function
 * Handles AI chat requests from the mobile app.
 * Grounds responses in the current Tazeeq catalog context.
 */
export const geminiChat = functions.https.onCall(async (data: any, context: any) => {
  // 1. Verify Authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Only registered users can chat with the assistant."
    );
  }

  const { message, history = [] } = data;
  
  // 2. Get API Key from environment (to be set via Firebase Secrets)
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new functions.https.HttpsError(
      "internal",
      "Gemini API is not configured on the server."
    );
  }

  try {
    // 3. Fetch Catalog Context for Grounding
    const productsSnapshot = await admin.firestore().collection("products").limit(20).get();
    const products = productsSnapshot.docs.map((doc: any) => {
      const d = doc.data();
      return `- ${d.name}: ${d.price} SAR (${d.description || ""})`;
    });

    const categoriesSnapshot = await admin.firestore().collection("categories").get();
    const categories = categoriesSnapshot.docs.map((doc: any) => doc.data().name);

    // 4. Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const model = genAI.getGenerativeModel({ model: modelName });

    const systemInstruction = `
      You are the Tazeeq AI Shopping Assistant.
      Your goal is to help users shop for fresh groceries in Saudi Arabia.
      
      TONE: Premium, helpful, and concise.
      LANGUAGE: Respond in the same language as the user (Arabic or English).
      
      CATALOG CONTEXT:
      - Categories: ${categories.join(", ")}
      - Featured Products:
      ${products.join("\n")}
      
      RULES:
      1. Only suggest products that are likely in our catalog.
      2. If a user asks for a recipe, suggest ingredients we sell.
      3. If you don't know if we have a product, say "Let me check our current stock" and suggest a related category.
      4. Do not mention other stores.
    `;

    // 5. Run Chat
    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: "Initialize as Tazeeq Assistant" }] },
        { role: "model", parts: [{ text: systemInstruction }] },
        ...history.map((h: any) => ({
          role: h.role === "assistant" ? "model" : "user",
          parts: [{ text: h.content }]
        }))
      ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return {
      text,
      model: modelName,
      timestamp: new Date().toISOString()
    };
  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to get response from AI assistant."
    );
  }
});
