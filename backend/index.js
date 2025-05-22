import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config();

const app = express();
app.use(cors({ origin: 'https://ai-recommendation-app.vercel.app' }));
app.use(express.json());

// Point OpenAI SDK to Groq's endpoint
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1', // Important!
});

app.post('/recommendations', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const chatResponse = await openai.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant that recommends movies or shows based on the user's description.
Always respond with two sections: "Movies" and "TV Series". 
Each section should be a numbered list in this format:
1. **Title** (Year): Description

For example:
Movies:
1. **Inception** (2010): A mind-bending thriller about dreams within dreams.
2. **The Dark Knight** (2008): Batman faces the Joker in this gritty crime drama.

TV Series:
1. **Breaking Bad** (2008-2013): A chemistry teacher turns to making meth.
2. **Stranger Things** (2016-present): Kids in a small town encounter supernatural forces.

If you have no recommendations for a section, just write "None."`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const reply = chatResponse.choices[0].message.content;
    console.log('🤖 Raw AI reply:\n', reply);

    // --- Improved Parser function ---
    const parseRecommendations = (text) => {
      const movies = [];
      const shows = [];

      // Matches lines like: 1. **Title** (Year): Description
      // or: 1. **Title** (StartYear-EndYear): Description
      // or: 1. **Title** (StartYear-present): Description
      const recRegex = /^(\d+\.|\*)\s*\*\*(.+?)\*\*\s*\(([^)]+)\)\s*[:-]\s*(.+)$/gm;
      let match;
      while ((match = recRegex.exec(text)) !== null) {
        const title = match[2].trim();
        const yearOrRange = match[3].trim();
        const description = match[4].trim();

        // If yearOrRange matches a single 4-digit year, it's a movie
        // If it matches a range (e.g. 2008-2013) or ends with 'present', it's a TV series
        if (/^\d{4}$/.test(yearOrRange)) {
          movies.push({ title, year: yearOrRange, description });
        } else if (/^\d{4}-(\d{4}|present)$/i.test(yearOrRange)) {
          shows.push({ title, year: yearOrRange, description });
        } else {
          // fallback: if not matching either, you can decide where to put it or skip
          movies.push({ title, year: yearOrRange, description });
        }
      }

      return { movies, shows };
    };

    const structured = parseRecommendations(reply);
    res.json({ raw: reply, ...structured });

  } catch (error) {
    console.error('🔥 ERROR:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
