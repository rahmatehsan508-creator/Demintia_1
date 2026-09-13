import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini AI Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    appName: "Monorom",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    supportedLanguages: ["en", "as", "bn", "hi"],
    platform: "Monorom - Dementia Care & Cognitive Stimulation",
  });
});

// AI Companion Endpoint (Monorom / Saathi - Dementia Care Assistant)
app.post("/api/gemini/companion", async (req: Request, res: Response) => {
  try {
    const { prompt, patientName = "Shanti", language = "en" } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Please provide a valid question or message." });
    }

    const languageNames: Record<string, string> = {
      as: "Assamese (অসমীয়া)",
      bn: "Bengali (বাংলা)",
      hi: "Hindi (हिन्दी)",
      en: "English",
    };
    const targetLangName = languageNames[language] || "English";

    const ai = getGeminiClient();

    // Reassuring system instruction tailored for Dementia Care & Validation Therapy
    const systemInstruction = `
You are "Saathi" (Companion) in the Monorom dementia care platform, an exceptionally warm, gentle, empathetic, and respectful AI assistant designed specifically for elderly individuals living with mild-to-moderate dementia or Alzheimer's.

The senior you are speaking with is named ${patientName}.
Language requirement: You MUST respond in ${targetLangName}. Write naturally, respectfully, and gently in ${targetLangName}.

Context:
- Location / Regional flavor: North-East India (Assam, Meghalaya, etc. - tea gardens, morning mist, serene folk melodies, Brahmaputra river breeze).
- Current routine & safety: They are at home, safe, respected, and deeply loved by their family.

Strict Dementia Communication Rules:
1. Speak in short, simple, high-clarity sentences (maximum 2 to 3 sentences per response).
2. Use a reassuring, calm, unhurried, and loving tone. Never rush them.
3. Validation Therapy: NEVER argue, correct harshly, or say "You forgot". If they ask "Where is my mother?" or "Where am I?", gently validate their feelings first ("Your mother had such a warm heart," or "You are in your cozy home, completely safe, and everything is peaceful today.").
4. If they ask about routine or medicines, gently guide them to check their routine card or remind them warmly.
5. Offer gentle, positive cognitive prompts (e.g., matching flowers, listening to peaceful morning chimes).
6. Keep words easy to understand for elderly ears.
`;

    if (!ai) {
      // Localized fallback responses if API key is not configured
      const lower = prompt.toLowerCase();
      let fallbackText = `Hello ${patientName}. It is so nice to be with you today. You are safe, relaxed, and having a peaceful day. How can I help you right now?`;

      if (language === 'as') {
        fallbackText = `নমস্কাৰ ${patientName} বাইদেউ। আপুনি আপোনাৰ ঘৰতে সুৰক্ষিত আৰু শান্তিত আছে। আজি আপোনাৰ মনটো কেনে লাগিছে?`;
        if (lower.includes("ক\'ত") || lower.includes("ঘৰ") || lower.includes("where")) {
          fallbackText = `আপুনি আপোনাৰ নিজৰ মৰমৰ ঘৰতে আছে, ${patientName} বাইদেউ। সকলো ঠিকে আছে, পৰিয়ালে আপোনাক বহুত ভাল পায়।`;
        }
      } else if (language === 'bn') {
        fallbackText = `নমস্কার ${patientName}। আপনি নিজের ঘরে সম্পূর্ণ নিরাপদে আছেন। আপনার দিনটি সুন্দর ও শান্ত কাটুক। আমি আপনার সাথে আছি।`;
        if (lower.includes("কোথায়") || lower.includes("বাড়ি") || lower.includes("where")) {
          fallbackText = `আপনি আপনার প্রিয় ঘরেই আছেন, ${patientName}। সবকিছু শান্ত ও নিরাপদ, পরিবার আপনাকে ভীষণ ভালোবাসে।`;
        }
      } else if (language === 'hi') {
        fallbackText = `नमस्ते ${patientName} जी। आप अपने सुंदर घर में पूर्णतः सुरक्षित हैं। आज आपका मन कैसा है? मैं सदा आपके साथ हूँ।`;
        if (lower.includes("कहाँ") || lower.includes("घर") || lower.includes("where")) {
          fallbackText = `आप अपने घर में हैं, ${patientName} जी। सब कुछ बहुत शांत और सुरक्षित है, और परिवार आपसे बहुत प्यार करता है।`;
        }
      } else {
        if (lower.includes("where") || lower.includes("lost")) {
          fallbackText = `You are safe at home in your comfortable room, ${patientName}. Everything is well, and your family loves you very much.`;
        }
      }

      return res.json({ reply: fallbackText, isFallback: true });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.6,
        topP: 0.85,
      },
    });

    const reply = response.text || (
      language === 'as' ? `আপুনি সুৰক্ষিত আৰু কুশলে আছে, ${patientName} বাইদেউ। মই আপোনাৰ লগতেই আছোঁ।` :
      language === 'bn' ? `আপনি নিরাপদে আছেন, ${patientName}। আমি আপনার পাশেই আছি।` :
      language === 'hi' ? `आप सुरक्षित हैं, ${patientName} जी। मैं आपके साथ ही हूँ।` :
      `You are safe and well, ${patientName}. I am right here with you.`
    );

    return res.json({ reply, isFallback: false });
  } catch (error: any) {
    console.error("Gemini Companion Error:", error);
    const fallback = req.body.language === 'as' 
      ? "মই আপোনাৰ লগতেই আছোঁ। সকলো শান্ত আৰু সুৰক্ষিত। আপুনি মনৰ খেল বা নিয়ম চাব বিচাৰে নেকি?"
      : req.body.language === 'bn'
      ? "আমি আপনার পাশেই আছি। সবকিছু শান্ত ও নিরাপদ। আপনি কি কোনো খেলা খেলতে চান?"
      : req.body.language === 'hi'
      ? "मैं आपके साथ हूँ। सब कुछ शांत और सुरक्षित है। क्या आप कोई दिमागी खेल खेलना चाहेंगे?"
      : "I am here with you. Everything is calm and safe. Would you like to check your daily routine or play a calming card game?";
    return res.json({ reply: fallback, isFallback: true });
  }
});

