import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Initialize Gemini AI lazily
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({ apiKey });
};

// AI Endpoint for LiveOps & GDD Generation
app.post('/api/ai/liveops', async (req, res) => {
  try {
    const { prompt, type, context } = req.body;
    const ai = getGeminiClient();

    let systemInstruction = `You are a Principal LiveOps Game Designer at Electronic Arts (EA). You specialize in Mobile Free-to-Play (F2P) games like Apex Legends Mobile, EA Sports FC Mobile, and Star Wars: Galaxy of Heroes.
Your goal is to provide professional, industry-standard LiveOps Event Concepts, Game Design Documents (GDD), Quest Narrative copy, and Monetization/Economy balance recommendations. Format your response cleanly using Markdown, bullet points, structured tables, and clear headings.`;

    if (type === 'gdd') {
      systemInstruction += ` Focus on creating an EA-quality LiveOps Event GDD containing:
1. Executive Event Summary & Core Fantasy
2. Target Player Archetypes (Bartle Taxonomy)
3. Event Mechanics & Progression Loops
4. Monetization Strategy & Offer Matrix
5. Live Service KPI Impact (D1/D7 Retention, ARPU, Conversion Rate).`;
    } else if (type === 'quests') {
      systemInstruction += ` Focus on generating 3-5 balanced Quest & Challenge proposals with title, objective, target player motivation (Achiever, Competitor, Explorer, Socializer), recommended reward values, and narrative hook.`;
    } else if (type === 'balance') {
      systemInstruction += ` Focus on analyzing game economy balance, stamina sinks, gacha probabilities, and inflation risks with actionable numerical suggestions.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `${systemInstruction}\n\nUser Request: ${prompt}\n\nCurrent Game Context:\n${JSON.stringify(
                context || {},
                null,
                2
              )}`,
            },
          ],
        },
      ],
    });

    res.json({ success: true, text: response.text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate LiveOps content.',
    });
  }
});

// Setup Vite or static serving based on environment
const PORT = process.env.PORT || 3000;

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`EA Mobile LiveOps Workbench server running on port ${PORT}`);
  });
}

startServer();