// Voice Intent Recognition Endpoint
app.post("/api/gemini/voice-intent", async (req: Request, res: Response) => {
  try {
    const { spokenText, language = "en" } = req.body;
    if (!spokenText || typeof spokenText !== "string") {
      return res.status(400).json({ error: "Missing spokenText" });
    }

    const text = spokenText.toLowerCase();

    // Fast deterministic rule check for high-confidence multilingual elderly navigation commands
    if (
      text.includes("game") || text.includes("play") || text.includes("puzzle") || text.includes("card") ||
      text.includes("খেল") || text.includes("গেম") || text.includes("খেলা") ||
      text.includes("खेल") || text.includes("पहेली")
    ) {
      const reply = language === 'as' ? "মগজুৰ খেলবোৰ খোলি দিয়া হৈছে।" :
                    language === 'bn' ? "ব্রেন গেমের পাতা খোলা হচ্ছে।" :
                    language === 'hi' ? "दिमागी खेल खोले जा रहे हैं।" :
                    "Opening Brain Games for you. Let's play and stimulate your mind!";
      return res.json({ route: "games", action: "navigate_games", spokenReply: reply });
    }

    if (
      text.includes("routine") || text.includes("schedule") || text.includes("medicine") || text.includes("pill") || text.includes("today") ||
      text.includes("নিয়ম") || text.includes("ঔষধ") || text.includes("দৰব") || text.includes("ৰুটিন") ||
      text.includes("রুটিন") || text.includes("ওষুধ") ||
      text.includes("दिनचर्या") || text.includes("दवा") || text.includes("दवाई")
    ) {
      const reply = language === 'as' ? "আপোনাৰ আজিৰ দৈনন্দিন নিয়ম আৰু ঔষধ ইয়াত আছে।" :
                    language === 'bn' ? "আপনার দৈনিক রুটিন ও ওষুধের সূচি এখানে রয়েছে।" :
                    language === 'hi' ? "आपकी दैनिक दिनचर्या और दवाइयां यहां उपस्थित हैं।" :
                    "Here is your Daily Routine and medicines for today.";
      return res.json({ route: "routine", action: "navigate_routine", spokenReply: reply });
    }

    if (
      text.includes("memory") || text.includes("family") || text.includes("photo") || text.includes("book") || text.includes("daughter") || text.includes("son") ||
      text.includes("স্মৃতি") || text.includes("পৰিয়াল") || text.includes("ফটো") || text.includes("ছবি") || text.includes("জীয়াৰী") ||
      text.includes("পরিবার") || text.includes("মেয়ে") ||
      text.includes("परिवार") || text.includes("याद") || text.includes("फोटो") || text.includes("बेटी")
    ) {
      const reply = language === 'as' ? "আপোনাৰ মৰমৰ পৰিয়ালৰ স্মৃতি পুথি খোলা হৈছে।" :
                    language === 'bn' ? "আপনার প্রিয় পরিবারের স্মৃতির অ্যালবাম খোলা হচ্ছে।" :
                    language === 'hi' ? "आपकी पारिवारिक स्मृति पुस्तक खोली जा रही है।" :
                    "Opening your Memory Book with photos of your loved ones.";
      return res.json({ route: "memory-book", action: "navigate_memory_book", spokenReply: reply });
    }

    if (
      text.includes("help") || text.includes("emergency") || text.includes("doctor") || text.includes("call") || text.includes("sos") ||
      text.includes("সহায়") || text.includes("জৰুৰী") || text.includes("ডাক্তৰ") ||
      text.includes("সাহায্য") || text.includes("জরুরি") || text.includes("ডাক্তার") ||
      text.includes("मदद") || text.includes("आपातकालीन") || text.includes("डॉक्टर")
    ) {
      const reply = language === 'as' ? "জৰুৰীকালীন যোগাযোগ আৰু সহায় খোলা হৈছে।" :
                    language === 'bn' ? "জরুরি সহায়তা এবং যোগাযোগের তালিকা খোলা হচ্ছে।" :
                    language === 'hi' ? "आपातकालीन संपर्क सूची तुरंत खोली जा रही है।" :
                    "Opening Emergency and Caregiver contacts for you immediately.";
      return res.json({ route: "emergency", action: "open_emergency", spokenReply: reply });
    }

    if (
      text.includes("talk") || text.includes("chat") || text.includes("companion") || text.includes("saathi") || text.includes("friend") ||
      text.includes("কথা") || text.includes("সংগী") || text.includes("বন্ধু") ||
      text.includes("সঙ্গী") ||
      text.includes("साथी") || text.includes("बात") || text.includes("दोस्त")
    ) {
      const reply = language === 'as' ? "মই আপোনাৰ লগত কথা পাতিবলৈ সাজু আছোঁ।" :
                    language === 'bn' ? "আমি আপনার সাথে কথা বলতে প্রস্তুত।" :
                    language === 'hi' ? "मैं आपसे बात करने के लिए उपस्थित हूँ।" :
                    "I am right here to listen and talk with you.";
      return res.json({ route: "companion", action: "navigate_companion", spokenReply: reply });
    }

    // Use Gemini for contextual understanding if needed
    const ai = getGeminiClient();
    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Spoken command by elderly patient: "${spokenText}".
Language to respond in: ${language} (English, Assamese, Bengali, or Hindi).
Classify which main screen they want:
- "routine" (daily schedule, medicines, time, food)
- "games" (cognitive games, memory pairs, sequence puzzle, sound game)
- "memory-book" (family photos, reminiscence, daughter, home)
- "companion" (asking a question, wishing to chat, reminiscing)
- "emergency" (help, unwell, urgent doctor)

Respond ONLY with valid JSON:
{
  "route": "routine" | "games" | "memory-book" | "companion" | "emergency",
  "spokenReply": "A short, warm 1-sentence response in the requested language explaining what we are opening"
}`,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      try {
        const parsed = JSON.parse(response.text || "{}");
        if (parsed.route) {
          return res.json(parsed);
        }
      } catch {
        // fall back below
      }
    }

    return res.json({
      route: "routine",
      action: "navigate_routine",
      spokenReply: language === 'as' ? "আপোনাক নিয়ম সূচীলৈ লৈ যোৱা হ'ল।" : language === 'bn' ? "আপনাকে রুটিনের পাতায় নিয়ে যাওয়া হলো।" : language === 'hi' ? "आपको दिनचर्या पृष्ठ पर ले जाया गया।" : "Here is your routine for today.",
    });
  } catch (error: any) {
    console.error("Gemini Voice Intent Error:", error);
    return res.json({
      route: "routine",
      action: "navigate_routine",
      spokenReply: "Here is your schedule for today.",
    });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Monorom Server running on http://localhost:${PORT}`);
  });
}

startServer();
